import React, { useState, useMemo } from 'react';
import { useNavigate } from "react-router-dom";  
import AdminHeader from '../components/AdminHeader';
import "./AdminPanel.css";

const sampleData = [
  { id: "VH-24351", category: "Vehicle", seller: "Johnathan Doe", status: "Pending Inspection", officer: "Walter White", date: "2025-12-01" },
  { id: "EL-98765", category: "Electronics", seller: "James Smith", status: "Pending Inspection", officer: "Jesse Pinkman", date: "2025-12-02" },
  { id: "FN-54321", category: "Furniture", seller: "Mike Ehrmantraut", status: "In Progress", officer: "Walter White", date: "2025-12-03" },
  { id: "AR-88776", category: "Artwork", seller: "Lydia Rodarte", status: "Completed", officer: "Skyler White", date: "2025-12-04" },
  { id: "HG-11223", category: "Home Goods", seller: "Kim Wexler", status: "Pending Inspection", officer: "Unassigned", date: "2025-12-05" },
  { id: "EL-33333", category: "Electronics", seller: "Gus Fring", status: "In Progress", officer: "Walter White", date: "2025-12-05" },
  { id: "VH-55555", category: "Vehicle", seller: "Hank Schrader", status: "Completed", officer: "Walter White", date: "2025-12-05" }
];

function AdminPanel() {

  const navigate = useNavigate(); 

  const handleAction = (status) => {
    if (status === "Pending Inspection" || status === "In Progress") {
      navigate("/inspection");
    } else if (status === "Completed") {
      navigate("/reports");
    }
  };

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
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
        item.seller.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "All" || item.category === category;
      const matchStatus = status === "All" || item.status === status;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [search, category, status, sortedData]);

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

  const ActionButton = ({ status }) => {
    if (status === "Pending Inspection")
      return <button className="view-btn" onClick={() => handleAction(status)}>Start Inspection</button>;

    if (status === "In Progress")
      return <button className="view-btn" onClick={() => handleAction(status)}>Continue</button>;

    if (status === "Completed")
      return <button className="view-btn" onClick={() => handleAction(status)}>View Report</button>;

    return <span className="text-gray-500">—</span>;
  }

  const applyFilters = () => setCurrentPage(1);

  const getCategoryIcon = (category) => {
    const icons = {
      'Vehicle': '🚗',
      'Electronics': '💻',
      'Furniture': '🪑',
      'Artwork': '🎨',
      'Home Goods': '🏠'
    };
    return icons[category] || '📦';
  };

  return (
    <>
      <div className="admin-wrapper">
        <div className="admin-container">
          
          <div className="admin-section-header">
            <div className="admin-header-content">
              <h1 className="admin-page-title">Inspection Queue</h1>
              <p className="admin-page-subtitle">Manage and track all items pending inspections</p>
            </div>
          </div>

          {/* FILTER BAR SECTION */}
          <div className="admin-filter-section">
            <div className="admin-search-container">
              <div className="admin-search-input-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by Item ID or Seller..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="admin-search-input"
                />
                {search && (
                  <button
                    className="admin-clear-search"
                    onClick={() => setSearch('')}
                    aria-label="Clear search"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <select className="admin-filter-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Artwork">Artwork</option>
              <option value="Home Goods">Home Goods</option>
            </select>

            <select className="admin-filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Pending Inspection">Pending Inspection</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <button onClick={applyFilters} className="admin-apply-btn">Apply</button>

            <button onClick={() => { setSearch(''); setCategory("All"); setStatus("All"); applyFilters(); }} className="admin-clear-btn">
              Clear
            </button>
          </div>

          {/* TABLE */}
          <div className="admin-data-table-section">
            <div className="admin-table-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>#</th> 
                    <th>Item ID</th>
                    <th>Item Category</th>
                    <th>Seller</th>
                    <th>Status</th>
                    <th>Assigned Officer</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`admin-table-row ${selectedRow === item.id ? "row-selected" : ""}`}
                        onClick={() => setSelectedRow(item.id)}
                      >
                        <td>
                          <span className={`admin-row-number ${selectedRow === item.id ? "bold-number" : ""}`}>
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </span>
                        </td>

                        <td>
                          <span className="admin-item-id">{item.id}</span>
                        </td>

                        <td>
                          <div className="admin-category-info">
                            <div className="admin-category-icon-cell">
                              <span className="admin-category-icon-emoji">{getCategoryIcon(item.category)}</span>
                            </div>
                            <span className="admin-category-name">{item.category}</span>
                          </div>
                        </td>

                        <td>
                          <span className="admin-seller-name">{item.seller}</span>
                        </td>

                        <td>
                          <div className="admin-status-cell">
                            <span className={`admin-status-badge ${
                              item.status === "Pending Inspection" ? "badge-pending" :
                              item.status === "In Progress" ? "badge-inprogress" :
                              item.status === "Completed" ? "badge-completed" : ""
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span className="admin-officer-name">{item.officer}</span>
                        </td>

                        <td>
                          <div className="admin-action-buttons">
                            <ActionButton status={item.status} />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">
                        <div className="admin-empty-state">
                          <div className="admin-empty-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
              <div className="admin-pagination">
                <button
                  className="admin-pagination-btn admin-prev-btn"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Previous
                </button>

                <div className="admin-page-numbers">
                  {generatePageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`dots-${index}`} className="admin-page-dots">...</span>
                    ) : (
                      <button
                        key={page}
                        className={`admin-page-number ${currentPage === page ? 'active' : ''}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>

                <button
                  className="admin-pagination-btn admin-next-btn"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
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
    </>
  )
}

export default AdminPanel;