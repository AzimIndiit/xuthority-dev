import { useQuery } from '@tanstack/react-query';
import { SoftwareService } from '@/services/software';
import { useMemo } from 'react';

export const useSoftwareOptions = (searchTerm?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['softwares', searchTerm],
    queryFn: () => SoftwareService.getActiveSoftwares({ search: searchTerm }),
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