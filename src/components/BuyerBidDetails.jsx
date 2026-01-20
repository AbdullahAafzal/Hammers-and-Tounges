import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import './BuyerBidDetails.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAuctionBids, placeBid } from '../store/actions/buyerActions';
import { fetchAuctionsList } from '../store/actions/AuctionsActions';
import { getMediaUrl } from '../config/api.config';
import { fetchProfile } from '../store/actions/profileActions';

import { toast } from 'react-toastify';

const BuyerBidDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch()
  const bidDetails = location.state?.listing;
  const { profile } = useSelector(state => state.profile)
  //   const bidHistory = location.state?.bidHistory || [];
  const { auctionBids: bidHistory, auctions, isPlacingBid, auctionBids } = useSelector(state => state.buyer)
  const [activeTab, setActiveTab] = useState('information');
  const [selectedImage, setSelectedImage] = useState(0);
  const buyerProfile = profile?.buyer_profile

  console.log("bidDetails: ", bidDetails);
  console.log("auctions: ", auctions);

  const auction = auctions?.results?.find(auction => auction?.id === parseInt(id))
  console.log(auction);


  // Memoized values
  const images = useMemo(() =>
    bidDetails?.auction_media?.filter(m => m.media_type === 'image').map(m => getMediaUrl(m.file)) || [],
    [bidDetails?.auction_media]
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  useEffect(() => {
    dispatch(fetchAuctionsList())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchProfile())
  }, dispatch)




  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    dispatch(fetchAuctionBids(id))
  }, [id, dispatch])

  const [state, setState] = useState({
    // selectedAuction: auctionObj || null,
    // activeTab: 'description',
    customBidAmount: '',
    // selectedImage: 0,
    // timeRemaining: { hours: 0, minutes: 0, seconds: 0 },
    // isLoading: !auctionObj,
    error: null,
    showPointsWarning: false,
  });

  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'N/A';

    const now = new Date().getTime();
    const past = new Date(dateString).getTime();
    const difference = now - past;

    const minutes = Math.floor(difference / (1000 * 60));
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };



  const isLive = useMemo(() => auction?.status === 'ACTIVE', [auction?.status]);
  const isUpcoming = useMemo(() => auction?.status === 'APPROVED', [auction?.status]);
  const isClosed = useMemo(() => auction?.status === 'CLOSED', [auction?.status]);
  const isAwaitingPayment = useMemo(() => auction?.status === 'AWAITING_PAYMENT', [auction?.status]);


  const requiredPoints = useMemo(() => {
    const bidAmount = parseFloat(state.customBidAmount) || 0;
    return Math.ceil(bidAmount * 0.5); // 50% of bid amount
  }, [state.customBidAmount]);

  console.log("requiredPoints: ", requiredPoints);

  // Check if user has enough points
  const hasEnoughPoints = useMemo(() => {
    const userPoints = parseFloat(buyerProfile?.points) || 0;
    return userPoints >= requiredPoints;
  }, [buyerProfile?.points, requiredPoints]);

  console.log("hasEnoughPoints: ", hasEnoughPoints);

  const handleCustomBidChange = useCallback((e) => {
    const value = e.target.value;
    setState(prev => ({
      ...prev,
      customBidAmount: value,
      showPointsWarning: false
    }));
  }, []);


  const handleCustomBidSubmit = useCallback((e) => {
    e.preventDefault();
    // Check if user has enough points
    if (!hasEnoughPoints) {
      setState(prev => ({
        ...prev,
        showPointsWarning: true
      }));
      return;
    }

    if (!auction || !state.customBidAmount) {
      return;
    }


    const bidAmount = parseFloat(state.customBidAmount);
    const minBidAmount = parseFloat(auction?.initial_price || 0) + 1;
    const highBidAmount = parseFloat(auctionBids?.[0]?.amount) + 1;

    // Validate bid amount
    if (bidAmount < highBidAmount) {
      setState(prev => ({
        ...prev,
        showPointsWarning: false
      }));
      toast.info('Bid must be greater than the highest bid')

      return;
    }
    // Validate bid amount
    if (bidAmount < minBidAmount) {
      setState(prev => ({
        ...prev,
        showPointsWarning: false
      }));
      toast.info('Bid must be greater than the current price')
      return;
    }

    // Place bid if validation passes
    dispatch(placeBid({
      auction_id: auction?.id,
      amount: bidAmount
    })).then((result) => {
      if (result.type === 'buyer/placeBid/fulfilled') {
        setState(prev => ({
          ...prev,
          customBidAmount: '',
          showPointsWarning: false
        }));
        // Refresh bids and profile
        dispatch(fetchAuctionBids(id));
        dispatch(fetchProfile());
      }
    });

    navigate('/buyer/bids', { replace: true })
  }, [auction, state.customBidAmount, hasEnoughPoints, dispatch, id]);



  const getStatusColor = (status) => {
    switch (status) {
      case 'AWAITING_PAYMENT':
        return { bg: 'rgba(251, 146, 60, 0.2)', border: 'rgba(251, 146, 60, 0.5)', color: '#fb923c' };
      case 'WON':
        return { bg: 'rgba(34, 197, 94, 0.2)', border: 'rgba(34, 197, 94, 0.5)', color: '#22c55e' };
      case 'LOST':
        return { bg: 'rgba(239, 68, 68, 0.2)', border: 'rgba(239, 68, 68, 0.5)', color: '#ef4444' };
      case 'ACTIVE':
        return { bg: 'rgba(140, 198, 63, 0.4)', border: 'rgba(140, 198, 63, 0.7)', color: '#8CC63F' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.2)', border: 'rgba(107, 114, 128, 0.5)', color: '#9ca3af' };
    }
  };

  const statusColors = bidDetails?.status ? getStatusColor(bidDetails.status) : null;

  // Not found state
  if (!bidDetails) {
    return (
      <div className="bid-details-page">
        <div className="bid-details-container">
          <div className="bid-details-not-found">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20a8 8 0 100-16 8 8 0 000 16z" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h2>Bid Details Not Found</h2>
            <p>The bid information you're looking for doesn't exist or couldn't be loaded.</p>
            <Link to="/buyer/bids" className="bid-details-back-btn">Back to My Bids</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bid-details-page">
      <div className="bid-details-container">
        {/* Breadcrumbs */}
        <nav className="bid-details-breadcrumbs">
          <Link to="/buyer/dashboard">Home</Link>
          <span>/</span>
          <Link to="/buyer/bids">My Bids</Link>
          {/* <span>/</span> */}
          {/* <span>Bid #{bidDetails.id}</span> */}
        </nav>

        {/* Header */}
        <div className="bid-details-header">
          <div className="bid-details-header-content">
            <h1 className="bid-details-title">{bidDetails.auction_title || 'Untitled Auction'}</h1>
            {/* <p className="bid-details-subtitle">Bid ID: #{bidDetails.id}</p> */}
          </div>
          {bidDetails.status && (
            <div
              className="bid-details-status-badge"
              style={{
                backgroundColor: statusColors.bg,
                borderColor: statusColors.border,
                color: statusColors.color
              }}
            >
              {bidDetails.status.replace(/_/g, ' ')}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="bid-details-content">
          {/* Image Gallery */}
          <div className="bid-details-gallery">
            <div className="bid-details-main-image">
              {images.length > 0 ? (
                <img src={images[selectedImage]} alt={bidDetails.auction_title} />
              ) : (
                <div className="bid-details-no-image">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" fill="rgba(255,255,255,0.3)" />
                    <path d="M21 15L16 10L5 21" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p>No Image Available</p>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="bid-details-thumbnails">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`bid-details-thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`View ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bid Summary Card */}
          <div className="bid-details-summary">
            <div className="bid-summary-header">
              <h3>Your Bid Summary</h3>
            </div>
            <div className="bid-summary-content">
              <div className="bid-summary-item">
                <span className="bid-summary-label">Title</span>
                <span className="bid-summary-value-small">{bidDetails.auction_title || 'N/A'}</span>
              </div>
              <div className="bid-summary-divider"></div>
              <div className="bid-summary-item primary">
                <span className="bid-summary-label">Starting Bid</span>
                <span className="bid-summary-value">
                  {auction?.initial_price ? formatCurrency(parseFloat(auction?.initial_price)) : 'N/A'}
                </span>
              </div>
              <div className="bid-summary-item primary">
                <span className="bid-summary-label">Your Bid Amount</span>
                <span className="bid-summary-value">
                  {bidDetails.amount ? formatCurrency(parseFloat(bidDetails.amount)) : 'N/A'}
                </span>
              </div>
              <div className="bid-summary-item primary">
                <span className="bid-summary-label">Current Highest Bid</span>
                <span className="bid-summary-value">
                  {bidDetails.amount ? formatCurrency(parseFloat(bidHistory?.[0]?.amount)) : 'N/A'}
                </span>
              </div>
              <div className="bid-summary-item-form primary">
                {/* <span className="bid-summary-label">Current Highest Bid</span>
                <span className="bid-summary-value">
                  {bidDetails.amount ? formatCurrency(parseFloat(bidHistory?.[0]?.amount)) : 'N/A'}
                </span> */}

                {isUpcoming && (
                  <div className="buyer-details-upcoming-notice">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div>
                      <strong>This auction is not live yet</strong>
                      <p>Bidding will be available when the auction goes live.</p>
                    </div>
                  </div>
                )}

                {isClosed && (
                  <div className="buyer-details-closed-notice">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div>
                      <strong>This auction has ended</strong>
                      <p>No more bids can be placed.</p>
                    </div>
                  </div>
                )}

                {isAwaitingPayment && (
                  <div className="buyer-details-payment-notice">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-10C6.48 4 2 6.69 2 10c0 3.72 4.64 7 10 7 .93 0 1.83-.13 2.71-.38.67.52 1.49.99 2.29.99 1.1 0 2-.9 2-2 0-.78-.49-1.45-1.19-1.78.71-1.03 1.19-2.3 1.19-3.83 0-3.31-4.48-6-10-6z" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <div>
                      <strong>Awaiting payment</strong>
                      <p>Complete your payment to finalize this purchase.</p>
                    </div>
                  </div>
                )}


                {isLive && (
                  <>
                    {/* Points Information Notice */}
                    <div className="buyer-details-notice rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold mb-1">Funds Required</h4>
                          <p className="text-sm ">
                            You must have at least <strong>50% of your bid amount</strong> in your funds balance to place a bid.

                          </p>
                        </div>
                      </div>
                    </div>

                    <form className="buyer-details-bidding-form" onSubmit={handleCustomBidSubmit}>
                      <div className="space-y-3 w-full">
                        <input
                          type="number"
                          className="buyer-details-bid-input"
                          placeholder="Enter your bid amount"
                          value={state.customBidAmount}
                          onChange={handleCustomBidChange}
                          // min={parseFloat(auction?.initial_price || 0) + 1}
                          // step="0.01"
                          disabled={isPlacingBid}
                        />

                        {/* Insufficient Points Warning */}
                        {state.showPointsWarning || !hasEnoughPoints && (
                          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mt-3">
                            <div className="flex items-start gap-2">
                              <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              <div className="flex-1">
                                <h4 className="text-red-300 font-semibold mb-1">Insufficient Funds</h4>
                                <p className="text-red-200 text-sm mb-2">
                                  You do not have enough funds to place this bid. Please try one of the following:
                                </p>
                                <ul className="text-red-200 text-sm space-y-1 list-disc list-inside">
                                  {/* <li>Lower your bid amount</li> */}
                                  <li>Purchase more funds</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}

                        <button
                          type="submit"
                          className="buyer-details-bid-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isPlacingBid || !state.customBidAmount || !hasEnoughPoints}
                        >
                          {isPlacingBid ? 'Placing Bid...' : 'Place Bid'}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>


              {/* <div className="bid-summary-item">
                <span className="bid-summary-label">Auction ID</span>
                <span className="bid-summary-value-small">#{bidDetails.auction_id || 'N/A'}</span>
              </div>
              <div className="bid-summary-item">
                <span className="bid-summary-label">Bid ID</span>
                <span className="bid-summary-value-small">{bidDetails.id}</span>
              </div> */}
              {/* <div className="bid-summary-item">
                <span className="bid-summary-label">Time Ago</span>
                <span className="bid-summary-value-small">{formatRelativeTime(bidDetails.created_at)}</span>
              </div> */}
            </div>

            {bidDetails.status === 'AWAITING_PAYMENT' && (
              <div className="bid-payment-notice">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-10C6.48 4 2 6.69 2 10c0 3.72 4.64 7 10 7 .93 0 1.83-.13 2.71-.38.67.52 1.49.99 2.29.99 1.1 0 2-.9 2-2 0-.78-.49-1.45-1.19-1.78.71-1.03 1.19-2.3 1.19-3.83 0-3.31-4.48-6-10-6z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <div>
                  <strong>Payment Required</strong>
                  <p>Complete your payment to finalize this auction win.</p>
                </div>
              </div>
            )}


          </div>
        </div>

        {/* Tabs Section */}
        <div className="bid-details-tabs-section">
          <div className="bid-details-tabs">
            <button
              className={`bid-details-tab ${activeTab === 'information' ? 'active' : ''}`}
              onClick={() => setActiveTab('information')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Bid Information
            </button>
            <button
              className={`bid-details-tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M3.05 11C3.5 6.5 7.4 3 12 3C16.97 3 21 7.03 21 12C21 16.97 16.97 21 12 21C9.39 21 7.05 19.86 5.5 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Bid History (Total Bids: {bidHistory.length})
            </button>
          </div>

          <div className="bid-details-tab-content">
            {activeTab === 'information' && (
              <div className="bid-information-panel">
                <div className="bid-info-section">
                  {/* <h3 className="bid-info-section-title">Bid Details</h3> */}
                  <div className="bid-info-grid">
                    <div className="bid-info-item">
                      <span className="bid-info-label">Status</span>
                      <span className="bid-info-value">
                        {bidDetails.status ? bidDetails.status.replace(/_/g, ' ') : 'N/A'}
                      </span>
                    </div>

                    <div className="bid-info-item">
                      <span className="bid-info-label">Bid Created</span>
                      <span className="bid-info-value">{formatDate(bidDetails.created_at)}</span>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {activeTab === 'history' && (
              <div className="bid-history-panel">
                <h3 className="bid-history-title">All Bids for This Auction</h3>
                {bidHistory.length > 0 ? (
                  <div className="bid-history-list">
                    {bidHistory.map((bid, index) => (
                      <div key={bid.id} className="bid-history-item">
                        <div className="bid-history-rank">
                          <span className="rank-number">#{index + 1}</span>
                        </div>
                        <div className="bid-history-content">
                          <div className="bid-history-info">
                            <span className="bid-history-bidder">{bid.bidder_name || 'Anonymous'}</span>
                          </div>
                          {/* <span className="bid-history-relative">{formatRelativeTime(bid.created_at)}</span> */}
                          <span className="bid-history-time">{formatDate(bid.created_at)}</span>
                        </div>
                        <div className="bid-history-amount">
                          {formatCurrency(parseFloat(bid.amount))}
                        </div>
                        {/* {bid.id === bidDetails.id && (
                          <>
                            <div className="bid-history-your-bid">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
                              </svg>
                              Your Bid
                            </div>

                          </>
                        )} */}
                        {
                          index === 0 && (
                            <div className="bid-history-your-bid">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
                              </svg>
                              Highest
                            </div>
                          )
                        }
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bid-history-empty">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                      <path d="M12 8V12L15 15" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
                      <path d="M3.05 11C3.5 6.5 7.4 3 12 3C16.97 3 21 7.03 21 12C21 16.97 16.97 21 12 21C9.39 21 7.05 19.86 5.5 18" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <h4>No Bid History</h4>
                    <p>There are no other bids for this auction yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerBidDetails;