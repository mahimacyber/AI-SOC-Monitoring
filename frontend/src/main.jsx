import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Dashboard from "./pages/Dashboard.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login.jsx";
import Sidebar from "./Sidebar.jsx";
import ThreatDetection from "./pages/ThreatDetection.jsx";
import SecurityAlerts from "./pages/SecurityAlerts.jsx";
import Reports from "./pages/Reports.jsx";
import SocNavbar from "./SocNavbar.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/login" element={<Login />} />
   
<Route
  path="/dashboard"
  element={
    sessionStorage.getItem("soc_access_token")
      
? (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, minWidth: 0 }}>
       
<Dashboard />

      </div>
    </div>
  )

      : <Navigate to="/login" replace />
  }
/>

<Route
  path="/threat-detection"
  element={
    sessionStorage.getItem("soc_access_token")
     
? (
    <>
      <SocNavbar />
      <ThreatDetection />
    </>
  )

      : <Navigate to="/login" replace />
  }
/>

<Route
  path="/alerts"
  element={
    sessionStorage.getItem("soc_access_token")
     
? (
    <>
      <SocNavbar />
      <SecurityAlerts />
    </>
  )

      : <Navigate to="/login" replace />
  }
/>

<Route
  path="/reports"
  element={
    sessionStorage.getItem("soc_access_token")
      
? (
    <>
      <SocNavbar />
      <Reports />
    </>
  )

      : <Navigate to="/login" replace />
  }
/>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</BrowserRouter>

  </StrictMode>,
)
