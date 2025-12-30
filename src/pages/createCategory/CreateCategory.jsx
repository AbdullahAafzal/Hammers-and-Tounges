import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateCategory.css';

const CreateCategory = () => {
    const [categoryData, setCategoryData] = useState({
        name: '',
        description: '',
        icon: '📦',
        iconColor: '#8CC63F',
        image: null,
        imagePreview: null,
        status: 'active',
        parentCategory: '',
        showInNavigation: true,
        seoTitle: '',
        seoDescription: '',
        seoKeywords: ''
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCategoryData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };


    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            const maxSize = 2 * 1024 * 1024;

            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, image: 'Please upload JPG, PNG, or WebP image' }));
                return;
            }

            if (file.size > maxSize) {
                setErrors(prev => ({ ...prev, image: 'Image must be less than 2MB' }));
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setCategoryData(prev => ({
                    ...prev,
                    image: file,
                    imagePreview: reader.result
                }));
            };
            reader.readAsDataURL(file);
            setErrors(prev => ({ ...prev, image: '' }));
        }
    };

    const removeImage = () => {
        setCategoryData(prev => ({
            ...prev,
            image: null,
            imagePreview: null
        }));
    };


    const handleNext = () => {
        navigate('/admin/product-fields')
    };

    return (
        <div className="create-category-page">
            <main className="create-category-main">
                <div className="create-category-container">
                    <div className="add-category-header">
                        <div className="header-content">
                            <h1 className="add-category-page-title">Create New Category</h1>
                            <p className="add-category-page-subtitle">Add a new auction category with custom settings and product fields</p>
                        </div>
                        <div className="header-actions">
                            <button className="secondary-btn" onClick={() => navigate('/admin/category')}>
                                Cancel
                            </button>
                        </div>
                    </div>

                    <div className="category-form-section">
                        <div className="form-card">
                            <div className="form-content">
                                <div className="form-grid">
                                    <div>
                                        <label className="form-label required">Category Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={categoryData.name}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Vehicles, Electronics, Furniture"
                                            className={`form-input ${errors.name ? 'error' : ''}`}
                                        />
                                        {errors.name && (
                                            <span className="error-message">{errors.name}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label required">Description</label>
                                    <textarea
                                        name="description"
                                        value={categoryData.description}
                                        onChange={handleInputChange}
                                        placeholder="Describe this category in detail..."
                                        className={`form-textarea ${errors.description ? 'error' : ''}`}
                                        rows="4"
                                    />
                                    {errors.description && (
                                        <span className="error-message">{errors.description}</span>
                                    )}
                                    <div className="textarea-info">
                                        <span className="char-count">{categoryData.description.length}/500 characters</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="section-header">
                                        <h4 className="section-title">Category Image</h4>
                                        <span className="section-hint">Recommended: 800x600px</span>
                                    </div>

                                    <div className="image-upload-section">
                                        {categoryData.imagePreview ? (
                                            <div className="image-preview">
                                                <img src={categoryData.imagePreview} alt="Category preview" />
                                                <button
                                                    type="button"
                                                    className="remove-image-btn"
                                                    onClick={removeImage}
                                                    aria-label="Remove image"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="image-upload-area">
                                                <div className="upload-content">
                                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                        <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2" />
                                                        <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                    </svg>
                                                    <h4 className="upload-title">Upload Category Image</h4>
                                                    <p className="upload-text">Drag & drop or click to browse</p>
                                                    <input
                                                        type="file"
                                                        id="categoryImage"
                                                        accept=".jpg,.jpeg,.png,.webp"
                                                        onChange={handleImageUpload}
                                                        className="file-input"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => document.getElementById('categoryImage').click()}
                                                        className="browse-btn"
                                                    >
                                                        Select Image
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {errors.image && (
                                            <span className="error-message">{errors.image}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="primary-action-btn"
                                        onClick={handleNext}
                                    >
                                        Next
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreateCategory;