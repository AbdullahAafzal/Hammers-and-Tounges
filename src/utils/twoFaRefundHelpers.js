/** Normalise refund status for comparisons (API may use US or UK spelling). */
export function normaliseRefundStatus(status) {
  return String(status || '').toUpperCase();
}

export function isRefundVerifiedStatus(status) {
  return normaliseRefundStatus(status) === 'VERIFIED';
}

export function isRefundAuthorisedStatus(status) {
  const s = normaliseRefundStatus(status);
  return s === 'AUTHORISED' || s === 'AUTHORIZED';
}

export function isRefundDisbursedStatus(status) {
  return normaliseRefundStatus(status) === 'DISBURSED';
}

export function isRefundRejectedStatus(status) {
  return normaliseRefundStatus(status) === 'REJECTED';
}

export function isRefundPendingStatus(status) {
  const s = normaliseRefundStatus(status);
  return s === 'PENDING' || s === 'INITIATED' || /PENDING|INITIATED/i.test(String(status || ''));
}

/** Refunds that need admin action: verified by finance, or already authorised and awaiting disbursement. */
export function filterAuthoriseTabRefunds(list) {
  if (!Array.isArray(list)) return [];
  return list.filter((r) => {
    const s = normaliseRefundStatus(r?.status);
    return s === 'VERIFIED' || s === 'AUTHORISED' || s === 'AUTHORIZED';
  });
}

function parseBooleanLike(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (value === 1) return true;
    if (value === 0) return false;
  }
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    if (v === 'true' || v === '1' || v === 'yes' || v === 'enabled') return true;
    if (v === 'false' || v === '0' || v === 'no' || v === 'disabled') return false;
  }
  return null;
}

/**
 * Infer whether 2FA is fully enabled from GET /users/2fa/status/ payload.
 * When not configured, backend may return otpauth_uri + detail (same shape as setup).
 */
export function isTwoFaEnabledFromStatus(data) {
  if (!data || typeof data !== 'object') return false;

  const sources = [data, data.user, data.profile, data.result].filter(
    (x) => x && typeof x === 'object'
  );
  const booleanKeys = [
    'enabled',
    'is_2fa_enabled',
    'is_two_fa_enabled',
    'two_fa_enabled',
    'two_factor_enabled',
    'two_factor_auth_enabled',
    'two_factor_authentication_enabled',
    'is_mfa_enabled',
    'mfa_enabled',
  ];

  for (const src of sources) {
    for (const key of booleanKeys) {
      const parsed = parseBooleanLike(src?.[key]);
      if (parsed === true) return true;
      if (parsed === false) return false;
    }
  }

  if (typeof data.otpauth_uri === 'string' && data.otpauth_uri.length > 0) {
    return false;
  }
  return false;
}

export function extractOtpauthUri(data) {
  return typeof data?.otpauth_uri === 'string' ? data.otpauth_uri : '';
}

export function extractTwoFaDetailMessage(data) {
  if (typeof data?.detail === 'string' && data.detail.trim()) return data.detail.trim();
  return 'Scan this QR code using Google Authenticator or Authy.';
}

export function parseManualSecretFromOtpauth(otpauthUri) {
  if (!otpauthUri || typeof otpauthUri !== 'string') return '';
  try {
    const normalised = otpauthUri.replace(/^otpauth:/i, 'http:');
    const u = new URL(normalised);
    return u.searchParams.get('secret') || '';
  } catch {
    return '';
  }
}
