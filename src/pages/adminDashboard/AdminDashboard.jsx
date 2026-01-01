
import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";

// Lazy load images for better performance
const Car1 = lazy(() => import('../../assets/admin-assests/1.png'));
const Car2 = lazy(() => import('../../assets/admin-assests/2.png'));
const Car3 = lazy(() => import('../../assets/admin-assests/3.png'));
const Car4 = lazy(() => import('../../assets/admin-assests/4.png'));

// Separate mock data to reduce bundle size
const mockAuctionsData = {
  "count": 4,
  "total_pages": 1,
  "current_page": 1,
  "results": [
    {
      "id": 8,
      "title": "BMW",
      "description": "It is well mainted.",
      "status": "APPROVED",
      "category_name": "Vehicles",
      "created_at": "2025-12-24T11:07:02.361996Z",
      "updated_at": "2025-12-31T09:02:34.005167Z",
      "rejection_reason": "",
      "specific_data": {},
      "handover_type": "PICKUP",
      "delivery_datetime": "2025-12-24T11:05:37Z",
      "pickup_address": "test",
      "pickup_latitude": "54.550000",
      "pickup_longitude": "654.999996",
      "currency": "USD",
      "initial_price": "5000.00",
      "is_buy_now_enabled": false,
      "buy_now_price": "7500.00",
      "start_date": "2024-12-30T10:00:00Z",
      "end_date": "2025-01-05T10:00:00Z",
      "extended_time_seconds": 0,
      "seller_details": {
        "id": 10,
        "name": "Imran Ahmad",
        "email": "ahsas@yopmail.com",
        "business_name": "",
        "is_verified": false,
        "profile_image": null
      },
      "manager_details": {
        "id": 38,
        "email": "manager@yopmail.com",
        "first_name": "seller",
        "last_name": "user",
        "profile_image": null
      },
      "media": [
        {
          "id": 13,
          "media_type": "image",
          "file": Car1,
          "label": "BMW IMG"
        }
      ],
      "bids": []
    },
    {
      "id": 6,
      "title": "BMW m3",
      "description": "Well-maintained Corolla, single owner, 55,000 km.",
      "status": "ACTIVE",
      "category_name": "Vehicles",
      "created_at": "2025-12-23T17:39:27.969869Z",
      "updated_at": "2025-12-23T17:42:32.995777Z",
      "rejection_reason": "",
      "specific_data": {
        "make": "Toyota",
        "year": 2018,
        "model": "Corolla"
      },
      "handover_type": "PICKUP",
      "delivery_datetime": null,
      "pickup_address": "Street 12, Karachi, Pakistan",
      "pickup_latitude": "24.860700",
      "pickup_longitude": "67.001100",
      "currency": "USD",
      "initial_price": "7999.98",
      "is_buy_now_enabled": false,
      "buy_now_price": null,
      "start_date": "2025-12-23T17:41:57Z",
      "end_date": "2025-12-24T00:00:00Z",
      "extended_time_seconds": 0,
      "seller_details": {
        "id": 7,
        "name": "Abdullah Afzal",
        "email": "Abdullah@yopmail.com",
        "business_name": "Test",
        "is_verified": false,
        "profile_image": "/media/users/7/images/123f714f441e48d687716d166b741416.jpg"
      },
      "manager_details": {
        "id": 1,
        "email": "admin@gmail.com",
        "first_name": "",
        "last_name": "",
        "profile_image": null
      },
      "media": [
        {
          "id": 10,
          "media_type": "image",
          "file": Car2,
          "label": "gallery_3"
        },
        {
          "id": 11,
          "media_type": "image",
          "file": "/media/auctions/media/car5_MkSELOW.png",
          "label": "gallery_4"
        },
        {
          "id": 12,
          "media_type": "file",
          "file": "/media/auctions/media/Advance_Pyhton_Roadmap_Outine_Ans_Mustafa_7DhTEEv.pdf",
          "label": "inspection_report"
        }
      ],
      "bids": []
    },
    {
      "id": 5,
      "title": "BMW m2",
      "description": "Well-maintained Corolla, single owner, 55,000 km.",
      "status": "ACTIVE",
      "category_name": "Vehicles",
      "created_at": "2025-12-23T17:38:56.277674Z",
      "updated_at": "2025-12-23T17:41:39.898000Z",
      "rejection_reason": "",
      "specific_data": {
        "make": "Toyota",
        "year": 2018,
        "model": "Corolla"
      },
      "handover_type": "PICKUP",
      "delivery_datetime": null,
      "pickup_address": "Street 12, Karachi, Pakistan",
      "pickup_latitude": "24.860700",
      "pickup_longitude": "67.001100",
      "currency": "USD",
      "initial_price": "80000.00",
      "is_buy_now_enabled": false,
      "buy_now_price": null,
      "start_date": "2025-12-23T17:41:22Z",
      "end_date": "2025-12-27T06:00:00Z",
      "extended_time_seconds": 0,
      "seller_details": {
        "id": 7,
        "name": "Abdullah Afzal",
        "email": "Abdullah@yopmail.com",
        "business_name": "Test",
        "is_verified": false,
        "profile_image": "/media/users/7/images/123f714f441e48d687716d166b741416.jpg"
      },
      "manager_details": {
        "id": 38,
        "email": "manager@yopmail.com",
        "first_name": "seller",
        "last_name": "user",
        "profile_image": null
      },
      "media": [
        {
          "id": 7,
          "media_type": "image",
          "file": Car3,
          "label": "gallery_3"
        },
        {
          "id": 8,
          "media_type": "image",
          "file": "/media/auctions/media/car5.png",
          "label": "gallery_4"
        },
        {
          "id": 9,
          "media_type": "file",
          "file": "/media/auctions/media/Advance_Pyhton_Roadmap_Outine_Ans_Mustafa_E6Ec9u2.pdf",
          "label": "inspection_report"
        }
      ],
      "bids": []
    },
    {
      "id": 4,
      "title": "Honda City 2019",
      "description": "Well-maintained Corolla, single owner, 55,000 km.",
      "status": "ACTIVE",
      "category_name": "Vehicles",
      "created_at": "2025-12-23T17:37:33.426821Z",
      "updated_at": "2025-12-29T14:28:19.981932Z",
      "rejection_reason": "",
      "specific_data": {
        "make": "Toyota",
        "year": 2018,
        "model": "Corolla"
      },
      "handover_type": "PICKUP",
      "delivery_datetime": null,
      "pickup_address": "Street 12, Karachi, Pakistan",
      "pickup_latitude": "24.860700",
      "pickup_longitude": "67.001100",
      "currency": "USD",
      "initial_price": "50000.00",
      "is_buy_now_enabled": false,
      "buy_now_price": null,
      "start_date": "2025-12-23T17:40:00Z",
      "end_date": "2025-12-31T00:00:00Z",
      "extended_time_seconds": 0,
      "seller_details": {
        "id": 7,
        "name": "Abdullah Afzal",
        "email": "Abdullah@yopmail.com",
        "business_name": "Test",
        "is_verified": false,
        "profile_image": "/media/users/7/images/123f714f441e48d687716d166b741416.jpg"
      },
      "manager_details": {
        "id": 24,
        "email": "itximda531@yopmail.com",
        "first_name": "Imran",
        "last_name": "Ahmad",
        "profile_image": "/media/users/24/images/f51f7488a2044b6d99a6cabba601ae51.jpg"
      },
      "media": [
        {
          "id": 4,
          "media_type": "image",
          "file": Car4,
          "label": "gallery_1"
        },
        {
          "id": 5,
          "media_type": "image",
          "file": "/media/auctions/media/car2.png",
          "label": "gallery_2"
        },
        {
          "id": 6,
          "media_type": "file",
          "file": "/media/auctions/media/Advance_Pyhton_Roadmap_Outine_Ans_Mustafa_t4C0lhz.pdf",
          "label": "inspection_report"
        }
      ],
      "bids": [
        {
          "id": 1,
          "amount": "70000.00",
          "bidder_email": "itximda531@gmail.com",
          "bidder_name": "Imran Ahmad",
          "created_at": "2025-12-29T14:30:10.538783Z"
        }
      ]
    }
  ]
};

