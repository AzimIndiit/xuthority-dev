import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, Search } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useFollowers, useFollowing, useRemoveFollower, useToggleFollow } from '@/hooks/useFollow';
import { getUserInitials, getUserDisplayName } from '@/utils/userHelpers';
import { formatNumber } from '@/utils/formatNumber';
import useDebounce from '@/hooks/useDebounce';
import { useToast } from '@/hooks/useToast';
import { Input } from '../ui/input';
import { useNavigate } from 'react-router-dom';

interface FollowersFollowingProps {
  userId: string;
  currentUserId?: string;
  activeTab?: 'followers' | 'following';
  onTabChange?: (tab: 'followers' | 'following') => void;
  showRemoveButton?: boolean;
  className?: string;
}

const FollowersFollowing: React.FC<FollowersFollowingProps> = ({
  userId,
  currentUserId,
  activeTab = 'followers',
  onTabChange,
  showRemoveButton = false,
  className,
}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [followersPage, setFollowersPage] = useState(1);
  const [followingPage, setFollowingPage] = useState(1);
  const [allFollowers, setAllFollowers] = useState<any[]>([]);
  const [allFollowing, setAllFollowing] = useState<any[]>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch followers
  const {
    data: followersData,
    isLoading: followersLoading,
    error: followersError,
    refetch: refetchFollowers,
  } = useFollowers(userId, followersPage, 10, debouncedSearchTerm);

  // Fetch following
  const {
    data: followingData,
    isLoading: followingLoading,
    error: followingError,
    refetch: refetchFollowing,
  } = useFollowing(userId, followingPage, 10, debouncedSearchTerm);

  const removeFollowerMutation = useRemoveFollower();
  const toggleFollowMutation = useToggleFollow();

  // Update followers list when data changes
  useEffect(() => {
    if (followersData?.data) {
      const newFollowers = Array.isArray(followersData.data) ? followersData.data : [];
      if (followersPage === 1 || debouncedSearchTerm) {
        setAllFollowers(newFollowers);
      } else {
        setAllFollowers(prev => {
          const currentData = Array.isArray(prev) ? prev : [];
          return [...currentData, ...newFollowers];
        });
      }
    }
  }, [followersData, followersPage, debouncedSearchTerm]);

  // Update following list when data changes
  useEffect(() => {
    if (followingData?.data) {
      const newFollowing = Array.isArray(followingData.data) ? followingData.data : [];
      if (followingPage === 1 || debouncedSearchTerm) {
        setAllFollowing(newFollowing);
      } else {
        setAllFollowing(prev => {
          const currentData = Array.isArray(prev) ? prev : [];
          return [...currentData, ...newFollowing];
        });
      }
    }
  }, [followingData, followingPage, debouncedSearchTerm]);

  // Reset pages when search term changes
  useEffect(() => {
    setFollowersPage(1);
    setFollowingPage(1);
    setAllFollowers([]);
    setAllFollowing([]);
  }, [debouncedSearchTerm]);

  const handleRemoveFollower = async (followerId: string) => {
    if (!currentUserId || currentUserId !== userId) return;

    try {
      await removeFollowerMutation.mutateAsync(followerId);
      toast.success('Follower removed successfully');
      
      // Remove from local state
      setAllFollowers(prev => {
        const currentData = Array.isArray(prev) ? prev : [];
        return currentData.filter(follower => follower._id !== followerId);
      });
      
      // Refetch to ensure consistency
      refetchFollowers();
    } catch (error) {
      console.error('Error removing follower:', error);
      toast.error('Failed to remove follower');
    }
  };

  const handleUnfollow = async (userId: string) => {
    if (!currentUserId) return;

    try {
      await toggleFollowMutation.mutateAsync(userId);
      
      // Remove from local state immediately
      setAllFollowing(prev => {
        const currentData = Array.isArray(prev) ? prev : [];
        return currentData.filter(following => following._id !== userId);
      });
      
      // Refetch to ensure consistency
      refetchFollowing();
    } catch (error) {
      console.error('Error unfollowing user:', error);
      toast.error('Failed to unfollow user');
    }
  };

  const handleLoadMoreFollowers = () => {
    setFollowersPage(prev => prev + 1);
  };

  const handleLoadMoreFollowing = () => {
    setFollowingPage(prev => prev + 1);
  };

  const canRemoveFollowers = currentUserId === userId;
  const canUnfollowUsers = currentUserId === userId;
  const hasMoreFollowers = followersData?.pagination && followersPage < followersData.pagination.pages;
  const hasMoreFollowing = followingData?.pagination && followingPage < followingData.pagination.pages;

  const handleTabChange = (value: string) => {
    const newTab = value as 'followers' | 'following';
    onTabChange?.(newTab);
  };

  return (
    <div className="">
       
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search user or products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-gray-100 p-0 h-auto mb-6 w-fit ">
          <TabsTrigger 
            value="followers"
            onClick={() => navigate('/profile/followers')}
            className="cursor-pointer data-[state=active]:bg-red-600 data-[state=active]:text-white  data-[state=inactive]:text-gray-900 px-12 py-3 data-[state=active]:rounded-md  text-base font-medium transition-all duration-200 border-0 shadow-none"
          >
            Followers
          </TabsTrigger>
          <TabsTrigger 
            value="following"
            onClick={() => navigate('/profile/following')}
            className="cursor-pointer data-[state=active]:bg-red-600 data-[state=active]:text-white  data-[state=inactive]:text-gray-900 px-12 py-3 data-[state=active]:rounded-md  text-base font-medium transition-all duration-200 border-0 shadow-none"
          >
            Following
          </TabsTrigger>
        </TabsList>

        {/* Followers Tab Content */}
        <TabsContent value="followers" className="mt-0">
          {followersLoading && followersPage === 1 ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading followers...</p>
            </div>
          ) : followersError ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading followers</p>
              <Button onClick={() => refetchFollowers()} className="mt-2">
                Try Again
              </Button>
            </div>
          ) : !Array.isArray(allFollowers) || allFollowers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">
                {debouncedSearchTerm ? 'No followers found matching your search' : 'No followers yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {allFollowers.map((follower) => (
                <div
                  key={follower._id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center space-x-4 w-full">
                    <Avatar className="w-12 h-12" onClick={() => navigate(`/public-profile/${follower.slug}`)}>
                      <AvatarImage  className='object-cover'     src={follower.avatar || ''} alt={follower.name} />
                      <AvatarFallback className="text-sm">
                        {getUserInitials(follower)}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex items-center gap-2 justify-between w-full'>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {getUserDisplayName(follower)}
                      </h3>
                      <Button disabled={removeFollowerMutation.isPending} onClick={() => handleRemoveFollower(follower._id)} className="h-8 bg-red-600 hover:bg-red-700 text-white hover:text-white  py-2  font-semibold transition-colors duration-200 !w-fit" variant="outline">{removeFollowerMutation.isPending ? 'Removing...' : 'Remove'}</Button>
                    </div>
                  </div>
                  {canRemoveFollowers && (
                    <Button
                      onClick={() => handleRemoveFollower(follower._id)}
                      disabled={removeFollowerMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition-colors duration-200"
                    >
                      {removeFollowerMutation.isPending ? 'Removing...' : 'Remove'}
                    </Button>
                  )}
                </div>
              ))}

              {hasMoreFollowers && (
                <div className="text-center pt-4">
                  <Button
                    onClick={handleLoadMoreFollowers}
                    disabled={followersLoading}
                    variant="outline"
                    className="px-8 py-2"
                  >
                    {followersLoading ? 'Loading...' : 'Load More'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Following Tab Content */}
        <TabsContent value="following" className="mt-0">
          {followingLoading && followingPage === 1 ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading following...</p>
            </div>
          ) : followingError ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading following</p>
              <Button onClick={() => refetchFollowing()} className="mt-2">
                Try Again
              </Button>
            </div>
          ) : !Array.isArray(allFollowing) || allFollowing.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">
                {debouncedSearchTerm ? 'No following found matching your search' : 'Not following anyone yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {allFollowing.map((following) => (
                <div
                  key={following._id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center space-x-4 w-full">
                    <Avatar className="w-12 h-12" onClick={() => navigate(`/public-profile/${following.slug}`)}>
                      <AvatarImage className='object-cover' src={following.avatar || ''} alt={following.name} />
                      <AvatarFallback className="text-sm">
                        {getUserInitials(following)}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex items-center gap-2 justify-between w-full '>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {getUserDisplayName(following)}
                      </h3>
                      <Button disabled={toggleFollowMutation.isPending} onClick={() => handleUnfollow(following._id)} className="h-8 bg-blue-600 hover:bg-blue-700 text-white hover:text-white  py-2  font-semibold transition-colors duration-200 !w-fit" variant="outline">{toggleFollowMutation.isPending ? 'Unfollowing...' : 'Unfollow'}</Button>
                    </div>
                  </div>
                  {canUnfollowUsers && (
                    <Button
                      onClick={() => handleUnfollow(following._id)}
                      disabled={toggleFollowMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition-colors duration-200"
                    >
                      {toggleFollowMutation.isPending ? 'Unfollowing...' : 'Unfollow'}
                    </Button>
                  )}
                </div>
              ))}

              {hasMoreFollowing && (
                <div className="text-center pt-4">
                  <Button
                    onClick={handleLoadMoreFollowing}
                    disabled={followingLoading}
                    variant="outline"
                    className="px-8 py-2"
                  >
                    {followingLoading ? 'Loading...' : 'Load More'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FollowersFollowing; 