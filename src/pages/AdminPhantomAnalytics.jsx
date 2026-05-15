import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminService } from '../services/interceptors/admin.service';
import { formatBidDateTime } from '../utils/formatBidDateTime';
import {
  maxPhantomBidAmount,
  normalizePhantomReport,
  sumPhantomBidCount,
} from '../utils/phantomAnalytics';
import './AdminPhantomAnalytics.css';

const formatMoney = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const parseErrorMessage = (err) => {
  const d = err?.response?.data;
  if (typeof d === 'string') return d;
  if (d?.detail) {
    return Array.isArray(d.detail) ? d.detail.map((x) => x?.msg || x).join(' ') : String(d.detail);
  }
  if (d?.message) return String(d.message);
  if (err?.message) return err.message;
  return 'Unable to load phantom analytics.';
};

function LotCard({ lot }) {
  const bids = Array.isArray(lot?.bids) ? lot.bids : [];

  return (
    <article className="phantom-analytics__lot">
      <header className="phantom-analytics__lot-header">
        <div>
          <h3 className="phantom-analytics__lot-title">{lot.lot_title || `Lot #${lot.lot_id}`}</h3>
          <div className="phantom-analytics__lot-meta">
            <span className="phantom-analytics__chip">Lot #{lot.lot_id}</span>
            {lot.event_id != null ? (
              <span className="phantom-analytics__chip phantom-analytics__chip--muted">
                Event #{lot.event_id}
              </span>
            ) : null}
          </div>
        </div>
        <div className="phantom-analytics__lot-metrics">
          <div>
            <div className="phantom-analytics__metric-label">Phantom bids</div>
            <div className="phantom-analytics__metric-value">{lot.phantom_bid_count ?? bids.length}</div>
          </div>
          <div>
            <div className="phantom-analytics__metric-label">Highest</div>
            <div className="phantom-analytics__metric-value phantom-analytics__stat-value--accent">
              {formatMoney(lot.highest_phantom_bid)}
            </div>
          </div>
        </div>
      </header>

      {bids.length > 0 ? (
        <div className="phantom-analytics__table-wrap">
          <table className="phantom-analytics__table">
            <thead>
              <tr>
                <th>Bid ID</th>
                <th>Amount</th>
                <th>Placed at</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid) => (
                <tr key={bid.bid_id ?? `${bid.amount}-${bid.created_at}`}>
                  <td>#{bid.bid_id ?? '—'}</td>
                  <td className="phantom-analytics__amount">{formatMoney(bid.amount)}</td>
                  <td>{formatBidDateTime(bid.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="phantom-analytics__state" style={{ border: 'none', padding: '1.25rem' }}>
          No phantom bids recorded for this lot.
        </div>
      )}
    </article>
  );
}

function AdminPhantomAnalytics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const lotFromUrl = searchParams.get('lot_id') || '';
  const [lotInput, setLotInput] = useState(lotFromUrl);
  const [activeLotId, setActiveLotId] = useState(lotFromUrl);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (lotId) => {
    setError(null);
    setLoading(true);
    try {
      const res = await adminService.getPhantomBidsReport(lotId || undefined);
      setData(res);
    } catch (e) {
      setError(parseErrorMessage(e));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLotInput(lotFromUrl);
    setActiveLotId(lotFromUrl);
  }, [lotFromUrl]);

  useEffect(() => {
    load(activeLotId);
  }, [activeLotId, load]);

  const { totalLots, lots, isSingleLot } = useMemo(() => normalizePhantomReport(data), [data]);
  const totalPhantomBids = useMemo(() => sumPhantomBidCount(lots), [lots]);
  const peakPhantomBid = useMemo(() => maxPhantomBidAmount(lots), [lots]);

  const applyLotFilter = () => {
    const trimmed = lotInput.trim();
    setActiveLotId(trimmed);
    if (trimmed) {
      setSearchParams({ lot_id: trimmed });
    } else {
      setSearchParams({});
    }
  };

  const clearLotFilter = () => {
    setLotInput('');
    setActiveLotId('');
    setSearchParams({});
  };

  return (
    <div className="phantom-analytics">
      <main className="phantom-analytics__main">
        <header className="phantom-analytics__hero">
          <div className="phantom-analytics__hero-content">
            <div className="phantom-analytics__eyebrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 10h.01M15 10h.01M12 2a8 8 0 0 0-8 8v4l-2 2h20l-2-2v-4a8 8 0 0 0-8-8z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Admin audit
            </div>
            <h1 className="phantom-analytics__title">Phantom Analytics</h1>
            <p className="phantom-analytics__subtitle">
              Detailed phantom bidding audit across all lots, or drill into a single lot by ID.
            </p>
          </div>
        </header>

        <div className="phantom-analytics__toolbar">
          <div className="phantom-analytics__filter">
            <label htmlFor="phantom-lot-id">Filter by lot ID (optional)</label>
            <input
              id="phantom-lot-id"
              type="number"
              min="1"
              placeholder="e.g. 16"
              value={lotInput}
              onChange={(e) => setLotInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') applyLotFilter();
              }}
            />
          </div>
          <div className="phantom-analytics__actions">
            <button type="button" className="phantom-analytics__btn phantom-analytics__btn--primary" onClick={applyLotFilter}>
              {activeLotId ? 'View lot audit' : 'Load all lots'}
            </button>
            {activeLotId ? (
              <button type="button" className="phantom-analytics__btn phantom-analytics__btn--ghost" onClick={clearLotFilter}>
                Clear filter
              </button>
            ) : null}
            <button
              type="button"
              className="phantom-analytics__btn phantom-analytics__btn--ghost"
              onClick={() => load(activeLotId)}
              disabled={loading}
            >
              Refresh
            </button>
          </div>
        </div>

        {!loading && !error ? (
          <div className="phantom-analytics__stats">
            <div className="phantom-analytics__stat">
              <div className="phantom-analytics__stat-label">
                {isSingleLot ? 'Filtered lot' : 'Lots with phantom activity'}
              </div>
              <div className="phantom-analytics__stat-value">{totalLots}</div>
            </div>
            <div className="phantom-analytics__stat">
              <div className="phantom-analytics__stat-label">Total phantom bids</div>
              <div className="phantom-analytics__stat-value">{totalPhantomBids}</div>
            </div>
            <div className="phantom-analytics__stat">
              <div className="phantom-analytics__stat-label">Peak phantom bid</div>
              <div className="phantom-analytics__stat-value phantom-analytics__stat-value--accent">
                {formatMoney(peakPhantomBid)}
              </div>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="phantom-analytics__state">
            <div className="phantom-analytics__spinner" />
            <p>Loading phantom analytics…</p>
          </div>
        ) : null}

        {!loading && error ? (
          <div className="phantom-analytics__state phantom-analytics__state--error">
            <p>{error}</p>
            <button type="button" className="phantom-analytics__btn phantom-analytics__btn--primary" onClick={() => load(activeLotId)}>
              Retry
            </button>
          </div>
        ) : null}

        {!loading && !error && lots.length === 0 ? (
          <div className="phantom-analytics__state">
            <p>No phantom bidding activity found{activeLotId ? ` for lot #${activeLotId}` : ''}.</p>
          </div>
        ) : null}

        {!loading && !error && lots.length > 0 ? (
          <div className="phantom-analytics__lots">
            {lots.map((lot) => (
              <LotCard key={lot.lot_id ?? lot.lot_title} lot={lot} />
            ))}
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default AdminPhantomAnalytics;
