import React, { useState, useEffect } from "react";
import "./AuctionControlPanel.css";

export default function AuctionControlPanel() {
  const [time, setTime] = useState(85);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("disputes");

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

  const [userMessages, setUserMessages] = useState([
    { id: "MSG-101", user: "CollectorJane", message: "Is the reserve price visible during bidding?", time: "2 min ago" },
    { id: "MSG-102", user: "User_7891", message: "Can I retract my last bid? I made an error.", time: "5 min ago" },
    { id: "MSG-103", user: "WatchFan_22", message: "What are the shipping options for international buyers?", time: "8 min ago" },
    { id: "MSG-104", user: "BidMasterFlex", message: "Is there a buyer's premium on this lot?", time: "12 min ago" },
    { id: "MSG-105", user: "AntiqueLover", message: "Can I view the item in person before bidding?", time: "15 min ago" }
  ]);

  const handleReplyMessage = (msgId) => {
    alert(`Opening reply dialog for ${msgId}`);
    // Add your reply logic here
  };

  const handleDismissMessage = (msgId) => {
    if (window.confirm(`Are you sure you want to dismiss ${msgId}?`)) {
      setUserMessages(userMessages.filter(msg => msg.id !== msgId));
    }
  };

  const handleVoidBid = (disputeId) => {
    alert(`Voiding bid for ${disputeId}`);
    // Add your void bid logic here
  };

  const handleResolveDispute = (disputeId) => {
    alert(`Resolving dispute ${disputeId}`);
    // Add your resolve logic here
  };

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
    return `00:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="control-wrapper">
      <div className="control-container">
        
        <div className="control-section-header">
          <div className="control-header-content">
            <h1 className="control-page-title">Auction Control Panel</h1>
            <p className="control-page-subtitle">
              <span className="control-live-indicator">●</span> Live | Lot #14: Rolex Submariner Ref. 16610
            </p>
          </div>
          <div className="control-header-actions">
            <button className="control-action-btn btn-start" onClick={() => setIsRunning(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <polygon points="5 3 19 12 5 21 5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor"/>
              </svg>
              Start Auction
            </button>
            <button className="control-action-btn btn-pause" onClick={() => setIsRunning(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="6" y="4" width="4" height="16" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
                <rect x="14" y="4" width="4" height="16" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
              </svg>
              Pause Auction
            </button>
            <button className="control-action-btn btn-end" onClick={() => setTime(0)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="5" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor"/>
              </svg>
              End Auction
            </button>
          </div>
        </div>

        <div className="control-grid">
          {/* LEFT COLUMN */}
          <div className="control-left-column">
            
            {/* TIMER CARD */}
            <div className="control-card">
              <h3 className="control-card-title">Lot Timer</h3>
              <div className="control-timer">{formatTime(time)}</div>
              <p className="control-timer-label">Time Remaining</p>
              <div className="control-timer-buttons">
                <button className="control-timer-btn" onClick={() => setTime((t) => t + 30)}>+30s</button>
                <button className="control-timer-btn" onClick={() => setTime((t) => t + 60)}>+1m</button>
                <button className="control-timer-btn">Set Time</button>
              </div>
            </div>

            {/* BIDDER LIST CARD */}
            <div className="control-card">
              <div className="control-card-header">
                <h3 className="control-card-title">Bidder List (124)</h3>
                <button className="control-search-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              
              <div className="control-bidders-list">
                {bidders.map((bidder, i) => (
                  <div key={i} className="control-bidder-row">
                    <div className="control-bidder-info">
                      <span className="control-bidder-name">{bidder.name}</span>
                      <span className="control-bidder-count">{bidder.bids} Bids</span>
                    </div>
                    <span className={`control-status-badge ${bidder.status === "Active" ? "status-active" : "status-watching"}`}>
                      {bidder.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="control-right-column">
            
            {/* LIVE BID FEED CARD */}
            <div className="control-card">
              <h3 className="control-card-title">Live Bid Feed</h3>
              
              <div className="control-bids-list">
                {bids.map((bid, i) => (
                  <div key={i} className="control-bid-row">
                    <div className="control-bid-info">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="control-bid-icon">
                        <polyline points="18 15 12 9 6 15" stroke="#8CC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="control-bid-user">{bid.user}</span>
                      <span className="control-bid-text">placed a bid</span>
                    </div>
                    <div className="control-bid-details">
                      <span className="control-bid-amount">${bid.amount.toLocaleString()}</span>
                      <span className="control-bid-time">{bid.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DISPUTES & ISSUES CARD */}
            <div className="control-card">
              <div className="control-tabs">
                <button 
                  className={`control-tab ${activeTab === "disputes" ? "active" : ""}`}
                  onClick={() => setActiveTab("disputes")}
                >
                  Disputed Bids (2)
                </button>
                <button 
                  className={`control-tab ${activeTab === "technical" ? "active" : ""}`}
                  onClick={() => setActiveTab("technical")}
                >
                  Technical Issues (0)
                </button>
                <button 
                  className={`control-tab ${activeTab === "messages" ? "active" : ""}`}
                  onClick={() => setActiveTab("messages")}
                >
                  User Messages (5)
                </button>
              </div>

              {/* DISPUTED BIDS TAB */}
              {activeTab === "disputes" && (
                <div className="control-disputes-list">
                  <div className="control-dispute-box">
                    <div className="control-dispute-header">
                      <span className="control-dispute-id">Dispute #8812</span>
                      <span className="control-dispute-user">BidMasterFlex</span>
                    </div>
                    <p className="control-dispute-claim">Claim: "Accidental double-click bid."</p>
                    <div className="control-dispute-actions">
                      <button 
                        className="control-dispute-btn btn-void"
                        onClick={() => handleVoidBid("Dispute #8812")}
                      >
                        Void Bid
                      </button>
                      <button 
                        className="control-dispute-btn btn-resolve"
                        onClick={() => handleResolveDispute("Dispute #8812")}
                      >
                        Resolve
                      </button>
                    </div>
                  </div>

                  <div className="control-dispute-box">
                    <div className="control-dispute-header">
                      <span className="control-dispute-id">Dispute #8809</span>
                      <span className="control-dispute-user">User_7891</span>
                    </div>
                    <p className="control-dispute-claim">Claim: "Bid did not register in time."</p>
                    <div className="control-dispute-actions">
                      <button 
                        className="control-dispute-btn btn-void"
                        onClick={() => handleVoidBid("Dispute #8809")}
                      >
                        Void Bid
                      </button>
                      <button 
                        className="control-dispute-btn btn-resolve"
                        onClick={() => handleResolveDispute("Dispute #8809")}
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TECHNICAL ISSUES TAB */}
              {activeTab === "technical" && (
                <div className="control-empty-state">
                  <div className="control-empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>No Technical Issues</h3>
                  <p>All systems are running smoothly</p>
                </div>
              )}

              {/* USER MESSAGES TAB */}
              {activeTab === "messages" && (
                <div className="control-messages-list">
                  {userMessages.map((msg, i) => (
                    <div key={i} className="control-message-box">
                      <div className="control-message-header">
                        <span className="control-message-id">{msg.id}</span>
                        <span className="control-message-user">{msg.user}</span>
                        <span className="control-message-time">{msg.time}</span>
                      </div>
                      <p className="control-message-text">{msg.message}</p>
                      <div className="control-message-actions">
                        <button 
                          className="control-message-btn btn-reply"
                          onClick={() => handleReplyMessage(msg.id)}
                        >
                          Reply
                        </button>
                        <button 
                          className="control-message-btn btn-dismiss"
                          onClick={() => handleDismissMessage(msg.id)}
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}