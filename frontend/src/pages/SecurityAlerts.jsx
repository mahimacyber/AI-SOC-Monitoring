
import { useEffect, useState } from "react";

export default function SecurityAlerts() {
    
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const [search, setSearch] = useState("");

const [severityFilter, setSeverityFilter] = useState("ALL");
const [statusFilter, setStatusFilter] = useState("ALL");


const filteredAlerts = alerts.filter((alert) => {
  const searchText = search.toLowerCase();

  const matchesSearch = [
    alert.id,
    alert.alert_type,
    alert.username,
    alert.source_ip,
    alert.severity,
    alert.status
  ].some((value) =>
    String(value ?? "").toLowerCase().includes(searchText)
  );

  const matchesSeverity =
    severityFilter === "ALL" ||
    String(alert.severity).toUpperCase() === severityFilter;

  const matchesStatus =
    statusFilter === "ALL" ||
    String(alert.status).toLowerCase() === statusFilter.toLowerCase();

  return matchesSearch && matchesSeverity && matchesStatus;
});


  useEffect(() => {
    async function loadAlerts() {
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
              : "Could not load security alerts."
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

    loadAlerts();
  }, []);

async function updateAlertStatus(alertId, newStatus) {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/alerts/${alertId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("soc_access_token")}`
        },
        body: JSON.stringify({
          status: newStatus
        })
      }
    );

    if (!response.ok) {
      throw new Error("Could not update alert status.");
    }

    setAlerts((previousAlerts) =>
      previousAlerts.map((alert) =>
        alert.id === alertId
          ? { ...alert, status: newStatus }
          : alert
      )
    );
  } catch (error) {
    window.alert(error.message);
  }
}

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "40px"
      }}
    >
      <h1 style={{ color: "#22d3ee" }}>
        🚨 Security Alerts
      </h1>

      <p
        style={{
          marginTop: "15px",
          color: "#94a3b8"
        }}
      >
        Monitor, investigate and manage security alerts.
      </p>

      <div
        style={{
          background: "#1e293b",
          padding: "30px",
          borderRadius: "15px",
          border: "1px solid #22d3ee",
          marginTop: "30px"
        }}
      >
        <h2>Security Alerts Management</h2>

<div style={{ display: "flex", gap: "15px", marginTop: "20px", flexWrap: "wrap" }}>
  <select
    value={severityFilter}
    onChange={(e) => setSeverityFilter(e.target.value)}
    style={{ padding: "12px", background: "#0f172a", color: "white", border: "1px solid #22d3ee", borderRadius: "8px" }}
  >
    <option value="ALL">All Severities</option>
    <option value="HIGH">HIGH</option>
    <option value="MEDIUM">MEDIUM</option>
    <option value="LOW">LOW</option>
  </select>

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    style={{ padding: "12px", background: "#0f172a", color: "white", border: "1px solid #22d3ee", borderRadius: "8px" }}
  >
    <option value="ALL">All Statuses</option>
    <option value="New">New</option>
    <option value="Investigating">Investigating</option>
    <option value="Resolved">Resolved</option>
  </select>
</div>

<input
  type="text"
  placeholder="🔍 Search alerts by username, IP or alert type..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    width: "100%",
    padding: "14px 16px",
    marginTop: "20px",
    background: "#0f172a",
    color: "#ffffff",
    border: "1px solid #22d3ee",
    borderRadius: "10px",
    fontSize: "15px",
    boxSizing: "border-box"
  }}
/>

        
{loading ? (
  <p style={{ marginTop: "20px", color: "#94a3b8" }}>
    Loading security alerts...
  </p>
) : error ? (
  <p
    style={{
      marginTop: "20px",
      color: "#f87171"
    }}
  >
    {error}
  </p>

) : filteredAlerts.length === 0 ? (

  <p style={{ marginTop: "20px", color: "#94a3b8" }}>
    No security alerts found.
  </p>
) : (
  <div style={{ overflowX: "auto", marginTop: "25px" }}>
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        minWidth: "750px",
        textAlign: "left"
      }}
    >
      <thead>
        <tr style={{ background: "#164e63" }}>
          {[
            "ID",
            "Alert Type",
            "Severity",
            "Username",
            "Source IP",
            "Status"
          ].map((heading) => (
            <th
              key={heading}
              style={{
                padding: "15px",
                borderBottom: "2px solid #22d3ee",
                color: "#67e8f9"
              }}
            >
              {heading}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
      {filteredAlerts.map((alert) => (
          <tr
            key={alert.id}
            style={{
              borderBottom: "1px solid #334155"
            }}
          >
            <td style={{ padding: "14px" }}>
              {alert.id}
            </td>

            <td style={{ padding: "14px" }}>
              {alert.alert_type}
            </td>

            <td style={{ padding: "14px" }}>
              <span
                style={{
                  color:
                    alert.severity === "HIGH"
                      ? "#f87171"
                      : alert.severity === "MEDIUM"
                      ? "#fbbf24"
                      : "#4ade80",
                  fontWeight: "bold"
                }}
              >
                ● {alert.severity}
              </span>
            </td>

            <td style={{ padding: "14px" }}>
              {alert.username}
            </td>

            <td style={{ padding: "14px" }}>
              {alert.source_ip}
            </td>

           
<td style={{ padding: "14px" }}>
  <select
    value={alert.status}
    onChange={(e) =>
      updateAlertStatus(alert.id, e.target.value)
    }
    style={{
      padding: "10px",
      background: "#0f172a",
      color: "#22d3ee",
      border: "1px solid #22d3ee",
      borderRadius: "8px",
      cursor: "pointer"
    }}
  >
    <option value="New">New</option>
    <option value="Investigating">Investigating</option>
    <option value="Resolved">Resolved</option>
  </select>
</td>

          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

      </div>
    </div>
  );
}
