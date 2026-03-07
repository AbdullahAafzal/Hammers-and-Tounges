import React from 'react'
import './AdminFinance.css'

const AdminFinance = () => {
  return (
    <div className="finance-dashboard">
      <main className="finance-main">
        <div className="finance-container">
          <div className="finance-under-construction">
            <div className="finance-uc-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="finance-uc-title">Under Construction</h2>
            <p className="finance-uc-subtitle">Milestone 2</p>
            <p className="finance-uc-desc">This section is coming soon. Check back later.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminFinance
