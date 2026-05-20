import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';
import { toast } from 'react-toastify';
import apiClient from './api.service';
import { API_ROUTES } from '../config/api.config';
import { cookieStorage } from '../utils/cookieStorage';
import {
  buildFcmRegisterPayload,
  FCM_REGISTERED_ACCOUNTS_KEY,
  mergeAccountIntoDeviceRegistry,
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

const registerFcmTokenWithBackend = async (token, user) => {
  if (!token) {
    console.log('[FCM] register skipped: no token');
    return;
  }

  const authToken = cookieStorage.getItem(cookieStorage.AUTH_KEYS.TOKEN);
  if (!authToken) {
    console.log('[FCM] register skipped: user not authenticated');
    return;
  }

  const activeUser = user || cookieStorage.getItem(cookieStorage.AUTH_KEYS.USER);
  if (!activeUser) {
    console.log('[FCM] register skipped: no user profile');
    return;
  }

  const deviceRegistry = getDeviceRegistry();
  const payload = buildFcmRegisterPayload(token, 'web', activeUser, deviceRegistry);

  try {
    console.log('[FCM] registering token with backend...', {
      userId: payload.user_id,
      roles: payload.roles,
      sharedAccountsOnDevice: payload.registered_user_ids?.length,
    });
    const response = await apiClient.post(API_ROUTES.FCM_REGISTER, payload);
    console.log('[FCM] register success:', response?.status, response?.data);

    const updatedRegistry = mergeAccountIntoDeviceRegistry(deviceRegistry, activeUser, token);
    saveDeviceRegistry(updatedRegistry);
    console.log('[FCM] device registry updated:', updatedRegistry.map((entry) => entry.userId));
  } catch (error) {
    console.log('[FCM] register failed:', error?.response?.status, error?.response?.data || error?.message);
  }
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

  let registration = await navigator.serviceWorker.getRegistration(SERVICE_WORKER_PATH);
  if (!registration) {
    registration = await navigator.serviceWorker.register(SERVICE_WORKER_PATH);
  }

  await waitForServiceWorkerActive(registration);
  return registration;
};

const getNotificationText = (payload) => {
  const title = payload?.notification?.title;
  const body = payload?.notification?.body;

  if (title && body) return `${title}: ${body}`;
  return title || body || 'New notification received';
};

/**
 * Triggers the browser's notification permission prompt. Safari requires this
 * to be called from a direct user gesture (e.g. inside a click handler, before
 * any `await`). Returns the resulting permission string.
 */
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
 * @param {{ requestPermission?: boolean }} options
 * requestPermission: when true, prompts if still "default" (session restore). When false, caller already prompted (Sign In).
 */
export const initializeFirebaseNotifications = async ({ requestPermission = true } = {}) => {
  try {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.log('[FCM] init skipped: Notification API unavailable');
      return null;
    }

    let permission = Notification.permission;
    if (permission !== 'granted' && requestPermission) {
      permission = await ensureNotificationPermission();
    }

    if (permission !== 'granted') {
      console.log('[FCM] init skipped: permission is', permission);
      return null;
    }

    const supported = await isSupported();
    if (!supported) {
      console.log('[FCM] init skipped: messaging not supported in this browser');
      return null;
    }

    const app = getFirebaseApp();
    if (!app) {
      console.warn('[FCM] init skipped: missing web app config');
      return null;
    }

    const user = cookieStorage.getItem(cookieStorage.AUTH_KEYS.USER);
    const serviceWorkerRegistration = await registerMessagingServiceWorker();
    const messaging = getMessaging(app);
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    const tokenOptions = {
      ...(vapidKey ? { vapidKey } : {}),
      ...(serviceWorkerRegistration ? { serviceWorkerRegistration } : {}),
    };

    const token = await getToken(messaging, tokenOptions);
    const effectiveToken = token || localStorage.getItem(FCM_TOKEN_STORAGE_KEY);

    if (effectiveToken) {
      if (token) {
        localStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
        console.log('[FCM] token generated:', token);
      } else {
        console.log('[FCM] reusing stored token');
      }
      await registerFcmTokenWithBackend(effectiveToken, user);
    } else {
      console.log('[FCM] getToken returned empty');
    }

    return effectiveToken;
  } catch (error) {
    console.log('[FCM] initialization failed:', error);
    return null;
  }
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
