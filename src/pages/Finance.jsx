import React, { useState } from 'react'
import './Finance.css'

const FinanceDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [dateRange, setDateRange] = useState('today')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const user = {
    name: 'John',
    walletBalance: 1250.00,
    totalSpent: 4780.50,
    pendingInvoices: 2,
    paidInvoices: 15,
    creditAvailable: 5000.00
  }

  const financialSummary = [
    {
      id: 1,
      title: 'Total Payments',
      amount: 145250.00,
      change: '+12.5%',
      trend: 'up',
      icon: 'payments'
    },
    {
      id: 2,
      title: 'Total Revenue',
      amount: 287500.00,
      change: '+8.3%',
      trend: 'up',
      icon: 'revenue'
    },
    {
      id: 3,
      title: 'Pending Approvals',
      amount: 12,
      change: '-2 new',
      trend: 'down',
      icon: 'approvals'
    },
    {
      id: 4,
      title: 'Manual Entries',
      amount: 8,
      change: 'No change',
      trend: 'neutral',
      icon: 'entries'
    }
  ]

  const financeLogs = [
    {
      id: 1,
      action: 'Payment Received',
      details: 'Buyer: John Doe • Invoice #INV-2024-0123',
      officer: 'Sarah Miller (Admin)',
      dateTime: '2024-01-25 14:30:45',
      amount: 1250.00,
      status: 'completed'
    },
    {
      id: 2,
      action: 'Refund Processed',
      details: 'Order #ORD-2024-0456 • Refund ID: RFD-789',
      officer: 'Michael Chen (Finance)',
      dateTime: '2024-01-25 12:15:22',
      amount: 450.00,
      status: 'completed'
    },
    {
      id: 3,
      action: 'Fee Adjusted',
      details: 'Seller commission adjustment • Seller ID: SEL-123',
      officer: 'David Wilson (Admin)',
      dateTime: '2024-01-25 10:45:18',
      amount: -150.00,
      status: 'completed'
    },
    {
      id: 4,
      action: 'Payment Failed',
      details: 'Transaction declined • Card ending in 7890',
      officer: 'System',
      dateTime: '2024-01-25 09:20:33',
      amount: 0.00,
      status: 'failed'
    },
    {
      id: 5,
      action: 'Payment Received',
      details: 'Buyer: Emily Johnson • Invoice #INV-2024-0124',
      officer: 'Sarah Miller (Admin)',
      dateTime: '2024-01-24 16:45:12',
      amount: 3200.00,
      status: 'completed'
    },
    {
      id: 6,
      action: 'Refund Processed',
      details: 'Order #ORD-2024-0457 • Refund ID: RFD-790',
      officer: 'Michael Chen (Finance)',
      dateTime: '2024-01-24 14:20:55',
      amount: 1200.00,
      status: 'pending'
    },
    {
      id: 7,
      action: 'Fee Adjusted',
      details: 'Platform fee waiver • Promotion code applied',
      officer: 'David Wilson (Admin)',
      dateTime: '2024-01-24 11:10:42',
      amount: -75.00,
      status: 'completed'
    },
    {
      id: 8,
      action: 'Payment Failed',
      details: 'Insufficient funds • Account ending in 1234',
      officer: 'System',
      dateTime: '2024-01-24 09:05:19',
      amount: 0.00,
      status: 'failed'
    },
    {
      id: 9,
      action: 'Payment Received',
      details: 'Buyer: Robert Davis • Invoice #INV-2024-0125',
      officer: 'Sarah Miller (Admin)',
      dateTime: '2024-01-23 15:30:28',
      amount: 850.00,
      status: 'completed'
    },
    {
      id: 10,
      action: 'Refund Processed',
      details: 'Order #ORD-2024-0458 • Refund ID: RFD-791',
      officer: 'Michael Chen (Finance)',
      dateTime: '2024-01-23 13:45:37',
      amount: 225.00,
      status: 'completed'
    },
    {
      id: 11,
      action: 'Fee Adjusted',
      details: 'Late payment penalty • Invoice #INV-2024-0115',
      officer: 'System',
      dateTime: '2024-01-23 10:15:09',
      amount: 50.00,
      status: 'completed'
    },
    {
      id: 12,
      action: 'Payment Failed',
      details: 'Expired card • Card ending in 5678',
      officer: 'System',
      dateTime: '2024-01-23 08:30:44',
      amount: 0.00,
      status: 'failed'
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

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getActionBadge = (action, status) => {
    const config = {
      'Payment Received': {
        color: '#8CC63F',
        bg: 'rgba(140, 198, 63, 0.15)',
        border: 'rgba(140, 198, 63, 0.4)',
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6312 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6312 13.6815 18 14.5717 18 15.5C18 16.4283 17.6312 17.3185 16.9749 17.9749C16.3185 18.6312 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      },
      'Refund Processed': {
        color: '#3B82F6',
        bg: 'rgba(59, 130, 246, 0.15)',
        border: 'rgba(59, 130, 246, 0.4)',
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M20 12H4M4 12L10 18M4 12L10 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      },
      'Fee Adjusted': {
        color: '#8B5CF6',
        bg: 'rgba(139, 92, 246, 0.15)',
        border: 'rgba(139, 92, 246, 0.4)',
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
      },
      'Payment Failed': {
        color: '#EF4444',
        bg: 'rgba(239, 68, 68, 0.15)',
        border: 'rgba(239, 68, 68, 0.4)',
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      }
    }

    const actionConfig = config[action] || config['Payment Received']

    return (
      <span 
        className="action-badge"
        style={{
          backgroundColor: actionConfig.bg,
          color: actionConfig.color,
          border: `1px solid ${actionConfig.border}`
        }}
      >
        {actionConfig.icon}
        {action}
        {status === 'pending' && (
          <span className="pending-dot"></span>
        )}
      </span>
    )
  }

  const getStatusBadge = (status) => {
    const config = {
      'completed': {
        text: 'Completed',
        color: '#8CC63F',
        bg: 'rgba(140, 198, 63, 0.15)'
      },
      'pending': {
        text: 'Pending',
        color: '#F59E0B',
        bg: 'rgba(245, 158, 11, 0.15)'
      },
      'failed': {
        text: 'Failed',
        color: '#EF4444',
        bg: 'rgba(239, 68, 68, 0.15)'
      }
    }

    const statusConfig = config[status] || config['pending']

    return (
      <span 
        className="status-badge"
        style={{
          backgroundColor: statusConfig.bg,
          color: statusConfig.color,
          border: `1px solid ${statusConfig.color}40`
        }}
      >
        {statusConfig.text}
      </span>
    )
  }

  const filteredLogs = financeLogs.filter(log => {
    if (searchTerm && !log.details.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !log.officer.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    if (actionFilter !== 'all' && log.action !== actionFilter) {
      return false
    }

    if (dateRange === 'today') {
      const today = new Date().toISOString().split('T')[0]
      return log.dateTime.startsWith(today)
    } else if (dateRange === 'yesterday') {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]
      return log.dateTime.startsWith(yesterdayStr)
    } else if (dateRange === 'last7') {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      return new Date(log.dateTime) >= sevenDaysAgo
    }

    return true
  })

  console.log('filteredLogs: ', filteredLogs);
  

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  console.log('totalPages: ', totalPages);
  
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentLogs = filteredLogs.slice(startIndex, endIndex)
  console.log('current Logs: ', currentLogs);
  
  const handlePageChange = (page) => {
    setCurrentPage(page)
    document.querySelector('.finance-table-section').scrollIntoView({ behavior: 'smooth' })
  }

  const handleNewManualEntry = () => {
    console.log('Open new manual entry form')
  }

  return (
    <div className="dashboard-page">

      {/* Main Dashboard Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Welcome Section */}
          <div className="dashboard-welcome">
            <div className="welcome-content">
              <h1 className="welcome-title">Finance Dashboard</h1>
              <p className="welcome-subtitle">Welcome back, here is your financial overview for today.</p>
            </div>
            <div className="welcome-actions">
              <button className="action-button primary" onClick={handleNewManualEntry}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                New Manual Entry
              </button>
            
            </div>
          </div>

          {/* Finance Summary Cards */}
          <div className="summary-cards">
            {financialSummary.map((stat) => (
              <div key={stat.id} className="summary-card">
                <div className="card-background-gradient" style={{ 
                  background: stat.trend === 'up' 
                    ? 'linear-gradient(135deg, rgba(140, 198, 63, 0.15) 0%, rgba(140, 198, 63, 0.05) 100%)'
                    : stat.trend === 'down'
                    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(156, 163, 175, 0.15) 0%, rgba(156, 163, 175, 0.05) 100%)'
                }}></div>
                <div className="card-icon" style={{ 
                  backgroundColor: stat.trend === 'up' 
                    ? 'rgba(140, 198, 63, 0.2)'
                    : stat.trend === 'down'
                    ? 'rgba(239, 68, 68, 0.2)'
                    : 'rgba(156, 163, 175, 0.2)',
                  borderColor: stat.trend === 'up'
                    ? 'rgba(140, 198, 63, 0.4)'
                    : stat.trend === 'down'
                    ? 'rgba(239, 68, 68, 0.4)'
                    : 'rgba(156, 163, 175, 0.4)'
                }}>
                  {stat.icon === 'payments' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6312 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6312 13.6815 18 14.5717 18 15.5C18 16.4283 17.6312 17.3185 16.9749 17.9749C16.3185 18.6312 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {stat.icon === 'revenue' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {stat.icon === 'approvals' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {stat.icon === 'entries' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div className="card-content">
                  <span className="card-label">{stat.title}</span>
                  <span className="card-value">
                    {stat.title.includes('Total') ? formatCurrency(stat.amount) : stat.amount}
                  </span>
                  <span className="card-sublabel" style={{ 
                    color: stat.trend === 'up' 
                      ? '#8CC63F'
                      : stat.trend === 'down'
                      ? '#EF4444'
                      : 'rgba(255, 255, 255, 0.5)'
                  }}>
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Filters Section */}
          <div className="finance-filters-section">
            <div className="filters-container">
              <div className="search-section">
                <div className="search-input-wrapper">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search logs by details or officer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  {/* {searchTerm && (
                    <button 
                      className="clear-search"
                      onClick={() => setSearchTerm('')}
                      aria-label="Clear search"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )} */}
                </div>
              </div>

              <div className="filter-controls">
                <div className="filter-group">
                  <label className="filter-label">Filter By Action</label>
                  <div className="filter-select-wrapper">
                    <select 
                      className="filter-select"
                      value={actionFilter}
                      onChange={(e) => setActionFilter(e.target.value)}
                    >
                      <option value="all">All Actions</option>
                      <option value="Payment Received">Payment Received</option>
                      <option value="Refund Processed">Refund Processed</option>
                      <option value="Fee Adjusted">Fee Adjusted</option>
                      <option value="Payment Failed">Payment Failed</option>
                    </select>
                  </div>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Select Date Range</label>
                  <div className="filter-select-wrapper">
                    <select 
                      className="filter-select"
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                    >
                      <option value="today">Today</option>
                      <option value="yesterday">Yesterday</option>
                      <option value="last7">Last 7 Days</option>
                      <option value="last30">Last 30 Days</option>
                      <option value="all">All Time</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Finance Logs Table */}
          <div className="finance-table-section">
            <div className="section-header">
              <h2 className="section-title">Financial Activity Logs</h2>
              <div className="results-info">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredLogs.length)} of {filteredLogs.length} entries
              </div>
            </div>

            <div className="table-container">
              <div className="finance-table-wrapper">
                <table className="finance-table">
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>Details</th>
                      {/* <th>Amount</th> */}
                      <th>Officer</th>
                      <th>Date & Time</th>
                      {/* <th>Status</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {currentLogs.length == 0 ? (
                      financeLogs.map((log) => (
                        <tr key={log.id} className="table-row">
                          <td>
                            <div className="action-cell">
                              {getActionBadge(log.action, log.status)}
                            </div>
                          </td>
                          <td>
                            <div className="details-cell">
                              <div className="details-text">{log.details}</div>
                            </div>
                          </td>
                          {/* <td>
                            <div className={`amount-cell ${log.amount > 0 ? 'positive' : log.amount < 0 ? 'negative' : 'zero'}`}>
                              {log.amount !== 0 ? (
                                <>
                                  {log.amount > 0 ? '+' : ''}
                                  {formatCurrency(log.amount)}
                                </>
                              ) : (
                                formatCurrency(log.amount)
                              )}
                            </div>
                          </td> */}
                          <td>
                            <div className="officer-cell">
                              <div className="officer-avatar">
                                {log.officer.startsWith('System') ? (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                  </svg>
                                ) : (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                              </div>
                              <span className="officer-name">{log.officer}</span>
                            </div>
                          </td>
                          <td>
                            <div className="datetime-cell">
                              <span className="date-text">{formatDateTime(log.dateTime)}</span>
                            </div>
                          </td>
                          {/* <td>
                            {getStatusBadge(log.status)}
                          </td> */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">
                          <div className="empty-state">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <h3>No logs found</h3>
                            <p>Try adjusting your filters or search term</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {/* {filteredLogs.length > itemsPerPage && (
              <div className="pagination">
                <button 
                  className="pagination-button prev"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Previous
                </button>

                <div className="pagination-pages">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    if (pageNum > totalPages) return null

                    return (
                      <button
                        key={pageNum}
                        className={`pagination-page ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    )
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="pagination-ellipsis">...</span>
                      <button
                        className="pagination-page"
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                <button 
                  className="pagination-button next"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )} */}
          </div>
        </div>
      </main>
    </div>
  )
}

export default FinanceDashboard;