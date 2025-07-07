import { useQuery } from '@tanstack/react-query';
import { getFeaturedSoftwares } from '@/services/software';

interface UseFeaturedSoftwaresOptions {
  limit?: number;
  productsPerSoftware?: number;
  minRating?: number;
  sortBy?: string;
  sortOrder?: string;
}

export const useFeaturedSoftwares = (options: UseFeaturedSoftwaresOptions = {}) => {
  const {
    limit = 10,
    productsPerSoftware = 4,
    minRating = 0,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['featured-softwares', limit, productsPerSoftware, minRating, sortBy, sortOrder],
    queryFn: () => getFeaturedSoftwares({
      page: 1,
      limit,
      productsPerSoftware,
      minRating,
      sortBy,
      sortOrder
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    featuredSoftwares: data?.data || [],
    pagination: data?.pagination || null,
    meta: data?.meta || null,
    isLoading,
    isError,
    error,
    hasData: !isLoading && !isError && data?.data && data.data.length > 0
  };
};

interface UsePopularSoftwaresOptions {
  limit?: number;
  productsPerSoftware?: number;
  minRating?: number;
  sortBy?: string;
  sortOrder?: string;
}

export const usePopularSoftwares = (options: UsePopularSoftwaresOptions = {}) => {
  const {
    limit = 10,
    productsPerSoftware = 4,
    minRating = 0,
    sortBy = 'totalReviews',
    sortOrder = 'desc'
  } = options;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['popular-softwares', limit, productsPerSoftware, minRating, sortBy, sortOrder],
    queryFn: () => getFeaturedSoftwares({
      page: 1,
      limit,
      productsPerSoftware,
      minRating,
      sortBy,
      sortOrder,
      endpoint: 'popular-with-products' // This will be used to call the popular endpoint
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    popularSoftwares: data?.data || [],
    pagination: data?.pagination || null,
    meta: data?.meta || null,
    isLoading,
    isError,
    error,
    hasData: !isLoading && !isError && data?.data && data.data.length > 0
  };
}; 