import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'
import './SellerHeader.css'

function SellerHeader() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <>
      <header className="seller-header">
        <div className="seller-header__container">
          <Link to="/seller/dashboard" className="seller-header__logo">
            <img src={logo} alt="Hammer & Tongues Logo" />
            <span>Hammer & Tongues</span>
          </Link>

          <nav className="seller-header__nav">
            <Link
              to="/seller/dashboard"
              className={`seller-header__nav-link ${location.pathname === '/seller/dashboard' ? 'active' : ''
                }`}
            >
              Dashboard
            </Link>
            <Link
              to="/seller/auction-listings"
              className={`seller-header__nav-link ${location.pathname === '/seller/auction-listings' ? 'active' : ''
                }`}
            >
              My Products
            </Link>
            <Link
              to="/seller/sales"
              className={`seller-header__nav-link ${location.pathname === '/seller/sales' ? 'active' : ''
                }`}
            >
              Sales
            </Link>
            {/* <Link
              to="/seller/analytics"
              className={`seller-header__nav-link ${location.pathname === '/seller/analytics' ? 'active' : ''
                }`}
            >
              Analytics
            </Link> */}
          </nav>

          <div className="seller-header__right">

            <div className="seller-header__seller-badge">
              <span className="seller-header__seller-text">Seller</span>
            </div>

            <button
              className="seller-header__mobile-toggle"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link to="/seller/profile" className="seller-header__profile-btn" aria-label="Profile">
              <div className="seller-header__avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="7"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Link>
          </div>
        </div>

        <div
          className={`seller-header__mobile-overlay ${mobileMenuOpen ? 'open' : ''}`}
          onClick={closeMobileMenu}
        />

        <div className={`seller-header__mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <nav className="seller-header__mobile-nav">
            <Link
              to="/seller/dashboard"
              className={`seller-header__mobile-nav-link ${location.pathname === '/seller/dashboard' ? 'active' : ''
                }`}
              onClick={closeMobileMenu}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
            <Link
              to="/seller/auction-listings"
              className={`seller-header__mobile-nav-link ${location.pathname === '/seller/auction-listings' ? 'active' : ''
                }`}
              onClick={closeMobileMenu}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              My Products
            </Link>
            {/* <Link
              to="/seller/auctions"
              className={`seller-header__mobile-nav-link ${location.pathname === '/seller/auctions' ? 'active' : ''
                }`}
              onClick={closeMobileMenu}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Auctions
            </Link> */}

            {/* <Link
              to="/seller/analytics"
              className={`seller-header__mobile-nav-link ${location.pathname === '/seller/analytics' ? 'active' : ''
                }`}
              onClick={closeMobileMenu}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Analytics
            </Link> */}
          </nav>
        </div>
      </header>
    </>
  )
}

export default SellerHeader