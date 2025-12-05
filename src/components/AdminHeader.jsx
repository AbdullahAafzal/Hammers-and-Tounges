import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import logo from "../assets/logo.png"
import "./AdminHeader.css"


function AdminHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const location = useLocation()

  const handleSearch = (e) => {
    e.preventDefault()
    console.log("Admin search:", searchQuery)
  }

  return (
    <header className="admin-header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            <div className="logo-icon">
              <img src={logo} alt="Logo" />
            </div>
            <span className="logo-text">Hammers & Tongues</span>
          </Link>

         
        </div>

        <div className="header-center">
         <nav className="nav">
            <Link to="/admin-panel/" className={`nav-link ${location.pathname==="/"?"active":""}`}>Dashboard</Link>
            <Link to="/reports" className={`nav-link ${location.pathname.includes("reports")?"active":""}`}>Reports</Link>
          </nav>
        </div>

        <div className="header-right">
          <button className="header-icon-button notification-button"><img src="https://img.icons8.com/ios11/512/FFFFFF/appointment-reminders.png" alt=""  style={{width:20}}/></button>

                      <button className="header-icon-button setting-button"><img src="https://img.icons8.com/m_rounded/512/FFFFFF/settings.png" alt="" style={{width:20}}/></button>

          <button className="header-icon-button profile-button"><img src="https://www.citypng.com/public/uploads/preview/transparent-hd-white-male-user-profile-icon-701751695035030pj3izxn7kh.png" alt="" style={{width:20}}/></button>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
