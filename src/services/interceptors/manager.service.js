
import apiClient from '../api.service';
import { API_ROUTES } from '../../config/api.config';

export const managerService = {
  // Get Manager's Assigned Tasks/Auctions
  getAssignedTasks: async () => {
    try {
      const { data } = await apiClient.get(API_ROUTES.MANAGER_TASKS);
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // Perform Inspection on an Auction
  performInspection: async (auctionId, inspectionData) => {
    try {
      const formData = new FormData();
      
      // Append text fields
      Object.keys(inspectionData).forEach((key) => {
        if (key === 'inspection_images') {
          // Handle multiple file uploads
          if (Array.isArray(inspectionData[key])) {
            inspectionData[key].forEach((file) => {
              formData.append('inspection_images', file);
            });
          }
        } else if (key === 'checklist_data') {
          // Stringify JSON data
          formData.append(key, JSON.stringify(inspectionData[key]));
        } else if (inspectionData[key] !== null && inspectionData[key] !== undefined) {
          formData.append(key, inspectionData[key]);
        }
      });

      const { data } = await apiClient.post(
        `${API_ROUTES.MANAGER_INSPECT}${auctionId}/`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // Get All Inspection Reports
  getInspectionReports: async (params = {}) => {
    try {
      const { data } = await apiClient.get(API_ROUTES.INSPECTION_REPORTS, {
        params,
      });
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // Get Detailed Inspection Report
  getInspectionReportDetail: async (reportId) => {
    try {
      const { data } = await apiClient.get(
        `${API_ROUTES.INSPECTION_REPORT_DETAIL}${reportId}/`
      );
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // Checklist/Template Management
  createChecklist: async (checklistData) => {
    try {
      const { data } = await apiClient.post(
        API_ROUTES.INSPECTION_TEMPLATES,
        checklistData
      );
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  getChecklists: async () => {
    try {
      const { data } = await apiClient.get(API_ROUTES.INSPECTION_TEMPLATES);
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  updateChecklist: async (templateId, checklistData) => {
    try {
      const { data } = await apiClient.put(
        `${API_ROUTES.INSPECTION_TEMPLATE_DETAIL}${templateId}/`,
        checklistData
      );
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  deleteChecklist: async (templateId) => {
    try {
      const { data } = await apiClient.delete(
        `${API_ROUTES.INSPECTION_TEMPLATE_DETAIL}${templateId}/`
      );
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // Perform Auction Action (CLOSE, etc.)
  performAuctionAction: async (auctionId, actionData) => {
    try {
      const { data } = await apiClient.post(
        `${API_ROUTES.AUCTION_ACTION}${auctionId}/action/`,
        actionData
      );
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },
};