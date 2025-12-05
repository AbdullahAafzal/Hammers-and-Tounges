import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import './Wallet.css'

const Wallet = () => {
  const navigate = useNavigate()

  // Mock wallet data
  const walletData = {
    availableBalance: 1250.75,
    reservedForBids: 350.00
  }

  const transactions = [
    {
      id: 1,
      type: 'deposit',
      description: 'Deposit via Card',
      date: 'Oct 25, 2023',
      amount: 500.00
    },
    {
      id: 2,
      type: 'withdrawal',
      description: 'Won Bid #84321',
      date: 'Oct 24, 2023',
      amount: 150.00
    },
    {
      id: 3,
      type: 'withdrawal',
      description: 'Won Bid #84199',
      date: 'Oct 22, 2023',
      amount: 200.00
    },
    {
      id: 4,
      type: 'deposit',
      description: 'Deposit via Bank Transfer',
      date: 'Oct 20, 2023',
      amount: 1100.75
    },
    {
      id: 5,
      type: 'withdrawal',
      description: 'Won Bid #83987',
      date: 'Oct 18, 2023',
      amount: 450.00
    },
    {
      id: 6,
      type: 'deposit',
      description: 'Deposit via Card',
      date: 'Oct 15, 2023',
      amount: 300.00
    }
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div className="wallet-page">
      {/* Buyer Dashboard Header */}
      <header className="wallet-header">
        <div className="wallet-header-container">
          <Link to="/dashboard" className="wallet-logo">
            <img src={logo} alt="Hammers & Tongues Logo" />
            <span>Hammers & Tongues</span>
          </Link>
          
          <nav className="wallet-nav">
            <Link to="/dashboard" className="nav-link">Home</Link>
            <Link to="/buyer/auctions" className="nav-link">Auctions</Link>
            <Link to="/my-bids" className="nav-link">My Bids</Link>
            <Link to="/won-items" className="nav-link">Won Items</Link>
          </nav>

          <div className="wallet-header-right">
            <button className="notification-button" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 0 0 6 8C6 11.3137 3.31371 14 0 14M18 8C20.2091 8 22 9.79086 22 12C22 14.2091 20.2091 16 18 16M18 8C20.2091 8 22 5.79086 22 3C22 0.790861 20.2091 -1 18 -1C15.7909 -1 14 0.790861 14 3C14 5.79086 15.7909 8 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 8C6 11.3137 8.68629 14 12 14C15.3137 14 18 11.3137 18 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="notification-badge">3</span>
            </button>
            <Link to="/profile" className="profile-button" aria-label="Profile">
              <div className="profile-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Wallet Content */}
      <div className="wallet-content">
        <div className="wallet-container">
          {/* Breadcrumbs */}
          <nav className="breadcrumbs">
            <Link to="/dashboard">Dashboard</Link>
            <span>/</span>
            <span>My Wallet</span>
          </nav>

          {/* Page Header */}
          <div className="page-header">
            <h1 className="page-title">My Wallet</h1>
          </div>

          {/* Wallet Cards Grid */}
          <div className="wallet-grid">
            {/* Left Column - Balance Cards */}
            <div className="wallet-left-column">
              {/* Available Balance Card */}
              <div className="balance-card available-balance-card">
                <div className="balance-label">Available Balance</div>
                <div className="balance-amount">{formatCurrency(walletData.availableBalance)}</div>
                <button 
                  className="deposit-button"
                  onClick={() => navigate('/deposit')}
                >
                  <div className="deposit-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  Deposit Funds
                </button>
              </div>

              {/* Reserved for Bids Card */}
              <div className="balance-card reserved-card">
                <div className="reserved-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>Reserved for Bids</span>
                </div>
                <div className="reserved-amount">{formatCurrency(walletData.reservedForBids)}</div>
                <p className="reserved-description">
                  This amount is temporarily held for your active bids and will be released if you are outbid.
                </p>
              </div>
            </div>

            {/* Right Column - Recent Transactions */}
            <div className="wallet-right-column">
              <div className="transactions-card">
                <div className="transactions-header">
                  <h2 className="transactions-title">Recent Transactions</h2>
                  <Link to="/transactions" className="view-all-link">View All</Link>
                </div>
                
                <div className="transactions-list">
                  {transactions.map(transaction => (
                    <div key={transaction.id} className="transaction-item">
                      <div className="transaction-icon-wrapper">
                        <div className={`transaction-icon ${transaction.type === 'deposit' ? 'deposit-icon-bg' : 'withdrawal-icon-bg'}`}>
                          {transaction.type === 'deposit' ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M5 12H19M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="transaction-details">
                        <div className="transaction-description">{transaction.description}</div>
                        <div className="transaction-date">{transaction.date}</div>
                      </div>
                      <div className={`transaction-amount ${transaction.type === 'deposit' ? 'deposit-amount' : 'withdrawal-amount'}`}>
                        {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Wallet


