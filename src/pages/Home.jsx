import React, { useState } from 'react'

import BrowseByCategory from '../components/BrowseByCategory.jsx'
import FeaturedAuctions from '../components/FeaturedAuctions.jsx'

import Hero from '../components/Hero.jsx'
import Onboarding from '../components/Onboarding.jsx'

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories')

  return (
    <div>
      <Hero />
      <BrowseByCategory
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <FeaturedAuctions selectedCategory={selectedCategory} />
      <Onboarding />
    </div>
  )
}

export default Home
