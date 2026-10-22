
import { NavLink } from "react-router-dom";

export default function SocNavbar() {
  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "AI Threat Detection", path: "/threat-detection" },
    { name: "Security Alerts", path: "/alerts" },
    { name: "Reports", path: "/reports" }
  ];

  function handleLogout() {
    sessionStorage.removeItem("soc_access_token");
    window.location.replace("/login");
  }

  return (
    <nav
      style={{
        background: "#0b1427",
        borderBottom: "1px solid #22d3ee",
        padding: "18px 25px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
        flexWrap: "wrap"
      }}
    >
      <h2 style={{ color: "#22d3ee", fontSize: "20px" }}>
        🛡️ SOC COMMAND CENTER
      </h2>

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap"
      }}>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            style={({ isActive }) => ({
              color: isActive ? "#22d3ee" : "#cbd5e1",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "14px"
            })}
          >
            {link.name}
          </NavLink>
        ))}

        <button
          onClick={handleLogout}
          style={{
            background: "#be123c",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}
