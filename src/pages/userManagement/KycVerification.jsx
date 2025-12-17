import React, { useState } from "react";
import "./KYCVerification.css";

const KYCVerification = () => {
  const [comparison, setComparison] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const openFullscreen = (src) => {
    setFullscreenImage(src);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  return (
    <>
      <div className={`kyc-page ${fullscreenImage ? "blurred" : ""}`}>
        <header className="kyc-header">
          <div>
            <h1>KYC Verification</h1>
            <p>Review user identity documents and approve or reject verification requests.</p>
          </div>
          <span className="kyc-status">Pending Review</span>
        </header>

        <div className="kyc-top">
          <div className="card user-info">
            <h3>User Information</h3>
            <div className="info-grid">
              <div>
                <label>Full Name</label>
                <span>John Doe</span>
              </div>
              <div>
                <label>Email Address</label>
                <span>john.doe@example.com</span>
              </div>
              <div>
                <label>Phone Number</label>
                <span>+1 234 567 8900</span>
              </div>
              <div>
                <label>Role</label>
                <span>Bidder</span>
              </div>
              <div>
                <label>Account Creation</label>
                <span>14 Oct 2023</span>
              </div>
              <div>
                <label>Last Submitted</label>
                <span>22 Nov 2023</span>
              </div>
              <div>
                <label>KYC Submission Attempt</label>
                <span className="highlight">Resubmission #2</span>
              </div>
            </div>
          </div>

          <div className="card admin-panel">
            <h3>Admin Review Panel</h3>
            <div className="action-buttons">
              <button className="approve">Approve</button>
              <button className="reject">Reject</button>
            </div>
            <label className="reason-label">Reason for Rejection</label>
            <textarea placeholder="Provide a clear reason for rejecting this user's KYC documents..." />
            <div className="checkbox-row">
              <input type="checkbox" />
              <span>Flag for additional verification</span>
            </div>
            <div className="rejection-log">
              <h4>Previous Rejection Log</h4>
              <p>
                <strong>18 Nov 2023</strong> – National ID front is blurry. Please
                re-upload a clearer image.
              </p>
            </div>
          </div>
        </div>

        <div className="card document-preview">
          <div className="doc-header">
            <h3>Document Preview</h3>
            <div className="comparison-toggle">
              <span style={{ marginLeft: 200 }}>Comparison View</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={comparison}
                  onChange={() => setComparison(!comparison)}
                />
                <span style={{ marginLeft: 4 }}className="slider"></span>
              </label>
            </div>
          </div>

          <div className="documents">
            <div className="doc-card">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-hNzpwUDWsAISt0-eMKK1NLBpNu3evdNWcg&s"
                alt="National ID Front"
              />
              <h4>National ID (Front)</h4>
              <button
                className="btnfullscreen"
                onClick={() =>
                  openFullscreen(
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-hNzpwUDWsAISt0-eMKK1NLBpNu3evdNWcg&s"
                  )
                }
              >
                View Full Screen
              </button>
            </div>

            <div className="doc-card">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl9_lkFMW5w9JrAk0ozRyxZ72Wl0VNCnXGtQ&s"
                alt="National ID Back"
              />
              <h4>National ID (Back)</h4>
              <button
                className="btnfullscreen"
                onClick={() =>
                  openFullscreen(
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl9_lkFMW5w9JrAk0ozRyxZ72Wl0VNCnXGtQ&s"
                  )
                }
              >
                View Full Screen
              </button>
            </div>

            <div className="doc-card">
              <img src="" alt="Passport Info" />
              <h4>Passport Info</h4>
              <button className="btnfullscreen" onClick={() => openFullscreen("")}>
                View Full Screen
              </button>
            </div>
          </div>
        </div>
      </div>

      {fullscreenImage && (
        <div className="fullscreen-overlay">
          <span className="close-modal" onClick={closeFullscreen}>
            &times;
          </span>
          <img src={fullscreenImage} alt="Full Screen" />
        </div>
      )}
    </>
  );
};

export default KYCVerification;
