import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './BuyerInvoices.css'

const BuyerInvoices = () => {
  const [invoiceFilter, setInvoiceFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedInvoices, setSelectedInvoices] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const invoices = [
    {
      id: 1,
      invoiceNumber: 'INV-2024-003',
      dueDate: '15 Oct, 2024',
      amount: 2750.00,
      status: 'pending',
      lotId: '#789012',
      itemTitle: 'Vintage Abstract Painting'
    },
    {
      id: 2,
      invoiceNumber: 'INV-2024-002',
      paidDate: '10 Sep, 2024',
      amount: 850.50,
      status: 'paid',
      lotId: '#456789',
      itemTitle: '1985 Rolex Submariner'
    },
    {
      id: 3,
      invoiceNumber: 'INV-2024-001',
      dueDate: '25 Aug, 2024',
      amount: 1500.00,
      status: 'overdue',
      lotId: '#123456',
      itemTitle: '1969 Ford Mustang Boss 429'
    },
    {
      id: 4,
      invoiceNumber: 'INV-2024-004',
      paidDate: '28 May, 2024',
      amount: 890.00,
      status: 'paid',
      lotId: '#5678',
      itemTitle: 'Classic Persian Rug'
    },
    {
      id: 5,
      invoiceNumber: 'INV-2024-005',
      dueDate: '20 Oct, 2024',
      amount: 650.00,
      status: 'pending',
      lotId: '#9012',
      itemTitle: 'Mid-Century Modern Lamp'
    }
  ]

  const paymentHistory = [
    {
      id: 1,
      transactionId: 'TRX-987654321',
      date: '10 Sep, 2024',
      amount: 850.50,
      paymentMethod: 'Visa **** 1234',
      invoiceNumber: 'INV-2024-002',
      status: 'completed'
    },
    {
      id: 2,
      transactionId: 'TRX-123456789',
      date: '05 Jul, 2024',
      amount: 4200.00,
      paymentMethod: 'Mastercard **** 5678',
      invoiceNumber: 'INV-2024-000',
      status: 'completed'
    },
    {
      id: 3,
      transactionId: 'TRX-456789123',
      date: '28 May, 2024',
      amount: 890.00,
      paymentMethod: 'Visa **** 1234',
      invoiceNumber: 'INV-2024-004',
      status: 'completed'
    },
    {
      id: 4,
      transactionId: 'TRX-789123456',
      date: '15 Jun, 2024',
      amount: 2200.00,
      paymentMethod: 'PayPal',
      invoiceNumber: 'INV-2024-001',
      status: 'completed'
    },
    {
      id: 5,
      transactionId: 'TRX-321654987',
      date: '22 Apr, 2024',
      amount: 1200.00,
      paymentMethod: 'Mastercard **** 5678',
      invoiceNumber: 'INV-2024-003',
      status: 'completed'
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

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = searchQuery === '' || 
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.itemTitle.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = invoiceFilter === 'all' || 
      invoice.status === invoiceFilter
    
    return matchesSearch && matchesFilter
  })

  const handleInvoiceSelect = (invoiceId) => {
    setSelectedInvoices(prev =>
      prev.includes(invoiceId)
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    )
  }

  const handleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([])
    } else {
      setSelectedInvoices(filteredInvoices.map(inv => inv.id))
    }
  }

  const itemsPerPage = 10
  const totalPages = Math.ceil(paymentHistory.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visiblePayments = paymentHistory.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="invoices-page">

      <div className="invoices-content">
        <div className="invoices-container">
      
          <nav className="breadcrumbs">
            <Link to="/buyer/dashboard">Dashboard</Link>
            <span>/</span>
            <span>Invoices & Payment History</span>
          </nav>

          <div className="page-header">
            <h1 className="page-title">Invoices & Payment History</h1>
            <button className="export-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Export History
            </button>
          </div>

          <section className="invoices-section">
            <h2 className="section-title">My Invoices</h2>
            
            <div className="invoices-controls">
              <div className="filter-tabs">
                <button
                  className={`filter-tab ${invoiceFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setInvoiceFilter('all')}
                >
                  All
                </button>
                <button
                  className={`filter-tab ${invoiceFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => setInvoiceFilter('pending')}
                >
                  Pending Payment
                </button>
                <button
                  className={`filter-tab ${invoiceFilter === 'paid' ? 'active' : ''}`}
                  onClick={() => setInvoiceFilter('paid')}
                >
                  Paid
                </button>
                <button
                  className={`filter-tab ${invoiceFilter === 'overdue' ? 'active' : ''}`}
                  onClick={() => setInvoiceFilter('overdue')}
                >
                  Overdue
                </button>
              </div>
              
              <div className="search-wrapper">
                <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="invoice-list">
              {filteredInvoices.map(invoice => (
                <div 
                  key={invoice.id} 
                  className={`invoice-card ${invoice.status === 'overdue' ? 'overdue' : ''}`}
                >
                  <div className="invoice-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedInvoices.includes(invoice.id)}
                      onChange={() => handleInvoiceSelect(invoice.id)}
                    />
                  </div>
                  
                  <div className="invoice-info">
                    <div className="invoice-header">
                      <div className="invoice-id">#{invoice.invoiceNumber}</div>
                      {invoice.status === 'pending' && (
                        <div className="invoice-due-date">Due Date: {invoice.dueDate}</div>
                      )}
                      {invoice.status === 'paid' && (
                        <div className="invoice-paid-date">Paid on: {invoice.paidDate}</div>
                      )}
                      {invoice.status === 'overdue' && (
                        <div className="invoice-due-date overdue-date">Due Date: {invoice.dueDate}</div>
                      )}
                    </div>
                    
                    <div className="invoice-details">
                      <div className="invoice-amount">{formatCurrency(invoice.amount)}</div>
                      <div className={`invoice-status ${invoice.status}`}>
                        {invoice.status === 'pending' && 'PENDING'}
                        {invoice.status === 'paid' && 'PAID'}
                        {invoice.status === 'overdue' && 'OVERDUE'}
                      </div>
                    </div>
                  </div>

                  <div className="invoice-actions">
                    {invoice.status !== 'paid' && (
                      <button 
                        className="action-btn primary"
                        // onClick={() => navigate(`/payment/${invoice.id}`)}
                      >
                        Pay Now
                      </button>
                    )}
                    <button 
                      className="action-btn secondary"
                      // onClick={() => window.open(`/invoice/${invoice.invoiceNumber}/pdf`, '_blank')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Download PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="payment-history-section">
            <h2 className="section-title">Payment History</h2>
            
            <div className="payment-table-wrapper">
              <table className="payment-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Date of Payment</th>
                    <th>Amount Paid</th>
                    <th>Payment Method</th>
                    <th>Invoice #</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visiblePayments.map(payment => (
                    <tr key={payment.id}>
                      <td className="transaction-id">{payment.transactionId}</td>
                      <td>{payment.date}</td>
                      <td className="amount">{formatCurrency(payment.amount)}</td>
                      <td>{payment.paymentMethod}</td>
                      <td>{payment.invoiceNumber}</td>
                      <td>
                        <span className={`status-badge ${payment.status}`}>
                          {payment.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="table-pagination">
              <div className="pagination-info">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, paymentHistory.length)} of {paymentHistory.length} results
              </div>
              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default BuyerInvoices



