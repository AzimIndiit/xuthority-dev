import { api } from './api';

export interface Language {
  _id: string;
  name: string;
  slug: string;
  status: string;
}

export interface LanguageResponse {
  success: boolean;
  data: Language[];
  pagination?: { page: number; limit: number; total: number; pages: number };
}

export const LanguageService = {
  getActiveLanguages: async (params: { search?: string; page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams();
    query.append('page', (params.page || 1).toString());
    query.append('limit', (params.limit || 100).toString());
    if (params.search) query.append('search', params.search);
    const response = await api.get(`/languages/active?${query.toString()}`);
    return response.data;
  },
}; 