/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBhSSd0Tt0GI6y26HblyyuBpWPC3GPqDdI',
  authDomain: 'hammerandtongues.firebaseapp.com',
  projectId: 'hammerandtongues',
  storageBucket: 'hammerandtongues.firebasestorage.app',
  messagingSenderId: '134298945759',
  appId: '1:134298945759:web:aad0c3b221a9935285816a',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title =
    (payload && payload.notification && payload.notification.title) ||
    'Hammer and Tongues';
  const options = {
    body:
      (payload && payload.notification && payload.notification.body) ||
      'New notification received',
    icon: '/favicon.ico',
    data: (payload && payload.data) || {},
  };
  self.registration.showNotification(title, options);
});
