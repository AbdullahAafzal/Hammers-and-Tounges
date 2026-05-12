import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';
import { toast } from 'react-toastify';
import apiClient from './api.service';
import { API_ROUTES } from '../config/api.config';
import { cookieStorage } from '../utils/cookieStorage';

const FCM_TOKEN_STORAGE_KEY = 'fcmToken';

const registerFcmTokenWithBackend = async (token) => {
  if (!token) return;
  try {
    const authToken = cookieStorage.getItem(cookieStorage.AUTH_KEYS.TOKEN);
    if (!authToken) {
      return;
    }
    await apiClient.post(API_ROUTES.FCM_REGISTER, {
      registration_id: token,
      device_type: 'web',
    });
  } catch (error) {
    console.log('FCM token registration failed:', error?.response?.data || error?.message);
  }
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDW-eGF3eVkhUCfUSXbq_L63QcU69uDVTY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'hammerandtongues.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'hammerandtongues',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'hammerandtongues.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '134298945759',
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
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

const registerMessagingServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    return null;
  }

  return navigator.serviceWorker.register(
    new URL('../firebase-messaging-sw.js', import.meta.url),
    { type: 'module' },
  );
};

const getNotificationText = (payload) => {
  const title = payload?.notification?.title;
  const body = payload?.notification?.body;

  if (title && body) return `${title}: ${body}`;
  return title || body || 'New notification received';
};

export const initializeFirebaseNotifications = async () => {
  try {
    if (!('Notification' in window)) {
      return null;
    }

    const supported = await isSupported();
    if (!supported) {
      return null;
    }

    const app = getFirebaseApp();
    if (!app) {
      console.warn('Firebase notifications are missing web app config.');
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return null;
    }

    const serviceWorkerRegistration = await registerMessagingServiceWorker();
    const messaging = getMessaging(app);
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    const tokenOptions = {
      ...(vapidKey ? { vapidKey } : {}),
      ...(serviceWorkerRegistration ? { serviceWorkerRegistration } : {}),
    };

    const token = await getToken(messaging, tokenOptions);
    if (token) {
      localStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
      console.log('Firebase notification token:', token);
      await registerFcmTokenWithBackend(token);
    }

    return token;
  } catch (error) {
    console.log('Firebase notification initialization failed:', error);
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
