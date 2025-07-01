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

export async function fetchProductsByCategory(category: string, subCategory: string, page = 1, limit = 10): Promise<ApiResponse<PaginatedProducts>> {
  return ApiService.get<PaginatedProducts>(`/products/category/${category}/${subCategory}?page=${page}&limit=${limit}`);
}

export async function updateProduct(id: string, product: any): Promise<ApiResponse<Product>> {
  return ApiService.put(`/products/${id}`, product);
}

export async function deleteProduct(id: string): Promise<ApiResponse<any>> {
  return ApiService.delete(`/products/${id}`);
}