import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './SellerAuctionListings.css'
import SellerHeader from '../components/SellerHeader'

const SellerAuctionListings = () => {
  const [listings, setListings] = useState([
    {
      id: 1,
      title: 'Vintage Leather Armchair',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
      category: 'Furniture',
      startingPrice: 200.00,
      currentBid: 450.00,
      bids: 12,
      views: 245,
      status: 'active',
      timeRemaining: '2d 14h 22m',
      createdAt: '2024-01-15'
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
      status: 'active',
      timeRemaining: '1d 8h 5m',
      createdAt: '2024-01-18'
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
      status: 'active',
      timeRemaining: '5h 30m',
      createdAt: '2024-01-20'
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
      status: 'active',
      timeRemaining: '12h 45m',
      createdAt: '2024-01-21'
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
      status: 'ended',
      soldPrice: 1250.00,
      createdAt: '2024-01-10'
    },
    {
      id: 6,
      title: 'Art Deco Coffee Table',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
      category: 'Furniture',
      startingPrice: 400.00,
      currentBid: 620.00,
      bids: 0,
      views: 89,
      status: 'draft',
      createdAt: '2024-01-22'
    }
  ])

  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const filteredListings = listings.filter(listing => {
    if (filter === 'all') return true
    return listing.status === filter
  })

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
    if (sortBy === 'bids') return b.bids - a.bids
    if (sortBy === 'views') return b.views - a.views
    if (sortBy === 'price') return b.currentBid - a.currentBid
    return 0
  })

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { text: 'Active', color: '#8CC63F', bg: 'rgba(140, 198, 63, 0.15)' },
      ended: { text: 'Ended', color: '#6B7280', bg: 'rgba(107, 114, 128, 0.15)' },
      draft: { text: 'Draft', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' },
      sold: { text: 'Sold', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' }
    }
    
    const config = statusConfig[status] || statusConfig.active
    
    return (
      <span 
        className="status-badge"
        style={{
          backgroundColor: config.bg,
          color: config.color,
          border: `1px solid ${config.color}40`
        }}
      >
        {config.text}
      </span>
    )
  }

  return (
    <div className="seller-page">
      <SellerHeader />

      <main className="seller-main">
        <div className="page-container">
          <div className="page-header">
            <div className="page-title-section">
              <h1 className="page-title">My Products</h1>
              <p className="page-subtitle">Manage all your auction products in one place</p>
            </div>
            <div className="page-actions">
              <Link to="/seller/create-product" className="primary-button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Create New Product
              </Link>
            </div>
          </div>

          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-value">{listings.filter(l => l.status === 'active').length}</span>
                <span className="stat-label">Active Listings</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(140, 198, 63, 0.1)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#8CC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="#8CC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="#8CC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-value">{listings.reduce((sum, l) => sum + l.bids, 0)}</span>
                <span className="stat-label">Total Bids</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="#FFC107" strokeWidth="2"/>
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="#FFC107" strokeWidth="2"/>
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-value">{listings.reduce((sum, l) => sum + l.views, 0)}</span>
                <span className="stat-label">Total Views</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6312 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6312 13.6815 18 14.5717 18 15.5C18 16.4283 17.6312 17.3185 16.9749 17.9749C16.3185 18.6312 15.4283 19 14.5 19H6" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-value">{formatCurrency(listings.filter(l => l.status === 'ended' || l.status === 'sold').reduce((sum, l) => sum + (l.soldPrice || l.currentBid), 0))}</span>
                <span className="stat-label">Total Revenue</span>
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
                    All Listings
                  </button>
                  <button 
                    className={`filter-button ${filter === 'active' ? 'active' : ''}`}
                    onClick={() => setFilter('active')}
                  >
                    Active
                  </button>
                  <button 
                    className={`filter-button ${filter === 'ended' ? 'active' : ''}`}
                    onClick={() => setFilter('ended')}
                  >
                    Ended
                  </button>
                  <button 
                    className={`filter-button ${filter === 'draft' ? 'active' : ''}`}
                    onClick={() => setFilter('draft')}
                  >
                    Drafts
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
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="bids">Most Bids</option>
                  <option value="views">Most Views</option>
                  <option value="price">Highest Price</option>
                </select>
              </div>
            </div>
          </div>

          <div className="listings-grid">
            {sortedListings.map((listing) => (
              <div key={listing.id} className="listing-card">
                <div className="listing-card-header">
                  <div className="listing-image">
                    <img src={listing.image} alt={listing.title} />
                  </div>
                  <div className="listing-status">
                    {getStatusBadge(listing.status)}
                  </div>
                </div>
                <div className="listing-card-body">
                  <h3 className="listing-title">{listing.title}</h3>
                  <p className="listing-category">{listing.category}</p>

                  <div className="listing-metrics">
                    <div className="metric">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{listing.bids} bids</span>
                    </div>
                    <div className="metric">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <span>{listing.views} views</span>
                    </div>
                  </div>

                  {listing.status === 'active' && (
                    <div className="listing-time">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <span>{listing.timeRemaining} left</span>
                    </div>
                  )}
                </div>
                <div className="listing-card-footer">
                  <Link to={`/seller/listing/${listing.id}`} className="secondary-button">
                    View Details
                  </Link>
                  <div className="listing-actions">
                    <button className="icon-button" title="Edit">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button className="icon-button" title="Delete">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default SellerAuctionListings