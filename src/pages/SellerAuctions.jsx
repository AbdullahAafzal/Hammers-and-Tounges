import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './SellerAuctions.css'
import SellerHeader from '../components/SellerHeader'

const SellerAuctions = () => {
    const [auctions, setAuctions] = useState([
        {
            id: 1,
            title: 'Vintage Leather Armchair',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
            category: 'Furniture',
            startingPrice: 200.00,
            currentBid: 450.00,
            bids: 12,
            views: 245,
            watchers: 8,
            timeRemaining: '2d 14h 22m',
            status: 'active',
            highestBidder: 'John D.',
            bidIncrement: 25.00,
            reserveMet: true
        },
        {
            id: 2,
            title: 'Antique Oak Desk',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
            category: 'Furniture',
            startingPrice: 800.00,
            currentBid: 1200.00,
            bids: 8,
            views: 189,
            watchers: 5,
            timeRemaining: '1d 8h 5m',
            status: 'active',
            highestBidder: 'Michael R.',
            bidIncrement: 50.00,
            reserveMet: true
        },
        {
            id: 3,
            title: 'Mid-century Modern Sideboard',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
            category: 'Furniture',
            startingPrice: 500.00,
            currentBid: 780.00,
            bids: 15,
            views: 321,
            watchers: 12,
            timeRemaining: '5h 30m',
            status: 'active',
            highestBidder: 'Sarah L.',
            bidIncrement: 20.00,
            reserveMet: true
        },
        {
            id: 4,
            title: 'Classic Persian Rug',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
            category: 'Home Decor',
            startingPrice: 150.00,
            currentBid: 320.00,
            bids: 6,
            views: 132,
            watchers: 3,
            timeRemaining: '12h 45m',
            status: 'active',
            highestBidder: 'Robert K.',
            bidIncrement: 15.00,
            reserveMet: false
        },
        {
            id: 5,
            title: 'Vintage Tiffany Lamp',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
            category: 'Lighting',
            startingPrice: 300.00,
            currentBid: 750.00,
            bids: 9,
            views: 178,
            watchers: 6,
            timeRemaining: '3d 2h 15m',
            status: 'active',
            highestBidder: 'Emily C.',
            bidIncrement: 30.00,
            reserveMet: true
        },
        {
            id: 6,
            title: 'Art Deco Coffee Table',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
            category: 'Furniture',
            startingPrice: 400.00,
            currentBid: 620.00,
            bids: 5,
            views: 89,
            watchers: 2,
            timeRemaining: '18h 20m',
            status: 'active',
            highestBidder: 'David M.',
            bidIncrement: 25.00,
            reserveMet: false
        }
    ])

    const [filter, setFilter] = useState('all')
    const [sortBy, setSortBy] = useState('ending_soon')

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount)
    }

    const formatTime = (timeString) => {
        return timeString
    }

    const getStatusBadge = (auction) => {
        if (auction.timeRemaining.includes('h') && !auction.timeRemaining.includes('d')) {
            const hours = parseInt(auction.timeRemaining.split('h')[0])
            if (hours < 1) {
                return (
                    <span className="status-badge urgent">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Ending Soon
                    </span>
                )
            }
        }

        if (auction.reserveMet) {
            return (
                <span className="status-badge reserve-met">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Reserve Met
                </span>
            )
        }

        return (
            <span className="status-badge reserve-not-met">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Reserve Not Met
            </span>
        )
    }

    const handleEndAuction = (id) => {
        if (window.confirm('Are you sure you want to end this auction early?')) {
            setAuctions(auctions.map(auction =>
                auction.id === id ? { ...auction, status: 'ended' } : auction
            ))
        }
    }

    const handleRelist = (id) => {
        setAuctions(auctions.map(auction =>
            auction.id === id ? {
                ...auction,
                status: 'active',
                timeRemaining: '7d 0h 0m',
                bids: 0,
                currentBid: auction.startingPrice
            } : auction
        ))
    }

    const filteredAuctions = auctions.filter(auction => {
        if (filter === 'all') return true
        if (filter === 'ending_soon') {
            return auction.timeRemaining.includes('h') && !auction.timeRemaining.includes('d')
        }
        if (filter === 'reserve_met') return auction.reserveMet
        if (filter === 'reserve_not_met') return !auction.reserveMet
        return auction.status === filter
    })

    const sortedAuctions = [...filteredAuctions].sort((a, b) => {
        if (sortBy === 'ending_soon') {
            // Sort by time remaining (soonest first)
            const aTime = parseInt(a.timeRemaining)
            const bTime = parseInt(b.timeRemaining)
            return aTime - bTime
        }
        if (sortBy === 'most_bids') return b.bids - a.bids
        if (sortBy === 'highest_bid') return b.currentBid - a.currentBid
        if (sortBy === 'most_watchers') return b.watchers - a.watchers
        return 0
    })

    const parseTime = (timeString) => {
        let totalMinutes = 0
        if (timeString.includes('d')) {
            const days = parseInt(timeString.split('d')[0])
            totalMinutes += days * 24 * 60
        }
        if (timeString.includes('h')) {
            const hours = parseInt(timeString.split('h')[0].split('d ')[1] || timeString.split('h')[0])
            totalMinutes += hours * 60
        }
        if (timeString.includes('m')) {
            const minutes = parseInt(timeString.split('m')[0].split('h ')[1] || 0)
            totalMinutes += minutes
        }
        return totalMinutes
    }

    const totalActiveAuctions = auctions.filter(a => a.status === 'active').length
    const totalBids = auctions.reduce((sum, a) => sum + a.bids, 0)
    const totalWatchers = auctions.reduce((sum, a) => sum + a.watchers, 0)
    const totalCurrentValue = auctions.reduce((sum, a) => sum + a.currentBid, 0)

    return (
        <div className="seller-page">
            <SellerHeader />

            <main className="seller-main">
                <div className="page-container">
                    <div className="page-header">
                        <div className="page-title-section">
                            <h1 className="page-title">Live Auctions</h1>
                            <p className="page-subtitle">Monitor and manage your active auctions in real-time</p>
                        </div>
                        <div className="page-actions">
                            <Link to="/seller/create-product" className="primary-button">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                Start New Auction
                            </Link>
                        </div>
                    </div>

                    <div className="stats-cards">
                        <div className="stat-card">
                            <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2 17L12 22L22 17" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="stat-content">
                                <span className="stat-value">{totalActiveAuctions}</span>
                                <span className="stat-label">Active Auctions</span>
                                <span className="stat-sublabel">Live right now</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon" style={{ backgroundColor: 'rgba(140, 198, 63, 0.1)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#8CC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2 17L12 22L22 17" stroke="#8CC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2 12L12 17L22 12" stroke="#8CC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="stat-content">
                                <span className="stat-value">{totalBids}</span>
                                <span className="stat-label">Total Bids</span>
                                <span className="stat-sublabel">Across all auctions</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon" style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="#FFC107" strokeWidth="2" />
                                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="#FFC107" strokeWidth="2" />
                                </svg>
                            </div>
                            <div className="stat-content">
                                <span className="stat-value">{totalWatchers}</span>
                                <span className="stat-label">Total Watchers</span>
                                <span className="stat-sublabel">People watching</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6312 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6312 13.6815 18 14.5717 18 15.5C18 16.4283 17.6312 17.3185 16.9749 17.9749C16.3185 18.6312 15.4283 19 14.5 19H6" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="stat-content">
                                <span className="stat-value">{formatCurrency(totalCurrentValue)}</span>
                                <span className="stat-label">Current Value</span>
                                <span className="stat-sublabel">Total bid amounts</span>
                            </div>
                        </div>
                    </div>

                    <div className="filters-section">
                        <div className="filters-left">
                            <div className="filter-group">
                                <label className="filter-label">Filter by:</label>
                                <div className="filter-buttons">
                                    <button
                                        className={`filter-button ${filter === 'all' ? 'active' : ''}`}
                                        onClick={() => setFilter('all')}
                                    >
                                        All Auctions
                                    </button>
                                    <button
                                        className={`filter-button ${filter === 'ending_soon' ? 'active' : ''}`}
                                        onClick={() => setFilter('ending_soon')}
                                    >
                                        Ending Soon
                                    </button>
                                    <button
                                        className={`filter-button ${filter === 'reserve_met' ? 'active' : ''}`}
                                        onClick={() => setFilter('reserve_met')}
                                    >
                                        Reserve Met
                                    </button>
                                    <button
                                        className={`filter-button ${filter === 'reserve_not_met' ? 'active' : ''}`}
                                        onClick={() => setFilter('reserve_not_met')}
                                    >
                                        Reserve Not Met
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="filters-right">
                            <div className="sort-group">
                                <label className="sort-label">Sort by:</label>
                                <select
                                    className="sort-select"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="ending_soon">Ending Soonest</option>
                                    <option value="most_bids">Most Bids</option>
                                    <option value="highest_bid">Highest Bid</option>
                                    <option value="most_watchers">Most Watchers</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="auctions-grid">
                        {sortedAuctions.map((auction) => (
                            <div key={auction.id} className="auction-card">
                                <div className="auction-card-header">
                                    <div className="auction-image">
                                        <img src={auction.image} alt={auction.title} />
                                        {/* <div className="auction-time-badge">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                            {auction.timeRemaining}
                                        </div> */}
                                        {/* {getStatusBadge(auction)} */}
                                    </div>
                                    <div className="auction-category">
                                        {auction.category}
                                    </div>
                                </div>
                                <div className="auction-card-body">
                                    <h3 className="auction-title">{auction.title}</h3>

                                    <div className="auction-stats">
                                        <div className="auction-stat-row">
                                            <div className="auction-stat">
                                                <span className="stat-label">Current Bid</span>
                                                <span className="stat-value">{formatCurrency(auction.currentBid)}</span>
                                            </div>
                                            <div className="auction-stat">
                                                <span className="stat-label">Starting Price</span>
                                                <span className="stat-value">{formatCurrency(auction.startingPrice)}</span>
                                            </div>
                                        </div>

                                        <div className="auction-stat-row">
                                            <div className="auction-stat">
                                                <span className="stat-label">Bid Increment</span>
                                                <span className="stat-value">{formatCurrency(auction.bidIncrement)}</span>
                                            </div>
                                            <div className="auction-stat">
                                                <span className="stat-label">Reserve</span>
                                                <span className={`stat-value ${auction.reserveMet ? 'reserve-met' : 'reserve-not-met'}`}>
                                                    {auction.reserveMet ? 'Met ✓' : 'Not Met'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="auction-metrics">
                                        <div className="auction-metric">
                                            <div className="metric-icon">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <div className="metric-content">
                                                <span className="metric-value">{auction.bids}</span>
                                                <span className="metric-label">Bids</span>
                                            </div>
                                        </div>

                                        <div className="auction-metric">
                                            <div className="metric-icon">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" />
                                                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2" />
                                                </svg>
                                            </div>
                                            <div className="metric-content">
                                                <span className="metric-value">{auction.views}</span>
                                                <span className="metric-label">Views</span>
                                            </div>
                                        </div>

                                        <div className="auction-metric">
                                            <div className="metric-icon">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M18 8A6 6 0 0 0 6 8C6 11.3137 3.31371 14 0 14M18 8C20.2091 8 22 9.79086 22 12C22 14.2091 20.2091 16 18 16M18 8C20.2091 8 22 5.79086 22 3C22 0.790861 20.2091 -1 18 -1C15.7909 -1 14 0.790861 14 3C14 5.79086 15.7909 8 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <div className="metric-content">
                                                <span className="metric-value">{auction.watchers}</span>
                                                <span className="metric-label">Watchers</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="auction-bidder-info">
                                        <div className="bidder-label">Current Highest Bidder:</div>
                                        <div className="bidder-name">{auction.highestBidder}</div>
                                    </div>
                                </div>
                                <div className="auction-card-footer">
                                    <Link to={`/seller/listing/${auction.id}`} className="primary-button small">
                                        View Details
                                    </Link>
                                    <div className="auction-actions">
                                        <button
                                            className="icon-button"
                                            title="End Auction Early"
                                            onClick={() => handleEndAuction(auction.id)}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6312 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6312 13.6815 18 14.5717 18 15.5C18 16.4283 17.6312 17.3185 16.9749 17.9749C16.3185 18.6312 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                        <button
                                            className="icon-button"
                                            title="Relist"
                                            onClick={() => handleRelist(auction.id)}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M1 4V10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M23 20V14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M20.49 9C19.9828 7.56678 19.1209 6.2854 17.9845 5.27542C16.8482 4.26543 15.4745 3.55976 13.9917 3.22426C12.5089 2.88875 10.9652 2.93434 9.50481 3.35677C8.04437 3.77921 6.71475 4.56471 5.64 5.64L1 10M23 14L18.36 18.36C17.2853 19.4353 15.9556 20.2208 14.4952 20.6432C13.0348 21.0657 11.4911 21.1113 10.0083 20.7757C8.52547 20.4402 7.1518 19.7346 6.01547 18.7246C4.87913 17.7146 4.01717 16.4332 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                        <button className="icon-button" title="View Bids">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {sortedAuctions.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h3 className="empty-state-title">No Auctions Found</h3>
                            <p className="empty-state-description">
                                {filter === 'all'
                                    ? "You don't have any active auctions. Start a new auction to begin selling."
                                    : "No auctions match your current filter. Try adjusting your filter settings."}
                            </p>
                            <Link to="/seller/create-product" className="primary-button">
                                Start Your First Auction
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default SellerAuctions