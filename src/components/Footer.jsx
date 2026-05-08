import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3 className="footer-heading">Address</h3>
          <p className="footer-address">
            18005 Dhlela Way, Graniteside
            <br />
            <a href="tel:+263474811820">+263 (4) 748 118/20</a>
            <br />
            <a href="mailto:info@hammerandtongues.com">info@hammerandtongues.com</a>
          </p>
        </div>
        <div className="footer-column">
          <h3 className="footer-heading">Support</h3>
          <ul className="footer-links">
            <li><a href="mailto:info@hammerandtongues.com">info@hammerandtongues.com</a></li>
            <li><a href="tel:+263474811820">+263 (4) 748 118/20</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3 className="footer-heading">Legal</h3>
          <ul className="footer-links">
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms-and-conditions">Terms and Conditions</Link></li>
            <li><Link to="/cookie-policy">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-copyright">
        <p>© {new Date().getFullYear()} Hammer & Tongues. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer