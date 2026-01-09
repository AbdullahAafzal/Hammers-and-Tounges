import React, { useState, useEffect } from "react";
import "./SellerProfile.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";

const SellerProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    display_name: "",
    phone: "",
    bio: "",
    email: "",
    image: "",
    seller_profile: {
      business_name: "",
      business_reg_no: "",
      id_front: null,
      id_back: null,
      driving_license_front: null,
      driving_license_back: null,
      passport_front: null,
      verified: false,
    },
    profile_completion_status: "incomplete",
  });

  // Mock API call - replace with actual API integration
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // Replace with your actual API call
        // const response = await fetch('/api/seller/profile');
        // const data = await response.json();
        
        // Mock data matching your API response
        const mockData = {
          first_name: "Abdullah",
          last_name: "Ab",
          display_name: null,
          phone: "073424242",
          bio: "Harare",
          email: "Abdullah@yopmail.com",
          image: "http://207.180.233.44:8001/media/users/7/images/123f714f441e48d687716d166b741416.jpg",
          seller_profile: {
            business_name: "Test",
            business_reg_no: "Test",
            id_front: null,
            id_back: null,
            driving_license_front: null,
            driving_license_back: null,
            passport_front: null,
            verified: false
          },
          buyer_profile: null,
          profile_completion_status: "incomplete"
        };
        
        setProfileData(mockData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const [performanceStats] = useState([
    { id: 1, label: "Total Sales", value: "$0", icon: "revenue", color: "#8CC63F" },
    { id: 2, label: "Total Orders", value: "0", icon: "orders", color: "#3B82F6" },
    { id: 3, label: "Avg Rating", value: "0.0", icon: "rating", color: "#F59E0B" },
    { id: 4, label: "Response Rate", value: "0%", icon: "response", color: "#8B5CF6" },
  ]);

  const [recentActivities] = useState([]); // Empty array - will be populated via API
  const [topProducts] = useState([]); // Empty array - will be populated via API

  const handleSave = async () => {
    try {
      // API call to update profile
      setIsEditing(false);
      // Add your API update logic here
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSellerProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      seller_profile: {
        ...prev.seller_profile,
        [field]: value
      }
    }));
  };

  // Render empty states
  const renderEmptyState = (type) => {
    const emptyStates = {
      activities: (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 className="empty-state-title">No Recent Activities</h3>
          <p className="empty-state-description">
            Your recent activities will appear here once you start using your seller account.
          </p>
        </div>
      ),
      products: (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h3 className="empty-state-title">No Products Yet</h3>
          <p className="empty-state-description">
            You haven't added any products yet. Start by creating your first listing.
          </p>
          <button 
            className="action-button primary"
            onClick={() => navigate('/seller/product')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add First Product
          </button>
        </div>
      ),
      documents: (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="2"/>
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 className="empty-state-title">No Documents Uploaded</h3>
          <p className="empty-state-description">
            Upload your KYC documents to get verified and unlock all seller features.
          </p>
        </div>
      ),
      loading: (
        <div className="empty-state">
          <div className="loading-spinner"></div>
          <h3 className="empty-state-title">Loading Profile...</h3>
        </div>
      )
    };

    return emptyStates[type] || null;
  };

  // Format display name
  const getDisplayName = () => {
    if (profileData.display_name) return profileData.display_name;
    return `${profileData.first_name} ${profileData.last_name}`.trim() || "Seller";
  };

  // Get verification status
  const getVerificationStatus = () => {
    return profileData.seller_profile.verified ? "Verified" : "Not Verified";
  };

  if (loading) {
    return (
      <div className="seller-profile-container">
        {renderEmptyState("loading")}
      </div>
    );
  }

  return (
    <div className="seller-profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="header-content">
          <h1 className="profile-title">Seller Profile</h1>
          <p className="profile-subtitle">Manage your account, business details, and verification</p>
        </div>
        <div className="header-actions">
          <button
            className={`s-action-btn ${isEditing ? 's-secondary' : 's-primary'}`}
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
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-main">
        {/* Left Column - Profile Summary */}
        <div className="profile-left">
          <div className="profile-card">
            {/* Avatar Section */}
            <div className="profile-avatar-section">
              <div className="avatar-wrapper">
                <div className="avatar">
                  <img
                    src={profileData.image || "https://www.catholicsingles.com/wp-content/uploads/2020/06/blog-header-3.png"}
                    alt={getDisplayName()}
                    onError={(e) => {
                      e.target.src = "https://www.catholicsingles.com/wp-content/uploads/2020/06/blog-header-3.png";
                    }}
                  />
                  <div className={`status-indicator ${profileData.seller_profile.verified ? 'verified' : 'unverified'}`}></div>
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
                <h2 className="profile-name">{getDisplayName()}</h2>
                <p className="profile-email">{profileData.email}</p>
                <div className={`verification-badge ${profileData.seller_profile.verified ? 'verified' : 'unverified'}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    {profileData.seller_profile.verified && (
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    )}
                  </svg>
                  {getVerificationStatus()}
                </div>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="completion-section">
              <div className="completion-header">
                <span>Profile Completion</span>
                <span className="completion-percentage">
                  {profileData.profile_completion_status === "complete" ? "100%" : "60%"}
                </span>
              </div>
              <div className="completion-bar">
                <div 
                  className="completion-fill" 
                  style={{ 
                    width: profileData.profile_completion_status === "complete" ? "100%" : "60%" 
                  }}
                ></div>
              </div>
              <p className="completion-note">
                Complete your profile to unlock all seller features
              </p>
            </div>

            {/* Performance Stats */}
            <div className="profile-stats-grid">
              {performanceStats.map(stat => (
                <div key={stat.id} className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: `${stat.color}15` }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      {stat.icon === 'revenue' && (
                        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" stroke={stat.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      )}
                      {stat.icon === 'orders' && (
                        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke={stat.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      )}
                      {stat.icon === 'rating' && (
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={stat.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      )}
                      {stat.icon === 'response' && (
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke={stat.color} strokeWidth="2" />
                      )}
                    </svg>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Tabs & Content */}
        <div className="profile-right">
          {/* Tabs Navigation */}
          <div className="profile-tabs">
            <button
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`tab-btn ${activeTab === 'business' ? 'active' : ''}`}
              onClick={() => setActiveTab('business')}
            >
              Business Info
            </button>
            <button
              className={`tab-btn ${activeTab === 'kyc' ? 'active' : ''}`}
              onClick={() => setActiveTab('kyc')}
            >
              KYC Documents
            </button>
            <button
              className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              Products
            </button>
            <button
              className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="overview-content">
                {/* Personal Info */}
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
                          value={profileData.first_name}
                          onChange={(e) => handleInputChange('first_name', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{profileData.first_name || "Not set"}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Last Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="edit-input"
                          value={profileData.last_name}
                          onChange={(e) => handleInputChange('last_name', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{profileData.last_name || "Not set"}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Display Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="edit-input"
                          value={profileData.display_name || ""}
                          onChange={(e) => handleInputChange('display_name', e.target.value)}
                          placeholder="Optional display name"
                        />
                      ) : (
                        <div className="info-value">{profileData.display_name || "Not set"}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Email Address</label>
                      <div className="info-value">{profileData.email}</div>
                    </div>
                    <div className="info-item">
                      <label>Phone Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          className="edit-input"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{profileData.phone || "Not set"}</div>
                      )}
                    </div>
                    <div className="info-item full-width">
                      <label>Bio / Description</label>
                      {isEditing ? (
                        <textarea
                          className="edit-input"
                          value={profileData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          rows="3"
                          placeholder="Tell buyers about yourself..."
                        />
                      ) : (
                        <div className="info-value">{profileData.bio || "No bio added yet"}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="info-section">
                  <h3 className="section-title">Recent Activities</h3>
                  {recentActivities.length > 0 ? (
                    <div className="activities-list">
                      {recentActivities.map(activity => (
                        <div key={activity.id} className="activity-item">
                          <div className="activity-content">
                            <div className="activity-title">{activity.action}</div>
                            <div className="activity-time">{activity.time}</div>
                          </div>
                          <span className={`s-status-badge ${activity.status}`}>
                            {activity.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    renderEmptyState("activities")
                  )}
                </div>
              </div>
            )}

            {/* Business Info Tab */}
            {activeTab === 'business' && (
              <div className="business-content">
                <div className="info-section">
                  <h3 className="section-title">Business Details</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Business Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="edit-input"
                          value={profileData.seller_profile.business_name}
                          onChange={(e) => handleSellerProfileChange('business_name', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{profileData.seller_profile.business_name || "Not set"}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Business Registration Number</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="edit-input"
                          value={profileData.seller_profile.business_reg_no}
                          onChange={(e) => handleSellerProfileChange('business_reg_no', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{profileData.seller_profile.business_reg_no || "Not set"}</div>
                      )}
                    </div>
                    <div className="info-item full-width">
                      <label>Verification Status</label>
                      <div className="info-value">
                        <span className={`verification-status ${profileData.seller_profile.verified ? 'verified' : 'pending'}`}>
                          {profileData.seller_profile.verified ? "✓ Verified" : "⏳ Pending Verification"}
                        </span>
                        {!profileData.seller_profile.verified && (
                          <p className="verification-note">
                            Complete KYC verification to get verified seller status
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* KYC Documents Tab */}
            {activeTab === 'kyc' && (
              <div className="kyc-content">
                <div className="info-section">
                  <h3 className="section-title">Identity Verification Documents</h3>
                  <p className="section-subtitle">
                    Upload your documents to complete KYC verification. All documents are securely encrypted.
                  </p>
                  
                  <div className="documents-grid">
                    {/* ID Card Front */}
                    <div className="document-card">
                      <div className="document-header">
                        <h4>ID Card - Front</h4>
                        {profileData.seller_profile.id_front && (
                          <span className="document-status uploaded">Uploaded</span>
                        )}
                      </div>
                      <div className="document-preview">
                        {profileData.seller_profile.id_front ? (
                          <img src={profileData.seller_profile.id_front} alt="ID Front" />
                        ) : (
                          <div className="document-placeholder">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2"/>
                              <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <p>No document uploaded</p>
                          </div>
                        )}
                      </div>
                      <button className="document-upload-btn">
                        {profileData.seller_profile.id_front ? "Change File" : "Upload File"}
                      </button>
                    </div>

                    {/* ID Card Back */}
                    <div className="document-card">
                      <div className="document-header">
                        <h4>ID Card - Back</h4>
                        {profileData.seller_profile.id_back && (
                          <span className="document-status uploaded">Uploaded</span>
                        )}
                      </div>
                      <div className="document-preview">
                        {profileData.seller_profile.id_back ? (
                          <img src={profileData.seller_profile.id_back} alt="ID Back" />
                        ) : (
                          <div className="document-placeholder">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2"/>
                              <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <p>No document uploaded</p>
                          </div>
                        )}
                      </div>
                      <button className="document-upload-btn">
                        {profileData.seller_profile.id_back ? "Change File" : "Upload File"}
                      </button>
                    </div>

                    {/* Passport */}
                    <div className="document-card">
                      <div className="document-header">
                        <h4>Passport</h4>
                        {profileData.seller_profile.passport_front && (
                          <span className="document-status uploaded">Uploaded</span>
                        )}
                      </div>
                      <div className="document-preview">
                        {profileData.seller_profile.passport_front ? (
                          <img src={profileData.seller_profile.passport_front} alt="Passport" />
                        ) : (
                          <div className="document-placeholder">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                              <path d="M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            <p>No document uploaded</p>
                          </div>
                        )}
                      </div>
                      <button className="document-upload-btn">
                        {profileData.seller_profile.passport_front ? "Change File" : "Upload File"}
                      </button>
                    </div>
                  </div>

                  {!profileData.seller_profile.id_front && !profileData.seller_profile.id_back && !profileData.seller_profile.passport_front && (
                    renderEmptyState("documents")
                  )}

                  <div className="kyc-instructions">
                    <h4>Instructions:</h4>
                    <ul>
                      <li>Upload clear, high-quality images</li>
                      <li>Ensure all text is readable</li>
                      <li>File size should be less than 5MB</li>
                      <li>Accepted formats: JPG, PNG, PDF</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="products-content">
                <div className="products-header">
                  <h3 className="section-title">Your Products</h3>
                  <button 
                    className="s-action-btn s-outline small" 
                    onClick={() => navigate('/seller/product')}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Add Product
                  </button>
                </div>

                {topProducts.length > 0 ? (
                  <div className="products-table">
                    <div className="table-header">
                      <div className="table-cell">Product</div>
                      <div className="table-cell">Price</div>
                      <div className="table-cell">Status</div>
                      <div className="table-cell">Actions</div>
                    </div>
                    {topProducts.map(product => (
                      <div key={product.id} className="table-row">
                        <div className="table-cell product-name">
                          <div className="product-avatar">📦</div>
                          <span>{product.name}</span>
                        </div>
                        <div className="table-cell price">{product.price}</div>
                        <div className="table-cell">
                          <span className={`status-badge ${product.status}`}>
                            {product.status}
                          </span>
                        </div>
                        <div className="table-cell">
                          <div className="product-actions">
                            <button className="icon-btn" title="View">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            </button>
                            <button className="icon-btn" title="Edit">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  renderEmptyState("products")
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="settings-content">
                <div className="info-section">
                  <h3 className="section-title">Security Settings</h3>
                  <div className="settings-grid">
                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Change Password</h4>
                        <p>Update your account password</p>
                      </div>
                      <button 
                        className="action-btn outline small"
                        onClick={() => navigate('/seller/change-password')}
                      >
                        Change
                      </button>
                    </div>
                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Two-Factor Authentication</h4>
                        <p>Add extra security to your account</p>
                      </div>
                      <button className="action-btn outline small">Enable</button>
                    </div>
                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Email Notifications</h4>
                        <p>Receive updates about orders and promotions</p>
                      </div>
                      <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="danger-zone">
                  <h3 className="section-title">Account Actions</h3>
                  <div className="danger-actions">
                    <button 
                      className="danger-btn"
                      onClick={() => {
                        dispatch(logout());
                        navigate('/signin', { replace: true });
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="2"/>
                        <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Logout
                    </button>
                    <button className="danger-btn red">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6h18M5 6l1 13a2 2 0 002 2h8a2 2 0 002-2l1-13M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2"/>
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

export default SellerProfile;