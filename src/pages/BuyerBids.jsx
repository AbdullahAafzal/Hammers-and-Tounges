import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './BuyerBids.css'
import { useSelector, useDispatch } from 'react-redux'
import { fetchMyBids, fetchAuctionBids } from '../store/actions/buyerActions'
import { getMediaUrl } from '../config/api.config'

const BuyerBids = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [allBidss, setAllBids] = useState([]);
  const [isLoadingAllPages, setIsLoadingAllPages] = useState(false);
  const [page, setPage] = useState(1);
  const { myBids, allBids, isLoading, error, nextPage, prevPage } = useSelector(state => state.buyer)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPageUrl, setCurrentPageUrl] = useState(null)

  useEffect(() => {
    dispatch(fetchMyBids({ page }))
  }, [dispatch, page])

  useEffect(() => {
    const fetchAllPages = async () => {
      setIsLoadingAllPages(true);
      try {
        let allResults = [];
        let nextPageNum = 1;
        let hasMore = true;

        while (hasMore) {
          const response = await dispatch(fetchMyBids({ page: nextPageNum })).unwrap();
          allResults = [...allResults, ...(response.results || [])];

          if (response.next) {
            nextPageNum += 1;
          } else {
            hasMore = false;
          }
        }

        setAllBids(allResults);
      } catch (err) {
        console.error('Error fetching all bids:', err);
      } finally {
        setIsLoadingAllPages(false);
      }
    };

    fetchAllPages();
  }, [dispatch]);


  // Fetch bids for each auction when myBids are loaded
  useEffect(() => {
    if (myBids?.results?.length > 0) {
      myBids.results.forEach(bid => {
        // Only fetch if we don't already have bids for this auction
        if (!allBids[bid.auction_id]) {
          dispatch(fetchAuctionBids(bid.auction_id))
        }
      })
    }
  }, [myBids?.results, dispatch, allBids])

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
    if (!auctionMedia || auctionMedia.length === 0) {
      return 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800&q=80'
    }
    const imageMedia = auctionMedia.find(media => media.media_type === 'image')
    return imageMedia ? getMediaUrl(imageMedia.file) : 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800&q=80'
  }

  // Get highest bid for an auction
  const getHighestBid = (auctionId) => {
    const auctionBids = allBids[auctionId]
    if (!auctionBids || auctionBids.length === 0) return null

    return auctionBids.reduce((highest, current) => {
      const currentAmount = parseFloat(current.amount)
      const highestAmount = parseFloat(highest.amount)
      return currentAmount > highestAmount ? current : highest
    }, auctionBids[0])
  }

  // Check if user's bid is the highest
  const getBidStatus = (bid) => {
    const highestBid = getHighestBid(bid.auction_id)
    if (!highestBid) return { isLeading: false, message: 'Loading...' }

    const userBidAmount = parseFloat(bid.amount)
    const highestBidAmount = parseFloat(highestBid.amount)

    if (userBidAmount >= highestBidAmount) {
      return { isLeading: true, message: "You'r leading!", highestAmount: highestBidAmount }
    } else {
      return { isLeading: false, message: "You'r outbid", highestAmount: highestBidAmount }
    }
  }

  // const filteredBids = (myBids?.results?.filter(bid => {
  //   const matchesSearch = searchQuery === '' ||
  //     bid.auction_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     bid.id.toString().includes(searchQuery)
  //   return matchesSearch
  // }))

  const filteredBids = allBidss?.filter(bid => {
    const matchesSearch = searchQuery === '' ||
      bid?.auction_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bid.id.toString().includes(searchQuery);
    return matchesSearch;
  });

  // const handlePageChange = (url) => {
  //   if (url) {
  //     setCurrentPageUrl(url)
  //     dispatch(fetchMyBids(url))
  //   }
  // }

  // const itemsPerPage = 10;
  // const totalBidsCount = myBids?.count || 0;
  // const totalPages = Math.ceil(totalBidsCount / itemsPerPage);
  // const hasNextPage = page < totalPages;
  // const hasPrevPage = page > 1;

  const itemsPerPage = 10;
  const totalFilteredCount = filteredBids.length;
  const totalPages = Math.ceil(totalFilteredCount / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBids = filteredBids.slice(startIndex, endIndex);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  // Pagination handlers
  const handleNext = useCallback(() => {
    if (hasNextPage) {
      setPage(prev => prev + 1);
    }
  }, [hasNextPage]);

  const handlePrevious = useCallback(() => {
    if (hasPrevPage) {
      setPage(prev => prev - 1);
    }
  }, [hasPrevPage]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);


  if (isLoading && (!myBids?.results || myBids?.results?.length === 0)) {
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

          <div className="page-header">
            <div className="header-left">
              <h1 className="page-title">My Bids</h1>
              <p className="bid-count">{myBids?.count || 0} total bid{myBids?.count !== 1 ? 's' : ''}</p>
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
            {/* {filteredBids?.length > 0 ? (
              filteredBids?.map(bid => { */}
            {paginatedBids?.length > 0 ? (
              paginatedBids?.map(bid => {
                const statusDisplay = getStatusDisplay(bid?.status)
                const imageUrl = getFirstImage(bid?.auction_media)
                const bidStatus = getBidStatus(bid)

                return (
                  <div
                    key={bid?.id}
                    className={`bid-card ${statusDisplay}`}
                  >
                    <div className="bid-image">
                      <img src={imageUrl} alt={bid?.auction_title} onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800&q=80'} />

                      <div className={`status-badge ${statusDisplay}`}>
                        {bid?.status === 'AWAITING_PAYMENT' ? 'Awaiting Payment' : bid?.status}
                      </div>
                    </div>

                    <div className="mybid-details">
                      <h3 className="bid-title">{bid?.auction_title}</h3>
                      <div className="bid-date">{new Date(bid?.created_at).toLocaleDateString()}</div>

                      <div className="mybidding-info">
                        <div className="bid-row">
                          <span className="bid-label">Your Bid</span>
                          <span className="bid-value">{formatCurrency(bid?.amount)}</span>
                        </div>
                        <div className="bid-row">
                          <span className="bid-label">Highest Bid</span>
                          <span className="bid-value">
                            {bidStatus.highestAmount ? formatCurrency(bidStatus.highestAmount) : 'Loading...'}
                          </span>
                        </div>

                        <div className="bid-row">
                          <span className="bid-label">Bid Status</span>
                          <span className={`bid-status ${bidStatus.isLeading ? 'leading' : 'outbid'}`}>
                            {bidStatus.message}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mybid-actions">
                      <button
                        className="bids-action-btn secondary"
                        onClick={() => navigate(`/buyer/bid/${bid.auction_id}`, { state: { listing: bid } })}
                      >
                        View Auction
                      </button>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="buyer-details-empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p>No bids found matching your search.</p>
              </div>
            )}
          </div>

          {/* {(nextPage || prevPage) && (
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
                <span>Showing {filteredBids?.length || 0} of {myBids?.count || 0} bids</span>
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
          )} */}
          {/* {totalBidsCount > itemsPerPage && (
            <div className="mybids-pagination">
              <button
                className="mybids-pagination-btn mybids-prev-btn"
                onClick={handlePrevious}
                disabled={!hasPrevPage}
                aria-label="Previous page"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Previous
              </button>

              <div className="mybids-page-info">
                <button disabled className="page-indicator">
                  <strong>{page} of {totalPages}</strong>
                </button>
              </div>

              <button
                className="mybids-pagination-btn mybids-next-btn"
                onClick={handleNext}
                disabled={!hasNextPage}
                aria-label="Next page"
              >
                Next
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )} */}

          {totalFilteredCount > itemsPerPage && (
            <div className="mybids-pagination">
              <button
                className="mybids-pagination-btn mybids-prev-btn"
                onClick={handlePrevious}
                disabled={!hasPrevPage}
                aria-label="Previous page"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Previous
              </button>

              <div className="mybids-page-info">
                <button disabled className="page-indicator">
                  <strong>{page} of {totalPages}</strong>
                </button>
              </div>

              <button
                className="mybids-pagination-btn mybids-next-btn"
                onClick={handleNext}
                disabled={!hasNextPage}
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