import React from 'react'
import './SummaryCard.css'

function SummaryCard({ listings, seller}) {

    return (

        <div className="summary-cards">
            <div className="summary-card active-summary">
                <div className="card-background-gradient" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.4) 50%, rgba(59, 130, 246, 0.05) 100%)' }}></div>
                <div className="card-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: 'rgba(59, 130, 246, 0.4)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className="card-content">
                    <span className="card-label">{seller.activeLabel}</span>
                    <span className="card-value">{seller.activeListings}</span>
                    <span className="card-sublabel">{seller.activeSubLabel}</span>
                </div>
            </div>

            <div className="summary-card">
                <div className="card-background-gradient" style={{ background: 'linear-gradient(135deg, rgba(140, 198, 63, 0.4) 50%, rgba(140, 198, 63, 0.05) 100%)' }}></div>
                <div className="card-icon" style={{ backgroundColor: 'rgba(140, 198, 63, 0.2)', borderColor: 'rgba(140, 198, 63, 0.4)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="#8CC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 21V5C8 4.46957 8.21071 3.96086 8.58579 3.58579C8.96086 3.21071 9.46957 3 10 3H14C14.5304 3 15.0391 3.21071 15.4142 3.58579C15.0391 3.96086 15 4.46957 15 5V21" stroke="#8CC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 10V14" stroke="#8CC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 12H15" stroke="#8CC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className="card-content">
                    <span className="card-label">{seller.soldLabel}</span>
                    <span className="card-value">{seller.itemsSold}</span>
                    <span className="card-sublabel">{seller.soldSubLabel}</span>
                </div>
            </div>

            <div className="summary-card" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                <div className="card-background-gradient" style={{ background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.4) 50%, rgba(255, 193, 7, 0.05) 100%)' }}></div>
                <div className="card-icon" style={{ backgroundColor: 'rgba(255, 193, 7, 0.25)', borderColor: 'rgba(255, 193, 7, 0.5)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6312 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6312 13.6815 18 14.5717 18 15.5C18 16.4283 17.6312 17.3185 16.9749 17.9749C16.3185 18.6312 15.4283 19 14.5 19H6" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className="card-content">
                    <span className="card-label">{seller.revenueLabel}</span>
                    <span className="card-value currency">{ '$1,233.00'}</span>
                    <span className="card-sublabel">{seller.revenueSubLabel}</span>
                </div>
            </div>

            <div className="summary-card" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                <div className="card-background-gradient" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4) 50%, rgba(139, 92, 246, 0.05) 100%)' }}></div>
                <div className="card-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)', borderColor: 'rgba(139, 92, 246, 0.4)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 8V16" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 12H16" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className="card-content">
                    <span className="card-label">{seller.pendingLabel}</span>
                    <span className="card-value currency" style={{ color: '#8B5CF6' }}>$1,534.00</span>
                    <span className="card-sublabel">{seller.pendingSubLabel}</span>
                </div>
            </div>
        </div>
    )
}

export default SummaryCard