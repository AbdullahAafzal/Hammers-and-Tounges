import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './SellerSales.css'
import { useSelector } from 'react-redux'

const SellerSales = () => {
    const [activeTab, setActiveTab] = useState('sold')
    const { isLoading } = useSelector(state => state.seller)

    // Placeholder data - will be empty by default
    const soldItems = []
    const unsoldItems = []

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount)
    }

    const LoadingSkeleton = () => (
        <div className="sales-card skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
                <div className="skeleton-line skeleton-title"></div>
                <div className="skeleton-line skeleton-text"></div>
                <div className="skeleton-line skeleton-text"></div>
            </div>
        </div>
    )

    const EmptyState = ({ title, description, actionText, actionLink }) => (
        <div className="empty-state">
            <div className="empty-state-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
                    <path d="M20.5 7.5L9 15L4 11" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 13V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V9" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="18" cy="6" r="2" />
                </svg>
            </div>
            <h3 className="empty-state-title">{title}</h3>
            <p className="empty-state-description">{description}</p>
            <Link to={actionLink} className="empty-state-action">
                {actionText}
            </Link>
        </div>
    )

    const SalesCard = ({ item }) => (
        <Link to={`/seller/sale/${item.id}`} className="sales-card">
            <div className="sales-card-image">
                <img src={item.image} alt={item.title} />
                <div className="sales-card-badge">{item.status}</div>
            </div>
            <div className="sales-card-content">
                <h3 className="sales-card-title">{item.title}</h3>
                <div className="sales-card-info">
                    <div className="sales-info-item">
                        <span className="sales-info-label">Sold Price</span>
                        <span className="sales-info-value">{formatCurrency(item.soldPrice)}</span>
                    </div>
                    <div className="sales-info-item">
                        <span className="sales-info-label">Buyer</span>
                        <span className="sales-info-value">{item.buyer}</span>
                    </div>
                </div>
                <div className="sales-card-footer">
                    <span className="sales-card-date">{item.saleDate}</span>
                </div>
            </div>
        </Link>
    )

    return (
        <div className="seller-page">
            <main className="seller-main">
                <div className="seller-container">
                    <div className="sales-header">
                        <div className="sales-header-content">
                            <h1 className="sales-title">Sales</h1>
                            <p className="sales-subtitle">Track your sold and unsold auction items</p>
                        </div>
                    </div>

                    <div className="sales-tabs">
                        <button
                            className={`sales-tab ${activeTab === 'sold' ? 'active' : ''}`}
                            onClick={() => setActiveTab('sold')}
                        >
                            <span>Sold Items</span>
                            <span className="tab-count">{soldItems.length}</span>
                        </button>
                        <button
                            className={`sales-tab ${activeTab === 'unsold' ? 'active' : ''}`}
                            onClick={() => setActiveTab('unsold')}
                        >
                            <span>Unsold Items</span>
                            <span className="tab-count">{unsoldItems.length}</span>
                        </button>
                    </div>

                    <div className="sales-content">
                        {activeTab === 'sold' && (
                            <div className="sales-tab-content">
                                {isLoading ? (
                                    <div className="sales-grid">
                                        {[1, 2, 3, 4].map((i) => (
                                            <LoadingSkeleton key={i} />
                                        ))}
                                    </div>
                                ) : soldItems.length > 0 ? (
                                    <div className="sales-grid">
                                        {soldItems.map((item) => (
                                            <SalesCard key={item.id} item={item} />
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState
                                        title="No Sold Items"
                                        description="You haven't sold any items yet. Your sold items will appear here once you complete your first sale."
                                        actionText="View Active Listings"
                                        actionLink="/seller/auction-listings"
                                    />
                                )}
                            </div>
                        )}

                        {activeTab === 'unsold' && (
                            <div className="sales-tab-content">
                                {isLoading ? (
                                    <div className="sales-grid">
                                        {[1, 2, 3, 4].map((i) => (
                                            <LoadingSkeleton key={i} />
                                        ))}
                                    </div>
                                ) : unsoldItems.length > 0 ? (
                                    <div className="sales-grid">
                                        {unsoldItems.map((item) => (
                                            <SalesCard key={item.id} item={item} />
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState
                                        title="No Unsold Items"
                                        description="You don't have any unsold items at the moment. Items that don't sell will appear here."
                                        actionText="Create New Listing"
                                        actionLink="/seller/product"
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default SellerSales