import apiClient from '../api.service';
import { API_ROUTES } from '../../config/api.config';

export const auctionService = {
  // Get all auctions (with optional filters)
  getAuctions: async (params) => {
    try {
      const { data } = await apiClient.get(API_ROUTES.AUCTIONS_LIST, {
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
  // Get all categories
  getCategories: async () => {
    try {
      const { data } = await apiClient.get(API_ROUTES.AUCTION_CATEGORIES);
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },
  // Get category detail
  getCategoryDetail: async (categoryId) => {
    try {
      const { data } = await apiClient.get(
        `${API_ROUTES.AUCTION_CATEGORY_DETAIL}${categoryId}/`
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
