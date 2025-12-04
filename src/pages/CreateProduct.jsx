import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './CreateProduct.css'
import SellerHeader from '../components/SellerHeader'

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    startingPrice: '',
    reservePrice: '',
    auctionDuration: '7',
    condition: 'excellent',
    shippingOptions: {
      localPickup: true,
      domesticShipping: true,
      internationalShipping: false
    },
    images: []
  })

  const categories = [
    'Furniture',
    'Home Decor',
    'Lighting',
    'Art',
    'Kitchenware',
    'Electronics',
    'Collectibles',
    'Jewelry',
    'Other'
  ]

  const conditions = [
    { value: 'brand_new', label: 'Brand New' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'needs_work', label: 'Needs Work' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleShippingChange = (option) => {
    setFormData(prev => ({
      ...prev,
      shippingOptions: {
        ...prev.shippingOptions,
        [option]: !prev.shippingOptions[option]
      }
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const imageUrls = files.map(file => URL.createObjectURL(file))
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }))
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <div className="seller-page">
      <SellerHeader />

      <main className="seller-main">
        <div className="page-container">
          <div className="page-header">
            <div className="page-title-section">
              <h1 className="page-title">Create New Product</h1>
              <p className="page-subtitle">Fill in the details to list your item for auction</p>
            </div>
            <div className="page-actions">
              <Link to="/seller/auction-listings" className="secondary-button">
                Cancel
              </Link>
            </div>
          </div>

          <div className="form-container">
            <form onSubmit={handleSubmit} className="listing-form">
              <div className="form-section">
                <h2 className="form-section-title">Basic Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Product Title *
                      <span className="form-hint">Be descriptive to attract buyers</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g., Vintage Leather Armchair, Excellent Condition"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">
                      Description *
                      <span className="form-hint">Include details about condition, dimensions, history, etc.</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="form-textarea"
                      rows="6"
                      placeholder="Describe your item in detail..."
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2 className="form-section-title">Pricing & Auction Settings</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Starting Price *
                      <span className="form-hint">Minimum bid to start the auction</span>
                    </label>
                    <div className="input-with-prefix">
                      <span className="input-prefix">$</span>
                      <input
                        type="number"
                        name="startingPrice"
                        value={formData.startingPrice}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Reserve Price (Optional)
                      <span className="form-hint">Hidden minimum price to win</span>
                    </label>
                    <div className="input-with-prefix">
                      <span className="input-prefix">$</span>
                      <input
                        type="number"
                        name="reservePrice"
                        value={formData.reservePrice}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Auction Duration *</label>
                    <select
                      name="auctionDuration"
                      value={formData.auctionDuration}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="1">1 day</option>
                      <option value="3">3 days</option>
                      <option value="7">7 days</option>
                      <option value="14">14 days</option>
                      <option value="30">30 days</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2 className="form-section-title">Images</h2>
                <div className="images-section">
                  <div className="images-upload-area">
                    <input
                      type="file"
                      id="image-upload"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="image-upload-input"
                    />
                    <label htmlFor="image-upload" className="image-upload-label">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Upload Images</span>
                      <p className="upload-hint">Drag & drop or click to browse</p>
                      <p className="upload-subhint">Up to 12 images, 5MB each</p>
                    </label>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="images-preview">
                      {formData.images.map((image, index) => (
                        <div key={index} className="image-preview-item">
                          <img src={image} alt={`Preview ${index + 1}`} />
                          <button
                            type="button"
                            className="remove-image-button"
                            onClick={() => removeImage(index)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          {index === 0 && <span className="primary-badge">Primary</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-section">
                <h2 className="form-section-title">Additional Details</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Condition</label>
                    <div className="condition-buttons">
                      {conditions.map(condition => (
                        <button
                          key={condition.value}
                          type="button"
                          className={`condition-button ${formData.condition === condition.value ? 'active' : ''}`}
                          onClick={() => setFormData(prev => ({ ...prev, condition: condition.value }))}
                        >
                          {condition.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Shipping Options</label>
                    <div className="shipping-options">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.shippingOptions.localPickup}
                          onChange={() => handleShippingChange('localPickup')}
                          className="checkbox-input"
                        />
                        <span className="checkbox-custom"></span>
                        <span className="checkbox-text">Local Pickup Available</span>
                      </label>

                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.shippingOptions.domesticShipping}
                          onChange={() => handleShippingChange('domesticShipping')}
                          className="checkbox-input"
                        />
                        <span className="checkbox-custom"></span>
                        <span className="checkbox-text">Domestic Shipping</span>
                      </label>

                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.shippingOptions.internationalShipping}
                          onChange={() => handleShippingChange('internationalShipping')}
                          className="checkbox-input"
                        />
                        <span className="checkbox-custom"></span>
                        <span className="checkbox-text">International Shipping</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="secondary-button">
                  Save as Draft
                </button>
                <div className="form-actions-right">
                  <button type="submit" className="primary-button large">
                    Preview & List Item
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CreateProduct