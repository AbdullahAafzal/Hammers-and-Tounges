import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { adminService } from '../services/interceptors/admin.service'
import { canAuthoriseRefunds } from '../utils/financeAccess'
import { isRefundAuthorisedStatus, isRefundVerifiedStatus } from '../utils/twoFaRefundHelpers'
import {
  formatDateTime,
  getRefundPaymentDetails,
  getRefundUserDisplay,
  refundChannelLabel,
  refundStatusBadgeClass,
  sortedAuditLogs,
} from '../utils/financeRefundDisplay'
import {
  filterBankingProfilesForRefund,
  getRefundBuyerEmailForMatching,
} from '../utils/refundBankingProfiles'
import './AdminFinance.css'
import './AdminFinanceRefundPages.css'

const FINANCE_TAB_AUTHORISE = 'authorise_refund'

function bankingDisplay(value) {
  if (value == null) return '—'
  const s = String(value).trim()
  return s === '' ? '—' : s
}

export default function AdminFinanceRefundDetail() {
  const { refundId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const authUser = useSelector((s) => s.auth?.user)
  const financeBase = location.pathname.startsWith('/manager/') ? '/manager/finance' : '/admin/finance'
  const id = Number.parseInt(String(refundId || ''), 10)
  const [loading, setLoading] = useState(true)
  const [refund, setRefund] = useState(null)
  const [bankingRaw, setBankingRaw] = useState([])
  const [bankingStatus, setBankingStatus] = useState('idle')
  const [bankingError, setBankingError] = useState('')

  const refundEmailForBanking = useMemo(
    () => (refund ? getRefundBuyerEmailForMatching(refund) : ''),
    [refund],
  )

  const bankingProfiles = useMemo(
    () => (refund ? filterBankingProfilesForRefund(refund, bankingRaw) : []),
    [refund, bankingRaw],
  )

  useEffect(() => {
    if (!refund) return
    console.log('[RefundBanking][web] match-input', {
      refundId: refund?.id,
      refundEmailForBanking,
    })
  }, [refund, refundEmailForBanking])

  useEffect(() => {
    if (!refund) return
    console.log('[RefundBanking][web] filter-output', {
      refundId: refund?.id,
      bankingStatus,
      rawType: Array.isArray(bankingRaw) ? 'array' : typeof bankingRaw,
      rawCount:
        Array.isArray(bankingRaw)
          ? bankingRaw.length
          : Array.isArray(bankingRaw?.results)
            ? bankingRaw.results.length
            : Array.isArray(bankingRaw?.data)
              ? bankingRaw.data.length
              : 0,
      filteredCount: bankingProfiles.length,
      filteredProfiles: bankingProfiles,
    })
  }, [refund, bankingStatus, bankingRaw, bankingProfiles])

  const goBack = useCallback(() => {
    navigate(financeBase, {
      replace: false,
      state: { financeActiveTab: FINANCE_TAB_AUTHORISE, refreshAuthorise: true },
    })
  }, [navigate, financeBase])

  const load = useCallback(async () => {
    if (!Number.isFinite(id)) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const data = await adminService.getRefundRequestById(id)
      setRefund(data && typeof data === 'object' ? data : null)
    } catch (err) {
      const raw =
        err?.response?.data?.detail || err?.response?.data?.message || err?.message || 'Could not load refund'
      toast.error(typeof raw === 'string' ? raw : 'Could not load refund')
      setRefund(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!refund) {
      setBankingRaw([])
      setBankingStatus('idle')
      setBankingError('')
      return undefined
    }
    const emailNorm = getRefundBuyerEmailForMatching(refund)
    if (!emailNorm) {
      setBankingRaw([])
      setBankingStatus('no_email')
      setBankingError('')
      return undefined
    }
    let cancelled = false
    setBankingStatus('loading')
    setBankingError('')
    adminService
      .getBankingProfiles()
      .then((list) => {
        if (cancelled) return
        console.log('[RefundBanking][web] banking-api-response', list)
        setBankingRaw(list ?? [])
        setBankingStatus('ready')
      })
      .catch((err) => {
        if (cancelled) return
        const raw =
          err?.response?.data?.detail || err?.response?.data?.message || err?.message || 'Could not load banking profiles'
        setBankingError(typeof raw === 'string' ? raw : 'Could not load banking profiles')
        setBankingRaw([])
        setBankingStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [refund])

  if (!canAuthoriseRefunds(authUser)) {
    return <Navigate to={financeBase} replace />
  }
  if (!Number.isFinite(id)) {
    return <Navigate to={financeBase} replace />
  }

  const authPath = `${financeBase}/refunds/${id}/authorize`
  const disbursePath = `${financeBase}/refunds/${id}/disburse`

  const renderBankingSection = () => {
    if (!refund) return null
    return (
      <section className="finance-refund-banking-shell" aria-labelledby="refund-banking-heading">
        <h2 id="refund-banking-heading" className="finance-refund-banking-title">
          Client banking profiles
        </h2>
        {!refundEmailForBanking ? (
          <p className="finance-refund-banking-muted">No customer email on this refund; banking accounts cannot be matched.</p>
        ) : null}
        {bankingStatus === 'loading' ? (
          <div className="finance-refund-banking-loading" role="status">
            Loading banking profiles…
          </div>
        ) : null}
        {bankingStatus === 'error' ? (
          <p className="finance-refund-banking-error" role="alert">
            {bankingError}
          </p>
        ) : null}
        {refundEmailForBanking && bankingStatus === 'ready' && bankingProfiles.length === 0 ? (
          <p className="finance-refund-banking-muted">No banking profiles found for this user.</p>
        ) : null}
        {refundEmailForBanking && bankingStatus === 'ready' && bankingProfiles.length > 0 ? (
          <div className="finance-refund-banking-stack">
            {bankingProfiles.map((p) => (
              <article key={String(p?.id ?? `${p?.account_number}-${p?.bank_name}`)} className="finance-refund-banking-card">
                <div className="finance-refund-banking-kv-row">
                  <span className="finance-refund-banking-kv-label">Account name</span>
                  <span className="finance-refund-banking-kv-value">{bankingDisplay(p?.account_name)}</span>
                </div>
                <div className="finance-refund-banking-kv-row">
                  <span className="finance-refund-banking-kv-label">Bank name</span>
                  <span className="finance-refund-banking-kv-value">{bankingDisplay(p?.bank_name)}</span>
                </div>
                <div className="finance-refund-banking-kv-row">
                  <span className="finance-refund-banking-kv-label">Account number</span>
                  <span className="finance-refund-banking-kv-value">{bankingDisplay(p?.account_number)}</span>
                </div>
                <div className="finance-refund-banking-kv-row">
                  <span className="finance-refund-banking-kv-label">Branch code</span>
                  <span className="finance-refund-banking-kv-value">{bankingDisplay(p?.branch_code)}</span>
                </div>
                <div className="finance-refund-banking-kv-row">
                  <span className="finance-refund-banking-kv-label">Swift code</span>
                  <span className="finance-refund-banking-kv-value">{bankingDisplay(p?.swift_code)}</span>
                </div>
                <div className="finance-refund-banking-kv-row">
                  <span className="finance-refund-banking-kv-label">Last updated</span>
                  <span className="finance-refund-banking-kv-value">{formatDateTime(p?.updated_at)}</span>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    )
  }

  return (
    <div className="finance-refund-shell">
      <div className="finance-refund-shell__inner">
        <div className="finance-refund-shell__toolbar">
          <button type="button" className="finance-refund-shell__back" onClick={goBack}>
            ← Back to Finance
          </button>
        </div>
        <h1 className="finance-refund-shell__title">Refund #{id}</h1>
        <p className="finance-refund-shell__lead">
          Full request details and audit trail. Authorize or disburse from here when the refund is in the correct
          status.
        </p>

        {loading ? (
          <div className="finance-refund-loading">Loading refund…</div>
        ) : !refund ? (
          <div className="finance-refund-panel">
            <p className="finance-authorise-text">Refund not found.</p>
            <div className="finance-refund-actions finance-refund-actions--detail">
              <button type="button" className="finance-refund-btn-ghost" onClick={goBack}>
                Back to list
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="finance-refund-shell__grid finance-refund-shell__grid--split">
              <div className="finance-refund-panel">
                <h2 className="finance-refund-panel__title">Request</h2>
                <div className="finance-md-detail-dl">
                  {getRefundUserDisplay(refund) !== '—' ? (
                    <div className="finance-md-detail-row">
                      <dt>Client</dt>
                      <dd>{getRefundUserDisplay(refund)}</dd>
                    </div>
                  ) : null}
                  <div className="finance-md-detail-row">
                    <dt>Amount</dt>
                    <dd>${parseFloat(refund?.amount ?? 0).toFixed(2)}</dd>
                  </div>
                  <div className="finance-md-detail-row">
                    <dt>Payment channel</dt>
                    <dd>{refundChannelLabel(refund?.payment_channel)}</dd>
                  </div>
                  <div className="finance-md-detail-row">
                    <dt>Status</dt>
                    <dd>
                      <span className={refundStatusBadgeClass(refund?.status)}>{String(refund?.status || '—')}</span>
                    </dd>
                  </div>
                  {refund?.customer_email ? (
                    <div className="finance-md-detail-row">
                      <dt>Customer email</dt>
                      <dd>{refund.customer_email}</dd>
                    </div>
                  ) : null}
                  {refund?.rejection_reason ? (
                    <div className="finance-md-detail-row finance-md-detail-row--block">
                      <dt>Rejection reason</dt>
                      <dd>{refund.rejection_reason}</dd>
                    </div>
                  ) : null}
                  <div className="finance-md-detail-row">
                    <dt>Created</dt>
                    <dd>{formatDateTime(refund?.created_at)}</dd>
                  </div>
                  {getRefundPaymentDetails(refund) !== '—' ? (
                    <div className="finance-md-detail-row finance-md-detail-row--block">
                      <dt>Bank / Payment details</dt>
                      <dd>{getRefundPaymentDetails(refund)}</dd>
                    </div>
                  ) : null}
                  {sortedAuditLogs(refund).length > 0 ? (
                    <div className="finance-md-detail-row finance-md-detail-row--block">
                      <dt>Timeline</dt>
                      <dd>
                        <p className="finance-md-modal-helper finance-md-timeline-hint">
                          Requested → Verified → Authorized → Disbursed
                        </p>
                        <div className="finance-md-review-cell finance-md-audit-log-list">
                          {sortedAuditLogs(refund).map((log, idx) => (
                            <div key={log?.id ?? idx} className="finance-md-audit-log-item">
                              <strong className="finance-md-audit-log-transition">
                                {String(log?.from_status || '—')} → {String(log?.to_status || '—')}
                              </strong>
                              <div className="finance-md-review-date">{formatDateTime(log?.timestamp)}</div>
                              {log?.actor_email ? (
                                <div className="finance-md-review-date">By: {log.actor_email}</div>
                              ) : null}
                              {log?.notes ? <div className="finance-md-audit-log-notes">{log.notes}</div> : null}
                            </div>
                          ))}
                        </div>
                      </dd>
                    </div>
                  ) : null}
                </div>
              </div>

              <aside className="finance-refund-panel">
                <h2 className="finance-refund-panel__title">Summary</h2>
                <div className="finance-refund-stat-grid">
                  <div className="finance-refund-stat">
                    <span className="finance-refund-stat__label">Amount</span>
                    <span className="finance-refund-stat__value finance-refund-stat__value--accent">
                      ${parseFloat(refund?.amount ?? 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="finance-refund-stat">
                    <span className="finance-refund-stat__label">Status</span>
                    <span className="finance-refund-stat__value">
                      <span className={refundStatusBadgeClass(refund?.status)}>{String(refund?.status || '—')}</span>
                    </span>
                  </div>
                  <div className="finance-refund-stat">
                    <span className="finance-refund-stat__label">Created</span>
                    <span className="finance-refund-stat__value">{formatDateTime(refund?.created_at)}</span>
                  </div>
                </div>
                <div className="finance-refund-actions finance-refund-actions--detail">
                  {isRefundVerifiedStatus(refund?.status) ? (
                    <Link className="finance-refund-btn-primary" to={authPath}>
                      Authorize refund
                    </Link>
                  ) : null}
                  {isRefundAuthorisedStatus(refund?.status) ? (
                    <Link className="finance-refund-btn-primary" to={disbursePath}>
                      Disburse refund
                    </Link>
                  ) : null}
                  <button type="button" className="finance-refund-btn-ghost" onClick={goBack}>
                    Close
                  </button>
                </div>
              </aside>
            </div>
            {renderBankingSection()}
          </>
        )}
      </div>
    </div>
  )
}
