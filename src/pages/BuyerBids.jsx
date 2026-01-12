import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './BuyerBids.css'
import { useSelector, useDispatch } from 'react-redux'
import { fetchMyBids } from '../store/actions/buyerActions'
import { toast } from 'react-toastify'

const BuyerBids = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const [allBids, setAllBids] = useState([])
  const [isLoadingAllPages, setIsLoadingAllPages] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Fetch all pages of bids on mount
  useEffect(() => {
    const fetchAllBidsPages = async () => {
      setIsLoadingAllPages(true)
      setError(null)
      try {
        let allResults = []
        let nextPage = 1
        let hasMore = true

        while (hasMore) {
          const response = await dispatch(fetchMyBids({ page: nextPage })).unwrap()
          allResults = [...allResults, ...(response.results || [])]

          if (response.next) {
            nextPage += 1
          } else {
            hasMore = false
          }
        }

        setAllBids(allResults)
      } catch (err) {
        console.error('Error fetching all bids:', err)
        setError('Failed to load your bids')
        toast.error('Failed to load complete bid list')
      } finally {
        setIsLoadingAllPages(false)
      }
    }

    fetchAllBidsPages()
  }, [dispatch])

  // Get auction image with fallback
  const getAuctionImage = useCallback((bid) => {
    if (bid?.auction_media && Array.isArray(bid.auction_media)) {
      const imageMedia = bid.auction_media.find(m => m.media_type === 'image')
      if (imageMedia?.file) {
        return imageMedia.file
      }
    }
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23e5e7eb" width="200" height="200"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E'
  }, [])

  // Format currency
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(parseFloat(amount) || 0)
  }, [])

  // Filter bids by search query
  const filteredBids = useMemo(() => {
    return allBids.filter(bid => {
      const matchesSearch = searchQuery === '' ||
        bid.auction_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `#${bid.auction_id}`.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    })
  }, [allBids, searchQuery])

  // Paginate filtered results
  const totalItems = filteredBids.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedBids = filteredBids.slice(startIndex, endIndex)

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Handle search change
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value)
  }, [])

  // Handle page change
  const handlePageChange = useCallback((pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }, [totalPages])

  // Handle navigation to auction
  const handleNavigateToAuction = useCallback((auctionId) => {
    navigate(`/buyer/auction/${auctionId}`)
  }, [navigate])

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div className="buyer-bids-skeleton">
      <div className="buyer-bids-header-skeleton">
        <div className="buyer-bids-title-skeleton skeleton-shimmer"></div>
        <div className="buyer-bids-count-skeleton skeleton-shimmer"></div>
      </div>
      
      <div className="buyer-bids-search-skeleton skeleton-shimmer"></div>
      
      <div className="buyer-bids-grid-skeleton">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="buyer-bids-card-skeleton skeleton-shimmer">
            <div className="buyer-bids-image-skeleton skeleton-shimmer"></div>
            <div className="buyer-bids-content-skeleton">
              <div className="buyer-bids-lot-skeleton skeleton-shimmer"></div>
              <div className="buyer-bids-title-inner-skeleton skeleton-shimmer"></div>
              <div className="buyer-bids-details-skeleton">
                <div className="buyer-bids-row-skeleton skeleton-shimmer"></div>
                <div className="buyer-bids-row-skeleton skeleton-shimmer"></div>
              </div>
            </div>
            <div className="buyer-bids-actions-skeleton skeleton-shimmer"></div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="my-bids-page">
      <div className="my-bids-content">
        <div className="my-bids-container">
          <nav className="breadcrumbs">
            <Link to="/buyer/dashboard">Dashboard</Link>
            <span>/</span>
            <span>Bids</span>
            <span>/</span>
            <span>Active</span>
          </nav>

          <div className="page-header">
            <div className="header-left">
              <h1 className="page-title">Active Bids</h1>
              <span className="bids-results-count">
                {isLoadingAllPages ? 'Loading...' : `${totalItems} Results`}
              </span>
            </div>
            <div className="header-right">
              <div className="live-updates-indicator">
                <span className="live-dot">•</span>
                <span>Live Updates Enabled</span>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoadingAllPages && (
            <LoadingSkeleton />
          )}

          {/* Error State */}
          {error && !isLoadingAllPages && (
            <div className="buyer-bids-error">
              <div className="buyer-bids-error-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="buyer-bids-error-title">Unable to Load Bids</h3>
              <p className="buyer-bids-error-message">
                We encountered an issue while loading your bids. Please try again.
              </p>
              <div className="buyer-bids-error-actions">
                <button
                  className="buyer-bids-retry-btn"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
                <Link to="/buyer/dashboard" className="buyer-bids-back-link">
                  Go to Dashboard
                </Link>
              </div>
            </div>
          )}

          {/* Search Bar */}
          {!isLoadingAllPages && !error && allBids.length > 0 && (
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
                  onChange={handleSearchChange}
                  disabled={isLoadingAllPages}
                />
              </div>
            </div>
          )}

          {/* Empty State - No Bids */}
          {!isLoadingAllPages && !error && paginatedBids.length === 0 && allBids.length === 0 && (
            <div className="buyer-bids-empty">
              <div className="buyer-bids-empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <path d="M9 11L12 14L22 4" stroke="#8CC63F" strokeWidth="2" strokeLinecap="round" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#8CC63F" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="buyer-bids-empty-title">No Bids Yet</h3>
              <p className="buyer-bids-empty-message">
                You haven't placed any bids yet. Start exploring auctions to place your first bid!
              </p>
              <div className="buyer-bids-empty-actions">
                <Link to="/buyer/auctions" className="buyer-bids-explore-btn">
                  Explore Auctions
                </Link>
                <Link to="/buyer/dashboard" className="buyer-bids-dashboard-link">
                  Go to Dashboard
                </Link>
              </div>
            </div>
          )}

          {/* Empty State - No Search Results */}
          {!isLoadingAllPages && !error && paginatedBids.length === 0 && allBids.length > 0 && (
            <div className="buyer-bids-empty-search">
              <div className="buyer-bids-empty-search-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20a8 8 0 100-16 8 8 0 000 16z" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="buyer-bids-empty-search-title">No Results Found</h3>
              <p className="buyer-bids-empty-search-message">
                No bids match your search for "<strong>{searchQuery}</strong>". Try different keywords.
              </p>
              <div className="buyer-bids-empty-search-actions">
                <button
                  className="buyer-bids-clear-search"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </button>
                <Link to="/buyer/auctions" className="buyer-bids-view-all-link">
                  View All Auctions
                </Link>
              </div>
            </div>
          )}

          {/* Bids Grid */}
          {!isLoadingAllPages && !error && paginatedBids.length > 0 && (
            <>
              <div className="bids-grid">
                {paginatedBids.map(bid => (
                  <div
                    key={bid.id}
                    className={`bid-card ${bid.status === 'CLOSED' ? 'closed' : bid.status === 'AWAITING_PAYMENT' ? 'awaiting-payment' : 'active'}`}
                  >
                    <div className="bid-image">
                      <img
                        src={getAuctionImage(bid)}
                        alt={bid.auction_title}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23e5e7eb" width="200" height="200"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="14"%3EImage Error%3C/text%3E%3C/svg%3E'
                        }}
                      />
                      {bid.status === 'ACTIVE' && (
                        <div className="live-badge">
                          <span className="live-dot">•</span>
                          <span>Live</span>
                        </div>
                      )}
                    </div>

                    <div className="mybid-details">
                      <div className="bid-lot-id">#{bid.auction_id}</div>
                      <h3 className="bid-title">{bid.auction_title}</h3>

                      <div className="mybidding-info">
                        <div className="bid-row">
                          <span className="bid-label">Your Bid</span>
                          <span className="bid-value">{formatCurrency(bid.amount)}</span>
                        </div>
                        <div className="bid-row">
                          <span className="bid-label">Bid Status</span>
                          <span className={`bid-status-badge ${bid.status.toLowerCase()}`}>
                            {bid.status === 'AWAITING_PAYMENT' ? 'Awaiting Payment' : bid.status}
                          </span>
                        </div>
                      </div>

                      {bid.status === 'CLOSED' && (
                        <div className="status-banner closed-banner">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span>Auction Closed</span>
                        </div>
                      )}
                      {bid.status === 'AWAITING_PAYMENT' && (
                        <div className="status-banner awaiting-payment-banner">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span>Awaiting Payment</span>
                        </div>
                      )}
                      {bid.status === 'ACTIVE' && (
                        <div className="status-banner active-banner">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <circle cx="12" cy="12" r="3" fill="currentColor" />
                          </svg>
                          <span>Auction Active</span>
                        </div>
                      )}
                    </div>

                    <div className="mybid-actions">
                      <button
                        className="bids-action-btn secondary"
                        onClick={() => handleNavigateToAuction(bid.auction_id)}
                        disabled={isLoadingAllPages}
                      >
                        View Auction
                      </button>
                      {bid.status === 'ACTIVE' && (
                        <button
                          className="bids-action-btn primary"
                          onClick={() => handleNavigateToAuction(bid.auction_id)}
                          disabled={isLoadingAllPages}
                        >
                          Increase Bid
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mybids-pagination">
                  <button
                    className="mybids-pagination-btn mybids-prev-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoadingAllPages}
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
                        disabled={isLoadingAllPages}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>

                  <button
                    className="mybids-pagination-btn mybids-next-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoadingAllPages}
                    aria-label="Next page"
                  >
                    Next
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BuyerBids