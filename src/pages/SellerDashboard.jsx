import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './SellerDashboard.css'
import SummaryCard from './SummaryCard'
import { useSelector, useDispatch } from 'react-redux'
import { fetchMyAuctions } from '../store/actions/sellerActions'

const SellerDashboard = () => {
    const dispatch = useDispatch()
    // Fetch seller data from Redux store
    const { myAuctions, isLoading } = useSelector(state => state.seller)
    const allAuctions = myAuctions?.results || []
    
    // Calculate metrics from auction data
    const totalVehicles = allAuctions.length
    const soldVehicles = allAuctions.filter(auction => auction.status === 'CLOSED' || auction.status === 'COMPLETED').length
    const unsoldVehicles = allAuctions.filter(auction => auction.status !== 'CLOSED' && auction.status !== 'COMPLETED').length
    
    // Calculate total earnings from sold auctions (using currentBid as sold price for closed/completed auctions)
    const totalEarnings = allAuctions
        .filter(auction => auction.status === 'CLOSED' || auction.status === 'COMPLETED')
        .reduce((sum, auction) => sum + (parseFloat(auction.currentBid) || 0), 0)
    
    const seller = {
        name: 'Seller',
        totalEarnings: totalEarnings,
        totalVehicles: totalVehicles,
        soldVehicles: soldVehicles,
        unsoldVehicles: unsoldVehicles,
        totalEarningsLabel: 'Total Earnings',
        totalEarningsSubLabel: 'Lifetime earnings',
        totalVehiclesLabel: 'Total Items',
        totalVehiclesSubLabel: 'All items listed',
        soldVehiclesLabel: 'Sold Items',
        soldVehiclesSubLabel: 'Successfully sold',
        unsoldVehiclesLabel: 'Unsold Items',
        unsoldVehiclesSubLabel: 'Not yet sold',
    }

    // For testing empty states, you can set these to empty arrays:
    const recentSales = [] // Empty array for testing

    useEffect( ()=> {
        dispatch( fetchMyAuctions() )
    }, [dispatch] )

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount)
    }


    return (
        <div className="seller-page">

            <main className="seller-main">
                <div className="seller-container">
                    <div className="dashboard-welcome">
                        <div className="welcome-content">
                            <h1 className="welcome-title">Welcome back, {seller.name}!</h1>
                            <p className="welcome-subtitle">Your seller dashboard is updated in real-time</p>
                        </div>
                        <div className="welcome-actions">
                            <Link to="/seller/product" className="action-button primary-button primary">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                Create New Product</Link>
                            {/* <button className="action-button secondary">Request Payout</button> */}
                        </div>
                    </div>

                    <SummaryCard 
                        seller={seller} 
                    />

                    <div className="dashboard-single-column">
                        <div className="dashboard-column">
                            <div className="section-header">
                                <h2 className="section-title">Recent Sales</h2>
                            </div>
                            <div className="sales-list">
                                {recentSales.length > 0 ? (
                                    recentSales.map((sale) => (
                                        <Link key={sale.id} className="sale-item">
                                            <div className="sale-image">
                                                <img src={sale.image} alt={sale.title} />
                                            </div>
                                            <div className="sale-content">
                                                <div className="sale-header">
                                                    <h4 className="sale-title">{sale.title}</h4>
                                                    <span className="sale-price">{formatCurrency(sale.soldPrice)}</span>
                                                </div>
                                                <div className="sale-details">
                                                    <span className="sale-buyer">Sold to: {sale.buyer}</span>
                                                    <span className="sale-date">{sale.date}</span>
                                                </div>
                                                <div className="sale-footer">
                                                    <span className="sale-status">{sale.status}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <div className="empty-state-icon">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
                                                <path d="M20.5 7.5L9 15L4 11" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3 13V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V9" strokeLinecap="round" strokeLinejoin="round" />
                                                <circle cx="18" cy="6" r="2" />
                                            </svg>
                                        </div>
                                        <h3 className="empty-state-title">No Recent Sales</h3>
                                        <p className="empty-state-description">Your recent sales will appear here once you make your first sale.</p>
                                        <Link to="/seller/auction-listings" className="empty-state-action">
                                            View Your Listings
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default SellerDashboard