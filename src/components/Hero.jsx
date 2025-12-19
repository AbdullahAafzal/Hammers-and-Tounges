import React from 'react'
import './Hero.css'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const navigate = useNavigate()
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">Premier Online Auctions. Unbeatable Value.</h1>
        <p className="hero-description">
          Discover exclusive deals on vehicles, real estate, art, and more. Your next prized possession awaits.
        </p>
        <button onClick={()=> navigate('/auctions')} className="hero-button">View All Auctions</button>
      </div>
    </section>
  )
}

export default Hero



