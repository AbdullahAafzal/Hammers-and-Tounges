import React, { useEffect, useState, useMemo } from "react";
import "./AdminManagerKYC.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersList, performUserAction } from "../../store/actions/adminActions";
import { clearActionSuccess } from "../../store/slices/adminSlice";
const AdminManagerKYC = () => {
  const [comparison, setComparison] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedAction, setSelectedAction] = useState({
    type: '',
    target_id: null,
    role: '',
  });
  const dispatch = useDispatch();
  const { users, isLoading, isPerformingAction, actionSuccess } = useSelector((state) => state.admin);

  console.log("selectedAction: ", selectedAction);


  // Fetch users on component mount
  useEffect(() => {
    dispatch(fetchUsersList());
  }, [dispatch]);

  // Refresh users list after successful action
  useEffect(() => {
    if (actionSuccess) {
      dispatch(fetchUsersList());
      dispatch(clearActionSuccess());
      setSelectedAction({ type: '', target_id: null, role: '' });
    }
  }, [actionSuccess, dispatch]);

  // Find the selected user by ID
  const selectedUser = useMemo(() => {
    if (!users?.results) return null;
    return users.results.find((user) => user.id === parseInt(id));
  }, [users, id]);

  const openFullscreen = (src) => {
    setFullscreenImage(src);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleUserAction = async (userId, actionType) => {
    const actionData = {
      type: actionType,
      target_id: userId,
    };

    await dispatch(performUserAction(actionData));
  };

  // Get role display name
  const getRoleDisplayName = (role) => {
    const roleMap = {
      admin: "Administrator",
      seller: "Seller",
      buyer: "Buyer",
      manager: "Manager",
    };
    return roleMap[role] || role || "N/A";
  };

  // Get KYC status
  const getKYCStatus = () => {
    if (!selectedUser) return "Unknown";
    if (selectedUser.role === "seller" && selectedUser.seller_details) {
      return selectedUser.seller_details.verified ? "Verified" : "Pending Review";
    }
    return "Not Applicable";
  };

  // Document configuration
  const documentTypes = [
    {
      key: "id_front",
      label: "National ID (Front)",
      path: `http://207.180.233.44:8001${selectedUser?.seller_details?.id_front}`,
    },
    {
      key: "id_back",
      label: "National ID (Back)",
      path: `http://207.180.233.44:8001${selectedUser?.seller_details?.id_back}`,
    },
    {
      key: "driving_license_front",
      label: "Driving License (Front)",
      path: `http://207.180.233.44:8001${selectedUser?.seller_details?.driving_license_front}`,
    },
    {
      key: "driving_license_back",
      label: "Driving License (Back)",
      path: `http://207.180.233.44:8001${selectedUser?.seller_details?.driving_license_back}`,
    },
    {
      key: "passport_front",
      label: "Passport",
      path: `http://207.180.233.44:8001${selectedUser?.seller_details?.passport_front}`,
    },
  ];

  console.log("documentTypes: ", documentTypes);


  // Loading state
  if (isLoading) {
    return (
      <div className="kyc-page">
        <div className="kyc-loading">
          <div className="kyc-loading-spinner"></div>
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  // User not found state
  if (!selectedUser) {
    return (
      <div className="kyc-page">
        <div className="kyc-not-found">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
              fill="currentColor"
            />
          </svg>
          <h3>User Not Found</h3>
          <p>The selected user could not be found. Please return to the user list and try again.</p>
          <button className="approve" onClick={() => navigate("/admin/users")}>
            Back to Users List
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`kyc-page ${fullscreenImage ? "blurred" : ""}`}>
        <header className="kyc-header">
          <div>
            <h1 className="titlePage">KYC Verification</h1>
            <p className="descPage">
              Review user identity documents and approve or reject verification requests.
            </p>
          </div>
          <span className={`kyc-status ${getKYCStatus() === "Verified" ? "verified" : "pending"}`}>
            {getKYCStatus()}
          </span>
        </header>

        <div className="kyc-top">
          <div className="card user-info">
            <h3>User Information</h3>
            <div className="info-grid">
              <div>
                <label>Full Name</label>
                <span>{selectedUser.full_name || "N/A"}</span>
              </div>
              <div>
                <label>Email Address</label>
                <span>{selectedUser.email || "N/A"}</span>
              </div>
              <div>
                <label>Phone Number</label>
                <span>{selectedUser.profile?.phone || "N/A"}</span>
              </div>
              <div>
                <label>Role</label>
                <span>{getRoleDisplayName(selectedUser.role)}</span>
              </div>
              <div>
                <label>Account Creation</label>
                <span>{formatDate(selectedUser.date_joined)}</span>
              </div>
              <div>
                <label>Last Submitted</label>
                <span>{formatDate(selectedUser.seller_details?.created_at)}</span>
              </div>
              <div>
                <label>Email Verified</label>
                <span className={selectedUser.is_email_verified ? "highlight-success" : "highlight"}>
                  {selectedUser.is_email_verified ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>

          <div className="kyc-card-form admin-panel">
            <h3>Admin Review Panel</h3>
            <div className="action-buttons">
              {
                selectedUser && selectedUser?.seller_details?.verified ? '' : (
                  <button className="approve" disabled={isPerformingAction} onClick={() => {
                    handleUserAction(selectedUser.id, 'VERIFY_SELLER')
                    navigate("/admin/users")
                  }
                  }>
                    {isPerformingAction ?
                      (
                        <>
                          <span className="kyc-spinner"></span>
                          Approving
                        </>
                      ) : "Approve"}
                  </button>

                )
              }
              <button className="reject" onClick={() => navigate("/admin/users")}>
                Go Back
              </button>
            </div>

            {/* Rejection functionality will be implemented later */}
            {/* 
            <label className="reason-label">Reason for Rejection</label>
            <textarea
              className="textarea-form"
              placeholder="Provide a clear reason for rejecting this user's KYC documents..."
            />
            <div className="checkbox-row">
              <input type="checkbox" />
              <span>Flag for additional verification</span>
            </div>
            <div className="rejection-log">
              <h4>Previous Rejection Log</h4>
              <p>
                <strong>18 Nov 2023</strong> – National ID front is blurry. Please re-upload a clearer
                image.
              </p>
            </div>
            */}
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
                <span style={{ marginLeft: 4 }} className="slider"></span>
              </label>
            </div>
          </div>

          <div className="documents">
            {documentTypes.map((doc) => (
              <div key={doc.key} className="doc-card">
                {doc.path ? (
                  <>
                    <img src={doc.path} alt={doc.label} />
                    <h4>{doc.label}</h4>
                    <button className="btnfullscreen" onClick={() => openFullscreen(doc.path)}>
                      View Full Screen
                    </button>
                  </>
                ) : (
                  <>
                    <div className="doc-missing-placeholder">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14 2V8H20"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 18V12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 9H12.01"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="doc-missing-text">Document not provided</p>
                    </div>
                    <h4>{doc.label}</h4>
                    <button className="btnfullscreen" disabled>
                      Not Available
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {fullscreenImage && (
        <div className="fullscreen-overlay" onClick={closeFullscreen}>
          <span className="close-modal" onClick={closeFullscreen}>
            &times;
          </span>
          <img src={fullscreenImage} alt="Full Screen" />
        </div>
      )}
    </>
  );
};

export default AdminManagerKYC;