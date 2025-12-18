import React, { useState, useMemo } from 'react';
import "./Reports.css";
import { toast } from "react-toastify";

const sampleData = [
  { id: "AS-72384", asset: "2021 Toyota Hilux 2.8 GD-6", officer: "John Doe", status: "Approved", date: "2024-07-15 14:30", notes: "All checks passed. Minor scratches found on rear left door." },
  { id: "AS-72381", asset: "CAT 320D Excavator", officer: "Jane Smith", status: "Rejected", date: "2024-07-18 07:28", notes: "Engine failure during startup test. Requires full mechanical inspection." },
  { id: "AS-72375", asset: "Industrial Grade Compressor", officer: "John Doe", status: "Pending", date: "2024-07-20 09:14", notes: "Awaiting senior officer sign-off before approval." },
  { id: "AS-72370", asset: "Office Furniture Lot 52", officer: "Mike Ross", status: "Approved", date: "2024-07-27 11:22", notes: "Condition as described. Photos match uploaded documentation." },
  { id: "AS-72366", asset: "Set of 4 Alloy Rims", officer: "Jane Smith", status: "Approved", date: "2024-07-29 08:19", notes: "Passed visual inspection. No cracks or dents detected." },
  { id: "AS-72385", asset: "Generator 5KVA", officer: "Mike Ross", status: "Pending", date: "2024-08-01 10:00", notes: "Fuel system check remaining." },
  { id: "AS-72386", asset: "Forklift Heavy Duty", officer: "John Doe", status: "Approved", date: "2024-08-05 16:45", notes: "Hydraulic system stable." },
  { id: "AS-72387", asset: "Security Cameras Pack", officer: "Jane Smith", status: "Approved", date: "2024-08-10 13:15", notes: "Installation verified." },
  { id: "AS-72388", asset: "Dell Workstation PC", officer: "Mike Ross", status: "Rejected", date: "2024-08-15 09:50", notes: "Motherboard issue." },
  { id: "AS-72389", asset: "Solar Panel Lot", officer: "John Doe", status: "Pending", date: "2024-08-22 12:40", notes: "Performance report awaited." }
];

function Report() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [officer, setOfficer] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);

  const itemsPerPage = 5;

  const sortedData = useMemo(() => {
    return [...sampleData].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, []);

  const filtered = useMemo(() => {
    return sortedData.filter(item => {
      const matchSearch =
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.asset.toLowerCase().includes(search.toLowerCase());
      const matchStatus = status === "All" || item.status === status;
      const matchOfficer = officer === "All" || item.officer === officer;
      return matchSearch && matchStatus && matchOfficer;
    });
  }, [search, status, officer, sortedData]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const getAssetIcon = (asset) => {
    if (asset.toLowerCase().includes('toyota') || asset.toLowerCase().includes('vehicle')) return '🚗';
    if (asset.toLowerCase().includes('excavator') || asset.toLowerCase().includes('forklift')) return '🚧';
    if (asset.toLowerCase().includes('compressor') || asset.toLowerCase().includes('generator')) return '⚙️';
    if (asset.toLowerCase().includes('furniture')) return '🪑';
    if (asset.toLowerCase().includes('rims') || asset.toLowerCase().includes('alloy')) return '⚙️';
    if (asset.toLowerCase().includes('camera') || asset.toLowerCase().includes('security')) return '📹';
    if (asset.toLowerCase().includes('pc') || asset.toLowerCase().includes('workstation')) return '💻';
    if (asset.toLowerCase().includes('solar') || asset.toLowerCase().includes('panel')) return '☀️';
    return '📦';
  };

  return (
    <div className="reports-wrapper">
      <div className="reports-container">
        
        <div className="reports-section-header">
          <div className="reports-header-content">
            <h1 className="reports-page-title">Inspection History Log</h1>
            <p className="reports-page-subtitle">View and manage all completed inspection reports</p>
          </div>
        </div>

        {/* FILTER SECTION */}
        <div className="reports-filter-section">
          <div className="reports-search-container">
            <div className="reports-search-input-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search inspections..."
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                className="reports-search-input"
              />
              {search && (
                <button
                  className="reports-clear-search"
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

          <select className="reports-filter-select" value={status} onChange={e => { setStatus(e.target.value); setCurrentPage(1); }}>
            <option value="All">All Status</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Pending">Pending</option>
          </select>

          <select className="reports-filter-select" value={officer} onChange={e => { setOfficer(e.target.value); setCurrentPage(1); }}>
            <option value="All">All Officers</option>
            <option value="John Doe">John Doe</option>
            <option value="Jane Smith">Jane Smith</option>
            <option value="Mike Ross">Mike Ross</option>
          </select>

          <button onClick={() => setCurrentPage(1)} className="reports-apply-btn">Apply</button>
          <button onClick={() => { setSearch(""); setStatus("All"); setOfficer("All"); setCurrentPage(1); }} className="reports-clear-btn">Clear</button>
        </div>

        {/* TABLE */}
        <div className="reports-data-table-section">
          <div className="reports-table-wrapper">
            <table className="reports-data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item ID</th>
                  <th>Item Category</th>
                  <th>Date & Time</th>
                  <th>Auction Officer</th>
                  <th>Status</th>
                  <th>Decision Comments</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((item, index) => (
                    <tr
                      key={item.id + index}
                      className={`reports-table-row ${selectedRow === item.id ? "row-selected" : ""}`}
                      onClick={() => setSelectedRow(item.id)}
                    >
                      <td>
                        <span className={`reports-row-number ${selectedRow === item.id ? "bold-number" : ""}`}>
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </span>
                      </td>

                      <td>
                        <span className="reports-item-id">{item.id}</span>
                      </td>

                      <td>
                        <div className="reports-asset-info">
                          <div className="reports-asset-icon-cell">
                            <span className="reports-asset-icon-emoji">{getAssetIcon(item.asset)}</span>
                          </div>
                          <span className="reports-asset-name">{item.asset}</span>
                        </div>
                      </td>

                      <td>
                        <span className="reports-date-time">{item.date}</span>
                      </td>

                      <td>
                        <span className="reports-officer-name">{item.officer}</span>
                      </td>

                      <td>
                        <div className="reports-status-cell">
                          <span className={`reports-status-badge ${
                            item.status === "Approved" ? "badge-approved" :
                            item.status === "Rejected" ? "badge-rejected" : 
                            item.status === "Pending" ? "badge-pending" : ""
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="reports-notes-cell">
                          <p className="reports-notes-text">{item.notes}</p>
                        </div>
                      </td>

                      <td>
                        <div className="reports-action-buttons">
                          <button
                            className="reports-view-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.info(item.notes, {
                                position: "top-center",
                                autoClose: 4000,
                                closeButton: true,
                                pauseOnHover: true,
                                draggable: false,
                                style: { fontSize: "16px", padding: "20px", textAlign: "center" }
                              });
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">
                      <div className="reports-empty-state">
                        <div className="reports-empty-icon">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <h3>No records found</h3>
                        <p>Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {filtered.length > itemsPerPage && (
            <div className="reports-pagination">
              <button
                className="reports-pagination-btn reports-prev-btn"
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 1}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Previous
              </button>

              <div className="reports-page-numbers">
                {generatePageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={`dots-${index}`} className="reports-page-dots">...</span>
                  ) : (
                    <button
                      key={page}
                      className={`reports-page-number ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  )
                ))}
              </div>

              <button
                className="reports-pagination-btn reports-next-btn"
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

export default Report;