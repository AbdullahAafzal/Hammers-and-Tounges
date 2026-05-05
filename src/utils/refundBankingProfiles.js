/**
 * Banking profiles on refund detail: match refund buyer EMAIL to the buyer directory
 * (same source as Deposit Exemption + Redux admin.users), then filter by that buyer's id.
 */

export function normalizeEmailForMatch(value) {
  if (value == null) return ''
  return String(value).trim().toLowerCase()
}

/** First non-empty email on the refund (normalized). */
export function getRefundBuyerEmailForMatching(refund) {
  if (!refund || typeof refund !== 'object') return ''
  const candidates = [
    refund.customer_email,
    refund.user_email,
    refund.buyer_email,
    refund.client_email,
    refund.email,
    refund.user?.email,
    refund.buyer?.email,
    refund.client?.email,
  ]
  for (const c of candidates) {
    const n = normalizeEmailForMatch(c)
    if (n) return n
  }
  return ''
}

export function getBuyerRowCanonicalId(row) {
  if (!row || typeof row !== 'object') return null
  const id = row.id ?? row.user_id ?? row.userId
  if (id == null || id === '') return null
  const n = Number(id)
  return Number.isFinite(n) ? n : String(id)
}

/** Redux `state.admin.users` may be `[]` or `{ results, ... }` from fetchUsersList. */
export function normalizeAdminUsersList(adminUsers) {
  if (!adminUsers) return []
  if (Array.isArray(adminUsers)) return adminUsers
  if (Array.isArray(adminUsers.results)) return adminUsers.results
  return []
}

export function mergeBuyerDirectoryForMatching(reduxAdminUsers, fetchedBuyerRows = []) {
  const fromRedux = normalizeAdminUsersList(reduxAdminUsers)
  const seen = new Set()
  const out = []
  for (const row of [...fetchedBuyerRows, ...fromRedux]) {
    const id = getBuyerRowCanonicalId(row)
    if (id == null) continue
    const k = String(id)
    if (seen.has(k)) continue
    seen.add(k)
    out.push(row)
  }
  return out
}

/**
 * Find buyer row whose email matches (trim + lowercase), prefer role=buyer when role is present.
 */
export function findBuyerIdByEmailInDirectory(buyerDirectoryRows, emailNormalized) {
  if (!emailNormalized || !Array.isArray(buyerDirectoryRows) || buyerDirectoryRows.length === 0) return null
  const pool = buyerDirectoryRows.filter((u) => !u?.role || String(u.role).toLowerCase() === 'buyer')
  const list = pool.length > 0 ? pool : buyerDirectoryRows
  for (const row of list) {
    if (normalizeEmailForMatch(row?.email) === emailNormalized) {
      return getBuyerRowCanonicalId(row)
    }
  }
  return null
}

/**
 * Buyer id used for banking profile `user` filter — email match to directory only (no refund user id shortcut).
 */
export function getBankingFilterBuyerId(refund, buyerDirectoryRows) {
  const emailNorm = getRefundBuyerEmailForMatching(refund)
  if (!emailNorm) return null
  return findBuyerIdByEmailInDirectory(buyerDirectoryRows || [], emailNorm)
}

/** Owner user id from a banking profile row (`user` may be id, or nested object). */
export function getBankingProfileOwnerUserId(profile) {
  if (!profile || typeof profile !== 'object') return null

  const direct = profile.user ?? profile.user_id ?? profile.userId ?? profile.owner_user_id ?? profile.ownerId
  if (typeof direct === 'number' && Number.isFinite(direct)) return direct
  if (typeof direct === 'string' && direct.trim() !== '') {
    const n = Number(direct)
    return Number.isFinite(n) ? n : direct.trim()
  }

  const nested = profile.user ?? profile.buyer ?? profile.client ?? profile.owner
  if (nested && typeof nested === 'object') {
    const id = nested.id ?? nested.user_id ?? nested.userId ?? nested.pk
    if (id == null || id === '') return null
    const n = Number(id)
    return Number.isFinite(n) ? n : String(id)
  }

  return null
}

function getBankingProfileComparableIds(profile) {
  if (!profile || typeof profile !== 'object') return []
  const out = []
  const ownerId = getBankingProfileOwnerUserId(profile)
  if (ownerId != null && ownerId !== '') out.push(String(ownerId))
  if (profile.id != null && profile.id !== '') out.push(String(profile.id))
  return [...new Set(out)]
}

export function normalizeBankingProfilesList(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  if (Array.isArray(raw.results)) return raw.results
  if (Array.isArray(raw.data)) return raw.data
  return []
}

function getBankingProfileEmailForMatching(profile) {
  if (!profile || typeof profile !== 'object') return ''
  const candidates = [profile.user_email, profile.email, profile.user?.email, profile.buyer?.email, profile.client?.email]
  for (const c of candidates) {
    const n = normalizeEmailForMatch(c)
    if (n) return n
  }
  return ''
}

export function filterBankingProfilesForRefund(refund, profiles, _buyerDirectoryRows) {
  const refundEmail = getRefundBuyerEmailForMatching(refund)
  if (!refundEmail) return []
  const list = normalizeBankingProfilesList(profiles)
  return list.filter((p) => getBankingProfileEmailForMatching(p) === refundEmail)
}
