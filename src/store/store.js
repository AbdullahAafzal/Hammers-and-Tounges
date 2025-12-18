import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       // Ignore these action types
  //       ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
  //       // Ignore these field paths in all actions
  //       ignoredActionPaths: ['payload.timestamp', 'meta.arg'],
  //       // Ignore these paths in the state
  //       ignoredPaths: ['auth.timestamp'],
  //     },
  //   }),
  // devTools: process.env.NODE_ENV !== 'production',
});
export default store