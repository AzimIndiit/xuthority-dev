import { useQuery } from '@tanstack/react-query';
import { LanguageService } from '@/services/language';
import { useMemo } from 'react';

export const useLanguageOptions = (searchTerm?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['languages', searchTerm],
    queryFn: () => LanguageService.getActiveLanguages({ search: searchTerm }),
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