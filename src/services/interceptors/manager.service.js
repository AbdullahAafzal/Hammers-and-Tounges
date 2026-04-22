import apiClient from '../api.service';

export const managerService = {
  getAuctions: (params) => apiClient.get('/auctions/', { params }),
  getEvents: (params) => apiClient.get('/events/', { params }),
  createEvent: (data) => apiClient.post('/events/', data),
  updateEvent: (id, data) => apiClient.patch(`/events/${id}/`, data),
  getEventDetails: (id) => apiClient.get(`/events/${id}/`),
};