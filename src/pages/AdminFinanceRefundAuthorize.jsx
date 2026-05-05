import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { adminService } from '../services/interceptors/admin.service'
import { canAuthoriseRefunds } from '../utils/financeAccess'
import { isRefundVerifiedStatus } from '../utils/twoFaRefundHelpers'
import { formatDateTime, getRefundUserDisplay, refundStatusBadgeClass } from '../utils/financeRefundDisplay'
import './AdminFinance.css'
import './AdminFinanceRefundPages.css'

const FINANCE_TAB_AUTHORISE = 'authorise_refund'

export default function AdminFinanceRefundAuthorize() {
  const { refundId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const authUser = useSelector((s) => s.auth?.user)
  const financeBase = location.pathname.startsWith('/manager/') ? '/manager/finance' : '/admin/finance'
  const id = Number.parseInt(String(refundId || ''), 10)
  const otpInputRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [refund, setRefund] = useState(null)
  const [totp, setTotp] = useState('')
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

  const statusOk = refund && isRefundVerifiedStatus(refund.status)
  const detailPath = `${financeBase}/refunds/${id}`
  const digits = totp.replace(/\D/g, '').slice(0, 6)
  const displayDigits = [...Array(6)].map((_, i) => digits[i] ?? '')

  const submit = async () => {
    const code = String(totp || '').replace(/\D/g, '')
    if (code.length !== 6) {
      setSubmitError('Enter the 6-digit code from your authenticator app.')
      return
    }
    setSubmitError('')
    setSubmitting(true)
    try {
      await adminService.authorizeRefund(id, code)
      toast.success('Refund authorized.')
      goBack()
    } catch (err) {
      const raw =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.response?.data?.totp_token ||
        err?.message ||
        'Authorization failed'
      const msg = typeof raw === 'string' ? raw : 'Authorization failed'
      setSubmitError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const primaryDisabled = submitting || digits.length !== 6

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
        <h1 className="finance-refund-shell__title">Authorize refund #{id}</h1>
        <p className="finance-refund-shell__lead">
          Enter your authenticator code to confirm. Authorizing moves the refund forward and cannot be undone from this
          screen.
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
              This refund is not in VERIFIED status (current: {String(refund.status || '—')}). Return to the list and
              refresh.
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
              <h2 className="finance-refund-side-card__title">Two-factor confirmation</h2>
              <label className="finance-refund-label" htmlFor="web-auth-totp-hidden">
                Authenticator code (6 digits)
              </label>
              <div
                className="finance-refund-otp-wrap"
                role="button"
                tabIndex={0}
                onClick={() => otpInputRef.current?.focus()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    otpInputRef.current?.focus()
                  }
                }}
              >
                <div className="finance-refund-otp-cells" aria-hidden>
                  {displayDigits.map((ch, i) => (
                    <div
                      key={String(i)}
                      className={[
                        'finance-refund-otp-cell',
                        ch ? 'finance-refund-otp-cell--filled' : '',
                        i === digits.length && digits.length < 6 ? 'finance-refund-otp-cell--active' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {ch}
                    </div>
                  ))}
                </div>
                <input
                  ref={otpInputRef}
                  id="web-auth-totp-hidden"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  className="finance-refund-otp-native"
                  value={totp}
                  onChange={(e) => {
                    setSubmitError('')
                    setTotp(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }}
                  disabled={submitting}
                  aria-invalid={!!submitError}
                  aria-describedby="web-auth-totp-hint"
                />
              </div>
              <p id="web-auth-totp-hint" className="finance-refund-field-hint">
                Use the current code from your authenticator app.
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
                  {submitting ? 'Authorizing…' : 'Confirm authorize'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
