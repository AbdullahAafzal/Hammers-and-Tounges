import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Profile.css'
import { getLocalStorage } from '../utils/localStorage'

const BuyerProfile = () => {
  const navigate = useNavigate()
  const [role, setRole] = useState('buyer')
  const [activeSection, setActiveSection] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    displayName: 'JohnnyD',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    country: 'United States',
    bio: 'Auction enthusiast with 5+ years of experience in industrial machinery and art collection.',
    memberSince: '2022',
    totalBids: 142,
    wonAuctions: 38,
    successRate: '78%'
  })
  const [user, setUser] = useState(()=> {
    getLocalStorage('user')
  })
  console.log(user);
  

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSecurityChange = (e) => {
    setSecurityData({
      ...securityData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Saving profile:', formData)
    setIsEditing(false)
  }

  const handleSecuritySubmit = (e) => {
    e.preventDefault()
    console.log('Updating security:', securityData)
    setSecurityData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  const menuItems = [
    { id: 'profile', label: 'Profile Information', icon: 'profile', navigations: '/profile' },
    { id: 'contact', label: 'Contact Details', icon: 'contact', navigations: '/profile' },
    { id: 'security', label: 'Security', icon: 'security', navigations: '/profile' },
    { id: 'activity', label: 'Bid Activity', icon: 'activity', navigations: '/profile' },
    { id: 'kyc', label: 'KYC Verification', icon: 'kyc', navigations: '/profile' },
    { id: 'dash', label: 'Dashboard', icon: 'dashboard', navigations: `${role == 'buyer' ? '/dashboard' : '/seller-dashboard'}` }
  ]

  const recentActivity = [
    { id: 1, action: 'Placed bid on', item: 'Vintage Rolex Watch', amount: '$2,500', time: '2 hours ago', status: 'active' },
    { id: 2, action: 'Won auction for', item: 'Antique Persian Rug', amount: '$3,200', time: '1 day ago', status: 'won' },
    { id: 3, action: 'Outbid on', item: 'Industrial Lathe Machine', amount: '$1,800', time: '2 days ago', status: 'lost' },
    { id: 4, action: 'Saved auction', item: 'Modern Art Painting', time: '3 days ago', status: 'saved' },
    { id: 5, action: 'Joined auction', item: 'Classic Car Collection', time: '1 week ago', status: 'joined' }
  ]

  const getIcon = (iconType) => {
    switch (iconType) {
      case 'profile':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      case 'contact':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      case 'security':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      case 'activity':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      case 'kyc':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      case 'dashboard':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 6H8C8.55228 6 9 5.55228 9 5V4C9 3.44772 8.55228 3 8 3H4C3.44772 3 3 3.44772 3 4V5C3 5.55228 3.44772 6 4 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 14H8C8.55228 14 9 13.5523 9 13V12C9 11.4477 8.55228 11 8 11H4C3.44772 11 3 11.4477 3 12V13C3 13.5523 3.44772 14 4 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 6H15C15.5523 6 16 5.55228 16 5V4C16 3.44772 15.5523 3 15 3H11C10.4477 3 10 3.44772 10 4V5C10 5.55228 10.4477 6 11 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 14H15C15.5523 14 16 13.5523 16 13V12C16 11.4477 15.5523 11 15 11H11C10.4477 11 10 11.4477 10 12V13C10 13.5523 10.4477 14 11 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="buyer-profile-page">
      <main className="buyer-profile-main">
        <div className="buyer-profile-container">
          <aside className="buyer-profile-sidebar">
            <div className="buyer-info-card">
              <div className="buyer-avatar-large">
                <div className="avatar-image">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="avatar-status"></div>
              </div>
              <div className="buyer-details">
                <h3 className="buyer-name">{formData.firstName} {formData.lastName}</h3>
                <p className="buyer-email">{formData.email}</p>
                <div className="buyer-meta">
                  <span className="member-since">Member since {formData.memberSince}</span>
                  <span className="buyer-tier">Gold Buyer</span>
                </div>
              </div>
            </div>

            <div className="buyer-stats">
              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 19H7C5.89543 19 5 18.1046 5 17V10C5 8.89543 5.89543 8 7 8H9M15 19H17C18.1046 19 19 18.1046 19 17V10C19 8.89543 18.1046 8 17 8H15M9 19V5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V19M9 19H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="stat-info">
                  <span className="stat-value">{formData.totalBids}</span>
                  <span className="stat-label">Total Bids</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="stat-info">
                  <span className="stat-value">{formData.wonAuctions}</span>
                  <span className="stat-label">Won Auctions</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="stat-info">
                  <span className="stat-value">{formData.successRate}</span>
                  <span className="stat-label">Success Rate</span>
                </div>
              </div>
            </div>
            <nav className="buyer-profile-menu">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`buyer-menu-item ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection(item.id)
                    navigate(`${item.navigations}`)
                  }
                  }
                >
                  <span className="menu-item-icon">{getIcon(item.icon)}</span>
                  <span className="menu-item-label">{item.label}</span>
                  <span className="menu-item-arrow">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
              ))}
              <button className="buyer-menu-item logout" onClick={() => navigate('/signin')}>
                <span className="menu-item-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="menu-item-label">Logout</span>
                <span className="menu-item-arrow"></span>
              </button>
            </nav>
          </aside>

          <div className="buyer-profile-content">
            <div className="content-header">
              <div className="header-info">
                <h1 className="content-title">
                  {activeSection === 'profile' && 'Profile Information'}
                  {activeSection === 'contact' && 'Contact Details'}
                  {activeSection === 'security' && 'Security Settings'}
                  {activeSection === 'activity' && 'Bid Activity'}
                  {activeSection === 'kyc' && 'KYC Verification'}
                </h1>
                <p className="content-subtitle">
                  {activeSection === 'profile' && 'Manage your personal information and preferences'}
                  {activeSection === 'contact' && 'Update your contact information and addresses'}
                  {activeSection === 'security' && 'Secure your account with password and 2FA'}
                  {activeSection === 'activity' && 'View your bidding history and activity'}
                  {activeSection === 'kyc' && 'Complete KYC verification for higher bidding limits'}
                </p>
              </div>
              {activeSection !== 'activity' && activeSection !== 'kyc' && (
                <button
                  className={`edit-toggle-btn ${isEditing ? 'active' : ''}`}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Done Editing
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Edit Profile
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Profile Section */}
            {activeSection === 'profile' && (
              <div className="profile-section">
                <div className="profile-form-card">
                  <div className="form-card-header">
                    <h3 className="form-card-title">Personal Information</h3>
                    <p className="form-card-subtitle">This information will be displayed publicly on your profile</p>
                  </div>
                  <form className="buyer-profile-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                      <div className="profile-form-group">
                        <label className="form-label">First Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="firstName"
                            className="profile-form-input"
                            value={formData.firstName}
                            onChange={handleChange}
                          />
                        ) : (
                          <div className="form-value">{formData.firstName}</div>
                        )}
                      </div>
                      <div className="profile-form-group">
                        <label className="form-label">Last Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="lastName"
                            className="profile-form-input"
                            value={formData.lastName}
                            onChange={handleChange}
                          />
                        ) : (
                          <div className="form-value">{formData.lastName}</div>
                        )}
                      </div>
                      <div className="profile-form-group">
                        <label className="form-label">Display Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="displayName"
                            className="profile-form-input"
                            value={formData.displayName}
                            onChange={handleChange}
                          />
                        ) : (
                          <div className="form-value">{formData.displayName}</div>
                        )}
                        <p className="form-hint">This is how your name appears to other users</p>
                      </div>
                      <div className="profile-form-group full-width">
                        <label className="form-label">Bio</label>
                        {isEditing ? (
                          <textarea
                            name="bio"
                            className="form-textarea"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="3"
                          />
                        ) : (
                          <div className="form-value">{formData.bio}</div>
                        )}
                      </div>
                    </div>
                    {isEditing && (
                      <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>
                          Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                          Save Changes
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}

            {/* Contact Section */}
            {activeSection === 'contact' && (
              <div className="contact-section">
                <div className="contact-form-card">
                  <div className="form-card-header">
                    <h3 className="form-card-title">Contact Information</h3>
                    <p className="form-card-subtitle">Update your contact details for notifications and shipping</p>
                  </div>
                  <form className="buyer-profile-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                      <div className="profile-form-group full-width">
                        <label className="form-label">Email Address</label>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            className="profile-form-input"
                            value={formData.email}
                            onChange={handleChange}
                          />
                        ) : (
                          <div className="form-value">{formData.email}</div>
                        )}
                      </div>
                      <div className="profile-form-group">
                        <label className="form-label">Phone Number</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phone"
                            className="profile-form-input"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        ) : (
                          <div className="form-value">{formData.phone}</div>
                        )}
                      </div>
                      <div className="profile-form-group full-width">
                        <label className="form-label">Street Address</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="address"
                            className="profile-form-input"
                            value={formData.address}
                            onChange={handleChange}
                          />
                        ) : (
                          <div className="form-value">{formData.address}</div>
                        )}
                      </div>
                      <div className="profile-form-group">
                        <label className="form-label">City</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="city"
                            className="profile-form-input"
                            value={formData.city}
                            onChange={handleChange}
                          />
                        ) : (
                          <div className="form-value">{formData.city}</div>
                        )}
                      </div>
                      <div className="profile-form-group">
                        <label className="form-label">State</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="state"
                            className="profile-form-input"
                            value={formData.state}
                            onChange={handleChange}
                          />
                        ) : (
                          <div className="form-value">{formData.state}</div>
                        )}
                      </div>
                      <div className="profile-form-group">
                        <label className="form-label">Zip Code</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="zipCode"
                            className="profile-form-input"
                            value={formData.zipCode}
                            onChange={handleChange}
                          />
                        ) : (
                          <div className="form-value">{formData.zipCode}</div>
                        )}
                      </div>
                      <div className="profile-form-group full-width">
                        <label className="form-label">Country</label>
                        {isEditing ? (
                          <select
                            name="country"
                            className="form-select"
                            value={formData.country}
                            onChange={handleChange}
                          >
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Australia">Australia</option>
                            <option value="Germany">Germany</option>
                          </select>
                        ) : (
                          <div className="form-value">{formData.country}</div>
                        )}
                      </div>
                    </div>
                    {isEditing && (
                      <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>
                          Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                          Save Changes
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <div className="security-section">
                <div className="security-form-card">
                  <div className="form-card-header">
                    <h3 className="form-card-title">Password & Security</h3>
                    <p className="form-card-subtitle">Update your password and enhance account security</p>
                  </div>
                  <form className="buyer-profile-form" onSubmit={handleSecuritySubmit}>
                    <div className="form-grid">
                      <div className="profile-form-group full-width">
                        <label className="form-label">Current Password</label>
                        <input
                          type="password"
                          name="currentPassword"
                          className="profile-form-input"
                          value={securityData.currentPassword}
                          onChange={handleSecurityChange}
                        />
                      </div>
                      <div className="profile-form-group">
                        <label className="form-label">New Password</label>
                        <input
                          type="password"
                          name="newPassword"
                          className="profile-form-input"
                          value={securityData.newPassword}
                          onChange={handleSecurityChange}
                        />
                      </div>
                      <div className="profile-form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          className="profile-form-input"
                          value={securityData.confirmPassword}
                          onChange={handleSecurityChange}
                        />
                      </div>
                      <div className="full-width">
                        <div className="password-requirements">
                          <h4>Password Requirements:</h4>
                          <ul>
                            <li>At least 8 characters long</li>
                            <li>Contains uppercase and lowercase letters</li>
                            <li>Includes at least one number</li>
                            <li>Includes at least one special character</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn-primary">
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>

                <div className="security-settings-card">
                  <div className="form-card-header">
                    <h3 className="form-card-title">Two-Factor Authentication</h3>
                    <p className="form-card-subtitle">Add an extra layer of security to your account</p>
                  </div>
                  <div className="security-settings">
                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>SMS Authentication</h4>
                        <p>Receive a code via SMS when signing in</p>
                      </div>
                      <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Authenticator App</h4>
                        <p>Use Google Authenticator or similar app</p>
                      </div>
                      <button className="btn-outline">Set Up</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Section */}
            {activeSection === 'activity' && (
              <div className="activity-section">
                <div className="activity-stats">
                  <div className="stat-card">
                    <div className="stat-card-icon bids">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 19H7C5.89543 19 5 18.1046 5 17V10C5 8.89543 5.89543 8 7 8H9M15 19H17C18.1046 19 19 18.1046 19 17V10C19 8.89543 18.1046 8 17 8H15M9 19V5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V19M9 19H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="stat-card-content">
                      <h4>Active Bids</h4>
                      <p className="stat-number">12</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-card-icon won">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="stat-card-content">
                      <h4>Won This Month</h4>
                      <p className="stat-number">8</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-card-icon spent">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="stat-card-content">
                      <h4>Total Spent</h4>
                      <p className="stat-number">$24,580</p>
                    </div>
                  </div>
                </div>

                <div className="activity-list">
                  <div className="activity-header">
                    <h3>Recent Activity</h3>
                    <button className="btn-outline">View All</button>
                  </div>
                  <div className="activity-items">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="activity-item">
                        <div className={`activity-icon ${activity.status}`}>
                          {activity.status === 'active' && '🔄'}
                          {activity.status === 'won' && '🏆'}
                          {activity.status === 'lost' && '❌'}
                          {activity.status === 'saved' && '💾'}
                          {activity.status === 'joined' && '👥'}
                        </div>
                        <div className="activity-content">
                          <div className="activity-title">
                            <span className="action">{activity.action}</span>
                            <span className="item">{activity.item}</span>
                            {activity.amount && <span className="amount">{activity.amount}</span>}
                          </div>
                          <div className="activity-time">{activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* KYC Section */}
            {activeSection === 'kyc' && (
              <div className="kyc-section">
                <div className="kyc-status-card">
                  <div className="kyc-status-header">
                    <div className="status-badge verified">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Verified Buyer</span>
                    </div>
                    <p className="status-description">
                      Your identity has been verified. You can participate in all auctions with higher bidding limits.
                    </p>
                  </div>
                  <div className="kyc-details">
                    <h4>Verification Details</h4>
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Level</span>
                        <span className="detail-value">Gold</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Verified On</span>
                        <span className="detail-value">Jan 15, 2024</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Bidding Limit</span>
                        <span className="detail-value">$100,000</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Documents</span>
                        <span className="detail-value">3 Uploaded</span>
                      </div>
                    </div>
                  </div>
                  <div className="kyc-actions">
                    <button className="btn-outline">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 15V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Download Documents
                    </button>
                    <button className="btn-primary">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Update Documents
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default BuyerProfile