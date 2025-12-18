import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./UserManagement.css";

const USERS = [
  { name: "John Doe", email: "john.doe@example.com", role: "Administrator", status: "Active", lastLogin: "2024-05-20 10:30 AM" },
  { name: "Jane Smith", email: "jane.smith@example.com", role: "Auctioneer", status: "Active", lastLogin: "2024-05-19 03:45 PM" },
  { name: "Robert Brown", email: "robert.brown@example.com", role: "Standard User", status: "Suspended", lastLogin: "2024-04-30 11:00 AM" },
  { name: "Emily White", email: "emily.white@example.com", role: "Standard User", status: "Inactive", lastLogin: "2023-12-01 08:15 PM" },
  { name: "Alex Green", email: "alex.green@example.com", role: "Auctioneer", status: "Active", lastLogin: "2024-05-21 01:10 PM" },
  { name: "Sarah Lee", email: "sarah.lee@example.com", role: "Administrator", status: "Active", lastLogin: "2024-05-18 09:05 AM" },
];

const ROWS_PER_PAGE = 5;

const UserManagement = () => {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const filteredUsers = useMemo(() => {
    return USERS.filter((user) => {
      const searchableText = `${user.name} ${user.email} ${user.role} ${user.status} ${user.lastLogin}`.toLowerCase();
      const matchesSearch = searchableText.includes(search.toLowerCase());
      const matchesRole = role === "All" || user.role === role;
      return matchesSearch && matchesRole;
    });
  }, [search, role]);

  const totalPages = Math.ceil(filteredUsers.length / ROWS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  return (
    <div className="user-page">
      <header className="page-header1">
        <h1 className="titlepage">User Management</h1>
        <p className="desctitle">Manage all users on the Hammers & Tongues platform.</p>
      </header>

      <div className="filters-row2">
        <input
          type="text"
          className="search-input2"
          placeholder=" 🔍 Search by name, email, role or status..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="role-filter2"
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
        >
          <option>All</option>
          <option>Administrator</option>
          <option>Auctioneer</option>
          <option>Standard User</option>
        </select>
      </div>

      <div className="table-container2">
        <table>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedUsers.map((user, i) => (
              <tr key={i}>
                <td
                  className="name-cell2"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/kycverification")}
                >
                  {user.name}
                </td>
                <td
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/kycverification")}
                >
                  {user.email}
                </td>
                <td
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/kycverification")}
                >
                  {user.role}
                </td>
                <td
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/kycverification")}
                >
                  <span className={`status ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </td>
                <td
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/kycverification")}
                >
                  {user.lastLogin}
                </td>

                <td className="actions2">•••</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Updated Pagination */}
        {filteredUsers.length > 0 && (
          <div className="table-pagination">
            <div className="pagination-info">
              Page {page} of {totalPages}
            </div>

            <div className="pagination-controls">
              <button
                className="pagination-btn prev"
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>

              <div className="page-numbers">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`page-number ${page === i + 1 ? "active" : ""}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                className="pagination-btn next"
                onClick={() => setPage(p => p + 1)}
                disabled={page === totalPages}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
