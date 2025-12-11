import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import './Dashboard.css'

const Dashboard = () => {
  const user = {
    name: 'John',
    walletBalance: 1250.00,
    activeBids: 8,
    itemsWon: 3
  }

  const activeBids = [
    {
      id: 1,
      title: 'Vintage Leather Armchair',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
      currentBid: 450.00,
      yourBid: 450.00,
      timeRemaining: '2d 14h 22m',
      isLeading: true
    },
    {
      id: 2,
      title: 'Antique Oak Desk',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
      currentBid: 1200.00,
      yourBid: 1150.00,
      timeRemaining: '1d 8h 5m',
      isLeading: false
    },
    {
      id: 3,
      title: 'Mid-century Modern Sideboard',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
      currentBid: 780.00,
      yourBid: 780.00,
      timeRemaining: '5h 30m',
      isLeading: true
    },
    {
      id: 4,
      title: 'Classic Persian Rug',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
      currentBid: 320.00,
      yourBid: 320.00,
      timeRemaining: '12h 45m',
      isLeading: true
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'bid_placed',
      title: 'You placed a bid on "Vintage Leather Armchair"',
      time: '2 minutes ago',
      amount: 450.00,
      icon: 'bid',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=80'
    },
    {
      id: 2,
      type: 'outbid',
      title: 'You were outbid on "Antique Oak Desk"',
      time: '1 hour ago',
      amount: 1200.00,
      icon: 'outbid',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=80'
    },
    {
      id: 3,
      type: 'invoice',
      title: 'Invoice #HT-2024-1234 generated',
      time: '3 hours ago',
      amount: 780.00,
      icon: 'invoice',
      image: null
    },
    {
      id: 4,
      type: 'won',
      title: 'You won the auction for "Mid-century Modern Sideboard"',
      time: '1 day ago',
      amount: 780.00,
      icon: 'won',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=80'
    }
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const getActivityIcon = (iconType) => {
    switch (iconType) {
      case 'bid':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case 'outbid':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M7 13L12 18L17 13M7 6L12 11L17 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case 'invoice':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case 'won':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      default:
        return null
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'bid_placed':
        return '#3B82F6' // Blue
      case 'outbid':
        return '#FF4D4D' // Red
      case 'invoice':
        return '#8CC63F' // Green
      case 'won':
        return '#FFC107' // Gold
      default:
        return '#8CC63F'
    }
  }

  return (
    <div className="dashboard-page">
      {/* Dashboard Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-container">
          <Link to="/dashboard" className="dashboard-logo">
            <img src={logo} alt="Hammers & Tongues Logo" />
            <span>Hammers & Tongues</span>
          </Link>
          
          <nav className="dashboard-nav">
            <Link to="/dashboard" className="nav-link active">Home</Link>
            <Link to="/buyer/auctions" className="nav-link">Auctions</Link>
            <Link to="/my-bids" className="nav-link">My Bids</Link>
            <Link to="/won-items" className="nav-link">Won Items</Link>
          </nav>

          <div className="dashboard-header-right">
            <button className="notification-button" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 0 0 6 8C6 11.3137 3.31371 14 0 14M18 8C20.2091 8 22 9.79086 22 12C22 14.2091 20.2091 16 18 16M18 8C20.2091 8 22 5.79086 22 3C22 0.790861 20.2091 -1 18 -1C15.7909 -1 14 0.790861 14 3C14 5.79086 15.7909 8 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 8C6 11.3137 8.68629 14 12 14C15.3137 14 18 11.3137 18 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="notification-badge">3</span>
            </button>
            <Link to="/profile" className="profile-button" aria-label="Profile">
              <div className="profile-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Welcome Section */}
          <div className="dashboard-welcome">
            <div className="welcome-content">
              <h1 className="welcome-title">Welcome, {user.name}!</h1>
              <p className="welcome-subtitle">Here's a summary of your auction activity.</p>
            </div>
            <div className="welcome-actions">
              <button className="action-button primary">Deposit Funds</button>
              <button className="action-button secondary">View Invoices</button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card">
              <div className="card-background-gradient" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)' }}></div>
              <div className="card-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: 'rgba(59, 130, 246, 0.4)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="card-content">
                <span className="card-label">My Active Bids</span>
                <span className="card-value">{user.activeBids}</span>
                <span className="card-sublabel">Items you're bidding on</span>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-background-gradient" style={{ background: 'linear-gradient(135deg, rgba(140, 198, 63, 0.15) 0%, rgba(140, 198, 63, 0.05) 100%)' }}></div>
              <div className="card-icon" style={{ backgroundColor: 'rgba(140, 198, 63, 0.2)', borderColor: 'rgba(140, 198, 63, 0.4)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9L12 15L18 9" stroke="#8CC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#8CC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="card-content">
                <span className="card-label">Items Won</span>
                <span className="card-value">{user.itemsWon}</span>
                <span className="card-sublabel">Successful auctions</span>
              </div>
            </div>

            <Link to="/wallet" className="summary-card highlight" style={{ textDecoration: 'none', cursor: 'pointer' }}>
              <div className="card-background-gradient" style={{ background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.2) 0%, rgba(255, 193, 7, 0.1) 100%)' }}></div>
              <div className="card-icon" style={{ backgroundColor: 'rgba(255, 193, 7, 0.25)', borderColor: 'rgba(255, 193, 7, 0.5)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6312 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6312 13.6815 18 14.5717 18 15.5C18 16.4283 17.6312 17.3185 16.9749 17.9749C16.3185 18.6312 15.4283 19 14.5 19H6" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="card-content">
                <span className="card-label">Wallet Balance</span>
                <span className="card-value currency">{formatCurrency(user.walletBalance)}</span>
                <span className="card-sublabel">Available for bidding</span>
              </div>
            </Link>
          </div>

          {/* Active Bids Section */}
          <div className="active-bids-section">
            <div className="section-header">
              <h2 className="section-title">My Active Bids</h2>
              <Link to="/my-bids" className="view-all-link">View All</Link>
            </div>
            <div className="active-bids-grid">
              {activeBids.slice(0, 4).map((bid) => (
                <Link key={bid.id} to={`/buyer/auction/${bid.id}`} className="bid-card">
                  <div className="bid-card-image">
                    <img src={bid.image} alt={bid.title} />
                    {bid.isLeading && (
                      <div className="leading-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Leading
                      </div>
                    )}
                    {!bid.isLeading && (
                      <div className="outbid-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M7 13L12 18L17 13M7 6L12 11L17 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Outbid
                      </div>
                    )}
                  </div>
                  <div className="bid-card-content">
                    <h3 className="bid-card-title">{bid.title}</h3>
                    <div className="bid-card-info">
                      <div className="bid-info-item">
                        <span className="bid-info-label">Current Bid</span>
                        <span className="bid-info-value">{formatCurrency(bid.currentBid)}</span>
                      </div>
                      <div className="bid-info-item">
                        <span className="bid-info-label">Your Bid</span>
                        <span className={`bid-info-value ${bid.isLeading ? 'leading' : 'outbid'}`}>
                          {formatCurrency(bid.yourBid)}
                        </span>
                      </div>
                    </div>
                    <div className="bid-card-time">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <span>{bid.timeRemaining} left</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity">
            <h2 className="section-title">Recent Activity</h2>
            <div className="activity-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  {activity.image ? (
                    <div className="activity-image">
                      <img src={activity.image} alt={activity.title} />
                    </div>
                  ) : (
                    <div 
                      className="activity-icon"
                      style={{ 
                        backgroundColor: `${getActivityColor(activity.type)}15`,
                        borderColor: `${getActivityColor(activity.type)}40`,
                        color: getActivityColor(activity.type)
                      }}
                    >
                      {getActivityIcon(activity.icon)}
                    </div>
                  )}
                  <div className="activity-content">
                    <div className="activity-header">
                      <div 
                        className="activity-icon-small"
                        style={{ 
                          backgroundColor: `${getActivityColor(activity.type)}15`,
                          color: getActivityColor(activity.type)
                        }}
                      >
                        {getActivityIcon(activity.icon)}
                      </div>
                      <p className="activity-title">{activity.title}</p>
                    </div>
                    <div className="activity-footer">
                      <span className="activity-time">{activity.time}</span>
                      <span className="activity-amount">
                        {formatCurrency(activity.amount)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard

