import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { UserRoleService } from '@/services/userRole';
import { useMemo } from 'react';

export const useUserRoleOptions = (searchTerm?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['userRoles', searchTerm],
    queryFn: () => UserRoleService.getActiveUserRoles({ search: searchTerm }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
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