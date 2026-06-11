export function normalizeManualDepositsList(data) {
  if (Array.isArray(data)) return data
  if (data?.results && Array.isArray(data.results)) return data.results
  return []
}

export function formatDepositDateTime(iso) {
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

export function depositStatusBadgeClass(status) {
  const s = String(status || '').toUpperCase()
  if (s === 'APPROVED') {
    return 'finance-action-badge finance-md-status finance-md-status--approved'
  }
  if (s === 'REJECTED') {
    return 'finance-action-badge finance-md-status finance-md-status--rejected'
  }
  return 'finance-action-badge finance-md-status finance-md-status--pending'
}

export function isCashInHandDeposit(item) {
  const v = item?.cashinhand ?? item?.cash_in_hand ?? item?.cashInHand
  if (v == null) return false
  if (typeof v === 'boolean') return v
  return String(v).toLowerCase() === 'true' || v === '1'
}

export function manualDepositTypeLabel(item) {
  return isCashInHandDeposit(item) ? 'Cash Deposit' : 'Bank Transfer'
}

export function manualDepositTypeBadgeClass(item) {
  return isCashInHandDeposit(item)
    ? 'finance-md-type finance-md-type--cash'
    : 'finance-md-type finance-md-type--bank'
}
