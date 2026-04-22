import { createAsyncThunk } from '@reduxjs/toolkit';
import { sellerService } from '../../services/interceptors/seller.service';
import { toast } from 'react-toastify';

export const fetchMyAuctions = createAsyncThunk(
  'seller/fetchMyAuctions',
  async (params, { rejectWithValue }) => {
    try {
      const response = await sellerService.getMyAuctions(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch auctions';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const createAuction = createAsyncThunk(
  'seller/createAuction',
  async (data, { rejectWithValue }) => {
    try {
      const response = await sellerService.createAuction(data);
      toast.success('Auction created successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create auction';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const updateAuction = createAsyncThunk(
  'seller/updateAuction',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await sellerService.updateAuction(id, data);
      toast.success('Auction updated successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update auction';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const deleteAuction = createAsyncThunk(
  'seller/deleteAuction',
  async (id, { rejectWithValue }) => {
    try {
      await sellerService.deleteAuction(id);
      toast.success('Auction deleted successfully!');
      return id;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete auction';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);