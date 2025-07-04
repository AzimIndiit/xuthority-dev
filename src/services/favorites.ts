import api from './api';

export interface FavoriteProduct {
  favoriteId: string;
  productId: string;
  name: string;
  slug: string;
  logoUrl?: string;
  avgRating: number;
  totalReviews: number;
  addedAt: string;
  notes?: string;
  brandColors?: string;
}

export interface FavoriteList {
  listName: string;
  products: FavoriteProduct[];
  totalProducts: number;
  lastUpdated: string;
  isDefault: boolean;
}

export interface FavoriteListsResponse {
  lists: FavoriteList[];
  totalLists: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface FavoriteListProductsResponse {
  products: FavoriteProduct[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface FavoriteStatusResponse {
  isFavorite: boolean;
  lists: string[];
}

/**
 * Add product to favorites
 */
export const addToFavorites = async (productId: string, listName: string = 'Favorite List') => {
  const response = await api.post('/favorites', {
    productId,
    listName,
  });
  return response.data;
};

/**
 * Remove product from favorites
 */
export const removeFromFavorites = async (productId: string, listName?: string) => {
  const params = listName ? { listName } : {};
  const response = await api.delete(`/favorites/${productId}`, { params });
  return response.data;
};

/**
 * Get user's favorite lists
 */
export const getUserFavoriteLists = async (params: {
  page?: number;
  limit?: number;
  search?: string;
} = {}): Promise<FavoriteListsResponse> => {
  const response = await api.get('/favorites/lists', { params });
  return response.data.data;
};

/**
 * Get products in a specific favorite list
 */
export const getFavoriteListProducts = async (
  listName: string,
  params: {
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'name' | 'avgRating';
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<FavoriteListProductsResponse> => {
  const response = await api.get(`/favorites/lists/${encodeURIComponent(listName)}/products`, { params });
  return response.data.data;
};

/**
 * Create a new favorite list
 */
export const createFavoriteList = async (listName: string) => {
  const response = await api.post('/favorites/lists', { listName });
  return response.data;
};

/**
 * Rename a favorite list
 */
export const renameFavoriteList = async (listName: string, newListName: string) => {
  const response = await api.put(`/favorites/lists/${encodeURIComponent(listName)}`, { newListName });
  return response.data;
};

/**
 * Delete a favorite list
 */
export const deleteFavoriteList = async (listName: string) => {
  const response = await api.delete(`/favorites/lists/${encodeURIComponent(listName)}`);
  return response.data;
};

/**
 * Check if product is in user's favorites
 */
export const checkIfFavorite = async (productId: string): Promise<FavoriteStatusResponse> => {
  const response = await api.get(`/favorites/check/${productId}`);
  return response.data.data;
};

const FavoriteService = {
  addToFavorites,
  removeFromFavorites,
  getUserFavoriteLists,
  getFavoriteListProducts,
  createFavoriteList,
  renameFavoriteList,
  deleteFavoriteList,
  checkIfFavorite,
};

export default FavoriteService; 