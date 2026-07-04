import apiClient from '../api.service';
import { API_ROUTES } from '../../config/api.config';
import { withAuthConfig } from '../../utils/authHeaders';

export const inspectionService = {
  /** GET /auctions/lots/{lot_id}/inspection-report/ */
  getReportByLot: async (lotId) => {
    const { data } = await apiClient.get(
      API_ROUTES.LOT_INSPECTION_REPORT(lotId),
      withAuthConfig()
    );
    return data;
  },

  /**
   * POST /auctions/manager/inspect/{lot_id}/ (multipart/form-data)
   * @param {number|string} lotId
   * @param {Object} payload
   */
  performManagerInspection: async (lotId, payload) => {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'inspection_images') {
        if (Array.isArray(value)) {
          value.forEach((file) => formData.append('inspection_images', file));
        }
      } else if (key === 'checklist_data') {
        formData.append(key, JSON.stringify(value));
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    const { data } = await apiClient.post(
      `${API_ROUTES.MANAGER_INSPECT}${lotId}/`,
      formData,
      withAuthConfig({ headers: { 'Content-Type': 'multipart/form-data' } })
    );
    return data;
  },
};
