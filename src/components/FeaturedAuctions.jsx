import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './FeaturedAuctions.css'

const FeaturedAuctions = ({ selectedCategory }) => {
  const navigate = useNavigate()

  const auctions = [
    { id: 1, title: '1969 Chevrolet Camaro SS', category: 'Vehicles', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80', currentBid: '$75,500', timeRemaining: '2d 14h 22m' },
    { id: 2, title: 'Modern Villa in Beverly Hills', category: 'Real Estate', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', currentBid: '$12,250,000', timeRemaining: '15d 8h 5m' },
    { id: 3, title: '"Ethereal Dreams" by Anya Petrova', category: 'Art & Collectibles', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80', currentBid: '$12,000', timeRemaining: '1d 4h 10m' },
    { id: 4, title: '2018 Caterpillar D6T Dozer', category: 'Industrial Machinery', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80', currentBid: '$180,000', timeRemaining: '9h 30m' },
    { id: 5, title: '1967 Ford Mustang GT', category: 'Vehicles', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80', currentBid: '$95,000', timeRemaining: '3d 6h 15m' },
    { id: 6, title: 'Luxury Penthouse in Manhattan', category: 'Real Estate', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', currentBid: '$8,500,000', timeRemaining: '7d 12h 45m' },
    { id: 7, title: 'Vintage Rolex Submariner', category: 'Art & Collectibles', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', currentBid: '$45,000', timeRemaining: '1d 8h 20m' },
    { id: 9, title: 'Classic Harley-Davidson', category: 'Vehicles', image: 'https://images.unsplash.com/photo-1558980664-1db506751c6a?w=800&q=80', currentBid: '$28,500', timeRemaining: '2d 18h 30m' },
    { id: 10, title: 'Rare Picasso Lithograph', category: 'Art & Collectibles', image: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800&q=80', currentBid: '$125,000', timeRemaining: '4d 10h 5m' },
    { id: 11, title: 'Rare Picasso Lithograph', category: 'Art & Collectibles', image: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800&q=80', currentBid: '$125,000', timeRemaining: '4d 10h 5m' },
    { id: 12, title: 'Industrial CNC Machine', category: 'Industrial Machinery', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80', currentBid: '$250,000', timeRemaining: '5d 3h 10m' },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerRow, setItemsPerRow] = useState(5)

  useEffect(() => {
    const calculateItemsPerRow = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth
        if (width >= 1400) return 9
        if (width >= 1024) return 9
        if (width >= 768) return 6
        return 1
      }
      return 5
    }

    setItemsPerRow(calculateItemsPerRow())

    const handleResize = () => {
      const newItemsPerRow = calculateItemsPerRow()
      setItemsPerRow(newItemsPerRow)
      const maxIndex = Math.ceil(filteredAuctions.length / newItemsPerRow) - 1
      if (currentIndex > maxIndex) setCurrentIndex(0)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentIndex])

  const filteredAuctions = selectedCategory === 'All Categories'
    ? auctions
    : auctions.filter(a => a.category === selectedCategory)

  const totalPages = Math.ceil(filteredAuctions.length / itemsPerRow)
  const startIndex = currentIndex * itemsPerRow
  const endIndex = startIndex + itemsPerRow
  const visibleAuctions = filteredAuctions.slice(startIndex, endIndex)

  const handlePrevious = () => setCurrentIndex(prev => (prev > 0 ? prev - 1 : totalPages - 1))
  const handleNext = () => setCurrentIndex(prev => (prev < totalPages - 1 ? prev + 1 : 0))

  return (
    <section className="featured-section">
      <div className="featured-container">
        <div className="featured-header">
          <h2 className="featured-title">Featured Auctions</h2>
          <div className="featured-nav">
            <button className="nav-arrow left-arrow" onClick={handlePrevious} aria-label="Previous">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="nav-arrow right-arrow" onClick={handleNext} aria-label="Next">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
        <div className="auctions-grid">
          {visibleAuctions.map((auction) => (
            <div key={auction.id} className="feature-auction-card">
              <div className="auction-image">
                <img src={auction.image} alt={auction.title} />
              </div>
              <div className="auction-content">
                <h3 className="auction-title">{auction.title}</h3>
                <div className="auction-details">
                  <div className="auction-bid">
                    <span className="detail-label">Current Bid</span>
                    <span className="detail-value">{auction.currentBid}</span>
                  </div>
                  <div className="auction-time">
                    <span className="detail-label">Time Remaining</span>
                    <span className="detail-value">{auction.timeRemaining}</span>
                  </div>
                </div>
                <button className="auction-button" onClick={() => navigate(`/auction/${auction.id}`)}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="slider-indicators">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button key={index} className={`indicator ${index === currentIndex ? 'active' : ''}`} onClick={() => setCurrentIndex(index)} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedAuctions
