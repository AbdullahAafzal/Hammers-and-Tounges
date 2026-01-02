
import { createSlice } from '@reduxjs/toolkit';
import { createChecklist, deleteChecklist, fetchAssignedTasks, fetchChecklists, fetchInspectionReportDetail, fetchInspectionReports, performInspection, updateChecklist } from '../actions/managerActions';

const initialState = {
  assignedTasks: [],
  inspectionReports: [],
  inspectionReportDetail: null,
  checklists: [],
  isLoading: false,
  isInspecting: false,
  isCreatingChecklist: false,
  isUpdatingChecklist: false,
  isDeletingChecklist: false,
  error: null,
  inspectionSuccess: false,
};


// Manager Slice
const managerSlice = createSlice({
  name: 'manager',
  initialState,
  reducers: {
    clearManagerError: (state) => {
      state.error = null;
    },
    clearInspectionSuccess: (state) => {
      state.inspectionSuccess = false;
    },
    resetManagerState: (state) => {
      state.assignedTasks = [];
      state.inspectionReports = [];
      state.inspectionReportDetail = null;
      state.checklists = [];
      state.error = null;
      state.inspectionSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch Assigned Tasks
    builder
      .addCase(fetchAssignedTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAssignedTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assignedTasks = action.payload;
      })
      .addCase(fetchAssignedTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Perform Inspection
    builder
      .addCase(performInspection.pending, (state) => {
        state.isInspecting = true;
        state.error = null;
        state.inspectionSuccess = false;
      })
      .addCase(performInspection.fulfilled, (state, action) => {
        state.isInspecting = false;
        state.inspectionSuccess = true;
      })
      .addCase(performInspection.rejected, (state, action) => {
        state.isInspecting = false;
        state.error = action.payload;
        state.inspectionSuccess = false;
      });

    // Fetch Inspection Reports
    builder
      .addCase(fetchInspectionReports.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInspectionReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.inspectionReports = action.payload;
      })
      .addCase(fetchInspectionReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch Inspection Report Detail
    builder
      .addCase(fetchInspectionReportDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInspectionReportDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.inspectionReportDetail = action.payload;
      })
      .addCase(fetchInspectionReportDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create Checklist
    builder
      .addCase(createChecklist.pending, (state) => {
        state.isCreatingChecklist = true;
        state.error = null;
      })
      .addCase(createChecklist.fulfilled, (state, action) => {
        state.isCreatingChecklist = false;
        state.checklists.push(action.payload);
      })
      .addCase(createChecklist.rejected, (state, action) => {
        state.isCreatingChecklist = false;
        state.error = action.payload;
      });

    // Fetch Checklists
    builder
      .addCase(fetchChecklists.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChecklists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.checklists = action.payload;
      })
      .addCase(fetchChecklists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update Checklist
    builder
      .addCase(updateChecklist.pending, (state) => {
        state.isUpdatingChecklist = true;
        state.error = null;
      })
      .addCase(updateChecklist.fulfilled, (state, action) => {
        state.isUpdatingChecklist = false;
        const index = state.checklists.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.checklists[index] = action.payload;
        }
      })
      .addCase(updateChecklist.rejected, (state, action) => {
        state.isUpdatingChecklist = false;
        state.error = action.payload;
      });

    // Delete Checklist
    builder
      .addCase(deleteChecklist.pending, (state) => {
        state.isDeletingChecklist = true;
        state.error = null;
      })
      .addCase(deleteChecklist.fulfilled, (state, action) => {
        state.isDeletingChecklist = false;
        state.checklists = state.checklists.filter(
          (c) => c.id !== action.payload
        );
      })
      .addCase(deleteChecklist.rejected, (state, action) => {
        state.isDeletingChecklist = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearManagerError,
  clearInspectionSuccess,
  resetManagerState,
} = managerSlice.actions;
export default managerSlice.reducer;