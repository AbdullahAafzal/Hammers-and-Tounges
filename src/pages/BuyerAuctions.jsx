import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import './BuyerAuctions.css'

const BuyerAuctions = () => {
  const navigate = useNavigate()
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedStatus, setSelectedStatus] = useState([])
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const auctions = [
    {
      id: 1,
      price: 50000,
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      status: 'LIVE',
      category: 'Vehicles',
      title: 'Monthly Executive Vehicle Auction',
      timer: '02:18:45:10',
      timerType: 'ends'
    },
    {
      id: 2,
      price: 1200000,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      status: 'UPCOMING',
      category: 'Real Estate',
      title: 'Exclusive Sandton Residence',
      timer: '15:08:30:22',
      timerType: 'starts'
    },
    {
      id: 3,
      price: 90000,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      status: 'LIVE',
      category: 'Jewelry',
      title: 'Timeless Timepieces & Jewelry',
      timer: '00:05:15:54',
      timerType: 'ends'
    },
    {
      id: 4,
      price: 250000,
      image: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800&q=80',
      status: 'UPCOMING',
      category: 'Fine Art',
      title: 'Modern & Contemporary Art',
      timer: '21:12:05:30',
      timerType: 'starts'
    },
    {
      id: 5,
      price: 150000,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
      status: 'LIVE',
      category: 'Electronics',
      title: 'Liquidation: Heavy Equipment',
      timer: '01:23:59:01',
      timerType: 'ends'
    },
    {
      id: 6,
      price: 350000,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
      status: 'UPCOMING',
      category: 'Vehicles',
      title: "Collector's Dream Car Auction",
      timer: '08:14:10:45',
      timerType: 'starts'
    },
    {
      id: 7,
      price: 800000,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      status: 'LIVE',
      category: 'Real Estate',
      title: 'Luxury Penthouse Collection',
      timer: '03:45:20:15',
      timerType: 'ends'
    },
    {
      id: 8,
      price: 450000,
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
      status: 'UPCOMING',
      category: 'Fine Art',
      title: 'Vintage Masterpieces',
      timer: '12:30:15:40',
      timerType: 'starts'
    }
  ]

  const categories = ['Vehicles', 'Real Estate', 'Fine Art', 'Jewelry', 'Electronics', 'Collectibles']
  const statusOptions = ['LIVE', 'UPCOMING', 'ENDED']

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
    setCurrentPage(1)
  }

  const handleStatusToggle = (status) => {
    setSelectedStatus(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
    setCurrentPage(1)
  }

  const handlePriceChange = (e) => {
    setPriceRange({ ...priceRange, [e.target.name]: e.target.value })
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSelectedCategories([])
    setSelectedStatus([])
    setPriceRange({ min: '', max: '' })
    setSortBy('newest')
    setCurrentPage(1)
  }

  const formatTimer = (timer) => {
    const parts = timer.split(':')
    if (parts.length === 4) {
      const [days, hours, minutes, seconds] = parts
      return `${days}d ${hours}h ${minutes}m ${seconds}s`
    }
    return timer
  }

  const filteredAuctions = useMemo(() => {
    let result = [...auctions]

    if (selectedCategories.length > 0) {
      result = result.filter(a => selectedCategories.includes(a.category))
    }

    if (selectedStatus.length > 0) {
      result = result.filter(a => selectedStatus.includes(a.status))
    }

    if (priceRange.min !== '' && priceRange.min !== null) {
      result = result.filter(a => a.price >= Number(priceRange.min))
    }

    if (priceRange.max !== '' && priceRange.max !== null) {
      result = result.filter(a => a.price <= Number(priceRange.max))
    }

    if (sortBy === "newest") {
      result = [...result].reverse()
    } else if (sortBy === "oldest") {
      result = [...result]
    } else if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price)
    }

    return result
  }, [selectedCategories, selectedStatus, priceRange, sortBy])

  const itemsPerPage = 6
  const totalPages = Math.ceil(filteredAuctions.length / itemsPerPage)
  
  const paginatedAuctions = filteredAuctions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const generatePageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className="buyer-auctions-page">
      <div className="buyer-auctions-content">
        <div className="buyer-auctions-container">
          <aside className="filters-sidebar">
            <div className="filters-header">
              <h2 className="filters-title">Filter By :</h2>
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
                    name="min"
                    className="price-input"
                    value={priceRange.min}
                    onChange={handlePriceChange}
                    placeholder="0"
                  />
                </div>
                <span className="price-separator">-</span>
                <div className="price-input-group">
                  <label className="price-label">Max</label>
                  <input
                    type="number"
                    name="max"
                    className="price-input"
                    value={priceRange.max}
                    onChange={handlePriceChange}
                    placeholder="Any"
                  />
                </div>
              </div>
            </div>

            <div className="filter-section">
              <h3 className="filter-section-title">Sort By</h3>
              <div className="filter-options">
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    name="sort"
                    checked={sortBy === "newest"}
                    onChange={() => setSortBy("newest")}
                  />
                  <span>Newest</span>
                </label>
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    name="sort"
                    checked={sortBy === "oldest"}
                    onChange={() => setSortBy("oldest")}
                  />
                  <span>Oldest</span>
                </label>
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    name="sort"
                    checked={sortBy === "price-low"}
                    onChange={() => setSortBy("price-low")}
                  />
                  <span>Price Low → High</span>
                </label>
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    name="sort"
                    checked={sortBy === "price-high"}
                    onChange={() => setSortBy("price-high")}
                  />
                  <span>Price High → Low</span>
                </label>
              </div>
            </div>
          </aside>

          <main className="auctions-main">
            <div className="auctions-header-main">
              <div className="header-left">
                <h1 className="auctions-page-title">Live & Upcoming Auctions</h1>
                <span className="results-count">{filteredAuctions.length} Results</span>
              </div>
            </div>

            <div className="auctions-grid">
              {paginatedAuctions.map(auction => (
                <div key={auction.id} className="auctions-card">
                  <div className="auction-image-wrapper">
                    <img src={auction.image} alt={auction.title} />
                    <span className={`status-badge ${auction.status.toLowerCase()}`}>
                      {auction.status}
                    </span>
                  </div>
                  <div className="auctions-card-content">
                    <p className="auction-category-1">{auction.category}</p>
                    <h3 className="auctions-card-title">{auction.title}</h3>
                    <div className="auction-timer">
                      <span className="timer-label">
                        AUCTION {auction.timerType === 'ends' ? 'ENDS' : 'STARTS'} IN
                      </span>
                      <span className="timer-value">{formatTimer(auction.timer)}</span>
                    </div>
                    <button
                      className="view-auctions-btn"
                      onClick={() => navigate(`/buyer/auction/${auction.id}`)}
                    >
                      View Auction
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredAuctions.length > itemsPerPage && (
              <div className="category-pagination">
                <button
                  className="category-pagination-btn category-prev-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Previous
                </button>

                <div className="category-page-numbers">
                  {generatePageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`dots-${index}`} className="category-page-dots">...</span>
                    ) : (
                      <button
                        key={page}
                        className={`category-page-number ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>

                <button
                  className="category-pagination-btn category-next-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default BuyerAuctions