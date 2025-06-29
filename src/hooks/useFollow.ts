import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import FollowService, {
  FollowListResponse,
  FollowStatsResponse,
  ToggleFollowResponse,
  FollowUser,
} from '@/services/follow';

// Query keys for follow-related queries
export const followQueryKeys = {
  followers: (userId: string, page: number, limit: number, search: string) => 
    ['follow', 'followers', userId, page, limit, search],
  following: (userId: string, page: number, limit: number, search: string) => 
    ['follow', 'following', userId, page, limit, search],
  stats: (userId: string) => ['follow', 'stats', userId],
  status: (userId: string) => ['follow', 'status', userId],
};

// Hook to get user's followers
export const useFollowers = (
  userId: string,
  page: number = 1,
  limit: number = 10,
  search: string = ''
) => {
  return useQuery<FollowListResponse>({
    queryKey: followQueryKeys.followers(userId, page, limit, search),
    queryFn: () => FollowService.getFollowers(userId, page, limit, search),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to get user's following
export const useFollowing = (
  userId: string,
  page: number = 1,
  limit: number = 10,
  search: string = ''
) => {
  return useQuery<FollowListResponse>({
    queryKey: followQueryKeys.following(userId, page, limit, search),
    queryFn: () => FollowService.getFollowing(userId, page, limit, search),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to get follow statistics
export const useFollowStats = (userId: string) => {
  return useQuery<FollowStatsResponse>({
    queryKey: followQueryKeys.stats(userId),
    queryFn: () => FollowService.getFollowStats(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get follow status
export const useFollowStatus = (userId: string) => {
  return useQuery<{ isFollowing: boolean; userId: string }>({
    queryKey: followQueryKeys.status(userId),
    queryFn: () => FollowService.getFollowStatus(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to toggle follow/unfollow
export const useToggleFollow = () => {
  const queryClient = useQueryClient();

  return useMutation<ToggleFollowResponse, Error, string>({
    mutationFn: (userId: string) => FollowService.toggleFollow(userId),
    onSuccess: (data, userId) => {
      // Update follow status cache
      queryClient.setQueryData(
        followQueryKeys.status(userId),
        { isFollowing: data.isFollowing, userId }
      );

      // Invalidate related caches
      queryClient.invalidateQueries({ 
        queryKey: ['follow', 'followers'], 
        exact: false 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['follow', 'following'], 
        exact: false 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['follow', 'stats'], 
        exact: false 
      });

      // Show success message
      const message = data.action === 'followed' 
        ? `You are now following ${data.targetUser.firstName} ${data.targetUser.lastName}`
        : `You unfollowed ${data.targetUser.firstName} ${data.targetUser.lastName}`;
      
      toast.success(message);
    },
    onError: (error) => {
      console.error('Toggle follow error:', error);
      toast.error(error.message || 'Failed to update follow status');
    },
  });
};

// Hook to remove follower
export const useRemoveFollower = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string>({
    mutationFn: (userId: string) => FollowService.removeFollower(userId),
    onSuccess: (data, userId) => {
      // Invalidate followers cache to refresh the list
      queryClient.invalidateQueries({ 
        queryKey: ['follow', 'followers'], 
        exact: false 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['follow', 'stats'], 
        exact: false 
      });

      toast.success('Follower removed successfully');
    },
    onError: (error) => {
      console.error('Remove follower error:', error);
      toast.error(error.message || 'Failed to remove follower');
    },
  });
}; 