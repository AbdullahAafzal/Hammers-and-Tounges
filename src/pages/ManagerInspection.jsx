import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import { managerService } from '../services/interceptors/manager.service';
import { API_CONFIG, getMediaUrl } from '../config/api.config';
import "./ManagerInspection.css";

const ManagerInspection = () => {
  const location = useLocation();
  const isStart = location?.state?.startInspection;
  const auctionData = location?.state?.auctionData;

  const [open, setOpen] = useState(null);
  const [mainImage, setMainImage] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  // Checklist state
  const [checklistCategories, setChecklistCategories] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [loadingChecklist, setLoadingChecklist] = useState(false);

  const [generalRating, setGeneralRating] = useState(7);
  const [conditionSummary, setConditionSummary] = useState("Good");
  const [exteriorNotes, setExteriorNotes] = useState("");
  const [interiorNotes, setInteriorNotes] = useState("");
  const [finalNotes, setFinalNotes] = useState("");
  const [files, setFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New fields for approval section
  const [overallRating, setOverallRating] = useState(0);
  const [initialPrice, setInitialPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [buyNowPrice, setBuyNowPrice] = useState("");
  const [isBuyNowEnabled, setIsBuyNowEnabled] = useState(false);

  // Get images from auctionData media
  const images = useMemo(() => {
    if (auctionData?.media?.length > 0) {
      const imageMedia = auctionData.media
        .filter(m => m.file && m.media_type !== 'file')
        .map(m => {
          const filePath = m.file || m.image || m;
          return getMediaUrl(filePath);
        })
        .filter(url => url !== null);

      return imageMedia;
    }
    return [];
  }, [auctionData?.media]);

  useEffect(() => {
    setMainImage(0);
  }, [images]);
  console.log(auctionData, 'aaaaaaaaaaaaaaaaaaa');
  

  // Get seller name
  const sellerName = auctionData?.seller_details?.name || 'Unknown Seller';

  // Get manager name
  const firstName = auctionData?.manager_details?.first_name ;
  const managerName = firstName + ' ' + auctionData?.manager_details?.last_name ;

  // Get category name
  const categoryName = auctionData?.category_name || 'Unknown';

  // Get item title
  const itemTitle = auctionData?.title || 'Unknown Item';

  // Get item description
  const itemDescription = auctionData?.description || '';

  // Get item ID
  const itemId = auctionData?.id ? `INSP-${auctionData.id}` : 'N/A';

  // Fetch checklist on component mount
  useEffect(() => {
    const fetchChecklist = async () => {
      if (!isStart || !categoryName) return;

      try {
        setLoadingChecklist(true);
        const checklists = await managerService.getChecklists();

        if (Array.isArray(checklists) && checklists.length > 0) {
          const normalizedCategoryName = categoryName.toLowerCase().trim();

          const matchingChecklist = checklists.find(cl => {
            if (!cl.title) return false;
            const checklistTitle = cl.title.trim().toLowerCase();
            return checklistTitle === `${normalizedCategoryName} inspection` ||
              checklistTitle === normalizedCategoryName ||
              checklistTitle.startsWith(normalizedCategoryName);
          });

          if (matchingChecklist && matchingChecklist.template_data && typeof matchingChecklist.template_data === 'object') {
            const categories = Object.entries(matchingChecklist.template_data).map(([name, items], index) => ({
              id: `category-${index}`,
              name,
              items: Array.isArray(items) ? items.map((item, itemIndex) => ({
                id: `item-${index}-${itemIndex}`,
                name: typeof item === 'string' ? item : item.name || String(item)
              })) : []
            }));
            setChecklistCategories(categories);
          } else {
            setChecklistCategories([]);
          }
        } else {
          setChecklistCategories([]);
        }
      } catch (error) {
        console.error('Failed to load checklist:', error);
        setChecklistCategories([]);
      } finally {
        setLoadingChecklist(false);
      }
    };

    fetchChecklist();
  }, [isStart, categoryName]);

  const toggle = (index) => setOpen(open === index ? null : index);

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newImages = selectedFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));

    setUploadedImages(prev => [...prev, ...newImages]);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeUploadedImage = (id) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const handleCheckboxChange = (categoryName, itemName, itemId) => {
    const key = `${categoryName}-${itemId}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleApprove = async () => {
    if (isSubmitting) return;

    if (!auctionData?.id) {
      toast.error("Auction ID is missing. Cannot submit inspection.");
      return;
    }

    if (!overallRating || !initialPrice || !startDate || !endDate) {
      toast.error("Please fill in all required fields: Overall Rating, Initial Price, Start Date, and End Date.");
      return;
    }

    setIsSubmitting(true);
    try {
      const checklistData = {};
      checklistCategories.forEach((category) => {
        const categoryData = {};
        category.items.forEach((item) => {
          const key = `${category.name}-${item.id}`;
          categoryData[item.name] = checkedItems[key] || false;
        });
        if (Object.keys(categoryData).length > 0) {
          checklistData[category.name] = categoryData;
        }
      });

      const inspectionData = {
        decision: "APPROVED",
        overall_rating: parseFloat(overallRating),
        admin_feedback: finalNotes || "",
        checklist_data: checklistData,
        initial_price: parseFloat(initialPrice),
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
        buy_now_price: buyNowPrice ? parseFloat(buyNowPrice) : null,
        is_buy_now_enabled: isBuyNowEnabled ? "True" : "False",
        inspection_images: files
      };

      const response = await managerService.performInspection(auctionData.id, inspectionData);
      toast.success("Inspection approved successfully!");

      setTimeout(() => {
        navigate("/manager/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Error submitting inspection:", error);
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to submit inspection. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (isSubmitting) return;

    if (!auctionData?.id) {
      toast.error("Auction ID is missing.");
      return;
    }

    setIsSubmitting(true);
    try {
      const checklistData = {};
      checklistCategories.forEach((category) => {
        const categoryData = {};
        category.items.forEach((item) => {
          const key = `${category.name}-${item.id}`;
          categoryData[item.name] = checkedItems[key] || false;
        });
        if (Object.keys(categoryData).length > 0) {
          checklistData[category.name] = categoryData;
        }
      });

      const inspectionData = {
        decision: "REJECTED",
        admin_feedback: finalNotes || "Inspection rejected by manager.",
        checklist_data: checklistData,
        inspection_images: files,
        overall_rating: parseFloat(overallRating),
      };

      const response = await managerService.performInspection(auctionData?.id, inspectionData);
      toast.success("Inspection rejected successfully!");

      setTimeout(() => {
        navigate("/manager/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Error submitting inspection rejection:", error);
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to submit inspection rejection. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get specific data for display
  const getSpecificData = () => {
    if (!auctionData?.specific_data) return {};
    return auctionData.specific_data;
  };

  const specificData = getSpecificData();

  // Helper function to format field names
  const formatFieldName = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="manager-inspection-dashboard">
      <main className="manager-inspection-main">
        <div className="manager-inspection-container">
          <div className="manager-inspection-page">
            <div className="manager-inspection-header">
              <div className="manager-inspection-welcome-content">
                <h1 className="manager-inspection-welcome-title">{categoryName} Inspection Review</h1>
                <p className="manager-inspection-welcome-subtitle">Review and approve {categoryName.toLowerCase()} inspection details</p>
              </div>
              {
                isStart ? (
                  <div className="manager-inspection-actions">
                    <button
                      type="button"
                      className="manager-inspection-action-button secondary"
                      onClick={handleReject}
                      disabled={isSubmitting}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Reject
                    </button>
                    <button
                      type="button"
                      className="manager-inspection-action-button primary"
                      onClick={handleApprove}
                      disabled={isSubmitting}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Approve Inspection
                    </button>
                  </div>
                ) : (
                  <div className="manager-inspection-actions">
                    <button className="manager-inspection-action-button primary" onClick={() => navigate('/manager/dashboard')}>
                      Go Back
                    </button>
                  </div>
                )
              }
            </div>

            <div className="manager-inspection-layout">
              <div className="manager-inspection-left">
                <div className="manager-inspection-image-section">
                  {images?.length > 0 ? (
                    <>
                      <div className="manager-inspection-main-image">
                        <img
                          src={images?.[mainImage] || images?.[0]}
                          alt={itemTitle}
                          className="manager-inspection-main-image"
                          onClick={() => setImagePreview(images?.[mainImage] || images?.[0])}
                        />
                      </div>
                      {images?.length > 1 && (
                        <div className="manager-inspection-thumbnails">
                          {images?.map((img, index) => (
                            <div
                              key={index}
                              className={`manager-inspection-thumbnail-container ${mainImage === index ? 'active' : ''}`}
                              onClick={() => setMainImage(index)}
                            >
                              <img src={img} alt={`Thumbnail ${index + 1}`} />
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="manager-inspection-main-image">
                      <div className="manager-inspection-no-image-placeholder">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <p>No images available</p>
                      </div>
                    </div>
                  )}

                  <div className="manager-inspection-details">
                    <h3 className="manager-inspection-title">{itemTitle}</h3>
                    {itemDescription && (
                      <p className="manager-inspection-description">{itemDescription}</p>
                    )}
                    <div className="manager-inspection-meta">
                      <div className="manager-inspection-meta-item">
                        <span className="manager-inspection-meta-label">Item ID:</span>
                        <span className="manager-inspection-meta-value">{itemId}</span>
                      </div>
                      <div className="manager-inspection-meta-item">
                        <span className="manager-inspection-meta-label">Category:</span>
                        <span className="manager-inspection-meta-value">{categoryName}</span>
                      </div>
                      <div className="manager-inspection-meta-item">
                        <span className="manager-inspection-meta-label">Seller:</span>
                        <span className="manager-inspection-meta-value">{sellerName}</span>
                      </div>
                      <div className="manager-inspection-meta-item">
                        <span className="manager-inspection-meta-label">Assigned Manager:</span>
                        <span className="manager-inspection-meta-value">{managerName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Auction Details Section */}
                <div className="manager-inspection-auction-details-card">
                  <div className="manager-inspection-details-header">
                    <div className="manager-inspection-details-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3>Auction Details</h3>
                  </div>

                  <div className="manager-inspection-details-grid">
                    <div className="manager-inspection-detail-item">
                      <span className="manager-inspection-detail-label">Status</span>
                      <span className={`manager-inspection-status-badge manager-inspection-status-${auctionData?.status?.toLowerCase() || 'pending'}`}>
                        {auctionData?.status || 'Pending'}
                      </span>
                    </div>

                    <div className="manager-inspection-detail-item">
                      <span className="manager-inspection-detail-label">Total Bids</span>
                      <span className="manager-inspection-detail-value">{auctionData?.total_bids || 0}</span>
                    </div>

                    {/* <div className="manager-inspection-detail-item">
                      <span className="manager-inspection-detail-label">Expected Price</span>
                      <span className="manager-inspection-detail-value manager-inspection-price">
                        {auctionData?.currency || 'USD'} {parseFloat(auctionData?.seller_expected_price || 0).toLocaleString()}
                      </span>
                    </div> */}

                    <div className="manager-inspection-detail-item">
                      <span className="manager-inspection-detail-label">Initial Price</span>
                      <span className="manager-inspection-detail-value manager-inspection-price">
                        {auctionData?.currency || 'USD'} {parseFloat(auctionData?.initial_price || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="manager-inspection-detail-item">
                      <span className="manager-inspection-detail-label">Handover Type</span>
                      <span className="manager-inspection-detail-value">{auctionData?.handover_type || 'N/A'}</span>
                    </div>

                    {auctionData?.handover_type === 'PICKUP' && auctionData?.pickup_address && (
                      <div className="manager-inspection-detail-item manager-inspection-full-width">
                        <span className="manager-inspection-detail-label">Pickup Address</span>
                        <span className="manager-inspection-detail-value">{auctionData.pickup_address}</span>
                      </div>
                    )}

                    {auctionData?.handover_type === 'DELIVERY' && auctionData?.delivery_datetime && (
                      <div className="manager-inspection-detail-item">
                        <span className="manager-inspection-detail-label">Delivery Date</span>
                        <span className="manager-inspection-detail-value">
                          {new Date(auctionData.delivery_datetime).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    <div className="manager-inspection-detail-item">
                      <span className="manager-inspection-detail-label">Start Date</span>
                      <span className="manager-inspection-detail-value">
                        {auctionData?.start_date ? new Date(auctionData.start_date).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>

                    <div className="manager-inspection-detail-item">
                      <span className="manager-inspection-detail-label">End Date</span>
                      <span className="manager-inspection-detail-value">
                        {auctionData?.end_date ? new Date(auctionData.end_date).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>

                    {auctionData?.is_buy_now_enabled && auctionData?.buy_now_price && (
                      <div className="manager-inspection-detail-item">
                        <span className="manager-inspection-detail-label">Buy Now Price</span>
                        <span className="manager-inspection-detail-value manager-inspection-price">
                          {auctionData?.currency || 'USD'} {parseFloat(auctionData.buy_now_price).toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="manager-inspection-detail-item">
                      <span className="manager-inspection-detail-label">Created At</span>
                      <span className="manager-inspection-detail-value">
                        {auctionData?.created_at ? new Date(auctionData.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>

                    {/* <div className="manager-inspection-detail-item">
                      <span className="manager-inspection-detail-label">Updated At</span>
                      <span className="manager-inspection-detail-value">
                        {auctionData?.updated_at ? new Date(auctionData.updated_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div> */}
                  </div>
                </div>

                {/* Specific Data Section - Category Specific */}
                {specificData && Object.keys(specificData).length > 0 && (
                  <div className="manager-inspection-specific-data-card">
                    <div className="manager-inspection-details-header">
                      <div className="manager-inspection-details-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <h3>{categoryName} Specifications</h3>
                    </div>

                    <div className="manager-inspection-specific-grid">
                      {Object.entries(specificData).map(([key, value]) => (
                        <div key={key} className="manager-inspection-specific-item">
                          <span className="manager-inspection-specific-label">{formatFieldName(key)}</span>
                          <span className="manager-inspection-specific-value">{value || 'N/A'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="manager-inspection-right">
                {isStart ? (
                  <div className="manager-inspection-form">
                    <div className="manager-inspection-form-section">
                      <div className="manager-inspection-form-header">
                        <h3>Inspection Checklist</h3>
                        <p className="manager-inspection-form-subtitle">Review and provide feedback for each category</p>
                      </div>

                      {loadingChecklist ? (
                        <div className="manager-inspection-loading">
                          Loading checklist...
                        </div>
                      ) : checklistCategories.length > 0 ? (
                        <div className="manager-inspection-accordions">
                          {checklistCategories.map((category, categoryIndex) => {
                            const accordionIndex = categoryIndex + 1;
                            return (
                              <div key={category.id} className="manager-inspection-accordion-item">
                                <div className="manager-inspection-accordion-header" onClick={() => toggle(accordionIndex)}>
                                  <div className="manager-inspection-accordion-title">
                                    <div className="manager-inspection-accordion-icon">
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    </div>
                                    <span>{category.name}</span>
                                    {category.items.length > 0 && (
                                      <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', opacity: 0.7 }}>
                                        ({category.items.filter(item => checkedItems[`${category.name}-${item.id}`]).length}/{category.items.length})
                                      </span>
                                    )}
                                  </div>
                                  <div className="manager-inspection-accordion-arrow">
                                    {open === accordionIndex ? (
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M6 15L12 9L18 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    ) : (
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                                {open === accordionIndex && (
                                  <div className="manager-inspection-accordion-content">
                                    {category.items.length > 0 ? (
                                      <div className="manager-inspection-checklist-items-container">
                                        {category.items.map((item) => {
                                          const checkboxKey = `${category.name}-${item.id}`;
                                          const isChecked = checkedItems[checkboxKey] || false;
                                          return (
                                            <div key={item.id} className="manager-inspection-checklist-item-row">
                                              <label className="manager-inspection-checklist-checkbox-label">
                                                <input
                                                  type="checkbox"
                                                  checked={isChecked}
                                                  onChange={() => handleCheckboxChange(category.name, item.name, item.id)}
                                                  className="manager-inspection-checklist-checkbox"
                                                />
                                                <span className="manager-inspection-checklist-item-text">{item.name}</span>
                                              </label>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    ) : (
                                      <div className="manager-inspection-checklist-empty">No items in this category</div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          {/* Upload Inspection Images section */}
                          <div className="manager-inspection-accordion-item">
                            <div className="manager-inspection-accordion-header" onClick={() => toggle(999)}>
                              <div className="manager-inspection-accordion-title">
                                <div className="manager-inspection-accordion-icon">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </div>
                                <span>Upload Inspection Images</span>
                                {uploadedImages.length > 0 && (
                                  <span className="manager-inspection-upload-count">{uploadedImages.length}</span>
                                )}
                              </div>
                              <div className="manager-inspection-accordion-arrow">
                                {open === 999 ? (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M6 15L12 9L18 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                ) : (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                            </div>
                            {open === 999 && (
                              <div className="manager-inspection-accordion-content">
                                <div className="manager-inspection-upload-section">
                                  <div className="manager-inspection-upload-area" onClick={() => document.getElementById('manager-inspection-file-upload').click()}>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <p>Click to upload inspection images</p>
                                    <span className="manager-inspection-upload-hint">Images • JPG, PNG, JPEG</span>
                                    <input
                                      id="manager-inspection-file-upload"
                                      type="file"
                                      multiple
                                      accept="image/*"
                                      onChange={handleFileUpload}
                                      style={{ display: 'none' }}
                                    />
                                  </div>

                                  {uploadedImages.length > 0 && (
                                    <div className="manager-inspection-uploaded-images">
                                      <h4 className="manager-inspection-uploaded-title">Uploaded Images</h4>
                                      <div className="manager-inspection-image-grid">
                                        {uploadedImages.map((image) => (
                                          <div key={image.id} className="manager-inspection-uploaded-image-item">
                                            <img src={image.url} alt={image.name} />
                                            <button
                                              className="manager-inspection-remove-image"
                                              onClick={() => removeUploadedImage(image.id)}
                                              aria-label="Remove image"
                                            >
                                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                              </svg>
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Final Assessment & Notes section */}
                          <div className="manager-inspection-accordion-item">
                            <div className="manager-inspection-accordion-header" onClick={() => toggle(1000)}>
                              <div className="manager-inspection-accordion-title">
                                <div className="manager-inspection-accordion-icon">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </div>
                                <span>Final Assessment & Notes</span>
                              </div>
                              <div className="manager-inspection-accordion-arrow">
                                {open === 1000 ? (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M6 15L12 9L18 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                ) : (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                            </div>
                            {open === 1000 && (
                              <div className="manager-inspection-accordion-content">
                                <div className="manager-inspection-form-group">
                                  <label className="manager-inspection-form-label">Final Inspection Summary</label>
                                  <textarea
                                    className="manager-inspection-form-textarea"
                                    rows="5"
                                    placeholder="Provide your final assessment and recommendations..."
                                    value={finalNotes}
                                    onChange={(e) => setFinalNotes(e.target.value)}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="manager-inspection-loading">
                          No checklist available for this category.
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="manager-inspection-form">
                    <div className="manager-inspection-form-header">
                      <h3>Inspection Report</h3>
                      <p className="manager-inspection-form-subtitle">Review and check the rejection reason.</p>
                    </div>
                    <div className="manager-inspection-accordions">
                      <div className="manager-inspection-rejection-report">
                        <div className="manager-inspection-rejection-section manager-inspection-row-status">
                          <h4 className="manager-inspection-rejection-title">Inspection Status</h4>
                          <p className="manager-inspection-rejection-status">❌ Rejected</p>
                        </div>

                        <div className="manager-inspection-rejection-section">
                          <h4 className="manager-inspection-rejection-title">Reason for Rejection</h4>
                          <p className="manager-inspection-rejection-text">
                            {auctionData?.rejection_reason || 'The item did not meet the minimum inspection requirements set by the management.'}
                          </p>
                        </div>

                        <div className="manager-inspection-rejection-section">
                          <h4 className="manager-inspection-rejection-title">Reviewed By</h4>
                          <p className="manager-inspection-rejection-text">
                            {managerName}<br />
                            Date: {auctionData?.updated_at ? new Date(auctionData.updated_at).toLocaleDateString() : new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Approval Details Section */}
            {isStart && (
              <div className="manager-inspection-approval-details-section">
                <div className="manager-inspection-approval-details-header">
                  <h3>Approval Details</h3>
                  <p className="manager-inspection-approval-subtitle">Fill in the required information to approve this inspection</p>
                </div>
                <div className="manager-inspection-approval-details-form">
                  <div className="manager-inspection-approval-form-grid">
                    <div className="manager-inspection-approval-form-group">
                      <label className="manager-inspection-approval-form-label">
                        Overall Rating <span className="manager-inspection-required">*</span>
                      </label>
                      <input
                        type="number"
                        className="manager-inspection-approval-form-input"
                        placeholder="e.g., 8.5"
                        min="0"
                        max="10"
                        step="0.1"
                        value={overallRating}
                        onChange={(e) => setOverallRating(e.target.value)}
                      />
                    </div>

                    <div className="manager-inspection-approval-form-group">
                      <label className="manager-inspection-approval-form-label">
                        Initial Price <span className="manager-inspection-required">*</span>
                      </label>
                      <input
                        type="number"
                        className="manager-inspection-approval-form-input"
                        placeholder="e.g., 5000.00"
                        min="0"
                        step="0.01"
                        value={initialPrice}
                        onChange={(e) => setInitialPrice(e.target.value)}
                        required
                      />
                    </div>

                    <div className="manager-inspection-approval-form-group">
                      <label className="manager-inspection-approval-form-label">
                        Start Date <span className="manager-inspection-required">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        className="manager-inspection-approval-form-input"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="manager-inspection-approval-form-group">
                      <label className="manager-inspection-approval-form-label">
                        End Date <span className="manager-inspection-required">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        className="manager-inspection-approval-form-input"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="manager-inspection-approval-form-group">
                      <label className="manager-inspection-approval-form-label">
                        Buy Now Price
                      </label>
                      <input
                        type="number"
                        className="manager-inspection-approval-form-input"
                        placeholder="e.g., 7500.00"
                        min="0"
                        step="0.01"
                        value={buyNowPrice}
                        onChange={(e) => setBuyNowPrice(e.target.value)}
                      />
                    </div>

                    <div className="manager-inspection-approval-form-group manager-inspection-checkbox-group">
                      <label className="manager-inspection-approval-checkbox-label">
                        <input
                          type="checkbox"
                          className="manager-inspection-approval-checkbox"
                          checked={isBuyNowEnabled}
                          onChange={(e) => setIsBuyNowEnabled(e.target.checked)}
                        />
                        <span>Enable Buy Now Option</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {imagePreview && (
        <div className="manager-inspection-image-preview-modal" onClick={() => setImagePreview(null)}>
          <div className="manager-inspection-modal-content" onClick={e => e.stopPropagation()}>
            <button className="manager-inspection-modal-close" onClick={() => setImagePreview(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <img src={imagePreview} alt="Preview" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerInspection;