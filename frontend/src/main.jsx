import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login.jsx";
import Sidebar from "./Sidebar.jsx";

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
        <App />
      </div>
    </div>
  )

      : <Navigate to="/login" replace />
  }
/>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</BrowserRouter>

  </StrictMode>,
)
