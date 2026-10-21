
import sqlite3
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pwdlib import PasswordHash

import os
from datetime import datetime, timedelta, timezone

import jwt
from dotenv import load_dotenv

from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


router = APIRouter(prefix="/auth", tags=["Authentication"])

DB_PATH = Path(__file__).resolve().parent / "soc_alerts.db"

password_hasher = PasswordHash.recommended()

load_dotenv(Path(__file__).resolve().parent / ".env")

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

if not JWT_SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY is missing from .env")


class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str


@router.post("/register", status_code=201)
def register_user(user: RegisterRequest):

    name = user.full_name.strip()
    email = user.email.strip().lower()

    if not name:
        raise HTTPException(
            status_code=400,
            detail="Full name is required."
        )

    if email.count("@") != 1:
        raise HTTPException(
            status_code=400,
            detail="Enter a valid email address."
        )

    if len(user.password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters."
        )

    hashed_password = password_hasher.hash(user.password)

    connection = sqlite3.connect(DB_PATH)

    try:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)

        cursor = connection.execute(
            """
            INSERT INTO users (full_name, email, password_hash)
            VALUES (?, ?, ?)
            """,
            (name, email, hashed_password)
        )

        connection.commit()

        return {
            "message": "Account created successfully. Please sign in.",
            "user_id": cursor.lastrowid
        }

    except sqlite3.IntegrityError:
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists."
        )

    finally:
        connection.close()

class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/login")
def login_user(user: LoginRequest):

    email = user.email.strip().lower()

    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row

    try:
        cursor = connection.execute(
            """
            SELECT id, full_name, email, password_hash
            FROM users
            WHERE email = ?
            """,
            (email,)
        )

        account = cursor.fetchone()

    finally:
        connection.close()

    if account is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    if not password_hasher.verify(
        user.password,
        account["password_hash"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

 
    access_token = jwt.encode(
        {
            "sub": str(account["id"]),
            "exp": datetime.now(timezone.utc) + timedelta(minutes=60)
        },
        JWT_SECRET_KEY,
        algorithm="HS256"
    )

    return {
        "message": "Login successful.",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": account["id"],
            "full_name": account["full_name"],
            "email": account["email"]
        }
    }

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme)
):
    if credentials is None:
        raise HTTPException(
            status_code=401,
            detail="Please sign in first."
        )

    try:
        payload = jwt.decode(
            credentials.credentials,
            JWT_SECRET_KEY,
            algorithms=["HS256"]
        )

        user_id = int(payload["sub"])

    except (jwt.InvalidTokenError, KeyError, ValueError, TypeError):
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token."
        )

    connection = sqlite3.connect(DB_PATH)

    try:
        account = connection.execute(
            "SELECT id, full_name, email FROM users WHERE id = ?",
            (user_id,)
        ).fetchone()

    finally:
        connection.close()

    if account is None:
        raise HTTPException(
            status_code=401,
            detail="User account not found."
        )

    return {
        "id": account[0],
        "full_name": account[1],
        "email": account[2]
    }

