
import { useEffect, useState } from "react";

export default function Reports() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReports() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/alerts",
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("soc_access_token")}`
            }
          }
        );

        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? "Session expired. Please sign in again."
              : "Could not load reports."
          );
        }

        const data = await response.json();
        setAlerts(Array.isArray(data) ? data : data.alerts || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  const highAlerts = alerts.filter(
    (a) => String(a.severity).toUpperCase() === "HIGH"
  ).length;

  const resolvedAlerts = alerts.filter(
    (a) => String(a.status).toLowerCase() === "resolved"
  ).length;

  function downloadCSV() {
    const columns = [
      "id",
      "alert_type",
      "severity",
      "username",
      "source_ip",
      "status"
    ];

    const escapeCSV = (value) => {
      let text = String(value ?? "");

      if (/^[\s]*[=+\-@\t\r]/.test(text)) {
        text = "'" + text;
      }

      return `"${text.replace(/"/g, '""')}"`;
    };

    const csv = [
      columns.join(","),
      ...alerts.map((alert) =>
        columns.map((key) => escapeCSV(alert[key])).join(",")
      )
    ].join("\r\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "SOC_Security_Report.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  const cardStyle = {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "14px",
    padding: "25px",
    flex: "1 1 200px"
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f172a",
      color: "white",
      padding: "40px"
    }}>
      <h1 style={{ color: "#22d3ee" }}>
        📊 Security Reports
      </h1>

      <p style={{ color: "#94a3b8", marginTop: "12px" }}>
        Security alert statistics and downloadable reports.
      </p>

      {error && (
        <p role="alert" style={{
          color: "#f87171",
          marginTop: "20px"
        }}>
          {error}
        </p>
      )}

      {loading ? (
        <p style={{ marginTop: "30px" }}>
          Loading reports...
        </p>
      ) : !error && (
        <>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            marginTop: "30px"
          }}>
            <div style={cardStyle}>
              <h3>Total Alerts</h3>
              <h1 style={{ color: "#22d3ee" }}>
                {alerts.length}
              </h1>
            </div>

            <div style={cardStyle}>
              <h3>High Severity</h3>
              <h1 style={{ color: "#f87171" }}>
                {highAlerts}
              </h1>
            </div>

            <div style={cardStyle}>
              <h3>Resolved Alerts</h3>
              <h1 style={{ color: "#4ade80" }}>
                {resolvedAlerts}
              </h1>
            </div>
          </div>

          <div style={{
            ...cardStyle,
            marginTop: "30px"
          }}>
            <h2>Download Security Report</h2>

            <p style={{
              color: "#94a3b8",
              marginTop: "12px"
            }}>
              Export security alerts as a CSV file.
            </p>

            <button
              onClick={downloadCSV}
              disabled={alerts.length === 0}
              style={{
                marginTop: "20px",
                padding: "14px 25px",
                background: "#0891b2",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              📥 Download CSV Report
            </button>
          </div>
        </>
      )}
    </div>
  );
}
