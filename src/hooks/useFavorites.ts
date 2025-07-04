import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import FavoriteService, { FavoriteListsResponse, FavoriteListProductsResponse, FavoriteStatusResponse } from '@/services/favorites';
import { useToast } from './useToast';

// Query keys for favorites
export const favoriteQueryKeys = {
  all: ['favorites'] as const,
  lists: () => [...favoriteQueryKeys.all, 'lists'] as const,
  listProducts: (listName: string) => [...favoriteQueryKeys.all, 'listProducts', listName] as const,
  status: (productId: string) => [...favoriteQueryKeys.all, 'status', productId] as const,
};

/**
 * Hook to get user's favorite lists
 */
export const useFavoriteLists = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery<FavoriteListsResponse, Error>({
    queryKey: [...favoriteQueryKeys.lists(), params],
    queryFn: () => FavoriteService.getUserFavoriteLists(params),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get products in a specific favorite list
 */
export const useFavoriteListProducts = (
  listName: string,
  params?: {
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'name' | 'avgRating';
    sortOrder?: 'asc' | 'desc';
  }
) => {
  return useQuery<FavoriteListProductsResponse, Error>({
    queryKey: [...favoriteQueryKeys.listProducts(listName), params],
    queryFn: () => FavoriteService.getFavoriteListProducts(listName, params),
    enabled: !!listName,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to check if product is in user's favorites
 */
export const useFavoriteStatus = (productId: string) => {
  return useQuery<FavoriteStatusResponse, Error>({
    queryKey: favoriteQueryKeys.status(productId),
    queryFn: () => FavoriteService.checkIfFavorite(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to add product to favorites
 */
export const useAddToFavorites = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ productId, listName }: { productId: string; listName?: string }) =>
      FavoriteService.addToFavorites(productId, listName),
    onSuccess: (data, variables) => {
      toast.success('Product added to favorites!');
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: favoriteQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: favoriteQueryKeys.status(variables.productId) });
      
      if (variables.listName) {
        queryClient.invalidateQueries({ 
          queryKey: favoriteQueryKeys.listProducts(variables.listName) 
        });
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to add to favorites';
      toast.error(message);
    },
  });
};

/**
 * Hook to remove product from favorites
 */
export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ productId, listName }: { productId: string; listName?: string }) =>
      FavoriteService.removeFromFavorites(productId, listName),
    onSuccess: (data, variables) => {
      toast.success('Product removed from favorites!');
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: favoriteQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: favoriteQueryKeys.status(variables.productId) });
      
      if (variables.listName) {
        queryClient.invalidateQueries({ 
          queryKey: favoriteQueryKeys.listProducts(variables.listName) 
        });
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to remove from favorites';
      toast.error(message);
    },
  });
};

/**
 * Hook to create a new favorite list
 */
export const useCreateFavoriteList = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (listName: string) => FavoriteService.createFavoriteList(listName),
    onSuccess: () => {
      toast.success('Favorite list created successfully!');
      queryClient.invalidateQueries({ queryKey: favoriteQueryKeys.lists() });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to create list';
      toast.error(message);
    },
  });
};

/**
 * Hook to rename a favorite list
 */
export const useRenameFavoriteList = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ listName, newListName }: { listName: string; newListName: string }) =>
      FavoriteService.renameFavoriteList(listName, newListName),
    onSuccess: (data, variables) => {
      toast.success('List renamed successfully!');
      
      // Invalidate queries for the old and new list names
      queryClient.invalidateQueries({ queryKey: favoriteQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: favoriteQueryKeys.listProducts(variables.listName) });
      queryClient.invalidateQueries({ queryKey: favoriteQueryKeys.listProducts(variables.newListName) });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to rename list';
      toast.error(message);
    },
  });
};

/**
 * Hook to delete a favorite list
 */
export const useDeleteFavoriteList = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (listName: string) => FavoriteService.deleteFavoriteList(listName),
    onSuccess: (data, listName) => {
      toast.success('List deleted successfully!');
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: favoriteQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: favoriteQueryKeys.listProducts(listName) });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to delete list';
      toast.error(message);
    },
  });
};

/**
 * Hook to toggle favorite status (add/remove)
 */
export const useToggleFavorite = () => {
  const addMutation = useAddToFavorites();
  const removeMutation = useRemoveFromFavorites();

  return useMutation({
    mutationFn: async ({ 
      productId, 
      listName = 'Favorite List', 
      isFavorite 
    }: { 
      productId: string; 
      listName?: string; 
      isFavorite: boolean;
    }) => {
      if (isFavorite) {
        return removeMutation.mutateAsync({ productId, listName });
      } else {
        return addMutation.mutateAsync({ productId, listName });
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to update favorites';
      // Don't show toast here as individual mutations handle it
    },
  });
}; 