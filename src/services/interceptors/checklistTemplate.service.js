import apiClient from '../api.service';
import { API_ROUTES } from '../../config/api.config';
import { withAuthConfig } from '../../utils/authHeaders';

const base = API_ROUTES.CHECKLIST_TEMPLATES;

const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

export const checklistTemplateService = {
  list: async (params = {}) => {
    const { data } = await apiClient.get(base, withAuthConfig({ params }));
    return normalizeList(data);
  },

  get: async (templateId) => {
    const { data } = await apiClient.get(
      API_ROUTES.CHECKLIST_TEMPLATE_DETAIL(templateId),
      withAuthConfig()
    );
    return data;
  },

  create: async (payload) => {
    const { data } = await apiClient.post(base, payload, withAuthConfig());
    return data;
  },

  update: async (templateId, payload) => {
    const { data } = await apiClient.put(
      API_ROUTES.CHECKLIST_TEMPLATE_DETAIL(templateId),
      payload,
      withAuthConfig()
    );
    return data;
  },

  patch: async (templateId, payload) => {
    const { data } = await apiClient.patch(
      API_ROUTES.CHECKLIST_TEMPLATE_DETAIL(templateId),
      payload,
      withAuthConfig()
    );
    return data;
  },

  delete: async (templateId) => {
    await apiClient.delete(
      API_ROUTES.CHECKLIST_TEMPLATE_DETAIL(templateId),
      withAuthConfig()
    );
  },

  /** Active template for a category, if any */
  getForCategory: async (categoryId) => {
    const list = await checklistTemplateService.list({ category: categoryId });
    const active = list.find((t) => t.is_active !== false);
    return active || list[0] || null;
  },
};
