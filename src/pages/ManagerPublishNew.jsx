import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminService } from '../services/interceptors/admin.service';
import { auctionService } from '../services/interceptors/auction.service';
import { toast } from 'react-toastify';
import './ManagerPublishNew.css';

const MAX_IMAGES = 8;

const ManagerPublishNew = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const { eventId, event } = location.state || {};

  const [sellers, setSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    seller: '',
    title: '',
    description: '',
    category: '',
    initial_price: '',
    reserve_price: '',
    stc_eligible: false,
    specific_data: '',
  });

  const [images, setImages] = useState([]); // { id, file, label }

  // Redirect if no event context
  useEffect(() => {
    if (!eventId) {
      toast.info('Please select an event first.');
      navigate('/manager/dashboard');
    }
  }, [eventId, navigate]);

  // Fetch sellers and categories from admin flow
  useEffect(() => {
    if (!eventId) return;
    let cancelled = false;
    (async () => {
      setLoadingData(true);
      try {
        const [usersRes, catsRes] = await Promise.all([
          adminService.getUsersList({ role: 'seller', page_size: 200 }),
          adminService.getCategories(),
        ]);
        if (cancelled) return;
        const userList = usersRes?.results || [];
        const sellerList = userList.filter((u) => u.role === 'seller');
        setSellers(sellerList);
        const catList = Array.isArray(catsRes) ? catsRes : catsRes?.results || catsRes?.data || [];
        setCategories(catList);
      } catch (err) {
        if (!cancelled) {
          console.error('Error loading sellers/categories:', err);
          toast.error('Failed to load sellers and categories.');
        }
      } finally {
        if (!cancelled) setLoadingData(false);
      }
    })();
    return () => { cancelled = true; };
  }, [eventId]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleImageUpload = useCallback((files) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith('image/'));
    const remaining = MAX_IMAGES - images.length;
    const toAdd = valid.slice(0, remaining).map((file) => ({
      id: Date.now() + Math.random(),
      file,
      label: file.name.replace(/\.[^/.]+$/, ''),
    }));
    setImages((prev) => [...prev, ...toAdd]);
  }, [images.length]);

  const removeImage = useCallback((id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  const updateImageLabel = useCallback((id, label) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, label } : img))
    );
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      handleImageUpload(e.dataTransfer.files);
    },
    [handleImageUpload]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.add('mpn-drag-active');
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('mpn-drag-active');
  }, []);

  const buildFormData = useCallback(
    (status = 'DRAFT') => {
      const fd = new FormData();
      fd.append('seller', formData.seller);
      fd.append('title', formData.title);
      fd.append('description', formData.description);
      fd.append('category', formData.category);
      fd.append('auction_event', eventId);
      fd.append('initial_price', formData.initial_price || '0');
      fd.append('reserve_price', formData.reserve_price || '0');
      fd.append('stc_eligible', formData.stc_eligible ? 'true' : 'false');
      fd.append('status', status);
      if (formData.specific_data?.trim()) {
        try {
          JSON.parse(formData.specific_data);
          fd.append('specific_data', formData.specific_data.trim());
        } catch {
          fd.append('specific_data', JSON.stringify({ note: formData.specific_data }));
        }
      }
      images.forEach((img, idx) => {
        fd.append(`image_${idx + 1}`, img.file);
        fd.append('media_labels', img.label || `Image ${idx + 1}`);
      });
      return fd;
    },
    [formData, eventId, images]
  );

  const handleSubmit = useCallback(
    async (status = 'DRAFT') => {
      if (!eventId) return;
      if (!formData.seller || !formData.title || !formData.description || !formData.category) {
        toast.error('Please fill in required fields: Seller, Title, Description, Category.');
        return;
      }
      const initial = parseFloat(formData.initial_price);
      if (isNaN(initial) || initial < 0) {
        toast.error('Please enter a valid initial price.');
        return;
      }
      setSubmitting(true);
      try {
        const fd = buildFormData(status);
        await auctionService.createLot(fd);
        toast.success('Lot created successfully.');
        navigate(`/manager/event/${eventId}`, { state: { event } });
      } catch (err) {
        const msg =
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          'Failed to create lot.';
        toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
      } finally {
        setSubmitting(false);
      }
    },
    [eventId, event, formData, buildFormData, navigate]
  );

  const handleSaveDraft = useCallback(() => handleSubmit('DRAFT'), [handleSubmit]);
  const handlePublish = useCallback(() => handleSubmit('DRAFT'), [handleSubmit]);

  const handleBack = useCallback(() => {
    if (eventId) {
      navigate(`/manager/event/${eventId}`, { state: { event } });
    } else {
      navigate('/manager/dashboard');
    }
  }, [eventId, event, navigate]);

  if (!eventId) return null;

  if (loadingData) {
    return (
      <div className="mpn-container mpn-loading-screen">
        <div className="mpn-spinner" />
        <p>Loading sellers and categories...</p>
      </div>
    );
  }

  return (
    <div className="mpn-container">
      <header className="mpn-header">
        <div className="mpn-header-content">
          <div>
            <button
              type="button"
              className="mpn-btn mpn-btn-back"
              onClick={handleBack}
              aria-label="Back to event"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-5-7 5-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>
            <h1 className="mpn-title">Create Lot</h1>
            <p className="mpn-subtitle">
              {event?.title ? `Event: ${event.title}` : 'Add a new lot to this event'}
            </p>
          </div>
          <button
            type="button"
            className="mpn-btn mpn-btn-outline"
            onClick={handleSaveDraft}
            disabled={submitting}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2" />
              <path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" strokeWidth="2" />
            </svg>
            {submitting ? 'Saving...' : 'Save Draft'}
          </button>
        </div>
      </header>

      <div className="mpn-main-grid">
        <div className="mpn-left-column">
          <div className="mpn-card">
            <div className="mpn-card-header">
              <h2 className="mpn-card-title">Lot Details</h2>
            </div>

            <div className="mpn-form-group">
              <label className="mpn-form-label">
                Seller <span className="mpn-required">*</span>
              </label>
              <select
                className="mpn-select"
                name="seller"
                value={formData.seller}
                onChange={handleChange}
                required
              >
                <option value="">Select a seller</option>
                {sellers.map((s) => (
                  <option key={s.id} value={s.seller_details?.id ?? s.id}>
                    {s.full_name || s.email || `Seller #${s.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="mpn-form-group">
              <label className="mpn-form-label">
                Lot Title <span className="mpn-required">*</span>
              </label>
              <input
                type="text"
                className="mpn-input"
                placeholder="e.g., 2015 Toyota Hilux"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mpn-form-group">
              <label className="mpn-form-label">
                Description <span className="mpn-required">*</span>
              </label>
              <textarea
                className="mpn-textarea"
                placeholder="Describe the lot in detail..."
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
              <div className="mpn-textarea-counter">{formData.description.length}/2000</div>
            </div>

            <div className="mpn-form-group">
              <label className="mpn-form-label">
                Category <span className="mpn-required">*</span>
              </label>
              <select
                className="mpn-select"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name || c.slug || `Category #${c.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="mpn-form-row">
              <div className="mpn-form-group">
                <label className="mpn-form-label">
                  Initial Price ($) <span className="mpn-required">*</span>
                </label>
                <div className="mpn-input-with-prefix">
                  <span className="mpn-input-prefix">$</span>
                  <input
                    type="number"
                    className="mpn-input"
                    placeholder="0.00"
                    name="initial_price"
                    value={formData.initial_price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div className="mpn-form-group">
                <label className="mpn-form-label">Reserve Price ($)</label>
                <div className="mpn-input-with-prefix">
                  <span className="mpn-input-prefix">$</span>
                  <input
                    type="number"
                    className="mpn-input"
                    placeholder="0.00"
                    name="reserve_price"
                    value={formData.reserve_price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            <div className="mpn-toggle-group">
              <div className="mpn-toggle-content">
                <div className="mpn-toggle-label">
                  <span className="mpn-toggle-title">STC Eligible</span>
                  <span className="mpn-toggle-description">Subject to Confirmation</span>
                </div>
                <label className="mpn-switch">
                  <input
                    type="checkbox"
                    name="stc_eligible"
                    checked={formData.stc_eligible}
                    onChange={handleChange}
                  />
                  <span className="mpn-slider" />
                </label>
              </div>
            </div>

            <div className="mpn-form-group">
              <label className="mpn-form-label">Specific Data (JSON)</label>
              <textarea
                className="mpn-textarea mpn-textarea-json"
                placeholder='{"mileage": 150000, "transmission": "Automatic"}'
                name="specific_data"
                value={formData.specific_data}
                onChange={handleChange}
                rows={2}
              />
            </div>
          </div>
        </div>

        <div className="mpn-right-column">
          <div className="mpn-card">
            <div className="mpn-card-header">
              <h2 className="mpn-card-title">Images & Media</h2>
              {images.length > 0 && (
                <span className="mpn-image-count">{images.length}/{MAX_IMAGES}</span>
              )}
            </div>

            <div
              className={`mpn-drop-area ${images.length > 0 ? 'mpn-has-images' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="mpn-drop-area-content">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <div className="mpn-drop-area-text">
                  <p className="mpn-drop-area-title">Drop images here or click to upload</p>
                  <p className="mpn-drop-area-subtitle">JPG, PNG, GIF up to 5MB each (max {MAX_IMAGES})</p>
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

            {images.length > 0 && (
              <div className="mpn-image-grid">
                {images.map((img) => (
                  <div key={img.id} className="mpn-image-preview">
                    <img
                      src={URL.createObjectURL(img.file)}
                      alt={img.label}
                      className="mpn-preview-img"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      className="mpn-remove-image"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(img.id);
                      }}
                      aria-label={`Remove ${img.label}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                    <input
                      type="text"
                      className="mpn-image-label"
                      placeholder="Label"
                      value={img.label}
                      onChange={(e) => updateImageLabel(img.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mpn-card">
            <div className="mpn-card-header">
              <h2 className="mpn-card-title">Publishing</h2>
            </div>
            <div className="mpn-publish-actions">
              <button
                type="button"
                className="mpn-btn mpn-btn-primary mpn-btn-publish"
                onClick={handlePublish}
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create Lot'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerPublishNew;
