
import { createSlice } from '@reduxjs/toolkit';
import { createAuction, deleteAuction, fetchMyAuctions, updateAuction, requestAuctionApproval } from '../actions/sellerActions';
import { fetchCategories } from '../actions/AuctionsActions';

const initialState = {
  myAuctions: [],
  categories: [],
  selectedAuction: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  actionSuccess: false,

  totalCount: 0,
  nextPage: null,
  prevPage: null,
  currentPage: 1,
};

// Seller Slice
const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    clearSellerError: (state) => {
      state.error = null;
    },
    clearActionSuccess: (state) => {
      state.actionSuccess = false;
    },
    resetSellerState: (state) => {
      state.myAuctions = [];
      state.selectedAuction = null;
      state.error = null;
      state.actionSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch My Auctions
    builder
      .addCase(fetchMyAuctions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyAuctions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myAuctions = action.payload;

        state.totalCount = action?.payload?.count ?? 0;
        state.nextPage = action?.payload?.next;
        state.prevPage = action?.payload?.previous;
      })
      .addCase(fetchMyAuctions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create Auction
    builder
      .addCase(createAuction.pending, (state) => {
        state.isCreating = true;
        state.error = null;
        state.actionSuccess = false;
      })
      .addCase(createAuction.fulfilled, (state, action) => {
        console.log(action.payload, 'Inside sellerSlice createAuction fulfilled');

        state.isCreating = false;
        state.myAuctions = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.results || [];
        state.actionSuccess = true;
      })
      .addCase(createAuction.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
        state.actionSuccess = false;
      });

    // Update Auction
    builder
      .addCase(updateAuction.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.actionSuccess = false;
      })
      .addCase(updateAuction.fulfilled, (state, action) => {
        state.isUpdating = false;

        // ✅ Fix: Access the results array
    if (state.myAuctions?.results && Array.isArray(state.myAuctions.results)) {
      const index = state.myAuctions.results.findIndex(
        (a) => a.id === action.payload.id
      );
      if (index !== -1) {
        state.myAuctions.results[index] = action.payload;
      }
    }
    
    

        state.actionSuccess = true;
      })
      .addCase(updateAuction.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
        state.actionSuccess = false;
      });

    // Delete Auction
    builder
      .addCase(deleteAuction.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteAuction.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.myAuctions = state.myAuctions.filter(
          (a) => a.id !== action.payload
        );
      })
      .addCase(deleteAuction.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload;
      });

    // Fetch Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

  },
});

export const { clearSellerError, clearActionSuccess, resetSellerState } =
  sellerSlice.actions;
export default sellerSlice.reducer;
