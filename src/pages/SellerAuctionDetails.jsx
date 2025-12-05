import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import './SellerAuctionDetails.css'
import SellerHeader from '../components/SellerHeader'

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount)
}

const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const ImageGallery = ({ images, activeImage, onImageChange }) => (
    <div className="image-gallery">
        <div className="main-image">
            <img src={images[activeImage]} alt="Main view" />
        </div>
        <div className="thumbnail-images">
            {images.map((image, index) => (
                <button
                    key={`thumb-${index}`}
                    className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                    onClick={() => onImageChange(index)}
                    aria-label={`View image ${index + 1}`}
                >
                    <img src={image} alt={`Thumbnail ${index + 1}`} />
                </button>
            ))}
        </div>
    </div>
)

const StatItem = ({ icon, value, label }) => (
    <div className="stat-item">
        <div className="stat-icon">
            {icon}
        </div>
        <div className="stat-content">
            <span className="stat-value">{value}</span>
            <span className="stat-label">{label}</span>
        </div>
    </div>
)

const BidItem = ({ bid }) => (
    <div className="bid-item" key={bid.id}>
        <div className="bidder-info">
            <div className="bidder-name">{bid.bidder}</div>
            <div className="bidder-rating">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFC107">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                {bid.bidderRating}
            </div>
        </div>
        <div className="bid-details">
            <span className="bid-amount">{formatCurrency(bid.amount)}</span>
            <span className="bid-time">{bid.time}</span>
        </div>
    </div>
)

const QuestionItem = ({ question }) => (
    <div className="question-item" key={question.id}>
        <div className="question-header">
            <span className="question-text">Q: {question.question}</span>
            <span className="question-meta">Asked by {question.askedBy} • {question.askedTime}</span>
        </div>
        <div className="answer">
            <span className="answer-text">A: {question.answer}</span>
        </div>
    </div>
)

