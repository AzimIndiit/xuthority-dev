import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ThumbsUp, MessageSquare, ChevronDown, HelpCircle, Star as StarIcon, Twitter, Linkedin } from 'lucide-react';
import { formatNumber } from '@/utils/formatNumber';
import { formatDate } from '@/utils/formatDate';
import { getUserInitials } from '@/utils/userHelpers';
import { usePublicProfile, useUserReviews, useUserProfileStats } from '@/hooks/useAuth';
import { useFollowStatus, useToggleFollow } from '@/hooks/useFollow';
import { useToast } from '@/hooks/useToast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PublicProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [sortBy, setSortBy] = useState('publishedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const toast  = useToast();

  // Fetch user data
  const { 
    data: user, 
    isLoading: userLoading, 
    error: userError 
  } = usePublicProfile(userId || '');

  // Fetch user reviews
  const { 
    data: reviewsData, 
    isLoading: reviewsLoading, 
    error: reviewsError 
  } = useUserReviews(userId || '', {
    page,
    limit: 10,
    sortBy,
    sortOrder
  });

  // Fetch user profile stats
  const { 
    data: stats, 
    isLoading: statsLoading 
  } = useUserProfileStats(userId || '');

  // Follow functionality
  const { data: followStatus } = useFollowStatus(userId || '');
  const toggleFollowMutation = useToggleFollow();
  const isFollowing = followStatus?.isFollowing || false;

  if (userLoading || reviewsLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (userError || reviewsError || !user) {
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
    try {
      await toggleFollowMutation.mutateAsync(userId || '');
      toast.success(
        isFollowing ? `You've unfollowed ${user?.firstName} ${user?.lastName}` : `You're now following ${user?.firstName} ${user?.lastName}`,
       
      );
    } catch (error) {
      toast.error(
            'Failed to update follow status. Please try again.',
        
      );
    }
  };

  const handleSortChange = (value: string) => {
    if (value === 'newest') {
      setSortBy('publishedAt');
      setSortOrder('desc');
    } else if (value === 'oldest') {
      setSortBy('publishedAt');
      setSortOrder('asc');
    } else if (value === 'highest-rated') {
      setSortBy('overallRating');
      setSortOrder('desc');
    } else if (value === 'lowest-rated') {
      setSortBy('overallRating');
      setSortOrder('asc');
    }
    setPage(1);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const sortValue = sortBy === 'publishedAt' && sortOrder === 'desc' 
    ? 'newest' 
    : sortBy === 'publishedAt' && sortOrder === 'asc' 
    ? 'oldest'
    : sortBy === 'overallRating' && sortOrder === 'desc'
    ? 'highest-rated'
    : 'lowest-rated';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Profile Info */}
          <div className="lg:col-span-1">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                {/* Profile Picture and Stats */}
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage 
                      src={user.avatar || ''} 
                      alt={`${user.firstName} ${user.lastName}`}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-xl font-semibold">
                      {getUserInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex space-x-6">
                    <div className="text-center">
                      <div className="text-2xl font-black text-gray-900">
                        {formatNumber(stats?.followers || 0)}
                      </div>
                      <div className="text-sm text-gray-600">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-gray-900">
                        {formatNumber(stats?.following || 0)}
                      </div>
                      <div className="text-sm text-gray-600">Following</div>
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={handleFollowToggle}
                    className="mt-3 w-full"
                    disabled={toggleFollowMutation.isPending}
                  >
                    {toggleFollowMutation.isPending 
                      ? 'Loading...' 
                      : isFollowing 
                      ? 'Unfollow' 
                      : 'Follow'
                    }
                  </Button>
                </div>

                {/* Social Links */}
                {(user.socialLinks?.twitter || user.socialLinks?.linkedin) && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Social Links</h3>
                    <div className="flex space-x-3">
                      {user.socialLinks?.twitter && (
                        <a 
                          href={user.socialLinks.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                      {user.socialLinks?.linkedin && (
                        <a 
                          href={user.socialLinks.linkedin} 
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
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Profile Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-yellow-50 rounded-lg p-4 text-center">
                      <div className="flex justify-center mb-2">
                        <StarIcon className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {String(stats?.reviewsWritten || 0).padStart(2, '0')}
                      </div>
                      <div className="text-sm text-gray-600">Reviews Written</div>
                    </div>
                    <div className="bg-pink-50 rounded-lg p-4 text-center">
                      <div className="flex justify-center mb-2">
                        <HelpCircle className="w-6 h-6 text-pink-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {String(stats?.disputes || 0).padStart(2, '0')}
                      </div>
                      <div className="text-sm text-gray-600">Dispute</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Reviews */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user.firstName} Reviews
                  </h2>
                  <Select value={sortValue} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Most Recent</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="highest-rated">Highest Rated</SelectItem>
                      <SelectItem value="lowest-rated">Lowest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Reviews List */}
              <div className="p-6">
                {reviewsData?.reviews && reviewsData.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviewsData.reviews.map((review: any) => (
                      <Card key={review._id} className="border border-gray-200 shadow-sm">
                        <CardContent className="p-6">
                          {/* Product Info */}
                          <div className="flex items-start space-x-4 mb-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              {review.product?.logo ? (
                                <img 
                                  src={review.product.logo} 
                                  alt={review.product.name}
                                  className="w-8 h-8 object-contain"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-blue-500 rounded text-white flex items-center justify-center text-xs font-bold">
                                  {review.product?.name?.[0] || 'P'}
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold text-gray-900">
                                  {review.product?.name || 'Unknown Product'}
                                </h3>
                                <div className="flex items-center space-x-1">
                                  {renderStars(review.overallRating)}
                                  <span className="text-sm text-gray-600">
                                    ({review.product?.totalReviews || 0})
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  {renderStars(review.overallRating)}
                                  <span className="ml-1">{formatDate(review.publishedAt)}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Review Content */}
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">
                              "{review.title}"
                            </h4>
                            <p className="text-gray-700 leading-relaxed">
                              {review.content}
                            </p>
                          </div>

                          {/* Review Actions */}
                          <div className="flex items-center space-x-4 text-sm">
                            <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                              <ThumbsUp className="w-4 h-4" />
                              <span>Helpful?</span>
                            </button>
                            <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                              <MessageSquare className="w-4 h-4" />
                              <span>Add Comment</span>
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <StarIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                    <p className="text-gray-600">This user hasn't written any reviews yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage; 