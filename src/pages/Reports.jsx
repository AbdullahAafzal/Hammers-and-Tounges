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

  const generatePageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i <= 3 || i === totalPages) pages.push(i);
      else if (i === 4 && totalPages > 4) pages.push("...");
    }
    return pages;
  };

  return (
    <div className="admin-wrapper">
      <h2 className="inspection-title">Inspection History Log</h2>

      <div className="filter-bar-container">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search inspections"
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
        />

        <select className="filter-select" value={status} onChange={e => { setStatus(e.target.value); setCurrentPage(1); }}>
          <option value="All">All Status</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Pending">Pending</option>
        </select>

        <select className="filter-select" value={officer} onChange={e => { setOfficer(e.target.value); setCurrentPage(1); }}>
          <option value="All">All Officers</option>
          <option value="John Doe">John Doe</option>
          <option value="Jane Smith">Jane Smith</option>
          <option value="Mike Ross">Mike Ross</option>
        </select>

        <button onClick={() => setCurrentPage(1)} className="apply-btn">Apply</button>
        <button onClick={() => { setSearch(""); setStatus("All"); setOfficer("All"); setCurrentPage(1); }} className="clear-btn">Clear</button>
      </div>

      <div className="table-container">
        <table className="inspection-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item ID</th>
              <th>Item Category</th>
              <th>Date & Time</th>
              <th>Auction Officer</th>
              <th className="text-center">Status</th>
              <th>Decision Comments</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr
                  key={item.id + index}
                  className={selectedRow === item.id ? "row-selected" : ""}
                  onClick={() => setSelectedRow(item.id)}
                >
                  <td className={selectedRow === item.id ? "bold-number" : ""}>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td>{item.id}</td>
                  <td>{item.asset}</td>
                  <td>{item.date}</td>
                  <td>{item.officer}</td>
                  <td className="text-center">
                    <span className={`badge-custom ${
                      item.status === "Approved" ? "badge-approved" :
                      item.status === "Rejected" ? "badge-rejected" : 
                      item.status === "Pending" ? "badge-pending1" : ""
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td>{item.notes}</td>
                  <td className="text-center">
                    <button
                      className="view-btn"
                      onClick={() =>
                        toast.info(item.notes, {
                          position: "top-center",
                          autoClose: 4000,
                          closeButton: true,
                          pauseOnHover: true,
                          draggable: false,
                          style: { fontSize: "16px", padding: "20px", textAlign: "center" }
                        })
                      }
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-3">No record found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Updated Pagination */}
      {filtered.length > 0 && (
        <div className="table-pagination">
          <div className="pagination-info">
            Page {currentPage} of {totalPages}
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn prev"
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="page-numbers">
              {generatePageNumbers().map((page, index) =>
                page === '...' ? (
                  <span key={`dots-${index}`} className="page-dots">...</span>
                ) : (
                  <button
                    key={page}
                    className={`page-number ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              className="pagination-btn next"
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Report;
