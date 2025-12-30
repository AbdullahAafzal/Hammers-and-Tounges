import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './ManagerProductFields.css';

const ManagerProductFields = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    id: categoryId,
    name: 'Vehicles',
    icon: '🚗',
    iconColor: '#3B82F6'
  });

  const [fields, setFields] = useState([
    { id: 1, name: 'Make', type: 'text', required: true, placeholder: 'e.g., Toyota, Honda', sortOrder: 1 },
    { id: 2, name: 'Model', type: 'text', required: true, placeholder: 'e.g., Camry, Civic', sortOrder: 2 },
    { id: 3, name: 'Year', type: 'number', required: true, placeholder: 'e.g., 2020', sortOrder: 3 },
    { id: 4, name: 'Mileage', type: 'number', required: false, placeholder: 'e.g., 45000', sortOrder: 4 },
    { id: 5, name: 'Condition', type: 'select', required: true, options: ['New', 'Used', 'Refurbished'], sortOrder: 5 },
    { id: 6, name: 'Color', type: 'text', required: false, placeholder: 'e.g., Red, Blue', sortOrder: 6 },
  ]);

  const [newField, setNewField] = useState({
    name: '',
    type: 'text',
    required: false,
    placeholder: '',
    options: ''
  });

  const [editingField, setEditingField] = useState(null);
  const [showFieldForm, setShowFieldForm] = useState(false);
  const [errors, setErrors] = useState({});

  const fieldTypes = [
    { value: 'text', label: 'Text Field', icon: '📝' },
    { value: 'number', label: 'Number', icon: '🔢' },
    { value: 'select', label: 'Dropdown', icon: '📋' },
    { value: 'checkbox', label: 'Checkbox', icon: '☑️' },
    { value: 'textarea', label: 'Text Area', icon: '📄' },
    { value: 'date', label: 'Date', icon: '📅' },
    { value: 'file', label: 'File Upload', icon: '📎' },
    { value: 'email', label: 'Email', icon: '✉️' },
    { value: 'url', label: 'URL', icon: '🔗' },
    { value: 'color', label: 'Color Picker', icon: '🎨' },
    { value: 'range', label: 'Range Slider', icon: '🎚️' },
    { value: 'tel', label: 'Phone Number', icon: '📞' },
  ];

  const handleNewFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewField(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateField = (field) => {
    const newErrors = {};

    if (!field.name.trim()) {
      newErrors.name = 'Field name is required';
    } else if (field.name.length < 2) {
      newErrors.name = 'Field name must be at least 2 characters';
    }

    if (field.type === 'select' && !field.options.trim()) {
      newErrors.options = 'Options are required for dropdown fields';
    }

    return newErrors;
  };

  const handleAddField = () => {
    const errors = validateField(newField);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const fieldData = {
      id: Date.now(),
      name: newField.name,
      type: newField.type,
      required: newField.required,
      placeholder: newField.placeholder,
      sortOrder: fields.length + 1,
      ...(newField.type === 'select' && {
        options: newField.options.split(',').map(opt => opt.trim()).filter(opt => opt)
      })
    };

    setFields(prev => [...prev, fieldData]);
    setNewField({
      name: '',
      type: 'text',
      required: false,
      placeholder: '',
      options: ''
    });
    setShowFieldForm(false);
    setErrors({});
  };

  const handleEditField = (field) => {
    setEditingField(field);
    setNewField({
      name: field.name,
      type: field.type,
      required: field.required,
      placeholder: field.placeholder || '',
      options: field.options ? field.options.join(', ') : ''
    });
    setShowFieldForm(true);
  };

  const handleUpdateField = () => {
    const errors = validateField(newField);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    setFields(prev => prev.map(field =>
      field.id === editingField.id
        ? {
          ...field,
          name: newField.name,
          type: newField.type,
          required: newField.required,
          placeholder: newField.placeholder,
          ...(newField.type === 'select' && {
            options: newField.options.split(',').map(opt => opt.trim()).filter(opt => opt)
          })
        }
        : field
    ));

    setEditingField(null);
    setNewField({
      name: '',
      type: 'text',
      required: false,
      placeholder: '',
      options: ''
    });
    setShowFieldForm(false);
    setErrors({});
  };

  const handleDeleteField = (id) => {
    if (window.confirm('Are you sure you want to delete this field? This will affect all products in this category.')) {
      setFields(prev => prev.filter(field => field.id !== id));
    }
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newIndex) => {
    e.preventDefault();
    const oldIndex = e.dataTransfer.getData('text/plain');

    if (oldIndex !== newIndex) {
      const newFields = [...fields];
      const [movedField] = newFields.splice(oldIndex, 1);
      newFields.splice(newIndex, 0, movedField);

      const updatedFields = newFields.map((field, index) => ({
        ...field,
        sortOrder: index + 1
      }));

      setFields(updatedFields);
    }
  };

  const handleSaveFields = () => {
    console.log('Saving fields:', fields);
    alert('Product fields saved successfully!');
    navigate('/admin/categories');
  };

  const getFieldTypeIcon = (type) => {
    const typeInfo = fieldTypes.find(t => t.value === type);
    return typeInfo ? typeInfo.icon : '📝';
  };

  const getFieldTypeLabel = (type) => {
    const typeInfo = fieldTypes.find(t => t.value === type);
    return typeInfo ? typeInfo.label : 'Text Field';
  };

  return (
    <div className="dashboard-page">
      <main className="dashboard-main">
        <div className="dashboard-container">
          <div className="manage-fields-header">
            <div className="category-details">
              <h1 className="manage-field-page-title">Manage Product Fields</h1>
              <p className="manage-field-page-subtitle">
                Configure custom fields for products in <strong>{category.name}</strong> category
              </p>
            </div>
            <div className="header-actions">
              <button
                className="secondary-btn"
                onClick={() => navigate('/admin/category')}
              >
                Back to Categories
              </button>
              <button
                className="primary-action-btn"
                onClick={handleSaveFields}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Save All Changes
              </button>
            </div>
          </div>

          <div className="fields-management-section">
            <div className="section-card">
              <div className="section-header">
                <h3 className="section-title">Current Fields ({fields.length})</h3>
                <div className="section-description">
                  Drag to reorder fields. Required fields will be marked with asterisk (*) on seller forms.
                </div>
              </div>

              <div className="fields-list">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="field-item"
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <div className="field-drag-handle">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M8 7H20M8 12H20M8 17H20M4 7V7.01M4 12V12.01M4 17V17.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="field-icon">
                      <span className="field-type-icon">{getFieldTypeIcon(field.type)}</span>
                    </div>
                    <div className="field-content">
                      <div className="field-header">
                        <h4 className="field-name">
                          {field.name}
                          {field.required && <span className="required-asterisk">*</span>}
                        </h4>
                        <div className="field-meta">
                          <span className="field-type">{getFieldTypeLabel(field.type)}</span>
                          {field.placeholder && (
                            <span className="field-placeholder">Placeholder: {field.placeholder}</span>
                          )}
                        </div>
                      </div>
                      {field.type === 'select' && field.options && (
                        <div className="field-options">
                          <span className="options-label">Options:</span>
                          <div className="options-list">
                            {field.options.map((option, idx) => (
                              <span key={idx} className="option-tag">{option}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="field-actions">
                      <button
                        className="field-action-btn field-edit-btn"
                        onClick={() => handleEditField(field)}
                        title="Edit field"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button
                        className="field-action-btn field-delete-btn"
                        onClick={() => handleDeleteField(field.id)}
                        title="Delete field"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`field-form-section ${showFieldForm ? 'expanded' : ''}`}>
              <div className="section-card">
                <div className="section-header">
                  <h3 className="section-title">
                    {editingField ? 'Edit Field' : 'Add New Field'}
                  </h3>
                  {!showFieldForm && (
                    <button
                      className="add-field-btn"
                      onClick={() => setShowFieldForm(true)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Add New Field
                    </button>
                  )}
                </div>

                {showFieldForm && (
                  <div className="field-form">
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label required">Field Name</label>
                        <input
                          type="text"
                          name="name"
                          value={newField.name}
                          onChange={handleNewFieldChange}
                          placeholder="e.g., Model, Serial Number, Condition"
                          className={`form-input ${errors.name ? 'error' : ''}`}
                        />
                        {errors.name && (
                          <span className="error-message">{errors.name}</span>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label required">Field Type</label>
                        <div className="field-type-grid">
                          {fieldTypes.map((type) => (
                            <button
                              key={type.value}
                              type="button"
                              className={`field-type-item ${newField.type === type.value ? 'selected' : ''
                                }`}
                              onClick={() => setNewField(prev => ({ ...prev, type: type.value }))}
                            >
                              <span className="type-icon">{type.icon}</span>
                              <span className="type-label">{type.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {newField.type === 'select' && (
                      <div className="form-section">
                        <div className="form-group">
                          <label className="form-label required">Dropdown Options</label>
                          <textarea
                            name="options"
                            value={newField.options}
                            onChange={handleNewFieldChange}
                            placeholder="Enter options separated by commas (e.g., New, Used, Refurbished)"
                            className={`form-textarea ${errors.options ? 'error' : ''}`}
                            rows="3"
                          />
                          {errors.options && (
                            <span className="error-message">{errors.options}</span>
                          )}
                          <div className="textarea-info">
                            <span className="hint-text">Options will appear as dropdown choices</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Placeholder Text</label>
                        <input
                          type="text"
                          name="placeholder"
                          value={newField.placeholder}
                          onChange={handleNewFieldChange}
                          placeholder="Optional hint text for the field"
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Field Settings</label>
                        <div className="field-settings">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              name="required"
                              checked={newField.required}
                              onChange={handleNewFieldChange}
                              className="checkbox-input"
                            />
                            <span className="checkbox-custom"></span>
                            <span className="checkbox-text">Required Field</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="secondary-action-btn"
                        onClick={() => {
                          setShowFieldForm(false);
                          setEditingField(null);
                          setNewField({
                            name: '',
                            type: 'text',
                            required: false,
                            placeholder: '',
                            options: ''
                          });
                          setErrors({});
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="primary-action-btn"
                        onClick={editingField ? handleUpdateField : handleAddField}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {editingField ? 'Update Field' : 'Add Field'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="preview-section">
              <div className="section-card">
                <div className="section-header">
                  <h3 className="section-title">Seller Form Preview</h3>
                  <div className="section-description">
                    How the fields will appear to sellers when adding products
                  </div>
                </div>

                <div className="preview-form">
                  <div className="preview-header">
                    <h4 className="preview-title">Add New Product - {category.name}</h4>
                    <p className="preview-subtitle">Required fields are marked with *</p>
                  </div>

                  <div className="preview-fields">
                    {fields.map(field => (
                      <div key={field.id} className="preview-field">
                        <label className="preview-label">
                          {field.name}
                          {field.required && <span className="required-asterisk">*</span>}
                        </label>
                        {field.type === 'text' && (
                          <input
                            type="text"
                            className="preview-input"
                            placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`}
                            disabled
                          />
                        )}
                        {field.type === 'number' && (
                          <input
                            type="number"
                            className="preview-input"
                            placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`}
                            disabled
                          />
                        )}
                        {field.type === 'select' && (
                          <select className="preview-select" disabled>
                            <option value="">Select {field.name.toLowerCase()}</option>
                            {field.options?.map((option, idx) => (
                              <option key={idx} value={option}>{option}</option>
                            ))}
                          </select>
                        )}
                        {field.type === 'textarea' && (
                          <textarea
                            className="preview-textarea"
                            placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`}
                            rows="3"
                            disabled
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagerProductFields;