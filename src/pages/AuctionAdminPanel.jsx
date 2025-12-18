import React, { useState } from "react";
import "./AuctionAdminPanel.css";
import { Link, useNavigate } from "react-router-dom";

export default function AuctionPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("All");
  const itemsPerPage = 5;

  const tableData = [
    { name: "Vintage Watch Collection", id: "#VW-10234", status: "Live", start: "Oct 25, 2023", end: "Nov 01, 2023", lots: 45, value: "$15,420" },
    { name: "Modern Art & Sculptures", id: "#MA-98765", status: "Upcoming", start: "Nov 05, 2023", end: "Nov 12, 2023", lots: 82, value: "$0.00" },
    { name: "Estate Jewelry Clearance", id: "#EJ-45678", status: "Ended", start: "Oct 10, 2023", end: "Oct 17, 2023", lots: 120, value: "$48,950" },
    { name: "Antique Furniture Finds", id: "#AF-33211", status: "Draft", start: "-", end: "-", lots: 35, value: "-" },
    { name: "Luxury Cars Auction", id: "#LC-11223", status: "Live", start: "Oct 12, 2023", end: "Oct 20, 2023", lots: 60, value: "$22,300" },
    { name: "Rare Books Lot", id: "#RB-65432", status: "Upcoming", start: "Dec 01, 2023", end: "Dec 10, 2023", lots: 90, value: "$0.00" },
    { name: "Vintage Cameras", id: "#VC-90876", status: "Ended", start: "Sep 15, 2023", end: "Sep 20, 2023", lots: 25, value: "$9,500" },
    { name: "Art Statues", id: "#AS-77889", status: "Draft", start: "-", end: "-", lots: 14, value: "-" },
    { name: "Old Coins", id: "#OC-55511", status: "Live", start: "Oct 19, 2023", end: "Oct 22, 2023", lots: 80, value: "$12,100" },
    { name: "Antique Watches", id: "#AW-22445", status: "Upcoming", start: "Nov 15, 2023", end: "Nov 25, 2023", lots: 35, value: "$0.00" },
  ];

  const filteredData = tableData.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === "All" || item.status === activeFilter;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  function generatePageNumbers() {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  }

  const getAuctionIcon = (name) => {
    if (name.toLowerCase().includes('watch')) return '⌚';
    if (name.toLowerCase().includes('art') || name.toLowerCase().includes('sculpture')) return '🎨';
    if (name.toLowerCase().includes('jewelry')) return '💎';
    if (name.toLowerCase().includes('furniture')) return '🪑';
    if (name.toLowerCase().includes('car')) return '🚗';
    if (name.toLowerCase().includes('book')) return '📚';
    if (name.toLowerCase().includes('camera')) return '📷';
    if (name.toLowerCase().includes('coin')) return '🪙';
    return '🏷️';
  };

  return (
    <div className="auction-wrapper">
      <div className="auction-container">
        {/* HEADER SECTION */}
        <div className="auction-section-header">
          <div className="auction-header-content">
            <h1 className="auction-page-title">All Auctions</h1>
            <p className="auction-page-subtitle">Manage and monitor all auction events</p>
          </div>
          <div className="auction-header-actions">
            <Link to="/publishnew" className="auction-primary-action-btn-link">
              <button className="auction-primary-action-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Create New Auction
              </button>
            </Link>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="auction-stats-grid">
          <div className="auction-stat-card">
            <div className="auction-card-bg-gradient" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.05) 100%)' }}></div>
            <div className="auction-card-icon-container">
              <div className="auction-card-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="auction-card-content">
              <span className="auction-card-label">Active Bidders</span>
              <h3 className="auction-card-value">1,204</h3>
              <span className="auction-card-change positive">+5.2% vs last period</span>
            </div>
          </div>

          <div className="auction-stat-card">
            <div className="auction-card-bg-gradient" style={{ background: 'linear-gradient(135deg, rgba(140, 198, 63, 0.2) 0%, rgba(140, 198, 63, 0.05) 100%)' }}></div>
            <div className="auction-card-icon-container">
              <div className="auction-card-icon" style={{ backgroundColor: 'rgba(140, 198, 63, 0.15)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#8CC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="#8CC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="#8CC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="auction-card-content">
              <span className="auction-card-label">Total Lots</span>
              <h3 className="auction-card-value">850</h3>
              <span className="auction-card-change positive">+1.8% vs last period</span>
            </div>
          </div>

          <div className="auction-stat-card">
            <div className="auction-card-bg-gradient" style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(168, 85, 247, 0.05) 100%)' }}></div>
            <div className="auction-card-icon-container">
              <div className="auction-card-icon" style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="7" width="20" height="14" rx="2" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="auction-card-content">
              <span className="auction-card-label">Live Rooms</span>
              <h3 className="auction-card-value">15</h3>
              <span className="auction-card-change positive">+2 since yesterday</span>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER */}
        <div className="auction-filter-section">
          <div className="auction-search-container">
            <div className="auction-search-input-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search by Name or ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="auction-search-input"
              />
              {search && (
                <button
                  className="auction-clear-search"
                  onClick={() => { setSearch(''); setCurrentPage(1); }}
                  aria-label="Clear search"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="auction-filter-buttons">
            {['All', 'Live', 'Upcoming', 'Ended', 'Draft'].map((filter) => (
              <button
                key={filter}
                className={`auction-filter-btn ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => { setActiveFilter(filter); setCurrentPage(1); }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE */}
        <div className="auction-data-table-section">
          <div className="auction-table-info-bar">
            <span className="auction-table-count">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} auctions
            </span>
          </div>
          
          <div className="auction-table-wrapper">
            <table className="auction-data-table">
              <thead>
                <tr>
                  <th className="auction-table-serial">#</th>
                  <th className="auction-table-name">Auction Name / ID</th>
                  <th className="auction-table-status">Status</th>
                  <th className="auction-table-start">Start Date</th>
                  <th className="auction-table-end">End Date</th>
                  <th className="auction-table-lots">Lots</th>
                  <th className="auction-table-value">Current Value</th>
                  <th className="auction-table-actions">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((item, index) => (
                    <tr
                      key={index}
                      className="auction-table-row"
                      onClick={() => navigate("/controlpanel")}
                    >
                      <td className="auction-table-serial">
                        <span className="auction-serial-number">{startIndex + index + 1}</span>
                      </td>

                      <td className="auction-table-name">
                        <div className="auction-name-info">
                          <div className="auction-icon-cell">
                            <span className="auction-icon-emoji">{getAuctionIcon(item.name)}</span>
                          </div>
                          <div className="auction-details">
                            <h4 className="auction-name">{item.name}</h4>
                            <span className="auction-id">{item.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="auction-table-status">
                        <div className="auction-status-cell">
                          <span className={`auction-status-badge ${
                            item.status === "Live" ? "badge-live" :
                            item.status === "Upcoming" ? "badge-upcoming" :
                            item.status === "Ended" ? "badge-ended" :
                            "badge-draft"
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </td>

                      <td className="auction-table-start">
                        <span className="auction-date">{item.start}</span>
                      </td>

                      <td className="auction-table-end">
                        <span className="auction-date">{item.end}</span>
                      </td>

                      <td className="auction-table-lots">
                        <span className="auction-lots">{item.lots}</span>
                      </td>

                      <td className="auction-table-value">
                        <span className="auction-value">{item.value}</span>
                      </td>

                      <td className="auction-table-actions">
                        <div className="auction-action-buttons">
                          <button
                            className="auction-action-btn auction-view-btn"
                            onClick={(e) => { e.stopPropagation(); alert("View clicked"); }}
                            title="View auction"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          <button
                            className="auction-action-btn auction-edit-btn"
                            onClick={(e) => { e.stopPropagation(); alert("Edit clicked"); }}
                            title="Edit auction"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          <button
                            className="auction-action-btn auction-more-btn"
                            onClick={(e) => { e.stopPropagation(); alert("More clicked"); }}
                            title="More options"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <circle cx="12" cy="5" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <circle cx="12" cy="19" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">
                      <div className="auction-empty-state">
                        <div className="auction-empty-icon">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <h3>No auctions found</h3>
                        <p>Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {filteredData.length > itemsPerPage && (
            <div className="auction-pagination">
              <button
                className="auction-pagination-btn auction-prev-btn"
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 1}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Previous
              </button>

              <div className="auction-page-numbers">
                {generatePageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={`dots-${index}`} className="auction-page-dots">...</span>
                  ) : (
                    <button
                      key={page}
                      className={`auction-page-number ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  )
                ))}
              </div>

              <button
                className="auction-pagination-btn auction-next-btn"
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage === totalPages}
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