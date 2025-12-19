import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Toast from '../components/Toast'
import './Auctions.css'

const Auctions = () => {
  const navigate = useNavigate()
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedStatus, setSelectedStatus] = useState([])
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [showToast, setShowToast] = useState(false)

  const isGuest = () => {
    return !localStorage.getItem('isAuthenticated')
  }

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

  const categories = ['Vehicles', 'Real Estate', 'Fine Art', 'Jewelry', 'Industrial Machinery', 'Collectibles']
  const statusOptions = ['Live', 'Upcoming', 'Ended']
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'ending', label: 'Ending Soon' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' }
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

  const handleClearFilters = () => {
    setSelectedCategories([])
    setSelectedStatus([])
    setPriceRange({ min: '', max: '' })
    setSortBy('newest')
  }

  const handleAuctionClick = (auction) => {
    if (auction.status === 'LIVE' && isGuest()) {
      setShowToast(true)
      return
    }
    navigate(`/auction/${auction.id}`)
  }

  return (
    <div className="auctions-page">
      <Toast 
        message="Login required" 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
      <div className="auctions-container">
        <aside className="filters-sidebar">
          <div className="filters-header">
            <h2 className="filters-title">Filter By</h2>
            <button className="clear-all-btn" onClick={handleClearFilters}>Clear All</button>
          </div>
          
          <div className="filter-section">
            <h3 className="filter-section-title">Category</h3>
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
            <h3 className="filter-section-title">Status</h3>
            <div className="filter-options">
              {statusOptions.map(status => (
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
            <h3 className="filter-section-title">Price Range</h3>
            <div className="price-inputs">
              <div className="price-input-group">
                <label className="price-label">Min</label>
                <input
                  type="number"
                  className="price-input"
                  placeholder="$0"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                />
              </div>
              <span className="price-separator">-</span>
              <div className="price-input-group">
                <label className="price-label">Max</label>
                <input
                  type="number"
                  className="price-input"
                  placeholder="$10M+"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="filter-section">
            <h3 className="filter-section-title">Sort By</h3>
            <div className="filter-options">
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
        </aside>

        <main className="auctions-main">
          <div className="auctions-header">
            <div className="header-left">
              <h1 className="auctions-page-title">Live & Upcoming Auctions</h1>
              <span className="results-count">{auctions.length} Results</span>
            </div>
          </div>

          <div className="auctions-grid">
            {auctions.map(auction => (
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
                    onClick={() => handleAuctionClick(auction)}
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
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="pagination-numbers">
              {[1, 2, 3].map(num => (
                <button
                  key={num}
                  className={`pagination-number ${currentPage === num ? 'active' : ''}`}
                  onClick={() => setCurrentPage(num)}
                >
                  {num}
                </button>
              ))}
              <span className="pagination-ellipsis">...</span>
              <button
                className={`pagination-number ${currentPage === 10 ? 'active' : ''}`}
                onClick={() => setCurrentPage(10)}
              >
                10
              </button>
            </div>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(10, prev + 1))}
              disabled={currentPage === 10}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Auctions

