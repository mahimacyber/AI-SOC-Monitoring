
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "AI Threat Detection", path: "/threat-detection", icon: "🧠" },
    { name: "Security Alerts", path: "/alerts", icon: "🚨" },
    { name: "Reports", path: "/reports", icon: "📁" }
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("soc_access_token");
    window.location.replace("/login");
  };

  return (
    <aside
      style={{
        width: "250px",
        minWidth: "250px",
        minHeight: "100vh",
        background: "#0f172a",
        padding: "25px 15px",
        borderRight: "1px solid #164e63",
        display: "none",
        flexDirection: "column",
        gap: "12px"
      }}
    >
      <h2 style={{
        color: "#22d3ee",
        fontSize: "19px",
        marginBottom: "25px"
      }}>
        🛡️ SOC COMMAND
      </h2>

      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          style={({ isActive }) => ({
            padding: "14px",
            borderRadius: "10px",
            color: isActive ? "#67e8f9" : "#cbd5e1",
            background: isActive ? "#164e63" : "transparent",
            textDecoration: "none",
            fontWeight: "600",
            display: "block"
          })}
        >
          {link.icon} {link.name}
        </NavLink>
      ))}

      <button
        type="button"
        onClick={handleLogout}
        style={{
          marginTop: "auto",
          padding: "14px",
          background: "#7f1d1d",
          color: "white",
          border: "1px solid #ef4444",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        🚪 Logout
      </button>
    </aside>
  );
}
