import React from 'react'
import './Contact.css'

const Contact = () => {
  const contactItems = [
    {
      label: 'Address',
      value: '18005 Dhlela Way, Graniteside',
      icon: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
    },
    {
      label: 'Phone',
      value: '+263 (4) 748 118/20',
      icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z',
    },
    {
      label: 'Email',
      value: 'info@hammerandtongues.com',
      icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z',
    },
    {
      label: 'Business Hours',
      value: 'Monday–Friday: 9:00 AM – 6:00 PM\nSaturday: 10:00 AM – 4:00 PM\nSunday: Closed',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    },
  ]

  const faqItems = [
    { q: 'How do I register as a seller?', a: 'Create an account and complete the KYC verification process.' },
    { q: 'When will I receive my payment?', a: 'Payments are processed within 5–7 business days after auction completion.' },
    { q: 'Is bidding free?', a: 'Registration and browsing are free. A small buyer premium may apply on winning bids.' },
  ]

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1 className="contact-hero__title">Get In Touch</h1>
        <p className="contact-hero__subtitle">
          We're here to help. Reach out with questions about our platform, auction support, or seller inquiries.
        </p>
      </div>

      <div className="contact-body">
        <div className="contact-main">
          <section className="contact-info-card">
            <h2 className="contact-card__title">Contact Information</h2>
            <p className="contact-card__text">
              Whether you need assistance with an auction, want to become a seller, or have general questions, we're ready to assist.
            </p>
            <div className="contact-details">
              {contactItems.map((item, i) => (
                <div key={i} className="contact-detail">
                  <div className="contact-detail__icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="contact-detail__content">
                    <span className="contact-detail__label">{item.label}</span>
                    {item.label === 'Email' ? (
                      <a className="contact-detail__value" href="mailto:info@hammerandtongues.com">{item.value}</a>
                    ) : item.label === 'Phone' ? (
                      <a className="contact-detail__value" href="tel:+263474811820">{item.value}</a>
                    ) : (
                      <span className="contact-detail__value">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        <section className="contact-faq">
          <h2 className="contact-faq__title">Frequently Asked Questions</h2>
          <div className="contact-faq__list">
            {faqItems.map((item, i) => (
              <div key={i} className="contact-faq__item">
                <h3 className="contact-faq__q">{item.q}</h3>
                <p className="contact-faq__a">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Contact
