import React, { useState } from 'react';
import './ManualPayment.css'
import { useNavigate } from 'react-router-dom';
export default function ManualPaymentEntry() {
  const [formData, setFormData] = useState({
    referenceId: '',
    paymentMethod: 'Bank Transfer',
    paymentAmount: '',
    remarks: '',
    proofFile: null
  });

  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (validTypes.includes(file.type)) {
      setFormData(prev => ({
        ...prev,
        proofFile: file
      }));
    } else {
      alert('Please upload a PDF, JPG, or PNG file');
    }
  };

  const handleSubmit = () => {
    if (!formData.referenceId || !formData.paymentAmount || !formData.proofFile) {
      alert('Please fill in all required fields and upload proof of payment');
      return;
    }
    console.log('Form submitted:', formData);
    alert('Payment recorded successfully!');
  };

  const handleCancel = () => {
    setFormData({
      referenceId: '',
      paymentMethod: 'Bank Transfer',
      paymentAmount: '',
      remarks: '',
      proofFile: null
    });
    navigate('/finance')
  };

  return (
    <div className="payment-container">
      <div className="form-wrapper">
        <h1 className="form-title">Manual Payment Entry</h1>
        
        <div className="form-content">
          <div className="form-group">
            <label className="form-label">Reference ID</label>
            <input
              type="text"
              name="referenceId"
              value={formData.referenceId}
              onChange={handleInputChange}
              placeholder="e.g., Invoice #INV-12345 or Customer ID"
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Cash">Cash</option>
                <option value="Check">Check</option>
                <option value="PayPal">PayPal</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Amount</label>
              <input
                type="text"
                name="paymentAmount"
                value={formData.paymentAmount}
                onChange={handleInputChange}
                placeholder="$ 0.00"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <div 
              className={`upload-area ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="upload-content">
                <h3 className="upload-title">Proof of Payment</h3>
                <p className="upload-text">
                  Drag & drop files here or click to browse. Supports PDF, JPG, PNG.
                </p>
                <input
                  type="file"
                  id="fileInput"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <button 
                  type="button"
                  onClick={() => document.getElementById('fileInput').click()}
                  className="browse-button"
                >
                  Browse Files
                </button>
                {formData.proofFile && (
                  <p className="file-name">
                    Selected: {formData.proofFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              placeholder="Optional notes about this payment"
              className="form-textarea"
              rows="4"
            />
          </div>
          <div className='row-button'>


          <div className="button-row">
            <button 
              type="button"
              onClick={handleCancel}
              className="cancel-button"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleSubmit}
              className="submit-button"
            >
              Record Payment
            </button>
          </div>
          </div>

        </div>
      </div>
    </div>
  );
}