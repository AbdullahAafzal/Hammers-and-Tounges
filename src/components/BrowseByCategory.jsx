import React from 'react'
import './BrowseByCategory.css'

const BrowseByCategory = ({ selectedCategory, setSelectedCategory }) => {
  const categories = ['All Categories', 'Vehicles', 'Real Estate', 'Art & Collectibles', 'Industrial Machinery']

  return (
    <section className="browse-section">
      <div className="browse-container">
        <h2 className="browse-title">Browse by Category</h2>
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
      </div>
    </section>
  )
}

export default BrowseByCategory
