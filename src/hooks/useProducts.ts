import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import FileUploadService from '@/services/fileUpload';
import { addProduct, deleteProduct, getMyProducts, fetchProductById, fetchProducts, fetchProductsByCategory, fetchProductBySlug, updateProduct, getUserProductsById, FilterOptions, Product } from '@/services/product';
import toast from 'react-hot-toast';
import { queryClient } from '@/lib/queryClient';

export const queryKeys = {
  products: ['products'] as const,
};

export function useProducts(page: number, limit: number) {
      return useQuery({
      queryKey: ['products', page, limit],
      queryFn: () => fetchProducts(page, limit),

    });
}

export interface PaginatedProducts {
  data: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function useProductsByCategory(
  category: string, 
  subCategory: string, 
  searchQuery: string,
  page: number, 
  limit: number,
  filters?: FilterOptions
) {
  // Create a stable query key that only changes when actual values change
  const queryKey = [
    'products', 
    'category', 
    category, 
    subCategory, 
    searchQuery,
    page, 
    limit,
    filters?.segment,
    filters?.categories?.join(','),
    filters?.industries?.join(','),
    filters?.price?.join(','),
    filters?.sortBy
  ];

  

      return useQuery({
      queryKey,
      queryFn: () => fetchProductsByCategory(category, subCategory, searchQuery, page, limit, filters),
      enabled: !!category && !!subCategory,
    // Cache configuration to prevent unnecessary API calls
    staleTime: 5 * 60 * 1000, // 5 minutes - data is considered fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch when component mounts if data exists
    refetchOnReconnect: false, // Don't refetch when network reconnects
    placeholderData: (previousData) => previousData, // Show previous data while new data is loading
  });
} 

export function useAddProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (product: Product) => {
      let logoUrl = product.logoUrl;
      let mediaUrls = product.mediaUrls || [];

      // Handle logo upload
      if (logoUrl && typeof logoUrl !== "string") {
        const validation = FileUploadService.validateImageFile(logoUrl);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }
        const uploadResponse = await FileUploadService.uploadProfileImage(logoUrl);
        if (!uploadResponse.success) {
          throw new Error(uploadResponse.error?.message || "Failed to upload logo");
        }
        logoUrl = FileUploadService.getFileUrl(uploadResponse.data);
      }

      // Handle media uploads
      const uploadedMediaUrls: string[] = await Promise.all(
        mediaUrls.map(async (item, index) => {
          if (typeof item === "string") return item;
          
          const validation = FileUploadService.validateMediaFile(item);
          if (!validation.isValid) {
            throw new Error(validation.error);
          }
          
          // Show progress for each file
          const res = await FileUploadService.uploadMediaFile(item, (progress) => {
            console.log(`Upload progress for file ${index + 1}: ${progress}%`);
          });
          
          if (!res.success) {
            throw new Error(res.error?.message || "Failed to upload media");
          }
          
          // Use the helper method to get the appropriate URL
          return FileUploadService.getFileUrl(res.data);
        })
      );

      const finalProduct: Product = {
        ...product,
        logoUrl,
        mediaUrls: uploadedMediaUrls,
      };

             const res = await addProduct(finalProduct);
       return { product: res.data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Product creation error:', error);
    },
  });
}

export function useFetchProductById(id: string) {
      return useQuery({
      queryKey: ['product', id],
      queryFn: () => fetchProductById(id),
      enabled: !!id,
    });
}

// export function useUpdateProduct() {
//   return useMutation({
//     mutationFn: async ({ id, product }: { id: string; product: Product }) => {
//       return updateProduct(id, product);
//     },
//   });
// }
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, product }: { id: string; product: Product }) => {
      let logoUrl = product.logoUrl;
      let mediaUrls = product.mediaUrls || [];

      // Handle logo upload
      if (logoUrl && typeof logoUrl !== "string") {
        const validation = FileUploadService.validateImageFile(logoUrl);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }
        const uploadResponse = await FileUploadService.uploadProfileImage(logoUrl);
        if (!uploadResponse.success) {
          throw new Error(uploadResponse.error?.message || "Failed to upload logo");
        }
        logoUrl = FileUploadService.getFileUrl(uploadResponse.data);
      }

      // Handle media uploads
      const uploadedMediaUrls: string[] = await Promise.all(
        mediaUrls.map(async (item, index) => {
          if (typeof item === "string") return item;
          
          const validation = FileUploadService.validateMediaFile(item);
          if (!validation.isValid) {
            throw new Error(validation.error);
          }
          
          // Show progress for each file
          const res = await FileUploadService.uploadMediaFile(item, (progress) => {
            console.log(`Upload progress for file ${index + 1}: ${progress}%`);
          });
          
          if (!res.success) {
            throw new Error(res.error?.message || "Failed to upload media");
          }
          
          // Use the helper method to get the appropriate URL - this fixes the error
          return FileUploadService.getFileUrl(res.data);
        })
      );

      const finalProduct: Product = {
        ...product,
        logoUrl,
        mediaUrls: uploadedMediaUrls,
      };

      const res = await updateProduct(id, finalProduct as any);
      return { product: res.data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
    },
    onError: (error) => {
      console.error('Product update error:', error);
    },
  });
}
export function useProductBySlug(slug: string) {
      return useQuery({
      queryKey: ['product', slug],
      queryFn: () => fetchProductBySlug(slug),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 5,
    enabled: !!slug,
  });
}

export function useDeleteProduct() {
  return useMutation({
    mutationFn: async (id: string) => {
      return deleteProduct(id);
    },
    onSuccess: (data) => {
      toast.success("Product deleted successfully");
      // Invalidate all product-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({ queryKey: ['myProducts'] });
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
    onError: (error: any) => {
      console.error("Product delete error:", error);
      toast.error(error.response.data.message || "Failed to delete product");
    },
  });
}

// Hook for user products by ID with pagination
export function useUserProductsById(userId: string, options?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['userProducts', userId, options],
          queryFn: async () => {
        const response = await getUserProductsById(userId, options);
        if (response.success && response.data) {
          return response;
      }
      throw new Error(response.error?.message || 'Failed to fetch user products');
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Hook for current user's products (my products) with pagination
export function useMyProducts(options?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['myProducts', options],
    queryFn: async () => {
      const response = await getMyProducts(options);
      if (response.success) {
        // The API returns data array at root level, and meta separately
        return {
          data: response.data,
          meta: (response as any).meta
        };
      }
      throw new Error(response.error?.message || 'Failed to fetch my products');
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}