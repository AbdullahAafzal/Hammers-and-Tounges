import React, { useState } from "react";
import "./AuctionAdminPanel.css";
import "./AdminPanel.css"

import { Link, useNavigate } from "react-router-dom";
const PaymentsIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6312 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6312 13.6815 18 14.5717 18 15.5C18 16.4283 17.6312 17.3185 16.9749 17.9749C16.3185 18.6312 15.4283 19 14.5 19H6"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      
    />
  </svg>
)

export default function AuctionPage() {

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("All");
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
    (item) => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "All" || item.status === filterStatus;
      return matchSearch && matchStatus;
    }
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container-fluid">

      <div className="row g-3 mb-4 mt-4 cards-row" >
        <div className="col-md-4">
          <div className="card p-3 shadow dark-card" style={{backgroundColor:"black"}}>
            <p className="text-Primary mb-1">Active Bidders</p>
            <h2>{PaymentsIcon}1,204</h2>
            <small className="text-card">+5.2% vs last period</small>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 shadow dark-card" style={{backgroundColor:"black"}}>
            <p className="text-Primary mb-1"> Total Lots</p>
            <h2>{PaymentsIcon}850</h2>
            <small className="text-card">+1.8% vs last period</small>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 shadow dark-card" style={{backgroundColor:"black"}}>
            <p className="text-Primary mb-1">Live Rooms</p>
            <h2>{PaymentsIcon}15</h2>
            <small className="text-card">+2 since yesterday</small>
          </div>
        </div>
      </div>

      <div className="card p-3 dark-card mt-3" style={{backgroundColor:"black"}}>

        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 mt-3 mobile-flex-column">
          <h1 className="mt-2" style={{marginLeft:20}}>All Auctions</h1>

          <div className="d-flex flex-wrap gap-2 align-items-center full-width-mobile">
            <Link to="/publishnew">
              <button className="createBtn full-width-mobile-btn">+ Create New Auction</button>
            </Link>

            <input
              type="text"
              className="form-control bg-dark text-white border-secondary search-input"
              placeholder=" 🔍 Search by Name or ID"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />

            <div className="btn-group ms-2 filter-btn-group">
              <button 
                className={`btn custom-filter-btn ${filterStatus === "All" ? "active" : ""}`}
                onClick={() => { setFilterStatus("All"); setCurrentPage(1); }}
              >
                All
              </button>
              <button 
                className={`btn custom-filter-btn ${filterStatus === "Live" ? "active" : ""}`}
                onClick={() => { setFilterStatus("Live"); setCurrentPage(1); }}
              >
                Live
              </button>
              <button 
                className={`btn custom-filter-btn ${filterStatus === "Upcoming" ? "active" : ""}`}
                onClick={() => { setFilterStatus("Upcoming"); setCurrentPage(1); }}
              >
                Upcoming
              </button>
              <button 
                className={`btn custom-filter-btn ${filterStatus === "Ended" ? "active" : ""}`}
                onClick={() => { setFilterStatus("Ended"); setCurrentPage(1); }}
              >
                Ended
              </button>
              <button 
                className={`btn custom-filter-btn ${filterStatus === "Draft" ? "active" : ""}`}
                onClick={() => { setFilterStatus("Draft"); setCurrentPage(1); }}
              >
                Draft
              </button>
            </div>
          </div>
        </div>

        <div className="table-responsive1">
          <table className="table table-dark align-middle">
            <thead>
              <tr>
                <th>Auction Name / ID</th>
                <th className="text-center">Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th className="text-right">Lots</th>
                <th className="text-right">Current Value</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255, 255, 255, 0.5)', fontStyle: 'italic' }}>
                    No auctions found
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                <tr
                  key={index}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/controlpanel")}
                >
                  <td>
                    <strong>{item.name}</strong><br />
                    <small className="text-secondary">{item.id}</small>
                  </td>

                  <td className="text-center">
                    <span className={`badgecustomadmin 
                      ${item.status === "Live" ? "bg-live" :
                      item.status === "Upcoming" ? "bg-upcoming" :
                      item.status === "Ended" ? "bg-ended" :
                      "bg-draft"
                      }`}>
                      {item.status}
                    </span>
                  </td>

                  <td>{item.start === "-" ? <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontStyle: 'italic' }}>N/A</span> : item.start}</td>
                  <td>{item.end === "-" ? <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontStyle: 'italic' }}>N/A</span> : item.end}</td>
                  <td className="text-right">{item.lots}</td>
                  <td className="text-right">{item.value === "-" ? <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontStyle: 'italic' }}>N/A</span> : item.value}</td>

                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-center mt-3 pagination-bar3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="btn border rounded px-3"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`btn border rounded px-3 ${currentPage === i + 1 ? "active" : ""}`}
            >
              {i + 1}
            </button>
          ))}

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
  );
}
