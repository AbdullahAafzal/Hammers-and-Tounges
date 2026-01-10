import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import "./SellerProfile.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { fetchProfile, updateProfile, deleteProfile } from "../../store/actions/profileActions";
import { toast } from "react-toastify";

const SellerProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get profile data from Redux store
  const { profile: profileData, loading, error } = useSelector((state) => state.profile);

  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [kycUploading, setKycUploading] = useState(false);
  // const [isUploadingKyc, setIsUploadingKyc] = useState(false);
  // Single state for all form data including files
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    display_name: "",
    phone: "",
    bio: "",
    email: "",
    image: null, // Will hold File object if uploading new image
    seller_profile: {
      business_name: "",
      business_reg_no: "",
      id_front: null,
      id_back: null,
      driving_license_front: null,
      driving_license_back: null,
      passport_front: null,
      verified: false,
    },
    profile_completion_status: "incomplete",
  });

  // State for image previews only (not the actual API data)
  const [imagePreviews, setImagePreviews] = useState({
    image: null,
    id_front: null,
    id_back: null,
    driving_license_front: null,
    driving_license_back: null,
    passport_front: null,
  });

  // File input refs
  const fileInputRefs = useRef({
    image: null,
    id_front: null,
    id_back: null,
    driving_license_front: null,
    driving_license_back: null,
    passport_front: null,
  });

  // Performance stats (memoized)
  const performanceStats = useMemo(() => [
    { id: 1, label: "Total Sales", value: "$0", icon: "revenue", color: "#8CC63F" },
    { id: 2, label: "Total Orders", value: "0", icon: "orders", color: "#3B82F6" },
    { id: 3, label: "Avg Rating", value: "0.0", icon: "rating", color: "#F59E0B" },
    { id: 4, label: "Response Rate", value: "0%", icon: "response", color: "#8B5CF6" },
  ], []);

  // Fetch profile on component mount
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Update formData when profileData changes from API
  useEffect(() => {
    if (profileData) {
      setFormData({
        first_name: profileData.first_name || "",
        last_name: profileData.last_name || "",
        display_name: profileData.display_name || "",
        phone: profileData.phone || "",
        bio: profileData.bio || "",
        email: profileData.email || "",
        image: null, // Don't set the URL here, it's for new uploads only
        seller_profile: {
          business_name: profileData.seller_profile?.business_name || "",
          business_reg_no: profileData.seller_profile?.business_reg_no || "",
          id_front: null, // Don't set URLs, these are for new uploads
          id_back: null,
          driving_license_front: null,
          driving_license_back: null,
          passport_front: null,
          verified: profileData.seller_profile?.verified || false,
        },
        profile_completion_status: profileData.profile_completion_status || "incomplete",
      });
    }
  }, [profileData]);

  // Handle text input changes
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Handle seller profile text changes
  const handleSellerProfileChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      seller_profile: {
        ...prev.seller_profile,
        [field]: value
      }
    }));
  }, []);

  // Handle file selection for any field
  const handleFileSelect = useCallback((fieldName, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Update formData with the File object
    if (fieldName === 'image') {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      console.log('selected file profile: ', file);


    } else {
      // For KYC documents
      setFormData(prev => ({
        ...prev,
        seller_profile: {
          ...prev.seller_profile,
          [fieldName]: file
        }
      }));

      console.log('selected file kyc: ', file);

    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews(prev => ({
        ...prev,
        [fieldName]: reader.result
      }));
    };
    reader.readAsDataURL(file);

    // Clear the input
    if (e.target) {
      e.target.value = '';
    }
  }, []);

  // Handle save - saves everything in one call
  const handleSave = useCallback(async () => {
    try {
      // Prepare data for API - only send fields that have values
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        display_name: formData.display_name,
        phone: formData.phone,
        bio: formData.bio,
      };

      // Add image if user uploaded a new one
      if (formData.image instanceof File) {
        updateData.image = formData.image;
      }

      // Add seller profile data
      updateData.seller_profile = {
        business_name: formData.seller_profile.business_name,
        business_reg_no: formData.seller_profile.business_reg_no,
      };

      // Add KYC documents if user uploaded new ones
      // if (formData.seller_profile.id_front instanceof File) {
      //   updateData.id_front = formData.seller_profile.id_front;
      // }
      // if (formData.seller_profile.id_back instanceof File) {
      //   updateData.id_back = formData.seller_profile.id_back;
      // }
      // if (formData.seller_profile.driving_license_front instanceof File) {
      //   updateData.driving_license_front = formData.seller_profile.driving_license_front;
      // }
      // if (formData.seller_profile.driving_license_back instanceof File) {
      //   updateData.driving_license_back = formData.seller_profile.driving_license_back;
      // }
      // if (formData.seller_profile.passport_front instanceof File) {
      //   updateData.passport_front = formData.seller_profile.passport_front;
      // }

      console.log(updateData, 'Updating profile with data');


      await dispatch(updateProfile(updateData));
      setIsEditing(false);

      // Clear previews and file objects after successful save
      setImagePreviews({
        image: null,
        id_front: null,
        id_back: null,
        driving_license_front: null,
        driving_license_back: null,
        passport_front: null,
      });

      // Refresh profile data
      dispatch(fetchProfile());
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }, [formData, dispatch]);

  const handleKycUpload = useCallback(async () => {
    try {
      const kycData = {};

      if (formData.seller_profile.id_front instanceof File) {
        kycData.id_front = formData.seller_profile.id_front;
      }
      if (formData.seller_profile.id_back instanceof File) {
        kycData.id_back = formData.seller_profile.id_back;
      }
      if (formData.seller_profile.driving_license_front instanceof File) {
        kycData.driving_license_front = formData.seller_profile.driving_license_front;
      }
      if (formData.seller_profile.driving_license_back instanceof File) {
        kycData.driving_license_back = formData.seller_profile.driving_license_back;
      }
      if (formData.seller_profile.passport_front instanceof File) {
        kycData.passport_front = formData.seller_profile.passport_front;
      }

      if (Object.keys(kycData).length === 0) {
        toast.warn("Please select at least one document to upload");
        return;
      }

      setKycUploading(true);

      await dispatch(updateProfile(kycData));

      toast.success("KYC documents uploaded successfully");

      // clear previews after success
      setImagePreviews(prev => ({
        ...prev,
        id_front: null,
        id_back: null,
        driving_license_front: null,
        driving_license_back: null,
        passport_front: null,
      }));

      dispatch(fetchProfile());
    } catch (err) {
      console.error("KYC upload error:", err);
    } finally {
      setKycUploading(false);
    }
  }, [dispatch, formData.seller_profile]);


  // Handle account deletion
  const handleDeleteAccount = useCallback(async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await dispatch(deleteProfile());
        dispatch(logout());
        navigate('/signin', { replace: true });
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  }, [dispatch, navigate]);

  // Calculate profile completion percentage
  const calculateProfileCompletion = useCallback(() => {
    let completed = 0;
    let total = 0;

    const basicFields = ['first_name', 'last_name', 'phone', 'email'];
    basicFields.forEach(field => {
      total++;
      if (formData[field] && formData[field].trim()) completed++;
    });

    const businessFields = ['business_name', 'business_reg_no'];
    businessFields.forEach(field => {
      total++;
      if (formData.seller_profile[field] && formData.seller_profile[field].trim()) completed++;
    });

    // Check API data for existing documents
    const kycFields = ['id_front', 'id_back', 'passport_front'];
    kycFields.forEach(field => {
      total++;
      if (profileData?.seller_profile?.[field]) completed++;
    });

    return Math.round((completed / total) * 100);
  }, [formData, profileData]);

  // Get display name
  const getDisplayName = useCallback(() => {
    if (formData.display_name) return formData.display_name;
    return `${formData.first_name} ${formData.last_name}`.trim() || "Seller";
  }, [formData.first_name, formData.last_name, formData.display_name]);

  // Get image source (preview or existing URL)
  const getImageSource = useCallback((fieldName) => {
    // Priority: preview > API URL > default
    if (imagePreviews[fieldName]) {
      return imagePreviews[fieldName];
    }

    if (fieldName === 'image') {
      return profileData?.image || "https://www.catholicsingles.com/wp-content/uploads/2020/06/blog-header-3.png";
    }

    // For KYC documents, return API URL if exists
    return profileData?.seller_profile?.[fieldName] || null;
  }, [imagePreviews, profileData]);

  // Document Card Component
  const DocumentCard = useCallback(({ documentType, title }) => {
    const imageSource = getImageSource(documentType);
    const hasNewFile = formData.seller_profile[documentType] instanceof File;
    const hasExistingDocument = profileData?.seller_profile?.[documentType];

    const isAlreadyUploaded =
      Boolean(profileData?.seller_profile?.[documentType]) &&
      !(formData.seller_profile[documentType] instanceof File);

    console.log('image source:', imageSource);


    return (
      <div className="document-card">
        <input
          ref={el => fileInputRefs.current[documentType] = el}
          type="file"
          accept="image/*"
          disabled={isAlreadyUploaded}
          style={{ display: 'none' }}
          onChange={(e) => handleFileSelect(documentType, e)}
        />

        <div className="document-header">
          <h4>{title}</h4>
          {hasNewFile && (
            <span className="document-status uploaded">Ready to Upload</span>
          )}
          {!hasNewFile && hasExistingDocument && (
            <span className="document-status uploaded">Uploaded</span>
          )}
        </div>

        <div className="document-preview">
          {imageSource ? (
            <img
              src={imageSource}
              alt={title}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `
                  <div class="document-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <p>Failed to load</p>
                  </div>
                `;
              }}
            />
          ) : (
            <div className="document-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" />
                <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p>No document uploaded</p>
            </div>
          )}
        </div>

        <button
          type="button"
          className="document-upload-btn"
          // onClick={() => fileInputRefs.current[documentType]?.click()}
          disabled={isAlreadyUploaded}
          onClick={() => {
            if (!isAlreadyUploaded) {
              fileInputRefs.current[documentType]?.click();
            }
          }}
        >
          {isAlreadyUploaded ? 'Uploaded' : 'Select File'}
        </button>
      </div>
    );
  }, [formData.seller_profile, profileData?.seller_profile, getImageSource, handleFileSelect]);

  // Stat Card Component
  const StatCard = useMemo(() => ({ stat }) => (
    <div key={stat.id} className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: `${stat.color}15` }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          {stat.icon === 'revenue' && (
            <path d="M12 1v22M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" stroke={stat.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {stat.icon === 'orders' && (
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke={stat.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {stat.icon === 'rating' && (
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={stat.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {stat.icon === 'response' && (
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke={stat.color} strokeWidth="2" />
          )}
        </svg>
      </div>
      <div className="stat-content">
        <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
        <div className="stat-label">{stat.label}</div>
      </div>
    </div>
  ), []);

  // Loading state
  if (loading && !profileData) {
    return (
      <div className="seller-profile-container">
        <div className="empty-state">
          <div className="loading-spinner"></div>
          <h3 className="empty-state-title">Loading Profile...</h3>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !profileData) {
    return (
      <div className="seller-profile-container">
        <div className="empty-state">
          <div className="empty-state-icon error">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="empty-state-title">Failed to Load Profile</h3>
          <p className="empty-state-description">
            {error || "Unable to load your profile information. Please try again."}
          </p>
          <button
            className="action-button primary"
            onClick={() => dispatch(fetchProfile())}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const profileCompletion = calculateProfileCompletion();

  return (
    <div className="seller-profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="header-content">
          <h1 className="profile-title">Seller Profile</h1>
          <p className="profile-subtitle">Manage your account, business details, and verification</p>
        </div>
        <div className="header-actions">
          <button
            className={`s-action-btn ${isEditing ? 's-secondary' : 's-primary'}`}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={loading}
          >
            {isEditing ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Save Changes
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" />
                </svg>
                Edit Profile
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-main">
        {/* Left Column */}
        <div className="profile-left">
          <div className="profile-card">
            {/* Avatar Section */}
            <div className="profile-avatar-section">
              <div className="avatar-wrapper">
                <div className="avatar">
                  <img
                    src={getImageSource('image')}
                    alt={getDisplayName()}
                    onError={(e) => {
                      e.target.src = "https://www.catholicsingles.com/wp-content/uploads/2020/06/blog-header-3.png";
                    }}
                  />
                  <div className={`status-indicator ${formData.seller_profile.verified ? 'verified' : 'unverified'}`}></div>
                </div>
                <input
                  ref={el => fileInputRefs.current.image = el}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileSelect('image', e)}
                />
                <button
                  className="s-avatar-upload"
                  onClick={() => fileInputRefs.current.image?.click()}
                  title="Upload profile image"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" />
                    <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <div className="profile-info">
                <h2 className="profile-name">{getDisplayName()}</h2>
                <p className="profile-email">{formData.email}</p>
                <div className={`verification-badge ${formData.seller_profile.verified ? 'verified' : 'unverified'}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    {formData.seller_profile.verified && (
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    )}
                  </svg>
                  {formData.seller_profile.verified ? "Verified" : "Not Verified"}
                </div>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="completion-section">
              <div className="completion-header">
                <span>Profile Completion</span>
                <span className="completion-percentage">{profileCompletion}%</span>
              </div>
              <div className="completion-bar">
                <div className="completion-fill" style={{ width: `${profileCompletion}%` }}></div>
              </div>
              <p className="completion-note">Complete your profile to unlock all seller features</p>
            </div>

            {/* Performance Stats */}
            <div className="profile-stats-grid">
              {performanceStats.map(stat => (
                <StatCard key={stat.id} stat={stat} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="profile-right">
          {/* Tabs */}
          <div className="profile-tabs">
            <button
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`tab-btn ${activeTab === 'business' ? 'active' : ''}`}
              onClick={() => setActiveTab('business')}
            >
              Business Info
            </button>
            <button
              className={`tab-btn ${activeTab === 'kyc' ? 'active' : ''}`}
              onClick={() => setActiveTab('kyc')}
            >
              KYC Documents
            </button>
            <button
              className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="overview-content">
                <div className="info-section">
                  <h3 className="section-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    Personal Information
                  </h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>First Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="edit-input"
                          value={formData.first_name}
                          onChange={(e) => handleInputChange('first_name', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{formData.first_name || "Not set"}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Last Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="edit-input"
                          value={formData.last_name}
                          onChange={(e) => handleInputChange('last_name', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{formData.last_name || "Not set"}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Display Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="edit-input"
                          value={formData.display_name}
                          onChange={(e) => handleInputChange('display_name', e.target.value)}
                          placeholder="Optional"
                        />
                      ) : (
                        <div className="info-value">{formData.display_name || "Not set"}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Email Address</label>
                      <div className="info-value">{formData.email}</div>
                    </div>
                    <div className="info-item">
                      <label>Phone Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          className="edit-input"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{formData.phone || "Not set"}</div>
                      )}
                    </div>
                    <div className="info-item full-width">
                      <label>Bio / Description</label>
                      {isEditing ? (
                        <textarea
                          className="edit-input"
                          value={formData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          rows="3"
                          placeholder="Tell buyers about yourself..."
                        />
                      ) : (
                        <div className="info-value">{formData.bio || "No bio added yet"}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Business Info Tab */}
            {activeTab === 'business' && (
              <div className="business-content">
                <div className="info-section">
                  <h3 className="section-title">Business Details</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Business Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="edit-input"
                          value={formData.seller_profile.business_name}
                          onChange={(e) => handleSellerProfileChange('business_name', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{formData.seller_profile.business_name || "Not set"}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Business Registration Number</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="edit-input"
                          value={formData.seller_profile.business_reg_no}
                          onChange={(e) => handleSellerProfileChange('business_reg_no', e.target.value)}
                        />
                      ) : (
                        <div className="info-value">{formData.seller_profile.business_reg_no || "Not set"}</div>
                      )}
                    </div>
                    <div className="info-item full-width">
                      <label>Verification Status</label>
                      <div className="info-value">
                        <span className={`verification-status ${formData.seller_profile.verified ? 'verified' : 'pending'}`}>
                          {formData.seller_profile.verified ? "✓ Verified" : "⏳ Pending Verification"}
                        </span>
                        {!formData.seller_profile.verified && (
                          <p className="verification-note">Complete KYC verification to get verified seller status</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* KYC Documents Tab */}
            {activeTab === 'kyc' && (
              <div className="kyc-content">
                <div className="info-section">
                  <h3 className="section-title">Identity Verification Documents</h3>
                  <p className="section-subtitle">
                    Upload your documents to complete KYC verification. All documents are securely encrypted.
                  </p>

                  <div className="documents-grid">
                    <DocumentCard documentType="id_front" title="ID Card - Front" />
                    <DocumentCard documentType="id_back" title="ID Card - Back" />
                    <DocumentCard documentType="driving_license_front" title="Driving License - Front" />
                    <DocumentCard documentType="driving_license_back" title="Driving License - Back" />
                    <DocumentCard documentType="passport_front" title="Passport" />
                  </div>
                  <div className="kyc-actions">
                    <button
                      className="action-button primary"
                      onClick={handleKycUpload}
                      disabled={kycUploading}
                    >
                      {kycUploading ? 'Uploading...' : 'Upload KYC Documents'}
                    </button>
                  </div>
                  <div className="kyc-instructions">
                    <h4>Instructions:</h4>
                    <ul>
                      <li>Upload clear, high-quality images</li>
                      <li>Ensure all text is readable</li>
                      <li>File size should be less than 5MB</li>
                      <li>Accepted formats: JPG, PNG</li>
                      <li>Click "Save Changes" to upload all selected documents</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="settings-content">
                <div className="info-section">
                  <h3 className="section-title">Security Settings</h3>
                  <div className="settings-grid">
                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Change Password</h4>
                        <p>Update your account password</p>
                      </div>
                      <button
                        className="action-btn outline small"
                        onClick={() => navigate('/seller/change-password')}
                      >
                        Change
                      </button>
                    </div>
                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Two-Factor Authentication</h4>
                        <p>Add extra security to your account</p>
                      </div>
                      <button className="action-btn outline small">Enable</button>
                    </div>
                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Email Notifications</h4>
                        <p>Receive updates about orders and promotions</p>
                      </div>
                      <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="danger-zone">
                  <h3 className="section-title">Account Actions</h3>
                  <div className="danger-actions">
                    <button
                      className="danger-btn"
                      onClick={() => {
                        dispatch(logout());
                        navigate('/signin', { replace: true });
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="2" />
                        <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Logout
                    </button>
                    <button
                      className="danger-btn red"
                      onClick={handleDeleteAccount}
                      disabled={loading}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6h18M5 6l1 13a2 2 0 002 2h8a2 2 0 002-2l1-13M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;