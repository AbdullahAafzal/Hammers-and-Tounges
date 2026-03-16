import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { getMediaUrl } from '../config/api.config';
import { useCountdownTimer } from '../hooks/useCountdownTimer';
import { addToFavorite, deleteFavorite } from '../store/actions/buyerActions';
import { toast } from 'react-toastify';
import './LotRow.css';

const formatPrice = (price) => {
  if (!price) return '—';
  return parseFloat(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const LotRow = ({ lot, eventEndTime, eventTitle, eventStatus, onOpenDetail, showFavorite = false, isFavorite = false, onFavoriteToggle, statusOnly = false }) => {
  const dispatch = useDispatch();
  const [isUpdating, setIsUpdating] = useState(false);

  const imageMedia = lot.media?.filter((m) => (m.media_type ?? m.mediatype) === 'image') || [];
  const imageUrls = imageMedia.map((m) => getMediaUrl(m.file)).filter(Boolean);
  const displayUrl = imageUrls[0];

  const endTime = lot.end_date || lot.end_time || eventEndTime;
  const timerTarget = endTime || new Date(Date.now() + 86400000).toISOString();
  const timer = useCountdownTimer(timerTarget);
  const timerSaysEnded = !endTime || timer.isFinished || (endTime && new Date(endTime) <= new Date());
  const isEventLive = (eventStatus || '').toUpperCase() === 'LIVE' || (eventStatus || '').toUpperCase() === 'ACTIVE';
  const isEnded = isEventLive ? false : timerSaysEnded;

  const currentBid = lot.current_price ?? lot.highest_bid ?? lot.initial_price;
  const currency = lot.currency || 'USD';

  const timeLeftDisplay = (() => {
    if (statusOnly) {
      return isEventLive ? 'Live' : 'Closed';
    }
    // When we have time left, always show the countdown
    if (!timer.isFinished && endTime && new Date(endTime) > new Date()) {
      const { days, hours, minutes, seconds } = timer;
      if (days > 0) return `${days}d ${hours}h`;
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m ${seconds}s`;
    }
    if (isEventLive && timerSaysEnded) return 'Live';
    if (isEnded) return 'Ended';
    const { days, hours, minutes, seconds } = timer;
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m ${seconds}s`;
  })();

  const isClosed = timeLeftDisplay === 'Closed' || timeLeftDisplay === 'Ended';

  const handleFavoriteClick = useCallback(
    async (e) => {
      e.stopPropagation();
      if (!lot?.id || isUpdating) return;
      setIsUpdating(true);
      const prev = isFavorite;
      try {
        if (isFavorite) {
          await dispatch(deleteFavorite(lot.id)).unwrap();
          toast.success('Removed from favorites');
        } else {
          await dispatch(addToFavorite(lot.id)).unwrap();
          toast.success('Added to favorites');
        }
        onFavoriteToggle?.(lot.id, !isFavorite);
      } catch {
        toast.error('Failed to update favorite');
      } finally {
        setIsUpdating(false);
      }
    },
    [lot?.id, isFavorite, isUpdating, dispatch, onFavoriteToggle]
  );

  return (
    <article
      className="lot-row"
      onClick={() => onOpenDetail?.(lot)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpenDetail?.(lot)}
    >
      <div className="lot-row__thumb">
        {displayUrl ? (
          <img src={displayUrl} alt={lot.title} loading="lazy" />
        ) : (
          <div className="lot-row__thumb-placeholder">📷</div>
        )}
      </div>
      <div className="lot-row__info">
        <h3 className="lot-row__title">{lot.title || 'Untitled'}</h3>
        <p className="lot-row__location">
          {lot.location || lot.venue || eventTitle || '—'}
        </p>
        <div className="lot-row__bid">
          <div className="lot-row__bid-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <div className="lot-row__bid-content">
            <span className="lot-row__bid-label">CURRENT BID</span>
            <span className="lot-row__bid-value">
              {currency} {formatPrice(currentBid)}
            </span>
          </div>
        </div>
      </div>
      <div className="lot-row__right">
        {showFavorite && (
          <button
            type="button"
            className="lot-row__star"
            onClick={handleFavoriteClick}
            disabled={isUpdating}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="lot-row__heart-icon">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.18 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="lot-row__heart-icon">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>
        )}
        <div className="lot-row__time">
          {!statusOnly && <span className="lot-row__time-label">TIME LEFT</span>}
          <span className={`lot-row__time-value ${isClosed ? 'ended' : ''}`}>{timeLeftDisplay}</span>
        </div>
      </div>
    </article>
  );
};

export default LotRow;
