
import apiClient from '../api.service';
import { API_ROUTES } from '../../config/api.config';

export const sellerService = {
  // Create Auction Draft
  createAuction: async (auctionData) => {
    try {

      console.log(auctionData, 'Inside sellerService createAuction');
      
      const formData = new FormData();

      // Append text fields
      Object.keys(auctionData).forEach((key) => {
        if (key === 'media' || key === 'media_labels') {
          // Skip - handle separately
          return;
        } else if (key === 'specific_data') {
          // Stringify JSON
          formData.append(key, JSON.stringify(auctionData[key]));
        } else if (auctionData[key] !== null && auctionData[key] !== undefined) {
          formData.append(key, auctionData[key]);
        }
      });

      // Append media files with labels
      if (auctionData.media && Array.isArray(auctionData.media)) {
        auctionData.media.forEach((file, index) => {
          formData.append('media', file);
          if (auctionData.media_labels && auctionData.media_labels[index]) {
            formData.append('media_labels', auctionData.media_labels[index]);
          }
        });
      }

      const { data } = await apiClient.post(
        API_ROUTES.CREATE_AUCTION,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      console.log('create auction: ', data);
      
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // Update Auction (only in DRAFT status)
  updateAuction: async (auctionId, auctionData) => {
    try {
      const formData = new FormData();

      // Append text fields
      Object.keys(auctionData).forEach((key) => {
        if (key === 'media' || key === 'media_labels') {
          return;
        } else if (key === 'specific_data') {
          formData.append(key, JSON.stringify(auctionData[key]));
        } else if (auctionData[key] !== null && auctionData[key] !== undefined) {
          formData.append(key, auctionData[key]);
        }
      });

      // Append media files with labels
      if (auctionData.media && Array.isArray(auctionData.media)) {
        auctionData.media.forEach((file, index) => {
          formData.append('media', file);
          if (auctionData.media_labels && auctionData.media_labels[index]) {
            formData.append('media_labels', auctionData.media_labels[index]);
          }
        });
      }

      const { data } = await apiClient.put(
        `${API_ROUTES.UPDATE_AUCTION}${auctionId}/`,
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

  // Delete Auction
  deleteAuction: async (auctionId) => {
    try {
      const { data } = await apiClient.delete(
        `${API_ROUTES.DELETE_AUCTION}${auctionId}/`
      );
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // Get seller's own auctions
  getMyAuctions: async (params = {}) => {
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

  sellerAuctionApprovalRequest: async (auctionId) => {
    try {
      const { data } = await apiClient.post( API_ROUTES.AUCTION_APPROVAL_REQUEST + `${auctionId}/approval-request/` );
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      } 
      throw error;
    }
  },

};
