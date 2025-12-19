import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import './BuyerAuctions.css'

const BuyerAuctions = () => {
  const navigate = useNavigate()
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedStatus, setSelectedStatus] = useState([])
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)

  const auctions = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      status: 'LIVE',
      category: 'Vehicle Auction',
      title: 'Monthly Executive Vehicle Auction',
      timer: '02:18:45:10',
      timerType: 'ends'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      status: 'UPCOMING',
      category: 'Property Auction',
      title: 'Exclusive Sandton Residence',
      timer: '15:08:30:22',
      timerType: 'starts'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      status: 'LIVE',
      category: 'Luxury Goods Auction',
      title: 'Timeless Timepieces & Jewelry',
      timer: '00:05:15:54',
      timerType: 'ends'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800&q=80',
      status: 'UPCOMING',
      category: 'Fine Art Auction',
      title: 'Modern & Contemporary Art',
      timer: '21:12:05:30',
      timerType: 'starts'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
      status: 'LIVE',
      category: 'Industrial Machinery',
      title: 'Liquidation: Heavy Equipment',
      timer: '01:23:59:01',
      timerType: 'ends'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
      status: 'UPCOMING',
      category: 'Classic Cars',
      title: "Collector's Dream Car Auction",
      timer: '08:14:10:45',
      timerType: 'starts'
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      status: 'LIVE',
      category: 'Property Auction',
      title: 'Luxury Penthouse Collection',
      timer: '03:45:20:15',
      timerType: 'ends'
    },
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
      status: 'UPCOMING',
      category: 'Fine Art Auction',
      title: 'Vintage Masterpieces',
      timer: '12:30:15:40',
      timerType: 'starts'
    }
  ]

  const categories = ['Vehicles', 'Real Estate', 'Fine Art', 'Jewelry', 'Electronics', 'Collectibles']
  const statuses = ['Live', 'Upcoming', 'Ended']
  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
    { label: 'Ending Soon', value: 'ending_soon' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
  ]

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handleStatusToggle = (status) => {
    setSelectedStatus(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  const handlePriceChange = (e) => {
    setPriceRange({ ...priceRange, [e.target.name]: e.target.value })
  }

  const handleClearFilters = () => {
    setSelectedCategories([])
    setSelectedStatus([])
    setPriceRange({ min: '', max: '' })
    setSortBy('newest')
  }

  const itemsPerPage = 8
  const totalPages = Math.ceil(auctions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleAuctions = auctions.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="buyer-auctions-page">
      {/* Auctions Content */}
      <div className="buyer-auctions-content">
        <div className="buyer-auctions-container">
          <aside className="filters-sidebar">
            <div className="filters-header">
              <h2 className="filters-title">Filter By</h2>
              <button className="clear-all-btn" onClick={handleClearFilters}>Clear All</button>
            </div>

            <div className="filter-section">
              <div className="filter-header">
                <h3 className="filter-section-title">Category</h3>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="filter-options">
                {categories.map(category => (
                  <label key={category} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <div className="filter-header">
                <h3 className="filter-section-title">Status</h3>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="filter-options">
                {statuses.map(status => (
                  <label key={status} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedStatus.includes(status)}
                      onChange={() => handleStatusToggle(status)}
                    />
                    <span>{status}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <div className="filter-header">
                <h3 className="filter-section-title">Price Range</h3>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="price-inputs">
                <input
                  type="number"
                  name="min"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={handlePriceChange}
                  className="price-input"
                />
                <span>-</span>
                <input
                  type="number"
                  name="max"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={handlePriceChange}
                  className="price-input"
                />
              </div>
            </div>

            <div className="filter-section">
              <div className="filter-header">
                <h3 className="filter-section-title">Sort By</h3>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="filter-options radio-options">
                {sortOptions.map(option => (
                  <label key={option.value} className="filter-radio">
                    <input
                      type="radio"
                      name="sortBy"
                      value={option.value}
                      checked={sortBy === option.value}
                      onChange={(e) => setSortBy(e.target.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="apply-filters-btn">Apply Filters</button>
          </aside>

          <main className="auctions-main">
            <div className="auctions-header-main">
              <h1 className="auctions-page-title">Live & Upcoming Auctions</h1>
              <span className="results-count">{auctions.length} Results</span>
            </div>

            <div className="auctions-grid">
              {visibleAuctions.map(auction => (
                <div key={auction.id} className="auction-card">
                  <div className="auction-image-wrapper">
                    <img src={auction.image} alt={auction.title} />
                    <span className={`status-badge ${auction.status.toLowerCase()}`}>
                      {auction.status}
                    </span>
                  </div>
                  <div className="auction-card-content">
                    <p className="auction-category-1">{auction.category}</p>
                    <h3 className="auction-card-title">{auction.title}</h3>
                    <div className="auction-timer">
                      <span className="timer-label">
                        AUCTION {auction.timerType === 'ends' ? 'ENDS' : 'STARTS'} IN
                      </span>
                      <span className="timer-value">{auction.timer}</span>
                    </div>
                    <button
                      className="view-auction-btn"
                      onClick={() => navigate(`/buyer/auction/${auction.id}`)}
                    >
                      View Auction
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="pagination-numbers">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index + 1}
                    className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default BuyerAuctions

