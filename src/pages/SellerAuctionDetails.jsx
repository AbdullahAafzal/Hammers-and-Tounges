import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import './SellerAuctionDetails.css'
import { deleteAuction } from '../store/actions/sellerActions'
import { useSelector, useDispatch } from 'react-redux'

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
        minute: '2-digit',
        timeZone: 'UTC'
    })
}

const ImageGallery = ({ images, activeImage, onImageChange }) => (
    <div className="image-gallery">
        <div className="main-image">
            <img src={images[activeImage]?.file || images[activeImage]} alt="Main view" />
        </div>
        <div className="thumbnail-images">
            {images.map((image, index) => (
                <button
                    key={`thumb-${image.id || index}`}
                    className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                    onClick={() => onImageChange(index)}
                    aria-label={`View image ${index + 1}`}
                >
                    <img src={image.file || image} alt={`Thumbnail ${index + 1}`} />
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

const SellerListingDetails = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const { myAuctions } = useSelector(state => state.seller)
    const auctions = myAuctions?.results || []
    const [activeImage, setActiveImage] = useState(0)
    const [showFullDescription, setShowFullDescription] = useState(false)
    const [timeRemaining, setTimeRemaining] = useState('')
    const [listing, setListing] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        if (id && auctions.length > 0) {
            const auction = auctions.find(a => a.id.toString() === id);
            if (auction) {
                setListing(auction);
            }
        }
    }, [id, auctions])

    const calculateTimeRemaining = useCallback(() => {
        if (!listing?.end_date) return 'Loading...'
        
        const now = new Date()
        const endDate = new Date(listing.end_date)
        const diff = endDate - now

        if (diff <= 0) return 'Auction ended'

        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

        return `${days}d ${hours}h ${minutes}m`
    }, [listing?.end_date])

    useEffect(() => {
        if (!listing) return;

        const updateTime = () => {
            setTimeRemaining(calculateTimeRemaining())
        }

        updateTime()
        const interval = setInterval(updateTime, 60000)

        return () => clearInterval(interval)
    }, [calculateTimeRemaining, listing])

    const handleEditListing = () => {
        if (!listing) return;

        navigate(`/seller/product`, {
            state: {
                isEditing: true,
                listingData: listing
            }
        })
    }

    const handleRemoveListing = () => {
        if (!listing) return;
        
        if (window.confirm('Are you sure you want to remove this listing? This action cannot be undone.')) {
            console.log('Remove listing clicked for ID:', listing.id)
            dispatch(deleteAuction(listing.id));
            navigate('/seller/auction-listings');
        }
    }

    const handleSendForApproval = () => {
        if (!listing) return;
        
        if (window.confirm('Send this listing for admin approval?')) {
            console.log('Send for approval clicked for ID:', listing.id)
            // Add API call to send for approval
        }
    }

    const handleEndAuction = () => {
        if (!listing) return;
        
        if (window.confirm('Are you sure you want to end this auction early?')) {
            console.log('End auction clicked for ID:', listing.id)
            // Add API call to end auction
        }
    }

    if (!listing) {
        return (
            <div className="seller-page">
                <main className="seller-main">
                    <div className="page-container">
                        <div className="loading-state">
                            <p>Loading listing details...</p>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    const images = listing.media || []
    const specificData = listing.specific_data || {}

    return (
        <div className="seller-page">
            <main className="seller-main">
                <div className="page-container">
                    <div className="page-header">
                        <div className="page-title-section">
                            <h1 className="page-title">Listing Details</h1>
                            <p className="page-subtitle">Manage and monitor your listing performance</p>
                        </div>
                        <div className="page-actions">
                            <Link to="/seller/auction-listings" className="s-secondary-button">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Back to Listings
                            </Link>
                        </div>
                    </div>

                    <div className="breadcrumb">
                        <Link to="/seller/dashboard" className="breadcrumb-item">Dashboard</Link>
                        <span className="breadcrumb-separator">/</span>
                        <Link to="/seller/auction-listings" className="breadcrumb-item">My Listings</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span className="breadcrumb-item active">{listing.title}</span>
                    </div>

                    <div className="listing-details-grid">
                        <div className="listing-details-left">
                            {images.length > 0 && (
                                <ImageGallery
                                    images={images}
                                    activeImage={activeImage}
                                    onImageChange={setActiveImage}
                                />
                            )}

                            {/* <div className="stats-card">
                                <h3 className="stats-card-title">Auction Statistics</h3>
                                <div className="stats-grid">
                                    <StatItem
                                        icon={
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        }
                                        value={listing.total_bids || 0}
                                        label="Total Bids"
                                    />
                                    <StatItem
                                        icon={
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M18 8A6 6 0 0 0 6 8C6 11.3137 3.31371 14 0 14M18 8C20.2091 8 22 9.79086 22 12C22 14.2091 20.2091 16 18 16M18 8C20.2091 8 22 5.79086 22 3C22 0.790861 20.2091 -1 18 -1C15.7909 -1 14 0.790861 14 3C14 5.79086 15.7909 8 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        }
                                        value={listing.is_favourite ? 'Favorited' : 'Not Favorited'}
                                        label="Favorite Status"
                                    />
                                    <StatItem
                                        icon={
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6312 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6312 13.6815 18 14.5717 18 15.5C18 16.4283 17.6312 17.3185 16.9749 17.9749C16.3185 18.6312 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        }
                                        value={formatCurrency(listing.initial_price)}
                                        label="Initial Price"
                                    />
                                    <StatItem
                                        icon={
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        }
                                        value={timeRemaining}
                                        label="Time Remaining"
                                    />
                                </div>
                            </div> */}

                            <div className="details-card">
                                <h3 className="details-card-title">Item Details</h3>
                                <div className="details-list">
                                    {Object.entries(specificData).map(([key, value]) => (
                                        <div className="detail-item" key={key}>
                                            <span className="detail-label">{key.replace(/_/g, ' ').toUpperCase()}:</span>
                                            <span className="detail-value">{value}</span>
                                        </div>
                                    ))}
                                    <div className="detail-item">
                                        <span className="detail-label">HANDOVER TYPE:</span>
                                        <span className="detail-value">{listing.handover_type}</span>
                                    </div>
                                    {listing.pickup_address && (
                                        <div className="detail-item">
                                            <span className="detail-label">PICKUP ADDRESS:</span>
                                            <span className="detail-value">{listing.pickup_address}</span>
                                        </div>
                                    )}
                                    <div className="detail-item">
                                        <span className="detail-label">CURRENCY:</span>
                                        <span className="detail-value">{listing.currency}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="listing-details-right">
                            <div className="info-card">
                                <div className="info-card-header">
                                    <h2 className="listing-title">{listing.title}</h2>
                                    <div className="listing-category">{listing.category_name}</div>
                                    <div className="listing-status">
                                        <span className={`status-badge ${listing.status.toLowerCase()}`}>
                                            {listing.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="info-card-body">
                                    <div className="listing-description">
                                        <h3 className="description-title">Description</h3>
                                        <p className={`description-text ${showFullDescription ? 'expanded' : ''}`}>
                                            {listing.description}
                                        </p>
                                        {listing.description && listing.description.length > 200 && !showFullDescription && (
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
                                                <span className="detail-label">Initial Price:</span>
                                                <span className="detail-value highlight">{formatCurrency(listing.initial_price)}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Seller Expected Price:</span>
                                                <span className="detail-value">{formatCurrency(listing.seller_expected_price)}</span>
                                            </div>
                                            {listing.is_buy_now_enabled && listing.buy_now_price && (
                                                <div className="detail-row">
                                                    <span className="detail-label">Buy Now Price:</span>
                                                    <span className="detail-value">{formatCurrency(listing.buy_now_price)}</span>
                                                </div>
                                            )}
                                            <div className="detail-row">
                                                <span className="detail-label">Start Date:</span>
                                                <span className="detail-value">{formatDate(listing.start_date)}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">End Date:</span>
                                                <span className="detail-value">{formatDate(listing.end_date)}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Extended Time:</span>
                                                <span className="detail-value">{listing.extended_time_seconds} seconds</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="seller-info-section">
                                        <h3 className="info-title">Seller Information</h3>
                                        <div className="info-grid">
                                            <div className="info-row">
                                                <span className="info-label">Seller Name:</span>
                                                <span className="info-value">{listing.seller_name}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">Auction Manager:</span>
                                                <span className="info-value">{listing.auction_manager_name}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">Created At:</span>
                                                <span className="info-value">{formatDate(listing.created_at)}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">Last Updated:</span>
                                                <span className="info-value">{formatDate(listing.updated_at)}</span>
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
                                            <button className="action-button secondary" onClick={handleSendForApproval}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Send for Approval
                                            </button>
                                            <button className="action-button danger" onClick={handleRemoveListing}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Remove Listing
                                            </button>
                                            {/* <button className="action-button secondary" onClick={handleEndAuction}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6312 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6312 13.6815 18 14.5717 18 15.5C18 16.4283 17.6312 17.3185 16.9749 17.9749C16.3185 18.6312 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                End Auction
                                            </button> */}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {listing.rejection_reason && (
                                <div className="rejection-card">
                                    <div className="card-header">
                                        <h3 className="card-title">Rejection Reason</h3>
                                    </div>
                                    <div className="rejection-content">
                                        <p>{listing.rejection_reason}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default SellerListingDetails