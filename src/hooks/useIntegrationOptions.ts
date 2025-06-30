import { useQuery } from '@tanstack/react-query';
import { IntegrationService } from '@/services/integration';
import { useMemo } from 'react';

export const useIntegrationOptions = (searchTerm?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['integrations', searchTerm],
    queryFn: () => IntegrationService.getActiveIntegrations({ search: searchTerm }),
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