import React, { useState } from 'react'

// Correct imports for your folder structure
import BrowseByCategory from '../components/BrowseByCategory.jsx'
import FeaturedAuctions from '../components/FeaturedAuctions.jsx'

// Keep your other imports untouched
import Hero from '../components/Hero.jsx'
import Onboarding from '../components/Onboarding.jsx'
// ...other imports remain as they are

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories')

  return (
    <div>
      <Hero />
    
      
      {/* BrowseByCategory with selectedCategory state */}
      <BrowseByCategory
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      
      {/* FeaturedAuctions filtered by category */}
      <FeaturedAuctions selectedCategory={selectedCategory} />
  <Onboarding />
      {/* Keep other content/components as is */}
    </div>
  )
}

export default Home
