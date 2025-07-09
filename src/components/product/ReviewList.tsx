import React from 'react';
import { Review } from '@/types/review';
import { ProductReview } from '@/services/review';
import ReviewCard from './ReviewCard';
import { Button } from '@/components/ui/button';
import LottieLoader from '../LottieLoader';
import useUserStore from '@/store/useUserStore';

// Skeleton loader for individual review items
const ReviewItemSkeleton = () => (
  <div className="bg-white p-6 rounded-lg border border-gray-200 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="space-y-1">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
    
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-4/5"></div>
      <div className="h-4 bg-gray-200 rounded w-3/5"></div>
    </div>
    
    <div className="flex items-center justify-between">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
      <div className="flex space-x-2">
        <div className="h-8 bg-gray-200 rounded w-16"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  </div>
);

interface ReviewListProps {
  reviews: Review[];
  backendReviews?: ProductReview[];
  productSlug?: string;
  isLoading?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  searchQuery?: string;
  onLoadMore?: () => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ 
  reviews, 
  backendReviews = [],
  productSlug,
  isLoading = false,
  pagination,
  searchQuery = '',
  onLoadMore 
}) => {
  const { user, isLoggedIn } = useUserStore();

  if (isLoading && reviews.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <ReviewItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-20">
        <img src="/svg/no_data.svg" alt="No reviews" className="w-1/4 mx-auto mb-4" />
        <p className="text-lg text-gray-500">No reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review, index) => (
        <ReviewCard 
          key={review.id} 
          review={review} 
          showComments={user?.role === 'user' || !isLoggedIn}
          showDispute={user?.role === 'vendor'}
          backendReview={backendReviews[index]}
          searchQuery={searchQuery}
        />
      ))}
      
      {/* Show skeleton items when loading more reviews */}
      {isLoading && reviews.length > 0 && (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <ReviewItemSkeleton key={`loading-${index}`} />
          ))}
        </div>
      )}
      
      {pagination && pagination.hasNext && !isLoading && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={onLoadMore}
            variant="outline"
            size="lg"
            disabled={isLoading}
            className="rounded-full !text-sm border border-red-500 text-red-500 hover:bg-red-50 hover:text-red-500"
          >
              Load More Reviews
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewList; 