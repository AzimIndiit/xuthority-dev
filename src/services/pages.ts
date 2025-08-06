import { api } from './api';

export interface Page {
  _id: string;
  name: string;
  slug: string;
  content: string;
  isSystemPage: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PageResponse {
  success: boolean;
  data: Page;
}

export const pagesService = {
  // Get page by slug
  getPageBySlug: async (slug: string): Promise<PageResponse> => {
    const response = await api.get(`/pages/${slug}`);
    return response.data;
  },
};