import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './BuyerBids.css'
import { useSelector, useDispatch } from 'react-redux'
import { fetchMyBids } from '../store/actions/buyerActions'
import { getMediaUrl } from '../config/api.config'

const BuyerBids = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { myBids, isLoading, error, nextPage, prevPage } = useSelector(state => state.buyer)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPageUrl, setCurrentPageUrl] = useState(null)

  console.log(myBids, "My Bids");


  useEffect(() => {
    dispatch(fetchMyBids())
  }, [dispatch])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const getStatusDisplay = (status) => {
    const statusMap = {
      ACTIVE: 'active',
      CLOSED: 'closed',
      AWAITING_PAYMENT: 'awaiting_payment'
    }
    return statusMap[status] || 'active'
  }

  const getFirstImage = (auctionMedia) => {
    console.log("auctionMedia: ", auctionMedia);

    if (!auctionMedia || auctionMedia.length === 0) {
      return 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800&q=80'
    }
    const imageMedia = auctionMedia.find(media => media.media_type === 'image')
    return imageMedia ? getMediaUrl(imageMedia.file) : 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800&q=80'
  }

  const filteredBids = (myBids?.results?.filter(bid => {
    const matchesSearch = searchQuery === '' ||
      bid.auction_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bid.id.toString().includes(searchQuery)
    return matchesSearch
  }))

  console.log("filteredBids: ", filteredBids);


  const handlePageChange = (url) => {
    if (url) {
      setCurrentPageUrl(url)
      dispatch(fetchMyBids(url))
    }
  }

  if (isLoading && myBids?.results?.length === 0) {
    return (
      <div className="my-bids-page">
        <div className="my-bids-content">
          <div className="my-bids-container">
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your bids...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="my-bids-page">
        <div className="my-bids-content">
          <div className="my-bids-container">
            <div className="error-state">
              <p>Unable to load your bids. Please try again later.</p>
              <button onClick={() => dispatch(fetchMyBids())} className="retry-btn">
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="my-bids-page">
      <div className="my-bids-content">
        <div className="my-bids-container">
          <nav className="breadcrumbs">
            <Link to="/dashboard">Dashboard</Link>
            <span>/</span>
            <span>Bids</span>
          </nav>

          <div className="page-header">
            <div className="header-left">
              <h1 className="page-title">My Bids</h1>
              <p className="bid-count">{filteredBids?.length} active bid{filteredBids?.length !== 1 ? 's' : ''}</p>
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
            {filteredBids?.length > 0 ? (
              filteredBids?.map(bid => {
                const statusDisplay = getStatusDisplay(bid.status)
                const imageUrl = getFirstImage(bid.auction_media)
                const isLive = bid.status === 'ACTIVE'

                return (
                  <div
                    key={bid.id}
                    className={`bid-card ${statusDisplay}`}
                  >
                    <div className="bid-image">
                      <img src={imageUrl} alt={bid.auction_title} onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800&q=80'} />
                      {/* {isLive && (
                        <div className="live-badge">
                          <span className="live-dot">•</span>
                          <span>Live</span>
                        </div>
                      )} */}
                      <div className={`status-badge ${statusDisplay}`}>
                        {bid.status === 'AWAITING_PAYMENT' ? 'Awaiting Payment' : bid.status}
                      </div>
                    </div>

                    <div className="mybid-details">
                      <div className="bid-lot-id">Bid #{bid.id}</div>
                      <h3 className="bid-title">{bid.auction_title}</h3>
                      <div className="bid-date">{new Date(bid.created_at).toLocaleDateString()}</div>

                      <div className="mybidding-info">
                        <div className="bid-row">
                          <span className="bid-label">Your Bid</span>
                          <span className="bid-value">{formatCurrency(bid.amount)}</span>
                        </div>
                        <div className="bid-row">
                          <span className="bid-label">Status</span>
                          <span className={`bid-status ${statusDisplay}`}>
                            {bid.status === 'AWAITING_PAYMENT' ? 'Awaiting Payment' : bid.status}
                          </span>
                        </div>
                      </div>

                      {/* <div className="status-message"> */}
                      {/* {bid.status === 'ACTIVE' && (
                          <div className="status-banner active-banner">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Bid is active</span>
                          </div>
                        )} */}
                      {/* {bid.status === 'CLOSED' && (
                          <div className="status-banner closed-banner">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Auction closed</span>
                          </div>
                        )} */}
                      {/* {bid.status === 'AWAITING_PAYMENT' && (
                          <div className="status-banner payment-banner">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            <span>Action required: Complete payment</span>
                          </div>
                        )} */}
                      {/* </div> */}
                    </div>

                    <div className="mybid-actions">
                      <button
                        className="bids-action-btn secondary"
                        onClick={() => navigate(`/buyer/bid/${bid.auction_id}`, { state: { listing: bid } })}
                      >
                        View Auction
                      </button>
                      {/* {bid.status === 'AWAITING_PAYMENT' && (
                        <button
                          className="bids-action-btn primary"
                          // onClick={() => navigate(`/checkout/${bid.id}`)}
                        >
                          Pay Now
                        </button>
                      )}
                      {bid.status === 'ACTIVE' && (
                        <button
                          className="bids-action-btn primary"
                          onClick={() => navigate(`/buyer/auction/${bid.auction_id}`, {state: {listing: bid}})}
                        >
                          Increase Bid
                        </button>
                      )} */}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p>No bids found matching your search.</p>
              </div>
            )}
          </div>

          {(nextPage || prevPage) && (
            <div className="mybids-pagination">
              <button
                className="mybids-pagination-btn mybids-prev-btn"
                onClick={() => handlePageChange(prevPage)}
                disabled={!prevPage}
                aria-label="Previous page"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Previous
              </button>

              <div className="mybids-page-info">
                <span>Page {myBids?.length > 0 ? '1' : '0'}</span>
              </div>

              <button
                className="mybids-pagination-btn mybids-next-btn"
                onClick={() => handlePageChange(nextPage)}
                disabled={!nextPage}
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

export default BuyerBids