import { cookieStorage } from './cookieStorage';
import Cookies from 'js-cookie';

let authStoreRef = null;

/** Register Redux store so token can be read when cookies are unavailable. */
export const setAuthStore = (store) => {
  authStoreRef = store;
};

const normalizeToken = (value) => {
  if (value == null) return null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed || trimmed === 'null' || trimmed === 'undefined') return null;
    return trimmed;
  }
  return null;
};

/** Read the current access token from cookie storage or Redux. */
export const getAccessToken = () => {
  const fromCookie = normalizeToken(cookieStorage.getItem(cookieStorage.AUTH_KEYS.TOKEN));
  if (fromCookie) return fromCookie;

  // Fallback: raw cookie value (legacy / non-JSON storage)
  const raw = Cookies.get(cookieStorage.AUTH_KEYS.TOKEN);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      const normalized = normalizeToken(parsed);
      if (normalized) return normalized;
    } catch {
      const normalized = normalizeToken(raw);
      if (normalized) return normalized;
    }
  }

  const fromStore = normalizeToken(authStoreRef?.getState?.()?.auth?.token);
  if (fromStore) return fromStore;

  return null;
};

/** Attach Bearer auth to an axios request config (merge-safe). */
export const withAuthConfig = (config = {}) => {
  const token = getAccessToken();
  if (!token) return config;

  const bearer = `Bearer ${token}`;
  const next = { ...config };

  if (next.headers && typeof next.headers.set === 'function') {
    if (!next.headers.get?.('Authorization') && !next.headers.get?.('authorization')) {
      next.headers.set('Authorization', bearer);
    }
    return next;
  }

  const headers = { ...(next.headers || {}) };
  if (!headers.Authorization && !headers.authorization) {
    headers.Authorization = bearer;
  }
  return { ...next, headers };
};

export const setAuthorizationHeader = (headers, token) => {
  const normalized = normalizeToken(token);
  if (!normalized) return;
  const bearer = `Bearer ${normalized}`;
  if (headers && typeof headers.set === 'function') {
    headers.set('Authorization', bearer);
  } else if (headers && typeof headers === 'object') {
    headers.Authorization = bearer;
  }
};
