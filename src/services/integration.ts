import { api } from './api';

export interface Integration {
  _id: string;
  name: string;
  slug: string;
  status: string;
}

export interface IntegrationResponse {
  success: boolean;
  data: Integration[];
  pagination?: { page: number; limit: number; total: number; pages: number };
}

export const IntegrationService = {
  getActiveIntegrations: async (params: { search?: string; page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams();
    query.append('page', (params.page || 1).toString());
    query.append('limit', (params.limit || 100).toString());
    if (params.search) query.append('search', params.search);
    const response = await api.get(`/integrations/active?${query.toString()}`);
    return response.data;
  },
}; 