// Memoized SVG components for better performance
const ProfileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const ReportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 16v5h5M21 16v5h-5M16 3v5h5M8 3v5H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 8h5l-5-5v5zM8 8H3l5-5v5zM8 16H3l5 5v-5zM16 16h5l-5 5v-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Optimized StatCard component
const StatCard = React.memo(({ icon: Icon, value, label, colorClass }) => (
  <div className="admin-dashboard-stat-card" role="article" aria-label={`${label}: ${value}`}>
    <div className={`admin-dashboard-stat-icon ${colorClass}`}>
      <Icon />
    </div>
    <div className="admin-dashboard-stat-content">
      <div className="admin-dashboard-stat-value" aria-live="polite">
        {value}
      </div>
      <div className="admin-dashboard-stat-label">{label}</div>
    </div>
  </div>
));

// Optimized ActivityItem component
const ActivityItem = React.memo(({ activity }) => (
  <div className="admin-dashboard-activity-item" role="listitem">
    <div className="admin-dashboard-activity-avatar" aria-hidden="true">
      {activity.user.charAt(0)}
    </div>
    <div className="admin-dashboard-activity-content">
      <div className="admin-dashboard-activity-text">
        <span className="admin-dashboard-activity-user">{activity.user}</span> {activity.action}
        {activity.amount && <span className="admin-dashboard-activity-amount"> {activity.amount}</span>}
        {activity.auction && <span className="admin-dashboard-activity-auction"> "{activity.auction}"</span>}
      </div>
      <div className="admin-dashboard-activity-time">{activity.time}</div>
    </div>
  </div>
));

