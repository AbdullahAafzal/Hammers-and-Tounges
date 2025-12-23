import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import './Register.css'

const Register = () => {
  const navigate = useNavigate()
  const [userType, setUserType] = useState('buyer')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
    business_name: '',
    business_reg_no: ''
  })
  const [formErrors, setFormErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      })
    }
  }
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')

    if (value.length > 9) {
      value = value.slice(0, 9)
    }
    if (value.length > 3 && value.length <= 6) {
      value = value.replace(/(\d{3})(\d+)/, '$1 $2')
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1 $2 $3')
    }

    setFormData((prev) => ({
      ...prev,
      phone: value
    }))

    if (formErrors.phone) {
      setFormErrors((prev) => ({
        ...prev,
        phone: ''
      }))
    }
  }

  const handleUserTypeChange = (type) => {
    setUserType(type)
    setFormData(prev => ({
      ...prev,
      role: type
    }))
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required'
    }

    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (formData.phone) {
      const phoneDigits = formData.phone.replace(/\s/g, '');
      const phoneRegex = /^7[1-9]\d{7}$/;
      if (!phoneRegex.test(phoneDigits)) {
      }
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, number and special character'
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    if (formData.role === 'seller') {
      if (!formData.business_name.trim()) {
        errors.business_name = 'Business name is required for sellers'
      }
      if (!formData.business_reg_no.trim()) {
        errors.business_reg_no = 'Business registration number is required for sellers'
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }

    const registrationData = {
      role: formData.role,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone ? formData.phone.replace(/\s/g, '') : '',
      password: formData.password,
    }

    if (formData.role === 'seller') {
      registrationData.business_name = formData.business_name
      registrationData.business_reg_no = formData.business_reg_no
    }

    setFormData(registrationData);
    navigate('/otp-verification', {
      state: {
        email: formData.email,
        userType: formData.role
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
            <img src={logo} alt="Hammer & Tongues Logo" />
            <span>Hammer & Tongues</span>
          </Link>
        </div>
        <div className="register-header-link">
          <span>Already have an account?</span>
          <Link to="/signin" className="header-link-button">Log In</Link>
        </div>
      </div>
      <div className="register-image-section">
        <div className="register-image-overlay"></div>
        <div className="register-image-content">
          <h2 className="register-image-title">Your Gateway to Exclusive Auctions</h2>
          <p className="register-image-description">
            Discover unique items, bid with confidence, and never miss an opportunity to own something extraordinary.
          </p>
        </div>
      </div>

      <div className="register-container">
        <div className="register-form-wrapper-1">
          <h1 className="register-title">Create Your H&T Account</h1>
          <div className="user-type-tabs">
            <button
              type="button"
              className={`user-type-tab ${userType === 'buyer' ? 'active' : ''}`}
              onClick={() => handleUserTypeChange('buyer')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" />
                <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" />
              </svg>
              As a Buyer
            </button>
            <button
              type="button"
              className={`user-type-tab ${userType === 'seller' ? 'active' : ''}`}
              onClick={() => handleUserTypeChange('seller')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 21H21M3 7V8C3 8.79565 3.31607 9.55871 3.87868 10.1213C4.44129 10.6839 5.20435 11 6 11C6.79565 11 7.55871 10.6839 8.12132 10.1213C8.68393 9.55871 9 8.79565 9 8M9 8C9 8.79565 9.31607 9.55871 9.87868 10.1213C10.4413 10.6839 11.2044 11 12 11C12.7956 11 13.5587 10.6839 14.1213 10.1213C14.6839 9.55871 15 8.79565 15 8M15 8C15 8.79565 15.3161 9.55871 15.8787 10.1213C16.4413 10.6839 17.2044 11 18 11C18.7956 11 19.5587 10.6839 20.1213 10.1213C20.6839 9.55871 21 8.79565 21 8V7L18 3H6L3 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              As a Seller
            </button>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>

            <div className="register-form-section">
              <div className="register-form-grid">
                <div className="form-group">
                  <label htmlFor="first_name" className="form-label">
                    First Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    className={`form-input ${formErrors.first_name ? 'error' : ''}`}
                    placeholder="John"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                  {formErrors.first_name && (
                    <span className="field-error">{formErrors.first_name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="last_name" className="form-label">
                    Last Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    className={`form-input ${formErrors.last_name ? 'error' : ''}`}
                    placeholder="Doe"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                  {formErrors.last_name && (
                    <span className="field-error">{formErrors.last_name}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="register-form-section">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-input ${formErrors.email ? 'error' : ''}`}
                    placeholder="yourname@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {formErrors.email && (
                    <span className="field-error">{formErrors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Phone Number {formData.role === 'seller' && <span className="required">*</span>}
                  </label>
                  <div className="phone-input-wrapper">
                    <div className="phone-prefix">
                      <img
                        src="https://flagcdn.com/w40/zw.png"
                        srcSet="https://flagcdn.com/w80/zw.png 2x"
                        alt="Zimbabwe Flag"
                        className="flag-icon"
                      />
                      <span className="country-code">+263</span>
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className={`form-input ${formErrors.phone ? 'error' : ''}`}
                      placeholder="77X XXX XXX"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      maxLength="16"
                    />
                  </div>
                  {formErrors.phone && (
                    <span className="field-error">{formErrors.phone}</span>
                  )}
                  <small className="field-hint">
                    Zimbabwe format: +263 followed by 9-digit mobile number
                  </small>
                </div>
              </div>
            </div>

            {formData.role === 'seller' && (
              <div className="register-form-section">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="business_name" className="form-label">
                      Business Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="business_name"
                      name="business_name"
                      className={`form-input ${formErrors.business_name ? 'error' : ''}`}
                      placeholder="Your Business Name"
                      value={formData.business_name}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.business_name && (
                      <span className="field-error">{formErrors.business_name}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="business_reg_no" className="form-label">
                      Business Registration <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="business_reg_no"
                      name="business_reg_no"
                      className={`form-input ${formErrors.business_reg_no ? 'error' : ''}`}
                      placeholder="BRN-00923898"
                      value={formData.business_reg_no}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.business_reg_no && (
                      <span className="field-error">{formErrors.business_reg_no}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="register-form-section">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password <span className="required">*</span>
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className={`form-input ${formErrors.password ? 'error' : ''}`}
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
                  {formErrors.password && (
                    <span className="field-error">{formErrors.password}</span>
                  )}
                  <small className="field-hint">
                    8+ characters with uppercase, lowercase, number & special character
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password <span className="required">*</span>
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      className={`form-input ${formErrors.confirmPassword ? 'error' : ''}`}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        {showConfirmPassword ? (
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
                  {formErrors.confirmPassword && (
                    <span className="field-error">{formErrors.confirmPassword}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="register-form-section">
              <div className="form-group">
                <label className="checkbox-label terms">
                  <input type="checkbox" required />
                  <span>
                    I agree to the{' '}
                    <Link to="/terms" className="terms-link">Terms of Service</Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="terms-link">Privacy Policy</Link>
                  </span>
                </label>
              </div>

              <div className='button-container'>
                <button
                  type="submit"
                  className="submit-button"
                >
                  Create Account
                </button>

              </div>

              <div className="divider">
                <span>or continue with</span>
              </div>

              <div className="social-login">
                <button
                  type="button"
                  className="social-button google"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="social-button apple"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  Apple
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
                  <strong>Note:</strong> To place bids, you'll need to complete identity verification (KYC) after registration.
                </p>
              </div>
              <div className="login-redirect">
                <span>Already have an account?</span>
                <Link to="/signin" className="login-link">Log In</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register