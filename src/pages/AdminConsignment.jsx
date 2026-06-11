import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { auctionService } from '../services/interceptors/auction.service';
import { canViewConsignmentTab } from '../utils/financeAccess';
import LotRow from '../components/LotRow';
import GuestLotDrawer from '../components/GuestLotDrawer';
import './adminDashboard/AdminEventLots.css';
import './adminDashboard/AdminGoodsReceivedVerification.css';
import './GuestEventLots.css';

const PAGE_SIZE = 12;

const formatBookedIn = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
};

const AdminConsignment = ({ isManagerFlow = false }) => {
  const location = useLocation();
  const authUser = useSelector((state) => state.auth?.user);
  const canView = canViewConsignmentTab(authUser, { isManagerFlow });

  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedLot, setSelectedLot] = useState(null);

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
      console.log('Consignment lots (RECEIVED):', res);
      setLots(res.results || []);
      setTotalCount(res.count ?? res.results?.length ?? 0);
    } catch (err) {
      console.log('Consignment lots (RECEIVED) error:', err);
      const msg = err?.message || 'Failed to load consignment lots';
      setError(msg);
      setLots([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!canView) return;
    setPage(1);
    fetchLots(1);
  }, [canView, fetchLots, location.pathname, location.state?.refreshAt]);

  useEffect(() => {
    if (!canView || page === 1) return;
    fetchLots(page);
  }, [canView, fetchLots, page]);

  const filteredLots = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return lots;
    return lots.filter((lot) => {
      const title = String(lot?.title || '').toLowerCase();
      const seller = String(lot?.seller_name || '').toLowerCase();
      const ev = String(lot?.event_title || '').toLowerCase();
      const id = String(lot?.id ?? '');
      const lotNo = String(lot?.lot_number ?? '');
      return title.includes(q) || seller.includes(q) || ev.includes(q) || id.includes(q) || lotNo.includes(q);
    });
  }, [lots, search]);

  if (!canView) {
    const redirectTo = isManagerFlow ? '/manager/dashboard' : '/admin/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  const newIntakePath = isManagerFlow ? '/manager/consignment/new' : '/admin/consignment/new';

  const bookedInCaption = (lot) => {
    const booked = formatBookedIn(lot.booked_in_date);
    if (booked) return `Booked in: ${booked}`;
    if (lot.seller_name) return `Seller: ${lot.seller_name}`;
    return null;
  };

  return (
    <div
      className={`admin-event-lots admin-grv-page ${selectedLot ? 'admin-event-lots--drawer-open' : ''}`}
    >
      <header className="admin-event-lots__header">
        <div className="admin-event-lots__header-content">
          <div className="admin-event-lots__header-title-row">
            <h1 className="admin-event-lots__title">Consignment</h1>
            <span className="admin-event-lots__header-status admin-event-lots__header-status--draft">
              Received
            </span>
          </div>
          <p className="admin-event-lots__subtitle">
            {totalCount} received lot{totalCount !== 1 ? 's' : ''} awaiting processing
          </p>
        </div>
        <div className="admin-event-lots__header-actions">
          <Link to={newIntakePath} className="admin-event-lots__create-lot">
            + Create new
          </Link>
        </div>
      </header>

      <main className="admin-event-lots__main">
        {loading && lots.length === 0 ? (
          <div className="admin-event-lots__loading">
            <div className="admin-event-lots__spinner" />
            <p>Loading lots…</p>
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
                  aria-label="Search consignment lots"
                />
                {filteredLots.length === 0 ? (
                  <div className="admin-event-lots__empty">
                    <p>{lots.length === 0 ? 'No received lots found.' : 'No lots match your search.'}</p>
                  </div>
                ) : (
                  <div className="guest-event-lots__list admin-grv-lot-list">
                    {filteredLots.map((lot) => (
                      <LotRow
                        key={lot.id}
                        lot={lot}
                        eventTitle={lot.event_title}
                        eventStatus={lot.event_status || 'RECEIVED'}
                        eventStartTime={lot.event_start_time ?? lot.start_date}
                        eventEndTime={lot.event_end_time ?? lot.end_date ?? lot.end_time}
                        showListingStatus
                        subCaption={bookedInCaption(lot)}
                        onOpenDetail={setSelectedLot}
                      />
                    ))}
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

      {selectedLot && (
        <GuestLotDrawer
          lot={selectedLot}
          eventStartTime={selectedLot.event_start_time ?? selectedLot.start_date}
          eventEndTime={selectedLot.event_end_time ?? selectedLot.end_date ?? selectedLot.end_time}
          eventTitle={selectedLot.event_title || 'Consignment'}
          eventId={selectedLot.auction_event ?? selectedLot.event}
          eventStatus={selectedLot.event_status || selectedLot.status}
          onClose={() => setSelectedLot(null)}
          isAdmin={!isManagerFlow}
          isManager={isManagerFlow}
          isConsignment
          isManagerFlow={isManagerFlow}
          onLotUpdated={() => fetchLots(page)}
        />
      )}
    </div>
  );
};

export default AdminConsignment;
