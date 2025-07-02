import api from './api';
import { 
  ResourcesResponse, 
  Resource, 
  Webinar, 
  ResourceFilters, 
  ResourceCategory,
  ResourceCategoriesResponse,
  Blog,
  BlogsResponse
} from '@/types/resource';

export const resourceService = {
  // Get all resources with filtering and pagination
  async getResources(params?: {
    type?: string;
    category?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ResourcesResponse> {
    const response = await api.get('/resources', { params });
    return response.data;
  },

  // Get webinars specifically
  async getWebinars(params?: {
    status?: 'live' | 'on-demand' | 'upcoming';
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ResourcesResponse> {
    const response = await api.get('/resources/webinars', { params });
    return response.data;
  },

  // Get a single webinar by slug
  async getWebinarBySlug(slug: string): Promise<{ success: boolean; data: Webinar }> {
    const response = await api.get(`/resources/webinars/${slug}`);
    return response.data;
  },

  // Get resources by category
  async getResourcesByCategory(category: string, params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ResourcesResponse> {
    const response = await api.get(`/resources/category/${category}`, { params });
    return response.data;
  },

  // Get resource categories - updated to match backend API
  async getResourceCategories(): Promise<ResourceCategoriesResponse> {
    const response = await api.get('/resource-categories/active');
    return response.data;
  },

  // Get all blogs
  async getAllBlogs(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<BlogsResponse> {
    const response = await api.get('/blogs', { params });
    return response.data;
  },

  // Get active blogs
  async getActiveBlogs(): Promise<BlogsResponse> {
    const response = await api.get('/blogs/active');
    return response.data;
  },

  // Get blogs by category
  async getBlogsByCategory(categoryId: string): Promise<BlogsResponse> {
    const response = await api.get(`/blogs/category/${categoryId}`);
    return response.data;
  },

  // Get blog by ID
  async getBlogById(blogId: string): Promise<{ success: boolean; data: Blog }> {
    const response = await api.get(`/blogs/${blogId}`);
    return response.data;
  },

  // Get blog by slug
  async getBlogBySlug(slug: string): Promise<{ success: boolean; data: Blog }> {
    const response = await api.get(`/blogs/slug/${slug}`);
    return response.data;
  },

  // Get blogs by tag
  async getBlogsByTag(tag: string): Promise<BlogsResponse> {
    const response = await api.get(`/blogs/tag/${tag}`);
    return response.data;
  },

  // Get blogs grouped by categories with limit
  async getBlogsGroupedByCategories(limit: number = 6): Promise<{
    success: boolean;
    data: Array<{
      category: ResourceCategory;
      blogs: Blog[];
      totalBlogs: number;
      hasMore: boolean;
    }>;
    message: string;
  }> {
    const response = await api.get(`/blogs/grouped-by-categories?limit=${limit}`);
    return response.data;
  },

  // Search resources
  async searchResources(query: string, filters?: ResourceFilters): Promise<ResourcesResponse> {
    const response = await api.get('/resources/search', { 
      params: { q: query, ...filters } 
    });
    return response.data;
  },

  // Get featured resources
  async getFeaturedResources(type?: string): Promise<ResourcesResponse> {
    const response = await api.get('/resources/featured', { 
      params: { type } 
    });
    return response.data;
  },

  // Track resource view
  async trackResourceView(resourceId: string): Promise<void> {
    await api.post(`/resources/${resourceId}/view`);
  },

  // Get related resources
  async getRelatedResources(resourceId: string, limit = 6): Promise<ResourcesResponse> {
    const response = await api.get(`/resources/${resourceId}/related`, {
      params: { limit }
    });
    return response.data;
  }
};

export default resourceService; 