import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import FollowService, {
  FollowListResponse,
  FollowStatsResponse,
  ToggleFollowResponse,
  FollowUser,
} from '@/services/follow';
import useUserStore from '@/store/useUserStore';

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
    select: (data:any) => {
      return data.data
    },
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
    select: (data:any) => {
      return data.data
    },
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
    select: (data:any) => {
      return {
        isFollowing: data.data.isFollowing,
        userId: data.data.userId
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to toggle follow/unfollow
export const useToggleFollow = () => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useUserStore();

  return useMutation<ToggleFollowResponse, Error, string>({
    mutationFn: (userId: string) => FollowService.toggleFollow(userId),
    onSuccess: (data: any, userId) => {
      // Update follow status cache
      const newData = data.data as any
      queryClient.setQueryData(
        followQueryKeys.status(userId),
        { isFollowing: newData.isFollowing, userId }
      );
      queryClient.invalidateQueries({ 
        queryKey:  followQueryKeys.status(userId),
        exact: true 
      });
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

      // Invalidate user profile stats queries (for both users involved)
      // Target user's stats (their follower count changed)
      queryClient.invalidateQueries({ 
        queryKey: ['userProfileStats', userId], 
        exact: true 
      });

      
      // Current user's stats (their following count changed)
      if (currentUser?._id) {
        queryClient.invalidateQueries({ 
          queryKey: ['userProfileStats', currentUser._id], 
          exact: true 
        });
      }
      
      // Invalidate profile stats by slug if available
      queryClient.invalidateQueries({ 
        queryKey: ['userProfileStatsBySlug'], 
        exact: false 
      });

      // Show success message
      const message = newData.action === 'followed' 
        ? `You are now following ${newData?.targetUser?.firstName} ${newData?.targetUser?.lastName}`
        : `You unfollowed ${newData?.targetUser?.firstName} ${newData?.targetUser?.lastName}`;
    
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
  const { user: currentUser } = useUserStore();

  return useMutation<any, Error, string>({
    mutationFn: (userId: string) => FollowService.removeFollower(userId),
    onSuccess: (data, userId) => {
      // Invalidate follow status cache
      queryClient.invalidateQueries({ 
        queryKey: followQueryKeys.status(userId),
        exact: true 
      });
      
      // Invalidate followers cache to refresh the list
      queryClient.invalidateQueries({ 
        queryKey: ['follow', 'followers'], 
        exact: false 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['follow', 'stats'], 
        exact: false 
      });

      // Invalidate user profile stats queries (for both users involved)
      // Target user's stats (their following count changed)
      queryClient.invalidateQueries({ 
        queryKey: ['userProfileStats', userId], 
        exact: true 
      });
      
      // Current user's stats (their follower count changed)
      if (currentUser?._id) {
        queryClient.invalidateQueries({ 
          queryKey: ['userProfileStats', currentUser._id], 
          exact: true 
        });
      }
      
      // Invalidate profile stats by slug if available
      queryClient.invalidateQueries({ 
        queryKey: ['userProfileStatsBySlug'], 
        exact: false 
      });

      // Success toast is handled in the component
    },
    onError: (error) => {
      console.error('Remove follower error:', error);
      // Error toast is handled in the component
    },
  });
}; 