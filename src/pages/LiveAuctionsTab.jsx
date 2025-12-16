import React, { useState, useMemo } from "react";
import "./LiveAuctionsTab.css";
import { useNavigate } from "react-router-dom";

const SAMPLE_DATA = [
  { id: "BID-1001", user: "Ali Khan", amount: 1200, time: "2023-10-25 10:45 AM", status: "Winning" },
  { id: "BID-1002", user: "Sara Ahmed", amount: 1350, time: "2023-10-25 10:50 AM", status: "Outbid" },
  { id: "BID-1003", user: "Usman Tariq", amount: 1500, time: "2023-10-25 10:55 AM", status: "Winning" },
  { id: "BID-1004", user: "Hassan Raza", amount: 1100, time: "2023-10-25 11:00 AM", status: "Outbid" },
  { id: "BID-1005", user: "Ayesha Noor", amount: 1600, time: "2023-10-25 11:05 AM", status: "Winning" },
   { id: "BID-1001", user: "Ali Khan", amount: 1200, time: "2023-10-25 10:45 AM", status: "Winning" },
  { id: "BID-1002", user: "Sara Ahmed", amount: 1350, time: "2023-10-25 10:50 AM", status: "Outbid" },
  { id: "BID-1003", user: "Usman Tariq", amount: 1500, time: "2023-10-25 10:55 AM", status: "Winning" },
  { id: "BID-1004", user: "Hassan Raza", amount: 1100, time: "2023-10-25 11:00 AM", status: "Outbid" },
  { id: "BID-1005", user: "Ayesha Noor", amount: 1600, time: "2023-10-25 11:05 AM", status: "Winning" },
   { id: "BID-1001", user: "Ali Khan", amount: 1200, time: "2023-10-25 10:45 AM", status: "Winning" },
  { id: "BID-1002", user: "Sara Ahmed", amount: 1350, time: "2023-10-25 10:50 AM", status: "Outbid" },
  { id: "BID-1003", user: "Usman Tariq", amount: 1500, time: "2023-10-25 10:55 AM", status: "Winning" },
  { id: "BID-1004", user: "Hassan Raza", amount: 1100, time: "2023-10-25 11:00 AM", status: "Outbid" },
  { id: "BID-1005", user: "Ayesha Noor", amount: 1600, time: "2023-10-25 11:05 AM", status: "Winning" },
   { id: "BID-1001", user: "Ali Khan", amount: 1200, time: "2023-10-25 10:45 AM", status: "Winning" },
  { id: "BID-1002", user: "Sara Ahmed", amount: 1350, time: "2023-10-25 10:50 AM", status: "Outbid" },
  { id: "BID-1003", user: "Usman Tariq", amount: 1500, time: "2023-10-25 10:55 AM", status: "Winning" },
  { id: "BID-1004", user: "Hassan Raza", amount: 1100, time: "2023-10-25 11:00 AM", status: "Outbid" },
  { id: "BID-1005", user: "Ayesha Noor", amount: 1600, time: "2023-10-25 11:05 AM", status: "Winning" },
];

const ROWS_PER_PAGE = 5;

export default function LiveAuctionsTab() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const filteredData = useMemo(() => {
    return SAMPLE_DATA.filter((item) => {
      const matchSearch =
        item.user.toLowerCase().includes(search.toLowerCase());

      const matchDate = true;

      return matchSearch && matchDate;
    });
  }, [search, date]);

  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
  const startIndex = (page - 1) * ROWS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ROWS_PER_PAGE);

  const exportCSV = () => {
    const headers = ["Bid ID", "User", "Bid Amount", "Time Stamp", "Status"];
    const rows = filteredData.map(item => [
      item.id,
      item.user,
      item.amount,
      item.time,
      item.status
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map(e => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = csvContent;
    link.download = "bid_logs.csv";
    link.click();
  };

  return (
    <div className="auction-dark-wrapper">
      <p className="para">Auctions/Vintage Collectibles/Vintage Rolex  Submariner/Logs</p>

      <div className="auction-header-row">
        <h2 style={{ fontSize: 50 }}>Bid Logs</h2>

        <div className="right-tools">
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)"
              }}
            >
              🔍
            </span>

            <input
              type="text"
              placeholder="Search by users"
              value={search}
              style={{ paddingLeft: "35px" }}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setPage(1);
            }}
          />

          <button className="export-btn" onClick={exportCSV}>
            ⬇ Export as CSV
          </button>
        </div>
      </div>

      <p className="para1">Vintage Rolex  Submariner- Auction #5821</p>

      <div className="table-box">
        <table className="auction-table">
          <thead>
            <tr>
              <th>Bid ID</th>
              <th>User</th>
              <th className="text-right">Bid Amount</th>
              <th>Time Stamp</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255, 255, 255, 0.5)', fontStyle: 'italic' }}>
                  No bid logs found
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr
                  key={item.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/AdminAuctionResults")}
                >
      <td>{item.id}</td>
      <td>{item.user}</td>
      <td className="text-right">${item.amount.toLocaleString()}</td>
      <td>{item.time}</td>
      <td className="text-center">
        <span className={`statusbadge
          ${item.status === "Winning" ? "bg-winning" :
          item.status === "Outbid" ? "bg-outbid" :
          item.status === "Ended" ? "bg-end" :
          "bg-draft"
          }`}>
          {item.status}
        </span>
      </td>
    </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-row">
        

        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={page === p ? "active" : ""}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}

          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        
        </div>
      </div>
    </div>
  );
}
