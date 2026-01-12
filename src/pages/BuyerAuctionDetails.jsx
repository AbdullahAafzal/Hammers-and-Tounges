import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { placeBid, fetchAuctionBids } from '../store/actions/buyerActions'
import './BuyerAuctionDetails.css';

// favorite, // fetch, post, delete
// fetch bid history // id (url /id (user-id) / bids)  // mybids
// 

// Memoized child components
const LoadingSkeleton = memo(() => (
  <div className="buyer-details-skeleton">
    <div className="buyer-details-breadcrumbs-skeleton skeleton-shimmer"></div>
    
    <div className="buyer-details-content-skeleton">
      <div className="buyer-details-images-skeleton">
        <div className="buyer-details-main-image-skeleton skeleton-shimmer"></div>
        <div className="buyer-details-thumbnails-skeleton">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="buyer-details-thumbnail-skeleton skeleton-shimmer"></div>
          ))}
        </div>
      </div>
      
      <div className="buyer-details-info-skeleton">
        <div className="buyer-details-header-skeleton">
          <div className="buyer-details-title-skeleton skeleton-shimmer"></div>
          <div className="buyer-details-lot-skeleton skeleton-shimmer"></div>
        </div>
        
        <div className="buyer-details-status-skeleton skeleton-shimmer"></div>
        
        <div className="buyer-details-tabs-skeleton">
          {['description', 'inspection', 'terms'].map((tab) => (
            <div key={tab} className="buyer-details-tab-skeleton skeleton-shimmer"></div>
          ))}
        </div>
        
        <div className="buyer-details-content-area-skeleton">
          <div className="buyer-details-description-skeleton skeleton-shimmer"></div>
          <div className="buyer-details-details-skeleton">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="buyer-details-detail-skeleton skeleton-shimmer"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

const ErrorState = memo(({ error }) => (
  <div className="buyer-details-page">
    <div className="buyer-details-container">
      <div className="buyer-details-error">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3>Error loading auction</h3>
        <p>{error}</p>
        <Link to="/auctions" className="buyer-details-back-link">
          Back to Auctions
        </Link>
      </div>
    </div>
  </div>
));

ErrorState.displayName = 'ErrorState';

const NotFoundState = memo(() => (
  <div className="buyer-details-page">
    <div className="buyer-details-container">
      <div className="buyer-details-not-found">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20a8 8 0 100-16 8 8 0 000 16z" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3>Auction not found</h3>
        <p>The auction you're looking for doesn't exist or has been removed.</p>
        <Link to="/auctions" className="buyer-details-back-link">
          Back to Auctions
        </Link>
      </div>
    </div>
  </div>
));

NotFoundState.displayName = 'NotFoundState';

const Breadcrumbs = memo(({ auction }) => (
  <nav className="buyer-details-breadcrumbs">
    <Link to="/buyer/dashboard">Home</Link>
    <span>/</span>
    <Link to="/buyer/auctions">Auctions</Link>
    <span>/</span>
    <span>{auction?.category_name || 'Category'}</span>
    <span>/</span>
    <span>Lot #{auction?.id || 'N/A'}</span>
  </nav>
));

Breadcrumbs.displayName = 'Breadcrumbs';

const ImageGallery = memo(({ images, selectedImage, onSelectImage, title }) => (
  <div className="buyer-details-images">
    <div className="buyer-details-main-image">
      <img
        src={images[selectedImage] || 'https://via.placeholder.com/800x600?text=No+Image'}
        alt={title}
      />
    </div>
    {images.length > 0 && (
      <div className="buyer-details-thumbnails">
        {images.map((image, index) => (
          <button
            key={index}
            className={`buyer-details-thumbnail ${selectedImage === index ? 'buyer-details-thumbnail-active' : ''}`}
            onClick={() => onSelectImage(index)}
          >
            <img src={image} alt={`${title} view ${index + 1}`} />
          </button>
        ))}
      </div>
    )}
  </div>
));

ImageGallery.displayName = 'ImageGallery';

