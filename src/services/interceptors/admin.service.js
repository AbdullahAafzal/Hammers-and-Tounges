
import apiClient from '../api.service';
import { API_ROUTES } from '../../config/api.config';

export const adminService = {
  // Get Admin Dashboard Data
  getDashboard: async () => {
    try {
      const { data } = await apiClient.get(API_ROUTES.ADMIN_DASHBOARD);
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // User Actions (Verify Seller, Promote to Manager, etc.)
  performUserAction: async (actionData) => {
    try {
      const { data } = await apiClient.post(
        API_ROUTES.ADMIN_USER_ACTION,
        actionData
      );
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // Assign Auction to Manager
  assignAuctionToManager: async (assignmentData) => {
    try {
      const { data } = await apiClient.post(
        API_ROUTES.ADMIN_ASSIGN_AUCTION,
        assignmentData
      );
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // Get List of Users
  getUsersList: async (params = {}) => {
    try {
      const { data } = await apiClient.get(API_ROUTES.ADMIN_USERS_LIST, {
        params,
      });
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },
};