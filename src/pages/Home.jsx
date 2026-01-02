import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BrowseByCategory from '../components/BrowseByCategory.jsx'
import FeaturedAuctions from '../components/FeaturedAuctions.jsx'
import { useDispatch, useSelector } from 'react-redux'
// import { clearError } from '../store/slices/authSlice'
// import { loginUser } from '../store/actions/authActions'


import Hero from '../components/Hero.jsx'
import Onboarding from '../components/Onboarding.jsx'

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  // Redux state
    const navigate = useNavigate()
    const dispatch = useDispatch()
  const { isLoading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  )

  
  // Redirect based on user role after successful login
  useEffect(() => {
    if (isAuthenticated && user) {
      const role = user.role
      const staff = user.is_staff
      console.log("staff: ", staff);

      // Navigate based on role
      if (staff == 'true') {
        navigate('/admin/dashboard', { replace: true })
        return;
      } else if (role === 'manager') {
        navigate('/manager/dashboard', { replace: true })
        return;
      } else if (role === 'buyer') {
        navigate('/buyer/dashboard', { replace: true })
        return;
      } else if (role === 'seller') {
        navigate('/seller/dashboard', { replace: true })
        return;
      } else {
        // Default fallback
        navigate('/', { replace: true })
      }
    }
  }, [isAuthenticated, user])

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
