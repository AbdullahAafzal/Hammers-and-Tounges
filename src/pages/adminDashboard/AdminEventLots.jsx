import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { auctionService } from '../../services/interceptors/auction.service';
import { getMediaUrl } from '../../config/api.config';
import { toast } from 'react-toastify';
import { fetchCategories } from '../../store/actions/AuctionsActions';
import BuyerEventLotsFilterBar from '../../components/BuyerEventLotsFilterBar';
import './AdminEventLots.css';

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
    <div className="admin-event-lots__specific-data">
      {entries.map(([key, value]) => (
        <div key={key} className="admin-event-lots__specific-item">
          <span className="admin-event-lots__specific-key">{formatSpecificKey(key)}</span>
          <span className="admin-event-lots__specific-value">
            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
          </span>
        </div>
      ))}
    </div>
  );
};

const getStatusModifier = (status) => {
  const s = (status || '').toUpperCase();
  switch (s) {
    case 'DRAFT': return '--draft';
    case 'SCHEDULED': case 'LIVE': case 'ACTIVE': case 'APPROVED': return '--active';
    case 'CLOSING': case 'CLOSED': case 'COMPLETED': return '--closed';
    case 'PENDING': return '--pending';
    case 'REJECTED': return '--rejected';
    default: return '--active';
  }
};

const LotCard = ({ lot, onOpenDetail, onSetActive, isSettingActive }) => {
  const imageMedia = lot.media?.filter((m) => m.media_type === 'image') || [];
  const imageUrls = imageMedia.map((m) => getMediaUrl(m.file)).filter(Boolean);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const intervalRef = useRef(null);
  const lotStatus = lot.status || lot.listing_status;

  useEffect(() => {
    if (imageUrls.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [imageUrls.length]);

  const displayUrl = imageUrls[currentImageIndex] || imageUrls[0];
  const hasMultipleImages = imageUrls.length > 1;

  return (
    <article
      className="admin-event-lots__card admin-event-lots__card--clickable"
      onClick={() => onOpenDetail?.(lot)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpenDetail?.(lot)}
    >
      <div className="admin-event-lots__card-media">
        {lotStatus && (
          <span className={`admin-event-lots__card-status admin-event-lots__card-status${getStatusModifier(lotStatus)}`}>
            {lotStatus}
          </span>
        )}
        {displayUrl ? (
          <img src={displayUrl} alt={lot.title} loading="lazy" />
        ) : (
          <div className="admin-event-lots__card-placeholder">📷</div>
        )}
        {hasMultipleImages && (
          <div className="admin-event-lots__card-slider-dots">
            {imageUrls.map((_, i) => (
              <span
                key={i}
                className={`admin-event-lots__card-dot ${i === currentImageIndex ? 'active' : ''}`}
                aria-hidden
              />
            ))}
          </div>
        )}
      </div>
      <div className="admin-event-lots__card-body">
        <div className="admin-event-lots__card-lot-no">Lot #{lot.lot_number || lot.id}</div>
        <h3 className="admin-event-lots__card-title">{lot.title || 'Untitled'}</h3>
        {lot.description && (
          <p className="admin-event-lots__card-desc">{lot.description}</p>
        )}
        <div className="admin-event-lots__card-meta">
          <span className="admin-event-lots__card-category">{lot.category_name || '—'}</span>
          <span className="admin-event-lots__card-price">
            {lot.currency || 'USD'} {formatPrice(lot.initial_price)}
          </span>
        </div>
        <SpecificDataList data={lot.specific_data} />
        <div className="admin-event-lots__card-footer">
          <span className="admin-event-lots__card-seller">{lot.seller_name || '—'}</span>
          {lot.total_bids != null && (
            <span className="admin-event-lots__card-bids">{lot.total_bids} bid(s)</span>
          )}
        </div>
        {(lotStatus || '').toUpperCase() === 'DRAFT' && onSetActive && (
          <button
            type="button"
            className="admin-event-lots__active-lot-btn"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onSetActive(lot);
            }}
            disabled={isSettingActive}
            aria-label={`Set lot ${lot.lot_number || lot.id} as active`}
          >
            {isSettingActive ? 'Activating...' : 'Active lot'}
          </button>
        )}
      </div>
    </article>
  );
};

