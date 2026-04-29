import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { getMediaUrl } from '../config/api.config'
import { adminService } from '../services/interceptors/admin.service'
import { isFinanceAdminFlow, canAuthoriseRefunds } from '../utils/financeAccess'
import {
  isTwoFaEnabledFromStatus,
  extractOtpauthUri,
  extractTwoFaDetailMessage,
  parseManualSecretFromOtpauth,
  filterAuthoriseTabRefunds,
  isRefundVerifiedStatus,
  isRefundAuthorisedStatus,
} from '../utils/twoFaRefundHelpers'
import './AdminFinance.css'

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
]
const TAB_MANUAL_DEPOSITS = 'manual_deposits'
const TAB_REFUND_VERIFICATION = 'refund_verification'
const TAB_AUTHORISE_REFUND = 'authorise_refund'

function normalizeManualDepositsList(data) {
  if (Array.isArray(data)) return data
  if (data?.results && Array.isArray(data.results)) return data.results
  return []
}
function normalizeRefundsList(data) {
  if (Array.isArray(data)) return data
  if (data?.results && Array.isArray(data.results)) return data.results
  if (data?.data && Array.isArray(data.data)) return data.data
  return []
}

function formatDateTime(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return String(iso)
  }
}

function statusBadgeClass(status) {
  const s = String(status || '').toUpperCase()
  if (s === 'APPROVED') {
    return 'finance-action-badge finance-md-status finance-md-status--approved'
  }
  if (s === 'REJECTED') {
    return 'finance-action-badge finance-md-status finance-md-status--rejected'
  }
  return 'finance-action-badge finance-md-status finance-md-status--pending'
}

function refundStatusBadgeClass(status) {
  const s = String(status || '').toUpperCase()
  if (s === 'VERIFIED') {
    return 'finance-action-badge finance-md-status finance-md-status--verified'
  }
  if (s === 'AUTHORISED' || s === 'AUTHORIZED') {
    return 'finance-action-badge finance-md-status finance-md-status--authorised'
  }
  if (s === 'DISBURSED') {
    return 'finance-action-badge finance-md-status finance-md-status--disbursed'
  }
  if (s === 'REJECTED') {
    return 'finance-action-badge finance-md-status finance-md-status--rejected'
  }
  if (s === 'PENDING' || s === 'INITIATED') {
    return 'finance-action-badge finance-md-status finance-md-status--pending'
  }
  return 'finance-action-badge finance-md-status finance-md-status--pending'
}

function getUserDisplayName(user) {
  const full =
    user?.full_name ||
    user?.display_name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim()
  return full || user?.email || `User #${user?.id ?? user?.user_id ?? user?.userId ?? 'N/A'}`
}
function refundChannelLabel(channel) {
  const c = String(channel || '').toUpperCase()
  if (c === 'BANK_TRANSFER') return 'Bank Transfer'
  if (c === 'VISA') return 'Visa / Card Reversal'
  if (c === 'MOBILE_MONEY') return 'Mobile Money'
  return c || '—'
}

function isPendingRefundStatus(status) {
  return /pending|initiated|submitted|processing/i.test(String(status || ''))
}

function getRefundUserDisplay(row) {
  const fullFromUser = [row?.user?.first_name, row?.user?.last_name].filter(Boolean).join(' ').trim()
  const fullFromClient = [row?.client?.first_name, row?.client?.last_name].filter(Boolean).join(' ').trim()
  return (
    row?.client_name ||
    row?.buyer_name ||
    row?.user_name ||
    row?.client?.full_name ||
    row?.client?.display_name ||
    fullFromClient ||
    row?.client?.email ||
    row?.customer_email ||
    row?.user?.full_name ||
    row?.user?.display_name ||
    fullFromUser ||
    row?.user?.email ||
    (row?.client_id != null ? `Client #${row.client_id}` : null) ||
    (row?.user_id != null ? `User #${row.user_id}` : null) ||
    '—'
  )
}

function getRefundPaymentDetails(row) {
  const details =
    row?.bank_details ||
    row?.payment_details ||
    row?.banking_details ||
    row?.bank_account ||
    row?.banking_profile
  const inline = [
    row?.bank_name,
    row?.account_name,
    row?.account_number,
    row?.branch_code,
    row?.swift_code,
    row?.iban,
    row?.mobile_money_number,
    row?.phone_number,
    row?.card_last4 ? `Card •••• ${row.card_last4}` : null,
  ].filter(Boolean)
  if (inline.length > 0) return inline.join(' · ')
  if (!details) return '—'
  if (typeof details === 'string') return details
  if (typeof details === 'object') {
    return [
      details.bank_name,
      details.account_name,
      details.account_number,
      details.branch_code,
      details.swift_code,
      details.iban,
      details.mobile_money_number,
      details.phone_number,
      details.card_last4 ? `Card •••• ${details.card_last4}` : null,
    ]
      .filter(Boolean)
      .join(' · ') || '—'
  }
  if (Array.isArray(row?.audit_logs) && row.audit_logs.length > 0) {
    const latestNote = row.audit_logs
      .map((log) => log?.notes)
      .filter(Boolean)[0]
    if (latestNote) return latestNote
  }
  return '—'
}

function sortedAuditLogs(row) {
  const logs = Array.isArray(row?.audit_logs) ? row.audit_logs : []
  return [...logs].sort((a, b) => {
    const ta = new Date(a?.timestamp || 0).getTime()
    const tb = new Date(b?.timestamp || 0).getTime()
    return tb - ta
  })
}

