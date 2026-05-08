import React, { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './PrivacyPolicy.css'
import { COOKIE_POLICY_TEXT, PRIVACY_POLICY_TEXT, TERMS_AND_CONDITIONS_TEXT } from '../content/legalContent'

const PrivacyPolicy = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const activeTab = pathname === '/terms-and-conditions' ? 'terms' : pathname === '/cookie-policy' ? 'cookies' : 'privacy'

  const tabContent = useMemo(() => {
    if (activeTab === 'terms') return TERMS_AND_CONDITIONS_TEXT
    if (activeTab === 'cookies') return COOKIE_POLICY_TEXT
    return PRIVACY_POLICY_TEXT
  }, [activeTab])

  const pageTitle = activeTab === 'terms' ? 'Terms and Conditions' : activeTab === 'cookies' ? 'Cookie Policy' : 'Privacy Policy'

  return (
    <div className="privacy-page">
      <div className="privacy-hero">
        <h1 className="privacy-hero__title">{pageTitle}</h1>
        <p className="privacy-hero__subtitle">Legal and informational policies</p>
      </div>

      <div className="privacy-body">
        <div className="privacy-tabs privacy-tabs--glass" role="tablist" aria-label="Legal tabs">
          <button
            className={`privacy-tab ${activeTab === 'privacy' ? 'privacy-tab--active' : ''}`}
            onClick={() => navigate('/privacy-policy')}
            role="tab"
            aria-selected={activeTab === 'privacy'}
            type="button"
          >
            Privacy Policy
          </button>
          <button
            className={`privacy-tab ${activeTab === 'terms' ? 'privacy-tab--active' : ''}`}
            onClick={() => navigate('/terms-and-conditions')}
            role="tab"
            aria-selected={activeTab === 'terms'}
            type="button"
          >
            Terms and Conditions
          </button>
          <button
            className={`privacy-tab ${activeTab === 'cookies' ? 'privacy-tab--active' : ''}`}
            onClick={() => navigate('/cookie-policy')}
            role="tab"
            aria-selected={activeTab === 'cookies'}
            type="button"
          >
            Cookie Policy
          </button>
        </div>

        <section className="privacy-section privacy-section--premium" role="tabpanel">
          <pre className="privacy-section__content">{tabContent}</pre>
        </section>
      </div>
    </div>
  )
}

export default PrivacyPolicy
