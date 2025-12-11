import React, { useState, useEffect } from "react";
import "./AuctionControlPanel.css";

export default function AuctionControlPanel() {
  const [time, setTime] = useState(85);
  const [isRunning, setIsRunning] = useState(false);

  const [bids, setBids] = useState([
    { user: "User_7891", amount: 12500, time: "just now" },
    { user: "BidMasterFlex", amount: 12250, time: "11s ago" },
    { user: "User_7891", amount: 12000, time: "25s ago" },
    { user: "CollectorJane", amount: 11750, time: "48s ago" }
  ]);

  const [bidders] = useState([
    { name: "User_7891", bids: 14, status: "Active" },
    { name: "BidMasterFlex", bids: 11, status: "Active" },
    { name: "CollectorJane", bids: 8, status: "Watching" },
    { name: "WatchFan_22", bids: 5, status: "Watching" }
  ]);

  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, time]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `00:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="auction-container">
      <div className="header d-flex justify-content-between align-items-center">
        <div>
          <h2>Auction Control Panel</h2>
          <span className="live-text" style={{color:"white"}}>
            ● Live | Lot #14: Rolex Submariner Ref. 16610
          </span>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-success"
            onClick={() => setIsRunning(true)}
          >
            ▶ Start Auction
          </button>

          <button
            className="btn btn-warning"
            onClick={() => setIsRunning(false)}
          >
            ⏸ Pause Auction
          </button>

          <button className="btn btn-danger" onClick={() => setTime(0)}>
            ⏹ End Auction
          </button>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card dark-card mb-3">
            <h5>Lot Timer</h5>

            <div className="timer" style={{color:"white"}}>{formatTime(time)}</div>
            <p className="text-white">Time Remaining</p>

            <div className="d-flex gap-2">
              <button className="btn-timer" onClick={() => setTime((t) => t + 30)}>
                +30s
              </button>
              <button className="btn-timer" onClick={() => setTime((t) => t + 60)}>
                +1m
              </button>
              <button className="btn-timer">
                Set Time
              </button>
            </div>
          </div>

          <div className="card dark-card">
            <div className="d-flex justify-content-between align-items-center">
              <h5>Bidder List (124)</h5>
              <span> 🔍</span>
            </div>

            {bidders.map((bidder, i) => (
              <div key={i} className="bidder-row">
                <div>
                  <strong>{bidder.name}</strong>
                  <div className="text">{bidder.bids} Bids</div>
                </div>

                <span
                  className={`badge ${
                    bidder.status === "Active"
                      ? "bg-success"
                      : "bg-warning text-dark"
                    
                  }`}
                >
                  {bidder.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-8">
          <div className="card dark-card mb-3">
            <h5>Live Bid Feed</h5>

            {bids.map((bid, i) => (
              <div key={i} className="bid-row">
                <div>
                  <span className="text-success" style={{width:100}}>↑</span>{" "}
                  <strong>{bid.user}</strong> placed a bid
                </div>

                <div className="text-end">
                  <div className="price" style={{color:"white", fontSize:20}}>${bid.amount.toLocaleString()}</div>
                  <div className="small text-white">{bid.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card dark-card">
            <ul className="nav nav-tabs dark-tabs mb-3">
              <li className="nav-item">
                <button className="nav-link ">Disputed Bids (2)</button>
              </li>
              <li className="nav-item">
                <button className="nav-link">Technical Issues (0)</button>
              </li>
              <li className="nav-item">
                <button className="nav-link">User Messages (5)</button>
              </li>
            </ul>

      <div className="dispute-box">
  <strong>Dispute #8812 - BidMasterFlex</strong>

  <div className="d-flex align-items-center mt-2">
    <p className="small text-white mb-0 flex-grow-1">
      Claim: "Accidental double-click bid."
    </p>

    <div className="d-flex gap-2 ms-3">
      <button className="btn-void">Void Bid</button>
      <button className="btn-resolve">Resolve</button>
    </div>
  </div>
</div>

<div className="dispute-box">
  <strong>Dispute #8809 - User_7891</strong>

  <div className="d-flex align-items-center mt-2">
    <p className="small text-white mb-0 flex-grow-1">
      Claim: "Bid did not register in time."
    </p>

    <div className="d-flex gap-2 ms-3">
      <button className="btn-void">Void Bid</button>
      <button className="btn-resolve">Resolve</button>
    </div>
  </div>
</div>



          </div>
        </div>
      </div>
    </div>
  );
}
