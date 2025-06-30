import { useMutation, useQuery } from '@tanstack/react-query';
import { addProduct, fetchProducts, Product, fetchProductBySlug, fetchProductById, updateProduct, deleteProduct } from '../services/product';
import FileUploadService from '@/services/fileUpload';
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
  });
}