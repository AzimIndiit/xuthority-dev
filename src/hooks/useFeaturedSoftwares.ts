import { useQuery } from '@tanstack/react-query';
import { SoftwareService, FeaturedSoftwaresParams } from '@/services/software';

export const useFeaturedSoftwares = (params: FeaturedSoftwaresParams = {}) => {
  const {
    page = 1,
    limit = 20,
    productsPerSoftware = 4,
    minRating = 0,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = params;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['featured-softwares', page, limit, productsPerSoftware, minRating, sortBy, sortOrder],
    queryFn: () => SoftwareService.getFeaturedSoftwaresWithProducts({
      page,
      limit,
      productsPerSoftware,
      minRating,
      sortBy,
      sortOrder
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    featuredSoftwares: data?.data || [],
    pagination: data?.pagination,
    meta: data?.meta,
    isLoading,
    error,
    refetch,
    hasData: data?.data && data.data.length > 0
  };
}; 