const SellerListingDetails = () => {
    const { id } = useParams()
    const [activeImage, setActiveImage] = useState(0)
    const [showFullDescription, setShowFullDescription] = useState(false)
    const [timeRemaining, setTimeRemaining] = useState('')

    const listing = useMemo(() => ({
        id: parseInt(id) || 1,
        title: 'Vintage Leather Armchair',
        description: 'A beautiful vintage leather armchair from the 1960s. This chair features high-quality leather that has developed a wonderful patina over time. The frame is solid oak, and the cushioning is still firm and comfortable. Perfect for a study, library, or living room.',
        category: 'Furniture',
        condition: 'excellent',
        dimensions: '32" W x 36" D x 42" H',
        weight: '45 lbs',
        material: 'Genuine Leather, Solid Oak',
        origin: 'United States, 1960s',

        startingPrice: 200.00,
        currentBid: 450.00,
        reservePrice: 400.00,
        bidIncrement: 25.00,
        auctionDuration: '7 days',
        totalBids: 12,
        views: 245,
        watchers: 8,

        status: 'active',
        createdAt: '2024-01-15',
        endsAt: '2024-01-22T18:00:00',

        shippingOptions: {
            localPickup: true,
            domesticShipping: true,
            internationalShipping: false,
            shippingCost: 75.00
        },

        images: [
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
            'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80',
            'https://images.unsplash.com/photo-1517705008128-361805f42e86?w-800&q=80',
            'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80'
        ],

        seller: {
            name: 'Sarah Johnson',
            rating: 4.8,
            joined: '2022-03-15',
            totalSales: 45,
            responseTime: '2 hours'
        },

        bidsHistory: [
            {
                id: 10,
                bidder: 'John D.',
                amount: 450.00,
                time: '2 hours ago',
                bidderRating: 4.5
            },
            {
                id: 11,
                bidder: 'Michael R.',
                amount: 425.00,
                time: '3 hours ago',
                bidderRating: 4.8
            },
            {
                id: 12,
                bidder: 'Emily C.',
                amount: 400.00,
                time: '5 hours ago',
                bidderRating: 4.2
            },
            {
                id: 13,
                bidder: 'Robert K.',
                amount: 375.00,
                time: '1 day ago',
                bidderRating: 4.9
            }
        ],

        questions: [
            {
                id: 101,
                question: 'Is local pickup available?',
                answer: 'Yes, local pickup is available in New York City.',
                askedBy: 'David M.',
                askedTime: '2 days ago'
            },
            {
                id: 202,
                question: 'Are there any tears or damage to the leather?',
                answer: 'No tears or damage. The leather is in excellent condition with only natural patina.',
                askedBy: 'Lisa T.',
                askedTime: '3 days ago'
            }
        ]
    }), [id])

    const calculateTimeRemaining = useCallback(() => {
        const now = new Date()
        const endDate = new Date(listing.endsAt)
        const diff = endDate - now

        if (diff <= 0) return 'Auction ended'

        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

        return `${days}d ${hours}h ${minutes}m`
    }, [listing.endsAt])

    useEffect(() => {
        const updateTime = () => {
            setTimeRemaining(calculateTimeRemaining())
        }

        updateTime()
        const interval = setInterval(updateTime, 60000)

        return () => clearInterval(interval)
    }, [calculateTimeRemaining])

    const handleEditListing = () => {
        console.log('Edit listing clicked')
    }

    const handleEndAuction = () => {
        if (window.confirm('Are you sure you want to end this auction early?')) {
            console.log('End auction clicked')
        }
    }

    const handleRelistItem = () => {
        console.log('Relist item clicked')
    }

    const handleViewAllBids = () => {
        console.log('View all bids clicked')
    }

    const handleAskQuestion = () => {
        console.log('Ask question clicked')
    }

    return (
        <div className="seller-page">
            <SellerHeader />

            <main className="seller-main">
                <div className="page-container">
                    <div className="page-header">
                        <div className="page-title-section">
                            <h1 className="page-title">Listing Details</h1>
                            <p className="page-subtitle">Manage and monitor your listing performance</p>
                        </div>
                        <div className="page-actions">
                            <Link to="/seller/auction-listings" className="secondary-button">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Back to Listings
                            </Link>
                        </div>
                    </div>

                    <div className="breadcrumb">
                        <Link to="/seller-dashboard" className="breadcrumb-item">Dashboard</Link>
                        <span className="breadcrumb-separator">/</span>
                        <Link to="/seller/auction-listings" className="breadcrumb-item">My Listings</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span className="breadcrumb-item active">{listing.title}</span>
                    </div>

                    <div className="listing-details-grid">
                        <div className="listing-details-left">
                            <ImageGallery
                                images={listing.images}
                                activeImage={activeImage}
                                onImageChange={setActiveImage}
                            />

                            <div className="stats-card">
                                <h3 className="stats-card-title">Auction Statistics</h3>
                                <div className="stats-grid">
                                    <StatItem
                                        icon={
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        }
                                        value={listing.totalBids}
                                        label="Total Bids"
                                    />
                                    <StatItem
                                        icon={
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" />
                                                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                        }
                                        value={listing.views}
                                        label="Total Views"
                                    />
                                    <StatItem
                                        icon={
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M18 8A6 6 0 0 0 6 8C6 11.3137 3.31371 14 0 14M18 8C20.2091 8 22 9.79086 22 12C22 14.2091 20.2091 16 18 16M18 8C20.2091 8 22 5.79086 22 3C22 0.790861 20.2091 -1 18 -1C15.7909 -1 14 0.790861 14 3C14 5.79086 15.7909 8 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        }
                                        value={listing.watchers}
                                        label="Watchers"
                                    />
                                    <StatItem
                                        icon={
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6312 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6312 13.6815 18 14.5717 18 15.5C18 16.4283 17.6312 17.3185 16.9749 17.9749C16.3185 18.6312 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        }
                                        value={formatCurrency(listing.currentBid)}
                                        label="Current Bid"
                                    />
                                </div>
                            </div>

                            <div className="details-card">
                                <h3 className="details-card-title">Shipping & Details</h3>
                                <div className="details-list">
                                    <div className="detail-item">
                                        <span className="detail-label">Condition:</span>
                                        <span className="detail-value">{listing.condition}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Dimensions:</span>
                                        <span className="detail-value">{listing.dimensions}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Weight:</span>
                                        <span className="detail-value">{listing.weight}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Material:</span>
                                        <span className="detail-value">{listing.material}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Origin:</span>
                                        <span className="detail-value">{listing.origin}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Shipping:</span>
                                        <div className="detail-value">
                                            {listing.shippingOptions.localPickup && <span className="shipping-option">Local Pickup</span>}
                                            {listing.shippingOptions.domesticShipping && <span className="shipping-option">Domestic Shipping</span>}
                                            {listing.shippingOptions.internationalShipping && <span className="shipping-option">International Shipping</span>}
                                        </div>
                                    </div>
                                    {listing.shippingOptions.shippingCost && (
                                        <div className="detail-item">
                                            <span className="detail-label">Shipping Cost:</span>
                                            <span className="detail-value">{formatCurrency(listing.shippingOptions.shippingCost)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="listing-details-right">
                            <div className="info-card">
                                <div className="info-card-header">
                                    <h2 className="listing-title">{listing.title}</h2>
                                    <div className="listing-category">{listing.category}</div>
                                </div>

                                <div className="info-card-body">
                                    <div className="listing-description">
                                        <h3 className="description-title">Description</h3>
                                        <p className={`description-text ${showFullDescription ? 'expanded' : ''}`}>
                                            {listing.description}
                                        </p>
                                        {!showFullDescription && listing.description.length > 200 && (
                                            <button
                                                className="show-more-button"
                                                onClick={() => setShowFullDescription(true)}
                                            >
                                                Show More
                                            </button>
                                        )}
                                    </div>

                                    <div className="auction-details">
                                        <h3 className="details-title">Auction Details</h3>
                                        <div className="details-grid">
                                            <div className="detail-row">
                                                <span className="detail-label">Current Bid:</span>
                                                <span className="detail-value highlight">{formatCurrency(listing.currentBid)}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Starting Price:</span>
                                                <span className="detail-value">{formatCurrency(listing.startingPrice)}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Reserve Price:</span>
                                                <span className="detail-value">{formatCurrency(listing.reservePrice)}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Bid Increment:</span>
                                                <span className="detail-value">{formatCurrency(listing.bidIncrement)}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Time Remaining:</span>
                                                <span className="detail-value time-remaining">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                                        <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                    </svg>
                                                    {timeRemaining || calculateTimeRemaining()}
                                                </span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Auction Ends:</span>
                                                <span className="detail-value">{formatDate(listing.endsAt)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="listing-actions-section">
                                        <h3 className="actions-title">Listing Actions</h3>
                                        <div className="action-buttons">
                                            <button className="action-button primary" onClick={handleEditListing}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Edit Listing
                                            </button>
                                            <button className="action-button secondary" onClick={handleEndAuction}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6312 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6312 13.6815 18 14.5717 18 15.5C18 16.4283 17.6312 17.3185 16.9749 17.9749C16.3185 18.6312 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                End Auction
                                            </button>
                                            <button className="action-button secondary" onClick={handleRelistItem}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M1 4V10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M23 20V14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M20.49 9C19.9828 7.56678 19.1209 6.2854 17.9845 5.27542C16.8482 4.26543 15.4745 3.55976 13.9917 3.22426C12.5089 2.88875 10.9652 2.93434 9.50481 3.35677C8.04437 3.77921 6.71475 4.56471 5.64 5.64L1 10M23 14L18.36 18.36C17.2853 19.4353 15.9556 20.2208 14.4952 20.6432C13.0348 21.0657 11.4911 21.1113 10.0083 20.7757C8.52547 20.4402 7.1518 19.7346 6.01547 18.7246C4.87913 17.7146 4.01717 16.4332 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Relist Item
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bidding-history-card">
                                <div className="card-header">
                                    <h3 className="card-title">Bidding History</h3>
                                    <span className="card-subtitle">Recent bids on this item</span>
                                </div>
                                <div className="bidding-list">
                                    {listing.bidsHistory.map((bid) => (
                                        <BidItem key={bid.id} bid={bid} />
                                    ))}
                                </div>
                                <button className="view-all-bids" onClick={handleViewAllBids}>
                                    View All Bids ({listing.bidsHistory.length})
                                </button>
                            </div>

                            {/* <div className="questions-card">
                                <div className="card-header">
                                    <h3 className="card-title">Questions & Answers</h3>
                                    <span className="card-subtitle">{listing.questions.length} questions</span>
                                </div>
                                <div className="questions-list">
                                    {listing.questions.map((question) => (
                                        <QuestionItem key={question.id} question={question} />
                                    ))}
                                </div>
                                <button className="ask-question-button" onClick={handleAskQuestion}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    Ask a Question
                                </button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default SellerListingDetails