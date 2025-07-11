import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {  HelpCircle, Star as StarIcon, Twitter, Linkedin } from 'lucide-react';
import { formatNumber } from '@/utils/formatNumber';
import { getTruncatedDisplayName, getUserDisplayName, getUserInitials } from '@/utils/userHelpers';
import { usePublicProfileBySlug, useUserProfileStats } from '@/hooks/useAuth';
import { useFollowStatus, useToggleFollow } from '@/hooks/useFollow';
import { useToast } from '@/hooks/useToast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import UserReviews from './UserReviews';
import UserProducts from './UserProducts';
import useUserStore from '@/store/useUserStore';
import useUIStore from '@/store/useUIStore';

// Skeleton loader component for public profile
const PublicProfileSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-18 gap-4 lg:gap-8">
          {/* Left Sidebar - Profile Info Skeleton */}
          <div className="sm:col-span-8 lg:col-span-6 xl:col-span-5">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="">
                {/* Profile Picture and Stats Skeleton */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    {/* Avatar Skeleton */}
                    <div className="h-16 w-16 bg-gray-200 rounded-full animate-pulse" />
                    
                    {/* Followers/Following Stats Skeleton */}
                    <div className="flex space-x-6 mt-3 mb-1">
                      <div className="text-center">
                        <div className="h-5 w-12 bg-gray-200 rounded animate-pulse mb-1" />
                        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                      </div>
                      <div className="text-center">
                        <div className="h-5 w-12 bg-gray-200 rounded animate-pulse mb-1" />
                        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex flex-col">
                      {/* Name Skeleton */}
                      <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mt-1 mb-2" />
                      {/* Email Skeleton */}
                      <div className="h-3 w-40 bg-gray-200 rounded animate-pulse mb-2" />
                    </div>
                    {/* Follow Button Skeleton */}
                    <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                </div>

                {/* Social Links Skeleton */}
                <div className="mb-6">
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-3" />
                  <div className="flex space-x-3">
                    <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>

                {/* Profile Stats Skeleton */}
                <div>
                  <div className="h-5 w-28 bg-gray-200 rounded animate-pulse mb-3" />
                  <div className="flex gap-6 sm:gap-2">
                    {/* Stat Card 1 */}
                    <div className="flex-1 bg-gray-100 rounded-2xl py-4 px-2 h-32 w-32">
                      <div className="flex flex-col items-center">
                        <div className="h-6 w-6 bg-gray-200 rounded animate-pulse mb-3" />
                        <div className="h-6 w-8 bg-gray-200 rounded animate-pulse mb-1" />
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                    {/* Stat Card 2 */}
                    <div className="flex-1 bg-gray-100 rounded-2xl py-4 px-2 h-32 w-32">
                      <div className="flex flex-col items-center">
                        <div className="h-6 w-6 bg-gray-200 rounded animate-pulse mb-3" />
                        <div className="h-6 w-8 bg-gray-200 rounded animate-pulse mb-1" />
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Side - Content Skeleton */}
          <div className="sm:col-span-10 lg:col-span-12 xl:col-span-13">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                {/* Tab/Content Skeleton */}
                <div className="space-y-4">
                  <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4" />
                  {/* Content Items */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const PublicProfileBySlugPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isLoggedIn } = useUserStore();
  const { openAuthModal } = useUIStore();
  const toast = useToast();

  // Fetch user data by slug
  const { 
    data: publicProfile, 
    isLoading: userLoading, 
    error: userError 
  } = usePublicProfileBySlug(slug || '');


  // Fetch user profile stats using user ID from the profile data
  const { 
    data: stats, 
    isLoading: statsLoading 
  } = useUserProfileStats(publicProfile?._id || '');

  // Follow functionality (requires target user ID)
  const { data: followStatus } = useFollowStatus(publicProfile?._id || '');
  const toggleFollowMutation = useToggleFollow();
  const isFollowing = followStatus?.isFollowing || false;
  if (userLoading || statsLoading) {
    return <PublicProfileSkeleton />;
  }

  if ( !publicProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600 mb-4">The user profile you're looking for doesn't exist.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const handleFollowToggle = async () => {
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }
    if (!publicProfile?._id) return;
    
    try {
      await toggleFollowMutation.mutateAsync(publicProfile._id);
      toast.success(
        isFollowing 
          ? `You've unfollowed ${publicProfile?.firstName} ${publicProfile?.lastName}` 
          : `You're now following ${publicProfile?.firstName} ${publicProfile?.lastName}`
      );
    } catch (error) {
      toast.error('Failed to update follow status. Please try again.');
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-18 gap-4 lg:gap-8">
          {/* Left Sidebar - Profile Info */}
          <div className="sm:col-span-8 lg:col-span-6 xl:col-span-5">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="">
                {/* Profile Picture and Stats */}
                <div className="flex flex-col  ">
            <div className="flex items-center gap-2">
             
                        <Avatar className="h-16 w-16">
                          <AvatarImage
                          className="object-cover"
                            src={publicProfile?.avatar || ""}
                            alt={getUserDisplayName(publicProfile)}
                          />
                          <AvatarFallback className="">{getUserInitials(publicProfile)}</AvatarFallback>
                        </Avatar>
              <div className="flex space-x-6 mt-3 mb-1">
                <button
                
                  className="text-center rounded-lg p-1 transition-colors duration-200"
                >
                  <div className="font-bold text-gray-900 text-base leading-tight">
                    {formatNumber(stats?.followers)}
                  </div>
                  <div className="text-xs text-gray-500">Followers</div>
                </button>
                <button
                 
                  className="text-center rounded-lg p-1 transition-colors duration-200"
                >
                  <div className="font-bold text-gray-900 text-base leading-tight">
                    {formatNumber(stats?.following)}
                  </div>
                  <div className="text-xs text-gray-500">Following</div>
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div className="flex flex-col">
                <div className="font-semibold text-gray-900 text-base mt-1 truncate">
                  {getTruncatedDisplayName(publicProfile, 15)}
                </div>
                <div className="text-xs text-gray-500 mb-2">{publicProfile?.email}</div>
              </div>
              <Button
                size="sm"
                onClick={handleFollowToggle}
                loading={toggleFollowMutation.isPending}
                className={`flex items-center ${isFollowing ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold rounded-full px-4 py-1.5 text-sm mt-1 hover:bg-blue-700 transition-colors`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
               
              </Button>
            </div>
          </div>

                {/* Social Links */}
                {(publicProfile?.socialLinks?.twitter || publicProfile?.socialLinks?.linkedin) && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Social Links</h3>
                    <div className="flex space-x-3">
                      {publicProfile?.socialLinks?.twitter && (
                        <a 
                          href={publicProfile?.socialLinks.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                      {publicProfile?.socialLinks?.linkedin && (
                        <a 
                          href={publicProfile?.socialLinks.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Profile Stats */}
                <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">Profile Stats</h3>
                  <div className="flex gap-6 sm:gap-2">
                   {publicProfile?.userType === 'user' && <div className="flex-1 bg-yellow-50 rounded-2xl py-4 px-2 flex flex-col items-center shadow-none h-32 w-32">
                      <StarIcon className="w-6 h-6 text-gray-900 mb-3" strokeWidth={2} fill="none" />
                      <div className="text-xl font-bold text-gray-900 mb-1">
                        {String(stats?.reviewsWritten || 0).padStart(2, '0')}
                      </div>
                      <div className="text-sm text-gray-900 font-semibold">Reviews Written</div>
                    </div> }
                    {publicProfile?.userType === 'vendor' && <div className="flex-1 bg-yellow-50 rounded-2xl py-4 px-2 flex flex-col items-center shadow-none h-32 w-32">
                      <StarIcon className="w-6 h-6 text-gray-900 mb-3" strokeWidth={2} fill="none" />
                      <div className="text-xl font-bold text-gray-900 mb-1">
                        {String(stats?.products || 0).padStart(2, '0')}
                      </div>
                      <div className="text-sm text-gray-900 font-semibold">Products</div>
                    </div>}
                    <div className="flex-1 bg-pink-100 rounded-2xl py-4 px-2 flex flex-col items-center shadow-none h-32 w-32">
                      <HelpCircle className="w-6 h-6 text-gray-900 mb-3" strokeWidth={2} fill="none" />
                      <div className="text-xl font-bold text-gray-900 mb-1">
                        {String(stats?.disputes || 0).padStart(2, '0')}
                      </div>
                      <div className="text-sm text-gray-900 font-semibold">Dispute</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Reviews List */}
           {publicProfile?.userType === 'user' && <UserReviews publicProfile={publicProfile} />}
           {publicProfile?.userType === 'vendor' && <UserProducts publicProfile={publicProfile} />}
          </div>
        </div>
    </div>
  );
};

export default PublicProfileBySlugPage; 