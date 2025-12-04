import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

function SellerHeader() {
  return (
    <header className="dashboard-header">
      <div className="dashboard-header-container">
        <Link to="/seller-dashboard" className="dashboard-logo">
          <img src={logo} alt="Hammers & Tongues Logo" />
          <span>Hammers & Tongues</span>
        </Link>

        <nav className="dashboard-nav">
           <Link
              to="/seller-dashboard"
              className={`nav-link ${location.pathname === '/seller-dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </Link>

            <Link
              to="/seller/auction-listings"
              className={`nav-link ${location.pathname === '/seller/auction-listings' ? 'active' : ''}`}
            >
              My Products
            </Link>

            <Link
              to="/seller/auctions"
              className={`nav-link ${location.pathname === '/seller/auctions' ? 'active' : ''}`}
            >
              Auctions
            </Link>

            <Link
              to="/seller/analytics"
              className={`nav-link ${location.pathname === '/seller/analytics' ? 'active' : ''}`}
            >
              Analytics
            </Link>
        </nav>

        <div className="dashboard-header-right">
          <button className="notification-button" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 0 0 6 8C6 11.3137 3.31371 14 0 14M18 8C20.2091 8 22 9.79086 22 12C22 14.2091 20.2091 16 18 16M18 8C20.2091 8 22 5.79086 22 3C22 0.790861 20.2091 -1 18 -1C15.7909 -1 14 0.790861 14 3C14 5.79086 15.7909 8 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 8C6 11.3137 8.68629 14 12 14C15.3137 14 18 11.3137 18 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="notification-badge">5</span>
          </button>
          <div className="seller-rating">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFC107">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <span>4.8</span>
          </div>
          <Link to="/seller/profile" className="profile-button" aria-label="Profile">
            <div className="profile-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </header>

  )
}

export default SellerHeader
