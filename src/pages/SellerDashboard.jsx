import React from 'react'
import { Link } from 'react-router-dom'
import './SellerDashboard.css'
import SummaryCard from './SummaryCard'

const SellerDashboard = () => {

    const seller = {
        name: 'Seller',
        totalRevenue: 0.0,
        activeListings: 0,
        itemsSold: 0,
        pendingPayout: 0,
        rating: 0,
        totalTransactions: 0,
        activeLabel: 'Active Listings',
        activeSubLabel: 'Items currently for auction',
        soldLabel: 'Items Sold',
        soldSubLabel: 'Total successful auctions',
        revenueLabel: 'Total Revenue',
        revenueSubLabel: 'Lifetime earnings',
        pendingLabel: 'Pending Payout',
        pendingSubLabel: 'Available for withdrawal',

    }

    // For testing empty states, you can set these to empty arrays:
    const activeListings = [] // Empty array for testing
    const recentSales = [] // Empty array for testing
    const sellerActivities = [] // Empty array for testing

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
        <div className="seller-page">

            <main className="seller-main">
                <div className="seller-container">
                    <div className="dashboard-welcome">
                        <div className="welcome-content">
                            <h1 className="welcome-title">Welcome back, {seller.name}!</h1>
                            <p className="welcome-subtitle">Your seller dashboard is updated in real-time</p>
                        </div>
                        <div className="welcome-actions">
                            <Link to="/seller/product" className="action-button primary-button primary">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                Create New Product</Link>
                            {/* <button className="action-button secondary">Request Payout</button> */}
                        </div>
                    </div>

                    <SummaryCard 
                        seller={seller} 
                    />

                    <div className="dashboard-two-column">
                        <div className="dashboard-column">
                            <div className="section-header">
                                <h2 className="section-title">Active Listings</h2>
                                <Link to="/seller/auction-listings" className="login-link">Manage All</Link>
                            </div>
                            <div className="listings-grid-1">
                                {activeListings.length > 0 ? (
                                    activeListings.map((listing) => (
                                        <Link key={listing.id} to={`/seller/listing/${listing.id}`} className="s-listing-card">
                                            <div className="s-listing-card-image">
                                                <img src={listing.image} alt={listing.title} />
                                            </div>
                                            <div className="s-listing-card-content">
                                                <h3 className="s-listing-card-title">{listing.title}</h3>
                                                <div className="s-listing-card-info">
                                                    <div className="listing-info-item">
                                                        <span className="listing-info-label">Current Bid</span>
                                                        <span className="listing-info-value">{formatCurrency(listing.currentBid)}</span>
                                                    </div>
                                                    <div className="listing-info-item">
                                                        <span className="listing-info-label">Starting Price</span>
                                                        <span className="listing-info-value">{formatCurrency(listing.startingPrice)}</span>
                                                    </div>
                                                </div>
                                                <div className="s-listing-card-time">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                                        <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                    </svg>
                                                    <span>{listing.timeRemaining} left</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <div className="empty-state-icon">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
                                                <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <h3 className="empty-state-title">No Active Listings</h3>
                                        <p className="empty-state-description">You don't have any active auction listings at the moment.</p>
                                        <Link to="/seller/product" className="empty-state-action">
                                            Create Your First Listing
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="dashboard-column">
                            <div className="section-header">
                                <h2 className="section-title">Recent Sales</h2>
                            </div>
                            <div className="sales-list">
                                {recentSales.length > 0 ? (
                                    recentSales.map((sale) => (
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
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <div className="empty-state-icon">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
                                                <path d="M20.5 7.5L9 15L4 11" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3 13V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V9" strokeLinecap="round" strokeLinejoin="round" />
                                                <circle cx="18" cy="6" r="2" />
                                            </svg>
                                        </div>
                                        <h3 className="empty-state-title">No Recent Sales</h3>
                                        <p className="empty-state-description">Your recent sales will appear here once you make your first sale.</p>
                                        <Link to="/seller/auction-listings" className="empty-state-action">
                                            View Your Listings
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="recent-activity">
                        <h2 className="section-title">Recent Activity</h2>
                        <div className="activity-list">
                            {sellerActivities.length > 0 ? (
                                sellerActivities.map((activity) => (
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
                                ))
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-state-icon">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
                                            <path d="M18 8H6C4.89543 8 4 8.89543 4 10V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V10C20 8.89543 19.1046 8 18 8Z" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M16 2H8C7.44772 2 7 2.44772 7 3V5C7 5.55228 7.44772 6 8 6H16C16.5523 6 17 5.55228 17 5V3C17 2.44772 16.5523 2 16 2Z" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12 11V17" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M15 14L12 17L9 14" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <h3 className="empty-state-title">No Recent Activity</h3>
                                    <p className="empty-state-description">Your activity feed will update as you list items and make sales.</p>
                                    <Link to="/seller/product" className="empty-state-action">
                                        Start Selling
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default SellerDashboard