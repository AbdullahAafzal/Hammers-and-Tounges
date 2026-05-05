import React, { useCallback, useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { adminService } from '../services/interceptors/admin.service'
import { canAuthoriseRefunds } from '../utils/financeAccess'
import { isRefundAuthorisedStatus } from '../utils/twoFaRefundHelpers'
import { formatDateTime, getRefundUserDisplay, refundStatusBadgeClass } from '../utils/financeRefundDisplay'
import './AdminFinance.css'
import './AdminFinanceRefundPages.css'

const FINANCE_TAB_AUTHORISE = 'authorise_refund'

export default function AdminFinanceRefundDisburse() {
  const { refundId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const authUser = useSelector((s) => s.auth?.user)
  const financeBase = location.pathname.startsWith('/manager/') ? '/manager/finance' : '/admin/finance'
  const id = Number.parseInt(String(refundId || ''), 10)
  const [loading, setLoading] = useState(true)
  const [refund, setRefund] = useState(null)
  const [refInput, setRefInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

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

  if (!canAuthoriseRefunds(authUser)) {
    return <Navigate to={financeBase} replace />
  }
  if (!Number.isFinite(id)) {
    return <Navigate to={financeBase} replace />
  }

  const statusOk = refund && isRefundAuthorisedStatus(refund.status)
  const detailPath = `${financeBase}/refunds/${id}`
  const refTrim = String(refInput || '').trim()

  const submit = async () => {
    if (!refTrim) {
      setSubmitError('Transaction reference is required.')
      return
    }
    setSubmitError('')
    setSubmitting(true)
    try {
      await adminService.disburseRefund(id, refTrim)
      toast.success('Refund marked as disbursed.')
      goBack()
    } catch (err) {
      const raw =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.response?.data?.transaction_reference ||
        err?.message ||
        'Disbursement failed'
      setSubmitError(typeof raw === 'string' ? raw : 'Disbursement failed')
    } finally {
      setSubmitting(false)
    }
  }

  const primaryDisabled = submitting || !refTrim || !statusOk

  return (
    <div className="finance-refund-shell">
      <div className="finance-refund-shell__inner">
        <div className="finance-refund-shell__toolbar">
          <button type="button" className="finance-refund-shell__back" onClick={goBack}>
            ← Back to Finance
          </button>
          <Link className="finance-refund-shell__back" to={detailPath}>
            View refund details
          </Link>
        </div>
        <h1 className="finance-refund-shell__title">Disburse refund #{id}</h1>
        <p className="finance-refund-shell__lead">
          Enter the bank or payment transaction reference after you have sent the funds.
        </p>

        {loading ? (
          <div className="finance-refund-loading">Loading refund…</div>
        ) : !refund ? (
          <div className="finance-refund-panel">
            <p className="finance-authorise-text">Refund not found.</p>
            <div className="finance-refund-actions">
              <button type="button" className="finance-refund-btn-ghost" onClick={goBack}>
                Back to list
              </button>
            </div>
          </div>
        ) : !statusOk ? (
          <div className="finance-refund-panel finance-authorise-panel--error">
            <p className="finance-authorise-text">
              This refund is not ready for disbursement (current: {String(refund.status || '—')}). Return to the list
              and refresh.
            </p>
            <div className="finance-refund-actions finance-refund-actions--detail">
              <Link className="finance-refund-btn-primary" to={financeBase} state={{ financeActiveTab: FINANCE_TAB_AUTHORISE }}>
                Back to list
              </Link>
            </div>
          </div>
        ) : (
          <div className="finance-refund-dashboard">
            <div>
              <p className="finance-refund-hero-amount">${parseFloat(refund?.amount ?? 0).toFixed(2)}</p>
              <dl className="finance-refund-kv">
                <div className="finance-refund-kv-row">
                  <dt className="finance-refund-kv-dt">Client</dt>
                  <dd className="finance-refund-kv-dd">{getRefundUserDisplay(refund)}</dd>
                </div>
                <div className="finance-refund-kv-row">
                  <dt className="finance-refund-kv-dt">Status</dt>
                  <dd className="finance-refund-kv-dd">
                    <span className={refundStatusBadgeClass(refund?.status)}>{String(refund?.status || '—')}</span>
                  </dd>
                </div>
                <div className="finance-refund-kv-row">
                  <dt className="finance-refund-kv-dt">Created</dt>
                  <dd className="finance-refund-kv-dd">{formatDateTime(refund?.created_at)}</dd>
                </div>
              </dl>
            </div>

            <div className="finance-refund-side-card">
              <h2 className="finance-refund-side-card__title">Payment reference</h2>
              <label className="finance-refund-label" htmlFor="web-disburse-ref">
                Transaction reference (required)
              </label>
              <input
                id="web-disburse-ref"
                type="text"
                className="finance-refund-ref-input"
                value={refInput}
                onChange={(e) => {
                  setSubmitError('')
                  setRefInput(e.target.value)
                }}
                placeholder="e.g. VISA-ARN-99281"
                disabled={submitting}
                autoCapitalize="characters"
                aria-invalid={!!submitError}
                aria-describedby="web-disburse-hint"
              />
              <p id="web-disburse-hint" className="finance-refund-field-hint">
                Use the reference shown on the payout or card reversal confirmation.
              </p>
              {submitError ? (
                <div className="finance-refund-error-banner" role="alert">
                  {submitError}
                </div>
              ) : null}
              <div className="finance-refund-actions" style={{ borderTop: 'none', marginTop: '1.1rem', paddingTop: 0 }}>
                <button type="button" className="finance-refund-btn-ghost" onClick={goBack} disabled={submitting}>
                  Cancel
                </button>
                <button type="button" className="finance-refund-btn-primary" onClick={submit} disabled={primaryDisabled}>
                  {submitting ? 'Submitting…' : 'Confirm disbursement'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
