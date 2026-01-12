import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './SignIn.css'
import { useDispatch, useSelector } from 'react-redux'
import { clearError } from '../store/slices/authSlice'
import { loginUser } from '../store/actions/authActions'

const SignIn = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Redux state
  const { isLoading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  )

  console.log('Redux states: ', user, isAuthenticated);

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = user.role
      const staff = user.is_staff
      console.log("staff: ", staff);

      // Navigate based on role
      if (staff == 'true') {
        navigate('/admin/dashboard', { replace: true })
        return;
      } else if (role === 'manager') {
        navigate('/manager/dashboard', { replace: true })
        return;
      } else if (role === 'buyer') {
        navigate('/buyer/dashboard', { replace: true })
        return;
      } else if (role === 'seller') {
        navigate('/seller/dashboard', { replace: true })
        return;
      } else {
        // Default fallback
        navigate('/', { replace: true })
      }
    }
  }, [isAuthenticated, user])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      })
    }
  }

  // Form validation
  const validateForm = () => {
    const errors = {}

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Clear previous errors
    dispatch(clearError())

    // Validate form
    if (!validateForm()) {
      return
    }

    // Prepare login credentials
    const credentials = {
      email: formData.email,
      password: formData.password,
    }
    // Dispatch login action
    await dispatch(loginUser(credentials))
  }

  return (
    <div className="signin-page">
      <div className="signin-header">
        <div className="signin-header-left">
          {/* <button
            type="button"
            className="signin-back-button"
            onClick={() => navigate('/')}
            aria-label="Go back"
            disabled={isLoading}
          >
            Back to Home
          </button> */}
           <button
            type="button"
            className="back-button"
            onClick={() => navigate('/')}
            aria-label="Go back"
            disabled={isLoading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Home
          </button>
        </div>
        <div className="signin-header-link">
          <span>Don't have an account?</span>
          <Link to="/register" className="header-link-button">Create Account</Link>
        </div>
      </div>

      <div className="signin-image-section">
        <div className="signin-image-overlay"></div>
        <div className="signin-image-content">
          <h2 className="signin-image-title">Your Gateway to Exclusive Auctions</h2>
          <p className="signin-image-description">
            Discover unique items, bid with confidence, and never miss an opportunity to own something extraordinary.
          </p>
        </div>
      </div>

      <div className="signin-container">
        <div className="signin-form-wrapper">
          <h1 className="signin-title">Welcome Back</h1>

          <form className="signin-form" onSubmit={handleSubmit}>
            {/* Display API errors */}
            {error && (
              <div className="form-error-message">
                {error.message || error.detail || 'Login failed. Please check your credentials.'}
                {error.email && <div>{error.email[0]}</div>}
                {error.password && <div>{error.password[0]}</div>}
              </div>
            )}

            <div className="form-group-container">
              {/* Email Field */}
              <div className='form-group-1'>
                <label htmlFor="email" className="form-label">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input ${formErrors.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
                {formErrors.email && (
                  <span className="field-error">{formErrors.email}</span>
                )}
              </div>

              {/* Password Field */}
              <div className="form-group-2">
                <label htmlFor="password" className="form-label">
                  Password <span className="required">*</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`form-input ${formErrors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="signin-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    {showPassword ? (
                      <>
                        <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </>
                    ) : (
                      <>
                        <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </>
                    )}
                  </svg>
                </button>
                {formErrors.password && (
                  <span className="field-error">{formErrors.password}</span>
                )}
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" disabled={isLoading} />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
            </div>

            {/* Submit Button */}
            <div className='signin-button-container'>
              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            {/* Divider */}
            {/* <div className="form-divider">
              <span>OR</span>
            </div> */}

            {/* Social Login Buttons */}
            {/* <div className="social-buttons">
              <button
                type="button"
                className="social-button google"
                disabled={isLoading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sign in with Google
              </button>
              <button
                type="button"
                className="social-button apple"
                disabled={isLoading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Sign in with Apple
              </button>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignIn