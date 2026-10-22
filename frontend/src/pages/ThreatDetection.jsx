
export default function ThreatDetection() {
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
        🧠 AI Threat Detection
      </h1>

      <p style={{ marginTop: "15px", color: "#94a3b8" }}>
        Analyze suspicious login activity using Machine Learning.
      </p>

      <div
        style={{
          background: "#1e293b",
          padding: "30px",
          borderRadius: "15px",
          marginTop: "30px",
          border: "1px solid #22d3ee"
        }}
      >
        <h2>Security Threat Analysis</h2>

       
<form onSubmit={analyzeThreat} style={{ marginTop: "25px" }}>
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "20px"
    }}
  >
    {[
      { name: "failed_logins", label: "Failed Logins", type: "number" },
      { name: "successful_logins", label: "Successful Logins", type: "number" },
      { name: "unique_users", label: "Unique Users", type: "number" },
      { name: "username", label: "Username", type: "text" },
      { name: "source_ip", label: "Source IP", type: "text" }
    ].map((field) => (
      <label
        key={field.name}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          color: "#e2e8f0",
          fontWeight: "bold"
        }}
      >
        {field.label}

        <input
          type={field.type}
          min={field.type === "number" ? 0 : undefined}
          required
          value={form[field.name]}
          onChange={(e) =>
            setForm({
              ...form,
              [field.name]: e.target.value
            })
          }
          style={{
            padding: "13px",
            background: "#0f172a",
            color: "#ffffff",
            border: "1px solid #22d3ee",
            borderRadius: "8px",
            fontSize: "15px"
          }}
        />
      </label>
    ))}
  </div>

  <button
    type="submit"
    disabled={loading}
    style={{
      marginTop: "25px",
      padding: "14px 28px",
      background: "linear-gradient(135deg, #06b6d4, #2563eb)",
      color: "white",
      border: "none",
      borderRadius: "10px",
      fontWeight: "bold",
      cursor: loading ? "wait" : "pointer"
    }}
  >
    {loading ? "Analyzing..." : "🔍 Analyze Threat"}
  </button>
</form>

{error && (
  <div
    role="alert"
    style={{
      marginTop: "20px",
      padding: "20px",
      background: "#7f1d1d",
      borderRadius: "10px"
    }}
  >
    {error}
  </div>
)}

{result && (
  <div
    style={{
      marginTop: "25px",
      padding: "25px",
      background: "#164e63",
      border: "1px solid #22d3ee",
      borderRadius: "12px"
    }}
  >
    <h2>🛡️ AI Analysis Result</h2>

    <p style={{ marginTop: "12px" }}>
      ML Prediction: <strong>{result.prediction ?? "Completed"}</strong>
    </p>

    {result.alert_id != null && (
      <p style={{ marginTop: "10px" }}>
        Alert Saved! ID: {result.alert_id}
      </p>
    )}

    {result.message && (
      <p style={{ marginTop: "10px" }}>
        {result.message}
      </p>
    )}
  </div>
)}

      </div>
    </div>
  );
}
