import { createSlice } from '@reduxjs/toolkit';
import { browseAuctions, fetchAuctionBids, fetchMyBids, placeBid } from '../actions/buyerActions';
import { fetchAuctionsList, fetchCategories } from '../actions/AuctionsActions';

const initialState = {
  auctions: null,
  browseAuctionsList: [],
  auctionBids: [],
  myBids: [],
  categories: [],
  isLoading: false,
  isPlacingBid: false,
  error: null,
  bidSuccess: false,

  totalCount: 0,
  nextPage: null,
  prevPage: null,
  currentPage: 1,
};

// Buyer Slice
const buyerSlice = createSlice({
  name: 'buyer',
  initialState,
  reducers: {
    clearBuyerError: (state) => {
      state.error = null;
    },
    clearBidSuccess: (state) => {
      state.bidSuccess = false;
    },
    resetBuyerState: (state) => {
      state.auctions = [];
      state.auctionBids = [];
      state.myBids = [];
      state.error = null;
      state.bidSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // Browse Auctions
    builder
      .addCase(browseAuctions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(browseAuctions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.browseAuctionsList = action.payload;

        state.totalCount = action?.payload?.count ?? 0;
        state.nextPage = action?.payload?.next;
        state.prevPage = action?.payload?.previous;
      })
      .addCase(browseAuctions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
    // All Auctions
    builder
      .addCase(fetchAuctionsList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAuctionsList.fulfilled, (state, action) => {

        state.isLoading = false;
        state.auctions = action.payload;

        state.totalCount = action?.payload?.count ?? 0;
        state.nextPage = action?.payload?.next;
        state.prevPage = action?.payload?.previous;
      })
      .addCase(fetchAuctionsList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Place Bid
    builder
      .addCase(placeBid.pending, (state) => {
        state.isPlacingBid = true;
        state.error = null;
        state.bidSuccess = false;
      })
      .addCase(placeBid.fulfilled, (state, action) => {
        state.isPlacingBid = false;
        state.bidSuccess = true;
      })
      .addCase(placeBid.rejected, (state, action) => {
        state.isPlacingBid = false;
        state.error = action.payload;
        state.bidSuccess = false;
      });

    // Fetch Auction Bids
    builder
      .addCase(fetchAuctionBids.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAuctionBids.fulfilled, (state, action) => {
        state.isLoading = false;
        state.auctionBids = action.payload;

      })
      .addCase(fetchAuctionBids.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch My Bids
    builder
      .addCase(fetchMyBids.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyBids.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myBids = action.payload;
        
        state.totalCount = action?.payload?.count ?? 0;
        state.nextPage = action?.payload?.next;
        state.prevPage = action?.payload?.previous;
      })
      .addCase(fetchMyBids.rejected, (state, action) => {
        state.isLoading = false;
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

export const { clearBuyerError, clearBidSuccess, resetBuyerState } =
  buyerSlice.actions;
export default buyerSlice.reducer;