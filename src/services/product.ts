import { ApiService, ApiResponse } from './api';

export interface Product {
  _id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  mediaUrls?: string[];
  description: string;
  avgRating: number;
  totalReviews: number;
  users?: string;
  industries?: string[];
  marketSegment?: string[];
  features?: string[];
  whoCanUse?: string[];
  softwareIds?: string[];
  solutionIds?: string[];
  integrations?: string[];
  languages?: string[];
  brandColors?: string;
  userId?:any;
  pricing?: {
    price: number;
    currency: string;
    features: string[];
  }[];
  

}

export interface PaginatedProducts {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export async function fetchProducts(page = 1, limit = 6): Promise<ApiResponse<PaginatedProducts>> {
  return ApiService.get<PaginatedProducts>(`/products?page=${page}&limit=${limit}`);
}

export async function addProduct(product: any): Promise<ApiResponse<Product>> {
  return ApiService.post('/products', product);
}

export async function fetchProductBySlug(slug: string): Promise<ApiResponse<Product>> {
  return ApiService.get<Product>(`/products/slug/${slug}`);
} 

export async function fetchProductById(id: string): Promise<ApiResponse<Product>> {
  return ApiService.get<Product>(`/products/${id}`);
}

export interface FilterOptions {
  segment?: string;
  categories?: string[];
  industries?: string[];
  price?: [number, number];
  sortBy?: string;
  sortOrder?: string;
}

export async function fetchProductsByCategory(
  category: string, 
  subCategory: string, 
  searchQuery: string,
  page = 1, 
  limit = 10,
  filters?: FilterOptions
): Promise<ApiResponse<PaginatedProducts>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });

  if (filters) {
    if (filters.segment && filters.segment !== 'all') {
      params.append('segment', filters.segment);
    }
    if (filters.categories && filters.categories.length > 0) {
      params.append('categories', filters.categories.join(','));
    }
    if (filters.industries && filters.industries.length > 0) {
      params.append('industries', filters.industries.join(','));
    }
    if (filters.price) {
      params.append('minPrice', filters.price[0].toString());
      params.append('maxPrice', filters.price[1].toString());
    }
    if (filters.sortBy) {
      // Handle custom sort values
      if (filters.sortBy === 'ratings-desc') {
        params.append('sortBy', 'avgRating');
        params.append('sortOrder', 'desc');
      } else if (filters.sortBy === 'ratings-asc') {
        params.append('sortBy', 'avgRating');
        params.append('sortOrder', 'asc');
      } else if (filters.sortBy === 'pricing-desc') {
        params.append('sortBy', 'pricing');
        params.append('sortOrder', 'desc');
      } else if (filters.sortBy === 'pricing-asc') {
        params.append('sortBy', 'pricing');
        params.append('sortOrder', 'asc');
      } else if (filters.sortBy === 'reviewCounts-desc') {
        params.append('sortBy', 'totalReviews');
        params.append('sortOrder', 'desc');
      } else if (filters.sortBy === 'reviewCounts-asc') {
        params.append('sortBy', 'totalReviews');
        params.append('sortOrder', 'asc');
      }
    }
  }

  return ApiService.get<PaginatedProducts>(`/products/category/${category}/${subCategory}?${params.toString()}&search=${searchQuery}`);
}

export async function updateProduct(id: string, product: any): Promise<ApiResponse<Product>> {
  return ApiService.put(`/products/${id}`, product);
}

export async function deleteProduct(id: string): Promise<ApiResponse<any>> {
  return ApiService.delete(`/products/${id}`);
}