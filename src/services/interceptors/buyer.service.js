
import apiClient from '../api.service';
import { API_ROUTES } from '../../config/api.config';

export const buyerService = {
  // Place a bid
  placeBid: async (bidData) => {
    try {
      const { data } = await apiClient.post(API_ROUTES.PLACE_BID, bidData);
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // Get bids for an auction
  getAuctionBids: async (auctionId) => {
    console.log(auctionId);
    
    try {
      const { data } = await apiClient.get(
        `${API_ROUTES.GET_AUCTION_BIDS}${auctionId}/bids/`
      );
      console.log(data, "data");
      
      return data;
    } catch (error) {
      console.log(error);
      
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // Get all auctions (for browsing)
  browseAuctions: async () => {
    try {
      const { data } = await apiClient.get(API_ROUTES.AUCTIONS_LIST);
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // Get my bids
  getMyBids: async () => {
    try {
      // Assuming there's an endpoint for this, adjust if needed
      const { data } = await apiClient.get(API_ROUTES.BIDS_LIST);
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },
};
