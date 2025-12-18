import React, { useState, useMemo } from "react";
import "./AdminAuctionResults.css";

const DATA = [
  { lot: "001", item: "Rolex Daytona Ref. 6263", bid: 75000, bidder: "BIDDER-A487", reserve: "Met", status: "Payment Received" },
  { lot: "002", item: "Patek Philippe Calatrava", bid: 22500, bidder: "BIDDER-C901", reserve: "Met", status: "Invoice Sent" },
  { lot: "003", item: "Omega Speedmaster Moonwatch", bid: 0, bidder: "Unsold", reserve: "Not Met", status: "Unsold" },
  { lot: "004", item: "TAG Heuer Carrera", bid: 4800, bidder: "BIDDER-F2E5", reserve: "Met", status: "Payment Pending" },
  { lot: "005", item: "Vintage Rolex Submariner", bid: 16000, bidder: "BIDDER-K447", reserve: "Met", status: "Payment Received" },
  { lot: "006", item: "Cartier Tank", bid: 14000, bidder: "BIDDER-X882", reserve: "Met", status: "Invoice Sent" },
];

const CARD_IMAGES = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt3WpWd9ggi9EY-ZecKXm326Zwf_OQW4BHhw&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqKtPikqGQLSttXbrMpROp-psrJgi_-cykwA&s",
  "https://png.pngtree.com/png-vector/20220521/ourmid/pngtree-icon-live-streaming-vector-png-image_4643886.png",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt3WpWd9ggi9EY-ZecKXm326Zwf_OQW4BHhw&s",
];

const ROWS_PER_PAGE = 5;

export default function AdminAuctionResults() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filteredData = useMemo(() => {
    return DATA.filter((item) => {
      const searchMatch =
        item.item.toLowerCase().includes(search.toLowerCase()) ||
        item.bidder.toLowerCase().includes(search.toLowerCase()) ||
        item.lot.toLowerCase().includes(search.toLowerCase());
      const statusMatch = statusFilter === "All" || item.status === statusFilter;
      return searchMatch && statusMatch;
    });
  }, [search, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);

  const paginatedRows = useMemo(() => {
    const startIndex = (page - 1) * ROWS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [filteredData, page]);

  const exportResults = () => {
    const headers = ["Lot", "Item", "Bid", "Bidder", "Reserve", "Status"];
    const csvRows = filteredData.map(d =>
      `${d.lot},${d.item},${d.bid},${d.bidder},${d.reserve},${d.status}`
    );
    const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...csvRows].join("\n");
    const link = document.createElement("a");
    link.href = csv;
    link.download = "auction_results.csv";
    link.click();
  };

  const statsCards = [
    { title: "Total Hammer Price", value: "$1,245,600", iconUrl: CARD_IMAGES[0] },
    { title: "Sell-Through Rate", value: "92%", iconUrl: CARD_IMAGES[1] },
    { title: "Total Lots Sold", value: "138", iconUrl: CARD_IMAGES[2] },
    { title: "Lots Unsold", value: "12", iconUrl: CARD_IMAGES[3] },
  ];

  return (
    <div className="results-wrapper">
      <h1 className="title">Auction Results: Vintage Watch Collection - 24 Oct 2024</h1>
      <p className="subtitle">Review winning bids, financial status, and next steps for the auction.</p>

      <div className="stats-row">
        {statsCards.map((card, index) => (
          <div className="category-card-horizontal" key={index}>
            <div className="category-card-icon-wrapper">
              <img src={card.iconUrl} alt={card.title} className="category-card-icon-img" />
            </div>
            <div className="category-card-content">
              <h4>{card.title}</h4>
              <p>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Updated filter row to match AuctionAdminPanel capsule design */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 mt-3 mobile-flex-column">
        <div className="d-flex flex-wrap gap-2 align-items-center full-width-mobile">
          <input
            type="text"
            className="form-control bg-dark text-white border-secondary search-input"
            placeholder=" 🔍 Search by Lot, Item, or Bidder"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <button className="createBtn full-width-mobile-btn" onClick={exportResults}>
            Export Results
          </button>

          <div className="btn-group ms-2 filter-btn-group">
            <button
              className={`btn custom-filter-btn ${statusFilter === "All" ? "active" : ""}`}
              onClick={() => { setStatusFilter("All"); setPage(1); }}
            >
              All
            </button>
            <button
              className={`btn custom-filter-btn ${statusFilter === "Payment Received" ? "active" : ""}`}
              onClick={() => { setStatusFilter("Payment Received"); setPage(1); }}
            >
              Payment Received
            </button>
            <button
              className={`btn custom-filter-btn ${statusFilter === "Invoice Sent" ? "active" : ""}`}
              onClick={() => { setStatusFilter("Invoice Sent"); setPage(1); }}
            >
              Invoice Sent
            </button>
            <button
              className={`btn custom-filter-btn ${statusFilter === "Payment Pending" ? "active" : ""}`}
              onClick={() => { setStatusFilter("Payment Pending"); setPage(1); }}
            >
              Payment Pending
            </button>
            <button
              className={`btn custom-filter-btn ${statusFilter === "Unsold" ? "active" : ""}`}
              onClick={() => { setStatusFilter("Unsold"); setPage(1); }}
            >
              Unsold
            </button>
          </div>
        </div>
      </div>

      <div className="table-box">
        <table className="table-dark">
          <thead>
            <tr>
              <th>LOT</th>
              <th>ITEM DESCRIPTION</th>
              <th className="text-right">WINNING BID</th>
              <th>WINNING BIDDER</th>
              <th className="text-center">RESERVE STATUS</th>
              <th className="text-center">FINANCIAL STATUS</th>
              <th className="text-center">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255, 255, 255, 0.5)', fontStyle: 'italic' }}>
                  No results found
                </td>
              </tr>

            ) : (
              paginatedRows.map((row, i) => (
                <tr key={i}>
                  <td>{row.lot}</td>
                  <td><strong>{row.item}</strong></td>
                  <td className="text-right">{row.bid ? `$${row.bid.toLocaleString()}` : <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontStyle: 'italic' }}>—</span>}</td>
                  <td>{row.bidder}</td>
                  <td className="text-center">
                    <span className={`badgecustomadmin ${row.reserve === "Met" ? "bg-live" : "bg-draft"}`}>
                      {row.reserve}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className={`badgecustomadmin
                      ${row.status === "Payment Received" ? "bg-live" :
                        row.status === "Invoice Sent" ? "bg-upcoming" :
                          row.status === "Payment Pending" ? "bg-ended" :
                            "bg-draft"}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="dots text-center">
                    <button
                      className="action-menu-btn"
                      onClick={(e) => { e.stopPropagation(); alert("Actions menu"); }}
                      title="More actions"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

      {filteredData.length > 0 && (
        <div className="table-pagination">
          <div className="pagination-info">
            Page {page} of {totalPages}
          </div>

          <div className="pagination-controls">

            <button
              style={{ color: "black" }}
              className="pagination-btn prev"
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`page-number ${page === i + 1 ? "active" : ""}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              style={{ color: "black" }}
              className="pagination-btn next"
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </button>

          </div>
        </div>
      )}
    </div>
  );
}