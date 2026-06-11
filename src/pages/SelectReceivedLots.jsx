import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auctionService } from '../services/interceptors/auction.service';
import LotRow from '../components/LotRow';
import './adminDashboard/AdminEventLots.css';
import './adminDashboard/AdminGoodsReceivedVerification.css';
import './GuestEventLots.css';
import './SelectReceivedLots.css';

const PAGE_SIZE = 12;

const parseError = (err) =>
  err?.response?.data?.detail ||
  err?.response?.data?.message ||
  err?.message ||
  'Something went wrong';

const formatBookedIn = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
};

export default function SelectReceivedLots({ isManagerFlow = false }) {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const eventFromState = location.state?.event;

  const eventPath = isManagerFlow ? `/manager/event/${eventId}` : `/admin/event/${eventId}`;
  const dashboardPath = isManagerFlow ? '/manager/dashboard' : '/admin/dashboard';
  const eventTitle = eventFromState?.title || 'Event';

  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedLotId, setSelectedLotId] = useState(null);
  const [saving, setSaving] = useState(false);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  const fetchLots = useCallback(async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await auctionService.getLots({
        status: 'RECEIVED',
        page: pageNum,
        page_size: PAGE_SIZE,
      });
      setLots(res.results || []);
      setTotalCount(res.count ?? res.results?.length ?? 0);
    } catch (err) {
      setError(parseError(err));
      setLots([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLots(page);
  }, [fetchLots, page]);

  const filteredLots = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return lots;
    return lots.filter((lot) => {
      const title = String(lot?.title || '').toLowerCase();
      const seller = String(lot?.seller_name || '').toLowerCase();
      const idStr = String(lot?.id ?? '');
      const lotNo = String(lot?.lot_number ?? '');
      return title.includes(q) || seller.includes(q) || idStr.includes(q) || lotNo.includes(q);
    });
  }, [lots, search]);

  const bookedInCaption = (lot) => {
    const booked = formatBookedIn(lot.booked_in_date);
    if (booked) return `Booked in: ${booked}`;
    if (lot.seller_name) return `Seller: ${lot.seller_name}`;
    return null;
  };

  const handleSave = async () => {
    if (!selectedLotId) {
      toast.error('Select a received lot');
      return;
    }
    setSaving(true);
    try {
      await auctionService.patchLot(selectedLotId, {
        auction_event: Number(eventId),
        status: 'DRAFT',
      });
      toast.success('Lot added to event');
      navigate(eventPath, {
        replace: true,
        state: { event: eventFromState, receivedLotAdded: true },
      });
    } catch (err) {
      toast.error(parseError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="select-received-lots admin-event-lots admin-grv-page" role="main">
      <header className="admin-event-lots__header">
        <button
          type="button"
          className="admin-event-lots__back"
          onClick={() => navigate(eventPath, { state: { event: eventFromState } })}
          aria-label="Back to event"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-5-7 5-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <div className="admin-event-lots__header-content">
          <div className="admin-event-lots__header-title-row">
            <h1 className="admin-event-lots__title">Select received lot</h1>
            <span className="admin-event-lots__header-status admin-event-lots__header-status--draft">
              Received
            </span>
          </div>
          <p className="admin-event-lots__subtitle">Add to {eventTitle}</p>
        </div>
        <div className="admin-event-lots__header-actions">
          <button
            type="button"
            className="admin-event-lots__create-lot"
            onClick={handleSave}
            disabled={saving || !selectedLotId}
            aria-label="Save selected lot to event"
          >
            {saving ? 'Saving…' : 'Save to event'}
          </button>
        </div>
      </header>

      <main className="admin-event-lots__main">
        {loading && lots.length === 0 ? (
          <div className="admin-event-lots__loading">
            <div className="admin-event-lots__spinner" />
            <p>Loading received lots…</p>
          </div>
        ) : error ? (
          <div className="admin-event-lots__error">
            <p>{error}</p>
            <button type="button" onClick={() => fetchLots(page)}>
              Retry
            </button>
          </div>
        ) : (
          <div className="admin-event-lots__body admin-grv-body-col">
            <div className="admin-event-lots__content admin-grv-content-full">
              <div className="admin-grv-stack">
                <input
                  type="search"
                  className="admin-grv-search"
                  placeholder="Search by title, seller, or lot #…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search received lots"
                />
                {filteredLots.length === 0 ? (
                  <div className="admin-event-lots__empty">
                    <p>{lots.length === 0 ? 'No received lots found.' : 'No lots match your search.'}</p>
                    {lots.length === 0 ? (
                      <button type="button" onClick={() => navigate(dashboardPath)}>
                        Back to dashboard
                      </button>
                    ) : null}
                  </div>
                ) : (
                  <div className="guest-event-lots__list admin-grv-lot-list select-received-lots__list">
                    {filteredLots.map((lot) => {
                      const selected = String(selectedLotId) === String(lot.id);
                      return (
                        <div
                          key={lot.id}
                          role="button"
                          tabIndex={0}
                          className={`select-received-lots__row${selected ? ' select-received-lots__row--selected' : ''}`}
                          onClick={() => setSelectedLotId(lot.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedLotId(lot.id);
                            }
                          }}
                          aria-pressed={selected}
                        >
                          <LotRow
                            lot={lot}
                            eventTitle={lot.event_title}
                            eventStatus={lot.event_status || 'RECEIVED'}
                            eventStartTime={lot.event_start_time ?? lot.start_date}
                            eventEndTime={lot.event_end_time ?? lot.end_date ?? lot.end_time}
                            showListingStatus
                            subCaption={bookedInCaption(lot)}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
                {!search.trim() && totalPages > 1 && (
                  <div className="admin-event-lots__pagination">
                    <button
                      type="button"
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
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      aria-label="Next page"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