const AuctionRow = React.memo(({ auction, onViewDetails, onAssignManager }) => {
  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'ACTIVE': return 'admin-dashboard-status-success';
      case 'APPROVED': return 'admin-dashboard-status-success';
      case 'PENDING': return 'admin-dashboard-status-warning';
      case 'REJECTED': return 'admin-dashboard-status-error';
      case 'COMPLETED': return 'admin-dashboard-status-info';
      default: return 'admin-dashboard-status-default';
    }
  }, []);

  return (
    <tr className="admin-dashboard-auction-row">
      <td className="admin-dashboard-table-cell admin-dashboard-cell-auction" data-label="Auction">
        <div className="admin-dashboard-auction-info">
          <div className="admin-dashboard-auction-image">
            <Suspense fallback={<div className="admin-dashboard-image-placeholder">📷</div>}>
              {auction.media && auction.media.length > 0 ? (
                <img
                  src={auction.media[0].file}
                  alt={auction.title}
                  loading="lazy"
                  width="40"
                  height="40"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23222'/%3E%3Ctext x='20' y='22' font-family='Arial' font-size='14' fill='%23fff' text-anchor='middle'%3E📷%3C/text%3E%3C/svg%3E";
                  }}
                />
              ) : (
                <div className="admin-dashboard-image-placeholder">📷</div>
              )}
            </Suspense>
          </div>
          <div className="admin-dashboard-auction-details">
            <div className="admin-dashboard-auction-title">{auction.title}</div>
            <div className="admin-dashboard-auction-category">{auction.category_name}</div>
          </div>
        </div>
      </td>
      <td className="admin-dashboard-table-cell admin-dashboard-cell-status" data-label="Status">
        <span className={`admin-dashboard-status-badge ${getStatusColor(auction.status)}`}>
          {auction.status}
        </span>
      </td>
      <td className="admin-dashboard-table-cell admin-dashboard-cell-price" data-label="Price">
        <div className="admin-dashboard-auction-price">
          {auction.currency} {auction.initial_price}
        </div>
      </td>
      <td className="admin-dashboard-table-cell admin-dashboard-cell-manager" data-label="Manager">
        <div className="admin-dashboard-manager-info">
          {auction.manager_details ? (
            <>
              <div className="admin-dashboard-manager-name">
                {auction.manager_details.first_name} {auction.manager_details.last_name}
              </div>
              <div className="admin-dashboard-manager-email">{auction.manager_details.email}</div>
            </>
          ) : (
            <span className="admin-dashboard-no-manager">Not assigned</span>
          )}
        </div>
      </td>
      <td className="admin-dashboard-table-cell admin-dashboard-cell-actions" data-label="Actions">
        <div className="admin-dashboard-auction-actions">
          <button
            className="admin-dashboard-icon-btn"
            onClick={() => onViewDetails(auction.id)}
            title="View Details"
            aria-label={`View details for ${auction.title}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
          <button
            className="admin-dashboard-icon-btn"
            onClick={() => onAssignManager(auction.id, 1)}
            title="Assign Manager"
            aria-label={`Assign manager to ${auction.title}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
              <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
              <line x1="20" y1="8" x2="20" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="23" y1="11" x2="17" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
});

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [stats] = useState({
    totalUsers: 2847,
    totalAuctions: 1924,
    activeAuctions: 147,
    pendingApprovals: 23,
    totalRevenue: "$1,284,750",
    platformFees: "$128,475",
    disputeCases: 8,
    completedAuctions: 1482,
    pendingAuctions: 12,
    rejectedAuctions: 5
  });

  // Memoized data
  const recentActivities = useMemo(() => [
    { id: 1, user: "John Smith", action: "registered as seller", time: "10 minutes ago" },
    { id: 2, user: "Sarah Johnson", action: "placed bid on BMW", amount: "$7,500", time: "30 minutes ago" },
    { id: 3, user: "Admin", action: "approved auction listing", auction: "Vintage Watch", time: "1 hour ago" },
    { id: 4, user: "System", action: "automatic backup completed", time: "2 hours ago" },
    { id: 5, user: "Manager 1", action: "assigned inspection task", time: "3 hours ago" },
  ], []);

  const topSellers = useMemo(() => [
    { id: 1, name: "Abdullah Afzal", auctions: 24, revenue: "$284,500", rating: 4.8 },
    { id: 2, name: "Imran Ahmad", auctions: 18, revenue: "$192,300", rating: 4.9 },
    { id: 3, name: "Luxury Jewelry", auctions: 15, revenue: "$156,800", rating: 4.7 },
    { id: 4, name: "Art Gallery Co.", auctions: 12, revenue: "$128,400", rating: 4.6 },
  ], []);

  useEffect(() => {
    setAuctions(mockAuctionsData.results);
  }, []);

  const handleAssignToManager = useCallback((auctionId, managerId) => {
    console.log(`Assigning auction ${auctionId} to manager ${managerId}`);
  }, []);

  const handleViewDetails = useCallback((auctionId) => {
    // navigate(`/admin/auctions/${auctionId}`);
  }, [navigate]);

  // Memoized stats cards data
  const statCards = useMemo(() => [
    {
      icon: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      value: stats.totalUsers.toLocaleString(),
      label: "Total Users",
      colorClass: "admin-dashboard-icon-users"
    },
    {
      icon: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" />
          <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <polyline points="10 9 9 9 8 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      value: stats.totalAuctions.toLocaleString(),
      label: "Total Auctions",
      colorClass: "admin-dashboard-icon-auctions"
    },
    {
      icon: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 1v22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      value: stats.totalRevenue,
      label: "Total Revenue",
      colorClass: "admin-dashboard-icon-revenue"
    },
    {
      icon: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      value: stats.pendingApprovals,
      label: "Pending Approvals",
      colorClass: "admin-dashboard-icon-pending"
    }
  ], [stats]);

  return (
    <div className="admin-dashboard-container" role="main">
      {/* Header */}
      <header className="admin-dashboard-header">
        <div className="admin-dashboard-header-content">
          <h1 className="admin-dashboard-title">Admin Dashboard</h1>
          <p className="admin-dashboard-subtitle">Platform oversight and management console</p>
        </div>
        <div className="admin-dashboard-header-actions">
          <button
            className="admin-dashboard-action-btn admin-dashboard-btn-primary"
            onClick={() => navigate('/admin/profile')}
            aria-label="Go to my profile"
          >
            <ProfileIcon />
            <span>My Profile</span>
          </button>
          <button 
            className="admin-dashboard-action-btn admin-dashboard-btn-outline"
            aria-label="Generate report"
          >
            <ReportIcon />
            <span>Generate Report</span>
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <section className="admin-dashboard-stats-overview" aria-label="Statistics overview">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </section>

      <div className="admin-dashboard-main">
        {/* Left Column */}
        <div className="admin-dashboard-left-column">
          <section className="admin-dashboard-card" aria-label="Recent activity">
            <div className="admin-dashboard-card-header">
              <h2 className="admin-dashboard-card-title">Recent Activity</h2>
              <button className="admin-dashboard-card-action">View All</button>
            </div>
            <div className="admin-dashboard-activity-list" role="list">
              {recentActivities.map(activity => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </section>

          <section className="admin-dashboard-card" aria-label="Top sellers">
            <div className="admin-dashboard-card-header">
              <h2 className="admin-dashboard-card-title">Top Sellers</h2>
              <button className="admin-dashboard-card-action">View All</button>
            </div>
            <div className="admin-dashboard-sellers-list" role="list">
              {topSellers.map(seller => (
                <div key={seller.id} className="admin-dashboard-seller-item" role="listitem">
                  <div className="admin-dashboard-seller-info">
                    <div className="admin-dashboard-seller-avatar">{seller.name.charAt(0)}</div>
                    <div className="admin-dashboard-seller-details">
                      <div className="admin-dashboard-seller-name">{seller.name}</div>
                      <div className="admin-dashboard-seller-stats">
                        <span className="admin-dashboard-seller-stat">{seller.auctions} auctions</span>
                        <span className="admin-dashboard-seller-divider">•</span>
                        <span className="admin-dashboard-seller-stat">{seller.revenue} revenue</span>
                      </div>
                    </div>
                  </div>
                  <div className="admin-dashboard-seller-rating">
                    <span className="admin-dashboard-rating-value">{seller.rating}</span>
                    <span className="admin-dashboard-rating-star">★</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="admin-dashboard-right-column">
          <section className="admin-dashboard-card" aria-label="Recent auctions">
            <div className="admin-dashboard-card-header">
              <h2 className="admin-dashboard-card-title">Recent Auctions</h2>
              <div className="admin-dashboard-card-actions">
                <select className="admin-dashboard-filter-select" aria-label="Filter by status">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>
            
            <div className="admin-dashboard-auctions-table-wrapper">
              <table className="admin-dashboard-auctions-table">
                <thead>
                  <tr>
                    <th scope="col" className="admin-dashboard-table-header-cell admin-dashboard-th-auction">
                      Auction
                    </th>
                    <th scope="col" className="admin-dashboard-table-header-cell admin-dashboard-th-status">
                      Status
                    </th>
                    <th scope="col" className="admin-dashboard-table-header-cell admin-dashboard-th-price">
                      Price
                    </th>
                    <th scope="col" className="admin-dashboard-table-header-cell admin-dashboard-th-manager">
                      Manager
                    </th>
                    <th scope="col" className="admin-dashboard-table-header-cell admin-dashboard-th-actions">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {auctions.slice(0, 5).map(auction => (
                    <AuctionRow
                      key={auction.id}
                      auction={auction}
                      onViewDetails={handleViewDetails}
                      onAssignManager={handleAssignToManager}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-dashboard-quick-actions-grid" aria-label="Quick actions">
            <div className="admin-dashboard-card">
              <div className="admin-dashboard-card-header">
                <h2 className="admin-dashboard-card-title">Quick Actions</h2>
              </div>
              <div className="admin-dashboard-actions-grid">
                <button
                  className="admin-dashboard-quick-action"
                  // onClick={() => navigate('/admin/approvals')}
                  aria-label={`Review ${stats.pendingApprovals} pending approvals`}
                >
                  <div className="admin-dashboard-quick-action-icon">📋</div>
                  <div className="admin-dashboard-quick-action-label">Review Approvals</div>
                  {stats.pendingApprovals > 0 && (
                    <div className="admin-dashboard-quick-action-badge">{stats.pendingApprovals}</div>
                  )}
                </button>
                <button
                  className="admin-dashboard-quick-action"
                  onClick={() => navigate('/admin/users')}
                  aria-label="Manage users"
                >
                  <div className="admin-dashboard-quick-action-icon">👥</div>
                  <div className="admin-dashboard-quick-action-label">Manage Users</div>
                </button>
                <button
                  className="admin-dashboard-quick-action"
                  onClick={() => navigate('/admin/finance')}
                  aria-label="View finance dashboard"
                >
                  <div className="admin-dashboard-quick-action-icon">💰</div>
                  <div className="admin-dashboard-quick-action-label">Finance Dashboard</div>
                </button>
                <button
                  className="admin-dashboard-quick-action"
                  // onClick={() => navigate('/admin/system')}
                  aria-label="Access system settings"
                >
                  <div className="admin-dashboard-quick-action-icon">⚙️</div>
                  <div className="admin-dashboard-quick-action-label">System Settings</div>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AdminDashboard);

