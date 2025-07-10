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

// Skeleton component for individual user cards
const UserCardSkeleton = () => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="h-3 bg-gray-200 rounded w-24" />
      </div>
    </div>
    <div className="h-10 bg-gray-200 rounded-full w-20" />
  </div>
);

// Skeleton component for the header
const HeaderSkeleton = () => (
  <div className="flex items-center gap-2 mb-6 animate-pulse">
    <div className="block lg:hidden w-6 h-6 bg-gray-200 rounded" />
    <div className="h-7 bg-gray-200 rounded w-24" />
  </div>
);

// Skeleton component for the search bar
const SearchSkeleton = () => (
  <div className="relative mb-6 animate-pulse">
    <div className="w-full h-14 bg-gray-200 rounded-full" />
  </div>
);

// Skeleton component for tabs
const TabsSkeleton = () => (
  <div className="mb-6 animate-pulse">
    <div className="bg-gray-100 p-0 h-12 w-fit rounded-lg flex">
      <div className="h-12 bg-gray-200 rounded w-32 mr-1" />
      <div className="h-12 bg-gray-200 rounded w-32" />
    </div>
  </div>
);

// Skeleton component for user list
const UserListSkeleton = () => (
  <div className="space-y-4">
    {[...Array(8)].map((_, index) => (
      <UserCardSkeleton key={index} />
    ))}
  </div>
);

// Skeleton component for load more button
const LoadMoreSkeleton = () => (
  <div className="text-center pt-4 animate-pulse">
    <div className="h-10 bg-gray-200 rounded w-32 mx-auto" />
  </div>
);

// Complete skeleton for FollowersFollowing page
const FollowersFollowingSkeleton = () => (
  <div className="">
    <HeaderSkeleton />
    <SearchSkeleton />
    <TabsSkeleton />
    <UserListSkeleton />
    <LoadMoreSkeleton />
  </div>
);

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


  // Debounced search term logic
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const effectiveSearchTerm = debouncedSearchTerm && debouncedSearchTerm.length >= 2 ? debouncedSearchTerm : '';

  // Fetch followers
  const {
    data: followersData,
    isLoading: followersLoading,
    error: followersError,
    refetch: refetchFollowers,
  } = useFollowers(userId, followersPage, 10, effectiveSearchTerm);

  // Fetch following
  const {
    data: followingData,
    isLoading: followingLoading,
    error: followingError,
    refetch: refetchFollowing,
  } = useFollowing(userId, followingPage, 10, effectiveSearchTerm);

  const removeFollowerMutation = useRemoveFollower();
  const toggleFollowMutation = useToggleFollow();



const followingDataArray = Array.isArray(followingData) ? followingData : followingData?.data;
const followersDataArray = Array.isArray(followersData) ? followersData : followersData?.data;

  const handleRemoveFollower = async (followerId: string) => {
    if (!currentUserId || currentUserId !== userId) {
      return;
    }

    try {
      await removeFollowerMutation.mutateAsync(followerId);
      toast.success('Follower removed successfully');

      
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
      <div className='flex items-center gap-2 mb-6'> 
      <span className="block lg:hidden" onClick={() => navigate(-1)}>
            {" "}
            <ArrowLeftIcon className="w-6 h-6" />
          </span>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
        
        Followers</h1>
        
      </div>
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
            <UserListSkeleton />
          ) : followersError ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading followers</p>
              <Button onClick={() => refetchFollowers()} className="mt-2">
                Try Again
              </Button>
            </div>
          ):!Array.isArray(followersDataArray) || followersDataArray.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">
                {debouncedSearchTerm ? 'No followers found matching your search' : 'No followers yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {followersDataArray.map((follower) => (
                <div
                  key={follower._id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12 cursor-pointer" onClick={() => navigate(`/public-profile/${follower.slug}`)}>
                      <AvatarImage className='object-cover' src={follower.avatar || ''} alt={follower.name} />
                      <AvatarFallback className="text-sm">
                        {getUserInitials(follower)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {getUserDisplayName(follower)}
                      </h3>
                    </div>
                  </div>
                  
                  {canRemoveFollowers && (
                    <Button
                      onClick={() => handleRemoveFollower(follower._id)}
                      disabled={removeFollowerMutation.isPending}
                      loading={removeFollowerMutation.isPending}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold transition-colors duration-200"
                    >
                      Remove
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
                    loading={followersLoading}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Following Tab Content */}
        <TabsContent value="following" className="mt-0">
          {followingLoading && followingPage === 1 ? (
            <UserListSkeleton />
          ) : followingError ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading following</p>
              <Button onClick={() => refetchFollowing()} className="mt-2">
                Try Again
              </Button>
            </div>
          ) : !Array.isArray(followingDataArray) || followingDataArray.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">
                {debouncedSearchTerm ? 'No following found matching your search' : 'Not following anyone yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {followingDataArray.map((following) => (
                <div
                  key={following._id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12 cursor-pointer" onClick={() => navigate(`/public-profile/${following.slug}`)}>
                      <AvatarImage className='object-cover' src={following.avatar || ''} alt={following.name} />
                      <AvatarFallback className="text-sm">
                        {getUserInitials(following)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {getUserDisplayName(following)}
                      </h3>
                    </div>
                  </div>
                  
                  {canUnfollowUsers && (
                    <Button
                      onClick={() => handleUnfollow(following._id)}
                      disabled={toggleFollowMutation.isPending}
                      loading={toggleFollowMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition-colors duration-200"
                    >
                      Unfollow
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
                    loading={followingLoading}
                  >
                    Load More
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