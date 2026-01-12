
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

  // Get Categories List
  getCategories: async () => {
    try {
      const { data } = await apiClient.get(API_ROUTES.FETCH_CATEGORIES);
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // Create Category
  createCategory: async (categoryData) => {
    try {
      const { data } = await apiClient.post(API_ROUTES.CREATE_CATEGORY, categoryData);
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // Update Category
  updateCategory: async (categoryId, categoryData) => {
    try {
      // Some APIs use POST for updates, others use PUT/PATCH
      // Try PUT first (RESTful standard), fallback to POST if needed
      const { data } = await apiClient.put(`${API_ROUTES.UPDATE_CATEGORY + categoryId}/`, categoryData);
      return data;
      // try {
      // } catch (putError) {
        // // If PUT returns 405 (Method Not Allowed), try POST
        // if (putError.response?.status === 405) {
        //   const { data } = await apiClient.post(`/api/auctions/categories/${categoryId}/`, categoryData);
        //   return data;
        // }
      //   throw putError;
      // }
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // Delete Category
  deleteCategory: async (categoryId) => {
    try {
      const { data } = await apiClient.delete(`${ API_ROUTES.DELETE_CATEGORY + categoryId}/`);
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // Get Auction Listings
  getAuctionListings: async (params = {}) => {
    try {
      const { data } = await apiClient.get(API_ROUTES.AUCTION_LISTINGS, {
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

  // Get Single Auction by ID
  getAuctionById: async (auctionId) => {
    try {
      const { data } = await apiClient.get(`${API_ROUTES.AUCTION_LISTINGS}${auctionId}/`);
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // Update Manager/User Details
  updateUser: async (userId, userData) => {
    try {
      const formData = new FormData();
      Object.keys(userData).forEach((key) => {
        if (userData[key] !== null && userData[key] !== undefined && userData[key] !== '') {
          if (key === 'image' && userData[key] instanceof File) {
            formData.append(key, userData[key]);
          } else {
            formData.append(key, userData[key]);
          }
        }
      });
      const { data } = await apiClient.patch(
        `${API_ROUTES.ADMIN_UPDATE_USER}${userId}/update/`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // Create Manager/Staff
  createStaff: async (staffData) => {
    try {
      const { data } = await apiClient.post(API_ROUTES.ADMIN_CREATE_STAFF, staffData);
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // Toggle Category Active/Inactive Status
  toggleCategory: async (categoryId, categoryData) => {
    try {
      const { data } = await apiClient.post(
        `${API_ROUTES.TOGGLE_CATEGORY}${categoryId}/toggle/`,
        categoryData
      );
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },
};