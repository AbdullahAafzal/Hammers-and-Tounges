import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './BuyerWonItems.css'

const BuyerWonItems = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const wonItems = [
    {
      id: 1,
      lotId: '#1024',
      title: 'Vintage Abstract Painting',
      category: 'Modern Art Collection',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
      winningPrice: 1250.00,
      paymentStatus: 'pending',
      paymentDeadline: '2d 14h 32m',
      invoiceNumber: 'INV-2024-001'
    },
    {
      id: 2,
      lotId: '#781',
      title: '19th Century Rocking Chair',
      category: 'Antique Furniture Fair',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
      winningPrice: 475.00,
      paymentStatus: 'paid',
      paymentDate: 'June 12, 2024',
      invoiceNumber: 'INV-2024-002'
    },
    {
      id: 3,
      lotId: '#2345',
      title: 'Rare Vintage Watch Collection',
      category: 'Luxury Timepieces',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      winningPrice: 3200.00,
      paymentStatus: 'pending',
      paymentDeadline: '4d 8h 5m',
      invoiceNumber: 'INV-2024-003'
    },
    {
      id: 4,
      lotId: '#5678',
      title: 'Classic Persian Rug',
      category: 'Fine Art & Collectibles',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
      winningPrice: 890.00,
      paymentStatus: 'paid',
      paymentDate: 'May 28, 2024',
      invoiceNumber: 'INV-2024-004'
    },
    {
      id: 5,
      lotId: '#9012',
      title: 'Mid-Century Modern Lamp',
      category: 'Design & Decor',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
      winningPrice: 650.00,
      paymentStatus: 'pending',
      paymentDeadline: '1d 6h 20m',
      invoiceNumber: 'INV-2024-005'
    },
    {
      id: 6,
      lotId: '#3456',
      title: 'Vintage Camera Collection',
      category: 'Photography Equipment',
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&q=80',
      winningPrice: 1850.00,
      paymentStatus: 'paid',
      paymentDate: 'June 5, 2024',
      invoiceNumber: 'INV-2024-006'
    },
    {
      id: 7,
      lotId: '#4521',
      title: 'Art Deco Mirror',
      category: 'Home Decor',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
      winningPrice: 720.00,
      paymentStatus: 'pending',
      paymentDeadline: '3d 10h 15m',
      invoiceNumber: 'INV-2024-007'
    },
    {
      id: 8,
      lotId: '#8765',
      title: 'Antique Pocket Watch',
      category: 'Luxury Timepieces',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      winningPrice: 2100.00,
      paymentStatus: 'paid',
      paymentDate: 'June 1, 2024',
      invoiceNumber: 'INV-2024-008'
    },
    {
      id: 9,
      lotId: '#2109',
      title: 'Vintage Leather Armchair',
      category: 'Antique Furniture Fair',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
      winningPrice: 980.00,
      paymentStatus: 'pending',
      paymentDeadline: '5d 2h 45m',
      invoiceNumber: 'INV-2024-009'
    },
    {
      id: 10,
      lotId: '#6543',
      title: 'Crystal Chandelier',
      category: 'Fine Art & Collectibles',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
      winningPrice: 3500.00,
      paymentStatus: 'paid',
      paymentDate: 'May 20, 2024',
      invoiceNumber: 'INV-2024-010'
    },
    {
      id: 11,
      lotId: '#7890',
      title: 'Vintage Typewriter',
      category: 'Office Collectibles',
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&q=80',
      winningPrice: 340.00,
      paymentStatus: 'pending',
      paymentDeadline: '2d 18h 30m',
      invoiceNumber: 'INV-2024-011'
    },
    {
      id: 12,
      lotId: '#3210',
      title: 'Oil Painting Landscape',
      category: 'Modern Art Collection',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
      winningPrice: 1580.00,
      paymentStatus: 'paid',
      paymentDate: 'June 8, 2024',
      invoiceNumber: 'INV-2024-012'
    },
    {
      id: 13,
      lotId: '#9876',
      title: 'Bronze Sculpture',
      category: 'Fine Art & Collectibles',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
      winningPrice: 2800.00,
      paymentStatus: 'pending',
      paymentDeadline: '6d 12h 0m',
      invoiceNumber: 'INV-2024-013'
    },
    {
      id: 14,
      lotId: '#5432',
      title: 'Mahogany Writing Desk',
      category: 'Antique Furniture Fair',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
      winningPrice: 1120.00,
      paymentStatus: 'paid',
      paymentDate: 'May 15, 2024',
      invoiceNumber: 'INV-2024-014'
    },
    {
      id: 15,
      lotId: '#1357',
      title: 'Vintage Vinyl Record Collection',
      category: 'Music Memorabilia',
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&q=80',
      winningPrice: 560.00,
      paymentStatus: 'pending',
      paymentDeadline: '1d 3h 50m',
      invoiceNumber: 'INV-2024-015'
    },
    {
      id: 16,
      lotId: '#2468',
      title: 'Porcelain Tea Set',
      category: 'Fine China',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
      winningPrice: 425.00,
      paymentStatus: 'paid',
      paymentDate: 'June 3, 2024',
      invoiceNumber: 'INV-2024-016'
    },
    {
      id: 17,
      lotId: '#1122',
      title: 'Art Nouveau Vase',
      category: 'Fine Art & Collectibles',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
      winningPrice: 780.00,
      paymentStatus: 'pending',
      paymentDeadline: '4d 22h 10m',
      invoiceNumber: 'INV-2024-017'
    },
    {
      id: 18,
      lotId: '#3344',
      title: 'Vintage Globe',
      category: 'Cartography',
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&q=80',
      winningPrice: 390.00,
      paymentStatus: 'paid',
      paymentDate: 'May 25, 2024',
      invoiceNumber: 'INV-2024-018'
    },
    {
      id: 19,
      lotId: '#5566',
      title: 'Stained Glass Window Panel',
      category: 'Architectural Salvage',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
      winningPrice: 1950.00,
      paymentStatus: 'pending',
      paymentDeadline: '3d 5h 25m',
      invoiceNumber: 'INV-2024-019'
    },
    {
      id: 20,
      lotId: '#7788',
      title: 'Antique Telescope',
      category: 'Scientific Instruments',
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&q=80',
      winningPrice: 2450.00,
      paymentStatus: 'paid',
      paymentDate: 'June 10, 2024',
      invoiceNumber: 'INV-2024-020'
    }
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const filteredItems = wonItems.filter(item => {
    const matchesSearch = searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lotId.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const totalItems = filteredItems.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredItems.slice(startIndex, endIndex)

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  return (
    <div className="won-items-page">
      <div className="won-items-content">
        <div className="won-items-container">
      
          <nav className="breadcrumbs">
            <Link to="/buyer/dashboard">Dashboard</Link>
            <span>/</span>
            <span>Won Items</span>
          </nav>

          <div className="page-header">
            <div className="header-left">
              <h1 className="page-title">Won Items</h1>
            </div>
          </div>

          <div className="search-bar">
            <div className="search-wrapper">
              <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search by lot name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {totalItems === 0 ? (
            <div className="no-results">
              <p>No items found matching your search.</p>
            </div>
          ) : (
            <>
              <div className="items-grid">
                {currentItems.map(item => (
                  <div key={item.id} className="won-item-card">
                    <div className="won-item-image">
                      <img src={item.image} alt={item.title} />
                      <div className="won-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
                        </svg>
                        <span>Won</span>
                      </div>
                    </div>

                    <div className="item-details">
                      <div className="item-category">{item.category.toUpperCase()}</div>
                      <h3 className="item-title">{item.title}</h3>
                      <div className="item-lot-id">Lot {item.lotId}</div>

                      <div className="winning-price">
                        {formatCurrency(item.winningPrice)}
                      </div>

                      <div className="congratulations-msg">
                        Congratulations! You won this lot.
                      </div>

                      {item.paymentStatus === 'pending' ? (
                        <div className="payment-status pending">
                          <div className="status-header">
                            <span className="status-label">PAYMENT DEADLINE</span>
                            <span className="status-timer">{item.paymentDeadline}</span>
                          </div>
                          <div className="won-invoice-status">
                            <span className="invoice-label">Invoice:</span>
                            <span className="invoice-badge pending-badge">Pending Payment</span>
                          </div>
                        </div>
                      ) : (
                        <div className="payment-status paid">
                          <div className="status-header">
                            <span className="status-label">PAYMENT COMPLETE</span>
                            <span className="status-date">{item.paymentDate}</span>
                          </div>
                          <div className="won-invoice-status">
                            <span className="invoice-label">Invoice:</span>
                            <span className="invoice-badge paid-badge">Paid</span>
                          </div>
                        </div>
                      )}

                      <div className="item-actions">
                        {item.paymentStatus === 'pending' ? (
                          <>
                            <button
                              className="wonItems-action-btn primary"
                              // onClick={() => navigate(`/payment/${item.id}`)}
                            >
                              Proceed to Payment
                            </button>
                            <button
                              className="wonItems-action-btn secondary"
                              // onClick={() => navigate(`/buyer/invoices`)}
                            >
                              View Invoice
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="wonItems-action-btn primary"
                              // onClick={() => navigate(`/invoice/${item.invoiceNumber}`)}
                            >
                              View Invoice
                            </button>
                            <button
                              className="wonItems-action-btn secondary"
                              onClick={() => navigate(`/buyer/auction/${item.id}`)}
                            >
                              View Lot Details
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="wonItems-pagination">
                  <button
                    className="wonItems-pagination-btn wonItems-prev-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Previous
                  </button>

                  <div className="wonItems-page-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                      <button
                        key={pageNumber}
                        className={`wonItems-page-number ${currentPage === pageNumber ? 'active' : ''}`}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>

                  <button
                    className="wonItems-pagination-btn wonItems-next-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                  >
                    Next
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BuyerWonItems