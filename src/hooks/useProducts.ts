import { useMutation, useQuery } from '@tanstack/react-query';
import { addProduct, fetchProducts, Product, fetchProductBySlug, fetchProductById, updateProduct, deleteProduct, fetchProductsByCategory } from '../services/product';
import FileUploadService from '@/services/fileUpload';
import toast from 'react-hot-toast';
import { queryClient } from '@/lib/queryClient';
import { FilterOptions } from '@/services/product';

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
  return useMutation({
    mutationFn: async (product: Product): Promise<{ product: Product }> => {
      let logoUrl: File | string = product.logoUrl;
      let mediaUrls: (string | File)[] = product.mediaUrls;

      // Upload logo if it's a File
      if (logoUrl && typeof logoUrl !== "string") {
        const validation = FileUploadService.validateImageFile(logoUrl);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }
        const uploadResponse = await FileUploadService.uploadProfileImage(logoUrl);
        if (!uploadResponse.success) {
          throw new Error(uploadResponse.error?.message || "Failed to upload logo");
        }
        logoUrl = uploadResponse.data[0].url;
      }

      // Upload media files if any are File instances
      const uploadedMediaUrls: string[] = await Promise.all(
        mediaUrls.map(async (item) => {
          if (typeof item === "string") return item;
          const validation = FileUploadService.validateImageFile(item);
          if (!validation.isValid) {
            throw new Error(validation.error);
          }
          const res = await FileUploadService.uploadProfileImage(item);
          if (!res.success) {
            throw new Error(res.error?.message || "Failed to upload media");
          }
          return res.data[0].url;
        })
      );

      const finalProduct: Product = {
        ...product,
        logoUrl,
        mediaUrls: uploadedMediaUrls,
      };

      const res  = await addProduct(finalProduct);

      return { product: res.data };
    },

    onSuccess: (data) => {
      toast.success("Product added successfully");
      queryClient.setQueryData(queryKeys.products, data.product);
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
    },

    onError: (error: any) => {
      console.error("Product add error:", error);
      toast.error(error.response.data.message || "Failed to add product");
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
  return useMutation({
    mutationFn: async ({id,product}: {id: string, product: Product}): Promise<{ product: Product }> => {
      let logoUrl: File | string = product.logoUrl;
      let mediaUrls: (string | File)[] = product.mediaUrls;

      // Upload logo if it's a File
      if (logoUrl && typeof logoUrl !== "string") {
        const validation = FileUploadService.validateImageFile(logoUrl);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }
        const uploadResponse = await FileUploadService.uploadProfileImage(logoUrl);
        if (!uploadResponse.success) {
          throw new Error(uploadResponse.error?.message || "Failed to upload logo");
        }
        logoUrl = uploadResponse.data[0].url;
      }

      // Upload media files if any are File instances
      const uploadedMediaUrls: string[] = await Promise.all(
        mediaUrls.map(async (item) => {
          if (typeof item === "string") return item;
          const validation = FileUploadService.validateImageFile(item);
          if (!validation.isValid) {
            throw new Error(validation.error);
          }
          const res = await FileUploadService.uploadProfileImage(item);
          if (!res.success) {
            throw new Error(res.error?.message || "Failed to upload media");
          }
          return res.data[0].url;
        })
      );

      const finalProduct: Product = {
        ...product,
        logoUrl,
        mediaUrls: uploadedMediaUrls,
      };

      const res  = await updateProduct(id,finalProduct as any);

      return { product: res.data };
    },

    onSuccess: (data) => {
      toast.success("Product updated successfully");
      queryClient.setQueryData(queryKeys.products, data.product);
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
    },

    onError: (error: any) => {
      console.error("Product update error:", error);
      toast.error(error.response.data.message || "Failed to update product");
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
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
    },
    onError: (error: any) => {
      console.error("Product delete error:", error);
      toast.error(error.response.data.message || "Failed to delete product");
    },
  });
}