const Timer = memo(({ timeRemaining }) => (
  <div className="buyer-details-timer-section">
    <div className="buyer-details-timer-label">TIME REMAINING</div>
    <div className="buyer-details-timer">
      <div className="buyer-details-timer-unit">
        <span className="buyer-details-timer-value">{String(timeRemaining.hours).padStart(2, '0')}</span>
        <span className="buyer-details-timer-label-small">Hours</span>
      </div>
      <span className="buyer-details-timer-separator">:</span>
      <div className="buyer-details-timer-unit">
        <span className="buyer-details-timer-value">{String(timeRemaining.minutes).padStart(2, '0')}</span>
        <span className="buyer-details-timer-label-small">Minutes</span>
      </div>
      <span className="buyer-details-timer-separator">:</span>
      <div className="buyer-details-timer-unit">
        <span className={`buyer-details-timer-value ${timeRemaining.seconds < 30 ? 'buyer-details-timer-urgent' : ''}`}>
          {String(timeRemaining.seconds).padStart(2, '0')}
        </span>
        <span className="buyer-details-timer-label-small">Seconds</span>
      </div>
    </div>
  </div>
));

Timer.displayName = 'Timer';

const TabContent = memo(({ activeTab, auction, inspectionReport, formatCurrency }) => {
  if (activeTab === 'description') {
    return (
      <div className="buyer-details-description">
        <p className="buyer-details-description-text">{auction?.description || 'No description available.'}</p>
        <div className="buyer-details-key-details">
          {auction?.specific_data && Object.entries(auction.specific_data).map(([key, value]) => (
            <div key={key} className="buyer-details-detail-item">
              <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {value}
            </div>
          ))}
          {auction?.pickup_address && (
            <div className="buyer-details-detail-item">
              <strong>Location:</strong> {auction.pickup_address}
            </div>
          )}
          {auction?.category_name && (
            <div className="buyer-details-detail-item">
              <strong>Category:</strong> {auction.category_name}
            </div>
          )}
          {auction?.handover_type && (
            <div className="buyer-details-detail-item">
              <strong>Handover Type:</strong> {auction.handover_type}
            </div>
          )}
          {auction?.initial_price && (
            <div className="buyer-details-detail-item">
              <strong>Initial Price:</strong> {formatCurrency(auction.initial_price)}
            </div>
          )}
          {auction?.is_buy_now_enabled && auction?.buy_now_price && (
            <div className="buyer-details-detail-item">
              <strong>Buy Now Price:</strong> {formatCurrency(auction.buy_now_price)}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'inspection') {
    return (
      <div className="buyer-details-inspection">
        {inspectionReport ? (
          <div className="buyer-details-inspection-content">
            <p>Inspection report available for download:</p>
            <a
              href={inspectionReport.file}
              target="_blank"
              rel="noopener noreferrer"
              className="buyer-details-download-link"
            >
              Download Inspection Report
            </a>
          </div>
        ) : auction?.specific_data?.inspection_report ? (
          <p>{auction.specific_data.inspection_report}</p>
        ) : (
          <p className="buyer-details-no-report">No inspection report available.</p>
        )}
      </div>
    );
  }

  return (
    <div className="buyer-details-terms">
      <h4 className="buyer-details-terms-title">Auction Terms & Conditions</h4>
      <ul className="buyer-details-terms-list">
        <li>All bids are final and binding</li>
        <li>Payment must be made within 48 hours of auction close</li>
        <li>Items are sold as-is, where-is</li>
        <li>Buyer is responsible for pickup or shipping arrangements</li>
        <li>A buyer's premium may apply</li>
      </ul>
      {auction?.seller_expected_price && (
        <p className="buyer-details-reserve">
          <strong>Reserve Price:</strong> This auction has a reserve price.
        </p>
      )}
    </div>
  );
});

TabContent.displayName = 'TabContent';

// Static utility functions
const calculateTimeRemaining = (endDate) => {
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
};

const BuyerAuctionDetails = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const auctionObj = location.state?.listing;
  const { auctionBids } = useSelector( state => state.buyer )

  
  // useEffect( ()=> {
  //   dispatch( fetchAuctionBids( {id: auctionObj?.id} ) )
  // }, [dispatch] )
  
  console.log(auctionBids);
  // Consolidated state
  const [state, setState] = useState({
    selectedAuction: auctionObj || null,
    activeTab: 'description',
    customBidAmount: '',
    selectedImage: 0,
    timeRemaining: { hours: 0, minutes: 0, seconds: 0 },
    isLoading: !auctionObj,
    error: null,
  });

  // Memoized computed values
  const auction = state.selectedAuction;
  const images = useMemo(() => 
    auction?.media?.filter(m => m.media_type === 'image').map(m => m.file) || [],
    [auction?.media]
  );
  const inspectionReport = useMemo(() =>
    auction?.media?.find(m => m.label === 'inspection_report'),
    [auction?.media]
  );
  const isLive = useMemo(() => auction?.status === 'ACTIVE', [auction?.status]);
  const isUpcoming = useMemo(() => auction?.status === 'APPROVED', [auction?.status]);

  // Memoized currency formatter
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: auction?.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }, [auction?.currency]);

  // Memoized event handlers
  const handleSelectImage = useCallback((index) => {
    setState(prev => ({ ...prev, selectedImage: index }));
  }, []);

  const handleSetActiveTab = useCallback((tab) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  }, []);

  const handleCustomBidChange = useCallback((e) => {
    setState(prev => ({ ...prev, customBidAmount: e.target.value }));
  }, []);

  const handleCustomBidSubmit = useCallback((e) => {
    e.preventDefault();


    if (auction && state.customBidAmount) {
      dispatch(placeBid({ 
        auction_id: auction.id, 
        amount: parseFloat(state.customBidAmount) 
      }));
      setState(prev => ({ ...prev, customBidAmount: '' }));
    }
  }, [auction, state.customBidAmount, dispatch]);

  // Timer effect - isolated to prevent cascading re-renders
  useEffect(() => {
    if (isLive && auction?.end_date) {
      setState(prev => ({
        ...prev,
        timeRemaining: calculateTimeRemaining(auction.end_date)
      }));

      const interval = setInterval(() => {
        setState(prev => ({
          ...prev,
          timeRemaining: calculateTimeRemaining(auction.end_date)
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isLive, auction?.end_date]);

  // Loading state
  if (state.isLoading && !state.selectedAuction) {
    return (
      <div className="buyer-details-page">
        <div className="buyer-details-container">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  // Error state
  if (state.error) {
    return <ErrorState error={state.error} />;
  }

  // Not found state
  if (!state.selectedAuction) {
    return <NotFoundState />;
  }

  // Live auction view
  if (isLive && state.timeRemaining.hours + state.timeRemaining.minutes + state.timeRemaining.seconds > 0) {
    return (
      <div className="buyer-details-page buyer-details-live-page">
        <div className="buyer-details-container">
          <Breadcrumbs auction={auction} />

          <div className="buyer-details-live-header">
            <h1 className="buyer-details-live-title">{auction?.title || 'Auction'}</h1>
            <p className="buyer-details-live-description">{auction?.description || ''}</p>
          </div>

          <div className="buyer-details-live-content">
            <div className="buyer-details-live-player">
              <div className="buyer-details-video-player">
                <img
                  src={images[state.selectedImage] || 'https://via.placeholder.com/800x600?text=No+Image'}
                  alt={auction?.title || 'Auction item'}
                  className="buyer-details-main-image"
                />
                <div className="buyer-details-play-overlay">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="rgba(255, 255, 255, 0.9)" />
                    <path d="M10 8L16 12L10 16V8Z" fill="#000000" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="buyer-details-live-bidding">
              <Timer timeRemaining={state.timeRemaining} />

              <div className="buyer-details-current-bid">
                <div className="buyer-details-current-bid-label">Current Price</div>
                <div className="buyer-details-current-bid-amount">{formatCurrency(auction?.initial_price || 0)}</div>
                <div className="buyer-details-highest-bidder">
                  <span className="buyer-details-highest-bidder-label">Total Bids</span>
                  <span className="buyer-details-highest-bidder-name">{auction?.total_bids || 0}</span>
                </div>
              </div>

              <button className="buyer-details-quick-bid">
                Place Bid Here
              </button>

              <form className="buyer-details-custom-bid" onSubmit={handleCustomBidSubmit}>
                <input
                  type="number"
                  className="buyer-details-custom-bid-input"
                  placeholder="Enter custom bid"
                  value={state.customBidAmount}
                  onChange={handleCustomBidChange}
                  min={parseFloat(auction?.initial_price || 0) + 10}
                />
                <button type="submit" className="buyer-details-custom-bid-button">Place Bid</button>
              </form>
            </div>
          </div>

          <div className="buyer-details-live-panels">
            <div className="buyer-details-bidding-feed">
              <h3 className="buyer-details-panel-title">Auction Information</h3>
              <div className="buyer-details-bidding-list">
                {auction?.seller_name && (
                  <div className="buyer-details-bidding-item">
                    <span className="buyer-details-bidder-name">Seller:</span>
                    <span className="buyer-details-bid-amount">{auction.seller_name}</span>
                  </div>
                )}
                {auction?.auction_manager_name && (
                  <div className="buyer-details-bidding-item">
                    <span className="buyer-details-bidder-name">Manager:</span>
                    <span className="buyer-details-bid-amount">{auction.auction_manager_name}</span>
                  </div>
                )}
                {auction?.category_name && (
                  <div className="buyer-details-bidding-item">
                    <span className="buyer-details-bidder-name">Category:</span>
                    <span className="buyer-details-bid-amount">{auction.category_name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="buyer-details-active-bidders">
              <h3 className="buyer-details-panel-title">Details</h3>
              <div className="buyer-details-active-list">
                {auction?.handover_type && (
                  <div className="buyer-details-active-item">
                    <span>Handover: {auction.handover_type}</span>
                  </div>
                )}
                {auction?.pickup_address && (
                  <div className="buyer-details-active-item">
                    <span>Location: {auction.pickup_address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard auction view
  return (
    <div className="buyer-details-page">
      <div className="buyer-details-container">
        <Breadcrumbs auction={auction} />

        <div className="buyer-details-content">
          <ImageGallery 
            images={images}
            selectedImage={state.selectedImage}
            onSelectImage={handleSelectImage}
            title={auction?.title || 'Auction item'}
          />

          <div className="buyer-details-info">
            <div className="buyer-details-header">
              <h1 className="buyer-details-title">{auction?.title || 'Auction'}</h1>
              <span className="buyer-details-lot">Lot #{auction?.id || 'N/A'}</span>
            </div>

            <div className="buyer-details-status">
              <div className="buyer-details-status-item">
                <span className="buyer-details-status-label">
                  {isUpcoming ? 'Auction Starts' : 'Auction Status'}
                </span>
                <span className="buyer-details-status-value">
                  {isUpcoming
                    ? new Date(auction?.start_date).toLocaleString()
                    : auction?.status || 'N/A'
                  }
                </span>
                <span className="buyer-details-end-date">
                  Ends: {auction?.end_date ? new Date(auction.end_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>

            {isUpcoming && (
              <div className="buyer-details-upcoming">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="buyer-details-upcoming-content">
                  <strong>This auction has not started yet</strong>
                  <p>Bidding will be available when the auction goes live.</p>
                </div>
              </div>
            )}

            <div className="buyer-details-tabs">
              <button
                className={`buyer-details-tab ${state.activeTab === 'description' ? 'buyer-details-tab-active' : ''}`}
                onClick={() => handleSetActiveTab('description')}
              >
                Description
              </button>
              <button
                className={`buyer-details-tab ${state.activeTab === 'inspection' ? 'buyer-details-tab-active' : ''}`}
                onClick={() => handleSetActiveTab('inspection')}
              >
                Inspection Report
              </button>
              <button
                className={`buyer-details-tab ${state.activeTab === 'terms' ? 'buyer-details-tab-active' : ''}`}
                onClick={() => handleSetActiveTab('terms')}
              >
                Terms
              </button>
            </div>

            <div className="buyer-details-tab-content">
              <TabContent 
                activeTab={state.activeTab}
                auction={auction}
                inspectionReport={inspectionReport}
                formatCurrency={formatCurrency}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerAuctionDetails;