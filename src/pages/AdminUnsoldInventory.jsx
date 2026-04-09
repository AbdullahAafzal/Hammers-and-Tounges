import React, { useCallback, useEffect, useState } from 'react'
import { adminService } from '../services/interceptors/admin.service'
import './AdminFinance.css'
import './AdminUnsoldInventory.css'

const formatMoney = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0)

const parseErrorMessage = (err) => {
  const d = err?.response?.data
  if (typeof d === 'string') return d
  if (d?.detail) return Array.isArray(d.detail) ? d.detail.map((x) => x?.msg || x).join(' ') : String(d.detail)
  if (d?.message) return String(d.message)
  if (err?.message) return err.message
  return 'Something went wrong. Please try again.'
}

const DataTable = ({ title, columns, rows, emptyMessage }) => (
  <section className="unsold-inventory-section" aria-labelledby={`unsold-section-${title.replace(/\s+/g, '-')}`}>
    <div className="finance-section-header">
      <h2 className="finance-section-title" id={`unsold-section-${title.replace(/\s+/g, '-')}`}>
        {title}
      </h2>
    </div>
    <div className="finance-table-container">
      <div className="finance-table-wrapper">
        <table className="finance-table unsold-inventory-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="unsold-inventory-empty-cell">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr key={idx} className="finance-table-row">
                  {columns.map((col) => (
                    <td key={col.key}>{row[col.key]}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </section>
)

const AdminUnsoldInventory = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await adminService.getAgingDashboard()
      setData(res)
    } catch (e) {
      setError(parseErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const breakdowns = data?.breakdowns || {}
  const byCategory = Array.isArray(breakdowns.by_category) ? breakdowns.by_category : []
  const bySeller = Array.isArray(breakdowns.by_seller) ? breakdowns.by_seller : []
  const byEvent = Array.isArray(breakdowns.by_event) ? breakdowns.by_event : []
  const byAge = Array.isArray(breakdowns.by_age_bracket) ? breakdowns.by_age_bracket : []

  const maxAgeValue = byAge.reduce((m, b) => Math.max(m, Number(b?.total_value) || 0), 0) || 1

  return (
    <div className="finance-dashboard unsold-inventory-dashboard">
      <main className="finance-main">
        <div className="finance-container">
          <header className="finance-header unsold-inventory-header">
            <div className="finance-header-content">
              <h1 className="finance-title">Unsold Inventory</h1>
              <p className="finance-subtitle">
                Long-stay aging overview: total value held in unsold lots and breakdowns by category, seller, event, and age.
              </p>
            </div>
            <div className="finance-header-actions">
              <button
                type="button"
                className="finance-primary-btn"
                onClick={load}
                disabled={loading}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </header>

          {error && (
            <div className="unsold-inventory-error" role="alert">
              {error}
            </div>
          )}

          {loading && !data && (
            <div className="unsold-inventory-loading" aria-busy="true" aria-live="polite">
              <div className="unsold-inventory-loading-spinner" />
              <p>Loading aging dashboard…</p>
            </div>
          )}

          {data && (
            <>
              <div className="finance-summary-grid unsold-inventory-summary">
                <div className="finance-summary-card trend-up">
                  <div className="finance-card-background" aria-hidden="true" />
                  <div className="finance-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="finance-card-content">
                    <p className="finance-card-label">Total long-stay value</p>
                    <p className="finance-card-value">{formatMoney(data.total_long_stay_value)}</p>
                    <span className="finance-card-change neutral">Across all unsold aging lots</span>
                  </div>
                </div>
              </div>

              <section className="unsold-inventory-section" aria-labelledby="unsold-age-heading">
                <div className="finance-section-header">
                  <h2 className="finance-section-title" id="unsold-age-heading">
                    By age bracket
                  </h2>
                </div>
                <div className="unsold-inventory-age-grid">
                  {byAge.map((row) => {
                    const val = Number(row?.total_value) || 0
                    const pct = maxAgeValue > 0 ? Math.round((val / maxAgeValue) * 100) : 0
                    return (
                      <div key={row.bracket} className="unsold-inventory-age-row">
                        <div className="unsold-inventory-age-label">
                          <span className="unsold-inventory-age-name">{row.bracket}</span>
                          <span className="unsold-inventory-age-meta">
                            {row.count ?? 0} lots · {formatMoney(val)}
                          </span>
                        </div>
                        <div className="unsold-inventory-age-bar-track" role="presentation">
                          <div
                            className="unsold-inventory-age-bar-fill"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>

              <div className="unsold-inventory-tables">
                <DataTable
                  title="By category"
                  columns={[
                    { key: 'name', label: 'Category' },
                    { key: 'count', label: 'Lots' },
                    { key: 'total_value', label: 'Total value' },
                  ]}
                  rows={byCategory.map((r) => ({
                    name: r.category__name ?? '—',
                    count: r.count ?? 0,
                    total_value: formatMoney(r.total_value),
                  }))}
                  emptyMessage="No category breakdown data."
                />

                <DataTable
                  title="By seller"
                  columns={[
                    { key: 'email', label: 'Seller' },
                    { key: 'count', label: 'Lots' },
                    { key: 'total_value', label: 'Total value' },
                  ]}
                  rows={bySeller.map((r) => ({
                    email: r.seller__email ?? '—',
                    count: r.count ?? 0,
                    total_value: formatMoney(r.total_value),
                  }))}
                  emptyMessage="No seller breakdown data."
                />

                <DataTable
                  title="By event"
                  columns={[
                    { key: 'title', label: 'Event' },
                    { key: 'count', label: 'Lots' },
                    { key: 'total_value', label: 'Total value' },
                  ]}
                  rows={byEvent.map((r) => ({
                    title: r.auction_event__title ?? '—',
                    count: r.count ?? 0,
                    total_value: formatMoney(r.total_value),
                  }))}
                  emptyMessage="No event breakdown data."
                />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminUnsoldInventory
