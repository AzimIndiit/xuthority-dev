import { useQuery } from '@tanstack/react-query';
import { SolutionService } from '@/services/solution';
import { useMemo } from 'react';

export const useSolutionOptions = (searchTerm?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['solutions', searchTerm],
    queryFn: () => SolutionService.getActiveSolutions({ search: searchTerm }),
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