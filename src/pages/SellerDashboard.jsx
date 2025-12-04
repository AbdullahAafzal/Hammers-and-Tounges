import React from 'react'
import { Link } from 'react-router-dom'
import './SellerDashboard.css'
import SellerHeader from '../components/SellerHeader'

const SellerDashboard = () => {

    const seller = {
        name: 'Sarah',
        totalRevenue: 125000.00,
        activeListings: 12,
        itemsSold: 45,
        pendingPayout: 3250.00,
        rating: 4.8,
        totalTransactions: 67
    }

    const activeListings = [
        {
            id: 1,
            title: 'Vintage Leather Armchair',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
            startingPrice: 200.00,
            currentBid: 450.00,
            bids: 12,
            timeRemaining: '2d 14h 22m',
            views: 245,
            status: 'active'
        },
        {
            id: 2,
            title: 'Antique Oak Desk',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
            startingPrice: 800.00,
            currentBid: 1200.00,
            bids: 8,
            timeRemaining: '1d 8h 5m',
            views: 189,
            status: 'active'
        },
    ]

    const recentSales = [
        {
            id: 1,
            title: 'Vintage Tiffany Lamp',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=80',
            soldPrice: 1250.00,
            buyer: 'Michael Johnson',
            date: '2 hours ago',
            status: 'paid',
            icon: 'sale'
        },
        {
            id: 2,
            title: 'Art Deco Coffee Table',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=80',
            soldPrice: 850.00,
            buyer: 'Emily Chen',
            date: '1 day ago',
            status: 'shipped',
            icon: 'shipped'
        },
        {
            id: 3,
            title: 'Persian Silk Carpet',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=80',
            soldPrice: 3200.00,
            buyer: 'Robert Wilson',
            date: '3 days ago',
            status: 'delivered',
            icon: 'delivered'
        },
        {
            id: 4,
            title: 'Victorian Writing Desk',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=80',
            soldPrice: 1800.00,
            buyer: 'Lisa Thompson',
            date: '5 days ago',
            status: 'completed',
            icon: 'completed'
        }
    ]

    const sellerActivities = [
        {
            id: 1,
            type: 'new_bid',
            title: 'New bid received on "Vintage Leather Armchair"',
            description: 'Bid increased to $450',
            time: '2 minutes ago',
            amount: 450.00,
            icon: 'bid',
            color: '#3B82F6'
        },
        {
            id: 2,
            type: 'item_sold',
            title: '"Vintage Tiffany Lamp" sold for $1,250',
            description: 'Buyer: Michael Johnson',
            time: '2 hours ago',
            amount: 1250.00,
            icon: 'sale',
            color: '#8CC63F'
        },
        {
            id: 3,
            type: 'listing_published',
            title: 'New listing published',
            description: '"Mid-century Modern Sofa" is now live',
            time: '3 hours ago',
            amount: 0,
            icon: 'listing',
            color: '#FFC107'
        },
        {
            id: 4,
            type: 'payout',
            title: 'Payout processed',
            description: '$2,500 transferred to your bank account',
            time: '1 day ago',
            amount: 2500.00,
            icon: 'payout',
            color: '#8B5CF6'
        }
    ]

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
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
            case 'sale':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )
            case 'listing':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )
            case 'payout':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6312 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6312 13.6815 18 14.5717 18 15.5C18 16.4283 17.6312 17.3185 16.9749 17.9749C16.3185 18.6312 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )
            default:
                return null
        }
    }

    return (
        <div className="dashboard-page">
            <SellerHeader />

            <main className="dashboard-main">
                <div className="dashboard-container">
                    <div className="dashboard-welcome">
                        <div className="welcome-content">
                            <h1 className="welcome-title">Welcome back, {seller.name}!</h1>
                            <p className="welcome-subtitle">Your seller dashboard is updated in real-time</p>
                        </div>
                        <div className="welcome-actions">
                            <Link to="/seller/create-listing" className="action-button primary-button primary">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                Create New Product</Link>
                            <Link to="/seller/payouts" className="action-button secondary">Request Payout</Link>
                        </div>
                    </div>

                    <div className="summary-cards">
                        <div className="summary-card">
                            <div className="card-background-gradient" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)' }}></div>
                            <div className="card-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: 'rgba(59, 130, 246, 0.4)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="card-content">
                                <span className="card-label">Active Listings</span>
                                <span className="card-value">{seller.activeListings}</span>
                                <span className="card-sublabel">Items currently for auction</span>
                            </div>
                        </div>

                        <div className="summary-card">
                            <div className="card-background-gradient" style={{ background: 'linear-gradient(135deg, rgba(140, 198, 63, 0.15) 0%, rgba(140, 198, 63, 0.05) 100%)' }}></div>
                            <div className="card-icon" style={{ backgroundColor: 'rgba(140, 198, 63, 0.2)', borderColor: 'rgba(140, 198, 63, 0.4)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="#8CC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8 21V5C8 4.46957 8.21071 3.96086 8.58579 3.58579C8.96086 3.21071 9.46957 3 10 3H14C14.5304 3 15.0391 3.21071 15.4142 3.58579C15.0391 3.96086 15 4.46957 15 5V21" stroke="#8CC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 10V14" stroke="#8CC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M9 12H15" stroke="#8CC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="card-content">
                                <span className="card-label">Items Sold</span>
                                <span className="card-value">{seller.itemsSold}</span>
                                <span className="card-sublabel">Total successful auctions</span>
                            </div>
                        </div>

                        <Link to="/seller/revenue" className="summary-card highlight" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                            <div className="card-background-gradient" style={{ background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.2) 0%, rgba(255, 193, 7, 0.1) 100%)' }}></div>
                            <div className="card-icon" style={{ backgroundColor: 'rgba(255, 193, 7, 0.25)', borderColor: 'rgba(255, 193, 7, 0.5)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6312 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6312 13.6815 18 14.5717 18 15.5C18 16.4283 17.6312 17.3185 16.9749 17.9749C16.3185 18.6312 15.4283 19 14.5 19H6" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="card-content">
                                <span className="card-label">Total Revenue</span>
                                <span className="card-value currency">{formatCurrency(seller.totalRevenue)}</span>
                                <span className="card-sublabel">Lifetime earnings</span>
                            </div>
                        </Link>

                        <Link to="/seller/payouts" className="summary-card" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                            <div className="card-background-gradient" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)' }}></div>
                            <div className="card-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)', borderColor: 'rgba(139, 92, 246, 0.4)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 8V16" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8 12H16" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="card-content">
                                <span className="card-label">Pending Payout</span>
                                <span className="card-value currency" style={{ color: '#8B5CF6' }}>{formatCurrency(seller.pendingPayout)}</span>
                                <span className="card-sublabel">Available for withdrawal</span>
                            </div>
                        </Link>
                    </div>

                    <div className="dashboard-two-column">
                        <div className="dashboard-column">
                            <div className="section-header">
                                <h2 className="section-title">Active Listings</h2>
                                <Link to="/seller/auction-listings" className="view-all-link">Manage All</Link>
                            </div>
                            <div className="listings-grid">
                                {activeListings.map((listing) => (
                                    <Link key={listing.id} to={`/seller/listing/${listing.id}`} className="listing-card">
                                        <div className="listing-card-image">
                                            <img src={listing.image} alt={listing.title} />
                                        </div>
                                        <div className="listing-card-content">
                                            <h3 className="listing-card-title">{listing.title}</h3>
                                            <div className="listing-card-info">
                                                <div className="listing-info-item">
                                                    <span className="listing-info-label">Current Bid</span>
                                                    <span className="listing-info-value">{formatCurrency(listing.currentBid)}</span>
                                                </div>
                                                <div className="listing-info-item">
                                                    <span className="listing-info-label">Starting Price</span>
                                                    <span className="listing-info-value">{formatCurrency(listing.startingPrice)}</span>
                                                </div>
                                            </div>
                                            <div className="listing-card-time">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                                <span>{listing.timeRemaining} left</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="dashboard-column">
                            <div className="section-header">
                                <h2 className="section-title">Recent Sales</h2>
                                <Link to="/seller/sales" className="view-all-link">View All</Link>
                            </div>
                            <div className="sales-list">
                                {recentSales.map((sale) => (
                                    <Link key={sale.id} className="sale-item">
                                        <div className="sale-image">
                                            <img src={sale.image} alt={sale.title} />
                                        </div>
                                        <div className="sale-content">
                                            <div className="sale-header">
                                                <h4 className="sale-title">{sale.title}</h4>
                                                <span className="sale-price">{formatCurrency(sale.soldPrice)}</span>
                                            </div>
                                            <div className="sale-details">
                                                <span className="sale-buyer">Sold to: {sale.buyer}</span>
                                                <span className="sale-date">{sale.date}</span>
                                            </div>
                                            <div className="sale-footer">
                                                <span className="sale-status">{sale.status}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="recent-activity">
                        <h2 className="section-title">Recent Activity</h2>
                        <div className="activity-list">
                            {sellerActivities.map((activity) => (
                                <div key={activity.id} className="activity-item">
                                    <div
                                        className="activity-icon"
                                        style={{
                                            backgroundColor: `${activity.color}15`,
                                            borderColor: `${activity.color}40`,
                                            color: activity.color
                                        }}
                                    >
                                        {getActivityIcon(activity.icon)}
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-header">
                                            <p className="activity-title">{activity.title}</p>
                                            <span
                                                className="activity-amount"
                                                style={{ color: activity.color }}
                                            >
                                                {activity.amount > 0 ? formatCurrency(activity.amount) : ''}
                                            </span>
                                        </div>
                                        <p className="activity-description">{activity.description}</p>
                                        <div className="activity-footer">
                                            <span className="activity-time">{activity.time}</span>
                                            <div className="activity-actions">
                                                <button className="action-link">View Details</button>
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

export default SellerDashboard