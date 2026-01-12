import React from 'react'
import { Link } from 'react-router-dom'
import './BuyerDashboard.css'
import SummaryCard from './SummaryCard'

const BuyerDashboard = () => {
  const user = {
    name: 'John',
    walletBalance: 1250.00,
    activeBids: 8,
    itemsWon: 3
  }

      const seller = {
        name: 'Sarah',
        totalRevenue: 125000.00,
        activeListings: 12,
        itemsSold: 45,
        pendingPayout: 3250.00,
        rating: 4.8,
        totalTransactions: 67,
        activeLabel: 'Active Listings',
        activeSubLabel: 'Items currently for auction',
        soldLabel: 'Items Sold',
        soldSubLabel: 'Total successful auctions',
        revenueLabel: 'Total Revenue',
        revenueSubLabel: 'Lifetime earnings',
        pendingLabel: 'Pending Payout',
        pendingSubLabel: 'Available for withdrawal',

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
    },
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
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=80'

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
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      case 'outbid':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M7 13L12 18L17 13M7 6L12 11L17 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      case 'invoice':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      case 'won':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      default:
        return null
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'bid_placed':
        return '#2c7bfbff' 
      case 'outbid':
        return '#FF4D4D' 
      case 'invoice':
        return '#8CC63F' 
      case 'won':
        return '#FFC107' 
      default:
        return '#8CC63F'
    }
  }

  const getActivityBgColor = (type) => {
    switch (type) {
      case 'bid_placed':
        return '#2c7bfb3a' 
      case 'outbid':
        return '#ff373733' 
      case 'invoice':
        return '#8bc63f35' 
      case 'won':
        return '#ffc1073c' 
      default:
        return '#8bc63f35'
    }
  }

  return (
    <div className="buyer-dashboard-page">
      <main className="buyer-dashboard-main">
        <div className="buyer-dashboard-container">
          <div className="dashboard-welcome">
            <div className="welcome-content">
              <h1 className="welcome-title">Welcome, {user.name}!</h1>
              <p className="welcome-subtitle">Here's a summary of your auction activity.</p>
            </div>
          
          </div>
            <SummaryCard seller={seller}/>

          <div className="active-bids-section">
            <div className="section-header">
              <h2 className="section-title">My Active Bids</h2>
              <Link to="/buyer/bids" className="view-all-link">View All</Link>
            </div>
            <div className="active-bids-grid">
              {activeBids.map((bid) => (
                <Link key={bid.id} to={`/buyer/auction/${bid.id}`} className="buyer-bid-card">
                  <div className="bid-card-image">
                    <img src={bid.image} alt={bid.title} />
                    {bid.isLeading && (
                      <div className="leading-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Leading
                      </div>
                    )}
                    {!bid.isLeading && (
                      <div className="outbid-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M7 13L12 18L17 13M7 6L12 11L17 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      <span>{bid.timeRemaining} left</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="recent-activity">
            <h2 className="section-title">Recent Activity</h2>
            <div className="activity-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="buyer-activity-item">
                  <div className="activity-image">
                    <img src={activity.image} alt={activity.title} />
                  </div>

                  <div className="activity-content-1">
                    <div className="activity-header-1">
                      <p className="buyer-activity-title">{activity.title}</p>
                    </div>
                    <div className='buyer-icon-amount'>
                      <div
                        className="activity-icon-small"
                        style={{
                          backgroundColor: `${getActivityBgColor(activity.type)}`,
                          color: getActivityColor(activity.type)
                        }}
                      >
                        {getActivityIcon(activity.icon)}
                      </div>

                      <div className="activity-footer">
                        <span className="activity-time">{activity.time}</span>
                        <span className="activity-amount">
                          {formatCurrency(activity.amount)}
                        </span>
                      </div>
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

export default BuyerDashboard