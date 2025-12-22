import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'
import './Header.css'

const Header = () => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)
  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <>
      <header className="header3">
        <div className="header-container3">
          <Link to="/" className="logo">
            <div className="logo-icon">
              <img src={logo} alt="Hammer & Tongues Logo" />
            </div>
            <span className="logo-text">Hammer & Tongues</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="nav">
            <Link to="/auctions" className={`nav-link ${location.pathname === '/auctions' ? 'active' : ''}`}>Auctions</Link>
            <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About Us</Link>
            <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            className="header-mobile-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`header-mobile-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Drawer */}
      <div className={`header-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <nav className="header-mobile-nav">
          <Link to="/auctions" onClick={closeMobileMenu}
            className={`header-mobile-link ${location.pathname === '/auctions' ? 'active' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Auctions
          </Link>
          <Link to="/about" onClick={closeMobileMenu}
            className={`header-mobile-link ${location.pathname === '/about' ? 'active' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>

            About Us
          </Link>
          <Link to="/contact" onClick={closeMobileMenu}
            className={`header-mobile-link ${location.pathname === '/contact' ? 'active' : ''}`}>

            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 7l-7.89 5.26a2 2 0 01-2.22 0L3 7" />
            </svg>
            Contact
          </Link>
        </nav>
      </div>
    </>
  )
}

export default Header
