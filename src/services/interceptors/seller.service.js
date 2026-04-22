import apiClient from '../api.service';

export const sellerService = {
  getMyAuctions: (params) => apiClient.get('/auctions/', { params }),
  createAuction: (data) => apiClient.post('/auctions/', data),
  updateAuction: (id, data) => apiClient.patch(`/auctions/${id}/`, data),
  deleteAuction: (id) => apiClient.delete(`/auctions/${id}/`),
};