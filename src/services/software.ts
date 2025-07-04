import { api } from './api';

export interface Software {
  _id: string;
  name: string;
  slug: string;
  status: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl?: string;
  websiteUrl?: string;
  avgRating: number;
  totalReviews: number;
  views: number;
  likes: number;
  status: string;
  isActive: string;
  isFeatured: boolean;
  userId: {
    firstName: string;
    lastName: string;
    companyName: string;
    email: string;
  };
  industries: Array<{
    name: string;
    slug: string;
    status: string;
  }>;
  languages: Array<{
    name: string;
    slug: string;
    status: string;
  }>;
  integrations: Array<{
    name: string;
    image: string;
    status: string;
  }>;
  marketSegment: Array<{
    name: string;
    slug: string;
    status: string;
  }>;
  whoCanUse: Array<{
    name: string;
    slug: string;
    status: string;
  }>;
  solutionIds: Array<{
    name: string;
    slug: string;
    status: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface FeaturedSoftware {
  software: Software & {
    createdBy: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  topProducts: Product[];
  productCount: number;
  hasMinimumProducts: boolean;
}

export interface FeaturedSoftwaresResponse {
  success: boolean;
  data: FeaturedSoftware[];
  message: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  meta: {
    totalSoftwaresWithProducts: number;
    productsPerSoftware: number;
    minRating: number;
    sortBy: string;
    sortOrder: string;
  };
}

export interface SoftwareResponse {
  success: boolean;
  data: Software[];
  pagination?: { page: number; limit: number; total: number; pages: number };
}

export interface FeaturedSoftwaresParams {
  page?: number;
  limit?: number;
  productsPerSoftware?: number;
  minRating?: number;
  sortBy?: 'createdAt' | 'avgRating' | 'totalReviews' | 'productCount' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export const SoftwareService = {
  getActiveSoftwares: async (params: { search?: string; page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams();
    query.append('page', (params.page || 1).toString());
    query.append('limit', (params.limit || 100).toString());
    if (params.search) query.append('search', params.search);
    const response = await api.get(`/software/active?${query.toString()}`);
    return response.data;
  },

  getFeaturedSoftwaresWithProducts: async (params: FeaturedSoftwaresParams = {}): Promise<FeaturedSoftwaresResponse> => {
    const query = new URLSearchParams();
    
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.productsPerSoftware) query.append('productsPerSoftware', params.productsPerSoftware.toString());
    if (params.minRating) query.append('minRating', params.minRating.toString());
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);

    const response = await api.get(`/software/featured-with-products?${query.toString()}`);
    return response.data;
  }
}; 