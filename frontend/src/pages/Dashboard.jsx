
import { useState } from "react";

import App from "../App.jsx";

export default function Dashboard() {
    
  const [form, setForm] = useState({
    failed_logins: 0,
    successful_logins: 0,
    unique_users: 1,
    username: "",
    source_ip: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyzeThreat(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/predict-and-save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("soc_access_token")}`
          },
          body: JSON.stringify({
            ...form,
            failed_logins: Number(form.failed_logins),
            successful_logins: Number(form.successful_logins),
            unique_users: Number(form.unique_users)
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Threat analysis failed."
        );
      }

      setResult(data);
    } catch (err) {
      console.error("Threat Detection Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return <App />;
}
