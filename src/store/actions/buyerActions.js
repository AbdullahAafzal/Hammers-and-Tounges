import { createAsyncThunk } from '@reduxjs/toolkit';
import { buyerService } from '../../services/interceptors/buyer.service';
import { toast } from 'react-toastify';

// Async Thunks
export const browseAuctions = createAsyncThunk(
  'buyer/browseAuctions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await buyerService.browseAuctions();
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch auctions';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const placeBid = createAsyncThunk(
  'buyer/placeBid',
  async (bidData, { rejectWithValue }) => {
    try {
      const response = await buyerService.placeBid(bidData);
      console.log("response: ", response);
      
      toast.success('Bid placed successfully!');
      return response;
    } catch (error) {
      console.log(error);
      
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to place bid';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const fetchAuctionBids = createAsyncThunk(
  'buyer/fetchAuctionBids',
  async (auctionId, { rejectWithValue }) => {
    console.log(auctionId);
    
    try {
      const response = await buyerService.getAuctionBids(auctionId);
      console.log("response: ", response);
      
      return response;
      
    } catch (error) {
      console.log("error:", error);
      
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch bids';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const fetchMyBids = createAsyncThunk(
  'buyer/fetchMyBids',
  async (params, { rejectWithValue }) => {
    try {
      const response = await buyerService.getMyBids(params);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch your bids';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const getMyFavoriteAuctions = createAsyncThunk(
  'buyer/getMyFavoriteAuctions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await buyerService.getMyFavoriteAuctions();
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch your bids';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const addToFavorite = createAsyncThunk(
  'buyer/addToFavorite',
  async (auctionId, { rejectWithValue }) => {
    try {
      const response = await buyerService.addToFavorite(auctionId);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch your bids';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const deleteFavorite = createAsyncThunk(
  'buyer/deleteFavorite',
  async (auctionId, { rejectWithValue }) => {
    try {
      const response = await buyerService.deleteFromFavorite(auctionId);
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch your bids';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);