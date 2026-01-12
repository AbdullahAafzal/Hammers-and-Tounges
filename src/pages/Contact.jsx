import React, { useState } from 'react'
import './Contact.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
  }

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="contact-hero-content">
          <h1 className="contact-hero-title">Get In Touch</h1>
          <p className="contact-hero-subtitle">
            We're here to help. Reach out to us with any questions or inquiries.
          </p>
        </div>
      </div>

      <div className="contact-container">
        <div className="contact-grid">
          <div className="contact-info">
            <h2 className="contact-section-title">Contact Information</h2>
            <p className="contact-description">
              Whether you have questions about our platform, need assistance with an auction, 
              or want to become a seller, we're ready to assist you.
            </p>

            <div className="contact-details">
              <div className="contact-detail-item">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="contact-detail-content">
                  <h3 className="contact-detail-label">Address</h3>
                  <p className="contact-detail-text">
                    123 Auction Street<br />
                    Business District<br />
                    City, State 12345
                  </p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7292C21.7209 20.9842 21.5573 21.2131 21.3522 21.401C21.1472 21.5889 20.9053 21.7319 20.6419 21.8207C20.3785 21.9095 20.0996 21.9421 19.822 21.9165C16.742 21.6495 13.787 20.6405 11.19 18.98C8.77382 17.4869 6.72533 15.4384 5.232 13.022C3.57151 10.425 2.56252 7.46999 2.29552 4.38999C2.26995 4.11239 2.30259 3.83347 2.39139 3.57007C2.48019 3.30668 2.62316 3.06479 2.81105 2.85974C2.99894 2.65469 3.22793 2.49112 3.48293 2.37952C3.73793 2.26792 4.01364 2.21095 4.292 2.21199H7.292C7.86382 2.21199 8.41213 2.43927 8.80421 2.83135C9.19629 3.22343 9.42357 3.77174 9.42357 4.34399C9.42357 5.48699 9.72657 6.60299 10.2986 7.57499C10.8706 8.54699 11.6886 9.33699 12.6546 9.85999C13.2266 10.232 13.6536 10.801 13.8616 11.467C14.0696 12.133 14.0456 12.852 13.7946 13.502L13.6546 13.852C13.5016 14.222 13.5016 14.636 13.6546 15.006L15.6546 19.006C15.8076 19.376 16.1016 19.67 16.4716 19.823L16.8216 19.963C17.4716 20.214 18.1906 20.19 18.8566 19.982C19.5226 19.774 20.0916 19.347 20.4646 18.775C20.9876 17.809 21.7776 16.991 22.7496 16.419C23.7216 15.847 24.8376 15.544 25.9806 15.544C26.5526 15.544 27.1009 15.7713 27.493 16.1634C27.8851 16.5555 28.1124 17.1038 28.1124 17.676L28.1124 20.676C28.1134 20.9544 28.0565 21.2301 27.9449 21.4851C27.8333 21.7401 27.6697 21.9691 27.4647 22.157C27.2596 22.3449 27.0177 22.4879 26.7543 22.5767C26.4909 22.6655 26.212 22.6981 25.9344 22.6725C22.8544 22.4055 19.8994 21.3965 17.3024 19.736Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="contact-detail-content">
                  <h3 className="contact-detail-label">Phone</h3>
                  <p className="contact-detail-text">
                    +1 (555) 123-4567<br />
                    +1 (555) 123-4568
                  </p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="contact-detail-content">
                  <h3 className="contact-detail-label">Email</h3>
                  <p className="contact-detail-text">
                    info@hammersandtongues.com<br />
                    support@hammersandtongues.com
                  </p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="contact-detail-content">
                  <h3 className="contact-detail-label">Business Hours</h3>
                  <p className="contact-detail-text">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-wrappers">
            <h2 className="contact-section-title">Send Us a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group form-group-1">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="about-form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="about-form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="about-form-input"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  className="form-textarea"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact



