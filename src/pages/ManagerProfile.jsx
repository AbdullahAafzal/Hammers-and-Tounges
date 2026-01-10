import React, { useState } from "react";
import "./ManagerProfile.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
const ManagerProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    basicInfo: {
      fullName: "Michael Chen",
      email: "michael.chen@manager.com",
      phone: "+1 (555) 987-6543",
      joinDate: "June 15, 2023",
      employeeId: "MGR-0421",
      department: "Vehicles & Luxury Goods",
      role: "Senior Auction Manager",
      status: "Active",
      verificationLevel: "Level 3",
      reportingTo: "Regional Director"
    },
    departmentInfo: {
      teamSize: 8,
      assignedSellers: 147,
      totalAuctions: 892,
      departmentBudget: "$1,250,000",
      location: "New York Office",
      workHours: "9:00 AM - 6:00 PM EST",
      officeExtension: "Ext. 421",
      clearanceLevel: "High"
    },
    performance: {
      inspectionsCompleted: 124,
      approvalRate: "94.5%",
      avgProcessingTime: "2.4 days",
      sellerSatisfaction: "4.7/5.0",
      disputeResolution: "98%",
      kycVerified: 89,
      auctionsPublished: 342,
      revenueManaged: "$8.2M"
    },
    statistics: {
      currentWorkload: 12,
      pendingApprovals: 8,
      draftAuctions: 5,
      liveAuctions: 15,
      escalationCases: 2,
      teamPerformance: "A+"
    },
    bankDetails: {
      bankName: "Global Commerce Bank",
      accountName: "Michael Chen",
      accountNumber: "**** **** **** 7890",
      routingNumber: "*****1234",
      currency: "USD",
      salaryAccount: true,
      lastSalary: "$8,250.00"
    }
  });

  const recentActivities = [
    { id: 1, action: "Completed inspection for BMW M3", auctionId: "#AUC-7892", time: "2 hours ago", status: "completed", priority: "high" },
    { id: 2, action: "Approved seller verification", seller: "John Smith", time: "5 hours ago", status: "success", priority: "medium" },
    { id: 3, action: "Published auction: Classic Car", auction: "Vintage Mercedes", time: "1 day ago", status: "published", priority: "medium" },
    { id: 4, action: "Resolved dispute case", caseId: "#DIS-421", time: "2 days ago", status: "resolved", priority: "high" },
    { id: 5, action: "Assigned inspection task", assignee: "Team Member", time: "3 days ago", status: "assigned", priority: "low" }
  ];

  const assignedSellers = [
    { id: 1, name: "Luxury Jewelry Emporium", auctions: 24, revenue: "$284,500", rating: 4.8 },
    { id: 2, name: "Prime Properties", auctions: 18, revenue: "$192,300", rating: 4.9 },
    { id: 3, name: "Classic Cars Inc.", auctions: 15, revenue: "$156,800", rating: 4.7 },
    { id: 4, name: "Art Gallery Co.", auctions: 12, revenue: "$128,400", rating: 4.6 },
    { id: 5, name: "Electronics Hub", auctions: 8, revenue: "$89,500", rating: 4.5 }
  ];

  const handleSave = () => {
    setIsEditing(false);
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

  const getActivityIcon = (status) => {
    const icons = {
      completed: "✅",
      success: "✓",
      published: "🚀",
      resolved: "⚖️",
      assigned: "📋"
    };
    return icons[status] || "📝";
  };

  return (
    <div className="mp-container">
      <div className="mp-header">
        <div className="mp-header-content">
          <h1 className="mp-title">Manager Profile</h1>
          <p className="mp-subtitle">Oversight dashboard for auction management and operational control</p>
        </div>
        <div className="mp-header-actions">
          <button
            className={`mp-btn mp-btn-primary ${isEditing ? "mp-btn-secondary" : ""}`}
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
          {/* <button className="mp-btn mp-btn-outline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 16v5h5M21 16v5h-5M16 3v5h5M8 3v5H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 8h5l-5-5v5zM8 8H3l5-5v5zM8 16H3l5 5v-5zM16 16h5l-5 5v-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Export Report
          </button> */}
        </div>
      </div>

      <div className="mp-main">
        <div className="mp-left">
          <div className="mp-card">
            <div className="mp-avatar-section">
              <div className="mp-avatar-wrapper">
                <div className="mp-avatar">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80" alt="Manager" />
                  <div className="mp-status-indicator"></div>
                </div>
                <button className="mp-avatar-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <div className="mp-profile-info">
                <h2 className="mp-name">{profileData.basicInfo.fullName}</h2>
                <p className="mp-email">{profileData.basicInfo.email}</p>
                <div className="mp-badge mp-badge-verify">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {profileData.basicInfo.verificationLevel} Clearance
                </div>
                <div className="mp-badge mp-badge-role">{profileData.basicInfo.role}</div>
              </div>
            </div>

            <div className="mp-stats-grid">
              <div className="mp-stat-card mp-stat-inspections">
                <div className="mp-stat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="mp-stat-content">
                  <div className="mp-stat-value">{profileData.performance.inspectionsCompleted}</div>
                  <div className="mp-stat-label">Inspections</div>
                </div>
              </div>

              <div className="mp-stat-card mp-stat-approval">
                <div className="mp-stat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="mp-stat-content">
                  <div className="mp-stat-value">{profileData.performance.approvalRate}</div>
                  <div className="mp-stat-label">Approval Rate</div>
                </div>
              </div>

              <div className="mp-stat-card mp-stat-time">
                <div className="mp-stat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="mp-stat-content">
                  <div className="mp-stat-value">{profileData.performance.avgProcessingTime}</div>
                  <div className="mp-stat-label">Avg Processing</div>
                </div>
              </div>

              <div className="mp-stat-card mp-stat-satisfaction">
                <div className="mp-stat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="mp-stat-content">
                  <div className="mp-stat-value">{profileData.performance.sellerSatisfaction}</div>
                  <div className="mp-stat-label">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mp-dept-card">
            <h3 className="mp-card-title">Department Overview</h3>
            <div className="mp-dept-stats">
              <div className="mp-dept-item">
                <span className="mp-dept-label">Team Size</span>
                <span className="mp-dept-value mp-text-primary">{profileData.departmentInfo.teamSize}</span>
              </div>
              <div className="mp-dept-item">
                <span className="mp-dept-label">Assigned Sellers</span>
                <span className="mp-dept-value">{profileData.departmentInfo.assignedSellers}</span>
              </div>
              <div className="mp-dept-item">
                <span className="mp-dept-label">Total Auctions</span>
                <span className="mp-dept-value mp-text-success">{profileData.departmentInfo.totalAuctions}</span>
              </div>
              <div className="mp-dept-item">
                <span className="mp-dept-label">Budget</span>
                <span className="mp-dept-value mp-text-warning">{profileData.departmentInfo.departmentBudget}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mp-right">
          <div className="mp-tabs">
            <button className={`mp-tab-btn ${activeTab === "overview" ? "mp-tab-active" : ""}`} onClick={() => setActiveTab("overview")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2"/>
                <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Overview
            </button>
            <button className={`mp-tab-btn ${activeTab === "department" ? "mp-tab-active" : ""}`} onClick={() => setActiveTab("department")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Department
            </button>
            <button className={`mp-tab-btn ${activeTab === "performance" ? "mp-tab-active" : ""}`} onClick={() => setActiveTab("performance")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Performance
            </button>
            <button className={`mp-tab-btn ${activeTab === "financial" ? "mp-tab-active" : ""}`} onClick={() => setActiveTab("financial")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 1v22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Financial
            </button>
            <button className={`mp-tab-btn ${activeTab === "sellers" ? "mp-tab-active" : ""}`} onClick={() => setActiveTab("sellers")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sellers
            </button>
            <button className={`mp-tab-btn ${activeTab === "settings" ? "mp-tab-active" : ""}`} onClick={() => setActiveTab("settings")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Settings
            </button>
          </div>

          <div className="mp-tab-content">
            {activeTab === "overview" && (
              <div className="mp-overview">
                <div className="mp-section">
                  <h3 className="mp-section-title">Manager Information</h3>
                  <div className="mp-info-grid">
                    <div className="mp-info-item">
                      <label>Full Name</label>
                      {isEditing ? (
                        <input type="text" className="mp-input" value={profileData.basicInfo.fullName} onChange={(e) => handleInputChange("basicInfo", "fullName", e.target.value)} />
                      ) : (
                        <div className="mp-info-value">{profileData.basicInfo.fullName}</div>
                      )}
                    </div>
                    <div className="mp-info-item">
                      <label>Email Address</label>
                      {isEditing ? (
                        <input type="email" className="mp-input" value={profileData.basicInfo.email} onChange={(e) => handleInputChange("basicInfo", "email", e.target.value)} />
                      ) : (
                        <div className="mp-info-value">{profileData.basicInfo.email}</div>
                      )}
                    </div>
                    <div className="mp-info-item">
                      <label>Phone Number</label>
                      {isEditing ? (
                        <input type="tel" className="mp-input" value={profileData.basicInfo.phone} onChange={(e) => handleInputChange("basicInfo", "phone", e.target.value)} />
                      ) : (
                        <div className="mp-info-value">{profileData.basicInfo.phone}</div>
                      )}
                    </div>
                    <div className="mp-info-item">
                      <label>Employee ID</label>
                      <div className="mp-info-value mp-info-code">{profileData.basicInfo.employeeId}</div>
                    </div>
                    <div className="mp-info-item">
                      <label>Department</label>
                      {isEditing ? (
                        <select className="mp-input" value={profileData.basicInfo.department} onChange={(e) => handleInputChange("basicInfo", "department", e.target.value)}>
                          <option>Vehicles & Luxury Goods</option>
                          <option>Real Estate</option>
                          <option>Art & Collectibles</option>
                        </select>
                      ) : (
                        <div className="mp-info-value">{profileData.basicInfo.department}</div>
                      )}
                    </div>
                    <div className="mp-info-item">
                      <label>Reports To</label>
                      <div className="mp-info-value">{profileData.basicInfo.reportingTo}</div>
                    </div>
                    <div className="mp-info-item">
                      <label>Member Since</label>
                      <div className="mp-info-value">{profileData.basicInfo.joinDate}</div>
                    </div>
                    <div className="mp-info-item">
                      <label>Status</label>
                      <div className="mp-info-value"><span className="mp-status-badge">{profileData.basicInfo.status}</span></div>
                    </div>
                  </div>
                </div>

                <div className="mp-section">
                  <h3 className="mp-section-title">Recent Activity</h3>
                  <div className="mp-activity-list">
                    {recentActivities.map(activity => (
                      <div key={activity.id} className={`mp-activity-item mp-priority-${activity.priority}`}>
                        <div className="mp-activity-icon" data-status={activity.status}>{getActivityIcon(activity.status)}</div>
                        <div className="mp-activity-content">
                          <div className="mp-activity-action">{activity.action}</div>
                          <div className="mp-activity-meta">
                            {activity.auctionId && <span className="mp-meta-tag">{activity.auctionId}</span>}
                            {activity.seller && <span className="mp-meta-tag">{activity.seller}</span>}
                            {activity.caseId && <span className="mp-meta-tag">{activity.caseId}</span>}
                            {activity.assignee && <span className="mp-meta-tag">{activity.assignee}</span>}
                            <span className="mp-time">{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "department" && (
              <div className="mp-section">
                <h3 className="mp-section-title">Department Details</h3>
                <div className="mp-info-grid">
                  <div className="mp-info-item">
                    <label>Location</label>
                    <div className="mp-info-value">{profileData.departmentInfo.location}</div>
                  </div>
                  <div className="mp-info-item">
                    <label>Team Size</label>
                    <div className="mp-info-value">{profileData.departmentInfo.teamSize} members</div>
                  </div>
                  <div className="mp-info-item">
                    <label>Work Hours</label>
                    <div className="mp-info-value">{profileData.departmentInfo.workHours}</div>
                  </div>
                  <div className="mp-info-item">
                    <label>Office Extension</label>
                    <div className="mp-info-value">{profileData.departmentInfo.officeExtension}</div>
                  </div>
                  <div className="mp-info-item">
                    <label>Budget</label>
                    <div className="mp-info-value">{profileData.departmentInfo.departmentBudget}</div>
                  </div>
                  <div className="mp-info-item">
                    <label>Clearance Level</label>
                    <div className="mp-info-value"><span className="mp-clearance-badge">{profileData.departmentInfo.clearanceLevel}</span></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "performance" && (
              <div className="mp-overview">
                <div className="mp-section">
                  <h3 className="mp-section-title">Performance Metrics</h3>
                  <div className="mp-metrics-grid">
                    <div className="mp-metric">
                      <div className="mp-metric-header">
                        <span className="mp-metric-label">Inspections</span>
                        <span className="mp-metric-trend mp-trend-positive">↑ 12%</span>
                      </div>
                      <div className="mp-metric-value">{profileData.performance.inspectionsCompleted}</div>
                      <div className="mp-metric-bar"><div className="mp-metric-fill" style={{width: "94%"}}></div></div>
                    </div>
                    <div className="mp-metric">
                      <div className="mp-metric-header">
                        <span className="mp-metric-label">Approval Rate</span>
                        <span className="mp-metric-trend mp-trend-positive">↑ 2.1%</span>
                      </div>
                      <div className="mp-metric-value">{profileData.performance.approvalRate}</div>
                      <div className="mp-metric-bar"><div className="mp-metric-fill" style={{width: "94.5%"}}></div></div>
                    </div>
                    <div className="mp-metric">
                      <div className="mp-metric-header">
                        <span className="mp-metric-label">Resolution Rate</span>
                        <span className="mp-metric-trend mp-trend-positive">↑ 3%</span>
                      </div>
                      <div className="mp-metric-value">{profileData.performance.disputeResolution}</div>
                      <div className="mp-metric-bar"><div className="mp-metric-fill" style={{width: "98%"}}></div></div>
                    </div>
                  </div>
                </div>

                <div className="mp-section">
                  <h3 className="mp-section-title">Current Workload</h3>
                  <div className="mp-workload-grid">
                    <div className="mp-workload-item"><span className="mp-workload-label">Pending</span><span className="mp-workload-value mp-text-warning">{profileData.statistics.currentWorkload}</span></div>
                    <div className="mp-workload-item"><span className="mp-workload-label">Approvals</span><span className="mp-workload-value mp-text-warning">{profileData.statistics.pendingApprovals}</span></div>
                    <div className="mp-workload-item"><span className="mp-workload-label">Drafts</span><span className="mp-workload-value mp-text-info">{profileData.statistics.draftAuctions}</span></div>
                    <div className="mp-workload-item"><span className="mp-workload-label">Live</span><span className="mp-workload-value mp-text-success">{profileData.statistics.liveAuctions}</span></div>
                    <div className="mp-workload-item"><span className="mp-workload-label">Escalations</span><span className="mp-workload-value mp-text-danger">{profileData.statistics.escalationCases}</span></div>
                    <div className="mp-workload-item"><span className="mp-workload-label">Performance</span><span className="mp-workload-value mp-text-primary">{profileData.statistics.teamPerformance}</span></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "financial" && (
              <div className="mp-section">
                <h3 className="mp-section-title">Bank Account Details</h3>
                <div className="mp-info-grid">
                  <div className="mp-info-item">
                    <label>Bank Name</label>
                    <div className="mp-info-value">{profileData.bankDetails.bankName}</div>
                  </div>
                  <div className="mp-info-item">
                    <label>Account Name</label>
                    <div className="mp-info-value">{profileData.bankDetails.accountName}</div>
                  </div>
                  <div className="mp-info-item">
                    <label>Account Number</label>
                    <div className="mp-info-value">{profileData.bankDetails.accountNumber}</div>
                  </div>
                  <div className="mp-info-item">
                    <label>Routing Number</label>
                    <div className="mp-info-value">{profileData.bankDetails.routingNumber}</div>
                  </div>
                  <div className="mp-info-item">
                    <label>Currency</label>
                    <div className="mp-info-value">{profileData.bankDetails.currency}</div>
                  </div>
                  <div className="mp-info-item">
                    <label>Account Type</label>
                    <div className="mp-info-value"><span className="mp-account-badge">{profileData.bankDetails.salaryAccount ? "Salary Account" : "Regular Account"}</span></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "sellers" && (
              <div className="mp-section">
                <div className="mp-sellers-header">
                  <h3 className="mp-section-title">Assigned Sellers</h3>
                  <button className="mp-btn mp-btn-outline mp-btn-small">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Add
                  </button>
                </div>
                <div className="mp-sellers-table">
                  <div className="mp-table-header">
                    <div className="mp-table-cell">Seller</div>
                    <div className="mp-table-cell">Auctions</div>
                    <div className="mp-table-cell">Revenue</div>
                    <div className="mp-table-cell">Rating</div>
                    <div className="mp-table-cell">Status</div>
                  </div>
                  {assignedSellers.map(seller => (
                    <div key={seller.id} className="mp-table-row">
                      <div className="mp-table-cell mp-seller-cell">
                        <div className="mp-seller-avatar">{seller.name.charAt(0)}</div>
                        <span>{seller.name}</span>
                      </div>
                      <div className="mp-table-cell"><span className="mp-auction-badge">{seller.auctions}</span></div>
                      <div className="mp-table-cell mp-revenue">{seller.revenue}</div>
                      <div className="mp-table-cell"><span className="mp-rating-badge">{seller.rating} ★</span></div>
                      <div className="mp-table-cell"><span className={`mp-seller-status ${seller.rating >= 4.5 ? "mp-status-verified" : "mp-status-pending"}`}>{seller.rating >= 4.5 ? "Verified" : "Pending"}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="mp-overview">
                <div className="mp-section">
                  <h3 className="mp-section-title">Account Settings</h3>
                  <div className="mp-settings-grid">
                    <div className="mp-setting-item">
                      <div className="mp-setting-info">
                        <h4>Email Notifications</h4>
                        <p>Receive email updates</p>
                      </div>
                      <label className="mp-toggle">
                        <input type="checkbox" defaultChecked />
                        <span className="mp-toggle-slider"></span>
                      </label>
                    </div>
                    <div className="mp-setting-item">
                      <div className="mp-setting-info">
                        <h4>Escalation Alerts</h4>
                        <p>Get notifications for escalations</p>
                      </div>
                      <label className="mp-toggle">
                        <input type="checkbox" defaultChecked />
                        <span className="mp-toggle-slider"></span>
                      </label>
                    </div>
                    <div className="mp-setting-item">
                      <div className="mp-setting-info">
                        <h4>Two-Factor Authentication</h4>
                        <p>Add extra security</p>
                      </div>
                      <button className="mp-btn mp-btn-outline mp-btn-small">Enable 2FA</button>
                    </div>
                    <div className="mp-setting-item">
                      <div className="mp-setting-info">
                        <h4>Auto-Reports</h4>
                        <p>Generate weekly reports</p>
                      </div>
                      <label className="mp-toggle">
                        <input type="checkbox" defaultChecked />
                        <span className="mp-toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mp-section">
                  <h3 className="mp-section-title">Work Preferences</h3>
                  <div className="mp-prefs-grid">
                    <div className="mp-pref-item">
                      <label>Currency</label>
                      <select className="mp-select">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                      </select>
                    </div>
                    <div className="mp-pref-item">
                      <label>Timezone</label>
                      <select className="mp-select">
                        <option>Eastern Time (ET)</option>
                        <option>Central Time (CT)</option>
                        <option>Pacific Time (PT)</option>
                      </select>
                    </div>
                    <div className="mp-pref-item">
                      <label>Language</label>
                      <select className="mp-select">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                    <div className="mp-pref-item">
                      <label>Items Per Page</label>
                      <select className="mp-select">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mp-danger-zone">
                  <h3 className="mp-section-title">Session Management</h3>
                  <div className="mp-danger-actions">
                    <button className="mp-danger-btn" onClick={() => navigate("/manager/dashboard")}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2"/>
                        <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Back to Dashboard
                    </button>
                    <button className="mp-danger-btn mp-danger-red" onClick={() => 
                      {
                        dispatch(logout())
                        navigate("/signin", {replace: true})
                      }
                      }>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2"/>
                        <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Logout
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

export default ManagerProfile;
