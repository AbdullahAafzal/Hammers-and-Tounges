import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';
import buyerReducer from './slices/buyerSlice';
import permissionsReducer from './slices/permissionsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    buyer: buyerReducer,
    permissions: permissionsReducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       ignoredActions: [
  //         'auth/login/fulfilled',
  //         'auth/register/fulfilled',
  //         'manager/performInspection/pending',
  //         'seller/createAuction/pending',
  //         'seller/updateAuction/pending',
  //       ],
  //       ignoredActionPaths: ['payload.timestamp', 'meta.arg'],
  //       ignoredPaths: ['auth.timestamp'],
  //     },
  //   }),
  // devTools: import.meta.env.DEV,
});

export { store };
export default store;
