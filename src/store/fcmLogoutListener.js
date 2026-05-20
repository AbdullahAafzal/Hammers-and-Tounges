import { createListenerMiddleware } from '@reduxjs/toolkit';
import { logout } from './slices/authSlice';
import { unregisterFcmForAuthenticatedUser } from '../services/firebaseNotifications';

export const fcmLogoutListener = createListenerMiddleware();

fcmLogoutListener.startListening({
  actionCreator: logout,
  effect: async (_action, listenerApi) => {
    const { auth } = listenerApi.getOriginalState();
    await unregisterFcmForAuthenticatedUser(auth.user, { authToken: auth.token });
  },
});
