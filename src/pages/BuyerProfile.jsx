import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BuyerProfile.css';
import { logout } from '../store/slices/authSlice';
import { useDispatch } from 'react-redux';

const BuyerProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
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
    successRate: '78%',
    buyerId: 'BYR-5847'
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const recentActivity = [
    { id: 1, action: 'Placed bid on', item: 'Vintage Rolex Watch', amount: '$2,500', time: '2 hours ago', status: 'active' },
    { id: 2, action: 'Won auction for', item: 'Antique Persian Rug', amount: '$3,200', time: '1 day ago', status: 'won' },
    { id: 3, action: 'Outbid on', item: 'Industrial Lathe Machine', amount: '$1,800', time: '2 days ago', status: 'lost' },
    { id: 4, action: 'Saved auction', item: 'Modern Art Painting', time: '3 days ago', status: 'saved' },
    { id: 5, action: 'Joined auction', item: 'Classic Car Collection', time: '1 week ago', status: 'joined' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSecurityChange = (e) => {
    setSecurityData({
      ...securityData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    console.log('Updating security:', securityData);
    setSecurityData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="buyer-profile-container">
      <div className="profile-header">
        <div className="header-content">
          <h1 className="profile-title">Buyer Profile</h1>
          <p className="profile-subtitle">Manage your account, track bids, and grow your collection</p>
        </div>
        <div className="header-actions">
          <button
            className={`b-action-btn ${isEditing ? 'b-secondary' : 'b-primary'}`}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Save Changes
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" />
                </svg>
                Edit Profile
              </>
            )}
          </button>
          {/* <button className="b-action-btn b-outline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 16v5h5M21 16v5h-5M16 3v5h5M8 3v5H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Export Data
          </button> */}
        </div>
      </div>

      <div className="profile-main">
        <div className="profile-left">
          <div className="profile-card">
            <div className="profile-avatar-section">
              <div className="avatar-wrapper">
                <div className="avatar">
                  <img
                    src="https://www.catholicsingles.com/wp-content/uploads/2020/06/blog-header-3.png"
                    alt=""
                  />
                  <div className="status-indicator"></div>
                </div>
                <button className="b-avatar-upload">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" />
                    <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <div className="profile-info">
                <h2 className="profile-name">{formData.firstName} {formData.lastName}</h2>
                <p className="profile-email">{formData.email}</p>
                <div className="verification-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Gold Buyer
                </div>
              </div>
            </div>

            <div className="profile-stats-grid">
              <div className="stat-card">
                <div className="stat-icon bids">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 19H7C5.89543 19 5 18.1046 5 17V10C5 8.89543 5.89543 8 7 8H9M15 19H17C18.1046 19 19 18.1046 19 17V10C19 8.89543 18.1046 8 17 8H15M9 19V5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V19M9 19H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{formData.totalBids}</div>
                  <div className="stat-label">Total Bids</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon won">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{formData.wonAuctions}</div>
                  <div className="stat-label">Won Auctions</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon success">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{formData.successRate}</div>
                  <div className="stat-label">Success Rate</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon spent">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-value">$24,580</div>
                  <div className="stat-label">Total Spent</div>
                </div>
              </div>
            </div>
          </div>

          <div className="quick-stats-card">
            <h3 className="card-title">Activity Overview</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Active Bids</span>
                <span className="stat-value primary">12</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Won This Month</span>
                <span className="stat-value">8</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Saved Items</span>
                <span className="stat-value success">15</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Member Since</span>
                <span className="stat-value warning">{formData.memberSince}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-right">
          <div className="profile-tabs">
            <button
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              Contact Info
            </button>
            <button
              className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              Security
            </button>
            <button
              className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              Activity
            </button>
            <button
              className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-content">
                <div className="info-section">
                  <h3 className="section-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    Personal Information
                  </h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>First Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="edit-input"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{formData.firstName}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Last Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="edit-input"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{formData.lastName}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Display Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="edit-input"
                          value={formData.displayName}
                          onChange={(e) => handleInputChange('displayName', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{formData.displayName}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Buyer ID</label>
                      <div className="info-value code">{formData.buyerId}</div>
                    </div>
                    <div className="info-item">
                      <label>Email Address</label>
                      {isEditing ? (
                        <input
                          type="email"
                          className="edit-input"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{formData.email}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Phone Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          className="edit-input"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{formData.phone}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="info-section">
                  <h3 className="section-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    Recent Activity
                  </h3>
                  <div className="activity-list">
                    {recentActivity.map(activity => (
                      <div key={activity.id} className="activity-item">
                        <div className="activity-icon">
                          <div className={`icon-circle ${activity.status}`}>
                            {activity.status === 'active' && '🔄'}
                            {activity.status === 'won' && '✓'}
                            {activity.status === 'lost' && '✗'}
                            {activity.status === 'saved' && '💾'}
                            {activity.status === 'joined' && '👥'}
                          </div>
                        </div>
                        <div className="activity-content">
                          <div className="activity-title">{activity.action} {activity.item}</div>
                          <div className="activity-meta">
                            {activity.amount && <span>{activity.amount}</span>}
                            <span className="activity-time">{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="contact-content">
                <div className="info-section">
                  <h3 className="section-title">Contact Details</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Street Address</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="edit-input"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{formData.address}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>City</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="edit-input"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{formData.city}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>State</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="edit-input"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{formData.state}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Zip Code</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="edit-input"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{formData.zipCode}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Country</label>
                      {isEditing ? (
                        <select
                          className="edit-input"
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                          <option value="Germany">Germany</option>
                        </select>
                      ) : (
                        <div className="info-value">{formData.country}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="security-content">
                <div className="info-section">
                  <h3 className="section-title">Password & Security</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Current Password</label>
                      <input
                        type="password"
                        className="edit-input"
                        value={securityData.currentPassword}
                        onChange={handleSecurityChange}
                        name="currentPassword"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div className="info-item">
                      <label>New Password</label>
                      <input
                        type="password"
                        className="edit-input"
                        value={securityData.newPassword}
                        onChange={handleSecurityChange}
                        name="newPassword"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="info-item">
                      <label>Confirm Password</label>
                      <input
                        type="password"
                        className="edit-input"
                        value={securityData.confirmPassword}
                        onChange={handleSecurityChange}
                        name="confirmPassword"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  <button className="b-action-btn primary-button b-primary" onClick={handleSecuritySubmit} style={{ marginTop: '1rem' }}>
                    Update Password
                  </button>
                </div>

                <div className="info-section">
                  <h3 className="section-title">Two-Factor Authentication</h3>
                  <div className="settings-grid">
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
                      <button className="action-btn outline small">Set Up</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="activity-content">
                <div className="info-section">
                  <h3 className="section-title">Bidding History</h3>
                  <div className="activity-list">
                    {recentActivity.map(activity => (
                      <div key={activity.id} className="activity-item">
                        <div className="activity-icon">
                          <div className={`icon-circle ${activity.status}`}>
                            {activity.status === 'active' && '🔄'}
                            {activity.status === 'won' && '✓'}
                            {activity.status === 'lost' && '✗'}
                            {activity.status === 'saved' && '💾'}
                            {activity.status === 'joined' && '👥'}
                          </div>
                        </div>
                        <div className="activity-content">
                          <div className="activity-title">{activity.action} {activity.item}</div>
                          <div className="activity-meta">
                            {activity.amount && <span>{activity.amount}</span>}
                            <span className="activity-time">{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="settings-content">
                <div className="info-section">
                  <h3 className="section-title">Account Settings</h3>
                  <div className="settings-grid">
                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Email Notifications</h4>
                        <p>Receive email updates about bids and auctions</p>
                      </div>
                      <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>SMS Notifications</h4>
                        <p>Get SMS alerts for important updates</p>
                      </div>
                      <label className="switch">
                        <input type="checkbox" />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Bid Reminders</h4>
                        <p>Get notified before auctions end</p>
                      </div>
                      <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="info-section">
                  <h3 className="section-title">Preferences</h3>
                  <div className="preferences-grid">
                    <div className="preference-item">
                      <label>Currency</label>
                      <select className="preference-select">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                      </select>
                    </div>
                    <div className="preference-item">
                      <label>Timezone</label>
                      <select className="preference-select">
                        <option>Eastern Time (ET)</option>
                        <option>Central Time (CT)</option>
                        <option>Pacific Time (PT)</option>
                      </select>
                    </div>
                    <div className="preference-item">
                      <label>Language</label>
                      <select className="preference-select">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="danger-zone">
                  <h3 className="section-title">Logout Here</h3>
                  <div className="danger-actions">
                    <button className="b-danger-btn red" onClick={() => {
                      dispatch(logout())
                      navigate('/signin', { replace: true })
                    }
                    }>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>

                <div className="danger-zone">
                  <h3 className="section-title">Danger Zone</h3>
                  <div className="danger-actions">
                    <button className="b-danger-btn red">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M10 11v6M14 11v6M5 7h14M6 7l1-4h10l1 4M8 7v-4h8v4" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerProfile;