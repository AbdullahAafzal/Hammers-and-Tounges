import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./InspectionAdmin.css";

const InspectionAdmin = () => {
  const location = useLocation();
  console.log('location: ', location);
  
  const isStart = location?.state?.startInspection;
  console.log('Is Start: ', isStart);
  
  const [open, setOpen] = useState(null);
  const [mainImage, setMainImage] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const [generalRating, setGeneralRating] = useState(7);
  const [conditionSummary, setConditionSummary] = useState("Good");
  const [exteriorNotes, setExteriorNotes] = useState("");
  const [interiorNotes, setInteriorNotes] = useState("");
  const [finalNotes, setFinalNotes] = useState("");
  const [files, setFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  const toggle = (index) => setOpen(open === index ? null : index);

  const images = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs9aiIdnu7FwBk8z2OuOvu1jI7ntYTDdjldQ&s",
    "https://www.dubicars.com/images/31937b/w_1300x760/target-motors-fze/781e24ac-e639-41e1-8947-a1baa1cdbf8b.jpg",
    "https://i.ytimg.com/vi/oECQIz0u4m8/hqdefault.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-ZmZbDfvfebT0of5BybJVk0S7KpOGTuSikA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2NfOVBW4HGBMkdqh1uhLity0Rah6pGH8icw&s"
  ];

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

  const handleApprove = () => {
    const dataToSave = {
      generalRating,
      conditionSummary,
      exteriorNotes,
      interiorNotes,
      finalNotes,
      files: files.map(file => file.name)
    };

    localStorage.setItem("inspectionData", JSON.stringify(dataToSave));
    alert("Inspection data saved!");
    navigate("/admin-panel");
  };

  const handleReject = () => {
    navigate("/admin-panel");
  };

  return (
    <div className="dashboard-page">

      <main className="dashboard-main">
        <div className="dashboard-container">
          <div className="inspection-page">
            <div className="inspection-header">
              <div className="welcome-content">
                <h1 className="welcome-title">Vehicle Inspection Review</h1>
                <p className="welcome-subtitle">Review and approve vehicle inspection details</p>
              </div>
              {
                isStart ? (
              <div className="inspection-actions">
                <button className="action-button secondary" onClick={handleReject}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Reject
                </button>
                <button className="action-button primary" onClick={handleApprove}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Approve Inspection
                </button>
              </div>

                ) : (
              <div className="inspection-actions"> 
                 <button className="action-button primary" onClick={()=> navigate('/manager-panel')}>
                  
                  Go Back
                </button>
              </div>

                )
              }
            </div>

            <div className="inspection-layout">
              <div className="inspection-left">
                <div className="vehicle-image-section">
                  <div className="vehicle-main-image">
                    <img
                      src={images[mainImage]}
                      alt="Vehicle"
                      className="main-image"
                      onClick={() => setImagePreview(images[mainImage])}
                    />
                  </div>
                  <div className="vehicle-thumbnails">
                    {images.map((img, index) => (
                      <div
                        key={index}
                        className={`thumbnail-container ${mainImage === index ? 'active' : ''}`}
                        onClick={() => setMainImage(index)}
                      >
                        <img src={img} alt={`Thumbnail ${index + 1}`} />
                      </div>
                    ))}
                  </div>

                  <div className="vehicle-details">
                    <h3 className="vehicle-title">2018 Toyota Hilux SR5</h3>
                    <div className="vehicle-meta">
                      <div className="meta-item">
                        <span className="meta-label">Item ID:</span>
                        <span className="meta-value">GHI789</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Category:</span>
                        <span className="meta-value">Vehicles</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Mileage:</span>
                        <span className="meta-value">45,000 miles</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Owner:</span>
                        <span className="meta-value">John Smith</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="inspection-right">

                {isStart ?
                  (
                    <div className="inspection-form">
                      <div className="form-section">
                        <div className="form-header">
                          <h3>Inspection Checklist</h3>
                          <p className="form-subtitle">Review and provide feedback for each category</p>
                        </div>

                        <div className="inspection-accordions">
                          <div className="accordion-item">
                            <div className="accordion-header" onClick={() => toggle(1)}>
                              <div className="accordion-title">
                                <div className="accordion-icon">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </div>
                                <span>General Condition</span>
                              </div>
                              <div className="accordion-arrow">
                                {open === 1 ? (
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
                            {open === 1 && (
                              <div className="accordion-content">
                                <div className="form-group">
                                  <label className="form-label">
                                    Overall Rating: <span className="rating-value">{generalRating}/10</span>
                                  </label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    value={generalRating}
                                    onChange={(e) => setGeneralRating(Number(e.target.value))}
                                    className="rating-slider"
                                  />
                                  <div className="rating-marks">
                                    <span>Poor</span>
                                    <span>Fair</span>
                                    <span>Good</span>
                                    <span>Very Good</span>
                                    <span>Excellent</span>
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label className="form-label">Condition Summary</label>
                                  <select
                                    className="form-select"
                                    value={conditionSummary}
                                    onChange={(e) => setConditionSummary(e.target.value)}
                                  >
                                    <option value="Poor">Poor</option>
                                    <option value="Fair">Fair</option>
                                    <option value="Good">Good</option>
                                    <option value="Very Good">Very Good</option>
                                    <option value="Excellent">Excellent</option>
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="accordion-item">
                            <div className="accordion-header" onClick={() => toggle(2)}>
                              <div className="accordion-title">
                                <div className="accordion-icon">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M1 12H4M20 12H23M12 1V4M12 20V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </div>
                                <span>Exterior / Cosmetic Inspection</span>
                              </div>
                              <div className="accordion-arrow">
                                {open === 2 ? (
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
                            {open === 2 && (
                              <div className="accordion-content">
                                <div className="form-group">
                                  <label className="form-label">Notes & Observations</label>
                                  <textarea
                                    className="form-textarea"
                                    rows="4"
                                    placeholder="Describe any exterior damage, paint issues, bodywork, etc."
                                    value={exteriorNotes}
                                    onChange={(e) => setExteriorNotes(e.target.value)}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="accordion-item">
                            <div className="accordion-header" onClick={() => toggle(3)}>
                              <div className="accordion-title">
                                <div className="accordion-icon">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21M19 21L21 21M19 21H14M5 21L3 21M5 21H10M9 7H15M9 11H15M10 21V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V21M10 21H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </div>
                                <span>Interior / Mechanical Inspection</span>
                              </div>
                              <div className="accordion-arrow">
                                {open === 3 ? (
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
                            {open === 3 && (
                              <div className="accordion-content">
                                <div className="form-group">
                                  <label className="form-label">Notes & Observations</label>
                                  <textarea
                                    className="form-textarea"
                                    rows="4"
                                    placeholder="Describe interior condition, mechanical issues, electronics, etc."
                                    value={interiorNotes}
                                    onChange={(e) => setInteriorNotes(e.target.value)}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="accordion-item">
                            <div className="accordion-header" onClick={() => toggle(4)}>
                              <div className="accordion-title">
                                <div className="accordion-icon">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </div>
                                <span>Upload Inspection Images</span>
                                {uploadedImages.length > 0 && (
                                  <span className="upload-count">{uploadedImages.length}</span>
                                )}
                              </div>
                              <div className="accordion-arrow">
                                {open === 4 ? (
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
                            {open === 4 && (
                              <div className="accordion-content">
                                <div className="upload-section">
                                  <div className="upload-area" onClick={() => document.getElementById('file-upload').click()}>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <p>Click to upload inspection images</p>
                                    <span className="upload-hint">Images • JPG, PNG, JPEG</span>
                                    <input
                                      id="file-upload"
                                      type="file"
                                      multiple
                                      accept="image/*"
                                      onChange={handleFileUpload}
                                      style={{ display: 'none' }}
                                    />
                                  </div>

                                  {uploadedImages.length > 0 && (
                                    <div className="uploaded-images">
                                      <h4 className="uploaded-title">Uploaded Images</h4>
                                      <div className="image-grid">
                                        {uploadedImages.map((image) => (
                                          <div key={image.id} className="uploaded-image-item">
                                            <img src={image.url} alt={image.name} />
                                            <button
                                              className="remove-image"
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

                          <div className="accordion-item">
                            <div className="accordion-header" onClick={() => toggle(5)}>
                              <div className="accordion-title">
                                <div className="accordion-icon">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </div>
                                <span>Final Assessment & Notes</span>
                              </div>
                              <div className="accordion-arrow">
                                {open === 5 ? (
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
                            {open === 5 && (
                              <div className="accordion-content">
                                <div className="form-group">
                                  <label className="form-label">Final Inspection Summary</label>
                                  <textarea
                                    className="form-textarea"
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
                      </div>
                    </div>

                  ) : (
                    <div className="inspection-form">
                      <div className="form-header">
                        <h3>Inspection Report</h3>
                        <p className="form-subtitle">Review and check the rejection reason.</p>
                      </div>
                      <div className="inspection-accordions">
                        {/* Here you print the message of rejection by manager of any product which was came for inspection to the manager. */}
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </main>

      {imagePreview && (
        <div className="image-preview-modal" onClick={() => setImagePreview(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setImagePreview(null)}>
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

export default InspectionAdmin;