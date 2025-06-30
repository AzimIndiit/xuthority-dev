import { useQuery } from '@tanstack/react-query';
import { MarketSegmentService } from '@/services/marketSegment';
import { useMemo } from 'react';

export const useMarketSegmentOptions = (searchTerm?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['marketSegments', searchTerm],
    queryFn: () => MarketSegmentService.getActiveMarketSegments({ search: searchTerm }),
    staleTime: 5 * 60 * 1000,
  });

  const options = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((item) => ({
      value: item._id,
      label: item.name,
    }));
  }, [data]);

  return { options, isLoading, error };
}; 