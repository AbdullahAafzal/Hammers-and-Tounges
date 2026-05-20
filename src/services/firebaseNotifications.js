import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';
import { toast } from 'react-toastify';
import apiClient from './api.service';
import { API_ROUTES } from '../config/api.config';
import { cookieStorage } from '../utils/cookieStorage';
import {
  buildFcmRegisterPayload,
  FCM_REGISTERED_ACCOUNTS_KEY,
  getAuthUserId,
  mergeAccountIntoDeviceRegistry,
  removeAccountFromDeviceRegistry,
} from '../utils/fcmRegistrationHelpers';

const FCM_TOKEN_STORAGE_KEY = 'fcmToken';
const SERVICE_WORKER_PATH = '/firebase-messaging-sw.js';

const getDeviceRegistry = () => {
  try {
    const raw = localStorage.getItem(FCM_REGISTERED_ACCOUNTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveDeviceRegistry = (registry) => {
  localStorage.setItem(FCM_REGISTERED_ACCOUNTS_KEY, JSON.stringify(registry));
};

/** Always POST; uses the explicit user (not a stale cookie). */
const registerFcmTokenWithBackend = async (token, user) => {
  if (!token) {
    console.log('[FCM] register skipped: no token');
    return false;
  }

  if (!user) {
    console.log('[FCM] register skipped: no user');
    return false;
  }

  const userId = getAuthUserId(user);
  if (userId == null) {
    console.log('[FCM] register skipped: user has no id/pk', user);
    return false;
  }

  const authToken = cookieStorage.getItem(cookieStorage.AUTH_KEYS.TOKEN);
  if (!authToken) {
    console.log('[FCM] register skipped: user not authenticated');
    return false;
  }

  const deviceRegistry = getDeviceRegistry();
  const payload = buildFcmRegisterPayload(token, 'web', user, deviceRegistry);

  try {
    console.log('[FCM] registering token with backend...', {
      userId: payload.user_id,
      roles: payload.roles,
      tokenPreview: `${token.slice(0, 12)}...`,
      sharedAccountsOnDevice: payload.registered_user_ids?.length,
    });
    const response = await apiClient.post(API_ROUTES.FCM_REGISTER, payload, {
      skipDedupe: true,
    });
    console.log('[FCM] register success:', response?.status, response?.data);

    const updatedRegistry = mergeAccountIntoDeviceRegistry(deviceRegistry, user, token);
    saveDeviceRegistry(updatedRegistry);
    console.log('[FCM] device registry updated:', updatedRegistry.map((entry) => entry.userId));
    return true;
  } catch (error) {
    console.log('[FCM] register failed:', error?.response?.status, error?.response?.data || error?.message);
    return false;
  }
};

const resolveFcmRegistrationToken = (user) => {
  let token = localStorage.getItem(FCM_TOKEN_STORAGE_KEY);
  if (token) {
    return token;
  }

  if (!user) {
    return null;
  }

  const userId = getAuthUserId(user);
  if (userId == null) {
    return null;
  }

  const deviceRegistry = getDeviceRegistry();
  const entry = deviceRegistry.find((item) => item.userId === userId);
  return entry?.token || null;
};

const unregisterFcmTokenWithBackend = async (token, user, authToken) => {
  if (!token) {
    console.log('[FCM] unregister skipped: no token');
    return false;
  }

  const bearer = authToken || cookieStorage.getItem(cookieStorage.AUTH_KEYS.TOKEN);
  if (!bearer) {
    console.log('[FCM] unregister skipped: user not authenticated');
    return false;
  }

  try {
    console.log('[FCM] unregistering token with backend...', {
      userId: getAuthUserId(user),
      tokenPreview: `${token.slice(0, 12)}...`,
    });
    const response = await apiClient.delete(API_ROUTES.FCM_UNREGISTER, {
      data: { registration_id: token },
      headers: { Authorization: `Bearer ${bearer}` },
      skipDedupe: true,
    });
    console.log('[FCM] unregister success:', response?.status, response?.data);

    if (user) {
      const deviceRegistry = getDeviceRegistry();
      const updatedRegistry = removeAccountFromDeviceRegistry(deviceRegistry, user);
      saveDeviceRegistry(updatedRegistry);
      console.log('[FCM] device registry updated after logout:', updatedRegistry.map((entry) => entry.userId));
    }

    return true;
  } catch (error) {
    console.log('[FCM] unregister failed:', error?.response?.status, error?.response?.data || error?.message);
    return false;
  }
};

/**
 * Unregister FCM for the current user. Call on logout while the access token is still valid.
 */
export const unregisterFcmForAuthenticatedUser = async (user, { authToken } = {}) => {
  const activeUser = user || cookieStorage.getItem(cookieStorage.AUTH_KEYS.USER);
  const token = resolveFcmRegistrationToken(activeUser);

  if (!token) {
    console.log('[FCM] unregisterForUser skipped: no FCM token available');
    return false;
  }

  return unregisterFcmTokenWithBackend(token, activeUser, authToken);
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBhSSd0Tt0GI6y26HblyyuBpWPC3GPqDdI',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'hammerandtongues.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'hammerandtongues',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'hammerandtongues.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '134298945759',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:134298945759:web:aad0c3b221a9935285816a',
};

const hasRequiredFirebaseConfig = () =>
  Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      firebaseConfig.messagingSenderId &&
      firebaseConfig.appId,
  );

const getFirebaseApp = () => {
  if (!hasRequiredFirebaseConfig()) {
    return null;
  }

  return getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
};

const waitForServiceWorkerActive = (registration) =>
  new Promise((resolve) => {
    if (registration.active) {
      resolve();
      return;
    }
    const worker = registration.installing || registration.waiting;
    if (!worker) {
      resolve();
      return;
    }
    const onStateChange = () => {
      if (worker.state === 'activated') {
        worker.removeEventListener('statechange', onStateChange);
        resolve();
      }
    };
    worker.addEventListener('statechange', onStateChange);
  });

const registerMessagingServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    return null;
  }

  let registration =
    (await navigator.serviceWorker.getRegistration('/')) ||
    (await navigator.serviceWorker.getRegistration());

  if (!registration) {
    registration = await navigator.serviceWorker.register(SERVICE_WORKER_PATH);
  }

  await waitForServiceWorkerActive(registration);
  return registration;
};

