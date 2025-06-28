import { api } from './api';

export interface Industry {
  _id: string;
  name: string;
  description: string;
  slug: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface IndustryResponse {
  success: boolean;
  data: Industry[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface IndustryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const IndustryService = {
  // Get all active industries
  getActiveIndustries: async (params: IndustryQueryParams = {}): Promise<IndustryResponse> => {
    const queryParams = new URLSearchParams();
    
    // Set default limit to a high number to get all industries at once
    const { page = 1, limit = 100, search } = params;
    
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    if (search) {
      queryParams.append('search', search);
    }

    const response = await api.get(`/industries/active?${queryParams.toString()}`);
    return response.data;
  },

  // Get all industries (including inactive)
  getAllIndustries: async (params: IndustryQueryParams = {}): Promise<IndustryResponse> => {
    const queryParams = new URLSearchParams();
    
    const { page = 1, limit = 100, search } = params;
    
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    if (search) {
      queryParams.append('search', search);
    }

    const response = await api.get(`/industries?${queryParams.toString()}`);
    return response.data;
  },

  // Get industry by ID
  getIndustryById: async (industryId: string): Promise<{ success: boolean; data: Industry }> => {
    const response = await api.get(`/industries/${industryId}`);
    return response.data;
  },

  // Get industry by slug
  getIndustryBySlug: async (slug: string): Promise<{ success: boolean; data: Industry }> => {
    const response = await api.get(`/industries/slug/${slug}`);
    return response.data;
  },
}; 