import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { auctionService } from '../services/interceptors/auction.service';
import { getMediaUrl } from '../config/api.config';
import { toast } from 'react-toastify';
import './ManagerEventLots.css';

const PAGE_SIZE = 12;

const formatDate = (str) => {
  if (!str) return '—';
  try {
    return new Date(str).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
};

const formatPrice = (price) => {
  if (!price) return '—';
  return parseFloat(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatSpecificKey = (key) => {
  return String(key)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const SpecificDataList = ({ data }) => {
  if (!data || typeof data !== 'object') return null;
  const entries = Object.entries(data).filter(([, v]) => v != null && v !== '');
  if (entries.length === 0) return null;
  return (
    <div className="manager-event-lots__specific-data">
      {entries.map(([key, value]) => (
        <div key={key} className="manager-event-lots__specific-item">
          <span className="manager-event-lots__specific-key">{formatSpecificKey(key)}</span>
          <span className="manager-event-lots__specific-value">
            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
          </span>
        </div>
      ))}
    </div>
  );
};

const LotCard = ({ lot }) => {
  const imageMedia = lot.media?.filter((m) => m.media_type === 'image') || [];
  const mainImage = imageMedia[0]?.file;
  const imageUrl = mainImage ? getMediaUrl(mainImage) : null;

  return (
    <article className="manager-event-lots__card">
      <div className="manager-event-lots__card-media">
        {imageUrl ? (
          <img src={imageUrl} alt={lot.title} loading="lazy" />
        ) : (
          <div className="manager-event-lots__card-placeholder">📷</div>
        )}
        <span className={`manager-event-lots__card-status manager-event-lots__card-status--${(lot.status || '').toLowerCase()}`}>
          {lot.status || '—'}
        </span>
      </div>
      <div className="manager-event-lots__card-body">
        <div className="manager-event-lots__card-lot-no">Lot #{lot.lot_number || lot.id}</div>
        <h3 className="manager-event-lots__card-title">{lot.title || 'Untitled'}</h3>
        {lot.description && (
          <p className="manager-event-lots__card-desc">{lot.description}</p>
        )}
        <div className="manager-event-lots__card-meta">
          <span className="manager-event-lots__card-category">{lot.category_name || '—'}</span>
          <span className="manager-event-lots__card-price">
            {lot.currency || 'USD'} {formatPrice(lot.initial_price)}
          </span>
        </div>
        <SpecificDataList data={lot.specific_data} />
        <div className="manager-event-lots__card-footer">
          <span className="manager-event-lots__card-seller">{lot.seller_name || '—'}</span>
          {lot.total_bids != null && (
            <span className="manager-event-lots__card-bids">{lot.total_bids} bid(s)</span>
          )}
        </div>
      </div>
    </article>
  );
};

const ManagerEventLots = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const eventFromState = location.state?.event;

  const [lots, setLots] = useState([]);
  const [eventTitle, setEventTitle] = useState(eventFromState?.title || 'Event Lots');
  const [eventStatus, setEventStatus] = useState(eventFromState?.status ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  const fetchLots = useCallback(async (pageNum = 1) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      let items = [];
      let total = 0;
      let lotsSucceeded = false;

      // Try lots endpoint first (same as Postman: /api/auctions/lots/?event=1&page=1&page_size=12)
      try {
        const res = await auctionService.getLots({
          event: id,
          page: pageNum,
          page_size: PAGE_SIZE,
        });
        lotsSucceeded = true;
        items = res.results || [];
        total = res.count ?? items.length;
      } catch (lotsErr) {
        console.warn('Lots endpoint failed, trying listings fallback:', lotsErr);
      }

      // Fallback: only when lots endpoint failed (e.g. 404), try listings
      if (!lotsSucceeded) {
        try {
          const listingsRes = await auctionService.getAuctions({
            event: id,
            event_id: id,
            page: pageNum,
            page_size: PAGE_SIZE,
          });
          const rawItems = listingsRes.results || [];
          items = rawItems.map((l) => ({
            ...l,
            seller_name: l.seller_name ?? l.seller_details?.name ?? '—',
            category_name: l.category_name ?? l.category?.name ?? '—',
          }));
          total = listingsRes.count ?? rawItems.length;
        } catch (listingsErr) {
          throw listingsErr || new Error('Failed to load lots');
        }
      }

      setLots(items);
      setTotalCount(total);
      if (items[0]?.event_title && !eventFromState?.title) {
        setEventTitle(items[0].event_title);
      }
    } catch (err) {
      if (err) {
        console.error('Error fetching lots:', err);
        setError(err?.message || err?.response?.data?.detail || 'Failed to load lots');
        toast.error('Failed to load lots');
      }
      setLots([]);
    } finally {
      setLoading(false);
    }
  }, [id, eventFromState?.title]);

  useEffect(() => {
    fetchLots(page);
  }, [fetchLots, page]);

  // Fetch event details when not in state (e.g. direct URL)
  useEffect(() => {
    if (!id || eventFromState) return;
    let cancelled = false;
    (async () => {
      try {
        const ev = await auctionService.getEvent(id);
        if (!cancelled) {
          setEventTitle(ev.title || eventTitle);
          setEventStatus(ev.status ?? null);
        }
      } catch (err) {
        if (!cancelled) setEventStatus(null);
      }
    })();
    return () => { cancelled = true; };
  }, [id, eventFromState]);

  const handleCreateLot = () => {
    const eventData = eventFromState || { id, title: eventTitle, status: eventStatus };
    navigate('/manager/publishnew', { state: { eventId: id, event: eventData } });
  };

  const showCreateLot = eventStatus === 'SCHEDULED';

  return (
    <div className="manager-event-lots">
      <header className="manager-event-lots__header">
        <button
          className="manager-event-lots__back"
          onClick={() => navigate('/manager/dashboard')}
          aria-label="Back to dashboard"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-5-7 5-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <div className="manager-event-lots__header-content">
          <h1 className="manager-event-lots__title">{eventTitle}</h1>
          <p className="manager-event-lots__subtitle">
            {totalCount} lot{totalCount !== 1 ? 's' : ''} in this event
          </p>
        </div>
        {showCreateLot && (
          <button
            className="manager-event-lots__create-lot"
            onClick={handleCreateLot}
            aria-label="Create lot"
          >
            Create Lot
          </button>
        )}
      </header>

      <main className="manager-event-lots__main">
        {loading && lots.length === 0 ? (
          <div className="manager-event-lots__loading">
            <div className="manager-event-lots__spinner" />
            <p>Loading lots...</p>
          </div>
        ) : error ? (
          <div className="manager-event-lots__error">
            <p>{error}</p>
            <button onClick={() => fetchLots(page)}>Retry</button>
          </div>
        ) : lots.length === 0 ? (
          <div className="manager-event-lots__empty">
            <p>No lots found for this event.</p>
          </div>
        ) : (
          <>
            <div className="manager-event-lots__grid">
              {lots.map((lot) => (
                <LotCard key={lot.id} lot={lot} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="manager-event-lots__pagination">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  aria-label="Previous page"
                >
                  Previous
                </button>
                <span className="manager-event-lots__page-info">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ManagerEventLots;
