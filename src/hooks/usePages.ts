import { useQuery } from '@tanstack/react-query';
import { pagesService } from '@/services/pages';

// Hook to get page by slug
export const usePageBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['page', slug],
    queryFn: () => pagesService.getPageBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 404 errors
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};