import React, { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'
import './KYCVerification.css'

const KYCVerification = () => {
  const navigate = useNavigate()
  const [documents, setDocuments] = useState({
    idFront: { file: null, preview: null, status: null, rejectionReason: null },
    idBack: { file: null, preview: null, status: null, rejectionReason: null },
    proofOfAddress: { file: null, preview: null, status: null, rejectionReason: null }
  })

  const calculateProgress = () => {
    const totalDocuments = 3
    const uploadedCount = Object.values(documents).filter(doc => doc.file !== null).length
    const percentage = Math.round((uploadedCount / totalDocuments) * 100)
    return percentage
  }

  const progress = calculateProgress()

  const handleFileChange = (docType, e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setDocuments(prev => ({
          ...prev,
          [docType]: {
            ...prev[docType],
            file: file,
            preview: reader.result,
            status: 'pending'
          }
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (docType, e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setDocuments(prev => ({
          ...prev,
          [docType]: {
            ...prev[docType],
            file: file,
            preview: reader.result,
            status: 'pending'
          }
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemove = (docType) => {
    setDocuments(prev => ({
      ...prev,
      [docType]: { file: null, preview: null, status: null, rejectionReason: null }
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submitting KYC documents', documents)
    
    navigate( '/seller-dashboard', {
      state: documents
    } )

  }

  const handleSkip = () => {
    navigate('/seller-dashboard')
  }

  const getStatusBadge = (status) => {
    if (!status) return null

    if (status === 'approved') {
      return (
        <div className="status-badge approved">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Approved
        </div>
      )
    } else if (status === 'rejected') {
      return (
        <div className="status-badge rejected">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Rejected
        </div>
      )
    } else if (status === 'pending') {
      return (
        <div className="status-badge pending">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Pending
        </div>
      )
    }
    return null
  }

  return (
    <div className="kyc-page">
      <div className="kyc-header-top">
        <div className="kyc-header-left">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <Link to="/" className="kyc-logo">
            <img src={logo} alt="Hammers & Tongues Logo" />
            <span>Hammers & Tongues</span>
          </Link>
        </div>
      </div>
      <div className="kyc-container">
        <div className="kyc-header">
          <h1 className="kyc-title">Document Verification</h1>
          <div className="kyc-progress">
            <div className="progress-info">
              <span className="progress-text">Step 2 of 3</span>
              <span className="progress-percentage">{progress}% Complete</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>

        <div className="kyc-content">
          <div className="kyc-intro">
            <h2 className="kyc-subtitle">Verification Documents</h2>
            <p className="kyc-description">
              To ensure the security of our auction platform, please upload the following documents.
              Your information is kept confidential and secure.
            </p>
          </div>

          <form className="kyc-form" onSubmit={handleSubmit}>
            <div className="document-section">
              <div className="document-preview">
                {documents.idFront.preview ? (
                  <img src={documents.idFront.preview} alt="ID Front" />
                ) : (
                  <div className="document-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="document-details">
                <h3 className="document-title">National ID (Front)</h3>
                <p className="document-instructions">
                  Upload a clear picture of the front of your ID. Accepted formats: JPG, PNG, PDF.
                </p>
                {documents.idFront.status && (
                  <div className="document-status">
                    {getStatusBadge(documents.idFront.status)}
                    {documents.idFront.rejectionReason && (
                      <p className="rejection-reason">{documents.idFront.rejectionReason}</p>
                    )}
                  </div>
                )}
              </div>
              <div className="document-actions">
                <label className="replace-button">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange('idFront', e)}
                    style={{ display: 'none' }}
                  />
                  Replace
                </label>
                {documents.idFront.file && (
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleRemove('idFront')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="document-section">
              <div className="document-preview">
                {documents.idBack.preview ? (
                  <img src={documents.idBack.preview} alt="ID Back" />
                ) : (
                  <div className="document-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="document-details">
                <h3 className="document-title">National ID (Back)</h3>
                <p className="document-instructions">
                  Upload a clear picture of the back of your ID. Accepted formats: JPG, PNG, PDF.
                </p>
                {documents.idBack.status && (
                  <div className="document-status">
                    {getStatusBadge(documents.idBack.status)}
                    {documents.idBack.rejectionReason && (
                      <p className="rejection-reason">{documents.idBack.rejectionReason}</p>
                    )}
                  </div>
                )}
              </div>
              <div className="document-actions">
                <label className="replace-button">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange('idBack', e)}
                    style={{ display: 'none' }}
                  />
                  Replace
                </label>
                {documents.idBack.file && (
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleRemove('idBack')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="document-section">
              {documents.proofOfAddress.preview ? (
                <>
                  <div className="document-preview">
                    <img src={documents.proofOfAddress.preview} alt="Proof of Address" />
                  </div>
                  <div className="document-details">
                    <h3 className="document-title">Proof of Address</h3>
                    <p className="document-instructions">
                      Drag & drop your file here or click to browse. Accepted formats: JPG, PNG, PDF.
                    </p>
                    {documents.proofOfAddress.status && (
                      <div className="document-status">
                        {getStatusBadge(documents.proofOfAddress.status)}
                        {documents.proofOfAddress.rejectionReason && (
                          <p className="rejection-reason">{documents.proofOfAddress.rejectionReason}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="document-actions">
                    <label className="replace-button">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange('proofOfAddress', e)}
                        style={{ display: 'none' }}
                      />
                      Replace
                    </label>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleRemove('proofOfAddress')}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </>
              ) : (
                <div
                  className="document-upload-area"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop('proofOfAddress', e)}
                >
                  <div className="upload-content">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h3 className="upload-title">Proof of Address</h3>
                    <p className="upload-instructions">
                      Drag & drop your file here or click to browse. Accepted formats: JPG, PNG, PDF.
                    </p>
                    <label className="browse-button">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange('proofOfAddress', e)}
                        style={{ display: 'none' }}
                      />
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M3 15C3 17.2091 4.79086 19 7 19H17C19.2091 19 21 17.2091 21 15V9C21 6.79086 19.2091 5 17 5H7C4.79086 5 3 6.79086 3 9V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 12V9M12 9L9 12M12 9L15 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Browse files
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="kyc-form-actions">
              <button 
                type="button" 
                className="skip-button"
                onClick={handleSkip}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M13 17L18 12L13 7M6 17L11 12L6 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Skip for Now
              </button>
              <button type="submit" className="submit-verification-button">
                Submit for Verification
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default KYCVerification