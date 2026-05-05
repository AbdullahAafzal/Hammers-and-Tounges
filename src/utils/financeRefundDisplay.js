/** Shared refund row/detail display helpers (Admin Finance + refund sub-pages). */

export function formatDateTime(iso) {
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

export function refundStatusBadgeClass(status) {
  const s = String(status || '').toUpperCase()
  if (s === 'VERIFIED') {
    return 'finance-action-badge finance-md-status finance-md-status--verified'
  }
  if (s === 'AUTHORISED' || s === 'AUTHORIZED' || s === 'APPROVED' || s === 'READY_FOR_DISBURSEMENT' || s === 'READY_TO_DISBURSE') {
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

export function refundChannelLabel(channel) {
  const c = String(channel || '').toUpperCase()
  if (c === 'BANK_TRANSFER') return 'Bank Transfer'
  if (c === 'VISA') return 'Visa / Card Reversal'
  if (c === 'MOBILE_MONEY') return 'Mobile Money'
  return c || '—'
}

export function getRefundUserDisplay(row) {
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

export function getRefundPaymentDetails(row) {
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

export function sortedAuditLogs(row) {
  const logs = Array.isArray(row?.audit_logs) ? row.audit_logs : []
  return [...logs].sort((a, b) => {
    const ta = new Date(a?.timestamp || 0).getTime()
    const tb = new Date(b?.timestamp || 0).getTime()
    return tb - ta
  })
}
