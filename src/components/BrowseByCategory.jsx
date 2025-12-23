import React from 'react'
import './BrowseByCategory.css'

const BrowseByCategory = ({ selectedCategory, setSelectedCategory }) => {
  const categories = ['All Categories', 'Vehicles', 'Real Estate', 'Art & Collectibles', 'Industrial Machinery', 'Electronics', 'Jewelry', 'Furniture']

  return (
    <section className="browse-section">
      <div className="browse-container">
        <h2 className="browse-title">Browse by Category</h2>
        <div className="category-tabs-container">
          <div className="category-tabs">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          {/* Scroll indicator for mobile */}
          <div className="scroll-indicator">
            <span className="scroll-dot active"></span>
            <span className="scroll-dot"></span>
            <span className="scroll-dot"></span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BrowseByCategory