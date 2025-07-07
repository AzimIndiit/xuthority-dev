import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from './useToast';
import * as badgeService from '@/services/badge';
import { queryClient } from '@/lib/queryClient';

const QUERY_KEYS = {
  userBadges: ['userBadges'],
  allBadges: ['allBadges'],
};

export const useUserBadges = () => {
  return useQuery({
    queryKey: QUERY_KEYS.userBadges,
    queryFn: badgeService.getUserBadges,
  });
};

export const useAllBadges = () => {
  return useQuery({
    queryKey: QUERY_KEYS.allBadges,
    queryFn: badgeService.getAllBadges,
  });
};

export const useRequestBadge = () => {
  const { success, error } = useToast();

  return useMutation({
    mutationFn: badgeService.requestBadge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userBadges });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.allBadges });
      success('Badge request submitted successfully');
    },
    onError: (err: any) => {
      error(err.response?.data?.error?.message || 'Failed to request badge');
    },
  });
}; 