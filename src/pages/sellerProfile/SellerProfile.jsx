import React, { useState } from "react";
import "./SellerProfile.css";

const SellerProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    basicInfo: {
      fullName: "Alexandra Chen",
      email: "alexandra@luxuryjewelry.co",
      phone: "+1 (555) 123-4567",
      joinDate: "March 15, 2022",
      sellerId: "SLR-7892",
      storeName: "Luxury Jewelry Emporium",
      category: "Jewelry & Accessories",
      status: "Verified",
      verificationLevel: "Gold",
    },
    businessInfo: {
      businessType: "Registered Business",
      taxId: "TAX-789-456-123",
      businessAddress: "123 Fashion Avenue, New York, NY 10001",
      shippingOrigin: "United States",
      returnAddress: "456 Return Lane, New York, NY 10002",
    },
    performance: {
      totalSales: "$284,750",
      totalOrders: 892,
      avgRating: 4.8,
      responseRate: "98%",
      responseTime: "2.4 hours",
      completionRate: "99.2%",
      disputeRate: "0.8%",
    },
    statistics: {
      monthlyRevenue: "$42,500",
      activeListings: 147,
      visitors: "12.5K",
      conversionRate: "3.8%",
      customerSatisfaction: "96%",
    },
    bankDetails: {
      bankName: "Global Commerce Bank",
      accountName: "Luxury Jewelry Emporium",
      accountNumber: "**** **** **** 7890",
      routingNumber: "*****1234",
      currency: "USD",
    },
  });

  const recentActivities = [
    { id: 1, action: "New order received", orderId: "#ORD-7892", time: "2 hours ago", status: "completed" },
    { id: 2, action: "Product listed", product: "Diamond Necklace", time: "5 hours ago", status: "success" },
    { id: 3, action: "Customer review received", rating: 5, time: "1 day ago", status: "completed" },
    { id: 4, action: "Withdrawal processed", amount: "$5,200", time: "2 days ago", status: "processing" },
    { id: 5, action: "Store updated", section: "Policies", time: "3 days ago", status: "success" },
  ];

  const topProducts = [
    { id: 1, name: "Emerald Ring", price: "$1,299", sales: 42, stock: 15 },
    { id: 2, name: "Gold Bracelet", price: "$850", sales: 38, stock: 22 },
    { id: 3, name: "Pearl Earrings", price: "$625", sales: 31, stock: 8 },
    { id: 4, name: "Sapphire Pendant", price: "$1,850", sales: 27, stock: 12 },
    { id: 5, name: "Diamond Watch", price: "$3,200", sales: 19, stock: 5 },
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

  return (
    <div className="seller-profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="header-content">
          <h1 className="profile-title">Seller Profile</h1>
          <p className="profile-subtitle">Manage your store, track performance, and grow your business</p>
        </div>
        <div className="header-actions">
          <button 
            className={`action-btn ${isEditing ? 'secondary' : 'primary'}`}
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
          <button className="action-btn outline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 16v5h5M21 16v5h-5M16 3v5h5M8 3v5H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 8h5l-5-5v5zM8 8H3l5-5v5zM8 16H3l5 5v-5zM16 16h5l-5 5v-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Export Data
          </button>
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
                <button className="avatar-upload">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <div className="profile-info">
                <h2 className="profile-name">{profileData.basicInfo.fullName}</h2>
                <p className="profile-email">{profileData.basicInfo.email}</p>
                <div className="verification-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {profileData.basicInfo.verificationLevel} Seller
                </div>
              </div>
            </div>

            <div className="profile-stats-grid">
              <div className="stat-card">
                <div className="stat-icon revenue">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 1v22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{profileData.performance.totalSales}</div>
                  <div className="stat-label">Total Sales</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon orders">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{profileData.performance.totalOrders}</div>
                  <div className="stat-label">Total Orders</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon rating">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{profileData.performance.avgRating}</div>
                  <div className="stat-label">Avg Rating</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon satisfaction">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{profileData.performance.responseRate}</div>
                  <div className="stat-label">Response Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="quick-stats-card">
            <h3 className="card-title">Performance Overview</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Monthly Revenue</span>
                <span className="stat-value primary">{profileData.statistics.monthlyRevenue}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Active Listings</span>
                <span className="stat-value">{profileData.statistics.activeListings}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Conversion Rate</span>
                <span className="stat-value success">{profileData.statistics.conversionRate}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Satisfaction</span>
                <span className="stat-value warning">{profileData.statistics.customerSatisfaction}</span>
              </div>
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
              className={`tab-btn ${activeTab === 'financial' ? 'active' : ''}`}
              onClick={() => setActiveTab('financial')}
            >
              Financial
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
                {/* Basic Info */}
                <div className="info-section">
                  <h3 className="section-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Basic Information
                  </h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Full Name</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          className="edit-input"
                          value={profileData.basicInfo.fullName}
                          onChange={(e) => handleInputChange('basicInfo', 'fullName', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{profileData.basicInfo.fullName}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Email Address</label>
                      {isEditing ? (
                        <input 
                          type="email" 
                          className="edit-input"
                          value={profileData.basicInfo.email}
                          onChange={(e) => handleInputChange('basicInfo', 'email', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{profileData.basicInfo.email}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Phone Number</label>
                      {isEditing ? (
                        <input 
                          type="tel" 
                          className="edit-input"
                          value={profileData.basicInfo.phone}
                          onChange={(e) => handleInputChange('basicInfo', 'phone', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{profileData.basicInfo.phone}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Seller ID</label>
                      <div className="info-value code">{profileData.basicInfo.sellerId}</div>
                    </div>
                    <div className="info-item">
                      <label>Store Name</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          className="edit-input"
                          value={profileData.basicInfo.storeName}
                          onChange={(e) => handleInputChange('basicInfo', 'storeName', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{profileData.basicInfo.storeName}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Member Since</label>
                      <div className="info-value">{profileData.basicInfo.joinDate}</div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="info-section">
                  <h3 className="section-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Recent Activity
                  </h3>
                  <div className="activity-list">
                    {recentActivities.map(activity => (
                      <div key={activity.id} className="activity-item">
                        <div className="activity-icon">
                          <div className={`icon-circle ${activity.status}`}>
                            {activity.status === 'completed' && '✓'}
                            {activity.status === 'success' && '✓'}
                            {activity.status === 'processing' && '⟳'}
                          </div>
                        </div>
                        <div className="activity-content">
                          <div className="activity-title">{activity.action}</div>
                          <div className="activity-meta">
                            {activity.orderId && <span>{activity.orderId}</span>}
                            {activity.product && <span>{activity.product}</span>}
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

            {/* Business Info Tab */}
            {activeTab === 'business' && (
              <div className="business-content">
                <div className="info-section">
                  <h3 className="section-title">Business Details</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Business Type</label>
                      {isEditing ? (
                        <select 
                          className="edit-input"
                          value={profileData.businessInfo.businessType}
                          onChange={(e) => handleInputChange('businessInfo', 'businessType', e.target.value)}
                        >
                          <option value="Registered Business">Registered Business</option>
                          <option value="Individual">Individual</option>
                          <option value="Partnership">Partnership</option>
                          <option value="Corporation">Corporation</option>
                        </select>
                      ) : (
                        <div className="info-value">{profileData.businessInfo.businessType}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Tax ID / EIN</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          className="edit-input"
                          value={profileData.businessInfo.taxId}
                          onChange={(e) => handleInputChange('businessInfo', 'taxId', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{profileData.businessInfo.taxId}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Business Address</label>
                      {isEditing ? (
                        <textarea 
                          className="edit-input"
                          value={profileData.businessInfo.businessAddress}
                          onChange={(e) => handleInputChange('businessInfo', 'businessAddress', e.target.value)}
                          rows="2"
                        />
                      ) : (
                        <div className="info-value">{profileData.businessInfo.businessAddress}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Shipping Origin</label>
                      {isEditing ? (
                        <select 
                          className="edit-input"
                          value={profileData.businessInfo.shippingOrigin}
                          onChange={(e) => handleInputChange('businessInfo', 'shippingOrigin', e.target.value)}
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                          <option value="Germany">Germany</option>
                        </select>
                      ) : (
                        <div className="info-value">{profileData.businessInfo.shippingOrigin}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Return Address</label>
                      {isEditing ? (
                        <textarea 
                          className="edit-input"
                          value={profileData.businessInfo.returnAddress}
                          onChange={(e) => handleInputChange('businessInfo', 'returnAddress', e.target.value)}
                          rows="2"
                        />
                      ) : (
                        <div className="info-value">{profileData.businessInfo.returnAddress}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Financial Tab */}
            {activeTab === 'financial' && (
              <div className="financial-content">
                <div className="info-section">
                  <h3 className="section-title">Bank Account Details</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Bank Name</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          className="edit-input"
                          value={profileData.bankDetails.bankName}
                          onChange={(e) => handleInputChange('bankDetails', 'bankName', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{profileData.bankDetails.bankName}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Account Name</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          className="edit-input"
                          value={profileData.bankDetails.accountName}
                          onChange={(e) => handleInputChange('bankDetails', 'accountName', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{profileData.bankDetails.accountName}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Account Number</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          className="edit-input"
                          value={profileData.bankDetails.accountNumber}
                          onChange={(e) => handleInputChange('bankDetails', 'accountNumber', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{profileData.bankDetails.accountNumber}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Routing Number</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          className="edit-input"
                          value={profileData.bankDetails.routingNumber}
                          onChange={(e) => handleInputChange('bankDetails', 'routingNumber', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{profileData.bankDetails.routingNumber}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Currency</label>
                      {isEditing ? (
                        <select 
                          className="edit-input"
                          value={profileData.bankDetails.currency}
                          onChange={(e) => handleInputChange('bankDetails', 'currency', e.target.value)}
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="CAD">CAD ($)</option>
                          <option value="AUD">AUD ($)</option>
                        </select>
                      ) : (
                        <div className="info-value">{profileData.bankDetails.currency}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payout History */}
                <div className="info-section">
                  <h3 className="section-title">Recent Payouts</h3>
                  <div className="payouts-table">
                    <div className="table-header">
                      <div className="table-cell">Date</div>
                      <div className="table-cell">Amount</div>
                      <div className="table-cell">Status</div>
                      <div className="table-cell">Reference</div>
                    </div>
                    <div className="table-row">
                      <div className="table-cell">Jan 15, 2024</div>
                      <div className="table-cell amount">$8,425.50</div>
                      <div className="table-cell"><span className="status-badge completed">Completed</span></div>
                      <div className="table-cell">PAY-789-456</div>
                    </div>
                    <div className="table-row">
                      <div className="table-cell">Jan 8, 2024</div>
                      <div className="table-cell amount">$7,920.25</div>
                      <div className="table-cell"><span className="status-badge completed">Completed</span></div>
                      <div className="table-cell">PAY-789-455</div>
                    </div>
                    <div className="table-row">
                      <div className="table-cell">Jan 1, 2024</div>
                      <div className="table-cell amount">$9,150.75</div>
                      <div className="table-cell"><span className="status-badge completed">Completed</span></div>
                      <div className="table-cell">PAY-789-454</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="products-content">
                <div className="products-header">
                  <h3 className="section-title">Top Performing Products</h3>
                  <button className="action-btn outline small">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Add Product
                  </button>
                </div>
                
                <div className="products-table">
                  <div className="table-header">
                    <div className="table-cell">Product</div>
                    <div className="table-cell">Price</div>
                    <div className="table-cell">Sales</div>
                    <div className="table-cell">Stock</div>
                    <div className="table-cell">Actions</div>
                  </div>
                  {topProducts.map(product => (
                    <div key={product.id} className="table-row">
                      <div className="table-cell product-name">
                        <div className="product-avatar">💎</div>
                        <span>{product.name}</span>
                      </div>
                      <div className="table-cell price">{product.price}</div>
                      <div className="table-cell">
                        <span className="sales-badge">{product.sales} sold</span>
                      </div>
                      <div className="table-cell">
                        <span className={`stock-badge ${product.stock < 10 ? 'low' : 'good'}`}>
                          {product.stock} units
                        </span>
                      </div>
                      <div className="table-cell">
                        <div className="product-actions">
                          <button className="icon-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                          </button>
                          <button className="icon-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                          </button>
                          <button className="icon-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M3 6h18M5 6l1 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-13M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="settings-content">
                <div className="info-section">
                  <h3 className="section-title">Account Settings</h3>
                  <div className="settings-grid">
                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Email Notifications</h4>
                        <p>Receive email updates about orders and promotions</p>
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
                        <h4>Two-Factor Authentication</h4>
                        <p>Add an extra layer of security to your account</p>
                      </div>
                      <button className="action-btn outline small">Enable</button>
                    </div>
                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Auto Withdrawal</h4>
                        <p>Automatically transfer funds to your bank account</p>
                      </div>
                      <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="info-section">
                  <h3 className="section-title">Store Preferences</h3>
                  <div className="preferences-grid">
                    <div className="preference-item">
                      <label>Store Currency</label>
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
                  <h3 className="section-title">Danger Zone</h3>
                  <div className="danger-actions">
                    <button className="danger-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6h18M5 6l1 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-13M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Delete All Products
                    </button>
                    <button className="danger-btn red">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M10 11v6M14 11v6M5 7h14M6 7l1-4h10l1 4M8 7v-4h8v4" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Close Store Account
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