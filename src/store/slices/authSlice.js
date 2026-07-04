import { createSlice } from '@reduxjs/toolkit';
import { cookieStorage } from '../../utils/cookieStorage';
import { registerUser, loginUser, verifyOtp, resendOtp, refreshAccessToken, requestPasswordReset, verifyPasswordOtp, confirmPasswordReset } from '../actions/authActions';
import { toast } from 'react-toastify';

const pickAccessToken = (payload) =>
  payload?.access || payload?.access_token || payload?.token || null;

const pickRefreshToken = (payload) =>
  payload?.refresh || payload?.refresh_token || null;

const persistSession = (payload) => {
  const access = pickAccessToken(payload);
  const refresh = pickRefreshToken(payload);
  if (payload?.user) {
    cookieStorage.setItem(cookieStorage.AUTH_KEYS.USER, payload.user);
  }
  if (access) {
    cookieStorage.setItem(cookieStorage.AUTH_KEYS.TOKEN, access);
    cookieStorage.setItem(cookieStorage.AUTH_KEYS.TOKEN_TIMESTAMP, Date.now());
  }
  if (refresh) {
    cookieStorage.setItem(cookieStorage.AUTH_KEYS.REFRESH_TOKEN, refresh);
  }
  if (payload?.user) {
    const u = payload.user;
    const role = (u?.role || '').toLowerCase();
    const isStaff = u?.is_staff === true || u?.is_staff === 1 || String(u?.is_staff).toLowerCase() === 'true';
    const effectiveRole =
      role === 'finance'
        ? 'finance'
        : role === 'buyer' || role === 'seller'
          ? role
          : isStaff
            ? 'admin'
            : role || 'buyer';
    cookieStorage.setItem(cookieStorage.AUTH_KEYS.ROLE, effectiveRole);
  }
  return { access, refresh };
};

const initialState = {
  user: cookieStorage.getItem(cookieStorage.AUTH_KEYS.USER) || null,
  token: cookieStorage.getItem(cookieStorage.AUTH_KEYS.TOKEN) || null,
  refreshToken: cookieStorage.getItem(cookieStorage.AUTH_KEYS.REFRESH_TOKEN) || null,
  isAuthenticated: !!cookieStorage.getItem(cookieStorage.AUTH_KEYS.TOKEN),
  isLoading: false,
  error: null,

  registrationData: null,
  isRegistering: false,
  registrationError: null,

  // 
  isRequestingReset: false,
  resetRequestError: null,
  resetRequestSuccess: false,

  isVerifyingResetOtp: false,
  resetOtpError: null,
  resetToken: null,

  isConfirmingReset: false,
  resetConfirmError: null,
  resetConfirmSuccess: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      cookieStorage.clear();
      toast.info('Logged out successfully');
    },

    clearError: (state) => {
      state.error = null;
      state.registrationError = null;
      state.otpError = null;
      state.resetRequestError = null;
    },

    clearRegistrationData: (state) => {
      state.registrationData = null;
      state.registrationError = null;
    },

    clearResetToken: (state) => {
      state.resetToken = null;
    },
    resetPasswordState: (state) => {
      state.resetRequestSuccess = false;
      state.resetConfirmSuccess = false;
      state.resetToken = null;
      state.resetRequestError = null;
      state.resetOtpError = null;
      state.resetConfirmError = null;
    },
  },

  extraReducers: (builder) => {
    // Register User
    builder
      .addCase(registerUser.pending, (state) => {
        state.isRegistering = true;
        state.registrationError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isRegistering = false;
        state.registrationData = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isRegistering = false;
        state.registrationError = action.payload;
      });

    // Login User
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        const { access, refresh } = persistSession(action.payload);
        state.token = access;
        state.refreshToken = refresh;
        state.isAuthenticated = !!access;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Verify OTP
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.isVerifyingOtp = true;
        state.otpError = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isVerifyingOtp = false;
        const access = pickAccessToken(action.payload);
        const refresh = pickRefreshToken(action.payload);
        if (access && refresh) {
          state.user = action.payload.user;
          persistSession(action.payload);
          state.token = access;
          state.refreshToken = refresh;
          state.isAuthenticated = true;
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isVerifyingOtp = false;
        state.otpError = action.payload;
      });

    // Resend OTP
    builder
      .addCase(resendOtp.pending, (state) => {
        state.isResendingOtp = true;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.isResendingOtp = false;
      })
      .addCase(resendOtp.rejected, (state) => {
        state.isResendingOtp = false;
      });

    // Refresh Token
    builder
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        const access = pickAccessToken(action.payload);
        state.token = access;
        if (access) {
          cookieStorage.setItem(cookieStorage.AUTH_KEYS.TOKEN, access);
          cookieStorage.setItem(cookieStorage.AUTH_KEYS.TOKEN_TIMESTAMP, Date.now());
        }
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        cookieStorage.clear();
      });

    // Request Password Reset
    builder
      .addCase(requestPasswordReset.pending, (state) => {
        state.isRequestingReset = true;
        state.resetRequestError = null;
        state.resetRequestSuccess = false;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.isRequestingReset = false;
        state.resetRequestSuccess = true;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.isRequestingReset = false;
        state.resetRequestError = action.payload;
        state.resetRequestSuccess = false;
      });

    // Verify Password OTP
    builder
      .addCase(verifyPasswordOtp.pending, (state) => {
        state.isVerifyingResetOtp = true;
        state.resetOtpError = null;
      })
      .addCase(verifyPasswordOtp.fulfilled, (state, action) => {
        state.isVerifyingResetOtp = false;
        state.resetToken = action.payload.reset_token;
      })
      .addCase(verifyPasswordOtp.rejected, (state, action) => {
        state.isVerifyingResetOtp = false;
        state.resetOtpError = action.payload;
      });

    // Confirm Password Reset
    builder
      .addCase(confirmPasswordReset.pending, (state) => {
        state.isConfirmingReset = true;
        state.resetConfirmError = null;
        state.resetConfirmSuccess = false;
      })
      .addCase(confirmPasswordReset.fulfilled, (state) => {
        state.isConfirmingReset = false;
        state.resetConfirmSuccess = true;
        state.resetToken = null;
      })
      .addCase(confirmPasswordReset.rejected, (state, action) => {
        state.isConfirmingReset = false;
        state.resetConfirmError = action.payload;
        state.resetConfirmSuccess = false;
      });
  },
});

export const { logout, clearError, clearRegistrationData, clearResetToken, resetPasswordState } = authSlice.actions;
export default authSlice.reducer;