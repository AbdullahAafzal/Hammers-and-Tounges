import { createSlice } from '@reduxjs/toolkit';
import { assignAuctionToManager, fetchAdminDashboard, fetchUsersList, performUserAction } from '../actions/adminActions';

const initialState = {
  dashboard: null,
  users: [],
  isLoading: false,
  isPerformingAction: false,
  isAssigning: false,
  error: null,
  actionSuccess: false,
};



// Admin Slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    clearActionSuccess: (state) => {
      state.actionSuccess = false;
    },
    resetAdminState: (state) => {
      state.dashboard = null;
      state.users = [];
      state.error = null;
      state.actionSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch Admin Dashboard
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Perform User Action
    builder
      .addCase(performUserAction.pending, (state) => {
        state.isPerformingAction = true;
        state.error = null;
        state.actionSuccess = false;
      })
      .addCase(performUserAction.fulfilled, (state, action) => {
        state.isPerformingAction = false;
        state.actionSuccess = true;
      })
      .addCase(performUserAction.rejected, (state, action) => {
        state.isPerformingAction = false;
        state.error = action.payload;
        state.actionSuccess = false;
      });

    // Assign Auction to Manager
    builder
      .addCase(assignAuctionToManager.pending, (state) => {
        state.isAssigning = true;
        state.error = null;
      })
      .addCase(assignAuctionToManager.fulfilled, (state, action) => {
        state.isAssigning = false;
      })
      .addCase(assignAuctionToManager.rejected, (state, action) => {
        state.isAssigning = false;
        state.error = action.payload;
      });

    // Fetch Users List
    builder
      .addCase(fetchUsersList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsersList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsersList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminError, clearActionSuccess, resetAdminState } =
  adminSlice.actions;
export default adminSlice.reducer;