import apiClient from '../api.service';
import { API_ROUTES } from '../../config/api.config';
export const bidsService = {
    // Place a bid on an auction
    placeBid: async (auctionId, bidAmount) => {

        try {
            const { data } = await apiClient.post(API_ROUTES.PLACE_BID, {
                auction_id: auctionId,
                bid_amount: bidAmount,
            });
            return data;
        } catch (error) {
            if (error.isNetworkError) {
                throw new Error('Unable to connect to server. Please try again later.');
            }
            throw error;
        }

    },
    bidsHistory: async (auctionId) => {
        try {
            const { data } = await apiClient.get(
                `${API_ROUTES.AUCTION_BID_HISTORY}${auctionId}/bids/`
            );
            return data;
        } catch (error) {
            if (error.isNetworkError) {
                throw new Error('Unable to connect to server. Please try again later.');
            }
            throw error;
        }
    },
    bidsList: async () => {
        try {
            const { data } = await apiClient.get(API_ROUTES.BIDS_LIST);
            return data;
        } catch (error) {
            if (error.isNetworkError) {
                throw new Error('Unable to connect to server. Please try again later.');
            }
            throw error;
        }
    },
    favoritBids: async () => {
        try {
            const { data } = await apiClient.get(API_ROUTES.WATCH_LIST);
            return data;
        } catch (error) {
            if (error.isNetworkError) {
                throw new Error('Unable to connect to server. Please try again later.');
            }
            throw error;
        }
    },
    getAuctionBids: async (auctionId) => {
        try {
            const { data } = await apiClient.get(API_ROUTES.GET_AUCTION_BIDS + `${auctionId}/bids/`);
            return data;
        } catch (error) {
            if (error.isNetworkError) {
                throw new Error('Unable to connect to server. Please try again later.');
            }
            throw error;
        }
    },
};