
import { createAsyncThunk } from '@reduxjs/toolkit';
import { managerService } from '../../services/interceptors/manager.service';
import { toast } from 'react-toastify';


// Async Thunks
export const fetchAssignedTasks = createAsyncThunk(
  'manager/fetchAssignedTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await managerService.getAssignedTasks();
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch assigned tasks';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const performInspection = createAsyncThunk(
  'manager/performInspection',
  async ({ auctionId, inspectionData }, { rejectWithValue }) => {
    try {
      const response = await managerService.performInspection(
        auctionId,
        inspectionData
      );
      toast.success('Inspection completed successfully!');
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to perform inspection';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const fetchInspectionReports = createAsyncThunk(
  'manager/fetchInspectionReports',
  async (params, { rejectWithValue }) => {
    try {
      const response = await managerService.getInspectionReports(params);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch inspection reports';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const fetchInspectionReportDetail = createAsyncThunk(
  'manager/fetchInspectionReportDetail',
  async (reportId, { rejectWithValue }) => {
    try {
      const response = await managerService.getInspectionReportDetail(
        reportId
      );
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch inspection report details';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const createChecklist = createAsyncThunk(
  'manager/createChecklist',
  async (checklistData, { rejectWithValue }) => {
    try {
      const response = await managerService.createChecklist(checklistData);
      toast.success('Checklist created successfully!');
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to create checklist';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const fetchChecklists = createAsyncThunk(
  'manager/fetchChecklists',
  async (_, { rejectWithValue }) => {
    try {
      const response = await managerService.getChecklists();
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch checklists';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const updateChecklist = createAsyncThunk(
  'manager/updateChecklist',
  async ({ templateId, checklistData }, { rejectWithValue }) => {
    try {
      const response = await managerService.updateChecklist(
        templateId,
        checklistData
      );
      toast.success('Checklist updated successfully!');
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to update checklist';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const deleteChecklist = createAsyncThunk(
  'manager/deleteChecklist',
  async (templateId, { rejectWithValue }) => {
    try {
      await managerService.deleteChecklist(templateId);
      toast.success('Checklist deleted successfully!');
      return templateId;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to delete checklist';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);