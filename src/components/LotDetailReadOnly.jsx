import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { auctionService } from '../services/interceptors/auction.service';
import { getMediaUrl } from '../config/api.config';
import { toast } from 'react-toastify';
import './LotDetailReadOnly.css';

const formatPrice = (price) => {
  if (!price) return '—';
  return parseFloat(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatSpecificKey = (key) => {
  return String(key)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const LotDetailReadOnly = ({ backPath }) => {
  const { lotId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const lotFromState = location.state?.lot;

  const [lot, setLot] = useState(lotFromState);
  const [loading, setLoading] = useState(!lotFromState);
  const [selectedImage, setSelectedImage] = useState(0);

  const imageMedia = lot?.media?.filter((m) => m.media_type === 'image') || [];
  const imageUrls = imageMedia.map((m) => getMediaUrl(m.file)).filter(Boolean);

  useEffect(() => {
    if (lotFromState) return;
    if (!lotId) {
      navigate(backPath || -1);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await auctionService.getLot(lotId);
        if (!cancelled) setLot(data);
      } catch (err) {
        if (!cancelled) {
          toast.error(err?.message || 'Failed to load lot');
          navigate(backPath, { replace: true });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [lotId, lotFromState, backPath, navigate]);

  const handleBack = () => {
    navigate(backPath);
  };

  if (loading && !lot) {
    return (
      <div className="lot-detail-ro">
        <div className="lot-detail-ro__loading">
          <div className="lot-detail-ro__spinner" />
          <p>Loading lot...</p>
        </div>
      </div>
    );
  }

  if (!lot) return null;

  const specificData = lot.specific_data || {};
  const displayImage = imageUrls[selectedImage] || imageUrls[0];

  return (
    <div className="lot-detail-ro">
      <header className="lot-detail-ro__header">
        <button
          className="lot-detail-ro__back"
          onClick={handleBack}
          aria-label="Back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-5-7 5-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <div className="lot-detail-ro__header-content">
          <h1 className="lot-detail-ro__title">Lot Detail</h1>
          <p className="lot-detail-ro__subtitle">Lot #{lot.lot_number || lot.id}</p>
        </div>
      </header>

      <main className="lot-detail-ro__main">
        <div className="lot-detail-ro__media">
          {displayImage ? (
            <div className="lot-detail-ro__image-wrap">
              <img src={displayImage} alt={lot.title} />
              {imageUrls.length > 1 && (
                <div className="lot-detail-ro__slider-dots">
                  {imageUrls.map((_, i) => (
                    <span
                      key={i}
                      className={`lot-detail-ro__dot ${i === selectedImage ? 'active' : ''}`}
                      onClick={() => setSelectedImage(i)}
                      aria-hidden
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="lot-detail-ro__placeholder">📷 No image</div>
          )}
        </div>

        <div className="lot-detail-ro__body">
          <div className="lot-detail-ro__lot-no">LOT #{lot.lot_number || lot.id}</div>
          <h2 className="lot-detail-ro__lot-title">{lot.title || 'Untitled'}</h2>
          {lot.description && <p className="lot-detail-ro__desc">{lot.description}</p>}
          <div className="lot-detail-ro__meta">
            <span className="lot-detail-ro__category">{lot.category_name || '—'}</span>
            <span className="lot-detail-ro__price">
              {lot.currency || 'USD'} {formatPrice(lot.initial_price)}
            </span>
          </div>

          {Object.keys(specificData).length > 0 && (
            <div className="lot-detail-ro__specific">
              <h3 className="lot-detail-ro__section-title">Details</h3>
              <div className="lot-detail-ro__specific-grid">
                {Object.entries(specificData).map(([key, value]) => (
                  <div key={key} className="lot-detail-ro__specific-item">
                    <span className="lot-detail-ro__specific-key">{formatSpecificKey(key)}</span>
                    <span className="lot-detail-ro__specific-value">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="lot-detail-ro__bids">
            {lot.total_bids != null ? `${lot.total_bids} bid(s)` : '0 bid(s)'}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LotDetailReadOnly;
