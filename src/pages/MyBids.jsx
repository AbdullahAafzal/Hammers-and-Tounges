import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './MyBids.css'

const MyBids = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const activeBids = [
    {
      id: 1,
      lotId: '#789012',
      title: 'Antique Ming Dynasty Vase',
      category: 'Fine Art & Collectibles Auction',
      image: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800&q=80',
      status: 'outbid',
      isLive: true,
      currentHighestBid: 2500.00,
      yourBid: 2400.00,
      timeRemaining: '1d 4h 12m 5s'
    },
    {
      id: 2,
      lotId: '#456789',
      title: '1985 Rolex Submariner',
      category: 'Luxury Watch Auction',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      status: 'leading',
      isLive: true,
      currentHighestBid: 8750.00,
      yourBid: 8750.00,
      timeRemaining: '2h 30m 15s'
    },
    {
      id: 3,
      lotId: '#123456',
      title: '1969 Ford Mustang Boss 429',
      category: 'Classic Car Auction',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
      status: 'upcoming',
      isLive: false,
      startingBid: 150000.00,
      yourMaxBid: 175000.00,
      timeRemaining: '3d 8h 0m 0s'
    },
    {
      id: 4,
      lotId: '#345678',
      title: 'Vintage Persian Rug',
      category: 'Fine Art & Collectibles Auction',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
      status: 'leading',
      isLive: true,
      currentHighestBid: 3200.00,
      yourBid: 3200.00,
      timeRemaining: '5h 45m 30s'
    },
    {
      id: 5,
      lotId: '#567890',
      title: 'Modern Abstract Painting',
      category: 'Fine Art & Collectibles Auction',
      image: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800&q=80',
      status: 'outbid',
      isLive: true,
      currentHighestBid: 4500.00,
      yourBid: 4200.00,
      timeRemaining: '12h 20m 10s'
    },
    {
      id: 6,
      lotId: '#567891',
      title: 'Modern Abstract Painting',
      category: 'Fine Art & Collectibles Auction',
      image: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800&q=80',
      status: 'outbid',
      isLive: true,
      currentHighestBid: 4500.00,
      yourBid: 4200.00,
      timeRemaining: '12h 20m 10s'
    },
    {
      id: 7,
      lotId: '#345679',
      title: 'Vintage Persian Rug',
      category: 'Fine Art & Collectibles Auction',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
      status: 'leading',
      isLive: true,
      currentHighestBid: 3200.00,
      yourBid: 3200.00,
      timeRemaining: '5h 45m 30s'
    },
    {
      id: 8,
      lotId: '#789123',
      title: 'Rare Whiskey Collection',
      category: 'Luxury Spirits Auction',
      image: 'https://images.unsplash.com/photo-1550276300-237010ad7811?w=800&q=80',
      status: 'leading',
      isLive: true,
      currentHighestBid: 12500.00,
      yourBid: 12500.00,
      timeRemaining: '8h 15m 20s'
    },
    {
      id: 9,
      lotId: '#891234',
      title: 'Diamond Tennis Bracelet',
      category: 'Jewelry Auction',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
      status: 'outbid',
      isLive: true,
      currentHighestBid: 8500.00,
      yourBid: 8200.00,
      timeRemaining: '1d 2h 45m 10s'
    },
    {
      id: 10,
      lotId: '#912345',
      title: 'Signed First Edition Books',
      category: 'Fine Art & Collectibles Auction',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
      status: 'leading',
      isLive: true,
      currentHighestBid: 3500.00,
      yourBid: 3500.00,
      timeRemaining: '6h 30m 0s'
    },
    {
      id: 11,
      lotId: '#912345',
      title: 'Signed First Edition Books',
      category: 'Fine Art & Collectibles Auction',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
      status: 'leading',
      isLive: true,
      currentHighestBid: 3500.00,
      yourBid: 3500.00,
      timeRemaining: '6h 30m 0s'
    },
    {
      id: 12,
      lotId: '#912345',
      title: 'Signed First Edition Books',
      category: 'Fine Art & Collectibles Auction',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
      status: 'leading',
      isLive: true,
      currentHighestBid: 3500.00,
      yourBid: 3500.00,
      timeRemaining: '6h 30m 0s'
    },
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const filteredBids = activeBids.filter(bid => {
    if (!bid.isLive) return false
    const matchesSearch = searchQuery === '' ||
      bid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bid.lotId.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const totalItems = filteredBids.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredBids.slice(startIndex, endIndex)

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  return (
    <div className="my-bids-page">
      <div className="my-bids-content">
        <div className="my-bids-container">
          <nav className="breadcrumbs">
            <Link to="/dashboard">Dashboard</Link>
            <span>/</span>
            <span>Bids</span>
            <span>/</span>
            <span>Active</span>
          </nav>

          <div className="page-header">
            <div className="header-left">
              <h1 className="page-title">Active Bids</h1>
            </div>
            <div className="header-right">
              <div className="live-updates-indicator">
                <span className="live-dot">•</span>
                <span>Live Updates Enabled</span>
              </div>
            </div>
          </div>

          <div className="search-bar">
            <div className="search-wrapper">
              <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search by Lot Name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="bids-grid">
            {currentItems.map(bid => (
              <div
                key={bid.id}
                className={`bid-card ${bid.status === 'outbid' ? 'outbid' : bid.status === 'leading' ? 'leading' : 'upcoming'}`}
              >
                

                <div className="bid-image">
                  <img src={bid.image} alt={bid.title} />
                  <div className="live-badge">
                    <span className="live-dot">•</span>
                    <span>Live</span>
                  </div>
                </div>

                <div className="mybid-details">
                  <div className="bid-lot-id">{bid.lotId}</div>
                  <h3 className="bid-title">{bid.title}</h3>
                  <div className="bid-category">{bid.category}</div>

                  <div className="mybidding-info">
                    <div className="bid-row">
                      <span className="bid-label">Current Highest Bid</span>
                      <span className="bid-value">{formatCurrency(bid.currentHighestBid)}</span>
                    </div>
                    <div className={`bid-row ${bid.status === 'outbid' ? 'outbid-row' : 'leading-row'}`}>
                      <span className="bid-label">Your Bid</span>
                      <span className={`bid-value ${bid.status === 'outbid' ? 'outbid-value' : 'leading-value'}`}>
                        {formatCurrency(bid.yourBid)}
                      </span>
                    </div>
                  </div>

                  <div className="buyer-time-remaining">
                    <span className="time-label">Time Remaining</span>
                    <span className="time-value">{bid.timeRemaining}</span>
                  </div>

                  {bid.status === 'outbid' && (
                  <div className="status-banner outbid-banner">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>You have been outbid — Increase your bid to stay in the lead.</span>
                  </div>
                )}
                {bid.status === 'leading' && (
                  <div className="status-banner leading-banner">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>You are the leading bidder!</span>
                  </div>
                )}
                 
                </div>

                <div className="mybid-actions">
                  <button
                    className="bids-action-btn secondary"
                    onClick={() => navigate(`/buyer/auction/${bid.id}`)}
                  >
                    Enter Live Room
                  </button>
                  <button
                    className="bids-action-btn primary"
                    onClick={() => navigate(`/buyer/auction/${bid.id}`)}
                  >
                    Increase Bid
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mybids-pagination">
              <button
                className="mybids-pagination-btn mybids-prev-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Previous
              </button>

              <div className="mybids-page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                  <button
                    key={pageNumber}
                    className={`mybids-page-number ${currentPage === pageNumber ? 'active' : ''}`}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>

              <button
                className="mybids-pagination-btn mybids-next-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                Next
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyBids