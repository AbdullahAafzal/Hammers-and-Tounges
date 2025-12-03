import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import './Register.css'

const Register = () => {
  const navigate = useNavigate()
  const [userType, setUserType] = useState('buyer')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'buyer'
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleUserTypeChange = (type) => {
    setUserType(type)
    setFormData(prev => ({
      ...prev,
      userType: type
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Register', formData)
    navigate('/otp-verification', {
      state: {
        userType: userType === 'seller' || formData.userType === 'seller' ? 'seller' : 'buyer',
        email: formData.email
      }
    })
  }

  return (
    <div className="register-page">
      <div className="register-header">
        <div className="register-header-left">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <Link to="/" className="register-logo">
            <img src={logo} alt="Hammers & Tongues Logo" />
            <span>Hammers & Tongues</span>
          </Link>
        </div>
        <div className="register-header-link">
          <span>Already have an account?</span>
          <Link to="/signin" className="header-link-button">Log In</Link>
        </div>
      </div>

      <div className="register-container">
        <div className="register-left">
          <div className="register-image-section">
            <div className="register-image-overlay"></div>
            <div className="register-image-content">
              <h2 className="register-image-title">Your Gateway to Exclusive Auctions</h2>
              <p className="register-image-description">
                Discover unique items, bid with confidence, and never miss an opportunity to own something extraordinary.
              </p>
            </div>
          </div>
        </div>

        <div className="register-right">
          <div className="register-form-wrapper">
            <h1 className="register-title">Create Your H&T Account</h1>

            <form className="register-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="userType" className="form-label">I am a</label>
                <div className="user-type-selector">
                  <button
                    type="button"
                    className={`user-type-btn ${userType === 'buyer' ? 'active' : ''}`}
                    onClick={() => handleUserTypeChange('buyer')}
                  >
                    Buyer
                  </button>
                  <button
                    type="button"
                    className={`user-type-btn ${userType === 'seller' ? 'active' : ''}`}
                    onClick={() => handleUserTypeChange('seller')}
                  >
                    Seller
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder="yourname@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="form-input"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      {showPassword ? (
                        <>
                          <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </>
                      ) : (
                        <>
                          <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label terms">
                  <input type="checkbox" required />
                  <span>
                    By creating an account, you agree to our{' '}
                    <Link to="/terms" className="terms-link">Terms of Service</Link>
                  </span>
                </label>
              </div>

              <button type="submit" className="submit-button">
                Create Account
              </button>

              <div className="form-divider">
                <span>OR</span>
              </div>

              <div className="social-buttons">
                <button type="button" className="social-button google">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Sign up with Google
                </button>
                <button type="button" className="social-button apple">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  Sign up with Apple
                </button>
              </div>

              <div className="kyc-notice">
                <div className="kyc-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <p>
                  Please note: To place bids, you will need to complete a simple identity
                  verification (KYC) process after registration.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register

