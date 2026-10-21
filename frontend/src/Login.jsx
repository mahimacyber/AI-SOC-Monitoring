
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Login() {
    const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
const [isSignUp, setIsSignUp] = useState(false);
const [fullName, setFullName] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");



const handleSubmit = async (e) => {
  e.preventDefault();

  if (isSignUp) {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    
try {
  setMessage("Creating account...");

  const response = await fetch(
    "http://127.0.0.1:8000/auth/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        full_name: fullName,
        email: email,
        password: password
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    setMessage(data.detail || "Account creation failed.");
    return;
  }

  setIsSignUp(false);
  setPassword("");
  setConfirmPassword("");
  setMessage("Account created! Please sign in.");

} catch (error) {
  setMessage("Cannot connect to backend server.");
}

return;

  }

  try {
    setMessage("Signing in...");

    const response = await fetch(
      "http://127.0.0.1:8000/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.detail || "Sign In failed.");
      return;
    }

    sessionStorage.setItem(
      "soc_access_token",
      data.access_token
    );

    setMessage("Sign In successful!");

    
window.location.assign("/dashboard");
  } catch (error) {
    setMessage("Cannot connect to backend server.");
  }
};



  const inputStyle = {
    width: "100%",
    padding: "14px",
    background: "#0b172a",
    border: "1px solid #334155",
    borderRadius: "10px",
    color: "white",
    fontSize: "15px",
    boxSizing: "border-box"
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at top left, #123c55, #071020 60%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "25px",
      color: "white"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "470px",
        background: "rgba(15, 23, 42, 0.95)",
        padding: "38px",
        borderRadius: "22px",
        border: "1px solid rgba(34, 211, 238, 0.35)",
        boxShadow: "0 0 40px rgba(34, 211, 238, 0.12)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ fontSize: "44px" }}>🛡️</div>

          <h1 style={{
            color: "#67e8f9",
            fontSize: "26px",
            marginTop: "12px"
          }}>
            SOC COMMAND CENTER
          </h1>

          <p style={{
            color: "#94a3b8",
            marginTop: "10px"
          }}>
            Security Operations Platform
          </p>
        </div>

        <h2 style={{ marginBottom: "8px" }}>
          Welcome Back
        </h2>

        <p style={{
          color: "#94a3b8",
          marginBottom: "25px"
        }}>
          Sign in to access your analyst dashboard
        </p>

        <form onSubmit={handleSubmit}>
            
{isSignUp && (
  <>
    <label htmlFor="signup-name">Full Name</label>

    <input
      id="signup-name"
      type="text"
      placeholder="Enter your full name"
      value={fullName}
      onChange={(e) => setFullName(e.target.value)}
      style={{ ...inputStyle, margin: "10px 0 20px" }}
      required
    />
  </>
)}
          <label htmlFor="login-email">Email Address</label>

          <input
            id="login-email"
            type="email"
            placeholder="analyst@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ ...inputStyle, margin: "10px 0 20px" }}
            required
          />

          <label htmlFor="login-password">Password</label>

          <input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ ...inputStyle, margin: "10px 0 25px" }}
            required
          />

{isSignUp && (
  <>
    <label htmlFor="confirm-password">
      Confirm Password
    </label>

    <input
      id="confirm-password"
      type="password"
      placeholder="Re-enter your password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      style={{ ...inputStyle, margin: "10px 0 25px" }}
      required
    />
  </>
)}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "15px",
              background: "linear-gradient(135deg, #0891b2, #2563eb)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            
{isSignUp ? "Create Account →" : "Sign In →"}

          </button>
        </form>

<p style={{
  textAlign: "center",
  marginTop: "22px",
  color: "#94a3b8"
}}>
  {isSignUp ? "Already have an account?" : "Don't have an account?"}

  <button
    type="button"
    onClick={() => {
      setIsSignUp(!isSignUp);
      setMessage("");
    }}
    style={{
      background: "none",
      border: "none",
      color: "#22d3ee",
      fontWeight: "bold",
      cursor: "pointer",
      marginLeft: "8px",
      fontSize: "14px"
    }}
  >
    {isSignUp ? "Sign In" : "Create Account"}
  </button>
</p>

        {message && (
          <p style={{
            marginTop: "18px",
            color: "#fbbf24",
            textAlign: "center"
          }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