const acquireFcmToken = async () => {
  const supported = await isSupported();
  if (!supported) {
    console.log('[FCM] acquire skipped: messaging not supported');
    return null;
  }

  const app = getFirebaseApp();
  if (!app) {
    console.warn('[FCM] acquire skipped: missing web app config');
    return null;
  }

  const serviceWorkerRegistration = await registerMessagingServiceWorker();
  const messaging = getMessaging(app);
  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
  const tokenOptions = {
    ...(vapidKey ? { vapidKey } : {}),
    ...(serviceWorkerRegistration ? { serviceWorkerRegistration } : {}),
  };

  return getToken(messaging, tokenOptions);
};

const getNotificationText = (payload) => {
  const title = payload?.notification?.title;
  const body = payload?.notification?.body;

  if (title && body) return `${title}: ${body}`;
  return title || body || 'New notification received';
};

export const requestNotificationPermission = () => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return Promise.resolve('denied');
  }
  if (Notification.permission !== 'default') {
    return Promise.resolve(Notification.permission);
  }
  try {
    return Notification.requestPermission();
  } catch (error) {
    console.log('[FCM] permission request failed:', error);
    return Promise.resolve(Notification.permission);
  }
};

export const ensureNotificationPermission = async () => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  if (Notification.permission === 'denied') {
    return 'denied';
  }
  try {
    return await Notification.requestPermission();
  } catch (error) {
    console.log('[FCM] permission request failed:', error);
    return Notification.permission;
  }
};

/**
 * Register FCM for the given user. Call after every successful login with payload.user.
 * Reuses cached device token when Firebase getToken fails on repeat logins.
 */
export const registerFcmForAuthenticatedUser = async (
  user,
  { requestPermission = true } = {},
) => {
  if (!user) {
    console.log('[FCM] registerForUser skipped: no user');
    return null;
  }

  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.log('[FCM] registerForUser skipped: Notification API unavailable');
    return null;
  }

  let permission = Notification.permission;
  if (permission !== 'granted' && requestPermission) {
    permission = await ensureNotificationPermission();
  }

  if (permission !== 'granted') {
    console.log('[FCM] registerForUser skipped: permission is', permission);
    return null;
  }

  let token = localStorage.getItem(FCM_TOKEN_STORAGE_KEY);

  try {
    const freshToken = await acquireFcmToken();
    if (freshToken) {
      token = freshToken;
      localStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
      console.log('[FCM] token acquired:', `${token.slice(0, 12)}...`);
    } else if (token) {
      console.log('[FCM] getToken empty; reusing cached token for backend register');
    } else {
      console.log('[FCM] registerForUser skipped: no FCM token available');
      return null;
    }
  } catch (error) {
    console.log('[FCM] acquire token failed:', error);
    if (!token) {
      return null;
    }
    console.log('[FCM] using cached token after acquire error');
  }

  await registerFcmTokenWithBackend(token, user);
  return token;
};

export const initializeFirebaseNotifications = async ({ requestPermission = true } = {}) => {
  const user = cookieStorage.getItem(cookieStorage.AUTH_KEYS.USER);
  return registerFcmForAuthenticatedUser(user, { requestPermission });
};

export const subscribeToFirebaseNotifications = async () => {
  const supported = await isSupported();
  const app = getFirebaseApp();

  if (!supported || !app) {
    return () => {};
  }

  const messaging = getMessaging(app);

  return onMessage(messaging, (payload) => {
    toast.info(getNotificationText(payload));
  });
};
