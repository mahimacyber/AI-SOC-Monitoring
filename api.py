
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ml_detector import predict_login_activity
import sqlite3
from pathlib import Path
from auth import router as auth_router, get_current_user
from fastapi import Depends

app = FastAPI()
app.include_router(auth_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=False,
    allow_methods=["GET", "PATCH", "POST"],
    allow_headers=["*"],
)


DB_PATH = Path(__file__).resolve().parent / "soc_alerts.db"

@app.get("/")
def home():
    return {"message": "AI SOC Monitoring API is running"}



@app.get("/alerts", dependencies=[Depends(get_current_user)])
def get_alerts():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row

    try:
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM alerts")
        alerts = cursor.fetchall()

        return [dict(alert) for alert in alerts]
    finally:
        connection.close()



from pydantic import BaseModel
from fastapi import HTTPException

class StatusUpdate(BaseModel):
    status: str

@app.patch("/alerts/{alert_id}/status", dependencies=[Depends(get_current_user)])
def update_alert_status(alert_id: int, update: StatusUpdate):
    allowed_statuses = ["New", "Investigating", "Resolved"]

    if update.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid alert status"
        )

    connection = sqlite3.connect(DB_PATH)

    try:
        cursor = connection.cursor()

        cursor.execute(
            "UPDATE alerts SET status = ? WHERE id = ?",
            (update.status, alert_id)
        )

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Alert not found"
            )

        connection.commit()

        return {
            "message": "Alert status updated",
            "alert_id": alert_id,
            "status": update.status
        }
    finally:
        connection.close()

        
class LoginActivity(BaseModel):
    failed_logins: int
    successful_logins: int
    unique_users: int


@app.post("/predict")
def predict_activity(activity: LoginActivity):
    result = predict_login_activity(
        activity.failed_logins,
        activity.successful_logins,
        activity.unique_users
    )

    return {
        "prediction": result,
        "message": "ML prediction completed successfully"
    }



class MLAlertRequest(LoginActivity):
    username: str
    source_ip: str


@app.post("/predict-and-save", dependencies=[Depends(get_current_user)])
def predict_and_save(activity: MLAlertRequest):
    from datetime import datetime, timezone

    result = predict_login_activity(
        activity.failed_logins,
        activity.successful_logins,
        activity.unique_users
    )

    if result == "NORMAL":
        return {
            "prediction": result,
            "saved": False
        }

    connection = sqlite3.connect(DB_PATH)

    try:
        cursor = connection.cursor()

        # Check for duplicate ML alerts in last 5 minutes
        cursor.execute("""
            SELECT id FROM alerts
            WHERE alert_type = ?
            AND username = ?
            AND source_ip = ?
            AND julianday(timestamp) >= julianday('now', '-5 minutes')
            ORDER BY id DESC
            LIMIT 1
        """, (
            "ML Detected Anomaly (Demo)",
            activity.username,
            activity.source_ip
        ))

        existing_alert = cursor.fetchone()

        if existing_alert:
            return {
                "prediction": result,
                "saved": False,
                "duplicate": True,
                "alert_id": existing_alert[0],
                "message": "Similar alert already saved in last 5 minutes"
            }

        cursor.execute("""
            INSERT INTO alerts
            (alert_type, severity, username,
             source_ip, timestamp, status)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            "ML Detected Anomaly (Demo)",
            "MEDIUM",
            activity.username,
            activity.source_ip,
            datetime.now(timezone.utc).isoformat(),
            "New"
        ))

        connection.commit()

        return {
            "prediction": result,
            "saved": True,
            "alert_id": cursor.lastrowid
        }

    finally:
        connection.close()
