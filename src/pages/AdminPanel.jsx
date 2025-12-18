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
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
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

  return (
    <>
      <div className="admin-wrapper">

        <h2 className="inspection-title">Inspection Queue</h2>
        <h5 className="inspection-para">Manage and track all items pending inspections.</h5>

        {/* FILTER BAR SECTION */}
        <div className="filter-bar-container">

          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search by Item ID or Seller..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select className="filter-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Vehicle">Vehicle</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Artwork">Artwork</option>
            <option value="Home Goods">Home Goods</option>
          </select>

          <select className="filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Pending Inspection">Pending Inspection</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <button onClick={applyFilters} className="apply-btn">Apply</button>

          <button onClick={() => { setCategory("All"); setStatus("All"); applyFilters(); }} className="clear-btn">
            Clear
          </button>

        </div>

        {/* TABLE */}
        <div className="table-container">
          <table className="inspection-table">
            <thead className="table-dark">
              <tr>
                <th>#</th> 
                <th>Item ID</th>
                <th>Item Category</th>
                <th>Seller</th>
                <th className="text-center">Status</th>
                <th>Assigned Officer</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((item, index) => (
                <tr
                  key={item.id}
                  className={selectedRow === item.id ? "row-selected" : ""}
                  onClick={() => setSelectedRow(item.id)}
                >
                  <td className={selectedRow === item.id ? "bold-number" : ""}>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>

                  <td>{item.id}</td>
                  <td>{item.category}</td>
                  <td>{item.seller}</td>

                  <td className="text-center">
                    <span className={`badge-custom1 ${
                      item.status === "Pending Inspection" ? "badge-pending" :
                      item.status === "In Progress" ? "badge-inprogress" :
                      item.status === "Completed" ? "badge-completed" : ""
                    }`}>
                    {item.status}
                    </span>
                  </td>

                  <td>{item.officer}</td>

                  <td className="text-center">
                    <ActionButton status={item.status} />
                  </td>

                </tr>
              ))}

              {paginatedData.length === 0 && (
                <tr><td colSpan="7" className="text-center p-3">No record found</td></tr>
              )}

            </tbody>
          </table>
        </div>

        {/* NEW PAGINATION SYSTEM */}
        {filtered.length > 0 && (
          <div className="table-pagination">

            <div className="pagination-info">
              Page {currentPage} of {totalPages}
            </div>

            <div className="pagination-controls">

              <button 
                className="pagination-btn prev"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <div className="page-numbers">
                {generatePageNumbers().map((page, index) => (
                  page === "..."
                  ? <span key={index} className="page-dots">...</span>
                  : (
                      <button
                        key={page}
                        className={`page-number ${currentPage === page ? "active" : ""}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    )
                ))}
              </div>

              <button 
                className="pagination-btn next"
                onClick={() => setCurrentPage(currentPage + 1)}
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
    </>
  )
}

export default AdminPanel;
