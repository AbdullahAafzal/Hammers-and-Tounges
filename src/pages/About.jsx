import React from 'react'
import './About.css'

const About = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-hero-title">About Hammer & Tongues</h1>
          <p className="about-hero-subtitle">
            Your trusted partner in premium online auctions
          </p>
        </div>
      </div>

      <div className="about-container">
        <section className="about-section">
          <div className="about-content">
            <h2 className="section-title">Who We Are</h2>
            <p className="section-text">
              Hammers & Tongues is a premier online auction platform dedicated to connecting buyers and sellers 
              of exceptional items. With years of experience in the auction industry, we've built a reputation 
              for transparency, security, and excellence.
            </p>
            <p className="section-text">
              Our platform brings together collectors, enthusiasts, and businesses from around the world, 
              offering a seamless auction experience for everything from classic vehicles and real estate 
              to fine art and industrial machinery.
            </p>
          </div>
        </section>

        <section className="about-section">
          <h2 className="section-title">Our Mission</h2>
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="mission-title">Transparency</h3>
              <p className="mission-text">
                We believe in complete transparency throughout the auction process, ensuring all parties 
                have access to accurate information.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="mission-title">Reliability</h3>
              <p className="mission-text">
                Our secure platform and verified authentication ensure every transaction is safe and reliable 
                for all participants.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="mission-title">Community</h3>
              <p className="mission-text">
                We foster a vibrant community of collectors and sellers, creating opportunities for meaningful 
                connections and transactions.
              </p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-check">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="feature-content">
                <h3 className="feature-title">Verified Sellers</h3>
                <p className="feature-text">All sellers undergo a thorough verification process to ensure authenticity and reliability.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-check">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="feature-content">
                <h3 className="feature-title">Secure Transactions</h3>
                <p className="feature-text">Advanced encryption and secure payment processing protect all transactions.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-check">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="feature-content">
                <h3 className="feature-title">24/7 Support</h3>
                <p className="feature-text">Our dedicated support team is available around the clock to assist you.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-check">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="feature-content">
                <h3 className="feature-title">Global Reach</h3>
                <p className="feature-text">Connect with buyers and sellers from around the world in one platform.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Auctions Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">$500M+</div>
              <div className="stat-label">Total Value Traded</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">98%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About



