import { createAsyncThunk } from '@reduxjs/toolkit';
import { adminService } from '../../services/interceptors/admin.service';
import { toast } from 'react-toastify';

// Async Thunks
export const fetchAdminDashboard = createAsyncThunk(
  'admin/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.getDashboard();
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch dashboard data';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const performUserAction = createAsyncThunk(
  'admin/performUserAction',
  async (actionData, { rejectWithValue }) => {
    try {
      const response = await adminService.performUserAction(actionData);
      toast.success(
        `User action "${actionData.type}" performed successfully!`
      );
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to perform user action';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const assignAuctionToManager = createAsyncThunk(
  'admin/assignAuctionToManager',
  async (assignmentData, { rejectWithValue }) => {
    try {
      const response = await adminService.assignAuctionToManager(
        assignmentData
      );
      toast.success('Auction assigned to manager successfully!');
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to assign auction';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const fetchUsersList = createAsyncThunk(
  'admin/fetchUsersList',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminService.getUsersList(params);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch users list';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);