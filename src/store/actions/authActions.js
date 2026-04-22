import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/api.service';
import { toast } from 'react-toastify';

// Register User
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('users/register/', userData);
      toast.success('Registration successful! Please verify your email.');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || 'Registration failed';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('users/login/', credentials);
      toast.success('Login successful!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || 'Login failed';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

// Verify OTP
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('users/verify-otp/', otpData);
      toast.success('OTP verified successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || 'OTP verification failed';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

// Resend OTP
export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('users/resend-otp/', data);
      toast.success('OTP sent successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || 'Failed to resend OTP';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

// Refresh Access Token
export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('users/token/refresh/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Token refresh failed' });
    }
  }
);

// Request Password Reset
export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('users/password-reset-request/', { email });
      toast.success('Password reset email sent!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || 'Failed to send reset email';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

// Verify Password OTP
export const verifyPasswordOtp = createAsyncThunk(
  'auth/verifyPasswordOtp',
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('users/password-OTP-verify/', data);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || 'OTP verification failed';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

// Confirm Password Reset
export const confirmPasswordReset = createAsyncThunk(
  'auth/confirmPasswordReset',
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('users/password-reset-confirm/', data);
      toast.success('Password reset successful!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || 'Password reset failed';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);