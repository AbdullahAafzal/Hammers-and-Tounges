import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import './AuctionDetails.css'

const AuctionDetails = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('description')
  const [bidAmount, setBidAmount] = useState('')
  const [customBidAmount, setCustomBidAmount] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 1, seconds: 25 })

  const auctionStatus = parseInt(id) % 2 === 1 ? 'LIVE' : 'UPCOMING'

  const auction = {
    id: id || '123',
    title: auctionStatus === 'LIVE' ? 'Lot 102: Vintage Rolex Submariner' : '1965 Shelby Cobra 427',
    lotNumber: auctionStatus === 'LIVE' ? 'Lot #102' : 'Lot #123',
    category: auctionStatus === 'LIVE' ? 'Luxury Goods Auction' : 'Vintage Cars',
    status: auctionStatus,
    currentBid: auctionStatus === 'LIVE' ? 10500 : 1500000,
    minimumBid: auctionStatus === 'LIVE' ? 10750 : 1525000,
    reserveMet: true,
    timeRemaining: auctionStatus === 'LIVE' ? timeRemaining : { days: 1, hours: 4, minutes: 32, seconds: 15 },
    endDate: 'Oct 28, 2023',
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80',
      'https://images.unsplash.com/photo-1558980664-1db506751c6a?w=1200&q=80',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80'
    ],
    description: auctionStatus === 'LIVE' 
      ? `A rare 1968 model in excellent condition. Includes original box and papers.`
      : `This 1965 Shelby Cobra 427 is a stunning example of American muscle, finished in a classic Guardsman Blue with Wimbledon White racing stripes. Powered by its original 427-cubic-inch V8 engine, this vehicle delivers an unparalleled driving experience. The interior features black leather upholstery, period-correct Stewart-Warner gauges, and a wood-rimmed steering wheel.

Fully restored to concours quality, this Cobra has been meticulously maintained and comes with extensive documentation, including its original build sheet and a complete ownership history. A true collector's piece, it represents a significant chapter in automotive history.`,
    location: 'Los Angeles, CA',
    lotType: auctionStatus === 'LIVE' ? 'Luxury Goods' : 'Vehicle',
    viewingTimes: 'By Appointment Only',
    requiresDeposit: false,
    highestBidder: 'Bidder_789',
    isHighestBidder: true,
    biddingFeed: [
      { bidder: 'Bidder_789', amount: 10500 },
      { bidder: 'Bidder_123', amount: 10250 },
      { bidder: 'Bidder_456', amount: 10000 },
      { bidder: 'Bidder_789', amount: 9750 },
      { bidder: 'Bidder_101', amount: 9500 },
      { bidder: 'Bidder_123', amount: 9250 }
    ],
    activeBidders: ['Bidder_789', 'Bidder_123', 'Bidder_456', 'Bidder_101']
  }

  useEffect(() => {
    if (auction.status === 'LIVE') {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          let { hours, minutes, seconds } = prev
          if (seconds > 0) {
            seconds--
          } else if (minutes > 0) {
            minutes--
            seconds = 59
          } else if (hours > 0) {
            hours--
            minutes = 59
            seconds = 59
          }
          return { hours, minutes, seconds }
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [auction.status])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatTime = (time) => {
    const pad = (n) => n.toString().padStart(2, '0')
    return `${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}`
  }

  const handleBidSubmit = (e) => {
    e.preventDefault()
    console.log('Placing bid:', bidAmount)
  }

  const handleCustomBidSubmit = (e) => {
    e.preventDefault()
    console.log('Placing custom bid:', customBidAmount)
  }

  const handleQuickBid = () => {
    setBidAmount(auction.minimumBid.toString())
    console.log('Quick bid:', auction.minimumBid)
  }

  if (auction.status === 'LIVE') {
    return (
      <div className="auction-details-page live-auction-page">
        <div className="auction-details-container">
          <nav className="breadcrumbs">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/auctions">Auctions</Link>
            <span>/</span>
            <span>{auction.category}</span>
            <span>/</span>
            <span>{auction.lotNumber}</span>
          </nav>

          <div className="live-auction-header">
            <h1 className="live-auction-title">{auction.title}</h1>
            <p className="live-auction-description">{auction.description}</p>
          </div>

          <div className="live-auction-content">
            <div className="live-auction-player-section">
              <div className="video-player">
                <img src={auction.images[selectedImage]} alt={auction.title} />
                <div className="play-overlay">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="rgba(255, 255, 255, 0.9)"/>
                    <path d="M10 8L16 12L10 16V8Z" fill="#000000"/>
                  </svg>
                </div>
                <div className="video-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '16%' }}></div>
                  </div>
                  <div className="video-time">0:37 / 2:23</div>
                </div>
              </div>
            </div>

            <div className="live-auction-bidding-panel">
              <div className="live-timer-section">
                <div className="timer-label">TIME REMAINING</div>
                <div className="live-timer">
                  <div className="timer-unit">
                    <span className="timer-value">{String(timeRemaining.hours).padStart(2, '0')}</span>
                    <span className="timer-label-small">Hours</span>
                  </div>
                  <span className="timer-separator">:</span>
                  <div className="timer-unit">
                    <span className="timer-value">{String(timeRemaining.minutes).padStart(2, '0')}</span>
                    <span className="timer-label-small">Minutes</span>
                  </div>
                  <span className="timer-separator">:</span>
                  <div className="timer-unit">
                    <span className={`timer-value ${timeRemaining.seconds < 30 ? 'urgent' : ''}`}>
                      {String(timeRemaining.seconds).padStart(2, '0')}
                    </span>
                    <span className="timer-label-small">Seconds</span>
                  </div>
                </div>
              </div>

              <div className="current-bid-box">
                <div className="current-bid-label">Current Highest Bid</div>
                <div className="current-bid-amount">{formatCurrency(auction.currentBid)}</div>
                <div className="highest-bidder-info">
                  <span className="highest-bidder-label">Highest Bidder</span>
                  <span className="highest-bidder-name">{auction.highestBidder} {auction.isHighestBidder && '(You)'}</span>
                </div>
              </div>

              <button className="quick-bid-button" onClick={handleQuickBid}>
                Bid {formatCurrency(auction.minimumBid)}
              </button>

              <form className="custom-bid-form" onSubmit={handleCustomBidSubmit}>
                <input
                  type="text"
                  className="custom-bid-input"
                  placeholder="Enter custom bid"
                  value={customBidAmount}
                  onChange={(e) => setCustomBidAmount(e.target.value)}
                />
                <button type="submit" className="custom-bid-button">Place Bid</button>
              </form>

              {auction.isHighestBidder && (
                <div className="bidder-confirmation">
                  You are the highest bidder!
                </div>
              )}
            </div>
          </div>

          <div className="live-auction-bottom-panels">
            <div className="bidding-feed-panel">
              <h3 className="panel-title">Live Bidding Feed</h3>
              <div className="bidding-feed-list">
                {auction.biddingFeed.map((bid, index) => (
                  <div key={index} className="bidding-feed-item">
                    <span className="bidder-name">{bid.bidder}:</span>
                    <span className="bid-amount">{formatCurrency(bid.amount)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="active-bidders-panel">
              <h3 className="panel-title">Active Bidders ({auction.activeBidders.length})</h3>
              <div className="active-bidders-list">
                {auction.activeBidders.map((bidder, index) => (
                  <div key={index} className="active-bidder-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{bidder}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auction-details-page">
      <div className="auction-details-container">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/auctions">Auctions</Link>
          <span>/</span>
          <span>{auction.category}</span>
          <span>/</span>
          <span>{auction.lotNumber}</span>
        </nav>

        <div className="auction-details-content">
          {/* Left Panel - Images */}
          <div className="auction-images-section">
            <div className="main-image">
              <img src={auction.images[selectedImage]} alt={auction.title} />
            </div>
            <div className="image-thumbnails">
              {auction.images.map((image, index) => (
                <button
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${auction.title} view ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="auction-details-section">
            <div className="auction-header">
              <h1 className="auction-title">{auction.title}</h1>
              <span className="lot-number">{auction.lotNumber}</span>
            </div>

            {/* Status Box */}
            <div className="bid-status-box">
              <div className="bid-status-item">
                <span className="status-label">Auction Starts In</span>
                <span className="status-value timer">
                  {auction.timeRemaining.days}d {auction.timeRemaining.hours}h {auction.timeRemaining.minutes}m {auction.timeRemaining.seconds}s
                </span>
                <span className="end-date">on {auction.endDate}</span>
              </div>
            </div>

            {/* Upcoming Notice */}
            <div className="upcoming-notice">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="notice-content">
                <strong>This auction has not started yet</strong>
                <p>Bidding will be available when the auction goes live.</p>
              </div>
            </div>

            {/* Information Tabs */}
            <div className="info-tabs">
              <button
                className={`tab ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button
                className={`tab ${activeTab === 'inspection' ? 'active' : ''}`}
                onClick={() => setActiveTab('inspection')}
              >
                Inspection Report
              </button>
              <button
                className={`tab ${activeTab === 'terms' ? 'active' : ''}`}
                onClick={() => setActiveTab('terms')}
              >
                Terms
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'description' && (
                <div className="description-content">
                  <p className="description-text">{auction.description}</p>
                  <div className="key-details">
                    <div className="detail-item">
                      <strong>Location:</strong> {auction.location}
                    </div>
                    <div className="detail-item">
                      <strong>Lot Type:</strong> {auction.lotType}
                    </div>
                    <div className="detail-item">
                      <strong>Viewing Times:</strong> {auction.viewingTimes}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'inspection' && (
                <div className="inspection-content">
                  <p>Inspection report details will be displayed here.</p>
                </div>
              )}

              {activeTab === 'terms' && (
                <div className="terms-content">
                  <p>Terms and conditions will be displayed here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuctionDetails



