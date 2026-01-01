import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ManagerPublishNew.css";

const ManagerPublishNew = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    lotNumber: "",
    startingBid: "",
    description: "",
    auction: "",
    reservePrice: false,
    images: [],
  });

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleImageUpload = useCallback((files) => {
    const validImages = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );
    
    const fileArray = validImages.slice(0, 8).map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file),
      size: (file.size / 1024 / 1024).toFixed(2), // MB
    }));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...fileArray],
    }));
  }, []);

  const removeImage = useCallback((id) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id),
    }));
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    handleImageUpload(e.dataTransfer.files);
  }, [handleImageUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.add('mpn-drag-active');
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('mpn-drag-active');
  }, []);

  const handleSaveDraft = useCallback(() => {
    localStorage.setItem("draftLot", JSON.stringify(formData));
    navigate("/manager/auctions");
  }, [formData, navigate]);

  const handlePublish = useCallback(() => {
    localStorage.setItem("publishedLot", JSON.stringify(formData));
    navigate("/manager/auctions");
  }, [formData, navigate]);

  const handlePreview = useCallback(() => {
    // Preview logic here
    console.log("Previewing lot:", formData);
  }, [formData]);

  return (
    <div className="mpn-container">
      {/* Header */}
      <header className="mpn-header">
        <div className="mpn-header-content">
          <div>
            <h1 className="mpn-title">Publish New Lot</h1>
            <p className="mpn-subtitle">Create and publish a new auction lot with detailed information</p>
          </div>
          <button className="mpn-btn mpn-btn-outline" onClick={handleSaveDraft}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2"/>
              <path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Save Draft
          </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="mpn-main-grid">
        {/* Left Column - Lot Details */}
        <div className="mpn-left-column">
          <div className="mpn-card">
            <div className="mpn-card-header">
              <h2 className="mpn-card-title">Lot Details</h2>
            </div>
            
            <div className="mpn-form-group">
              <label className="mpn-form-label">
                Lot Title
                <span className="mpn-required">*</span>
              </label>
              <input
                type="text"
                className="mpn-input"
                placeholder="Enter a descriptive title for your lot"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <div className="mpn-input-hint">Be specific and descriptive</div>
            </div>

            <div className="mpn-form-row">
              <div className="mpn-form-group">
                <label className="mpn-form-label">
                  Lot Number
                  <span className="mpn-required">*</span>
                </label>
                <input
                  type="text"
                  className="mpn-input"
                  placeholder="e.g., L-1024"
                  name="lotNumber"
                  value={formData.lotNumber}
                  onChange={handleChange}
                  required
                />
                <div className="mpn-input-hint">Unique identifier for this lot</div>
              </div>
              
              <div className="mpn-form-group">
                <label className="mpn-form-label">
                  Starting Bid ($)
                  <span className="mpn-required">*</span>
                </label>
                <div className="mpn-input-with-prefix">
                  <span className="mpn-input-prefix">$</span>
                  <input
                    type="number"
                    className="mpn-input"
                    placeholder="0.00"
                    name="startingBid"
                    value={formData.startingBid}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="mpn-input-hint">Minimum starting bid amount</div>
              </div>
            </div>

            <div className="mpn-form-group">
              <label className="mpn-form-label">
                Lot Description
                <span className="mpn-required">*</span>
              </label>
              <textarea
                className="mpn-textarea"
                placeholder="Describe the lot in detail. Include condition, specifications, history, and any important notes..."
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
              <div className="mpn-textarea-counter">
                {formData.description.length}/2000 characters
              </div>
            </div>

            <div className="mpn-form-group">
              <label className="mpn-form-label">
                Assign to Auction
                <span className="mpn-required">*</span>
              </label>
              <select
                className="mpn-select"
                name="auction"
                value={formData.auction}
                onChange={handleChange}
                required
              >
                <option value="">Select an auction</option>
                <option value="vehicle-auction">Vehicle Auction</option>
                <option value="property-auction">Property Auction</option>
                <option value="art-auction">Art & Collectibles</option>
                <option value="electronics-auction">Electronics Auction</option>
              </select>
              <div className="mpn-input-hint">Choose the auction category for this lot</div>
            </div>

            <div className="mpn-toggle-group">
              <div className="mpn-toggle-content">
                <div className="mpn-toggle-label">
                  <span className="mpn-toggle-title">Set Reserve Price</span>
                  <span className="mpn-toggle-description">
                    Enable to set a minimum price that must be met for the lot to sell
                  </span>
                </div>
                <label className="mpn-switch">
                  <input
                    type="checkbox"
                    name="reservePrice"
                    checked={formData.reservePrice}
                    onChange={handleChange}
                  />
                  <span className="mpn-slider"></span>
                </label>
              </div>
              {formData.reservePrice && (
                <div className="mpn-reserve-input">
                  <label className="mpn-form-label">Reserve Price ($)</label>
                  <div className="mpn-input-with-prefix">
                    <span className="mpn-input-prefix">$</span>
                    <input
                      type="number"
                      className="mpn-input"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Images & Publishing */}
        <div className="mpn-right-column">
          {/* Image Upload Card */}
          <div className="mpn-card">
            <div className="mpn-card-header">
              <h2 className="mpn-card-title">Images & Media</h2>
              {formData.images.length > 0 && (
                <span className="mpn-image-count">{formData.images.length}/8 images</span>
              )}
            </div>

            <div
              className={`mpn-drop-area ${formData.images.length > 0 ? 'mpn-has-images' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="mpn-drop-area-content">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <div className="mpn-drop-area-text">
                  <p className="mpn-drop-area-title">Drop images here or click to upload</p>
                  <p className="mpn-drop-area-subtitle">JPG, JPEG, PNG, GIF up to 5MB each</p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="mpn-file-input"
              />
            </div>

            {/* Image Preview Grid */}
            {formData.images.length > 0 && (
              <div className="mpn-image-grid">
                {formData.images.map((img) => (
                  <div key={img.id} className="mpn-image-preview">
                    <img
                      src={img.url}
                      alt={img.name}
                      className="mpn-preview-img"
                      loading="lazy"
                    />
                    <button
                      className="mpn-remove-image"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(img.id);
                      }}
                      aria-label={`Remove ${img.name}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                    <div className="mpn-image-info">
                      <span className="mpn-image-name">{img.name}</span>
                      <span className="mpn-image-size">{img.size} MB</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Publishing Card */}
          <div className="mpn-card">
            <div className="mpn-card-header">
              <h2 className="mpn-card-title">Publishing</h2>
            </div>

            <div className="mpn-status-section">
              <div className="mpn-status-row">
                <span className="mpn-status-label">Current Status</span>
                <span className="mpn-status-value mpn-status-draft">Draft</span>
              </div>
              <div className="mpn-status-row">
                <span className="mpn-status-label">Last Updated</span>
                <span className="mpn-status-value">Just now</span>
              </div>
            </div>

            <div className="mpn-publish-actions">
              <button className="mpn-btn mpn-btn-primary mpn-btn-publish" onClick={handlePublish}>
                Publish Lot
              </button>
              
              <button className="mpn-btn mpn-btn-outline mpn-btn-preview" onClick={handlePreview}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Preview Lot
              </button>
            </div>

            <div className="mpn-publishing-note">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1" fill="currentColor"/>
              </svg>
              <p>Once published, the lot will be visible to all bidders and can't be edited</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerPublishNew;