import React, { useState } from "react";
import "./AuctionAdminPanel.css";
import "./AdminPanel.css"
import { Link, useNavigate } from "react-router-dom";

export default function AuctionPage() {

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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

  const filteredData = tableData.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container-fluid">

      <div className="row g-3 mb-4 mt-4" >
        <div className="col-md-4">
          <div className="card p-3 shadow dark-card" style={{backgroundColor:"black"}}>
            <p className="text-secondary mb-1">Active Bidders</p>
            <h2>1,204</h2>
            <small className="text-success">+5.2% vs last period</small>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 shadow dark-card"style={{backgroundColor:"black"}}>
            <p className="text-secondary mb-1">Total Lots</p>
            <h2>850</h2>
            <small className="text-success">+1.8% vs last period</small>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 shadow dark-card" style={{backgroundColor:"black"}}>
            <p className="text-secondary mb-1">Live Rooms</p>
            <h2>15</h2>
            <small className="text-success">+2 since yesterday</small>
          </div>
        </div>
      </div>

      <div className="card p-3 dark-card mt-3"style={{backgroundColor:"black"}}>

        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 mt-3">
          <h1 className="mt-2">All Auctions</h1>

          <div className="d-flex flex-wrap gap-2 align-items-center">
            <Link to="/publishnew">
              <button className="createBtn">+ Create New Auction</button>
            </Link>

            <input
              type="text"
              className="form-control bg-dark text-white border-secondary search-input"
              placeholder="Search by Name or ID"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />

            <div className="btn-group ms-2">
              <button className="btn custom-filter-btn">All</button>
              <button className="btn custom-filter-btn">Live</button>
              <button className="btn custom-filter-btn">Upcoming</button>
              <button className="btn custom-filter-btn">Ended</button>
              <button className="btn custom-filter-btn">Draft</button>
            </div>
          </div>
        </div>

        <div className="table-responsive1">
          <table className="table table-dark  align-middle">
            <thead>
              <tr>
                <th>Auction Name / ID</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Lots</th>
                <th>Current Value</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((item, index) => (
                <tr
                  key={index}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/controlpanel")}
                >
                  <td>
                    <strong>{item.name}</strong><br />
                    <small className="text-secondary">{item.id}</small>
                  </td>

                  <td>
                    <span className={`badge 
                      ${item.status === "Live" ? "bg-success" :
                      item.status === "Upcoming" ? "bg-info text-dark" :
                      item.status === "Ended" ? "bg-danger" :
                      "bg-warning text-dark"}
                    `}>
                      {item.status}
                    </span>
                  </td>

                  <td>{item.start}</td>
                  <td>{item.end}</td>
                  <td>{item.lots}</td>
                  <td>{item.value}</td>

                  <td>
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={(e) => { e.stopPropagation(); alert("View clicked"); }}
                    >👁</span>{" "}

                    <span
                      style={{ cursor: "pointer" }}
                      onClick={(e) => { e.stopPropagation(); alert("Edit clicked"); }}
                    >✏️</span>{" "}

                    <span
                      style={{ cursor: "pointer" }}
                      onClick={(e) => { e.stopPropagation(); alert("More clicked"); }}
                    >⋮</span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <small className="text-secondary">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length}
          </small>

          <div className="pagination-bar d-flex gap-2 align-items-center">

            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="btn border rounded px-3"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              i < 3 && (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`btn border rounded px-3 ${currentPage === i + 1 ? "bg-black text-white border-0" : ""}`}
                >
                  {i + 1}
                </button>
              )
            ))}

            {totalPages > 3 && <span className="px-2 text-black">...</span>}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="btn border rounded px-3"
            >
              Next
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