const AdminFinance = () => {
  const navigate = useNavigate()
  const routeLocation = useLocation()
  const authUser = useSelector((state) => state.auth?.user)
  const isFinanceOfficer = String(authUser?.role || '').toLowerCase() === 'finance'
  const financeBase = routeLocation.pathname.startsWith('/manager/') ? '/manager/finance' : '/admin/finance'
  const isFinanceReadOnly = isFinanceAdminFlow(routeLocation.pathname, authUser)
  const canUseCashDeposit = !routeLocation.pathname.startsWith('/manager/')
  const isAdminFinancePath = routeLocation.pathname.startsWith('/admin/finance')
  const showAuthoriseRefundTab = isAdminFinancePath && canAuthoriseRefunds(authUser)

  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [activeTab, setActiveTab] = useState(TAB_MANUAL_DEPOSITS)
  const [items, setItems] = useState([])
  const [refundItems, setRefundItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState(null)
  const [rejectTarget, setRejectTarget] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [refundRejectTarget, setRefundRejectTarget] = useState(null)
  const [refundRejectReason, setRefundRejectReason] = useState('')
  const [refundDetailTarget, setRefundDetailTarget] = useState(null)
  const [refundDetailLoading, setRefundDetailLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isCashDepositModalOpen, setIsCashDepositModalOpen] = useState(false)
  const [buyers, setBuyers] = useState([])
  const [buyersLoading, setBuyersLoading] = useState(false)
  const [buyerQuery, setBuyerQuery] = useState('')
  const [selectedBuyer, setSelectedBuyer] = useState(null)
  const [cashDepositAmount, setCashDepositAmount] = useState('')
  const [cashDepositSubmitting, setCashDepositSubmitting] = useState(false)

  const [authoriseRefundRows, setAuthoriseRefundRows] = useState([])
  const [authorisePhase, setAuthorisePhase] = useState('idle')
  const [authoriseErrorMessage, setAuthoriseErrorMessage] = useState('')
  const [twoFaOtpauthUri, setTwoFaOtpauthUri] = useState('')
  const [twoFaDetailText, setTwoFaDetailText] = useState('')
  const [twoFaQrDataUrl, setTwoFaQrDataUrl] = useState('')
  const [twoFaSetupSubmitting, setTwoFaSetupSubmitting] = useState(false)
  const [authRefundDetailTarget, setAuthRefundDetailTarget] = useState(null)
  const [authRefundDetailLoading, setAuthRefundDetailLoading] = useState(false)
  const [authTotpRefundId, setAuthTotpRefundId] = useState(null)
  const [authTotpInput, setAuthTotpInput] = useState('')
  const [authTotpSubmitting, setAuthTotpSubmitting] = useState(false)
  const [authDisburseRefundId, setAuthDisburseRefundId] = useState(null)
  const [authDisburseRefInput, setAuthDisburseRefInput] = useState('')
  const [authDisburseSubmitting, setAuthDisburseSubmitting] = useState(false)
  const [authActionRefundId, setAuthActionRefundId] = useState(null)

  const loadManualDeposits = useCallback(async () => {
    setLoading(true)
    try {
      const params = statusFilter ? { status: statusFilter } : {}
      const data = await adminService.getAdminManualDeposits(params)
      setItems(normalizeManualDepositsList(data))
    } catch (err) {
      const raw =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to load bank transfer requests'
      const msg = typeof raw === 'string' ? raw : Array.isArray(raw) ? raw.map((e) => e?.message || e).join(' ') : 'Failed to load bank transfer requests'
      toast.error(msg)
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  const loadRefunds = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminService.getRefundRequests()
      setRefundItems(normalizeRefundsList(data))
    } catch (err) {
      const raw =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to load refund requests'
      const msg = typeof raw === 'string' ? raw : 'Failed to load refund requests'
      toast.error(msg)
      setRefundItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  const loadVerifiedAuthoriseRefunds = useCallback(async () => {
    setAuthorisePhase('list_loading')
    setAuthoriseErrorMessage('')
    try {
      const data = await adminService.getRefundRequests()
      setAuthoriseRefundRows(filterAuthoriseTabRefunds(normalizeRefundsList(data)))
      setAuthorisePhase('list_ready')
    } catch (err) {
      const raw =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to load refund requests'
      const msg = typeof raw === 'string' ? raw : 'Failed to load refund requests'
      if (err?.response?.status === 403 || err?.response?.status === 401) {
        setAuthorisePhase('forbidden')
      } else {
        setAuthoriseErrorMessage(msg)
        setAuthorisePhase('list_error')
      }
      setAuthoriseRefundRows([])
    }
  }, [])

  const runAuthoriseGate = useCallback(async () => {
    setAuthorisePhase('gate_loading')
    setAuthoriseErrorMessage('')
    setTwoFaQrDataUrl('')
    try {
      const st = await adminService.getTwoFaStatus()
      if (isTwoFaEnabledFromStatus(st)) {
        setTwoFaOtpauthUri('')
        setTwoFaDetailText('')
        await loadVerifiedAuthoriseRefunds()
        return
      }
      let otpauthUri = extractOtpauthUri(st)
      let detailText = extractTwoFaDetailMessage(st)

      // Some backends return "disabled" status without setup URI.
      // In that case, request a fresh setup payload so QR can be rendered.
      if (!otpauthUri) {
        try {
          const setupData = await adminService.postTwoFaSetup()
          otpauthUri = extractOtpauthUri(setupData)
          detailText = extractTwoFaDetailMessage(setupData) || detailText
        } catch {
          // Keep fallback message below if setup endpoint fails.
        }
      }

      setTwoFaOtpauthUri(otpauthUri)
      setTwoFaDetailText(detailText)
      setAuthorisePhase('two_fa_setup')
    } catch (err) {
      const status = err?.response?.status
      if (status === 403 || status === 401) {
        setAuthorisePhase('forbidden')
        return
      }
      const raw =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'Could not verify 2FA status'
      setAuthoriseErrorMessage(typeof raw === 'string' ? raw : 'Could not verify 2FA status')
      setAuthorisePhase('gate_error')
    }
  }, [loadVerifiedAuthoriseRefunds])

  useEffect(() => {
    if (activeTab === TAB_REFUND_VERIFICATION) {
      loadRefunds()
    } else if (activeTab === TAB_AUTHORISE_REFUND) {
      // Loaded via runAuthoriseGate when tab is selected
    } else {
      loadManualDeposits()
    }
  }, [activeTab, loadManualDeposits, loadRefunds])

  useEffect(() => {
    if (activeTab === TAB_AUTHORISE_REFUND && !showAuthoriseRefundTab) {
      setActiveTab(TAB_MANUAL_DEPOSITS)
    }
  }, [activeTab, showAuthoriseRefundTab])

  useEffect(() => {
    if (activeTab !== TAB_AUTHORISE_REFUND) {
      setAuthorisePhase('idle')
    }
  }, [activeTab])

  useEffect(() => {
    if (activeTab !== TAB_AUTHORISE_REFUND || !showAuthoriseRefundTab) return undefined
    runAuthoriseGate()
    return undefined
  }, [activeTab, showAuthoriseRefundTab, runAuthoriseGate])

  useEffect(() => {
    if (authorisePhase !== 'two_fa_setup' || !twoFaOtpauthUri) {
      setTwoFaQrDataUrl('')
      return undefined
    }
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(twoFaOtpauthUri)}`
    setTwoFaQrDataUrl(qrUrl)
    return undefined
  }, [authorisePhase, twoFaOtpauthUri])

  const openReject = (row) => {
    setRejectTarget(row)
    setRejectReason('')
  }

  const closeReject = () => {
    setRejectTarget(null)
    setRejectReason('')
  }

  const closeCashDepositModal = useCallback((force = false) => {
    if (cashDepositSubmitting && !force) return
    setIsCashDepositModalOpen(false)
    setBuyerQuery('')
    setSelectedBuyer(null)
    setCashDepositAmount('')
    setBuyers([])
  }, [cashDepositSubmitting])

  const loadBuyersForCashDeposit = useCallback(async () => {
    setBuyersLoading(true)
    try {
      const pageSize = 100
      let page = 1
      let hasNext = true
      const allBuyers = []

      while (hasNext) {
        const data = await adminService.getUsersList({
          role: 'buyer',
          page,
          page_size: pageSize,
        })
        const chunk = Array.isArray(data?.results) ? data.results : []
        allBuyers.push(...chunk)
        hasNext = !!data?.has_next
        page += 1
      }

      const seen = new Set()
      const uniqueBuyers = allBuyers.filter((u) => {
        const id = String(u?.id ?? u?.user_id ?? u?.userId ?? '')
        if (!id || seen.has(id)) return false
        seen.add(id)
        return true
      })
      setBuyers(uniqueBuyers)
    } catch (err) {
      const raw =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load buyers'
      toast.error(typeof raw === 'string' ? raw : 'Failed to load buyers')
      setBuyers([])
    } finally {
      setBuyersLoading(false)
    }
  }, [])

  const openCashDepositModal = async () => {
    if (!canUseCashDeposit) return
    setIsCashDepositModalOpen(true)
    setBuyerQuery('')
    setSelectedBuyer(null)
    setCashDepositAmount('')
    await loadBuyersForCashDeposit()
  }

  const handleApprove = async (row) => {
    if (isFinanceReadOnly) return
    const id = row.id
    if (id == null) return
    setActionId(id)
    try {
      await adminService.reviewAdminManualDeposit(id, { decision: 'APPROVED' })
      toast.success('Deposit approved.')
      await loadManualDeposits()
    } catch (err) {
      const raw =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'Approve failed'
      const msg = typeof raw === 'string' ? raw : 'Approve failed'
      toast.error(msg)
    } finally {
      setActionId(null)
    }
  }

  const submitReject = async () => {
    if (isFinanceReadOnly) return
    if (!rejectTarget?.id) return
    const reason = rejectReason.trim()
    if (!reason) {
      toast.error('Please enter a rejection reason.')
      return
    }
    setActionId(rejectTarget.id)
    try {
      await adminService.reviewAdminManualDeposit(rejectTarget.id, {
        decision: 'REJECTED',
        rejection_reason: reason,
      })
      toast.success('Deposit rejected.')
      closeReject()
      await loadManualDeposits()
    } catch (err) {
      const raw =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'Reject failed'
      const msg = typeof raw === 'string' ? raw : 'Reject failed'
      toast.error(msg)
    } finally {
      setActionId(null)
    }
  }

  const pendingCount = useMemo(
    () => items.filter((r) => String(r.status || '').toUpperCase() === 'PENDING').length,
    [items]
  )
  const showRefundClientColumn = useMemo(
    () => refundItems.some((r) => getRefundUserDisplay(r) !== '—'),
    [refundItems]
  )
  const showRefundPaymentDetailsColumn = useMemo(
    () => refundItems.some((r) => getRefundPaymentDetails(r) !== '—'),
    [refundItems]
  )

  const filteredBuyers = useMemo(() => {
    const q = buyerQuery.trim().toLowerCase()
    if (!q) return buyers
    return buyers.filter((user) => {
      const name = getUserDisplayName(user).toLowerCase()
      const email = String(user?.email || '').toLowerCase()
      return name.includes(q) || email.includes(q)
    })
  }, [buyerQuery, buyers])

  const submitCashDeposit = async () => {
    if (!canUseCashDeposit) return
    const buyerId = selectedBuyer?.id ?? selectedBuyer?.user_id ?? selectedBuyer?.userId
    if (buyerId == null) {
      toast.error('Please select a buyer.')
      return
    }
    const amountNum = Number(cashDepositAmount)
    if (!cashDepositAmount || Number.isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid deposit amount.')
      return
    }

    setCashDepositSubmitting(true)
    try {
      await adminService.addFunds({
        user_id: buyerId,
        amount: amountNum.toFixed(2),
        description: `Offline bank transfer receipt #${Date.now()}`,
      })
      toast.success('Cash deposit added successfully.')
      closeCashDepositModal(true)
      await loadManualDeposits()
    } catch (err) {
      const raw =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to submit cash deposit'
      const msg = typeof raw === 'string' ? raw : 'Failed to submit cash deposit'
      toast.error(msg)
    } finally {
      setCashDepositSubmitting(false)
    }
  }

  useEffect(() => {
    if (!previewUrl && !rejectTarget && !isCashDepositModalOpen) return
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (previewUrl) setPreviewUrl(null)
      else if (isCashDepositModalOpen) closeCashDepositModal()
      else if (rejectTarget) {
        setRejectTarget(null)
        setRejectReason('')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [previewUrl, rejectTarget, isCashDepositModalOpen, closeCashDepositModal])

  const closeRefundReject = () => {
    setRefundRejectTarget(null)
    setRefundRejectReason('')
  }

  const closeRefundDetail = () => {
    setRefundDetailTarget(null)
    setRefundDetailLoading(false)
  }

  const openRefundDetail = async (row) => {
    if (!row) return
    setRefundDetailTarget(row)
    if (row?.id == null) return
    setRefundDetailLoading(true)
    try {
      const full = await adminService.getRefundRequestById(row.id)
      if (full && typeof full === 'object') {
        setRefundDetailTarget(full)
      }
    } catch (err) {
      const raw =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'Could not load full refund details'
      toast.error(typeof raw === 'string' ? raw : 'Could not load full refund details')
    } finally {
      setRefundDetailLoading(false)
    }
  }

  const handleVerifyRefund = async (row) => {
    if (!isFinanceOfficer || !row?.id || actionId != null) return
    setActionId(row.id)
    try {
      await adminService.verifyRefund(row.id)
      toast.success('Refund verified.')
      setRefundRejectTarget(null)
      setRefundRejectReason('')
      setRefundDetailTarget(null)
      await loadRefunds()
    } catch (err) {
      const raw =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'Verify failed'
      toast.error(typeof raw === 'string' ? raw : 'Verify failed')
    } finally {
      setActionId(null)
    }
  }

  const submitRefundReject = async () => {
    if (!isFinanceOfficer || !refundRejectTarget?.id || actionId != null) return
    const reason = refundRejectReason.trim()
    if (!reason) {
      toast.error('Please enter a rejection reason.')
      return
    }
    setActionId(refundRejectTarget.id)
    try {
      await adminService.rejectRefund(refundRejectTarget.id, reason)
      toast.success('Refund rejected.')
      setRefundDetailTarget(null)
      setRefundRejectTarget(null)
      setRefundRejectReason('')
      await loadRefunds()
    } catch (err) {
      const raw =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'Reject failed'
      toast.error(typeof raw === 'string' ? raw : 'Reject failed')
    } finally {
      setActionId(null)
    }
  }

  const refreshAuthoriseTab = useCallback(() => {
    runAuthoriseGate()
  }, [runAuthoriseGate])

  const handleTwoFaSetupComplete = async () => {
    if (twoFaSetupSubmitting) return
    setTwoFaSetupSubmitting(true)
    try {
      await adminService.postTwoFaSetup()
      toast.success('2FA setup saved successfully.')
      await runAuthoriseGate()
    } catch (err) {
      const raw =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.response?.data?.non_field_errors ||
        err?.message ||
        '2FA setup failed'
      toast.error(typeof raw === 'string' ? raw : '2FA setup failed')
    } finally {
      setTwoFaSetupSubmitting(false)
    }
  }

  const closeAuthRefundDetail = () => {
    setAuthRefundDetailTarget(null)
    setAuthRefundDetailLoading(false)
  }

  const openAuthRefundDetail = async (row) => {
    if (!row) return
    setAuthRefundDetailTarget(row)
    if (row?.id == null) return
    setAuthRefundDetailLoading(true)
    try {
      const full = await adminService.getRefundRequestById(row.id)
      if (full && typeof full === 'object') {
        setAuthRefundDetailTarget(full)
      }
    } catch (err) {
      const raw =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'Could not load full refund details'
      toast.error(typeof raw === 'string' ? raw : 'Could not load full refund details')
    } finally {
      setAuthRefundDetailLoading(false)
    }
  }

  const submitAuthTotp = async () => {
    if (authTotpRefundId == null || authTotpSubmitting) return
    const code = String(authTotpInput || '').replace(/\D/g, '')
    if (code.length !== 6) {
      toast.error('Enter the 6-digit code from your authenticator app.')
      return
    }
    setAuthTotpSubmitting(true)
    setAuthActionRefundId(authTotpRefundId)
    try {
      await adminService.authorizeRefund(authTotpRefundId, code)
      toast.success('Refund authorised.')
      setAuthTotpRefundId(null)
      setAuthTotpInput('')
      closeAuthRefundDetail()
      await loadVerifiedAuthoriseRefunds()
    } catch (err) {
      const raw =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.response?.data?.totp_token ||
        err?.message ||
        'Authorisation failed'
      toast.error(typeof raw === 'string' ? raw : 'Authorisation failed')
    } finally {
      setAuthTotpSubmitting(false)
      setAuthActionRefundId(null)
    }
  }

  const submitAuthDisburse = async () => {
    if (authDisburseRefundId == null || authDisburseSubmitting) return
    const refText = String(authDisburseRefInput || '').trim()
    if (!refText) {
      toast.error('Transaction reference is required.')
      return
    }
    setAuthDisburseSubmitting(true)
    setAuthActionRefundId(authDisburseRefundId)
    try {
      await adminService.disburseRefund(authDisburseRefundId, refText)
      toast.success('Refund marked as disbursed.')
      setAuthDisburseRefundId(null)
      setAuthDisburseRefInput('')
      closeAuthRefundDetail()
      await loadVerifiedAuthoriseRefunds()
    } catch (err) {
      const raw =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.response?.data?.transaction_reference ||
        err?.message ||
        'Disbursement failed'
      toast.error(typeof raw === 'string' ? raw : 'Disbursement failed')
    } finally {
      setAuthDisburseSubmitting(false)
      setAuthActionRefundId(null)
    }
  }

  const showAuthClientColumn = useMemo(
    () => authoriseRefundRows.some((r) => getRefundUserDisplay(r) !== '—'),
    [authoriseRefundRows]
  )
  const showAuthPaymentColumn = useMemo(
    () => authoriseRefundRows.some((r) => getRefundPaymentDetails(r) !== '—'),
    [authoriseRefundRows]
  )

  return (
    <div className="finance-dashboard">
      <main className="finance-main">
        <div className="finance-container">
          <header className="finance-header">
            <div className="finance-header-content">
              <h1 className="finance-title">Finance</h1>
              <p className="finance-subtitle">
                Review buyer bank transfer requests. Approve or reject pending proofs of payment.
              </p>
            </div>
            <div className="finance-header-actions">
              <button
                type="button"
                className="finance-primary-btn finance-primary-btn--compact finance-primary-btn--cash-deposit"
                onClick={openCashDepositModal}
                disabled={cashDepositSubmitting || !canUseCashDeposit}
              >
                Cash Deposit
              </button>
              <button
                type="button"
                className="finance-primary-btn finance-primary-btn--compact"
                onClick={() => {
                  if (activeTab === TAB_REFUND_VERIFICATION) loadRefunds()
                  else if (activeTab === TAB_AUTHORISE_REFUND) refreshAuthoriseTab()
                  else loadManualDeposits()
                }}
                disabled={
                  loading ||
                  (activeTab === TAB_AUTHORISE_REFUND &&
                    (authorisePhase === 'gate_loading' ||
                      authorisePhase === 'list_loading' ||
                      twoFaSetupSubmitting ||
                      authTotpSubmitting ||
                      authDisburseSubmitting))
                }
              >
                Refresh
              </button>
            </div>
          </header>

          <section className="finance-filters-section-1">
            <div className="finance-filters-container">
              <div className="finance-filter-controls finance-filter-controls--single">
                <div className="finance-filter-group">
                  <label className="finance-filter-label">Section</label>
                  <div className="finance-md-actions" style={{ flexDirection: 'row' }}>
                    <button
                      type="button"
                      className={`finance-md-btn ${activeTab === TAB_MANUAL_DEPOSITS ? 'finance-md-btn--approve' : 'finance-md-btn--ghost'}`}
                      onClick={() => setActiveTab(TAB_MANUAL_DEPOSITS)}
                    >
                      Bank Transfer
                    </button>
                    {isFinanceOfficer ? (
                      <button
                        type="button"
                        className={`finance-md-btn ${activeTab === TAB_REFUND_VERIFICATION ? 'finance-md-btn--approve' : 'finance-md-btn--ghost'}`}
                        onClick={() => setActiveTab(TAB_REFUND_VERIFICATION)}
                      >
                        Refund Verification
                      </button>
                    ) : null}
                    {showAuthoriseRefundTab ? (
                      <button
                        type="button"
                        className={`finance-md-btn ${activeTab === TAB_AUTHORISE_REFUND ? 'finance-md-btn--approve' : 'finance-md-btn--ghost'}`}
                        onClick={() => setActiveTab(TAB_AUTHORISE_REFUND)}
                      >
                        Authorise Refund
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {activeTab === TAB_MANUAL_DEPOSITS ? (
          <section className="finance-filters-section-1">
            <div className="finance-filters-container">
              <div className="finance-filter-controls finance-filter-controls--single">
                <div className="finance-filter-group">
                  <label className="finance-filter-label" htmlFor="finance-md-status">
                    Status
                  </label>
                  <div className="finance-filter-select-wrapper">
                    <select
                      id="finance-md-status"
                      className="finance-filter-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      {STATUS_OPTIONS.map((o) => (
                        <option key={o.value || 'all'} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </section>
          ) : null}

          <section className="finance-logs-section" aria-live="polite">
            {activeTab === TAB_AUTHORISE_REFUND ? (
              <>
                <div className="finance-section-header">
                  <h2 className="finance-section-title">Authorise refund</h2>
                  <span className="finance-results-info">
                    {authorisePhase === 'list_ready'
                      ? `${authoriseRefundRows.length} refund${authoriseRefundRows.length !== 1 ? 's' : ''} (verified or awaiting disbursement)`
                      : authorisePhase === 'gate_loading' || authorisePhase === 'list_loading'
                        ? 'Loading…'
                        : 'Senior admin · 2FA required to authorise'}
                  </span>
                </div>

                {authorisePhase === 'forbidden' ? (
                  <div className="finance-authorise-panel finance-authorise-panel--error">
                    <h3 className="finance-authorise-title">Unavailable</h3>
                    <p className="finance-authorise-text">You do not have permission to use this area.</p>
                  </div>
                ) : null}

                {authorisePhase === 'gate_loading' ? (
                  <div className="finance-empty-state">
                    <p>Checking two-factor authentication…</p>
                  </div>
                ) : null}

                {authorisePhase === 'gate_error' ? (
                  <div className="finance-authorise-panel finance-authorise-panel--error">
                    <p className="finance-authorise-text">{authoriseErrorMessage}</p>
                    <button
                      type="button"
                      className="finance-md-btn finance-md-btn--approve"
                      onClick={() => runAuthoriseGate()}
                    >
                      Retry
                    </button>
                  </div>
                ) : null}

                {authorisePhase === 'two_fa_setup' ? (
                  <div className="finance-authorise-panel finance-authorise-panel--2fa">
                    <p className="finance-authorise-lead">
                      Scan this QR code using Google Authenticator or Authy.
                    </p>
                    {twoFaDetailText ? <p className="finance-authorise-hint">{twoFaDetailText}</p> : null}
                    <div className="finance-2fa-qr-wrap">
                      {twoFaQrDataUrl ? (
                        <img src={twoFaQrDataUrl} alt="Authenticator setup QR code" className="finance-2fa-qr" />
                      ) : (
                        <p className="finance-authorise-text">
                          QR setup URI was not returned by the server. Click Retry to request a new setup code.
                        </p>
                      )}
                    </div>
                    {parseManualSecretFromOtpauth(twoFaOtpauthUri) ? (
                      <div className="finance-2fa-secret-block">
                        <span className="finance-md-label">Manual setup key</span>
                        <code className="finance-2fa-secret">{parseManualSecretFromOtpauth(twoFaOtpauthUri)}</code>
                      </div>
                    ) : null}
                    <button
                      type="button"
                      className="finance-md-btn finance-md-btn--approve finance-authorise-2fa-btn"
                      onClick={handleTwoFaSetupComplete}
                      disabled={twoFaSetupSubmitting}
                    >
                      {twoFaSetupSubmitting ? 'Saving…' : 'I have set up 2FA'}
                    </button>
                  </div>
                ) : null}

                {authorisePhase === 'list_error' ? (
                  <div className="finance-authorise-panel finance-authorise-panel--error">
                    <p className="finance-authorise-text">{authoriseErrorMessage}</p>
                    <button
                      type="button"
                      className="finance-md-btn finance-md-btn--approve"
                      onClick={() => loadVerifiedAuthoriseRefunds()}
                    >
                      Retry
                    </button>
                  </div>
                ) : null}

                {(authorisePhase === 'list_loading' || authorisePhase === 'list_ready') &&
                authorisePhase !== 'gate_loading' ? (
                  <>
                    {authorisePhase === 'list_ready' && authoriseRefundRows.length === 0 ? (
                      <div className="finance-empty-state">
                        <h3>No verified refund requests available</h3>
                        <p>When finance verifies a refund, it appears here for authorisation and disbursement.</p>
                      </div>
                    ) : null}

                    {authoriseRefundRows.length > 0 || authorisePhase === 'list_loading' ? (
                      <div
                        className="finance-table-container finance-md-table-scroll"
                        role="region"
                        aria-label="Verified refunds for authorisation"
                        tabIndex={0}
                      >
                        <div className="finance-table-wrapper">
                          <table className="finance-table finance-md-table">
                            <thead>
                              <tr>
                                <th>Refund ID</th>
                                {showAuthClientColumn ? <th>Client</th> : null}
                                <th>Amount</th>
                                <th>Channel</th>
                                <th>Status</th>
                                <th>Created</th>
                                {showAuthPaymentColumn ? <th>Bank / Payment details</th> : null}
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {authorisePhase === 'list_loading' ? (
                                <tr>
                                  <td
                                    colSpan={
                                      6 + (showAuthClientColumn ? 1 : 0) + (showAuthPaymentColumn ? 1 : 0)
                                    }
                                    className="finance-md-loading-cell"
                                  >
                                    Loading…
                                  </td>
                                </tr>
                              ) : (
                                authoriseRefundRows.map((row) => {
                                  const busy = authActionRefundId === row?.id
                                  const st = String(row?.status || '')
                                  const canAuth = isRefundVerifiedStatus(st)
                                  const canDisburse = isRefundAuthorisedStatus(st)
                                  return (
                                    <tr
                                      key={String(row?.id ?? '')}
                                      className="finance-table-row finance-md-row-clickable"
                                      onClick={() => openAuthRefundDetail(row)}
                                    >
                                      <td>#{row?.id ?? '—'}</td>
                                      {showAuthClientColumn ? <td>{getRefundUserDisplay(row)}</td> : null}
                                      <td>${parseFloat(row?.amount ?? 0).toFixed(2)}</td>
                                      <td>{refundChannelLabel(row?.payment_channel)}</td>
                                      <td>
                                        <span className={refundStatusBadgeClass(row?.status)}>
                                          {String(row?.status || '—')}
                                        </span>
                                      </td>
                                      <td>
                                        <span className="finance-date-text">{formatDateTime(row?.created_at)}</span>
                                      </td>
                                      {showAuthPaymentColumn ? (
                                        <td>
                                          <span className="finance-details-text" title={getRefundPaymentDetails(row)}>
                                            {getRefundPaymentDetails(row)}
                                          </span>
                                        </td>
                                      ) : null}
                                      <td onClick={(e) => e.stopPropagation()}>
                                        <div className="finance-md-actions">
                                          <button
                                            type="button"
                                            className="finance-md-btn finance-md-btn--ghost"
                                            onClick={() => openAuthRefundDetail(row)}
                                            disabled={busy}
                                          >
                                            Details
                                          </button>
                                          {canAuth ? (
                                            <button
                                              type="button"
                                              className="finance-md-btn finance-md-btn--approve"
                                              onClick={() => {
                                                setAuthTotpInput('')
                                                setAuthTotpRefundId(row.id)
                                              }}
                                              disabled={busy || authTotpSubmitting || authDisburseSubmitting}
                                            >
                                              Authorise
                                            </button>
                                          ) : null}
                                          {canDisburse ? (
                                            <button
                                              type="button"
                                              className="finance-md-btn finance-md-btn--approve"
                                              onClick={() => {
                                                setAuthDisburseRefInput('')
                                                setAuthDisburseRefundId(row.id)
                                              }}
                                              disabled={busy || authTotpSubmitting || authDisburseSubmitting}
                                            >
                                              Disburse
                                            </button>
                                          ) : null}
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                })
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : null}
                  </>
                ) : null}
              </>
            ) : (
              <>
            <div className="finance-section-header">
              <h2 className="finance-section-title">{activeTab === TAB_REFUND_VERIFICATION ? 'Refund verification' : 'Bank transfer'}</h2>
              <span className="finance-results-info">
                {loading
                  ? 'Loading…'
                  : activeTab === TAB_REFUND_VERIFICATION
                    ? `${refundItems.length} request${refundItems.length !== 1 ? 's' : ''}`
                    : `${items.length} request${items.length !== 1 ? 's' : ''}`}
                {activeTab === TAB_MANUAL_DEPOSITS && statusFilter === 'PENDING' && !loading && pendingCount > 0 ? ` · ${pendingCount} pending` : ''}
                {!loading && activeTab === TAB_MANUAL_DEPOSITS && items.length > 0 ? ' · Tap a row to open details' : ''}
              </span>
            </div>

            {!loading && activeTab === TAB_MANUAL_DEPOSITS && items.length === 0 ? (
              <div className="finance-empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h3>No bank transfer requests</h3>
                <p>Nothing matches this filter.</p>
              </div>
            ) : null}

            {!loading && activeTab === TAB_REFUND_VERIFICATION && refundItems.length === 0 ? (
              <div className="finance-empty-state">
                <h3>No refund requests</h3>
                <p>There are no refunds to review.</p>
              </div>
            ) : null}

            {activeTab === TAB_MANUAL_DEPOSITS ? (
              <div
                className="finance-table-container finance-md-table-scroll"
                role="region"
                aria-label="Bank transfer table"
                tabIndex={0}
              >
                <div className="finance-table-wrapper">
                  <table className="finance-table finance-md-table">
                    <thead>
                      <tr>
                        <th>Proof</th>
                        <th>User</th>
                        <th>Email</th>
                        <th>Amount</th>
                        <th>Reference</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Review</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={9} className="finance-md-loading-cell">
                            Loading…
                          </td>
                        </tr>
                      ) : (
                        items.map((row) => {
                          const proofUrl = getMediaUrl(row.proof_of_payment)
                          const isPending = String(row.status || '').toUpperCase() === 'PENDING'
                          const busy = actionId === row.id
                          return (
                            <tr
                              key={row.id}
                              className="finance-table-row finance-md-row-clickable"
                              onClick={() =>
                                navigate(`${financeBase}/manual-deposits/${row.id}`, {
                                  state: { deposit: row },
                                })
                              }
                            >
                              <td>
                                {proofUrl ? (
                                  <button
                                    type="button"
                                    className="finance-md-proof-btn"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setPreviewUrl(proofUrl)
                                    }}
                                    title="View proof full size"
                                  >
                                    <img src={proofUrl} alt="" className="finance-md-proof-thumb" />
                                  </button>
                                ) : (
                                  <span className="finance-md-no-proof">—</span>
                                )}
                              </td>
                              <td>{row.user_name || '—'}</td>
                              <td>
                                <span className="finance-details-text" title={row.user_email}>
                                  {row.user_email || '—'}
                                </span>
                              </td>
                              <td>${parseFloat(row.amount ?? 0).toFixed(2)}</td>
                              <td>{row.reference_number || '—'}</td>
                              <td>
                                <span className={statusBadgeClass(row.status)}>{row.status || '—'}</span>
                              </td>
                              <td>
                                <span className="finance-date-text">{formatDateTime(row.created_at)}</span>
                              </td>
                              <td>
                                <div className="finance-md-review-cell">
                                  <span className="finance-date-text">{row.reviewed_by_name || '—'}</span>
                                  {row.reviewed_at ? (
                                    <span className="finance-md-review-date">{formatDateTime(row.reviewed_at)}</span>
                                  ) : null}
                                  {row.rejection_reason ? (
                                    <span className="finance-md-reject-reason" title={row.rejection_reason}>
                                      {row.rejection_reason}
                                    </span>
                                  ) : null}
                                </div>
                              </td>
                              <td onClick={(e) => e.stopPropagation()}>
                                {isPending && !isFinanceReadOnly ? (
                                  <div className="finance-md-actions">
                                    <button
                                      type="button"
                                      className="finance-md-btn finance-md-btn--approve"
                                      onClick={() => handleApprove(row)}
                                      disabled={busy}
                                    >
                                      {busy ? '…' : 'Approve'}
                                    </button>
                                    <button
                                      type="button"
                                      className="finance-md-btn finance-md-btn--reject"
                                      onClick={() => openReject(row)}
                                      disabled={busy}
                                    >
                                      Reject
                                    </button>
                                  </div>
                                ) : (
                                  <span className="finance-md-actions-done">—</span>
                                )}
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            {activeTab === TAB_REFUND_VERIFICATION ? (
              <div className="finance-table-container finance-md-table-scroll" role="region" aria-label="Refund table" tabIndex={0}>
                <div className="finance-table-wrapper">
                  <table className="finance-table finance-md-table">
                    <thead>
                      <tr>
                        <th>Refund ID</th>
                        {showRefundClientColumn ? <th>Client</th> : null}
                        <th>Amount</th>
                        <th>Channel</th>
                        <th>Status</th>
                        <th>Created</th>
                        {showRefundPaymentDetailsColumn ? <th>Bank / Payment details</th> : null}
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan={6 + (showRefundClientColumn ? 1 : 0) + (showRefundPaymentDetailsColumn ? 1 : 0)}
                            className="finance-md-loading-cell"
                          >
                            Loading…
                          </td>
                        </tr>
                      ) : (
                        refundItems.map((row) => {
                          const pending = isPendingRefundStatus(row?.status)
                          return (
                            <tr
                              key={row?.id ?? Math.random()}
                              className="finance-table-row finance-md-row-clickable"
                              onClick={() => openRefundDetail(row)}
                            >
                              <td>#{row?.id ?? '—'}</td>
                              {showRefundClientColumn ? <td>{getRefundUserDisplay(row)}</td> : null}
                              <td>${parseFloat(row?.amount ?? 0).toFixed(2)}</td>
                              <td>{refundChannelLabel(row?.payment_channel)}</td>
                              <td><span className={statusBadgeClass(row?.status)}>{String(row?.status || '—')}</span></td>
                              <td><span className="finance-date-text">{formatDateTime(row?.created_at)}</span></td>
                              {showRefundPaymentDetailsColumn ? (
                                <td>
                                  <span className="finance-details-text" title={getRefundPaymentDetails(row)}>
                                    {getRefundPaymentDetails(row)}
                                  </span>
                                </td>
                              ) : null}
                              <td><span className="finance-md-actions-done">{pending ? 'Open details' : '—'}</span></td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
              </>
            )}
          </section>
        </div>
      </main>

      {previewUrl ? (
        <div
          className="finance-md-modal-overlay"
          role="presentation"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="finance-md-modal finance-md-modal--image"
            role="dialog"
            aria-modal="true"
            aria-label="Proof preview"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="finance-md-modal-close"
              onClick={() => setPreviewUrl(null)}
              aria-label="Close"
            >
              ×
            </button>
            <img src={previewUrl} alt="Proof of payment" className="finance-md-modal-img" />
          </div>
        </div>
      ) : null}

      {rejectTarget ? (
        <div className="finance-md-modal-overlay" role="presentation" onClick={closeReject}>
          <div
            className="finance-md-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="finance-md-reject-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="finance-md-reject-title" className="finance-md-modal-title">
              Reject deposit
            </h2>
            <p className="finance-md-modal-desc">
              {rejectTarget.user_name} · ${parseFloat(rejectTarget.amount ?? 0).toFixed(2)}
            </p>
            <label className="finance-md-label" htmlFor="finance-md-reject-reason">
              Rejection reason (required)
            </label>
            <textarea
              id="finance-md-reject-reason"
              className="finance-md-textarea"
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Explain why this deposit is rejected…"
            />
            <div className="finance-md-modal-footer">
              <button type="button" className="finance-md-btn finance-md-btn--ghost" onClick={closeReject}>
                Cancel
              </button>
              <button
                type="button"
                className="finance-md-btn finance-md-btn--reject"
                onClick={submitReject}
                disabled={actionId === rejectTarget.id}
              >
                {actionId === rejectTarget.id ? 'Submitting…' : 'Submit rejection'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {refundRejectTarget ? (
        <div className="finance-md-modal-overlay" role="presentation" onClick={closeRefundReject}>
          <div className="finance-md-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h2 className="finance-md-modal-title">Reject refund #{refundRejectTarget?.id}</h2>
            <p className="finance-md-modal-desc">Provide a rejection reason (required).</p>
            <label className="finance-md-label" htmlFor="finance-refund-reason">
              Rejection reason
            </label>
            <textarea
              id="finance-refund-reason"
              className="finance-md-textarea"
              rows={4}
              value={refundRejectReason}
              onChange={(e) => setRefundRejectReason(e.target.value)}
              placeholder="Funds from recent deposit have not yet cleared."
            />
            <div className="finance-md-modal-footer">
              <button type="button" className="finance-md-btn finance-md-btn--ghost" onClick={closeRefundReject}>
                Cancel
              </button>
              <button
                type="button"
                className="finance-md-btn finance-md-btn--reject"
                onClick={submitRefundReject}
                disabled={actionId === refundRejectTarget?.id}
              >
                {actionId === refundRejectTarget?.id ? 'Submitting…' : 'Submit rejection'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {refundDetailTarget ? (
        <div className="finance-md-modal-overlay" role="presentation" onClick={closeRefundDetail}>
          <div className="finance-md-modal finance-md-modal--refund-detail" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h2 className="finance-md-modal-title">Refund details #{refundDetailTarget?.id ?? '—'}</h2>
            {refundDetailLoading ? (
              <p className="finance-md-detail-loading">Loading full refund details...</p>
            ) : (
              <div className="finance-md-detail-dl">
                {getRefundUserDisplay(refundDetailTarget) !== '—' ? (
                  <div className="finance-md-detail-row">
                    <dt>Client</dt>
                    <dd>{getRefundUserDisplay(refundDetailTarget)}</dd>
                  </div>
                ) : null}
                <div className="finance-md-detail-row">
                  <dt>Amount</dt>
                  <dd>${parseFloat(refundDetailTarget?.amount ?? 0).toFixed(2)}</dd>
                </div>
                <div className="finance-md-detail-row">
                  <dt>Payment channel</dt>
                  <dd>{refundChannelLabel(refundDetailTarget?.payment_channel)}</dd>
                </div>
                <div className="finance-md-detail-row">
                  <dt>Status</dt>
                  <dd>{String(refundDetailTarget?.status || '—')}</dd>
                </div>
                {refundDetailTarget?.customer_email ? (
                  <div className="finance-md-detail-row">
                    <dt>Customer email</dt>
                    <dd>{refundDetailTarget.customer_email}</dd>
                  </div>
                ) : null}
                {refundDetailTarget?.rejection_reason ? (
                  <div className="finance-md-detail-row finance-md-detail-row--block">
                    <dt>Rejection reason</dt>
                    <dd>{refundDetailTarget.rejection_reason}</dd>
                  </div>
                ) : null}
                <div className="finance-md-detail-row">
                  <dt>Created</dt>
                  <dd>{formatDateTime(refundDetailTarget?.created_at)}</dd>
                </div>
                {getRefundPaymentDetails(refundDetailTarget) !== '—' ? (
                  <div className="finance-md-detail-row finance-md-detail-row--block">
                    <dt>Bank / Payment details</dt>
                    <dd>{getRefundPaymentDetails(refundDetailTarget)}</dd>
                  </div>
                ) : null}
                {sortedAuditLogs(refundDetailTarget).length > 0 ? (
                  <div className="finance-md-detail-row finance-md-detail-row--block">
                    <dt>Audit logs</dt>
                    <dd>
                      <div className="finance-md-review-cell finance-md-audit-log-list">
                        {sortedAuditLogs(refundDetailTarget).map((log, idx) => (
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
            )}
            <div className="finance-md-modal-footer">
              {isPendingRefundStatus(refundDetailTarget?.status) && isFinanceOfficer ? (
                <>
                  <button
                    type="button"
                    className="finance-md-btn finance-md-btn--approve"
                    onClick={() => handleVerifyRefund(refundDetailTarget)}
                    disabled={actionId != null}
                  >
                    {actionId != null ? '…' : 'Verify'}
                  </button>
                  <button
                    type="button"
                    className="finance-md-btn finance-md-btn--reject"
                    onClick={() => {
                      setRefundDetailTarget(null)
                      setRefundDetailLoading(false)
                      setRefundRejectTarget(refundDetailTarget)
                      setRefundRejectReason('')
                    }}
                    disabled={actionId != null}
                  >
                    Reject
                  </button>
                </>
              ) : null}
              <button type="button" className="finance-md-btn finance-md-btn--ghost" onClick={closeRefundDetail}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {authTotpRefundId != null ? (
        <div
          className="finance-md-modal-overlay"
          role="presentation"
          onClick={() => {
            if (!authTotpSubmitting) {
              setAuthTotpRefundId(null)
              setAuthTotpInput('')
            }
          }}
        >
          <div className="finance-md-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h2 className="finance-md-modal-title">Authorise refund #{authTotpRefundId}</h2>
            <p className="finance-md-modal-desc">
              For security, enter your 2FA code before authorising this refund.
            </p>
            <label className="finance-md-label" htmlFor="finance-auth-totp">
              Authenticator code (6 digits)
            </label>
            <input
              id="finance-auth-totp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              className="finance-md-input"
              value={authTotpInput}
              onChange={(e) => setAuthTotpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              disabled={authTotpSubmitting}
            />
            <p className="finance-md-modal-helper">This action cannot be undone. Use the current code from your app.</p>
            <div className="finance-md-modal-footer">
              <button
                type="button"
                className="finance-md-btn finance-md-btn--ghost"
                onClick={() => {
                  if (authTotpSubmitting) return
                  setAuthTotpRefundId(null)
                  setAuthTotpInput('')
                }}
                disabled={authTotpSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="finance-md-btn finance-md-btn--approve"
                onClick={submitAuthTotp}
                disabled={authTotpSubmitting || String(authTotpInput || '').replace(/\D/g, '').length !== 6}
              >
                {authTotpSubmitting ? 'Submitting…' : 'Confirm authorise'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {authDisburseRefundId != null ? (
        <div
          className="finance-md-modal-overlay"
          role="presentation"
          onClick={() => {
            if (!authDisburseSubmitting) {
              setAuthDisburseRefundId(null)
              setAuthDisburseRefInput('')
            }
          }}
        >
          <div className="finance-md-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h2 className="finance-md-modal-title">Disburse refund #{authDisburseRefundId}</h2>
            <p className="finance-md-modal-desc">
              Enter the bank or payment transaction reference after you have sent the funds.
            </p>
            <label className="finance-md-label" htmlFor="finance-auth-disburse-ref">
              Transaction reference (required)
            </label>
            <input
              id="finance-auth-disburse-ref"
              type="text"
              className="finance-md-input"
              value={authDisburseRefInput}
              onChange={(e) => setAuthDisburseRefInput(e.target.value)}
              placeholder="e.g. VISA-ARN-99281"
              disabled={authDisburseSubmitting}
            />
            <div className="finance-md-modal-footer">
              <button
                type="button"
                className="finance-md-btn finance-md-btn--ghost"
                onClick={() => {
                  if (authDisburseSubmitting) return
                  setAuthDisburseRefundId(null)
                  setAuthDisburseRefInput('')
                }}
                disabled={authDisburseSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="finance-md-btn finance-md-btn--approve"
                onClick={submitAuthDisburse}
                disabled={authDisburseSubmitting || !String(authDisburseRefInput || '').trim()}
              >
                {authDisburseSubmitting ? 'Submitting…' : 'Confirm disbursement'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {authRefundDetailTarget ? (
        <div className="finance-md-modal-overlay" role="presentation" onClick={closeAuthRefundDetail}>
          <div
            className="finance-md-modal finance-md-modal--refund-detail"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="finance-md-modal-title">Refund details #{authRefundDetailTarget?.id ?? '—'}</h2>
            {authRefundDetailLoading ? (
              <p className="finance-md-detail-loading">Loading full refund details...</p>
            ) : (
              <div className="finance-md-detail-dl">
                {getRefundUserDisplay(authRefundDetailTarget) !== '—' ? (
                  <div className="finance-md-detail-row">
                    <dt>Client</dt>
                    <dd>{getRefundUserDisplay(authRefundDetailTarget)}</dd>
                  </div>
                ) : null}
                <div className="finance-md-detail-row">
                  <dt>Amount</dt>
                  <dd>${parseFloat(authRefundDetailTarget?.amount ?? 0).toFixed(2)}</dd>
                </div>
                <div className="finance-md-detail-row">
                  <dt>Payment channel</dt>
                  <dd>{refundChannelLabel(authRefundDetailTarget?.payment_channel)}</dd>
                </div>
                <div className="finance-md-detail-row">
                  <dt>Status</dt>
                  <dd>
                    <span className={refundStatusBadgeClass(authRefundDetailTarget?.status)}>
                      {String(authRefundDetailTarget?.status || '—')}
                    </span>
                  </dd>
                </div>
                {authRefundDetailTarget?.customer_email ? (
                  <div className="finance-md-detail-row">
                    <dt>Customer email</dt>
                    <dd>{authRefundDetailTarget.customer_email}</dd>
                  </div>
                ) : null}
                {authRefundDetailTarget?.rejection_reason ? (
                  <div className="finance-md-detail-row finance-md-detail-row--block">
                    <dt>Rejection reason</dt>
                    <dd>{authRefundDetailTarget.rejection_reason}</dd>
                  </div>
                ) : null}
                <div className="finance-md-detail-row">
                  <dt>Created</dt>
                  <dd>{formatDateTime(authRefundDetailTarget?.created_at)}</dd>
                </div>
                {getRefundPaymentDetails(authRefundDetailTarget) !== '—' ? (
                  <div className="finance-md-detail-row finance-md-detail-row--block">
                    <dt>Bank / Payment details</dt>
                    <dd>{getRefundPaymentDetails(authRefundDetailTarget)}</dd>
                  </div>
                ) : null}
                {sortedAuditLogs(authRefundDetailTarget).length > 0 ? (
                  <div className="finance-md-detail-row finance-md-detail-row--block">
                    <dt>Timeline</dt>
                    <dd>
                      <p className="finance-md-modal-helper finance-md-timeline-hint">
                        Requested → Verified → Authorised → Disbursed
                      </p>
                      <div className="finance-md-review-cell finance-md-audit-log-list">
                        {sortedAuditLogs(authRefundDetailTarget).map((log, idx) => (
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
            )}
            <div className="finance-md-modal-footer">
              {isRefundVerifiedStatus(authRefundDetailTarget?.status) ? (
                <button
                  type="button"
                  className="finance-md-btn finance-md-btn--approve"
                  onClick={() => {
                    const id = authRefundDetailTarget?.id
                    if (id == null || authActionRefundId != null) return
                    setAuthTotpInput('')
                    setAuthTotpRefundId(id)
                  }}
                  disabled={
                    authRefundDetailLoading ||
                    authTotpSubmitting ||
                    authDisburseSubmitting ||
                    authActionRefundId != null
                  }
                >
                  Authorise refund
                </button>
              ) : null}
              {isRefundAuthorisedStatus(authRefundDetailTarget?.status) ? (
                <button
                  type="button"
                  className="finance-md-btn finance-md-btn--approve"
                  onClick={() => {
                    const id = authRefundDetailTarget?.id
                    if (id == null || authActionRefundId != null) return
                    setAuthDisburseRefInput('')
                    setAuthDisburseRefundId(id)
                  }}
                  disabled={
                    authRefundDetailLoading ||
                    authTotpSubmitting ||
                    authDisburseSubmitting ||
                    authActionRefundId != null
                  }
                >
                  Disburse refund
                </button>
              ) : null}
              <button type="button" className="finance-md-btn finance-md-btn--ghost" onClick={closeAuthRefundDetail}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isCashDepositModalOpen ? (
        <div className="finance-md-modal-overlay" role="presentation" onClick={closeCashDepositModal}>
          <div
            className="finance-md-modal finance-md-modal--cash-deposit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="finance-cash-deposit-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="finance-md-modal-close"
              onClick={closeCashDepositModal}
              aria-label="Close"
              disabled={cashDepositSubmitting}
            >
              ×
            </button>
            <h2 id="finance-cash-deposit-title" className="finance-md-modal-title">
              Cash Deposit
            </h2>
            <p className="finance-md-modal-desc">Select a buyer and submit a deposit amount.</p>

            <label className="finance-md-label" htmlFor="finance-cash-buyer-search">
              Buyer name
            </label>
            <input
              id="finance-cash-buyer-search"
              type="text"
              className="finance-md-input"
              placeholder="Type buyer name or email"
              value={buyerQuery}
              onChange={(e) => setBuyerQuery(e.target.value)}
              disabled={buyersLoading || cashDepositSubmitting}
            />

            <div className="finance-cash-buyer-list" role="listbox" aria-label="Buyers">
              {buyersLoading ? (
                <p className="finance-cash-buyer-empty">Loading buyers…</p>
              ) : filteredBuyers.length === 0 ? (
                <p className="finance-cash-buyer-empty">No buyers found.</p>
              ) : (
                filteredBuyers.map((user) => {
                  const userId = String(user?.id ?? user?.user_id ?? user?.userId ?? '')
                  const selectedId = String(selectedBuyer?.id ?? selectedBuyer?.user_id ?? selectedBuyer?.userId ?? '')
                  const isSelected = userId !== '' && selectedId === userId
                  return (
                    <button
                      key={userId || `${user?.email || ''}-${getUserDisplayName(user)}`}
                      type="button"
                      className={`finance-cash-buyer-item ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => setSelectedBuyer(user)}
                      disabled={cashDepositSubmitting}
                    >
                      <span className="finance-cash-buyer-name">{getUserDisplayName(user)}</span>
                      <span className="finance-cash-buyer-email">{user?.email || '—'}</span>
                    </button>
                  )
                })
              )}
            </div>

            <label className="finance-md-label" htmlFor="finance-cash-amount">
              Deposit amount
            </label>
            <input
              id="finance-cash-amount"
              type="number"
              min="0"
              step="0.01"
              className="finance-md-input"
              placeholder="Enter amount"
              value={cashDepositAmount}
              onChange={(e) => setCashDepositAmount(e.target.value)}
              disabled={!selectedBuyer || cashDepositSubmitting}
            />

            <div className="finance-md-modal-footer">
              <button
                type="button"
                className="finance-md-btn finance-md-btn--ghost"
                onClick={closeCashDepositModal}
                disabled={cashDepositSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="finance-md-btn finance-md-btn--approve"
                onClick={submitCashDeposit}
                disabled={!selectedBuyer || cashDepositSubmitting}
              >
                {cashDepositSubmitting ? 'Submitting…' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default AdminFinance
