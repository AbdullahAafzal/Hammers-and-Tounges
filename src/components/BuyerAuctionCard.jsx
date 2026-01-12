import React, { useState, useCallback } from 'react';
import { useCountdownTimer } from '../hooks/useCountdownTimer';
import { formatPrice } from '../utils/auctionUtils';
import './BuyerAuctionCard.css';

const BuyerAuctionCard = ({ auction, onClick }) => {

    const [imageError, setImageError] = useState(false);
    const now = new Date();
    const apiStatus = auction.status?.toUpperCase();
    const startDate = new Date(auction.startdate || auction.start_date);
    const endDate = new Date(auction.enddate || auction.end_date);

    let currentStatus, timerLabel, targetDate, isClickable;

    if (apiStatus === 'COMPLETED') {
        currentStatus = 'ended';
        timerLabel = 'ENDED';
        targetDate = null;
        isClickable = false;
    }
    else if (apiStatus === 'DRAFT') {
        // Auction is in draft/pending approval
        currentStatus = 'draft';
        timerLabel = 'DRAFT';
        targetDate = null; // No countdown for draft
        isClickable = false;
    }
    else if (apiStatus === 'APPROVED') {
        // Auction approved but check if it has started
        if (now < startDate) {
            // Approved but not started yet
            currentStatus = 'approved';
            timerLabel = 'STARTS IN';
            targetDate = auction.startdate || auction.start_date;
            isClickable = true;
        } else if (now >= startDate && now <= endDate) {
            // Started and still running
            currentStatus = 'active';
            timerLabel = 'ENDS IN';
            targetDate = auction.enddate || auction.end_date;
            isClickable = true;
        } else {
            // Past end date
            currentStatus = 'ended';
            timerLabel = 'ENDED';
            targetDate = null;
            isClickable = false;
        }
    }
    else if (apiStatus === 'ACTIVE') {
        // Auction is actively running
        if (now >= startDate && now <= endDate) {
            currentStatus = 'active';
            timerLabel = 'ENDS IN';
            targetDate = auction.enddate || auction.end_date;
            isClickable = true;
        } else if (now > endDate) {
            // Active but past end date (should be completed)
            currentStatus = 'ended';
            timerLabel = 'ENDED';
            targetDate = null;
            isClickable = false;
        } else {
            // Active but before start (edge case)
            currentStatus = 'approved';
            timerLabel = 'STARTS IN';
            targetDate = auction.startdate || auction.start_date;
            isClickable = true;
        }
    }
    else {
        // Fallback: Pure date-based logic for unknown statuses
        if (now < startDate) {
            currentStatus = 'approved';
            timerLabel = 'STARTS IN';
            targetDate = auction.startdate || auction.start_date;
            isClickable = true;
        } else if (now >= startDate && now <= endDate) {
            currentStatus = 'active';
            timerLabel = 'ENDS IN';
            targetDate = auction.enddate || auction.end_date;
            isClickable = true;
        } else {
            currentStatus = 'ended';
            timerLabel = 'ENDED';
            targetDate = null;
            isClickable = false;
        }
    }

    // Use countdown timer only if we have a target date
    const timer = targetDate ? useCountdownTimer(targetDate) : { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const getAuctionImage = useCallback(() => {
        if (!auction.media?.length) {
            return 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80';
        }
        const imageMedia = auction.media.find(m =>
            m.mediatype === 'image' || m.media_type === 'image'
        );
        return imageMedia?.file || auction.media[0]?.file ||
            'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80';
    }, [auction.media]);

    const handleCardClick = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isClickable) {
            onClick?.(auction);
        }
    }, [auction, onClick, isClickable]);

    const imageUrl = getAuctionImage();
    const fallbackImage = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80';

    // STATUS BADGE CONFIGURATION
    const statusConfig = {
        active: {
            label: 'LIVE',
            className: 'status-live'
        },
    };

    const displayStatus = statusConfig[currentStatus];

    // Format price with fallback
    const displayPrice = formatPrice(
        auction.initialprice || auction.initial_price,
        auction.currency || 'USD'
    );

    // Format bids count
    const bidsCount = auction.totalbids ?? auction.total_bids ?? 0;

    return (
        <article
            className={`auction-card ${!isClickable ? 'auction-card-disabled' : ''}`}
            onClick={handleCardClick}
        >
            {/* Image & Status Badge */}
            <div className="auction-card-image-wrapper">
                <img
                    src={imageError ? fallbackImage : imageUrl}
                    alt={auction.title || 'Auction'}
                    className="auction-card-image"
                    loading="lazy"
                    onError={() => setImageError(true)}
                />
                {displayStatus && (
                    <span className={`auction-status-badge ${displayStatus.className}`}>
                        {displayStatus.label}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="auction-card-content">
                <p className="auctions-category">
                    {auction.categoryname || auction.category_name || 'Uncategorized'}
                </p>

                <h3 className="auction-card-title" title={auction.title}>
                    {auction.title || 'Untitled Auction'}
                </h3>

                <div className="auction-price-display">
                    <span className="auction-price-label">Starting Price</span>
                    <span className="auction-price-value">{displayPrice}</span>
                </div>

                <div className="auction-bid-info">
                    <span className="auction-bid-label">Total Bids</span>
                    <span className="auctions-bid-value">{bidsCount}</span>
                </div>

                {/* Action Button */}
                <button
                    className={`auctions-view-btn`}
                >
                    {currentStatus === 'approved'
                        ? 'View Details'
                        : 'View Auction'}
                </button>
            </div>
        </article>
    );
};

export default BuyerAuctionCard;