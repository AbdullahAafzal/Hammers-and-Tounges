import { createAsyncThunk } from '@reduxjs/toolkit';
import { sellerService } from '../../services/interceptors/seller.service';
import { toast } from 'react-toastify';

// Async Thunks
export const fetchMyAuctions = createAsyncThunk(
  'seller/fetchMyAuctions',
  async (params, { rejectWithValue }) => {
    try {
      const response = await sellerService.getMyAuctions(params);
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

export const createAuction = createAsyncThunk(
  'seller/createAuction',
  async (auctionData, { rejectWithValue }) => {

    console.log(auctionData, 'Creating auction with data');
    

    try {
      const response = await sellerService.createAuction(auctionData);
      toast.success('Auction created successfully!');
      console.log('response in seller actions: ', response);
      
      return response;
    } catch (error) {
      console.log(error, 'Error creating auction');
      
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to create auction';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const updateAuction = createAsyncThunk(
  'seller/updateAuction',
  async ({ auctionId, auctionData }, { rejectWithValue }) => {
    try {
      const response = await sellerService.updateAuction(
        auctionId,
        auctionData
      );
      toast.success('Auction updated successfully!');
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to update auction';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const deleteAuction = createAsyncThunk(
  'seller/deleteAuction',
  async (auctionId, { rejectWithValue }) => {
    try {
      await sellerService.deleteAuction(auctionId);
      toast.success('Auction deleted successfully!');
      return auctionId;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to delete auction';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);


export const requestAuctionApproval = createAsyncThunk(
  'seller/requestAuctionApproval',
  async (auctionId, { rejectWithValue }) => {
    try {
      const response = await sellerService.sellerAuctionApprovalRequest(auctionId);
      toast.success('Auction approval requested successfully!');
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to request auction approval';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

