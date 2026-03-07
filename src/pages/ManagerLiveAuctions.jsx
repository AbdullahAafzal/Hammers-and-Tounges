import React, { useState, useMemo, useEffect } from "react";
import "./ManagerLiveAuctions.css";
import { useNavigate } from "react-router-dom";
import { auctionService } from '../services/interceptors/auction.service';

const ROWS_PER_PAGE = 5;

const formatEventDate = (isoStr) => {
  if (!isoStr) return '—';
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-US', {
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

export default function ManagerLiveAuctions() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await auctionService.getEvents({ page: 1 });
      const allEvents = response?.results ?? (Array.isArray(response) ? response : []);
      const closedEvents = allEvents.filter(
        (e) => (e.status || '').toUpperCase() === 'CLOSED'
      );
      setEvents(closedEvents);
    } catch (err) {
      console.error('Error fetching completed auctions:', err);
      setError(err.message || 'Failed to load completed auctions. Please try again.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredData = useMemo(() => {
    return events.filter((item) => {
      const title = (item.title || '').toLowerCase();
      const matchSearch = !search || title.includes(search.toLowerCase());
      return matchSearch;
    });
  }, [events, search]);

  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * ROWS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [filteredData, page]);

  function generatePageNumbers() {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(page - 1);
        pages.push(page);
        pages.push(page + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  }

  return (
    <div className="live-auction-wrapper">
      <div className="live-auction-container">

        <div className="live-auction-section-header">
          <div className="live-auction-header-content">
            <h1 className="live-auction-page-title">Completed Auctions</h1>
            <p className="live-auction-page-subtitle">View all completed and approved auction items</p>
          </div>
        </div>

        <div className="live-auction-filter-section">
          <div className="live-auction-search-container">
            <div className="live-auction-search-input-wrapper">
              <button className='admin-search-btn'>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <input
                type="text"
                placeholder="Search by event name..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="live-auction-search-input"
              />
              {search && (
                <button
                  className="live-auction-clear-search"
                  onClick={() => { setSearch(''); setPage(1); }}
                  aria-label="Clear search"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <input
            type="date"
            value={date}
            onChange={(e) => { setDate(e.target.value); setPage(1); }}
            className="live-auction-date-input"
          />
        </div>

        {/* TABLE */}
        <div className="live-auction-data-table-section">
          <div className="live-auction-table-wrapper">
            <table className="live-auction-data-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Status</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5">
                      <div className="live-auction-empty-state">
                        <div className="live-auction-empty-icon" style={{ animation: 'spin 1s linear infinite' }}>
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="32" strokeDashoffset="16" opacity="0.3" />
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="32" strokeDashoffset="16" className="spinner-circle" />
                          </svg>
                        </div>
                        <h3>Loading completed auctions...</h3>
                        <p>Please wait while we fetch your completed auctions</p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5">
                      <div className="live-auction-empty-state">
                        <div className="live-auction-empty-icon">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </div>
                        <h3>Error loading completed auctions</h3>
                        <p>{error}</p>
                        <button
                          onClick={() => fetchEvents()}
                          className="live-auction-export-btn"
                          style={{ marginTop: '1rem' }}
                        >
                          Retry
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((event) => (
                    <tr
                      key={event.id}
                      className="live-auction-table-row"
                      onClick={() => navigate(`/manager/event/${event.id}`, { state: { event } })}
                    >
                      <td>
                        <div>
                          <span className="live-auction-user-name">{event.title || 'Untitled Event'}</span>
                          <span className="live-auction-time" style={{ display: 'block', opacity: 0.8, fontSize: '0.85em' }}>
                            {event.lots_count ?? 0} lots
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="live-auction-status-cell">
                          <span className="live-auction-status-badge badge-winning">
                            {event.status || '—'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="live-auction-time">
                          {formatEventDate(event.start_time)}
                        </span>
                      </td>
                      <td>
                        <span className="live-auction-time">
                          {formatEventDate(event.end_time)}
                        </span>
                      </td>
                      <td>
                        <button
                          className="live-auction-icon-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/manager/event/${event.id}`, { state: { event } });
                          }}
                          title="View Details"
                          aria-label={`View details for ${event.title}`}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" />
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">
                      <div className="live-auction-empty-state">
                        <div className="live-auction-empty-icon">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <h3>No completed auctions found</h3>
                        <p>Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {filteredData.length > ROWS_PER_PAGE && (
            <div className="live-auction-pagination">
              <button
                className="live-auction-pagination-btn live-auction-prev-btn"
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Previous
              </button>

              <div className="live-auction-page-numbers">
                {generatePageNumbers().map((p, index) => (
                  p === '...' ? (
                    <span key={`dots-${index}`} className="live-auction-page-dots">...</span>
                  ) : (
                    <button
                      key={p}
                      className={`live-auction-page-number ${page === p ? 'active' : ''}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  )
                ))}
              </div>

              <button
                className="live-auction-pagination-btn live-auction-next-btn"
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
              >
                Next
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}