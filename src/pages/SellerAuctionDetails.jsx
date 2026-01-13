import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuctionBids } from '../store/actions/buyerActions';
import { deleteAuction, fetchMyAuctions, updateAuction } from '../store/actions/sellerActions';
import './SellerAuctionDetails.css'

const SellerAuctionDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { myAuctions, isLoading } = useSelector((state) => state.seller);
  const { auctionBids } = useSelector((state) => state.buyer);

  const selectedAuction = useMemo(() =>
    myAuctions?.results?.find((auction) => auction?.id === parseInt(id)),
    [myAuctions, id]
  );

  const [activeTab, setActiveTab] = useState('bid-info');
  const [selectedImage, setSelectedImage] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    dispatch(fetchMyAuctions());
    dispatch(fetchAuctionBids(id));
  }, [dispatch, id]);

  // Memoized values
  const images = useMemo(() =>
    selectedAuction?.media?.filter(m => m.media_type === 'image').map(m => m.file) || [],
    [selectedAuction?.media]
  );

  const isLive = useMemo(() => selectedAuction?.status === 'ACTIVE', [selectedAuction?.status]);
  const isUpcoming = useMemo(() => selectedAuction?.status === 'APPROVED', [selectedAuction?.status]);
  const isClosed = useMemo(() => selectedAuction?.status === 'CLOSED', [selectedAuction?.status]);
  const isAwaitingPayment = useMemo(() => selectedAuction?.status === 'AWAITING_PAYMENT', [selectedAuction?.status]);

  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedAuction?.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }, [selectedAuction?.currency]);

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

  const calculateTimeRemaining = useCallback((endDate) => {
    const now = new Date().getTime();
    const endDateMs = new Date(endDate).getTime();
    const difference = endDateMs - now;

    if (difference > 0) {
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      return { hours, minutes, seconds };
    }
    return { hours: 0, minutes: 0, seconds: 0 };
  }, []);

  // Timer effect
  useEffect(() => {
    if (isLive && selectedAuction?.end_date) {
      setTimeRemaining(calculateTimeRemaining(selectedAuction.end_date));

      const interval = setInterval(() => {
        setTimeRemaining(calculateTimeRemaining(selectedAuction.end_date));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isLive, selectedAuction?.end_date, calculateTimeRemaining]);


  const handleEditListing = () => {
    if (!selectedAuction) return;

    navigate(`/seller/product`, {
      state: {
        isEditing: true,
        listingData: selectedAuction
      }
    })
  }

  const handleRemoveListing = () => {
    if (!selectedAuction) return;

    if (window.confirm('Are you sure you want to remove this listing? This action cannot be undone.')) {
      console.log('Remove listing clicked for ID:', selectedAuction.id)
      dispatch(deleteAuction(selectedAuction.id));
      navigate('/seller/auction-listings');
    }
  }

  // const handleSendForApproval = async () => {
  //   if (!selectedAuction) return;

  //   if (window.confirm('Send this listing for admin approval?')) {
  //     try {
  //       // Call the edit API with PENDING status
  //       await dispatch(updateAuction({
  //         auctionId: selectedAuction.id,
  //         auctionData: { status: 'PENDING' }
  //       })).unwrap();

  //       // Navigate back to listings page after successful submission
  //       navigate('/seller/auction-listings');
  //     } catch (error) {
  //       console.error('Error sending for approval:', error);
  //     }
  //   }
  // }

  const handleSendForApproval = async () => {
    if (!selectedAuction) return;

    if (!window.confirm('Send this listing for admin approval?')) return;

    try {
    await dispatch(updateAuction({
      auctionId: selectedAuction.id,
      auctionData: { status: 'PENDING' }
    })).unwrap();

    // // Refresh the auctions list to get updated data
    // await dispatch(fetchMyAuctions());
    
    // Now navigation will work!
    navigate('/seller/auction-listings', { replace: true });


    } catch (error) {
      console.error('Error sending for approval:', error);
    }
  };



  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return { bg: 'rgba(34, 197, 94, 0.2)', border: 'rgba(34, 197, 94, 0.5)', color: '#22c55e' };
      case 'APPROVED':
        return { bg: 'rgba(59, 130, 246, 0.2)', border: 'rgba(59, 130, 246, 0.5)', color: '#3b82f6' };
      case 'CLOSED':
        return { bg: 'rgba(107, 114, 128, 0.2)', border: 'rgba(107, 114, 128, 0.5)', color: '#9ca3af' };
      case 'AWAITING_PAYMENT':
        return { bg: 'rgba(251, 146, 60, 0.2)', border: 'rgba(251, 146, 60, 0.5)', color: '#fb923c' };
      case 'DRAFT':
        return { bg: 'rgba(251, 146, 60, 0.2)', border: 'rgba(251, 146, 60, 0.5)', color: '#fb923c' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.2)', border: 'rgba(107, 114, 128, 0.5)', color: '#9ca3af' };
    }
  };

  // Calculate bid statistics
  const bidStats = useMemo(() => {
    const bids = auctionBids || [];
    const today = new Date().toDateString();
    const bidsToday = bids.filter(bid => new Date(bid.created_at).toDateString() === today).length;
    const highestBid = bids.length > 0 ? Math.max(...bids.map(b => parseFloat(b.amount))) : null;
    const highestBidder = bids.length > 0 ? bids.find(b => parseFloat(b.amount) === highestBid)?.bidder_name : null;
    const lastBid = bids.length > 0 ? parseFloat(bids[0].amount) : null;

    return {
      total: bids.length,
      today: bidsToday,
      highest: highestBid,
      highestBidder: highestBidder,
      last: lastBid
    };
  }, [auctionBids]);

  // Loading state
  if (isLoading && !selectedAuction) {
    return (
      <div className="seller-details-page">
        <div className="seller-details-container">
          <div className="seller-details-loading">
            <div className="loading-spinner"></div>
            <p>Loading auction details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!selectedAuction) {
    return (
      <div className="seller-details-page">
        <div className="seller-details-container">
          <div className="seller-details-not-found">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20a8 8 0 100-16 8 8 0 000 16z" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h2>Auction Not Found</h2>
            <p>The auction you're looking for doesn't exist or has been removed.</p>
            <Link to="/seller/auction-listings" className="seller-details-back-btn">Back to My Auctions</Link>
          </div>
        </div>
      </div>
    );
  }

  const statusColors = getStatusColor(selectedAuction.status);

  return (
    <div className="seller-details-page">
      <div className="seller-details-container">
        {/* Breadcrumbs */}
        <nav className="seller-details-breadcrumbs">
          <Link to="/seller/dashboard">Home</Link>
          <span>/</span>
          <Link to="/seller/auction-listings">My Auctions</Link>
          <span>/</span>
          <span>{selectedAuction.category_name || 'Category'}</span>
          {/* <span>/</span> */}
          {/* <span>Lot #{selectedAuction.id}</span> */}
        </nav>

        {/* Header */}
        <div className="seller-details-header">
          <div className="seller-details-header-content">
            <h1 className="seller-details-title">{selectedAuction.title || 'Untitled Auction'}</h1>
            <p className="seller-details-subtitle">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ display: 'inline', marginRight: '6px' }}>
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {selectedAuction.pickup_address || 'N/A'}
            </p>
            {/* <p className="seller-details-subtitle">ID: {selectedAuction.id}</p> */}
          </div>
          <div
            className="seller-details-status-badge"
            style={{
              backgroundColor: statusColors.bg,
              borderColor: statusColors.border,
              color: statusColors.color
            }}
          >
            {selectedAuction.status === 'ACTIVE' && 'ACTIVE'}
            {selectedAuction.status === 'DRAFT' && 'DRAFT'}
            {selectedAuction.status === 'APPROVED' && 'UPCOMING'}
            {selectedAuction.status === 'CLOSED' && 'CLOSED'}
            {selectedAuction.status === 'AWAITING_PAYMENT' && 'AWAITING PAYMENT'}
          </div>
        </div>

        {/* Main Content */}
        <div className="seller-details-content">
          {/* Image Gallery */}
          <div className="seller-details-gallery">
            <div className="seller-details-main-image">
              {images.length > 0 ? (
                <img src={images[selectedImage]} alt={selectedAuction.title} />
              ) : (
                <div className="seller-details-no-image">
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
              <div className="seller-details-thumbnails">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`seller-details-thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`View ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div className="seller-details-info-panel">
            {/* Category Badge */}
            <div className="seller-details-category-badge">
              {selectedAuction.category_name || 'Category'}
            </div>

            {/* Title and Location */}
            <h2 className="seller-details-panel-title">{selectedAuction.title || 'Untitled'}</h2>
            <div className="seller-details-location">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{selectedAuction.pickup_address || 'N/A'}</span>
            </div>
            {/* <p className="seller-details-panel-id">ID: {selectedAuction.id}</p> */}

            {/* Quick Info Cards */}
            <div className="seller-details-quick-info">
              <div className="seller-details-quick-card">
                <div className="seller-details-quick-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="seller-details-quick-label">Vin</div>
                <div className="seller-details-quick-value">{selectedAuction.specific_data?.vin || 'N/A'}</div>
              </div>
              <div className="seller-details-quick-card">
                <div className="seller-details-quick-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M8 17a5 5 0 100-10 5 5 0 000 10zm8 0a5 5 0 100-10 5 5 0 000 10z" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 12h8M5 8h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="seller-details-quick-label">Make</div>
                <div className="seller-details-quick-value">{selectedAuction.specific_data?.make || 'N/A'}</div>
              </div>
              <div className="seller-details-quick-card">
                <div className="seller-details-quick-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M3 10h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="seller-details-quick-label">Year</div>
                <div className="seller-details-quick-value">{selectedAuction.specific_data?.year || 'N/A'}</div>
              </div>
              {/* Listing Actions - Only show when status is DRAFT */}
            </div>
            {selectedAuction.status?.toUpperCase() === 'DRAFT' && (
              <div className="w-full flex flex-col gap-6 rounded-2xl p-6 shadow-md ">
                {/* Header */}
                <div className="flex items-center gap-3">
                  {/* <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          d="M12 15v3M15 21H9a2 2 0 01-2-2V5a2 2 0 012-2h6a2 2 0 012 2v7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17 21l5-5-5-5M17 16h6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div> */}

                </div>

                {/* Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Edit */}
                  <button
                    onClick={handleEditListing}
                    className="seller-details-button flex items-center justify-center gap-2 bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="transition-transform group-hover:rotate-6"
                    >
                      <path
                        d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Edit Listing
                  </button>

                  {/* Approval */}
                  <button
                    onClick={handleSendForApproval}
                    className="seller-details-button flex items-center justify-center gap-2 bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="transition-transform group-hover:scale-110"
                    >
                      <path
                        d="M22 11.08V12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 4L12 14l-3-3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Send for Approval
                  </button>

                  {/* Delete */}
                  <button
                    onClick={handleRemoveListing}
                    className="seller-details-button flex items-center justify-center gap-2 bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-red-700"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="transition-transform group-hover:scale-110"
                    >
                      <path
                        d="M3 6h18"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Remove Listing
                  </button>
                </div>
              </div>
            )}

            {/* Timer Section for Live Auctions */}
            {isLive && timeRemaining.hours + timeRemaining.minutes + timeRemaining.seconds > 0 && (
              <div className="seller-details-timer-section">
                <div className="seller-details-timer-label">TIME REMAINING</div>
                <div className="seller-details-timer">
                  <div className="seller-details-timer-unit">
                    <span className="seller-details-timer-value">{String(timeRemaining.hours).padStart(2, '0')}</span>
                    <span className="seller-details-timer-label-small">Hours</span>
                  </div>
                  <span className="seller-details-timer-separator">:</span>
                  <div className="seller-details-timer-unit">
                    <span className="seller-details-timer-value">{String(timeRemaining.minutes).padStart(2, '0')}</span>
                    <span className="seller-details-timer-label-small">Minutes</span>
                  </div>
                  <span className="seller-details-timer-separator">:</span>
                  <div className="seller-details-timer-unit">
                    <span className={`seller-details-timer-value ${timeRemaining.seconds < 30 ? 'urgent' : ''}`}>
                      {String(timeRemaining.seconds).padStart(2, '0')}
                    </span>
                    <span className="seller-details-timer-label-small">Seconds</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="seller-details-tabs-section">
          <div className="seller-details-tabs">
            <button
              className={`seller-details-tab ${activeTab === 'bid-info' ? 'active' : ''}`}
              onClick={() => setActiveTab('bid-info')}
            >
              Bid Information
            </button>
            <button
              className={`seller-details-tab ${activeTab === 'vehicle-info' ? 'active' : ''}`}
              onClick={() => setActiveTab('vehicle-info')}
            >
              Vehicle Information
            </button>
            <button
              className={`seller-details-tab ${activeTab === 'paper-details' ? 'active' : ''}`}
              onClick={() => setActiveTab('paper-details')}
            >
              Paper Details
            </button>
            <button
              className={`seller-details-tab ${activeTab === 'bid-history' ? 'active' : ''}`}
              onClick={() => setActiveTab('bid-history')}
            >
              Bid History
            </button>
          </div>

          <div className="seller-details-tab-content">
            {/* Bid Information Tab */}
            {activeTab === 'bid-info' && (
              <div className="seller-details-info-grid">
                <div className="seller-details-info-row">
                  <span className="seller-details-info-label">Status</span>
                  <span className="seller-details-info-value" style={{ color: statusColors.color }}>
                    {selectedAuction.status}
                  </span>
                </div>
                <div className="seller-details-info-row">
                  <span className="seller-details-info-label">Starting bid</span>
                  <span className="seller-details-info-value highlight">
                    {formatCurrency(parseFloat(selectedAuction.initial_price || 0))}
                  </span>
                </div>
                <div className="seller-details-info-row">
                  <span className="seller-details-info-label">Currency</span>
                  <span className="seller-details-info-value">{selectedAuction.currency || 'USD'}</span>
                </div>
                <div className="seller-details-info-row">
                  <span className="seller-details-info-label">Expected Price</span>
                  <span className="seller-details-info-value highlight">
                    {formatCurrency(parseFloat(selectedAuction.seller_expected_price || 0))}
                  </span>
                </div>
                <div className="seller-details-info-row">
                  <span className="seller-details-info-label">Handover Type</span>
                  <span className="seller-details-info-value">{selectedAuction.handover_type || 'N/A'}</span>
                </div>
                <div className="seller-details-info-row">
                  <span className="seller-details-info-label">Pickup Address</span>
                  <span className="seller-details-info-value">{selectedAuction.pickup_address || 'N/A'}</span>
                </div>
                <div className="seller-details-info-row">
                  <span className="seller-details-info-label">Pickup Location</span>
                  <span className="seller-details-info-value">
                    {selectedAuction.pickup_latitude && selectedAuction.pickup_longitude
                      ? `${selectedAuction.pickup_latitude}, ${selectedAuction.pickup_longitude}`
                      : 'N/A'}
                  </span>
                </div>
              </div>
            )}

            {/* Vehicle Information Tab */}
            {activeTab === 'vehicle-info' && (
              <div className="seller-details-info-grid">
                <div className="seller-details-info-row">
                  <span className="seller-details-info-label">Title</span>
                  <span className="seller-details-info-value">{selectedAuction.title || 'N/A'}</span>
                </div>
                <div className="seller-details-info-row">
                  <span className="seller-details-info-label">Description</span>
                  <span className="seller-details-info-value">{selectedAuction.description || 'N/A'}</span>
                </div>
                <div className="seller-details-info-row">
                  <span className="seller-details-info-label">Category</span>
                  <span className="seller-details-info-value">{selectedAuction.category_name || 'N/A'}</span>
                </div>
                {selectedAuction.specific_data && Object.entries(selectedAuction.specific_data).map(([key, value]) => (
                  <div key={key} className="seller-details-info-row">
                    <span className="seller-details-info-label">{key.replace(/_/g, ' ')}</span>
                    <span className="seller-details-info-value">{value || 'N/A'}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Paper Details Tab */}
            {activeTab === 'paper-details' && (
              <div className="seller-details-info-grid">
                <div className="seller-details-info-row">
                  <span className="seller-details-info-label">Inspection Report</span>
                  <span className="seller-details-info-value">
                    {selectedAuction.specific_data?.inspection_report || 'N/A'}
                  </span>
                </div>
                <div className="seller-details-info-row">
                  <span className="seller-details-info-label">Ownership History</span>
                  <span className="seller-details-info-value">
                    {selectedAuction.specific_data?.ownership_history || 'N/A'}
                  </span>
                </div>
                <div className="seller-details-info-row">
                  <span className="seller-details-info-label">Registration Number</span>
                  <span className="seller-details-info-value">
                    {selectedAuction.specific_data?.registration_number || 'N/A'}
                  </span>
                </div>
              </div>
            )}

            {/* Bid History Tab */}
            {activeTab === 'bid-history' && (
              <div className="seller-details-info-grid">
                <div className="seller-details-info-row">
                  <span className="seller-details-info-label">Total Bids</span>
                  <span className="seller-details-info-value">{bidStats.total}</span>
                </div>
                <div className="seller-details-info-row">
                  <span className="seller-details-info-label">Last bid</span>
                  <span className="seller-details-info-value">
                    {bidStats.last ? formatCurrency(bidStats.last) : 'N/A'}
                  </span>
                </div>
                <div className="seller-details-info-row">
                  <span className="seller-details-info-label">Highest bidder</span>
                  <span className="seller-details-info-value">{bidStats.highestBidder || 'N/A'}</span>
                </div>
                <div className="seller-details-info-row">
                  <span className="seller-details-info-label">Bids today</span>
                  <span className="seller-details-info-value">{bidStats.today || 'N/A'}</span>
                </div>

                {auctionBids && auctionBids.length > 0 && (
                  <div className="seller-details-bid-list">
                    <h3>All Bids</h3>
                    {auctionBids.map((bid, index) => (
                      <div key={bid.id} className="seller-details-bid-item">
                        <div className="seller-details-bid-rank">#{index + 1}</div>
                        <div className="seller-details-bid-info">
                          <div className="seller-details-bid-name">{bid.bidder_name || 'Anonymous'}</div>
                          <div className="seller-details-bid-time">{formatDate(bid.created_at)}</div>
                        </div>
                        <div className="seller-details-bid-amount">
                          {formatCurrency(parseFloat(bid.amount))}
                        </div>
                      </div>
                    ))}
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

export default SellerAuctionDetails;