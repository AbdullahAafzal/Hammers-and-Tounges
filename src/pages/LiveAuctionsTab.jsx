import React, { useState, useMemo } from "react";
import "./LiveAuctionsTab.css";
import { useNavigate } from "react-router-dom";

const SAMPLE_DATA = [
  { id: "BID-1001", user: "Ali Khan", amount: 1200, time: "2023-10-25 10:45 AM", status: "Winning" },
  { id: "BID-1002", user: "Sara Ahmed", amount: 1350, time: "2023-10-25 10:50 AM", status: "Outbid" },
  { id: "BID-1003", user: "Usman Tariq", amount: 1500, time: "2023-10-25 10:55 AM", status: "Winning" },
  { id: "BID-1004", user: "Hassan Raza", amount: 1100, time: "2023-10-25 11:00 AM", status: "Outbid" },
  { id: "BID-1005", user: "Ayesha Noor", amount: 1600, time: "2023-10-25 11:05 AM", status: "Winning" },
  { id: "BID-1006", user: "Bilal Khan", amount: 1250, time: "2023-10-25 11:10 AM", status: "Winning" },
  { id: "BID-1007", user: "Nida Ali", amount: 1400, time: "2023-10-25 11:15 AM", status: "Outbid" },
  { id: "BID-1008", user: "Omar Farooq", amount: 1550, time: "2023-10-25 11:20 AM", status: "Winning" },
  { id: "BID-1009", user: "Sara Khan", amount: 1150, time: "2023-10-25 11:25 AM", status: "Outbid" },
  { id: "BID-1010", user: "Ayesha Farooq", amount: 1650, time: "2023-10-25 11:30 AM", status: "Winning" },
  { id: "BID-1011", user: "Ahmed Ali", amount: 1750, time: "2023-10-25 11:35 AM", status: "Winning" },
  { id: "BID-1012", user: "Fatima Khan", amount: 1200, time: "2023-10-25 11:40 AM", status: "Outbid" },
];

const ROWS_PER_PAGE = 5;

export default function LiveAuctionsTab() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // Filtered data
  const filteredData = useMemo(() => {
    return SAMPLE_DATA.filter((item) => {
      const matchSearch = item.user.toLowerCase().includes(search.toLowerCase()) ||
                          item.id.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
  }, [search]);

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

  const exportCSV = () => {
    const headers = ["Bid ID", "User", "Bid Amount", "Time Stamp", "Status"];
    const rows = filteredData.map(item => [
      item.id,
      item.user,
      item.amount,
      item.time,
      item.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = csvContent;
    link.download = "bid_logs.csv";
    link.click();
  };

  return (
    <div className="live-auction-wrapper">
      <div className="live-auction-container">
        
        <div className="live-auction-breadcrumb">
          <p className="breadcrumb-text">Auctions / Vintage Collectibles / Vintage Rolex Submariner / Logs</p>
        </div>

        <div className="live-auction-section-header">
          <div className="live-auction-header-content">
            <h1 className="live-auction-page-title">Bid Logs</h1>
            <p className="live-auction-page-subtitle">Vintage Rolex Submariner - Auction #5821</p>
          </div>
          <div className="live-auction-header-actions">
            <button className="live-auction-export-btn" onClick={exportCSV}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Export as CSV
            </button>
          </div>
        </div>

        {/* FILTER SECTION */}
        <div className="live-auction-filter-section">
          <div className="live-auction-search-container">
            <div className="live-auction-search-input-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search by users or Bid ID..."
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
                  <th>#</th>
                  <th>Bid ID</th>
                  <th>User</th>
                  <th>Bid Amount</th>
                  <th>Time Stamp</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((item, index) => (
                    <tr
                      key={item.id}
                      className="live-auction-table-row"
                      onClick={() => navigate("/AdminAuctionResults")}
                    >
                      <td>
                        <span className="live-auction-row-number">
                          {(page - 1) * ROWS_PER_PAGE + index + 1}
                        </span>
                      </td>

                      <td>
                        <span className="live-auction-bid-id">{item.id}</span>
                      </td>

                      <td>
                        <span className="live-auction-user-name">{item.user}</span>
                      </td>

                      <td>
                        <span className="live-auction-amount">${item.amount.toLocaleString()}</span>
                      </td>

                      <td>
                        <span className="live-auction-time">{item.time}</span>
                      </td>

                      <td>
                        <div className="live-auction-status-cell">
                          <span className={`live-auction-status-badge ${
                            item.status === "Winning" ? "badge-winning" :
                            item.status === "Outbid" ? "badge-outbid" :
                            "badge-ended"
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      <div className="live-auction-empty-state">
                        <div className="live-auction-empty-icon">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <h3>No bids found</h3>
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
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}