const AdminEventLots = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const eventFromState = location.state?.event;

  const [lots, setLots] = useState([]);
  const [eventTitle, setEventTitle] = useState(eventFromState?.title || 'Event Lots');
  const [eventStatus, setEventStatus] = useState(eventFromState?.status ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState({});

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const fetchLots = useCallback(async (pageNum = 1) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await auctionService.getLots({
        event: id,
        page: pageNum,
        page_size: PAGE_SIZE,
      });
      setLots(res.results || []);
      setTotalCount(res.count ?? res.results?.length ?? 0);
      if (res.results?.[0]?.event_title && !eventFromState?.title) {
        setEventTitle(res.results[0].event_title);
      }
    } catch (err) {
      console.error('Error fetching lots:', err);
      setError(err.message || 'Failed to load lots');
      toast.error('Failed to load lots');
      setLots([]);
    } finally {
      setLoading(false);
    }
  }, [id, eventFromState?.title]);

  useEffect(() => {
    fetchLots(page);
  }, [fetchLots, page]);

  const lotCreated = location.state?.lotCreated;
  useEffect(() => {
    if (lotCreated && id) {
      setPage(1);
      fetchLots(1);
      navigate(`/admin/event/${id}`, { state: { event: eventFromState }, replace: true });
    }
  }, [lotCreated, id, eventFromState, fetchLots, navigate]);

  const handleCreateLot = useCallback(() => {
    const eventData = eventFromState || { id, title: eventTitle, status: eventStatus };
    navigate('/admin/publishnew', { state: { eventId: id, event: eventData, fromAdmin: true } });
  }, [navigate, id, eventFromState, eventTitle, eventStatus]);

  const [deletingEvent, setDeletingEvent] = useState(false);
  const handleDeleteEvent = useCallback(async () => {
    if (!window.confirm(`Are you sure you want to delete the event "${eventTitle}"? This will remove the event and all its lots.`)) return;
    setDeletingEvent(true);
    try {
      await auctionService.deleteEvent(id);
      toast.success('Event deleted successfully.');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err?.message || 'Failed to delete event');
    } finally {
      setDeletingEvent(false);
    }
  }, [id, eventTitle, navigate]);

  const showCreateLot = eventStatus === 'SCHEDULED';
  const showDeleteEvent = eventStatus === 'SCHEDULED';
  const showEditEvent = eventStatus === 'SCHEDULED';
  const isEventCompleted = (eventStatus || '').toUpperCase() === 'CLOSING' || (eventStatus || '').toUpperCase() === 'CLOSED';

  const [activatingLotId, setActivatingLotId] = useState(null);
  const handleSetLotActive = useCallback(async (lot) => {
    if (!lot?.id) return;
    setActivatingLotId(lot.id);
    try {
      const fullLot = await auctionService.getLot(lot.id);
      const payload = {
        seller: Number(fullLot.seller ?? fullLot.seller_id ?? fullLot.seller_details?.id ?? 0),
        title: fullLot.title ?? '',
        description: fullLot.description ?? '',
        category: Number(fullLot.category ?? fullLot.category_id ?? 0),
        auction_event: Number(fullLot.auction_event ?? fullLot.event_id ?? id),
        initial_price: String(fullLot.initial_price ?? '0'),
        reserve_price: String(fullLot.reserve_price ?? '0'),
        stc_eligible: Boolean(fullLot.stc_eligible),
        status: 'ACTIVE',
        specific_data: fullLot.specific_data && typeof fullLot.specific_data === 'object' ? fullLot.specific_data : {},
      };
      await auctionService.updateLot(lot.id, payload);
      toast.success(`Lot #${lot.lot_number || lot.id} set to Active`);
      fetchLots(page);
    } catch (err) {
      toast.error(err?.message || err?.response?.data?.detail || 'Failed to set lot active');
    } finally {
      setActivatingLotId(null);
    }
  }, [page, fetchLots, id]);

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
      } catch {
        if (!cancelled) setEventStatus(null);
      }
    })();
    return () => { cancelled = true; };
  }, [id, eventFromState]);

  const filteredLots = useMemo(() => {
    const filters = selectedFilters;
    const hasAnyFilter = Object.keys(filters).some(
      (k) => filters[k] && filters[k].size > 0
    );
    if (!hasAnyFilter) return lots;

    return lots.filter((lot) => {
      let sd = lot.specific_data;
      if (typeof sd === 'string') {
        try {
          sd = JSON.parse(sd) || {};
        } catch {
          sd = {};
        }
      }
      sd = sd || {};
      const catName = lot.category_name ?? lot.category?.name ?? '';

      for (const [sectionKey, selected] of Object.entries(filters)) {
        if (!selected || selected.size === 0) continue;

        if (sectionKey === 'category') {
          if (!selected.has(catName)) return false;
          continue;
        }

        if (sectionKey === 'make') {
          const lotMake = sd.make ?? sd.Make ?? '';
          const makeStr = String(lotMake).trim();
          if (!selected.has(makeStr)) return false;
          continue;
        }

        const lotVal = sd[sectionKey] ?? sd[sectionKey.replace(/_/g, ' ')];
        const lotValStr = lotVal != null ? String(lotVal) : '';
        if (!selected.has(lotValStr)) return false;
      }
      return true;
    });
  }, [lots, selectedFilters]);

  return (
    <div className="admin-event-lots">
      <header className="admin-event-lots__header">
        <button
          className="admin-event-lots__back"
          onClick={() => navigate('/admin/dashboard')}
          aria-label="Back to dashboard"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-5-7 5-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <div className="admin-event-lots__header-content">
          <div className="admin-event-lots__header-title-row">
            <h1 className="admin-event-lots__title">{eventTitle}</h1>
            {eventStatus && (
              <span className={`admin-event-lots__header-status admin-event-lots__header-status${getStatusModifier(eventStatus)}`}>
                {(eventStatus || '').toUpperCase() === 'CLOSING' ? 'COMPLETED' : eventStatus}
              </span>
            )}
          </div>
          <p className="admin-event-lots__subtitle">
            {totalCount} lot{totalCount !== 1 ? 's' : ''} in this event
          </p>
        </div>
        <div className="admin-event-lots__header-actions">
          {showEditEvent && (
            <button
              className="admin-event-lots__edit-event"
              onClick={() => navigate(`/admin/event/${id}/edit`)}
              aria-label="Edit event"
            >
              Edit Event
            </button>
          )}
          {showCreateLot && (
            <button
              className="admin-event-lots__create-lot"
              onClick={handleCreateLot}
              aria-label="Create lot"
            >
              Create Lot
            </button>
          )}
          {showDeleteEvent && (
            <button
              className="admin-event-lots__delete-event"
              onClick={handleDeleteEvent}
              disabled={deletingEvent}
              aria-label="Delete event"
            >
              {deletingEvent ? 'Deleting...' : 'Delete Event'}
            </button>
          )}
        </div>
      </header>

      <main className="admin-event-lots__main">
        {loading && lots.length === 0 ? (
          <div className="admin-event-lots__loading">
            <div className="admin-event-lots__spinner" />
            <p>Loading lots...</p>
          </div>
        ) : error ? (
          <div className="admin-event-lots__error">
            <p>{error}</p>
            <button onClick={() => fetchLots(page)}>Retry</button>
          </div>
        ) : lots.length === 0 ? (
          <div className="admin-event-lots__empty">
            <p>No lots found for this event.</p>
          </div>
        ) : (
          <div className="admin-event-lots__body">
            <div className="admin-event-lots__content">
              {filteredLots.length === 0 ? (
                <div className="admin-event-lots__empty">
                  <p>No lots match your filters.</p>
                  <button
                    onClick={() => setSelectedFilters({})}
                    className="admin-event-lots__clear-filters"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="admin-event-lots__grid">
                    {filteredLots.map((lot) => (
                      <LotCard
                        key={lot.id}
                        lot={lot}
                        onOpenDetail={(l) => navigate(`/admin/event/${id}/lot/${l.id}`, { state: { lot: l, event: eventFromState || { id, title: eventTitle, status: eventStatus } } })}
                        onSetActive={isEventCompleted ? undefined : handleSetLotActive}
                        isSettingActive={activatingLotId === lot.id}
                      />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="admin-event-lots__pagination">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        aria-label="Previous page"
                      >
                        Previous
                      </button>
                      <span className="admin-event-lots__page-info">
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
            </div>
            <BuyerEventLotsFilterBar
              eventId={id}
              lots={lots}
              onFiltersChange={setSelectedFilters}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminEventLots;
