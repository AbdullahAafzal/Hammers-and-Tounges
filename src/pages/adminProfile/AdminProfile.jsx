import React, { useState } from "react";
import "./AdminProfile.css";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    basicInfo: {
      fullName: "Admin Administrator",
      email: "admin@hammerandtongues.com",
      phone: "+1 (555) 987-6543",
      joinDate: "January 1, 2023",
      adminId: "ADM-001",
      role: "Platform Administrator",
      status: "Active",
      verificationLevel: "Super Admin",
      permissions: "Full System Access",
    },
    platformStats: {
      totalUsers: "2,847",
      totalAuctions: "1,924",
      activeAuctions: "147",
      completedAuctions: "1,482",
      totalRevenue: "$1,284,750",
      pendingApprovals: "23",
      disputeCases: "8",
      platformFees: "$128,475",
    },
    systemInfo: {
      lastLogin: "2 hours ago",
      lastLoginIp: "192.168.1.100",
      twoFactorEnabled: true,
      apiAccess: true,
      notificationLevel: "All",
      sessionTimeout: "30 minutes",
    },
    performance: {
      responseTime: "1.2 hours",
      resolutionRate: "98.5%",
      userSatisfaction: "94%",
      systemUptime: "99.9%",
    },
  });

  const recentActivities = [
    { id: 1, action: "Approved auction listing", auctionId: "#AUC-7892", time: "30 minutes ago", status: "completed" },
    { id: 2, action: "Suspended suspicious account", userId: "USR-456", time: "1 hour ago", status: "completed" },
    { id: 3, action: "Updated platform fees", details: "New fee structure", time: "3 hours ago", status: "success" },
    { id: 4, action: "Resolved dispute case", caseId: "DSP-123", time: "5 hours ago", status: "completed" },
    { id: 5, action: "Added new manager", email: "manager@example.com", time: "1 day ago", status: "success" },
    { id: 6, action: "System maintenance", details: "Database optimization", time: "2 days ago", status: "processing" },
  ];

  const pendingApprovals = [
    { id: 1, type: "Seller Registration", name: "John Smith", email: "john@example.com", submitted: "2 hours ago", status: "pending" },
    { id: 2, type: "Auction Listing", title: "Vintage Watch Collection", seller: "Luxury Watches Co.", submitted: "5 hours ago", status: "pending" },
    { id: 3, type: "KYC Verification", name: "Sarah Johnson", document: "Passport", submitted: "1 day ago", status: "pending" },
    { id: 4, type: "Withdrawal Request", amount: "$5,200", user: "Premium Seller", submitted: "1 day ago", status: "pending" },
    { id: 5, type: "Category Request", name: "Digital Art", submittedBy: "Art Gallery", submitted: "2 days ago", status: "pending" },
  ];

  const systemAlerts = [
    { id: 1, type: "warning", message: "Unusual login attempt detected", time: "10 minutes ago" },
    { id: 2, type: "info", message: "System backup completed", time: "2 hours ago" },
    { id: 3, type: "success", message: "All systems operational", time: "5 hours ago" },
    { id: 4, type: "warning", message: "High traffic detected on auction #789", time: "1 day ago" },
  ];

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, you would save to backend here
  };

  const handleInputChange = (section, field, value) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleApprove = (id) => {
    // Handle approval logic
    console.log(`Approved item ${id}`);
  };

  const handleReject = (id) => {
    // Handle rejection logic
    console.log(`Rejected item ${id}`);
  };

  return (
    <div className="admin-profile-container">
      <div className="admin-profile-header">
        <div className="admin-header-content">
          <h1 className="admin-profile-title">Admin Profile</h1>
          <p className="admin-profile-subtitle">System administration, user management, and platform oversight</p>
        </div>
        <div className="admin-header-actions">
          <button 
            className={`admin-action-btn ${isEditing ? 'admin-secondary' : 'admin-primary'}`}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Save Changes
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Edit Profile
              </>
            )}
          </button>
          <button 
            className="admin-action-btn admin-outline"
            onClick={() => navigate('/admin/dashboard')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2"/>
              <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Go to Dashboard
          </button>
          <button className="admin-action-btn admin-outline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 16v5h5M21 16v5h-5M16 3v5h5M8 3v5H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 8h5l-5-5v5zM8 8H3l5-5v5zM8 16H3l5 5v-5zM16 16h5l-5 5v-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Export Logs
          </button>
        </div>
      </div>

      <div className="admin-profile-main">
        <div className="admin-profile-left">
          <div className="admin-profile-card">
            <div className="admin-profile-avatar-section">
              <div className="admin-avatar-wrapper">
                <div className="admin-avatar">
                  <img 
                    src="https://www.catholicsingles.com/wp-content/uploads/2020/06/blog-header-3.png" 
                    alt="Admin"
                  />
                  <div className="admin-status-indicator"></div>
                </div>
                <button className="admin-avatar-upload">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <div className="admin-profile-info">
                <h2 className="admin-profile-name">{profileData.basicInfo.fullName}</h2>
                <p className="admin-profile-email">{profileData.basicInfo.email}</p>
                <div className="admin-verification-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {profileData.basicInfo.role}
                </div>
              </div>
            </div>

            <div className="admin-profile-stats-grid">
              <div className="adminn-stat-card">
                <div className="admin-stat-icon admin-revenue">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 1v22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="admin-stat-content">
                  <div className="admin-stat-value">{profileData.platformStats.totalUsers}</div>
                  <div className="admin-stat-label">Total Users</div>
                </div>
              </div>

              <div className="adminn-stat-card">
                <div className="admin-stat-icon admin-orders">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="admin-stat-content">
                  <div className="admin-stat-value">{profileData.platformStats.totalAuctions}</div>
                  <div className="admin-stat-label">Total Auctions</div>
                </div>
              </div>

              <div className="adminn-stat-card">
                <div className="admin-stat-icon admin-rating">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="admin-stat-content">
                  <div className="admin-stat-value">{profileData.platformStats.platformFees}</div>
                  <div className="admin-stat-label">Platform Fees</div>
                </div>
              </div>

              <div className="adminn-stat-card">
                <div className="admin-stat-icon admin-satisfaction">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="admin-stat-content">
                  <div className="admin-stat-value">{profileData.performance.systemUptime}</div>
                  <div className="admin-stat-label">System Uptime</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          {/* <div className="admin-quick-stats-card">
            <h3 className="admin-card-title">Platform Overview</h3>
            <div className="admin-stats-grid">
              <div className="admin-stat-item">
                <span className="admin-stat-label">Active Auctions</span>
                <span className="admin-stat-value admin-primary">{profileData.platformStats.activeAuctions}</span>
              </div>
              <div className="admin-stat-item">
                <span className="admin-stat-label">Pending Approvals</span>
                <span className="admin-stat-value admin-warning">{profileData.platformStats.pendingApprovals}</span>
              </div>
              <div className="admin-stat-item">
                <span className="admin-stat-label">Dispute Cases</span>
                <span className="admin-stat-value">{profileData.platformStats.disputeCases}</span>
              </div>
              <div className="admin-stat-item">
                <span className="admin-stat-label">User Satisfaction</span>
                <span className="admin-stat-value admin-success">{profileData.performance.userSatisfaction}</span>
              </div>
            </div>
          </div> */}

          {/* System Alerts */}
          {/* <div className="admin-alerts-card">
            <h3 className="admin-card-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="17" x2="12" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              System Alerts
            </h3>
            <div className="admin-alerts-list">
              {systemAlerts.map(alert => (
                <div key={alert.id} className={`admin-alert-item admin-${alert.type}`}>
                  <div className="admin-alert-icon">
                    {alert.type === 'warning' && '⚠️'}
                    {alert.type === 'info' && 'ℹ️'}
                    {alert.type === 'success' && '✅'}
                  </div>
                  <div className="admin-alert-content">
                    <div className="admin-alert-message">{alert.message}</div>
                    <div className="admin-alert-time">{alert.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>

        {/* Right Column - Tabs & Content */}
        <div className="admin-profile-right">
          {/* Tabs Navigation */}
          <div className="admin-profile-tabs">
            <button 
              className={`admin-tab-btn ${activeTab === 'overview' ? 'admin-active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`admin-tab-btn ${activeTab === 'approvals' ? 'admin-active' : ''}`}
              onClick={() => setActiveTab('approvals')}
            >
              Pending Approvals
            </button>
            <button 
              className={`admin-tab-btn ${activeTab === 'system' ? 'admin-active' : ''}`}
              onClick={() => setActiveTab('system')}
            >
              System Settings
            </button>
            <button 
              className={`admin-tab-btn ${activeTab === 'users' ? 'admin-active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              User Management
            </button>
            <button 
              className={`admin-tab-btn ${activeTab === 'security' ? 'admin-active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              Security
            </button>
          </div>

          {/* Tab Content */}
          <div className="admin-tab-content">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="admin-overview-content">
                {/* Basic Info */}
                <div className="admin-info-section">
                  <h3 className="admin-section-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Administrator Information
                  </h3>
                  <div className="admin-info-grid">
                    <div className="admin-info-item">
                      <label>Full Name</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          className="admin-edit-input"
                          value={profileData.basicInfo.fullName}
                          onChange={(e) => handleInputChange('basicInfo', 'fullName', e.target.value)}
                        />
                      ) : (
                        <div className="admin-info-value">{profileData.basicInfo.fullName}</div>
                      )}
                    </div>
                    <div className="admin-info-item">
                      <label>Email Address</label>
                      {isEditing ? (
                        <input 
                          type="email" 
                          className="admin-edit-input"
                          value={profileData.basicInfo.email}
                          onChange={(e) => handleInputChange('basicInfo', 'email', e.target.value)}
                        />
                      ) : (
                        <div className="admin-info-value">{profileData.basicInfo.email}</div>
                      )}
                    </div>
                    <div className="admin-info-item">
                      <label>Phone Number</label>
                      {isEditing ? (
                        <input 
                          type="tel" 
                          className="admin-edit-input"
                          value={profileData.basicInfo.phone}
                          onChange={(e) => handleInputChange('basicInfo', 'phone', e.target.value)}
                        />
                      ) : (
                        <div className="admin-info-value">{profileData.basicInfo.phone}</div>
                      )}
                    </div>
                    <div className="admin-info-item">
                      <label>Admin ID</label>
                      <div className="admin-info-value admin-code">{profileData.basicInfo.adminId}</div>
                    </div>
                    <div className="admin-info-item">
                      <label>Role</label>
                      <div className="admin-info-value">{profileData.basicInfo.role}</div>
                    </div>
                    <div className="admin-info-item">
                      <label>Member Since</label>
                      <div className="admin-info-value">{profileData.basicInfo.joinDate}</div>
                    </div>
                    <div className="admin-info-item">
                      <label>Permissions</label>
                      <div className="admin-info-value">{profileData.basicInfo.permissions}</div>
                    </div>
                    <div className="admin-info-item">
                      <label>Status</label>
                      <div className="admin-info-value">
                        <span className="admin-status-badge admin-active">Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="admin-info-section">
                  <h3 className="admin-section-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Recent Administrative Actions
                  </h3>
                  <div className="admin-activity-list">
                    {recentActivities.map(activity => (
                      <div key={activity.id} className="admin-activity-item">
                        <div className="admin-activity-icon">
                          <div className={`admin-icon-circle admin-${activity.status}`}>
                            {activity.status === 'completed' && '✓'}
                            {activity.status === 'success' && '✓'}
                            {activity.status === 'processing' && '⟳'}
                          </div>
                        </div>
                        <div className="admin-activity-content">
                          <div className="admin-activity-title">{activity.action}</div>
                          <div className="admin-activity-meta">
                            {activity.auctionId && <span>{activity.auctionId}</span>}
                            {activity.userId && <span>{activity.userId}</span>}
                            {activity.caseId && <span>{activity.caseId}</span>}
                            {activity.details && <span>{activity.details}</span>}
                            {activity.email && <span>{activity.email}</span>}
                            <span className="admin-activity-time">{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Pending Approvals Tab */}
            {activeTab === 'approvals' && (
              <div className="admin-approvals-content">
                <div className="admin-info-section">
                  <div className="admin-section-header">
                    <h3 className="admin-section-title">Pending Approvals</h3>
                    <div className="admin-approval-stats">
                      <span className="admin-stat-badge">{pendingApprovals.length} pending</span>
                    </div>
                  </div>
                  
                  <div className="admin-approvals-table">
                    <div className="admin-table-header">
                      <div className="admin-table-cell">Type</div>
                      <div className="admin-table-cell">Details</div>
                      <div className="admin-table-cell">Submitted</div>
                      <div className="admin-table-cell">Status</div>
                      <div className="admin-table-cell">Actions</div>
                    </div>
                    {pendingApprovals.map(approval => (
                      <div key={approval.id} className="admin-table-row">
                        <div className="admin-table-cell">
                          <div className="admin-approval-type">
                            <div className="admin-type-icon">
                              {approval.type === 'Seller Registration' && '👤'}
                              {approval.type === 'Auction Listing' && '🔨'}
                              {approval.type === 'KYC Verification' && '🪪'}
                              {approval.type === 'Withdrawal Request' && '💰'}
                              {approval.type === 'Category Request' && '📁'}
                            </div>
                            <span>{approval.type}</span>
                          </div>
                        </div>
                        <div className="admin-table-cell">
                          <div className="admin-approval-details">
                            <div className="admin-detail-name">{approval.name || approval.title}</div>
                            <div className="admin-detail-email">{approval.email || approval.seller || approval.user || approval.submittedBy}</div>
                            {approval.amount && <div className="admin-detail-amount">{approval.amount}</div>}
                            {approval.document && <div className="admin-detail-document">{approval.document}</div>}
                          </div>
                        </div>
                        <div className="admin-table-cell">
                          <div className="admin-submitted-time">{approval.submitted}</div>
                        </div>
                        <div className="admin-table-cell">
                          <span className="admin-status-badge admin-pending">Pending</span>
                        </div>
                        <div className="admin-table-cell">
                          <div className="admin-approval-actions">
                            <button 
                              className="admin-action-btn admin-primary admin-small"
                              onClick={() => handleApprove(approval.id)}
                            >
                              Approve
                            </button>
                            <button 
                              className="admin-action-btn admin-outline admin-small"
                              onClick={() => handleReject(approval.id)}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* System Settings Tab */}
            {activeTab === 'system' && (
              <div className="admin-system-content">
                <div className="admin-info-section">
                  <h3 className="admin-section-title">Platform Configuration</h3>
                  <div className="admin-settings-grid">
                    <div className="admin-setting-item">
                      <div className="admin-setting-info">
                        <h4>Platform Fees</h4>
                        <p>Commission percentage charged on successful auctions</p>
                      </div>
                      <div className="admin-setting-value">
                        {isEditing ? (
                          <input 
                            type="number" 
                            className="admin-edit-input admin-small"
                            defaultValue="10"
                          />
                        ) : (
                          <span>10%</span>
                        )}
                      </div>
                    </div>
                    <div className="admin-setting-item">
                      <div className="admin-setting-info">
                        <h4>Auction Duration</h4>
                        <p>Default duration for new auctions</p>
                      </div>
                      <div className="admin-setting-value">
                        {isEditing ? (
                          <select className="admin-edit-input admin-small">
                            <option>24 hours</option>
                            <option>48 hours</option>
                            <option>72 hours</option>
                            <option>7 days</option>
                          </select>
                        ) : (
                          <span>48 hours</span>
                        )}
                      </div>
                    </div>
                    <div className="admin-setting-item">
                      <div className="admin-setting-info">
                        <h4>Auto-Approval Threshold</h4>
                        <p>Maximum value for auto-approval of auctions</p>
                      </div>
                      <div className="admin-setting-value">
                        {isEditing ? (
                          <input 
                            type="text" 
                            className="admin-edit-input admin-small"
                            defaultValue="$5,000"
                          />
                        ) : (
                          <span>$5,000</span>
                        )}
                      </div>
                    </div>
                    <div className="admin-setting-item">
                      <div className="admin-setting-info">
                        <h4>Maintenance Mode</h4>
                        <p>Temporarily disable the platform for maintenance</p>
                      </div>
                      <label className="admin-switch">
                        <input type="checkbox" />
                        <span className="admin-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="admin-info-section">
                  <h3 className="admin-section-title">Email Notifications</h3>
                  <div className="admin-settings-grid">
                    <div className="admin-setting-item">
                      <div className="admin-setting-info">
                        <h4>Admin Notifications</h4>
                        <p>Receive emails for important system events</p>
                      </div>
                      <label className="admin-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="admin-slider"></span>
                      </label>
                    </div>
                    <div className="admin-setting-item">
                      <div className="admin-setting-info">
                        <h4>User Registration Alerts</h4>
                        <p>Notify when new users register</p>
                      </div>
                      <label className="admin-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="admin-slider"></span>
                      </label>
                    </div>
                    <div className="admin-setting-item">
                      <div className="admin-setting-info">
                        <h4>Auction Approval Alerts</h4>
                        <p>Notify when auctions need approval</p>
                      </div>
                      <label className="admin-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="admin-slider"></span>
                      </label>
                    </div>
                    <div className="admin-setting-item">
                      <div className="admin-setting-info">
                        <h4>Dispute Alerts</h4>
                        <p>Notify when disputes are filed</p>
                      </div>
                      <label className="admin-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="admin-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* User Management Tab */}
            {activeTab === 'users' && (
              <div className="admin-users-content">
                <div className="admin-info-section">
                  <div className="admin-section-header">
                    <h3 className="admin-section-title">User Management</h3>
                    <div className="admin-user-filters">
                      <select className="admin-filter-select">
                        <option>All Users</option>
                        <option>Sellers</option>
                        <option>Buyers</option>
                        <option>Managers</option>
                      </select>
                      <input 
                        type="text" 
                        placeholder="Search users..."
                        className="admin-search-input"
                      />
                    </div>
                  </div>
                  
                  <div className="admin-users-table">
                    <div className="admin-table-header">
                      <div className="admin-table-cell">User</div>
                      <div className="admin-table-cell">Role</div>
                      <div className="admin-table-cell">Status</div>
                      <div className="admin-table-cell">Joined</div>
                      <div className="admin-table-cell">Actions</div>
                    </div>
                    
                    {/* Sample User Data */}
                    <div className="admin-table-row">
                      <div className="admin-table-cell">
                        <div className="admin-user-info">
                          <div className="admin-user-avatar">JD</div>
                          <div className="admin-user-details">
                            <div className="admin-user-name">John Doe</div>
                            <div className="admin-user-email">john@example.com</div>
                          </div>
                        </div>
                      </div>
                      <div className="admin-table-cell">
                        <span className="admin-role-badge admin-seller">Seller</span>
                      </div>
                      <div className="admin-table-cell">
                        <span className="admin-status-badge admin-active">Active</span>
                      </div>
                      <div className="admin-table-cell">Jan 15, 2024</div>
                      <div className="admin-table-cell">
                        <div className="admin-user-actions">
                          <button className="admin-icon-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                          </button>
                          <button className="admin-icon-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                          </button>
                          <button className="admin-icon-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2"/>
                              <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="admin-table-row">
                      <div className="admin-table-cell">
                        <div className="admin-user-info">
                          <div className="admin-user-avatar">SA</div>
                          <div className="admin-user-details">
                            <div className="admin-user-name">Sarah Adams</div>
                            <div className="admin-user-email">sarah@example.com</div>
                          </div>
                        </div>
                      </div>
                      <div className="admin-table-cell">
                        <span className="admin-role-badge admin-buyer">Buyer</span>
                      </div>
                      <div className="admin-table-cell">
                        <span className="admin-status-badge admin-active">Active</span>
                      </div>
                      <div className="admin-table-cell">Feb 20, 2024</div>
                      <div className="admin-table-cell">
                        <div className="admin-user-actions">
                          <button className="admin-icon-btn">👁️</button>
                          <button className="admin-icon-btn">✏️</button>
                          <button className="admin-icon-btn">🚫</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="admin-security-content">
                <div className="admin-info-section">
                  <h3 className="admin-section-title">Security Settings</h3>
                  <div className="admin-settings-grid">
                    <div className="admin-setting-item">
                      <div className="admin-setting-info">
                        <h4>Two-Factor Authentication</h4>
                        <p>Require 2FA for all admin accounts</p>
                      </div>
                      <label className="admin-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="admin-slider"></span>
                      </label>
                    </div>
                    <div className="admin-setting-item">
                      <div className="admin-setting-info">
                        <h4>Session Timeout</h4>
                        <p>Auto-logout after inactivity</p>
                      </div>
                      <div className="admin-setting-value">
                        <select className="admin-edit-input admin-small">
                          <option>15 minutes</option>
                          <option>30 minutes</option>
                          <option>1 hour</option>
                          <option>4 hours</option>
                        </select>
                      </div>
                    </div>
                    <div className="admin-setting-item">
                      <div className="admin-setting-info">
                        <h4>IP Whitelisting</h4>
                        <p>Restrict admin access to specific IPs</p>
                      </div>
                      <label className="admin-switch">
                        <input type="checkbox" />
                        <span className="admin-slider"></span>
                      </label>
                    </div>
                    <div className="admin-setting-item">
                      <div className="admin-setting-info">
                        <h4>Login Attempts</h4>
                        <p>Maximum failed attempts before lockout</p>
                      </div>
                      <div className="admin-setting-value">
                        <input 
                          type="number" 
                          className="admin-edit-input admin-small"
                          defaultValue="5"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="admin-info-section">
                  <h3 className="admin-section-title">Audit Log</h3>
                  <div className="admin-audit-log">
                    <div className="admin-log-entry">
                      <div className="admin-log-icon">🔐</div>
                      <div className="admin-log-content">
                        <div className="admin-log-action">Password changed</div>
                        <div className="admin-log-details">From IP: 192.168.1.100 • 2 hours ago</div>
                      </div>
                    </div>
                    <div className="admin-log-entry">
                      <div className="admin-log-icon">👤</div>
                      <div className="admin-log-content">
                        <div className="admin-log-action">User account suspended</div>
                        <div className="admin-log-details">User ID: USR-456 • 5 hours ago</div>
                      </div>
                    </div>
                    <div className="admin-log-entry">
                      <div className="admin-log-icon">⚙️</div>
                      <div className="admin-log-content">
                        <div className="admin-log-action">System settings updated</div>
                        <div className="admin-log-details">Platform fees changed • 1 day ago</div>
                      </div>
                    </div>
                    <div className="admin-log-entry">
                      <div className="admin-log-icon">📧</div>
                      <div className="admin-log-content">
                        <div className="admin-log-action">Email configuration updated</div>
                        <div className="admin-log-details">SMTP settings changed • 2 days ago</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="admin-danger-zone">
                  <h3 className="admin-section-title">Danger Zone</h3>
                  <div className="admin-danger-actions">
                    <button className="admin-danger-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Clear System Cache
                    </button>
                    <button className="admin-danger-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Reset All Passwords
                    </button>
                    <button className="admin-danger-btn admin-red" onClick={()=> navigate('/signin', {replace: true})}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2"/>
                        <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Logout All Users
                    </button>
                    <button className="admin-danger-btn admin-red">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6h18M5 6l1 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-13M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Purge Database
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

export default AdminProfile;