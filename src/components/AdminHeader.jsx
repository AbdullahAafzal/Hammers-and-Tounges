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
            <Link to="/admin-panel/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>Dashboard</Link>
            <Link to="/reports" className={`nav-link ${location.pathname.includes("reports") ? "active" : ""}`}>Reports</Link>
            <Link to="/auctiontab" className={`nav-link ${location.pathname.includes("auctiontab") ? "active" : ""}`}>Auction</Link>
            <Link to="/livetab" className={`nav-link ${location.pathname.includes("livetab") ? "active" : ""}`}>Live Auctions</Link>
            <Link to="/finance" className={`nav-link ${location.pathname.includes("finance") ? "active" : ""}`}>Finance</Link>
          </nav>
        </div>

        <div className="header-right">
          <button className="header-icon-button notification-button" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M15.137 21C14.695 21.622 13.91 22 13 22H11C10.09 22 9.305 21.622 8.863 21M18 8C18 5.239 15.761 3 13 3H11C8.239 3 6 5.239 6 8V11C6 12.326 5.473 13.597 4.535 14.535L4 15.07V17H20V15.07L19.465 14.535C18.527 13.597 18 12.326 18 11V8Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button className="header-icon-button settings-button" aria-label="Settings">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.4 15A1.65 1.65 0 0 0 20 13.6V10.4A1.65 1.65 0 0 0 19.4 9L17.55 8.25A1.65 1.65 0 0 0 16.6 7L16.25 5.1A1.65 1.65 0 0 0 14.85 4.5H9.15A1.65 1.65 0 0 0 7.75 5.1L7.4 7A1.65 1.65 0 0 0 6.45 8.25L4.6 9A1.65 1.65 0 0 0 4 10.4V13.6A1.65 1.65 0 0 0 4.6 15L6.45 15.75A1.65 1.65 0 0 0 7.4 17L7.75 18.9A1.65 1.65 0 0 0 9.15 19.5H14.85A1.65 1.65 0 0 0 16.25 18.9L16.6 17A1.65 1.65 0 0 0 17.55 15.75L19.4 15Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button className="header-icon-button profile-button" aria-label="Profile">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
