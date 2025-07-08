import React from 'react';
import { Review } from '@/types/review';
import { ProductReview } from '@/services/review';
import ReviewCard from './ReviewCard';
import { Button } from '@/components/ui/button';
import LottieLoader from '../LottieLoader';
import useUserStore from '@/store/useUserStore';

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
  onLoadMore?: () => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ 
  reviews, 
  backendReviews = [],
  productSlug,
  isLoading = false,
  pagination,
  onLoadMore 
}) => {
  const { user, isLoggedIn } = useUserStore();
  if (isLoading && reviews.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <LottieLoader size="medium" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-20">
        <img src="/svg/no_data.svg" alt="No reviews" className="w-1/2 mx-auto" />
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
        />
      ))}
      
      {pagination && pagination.hasNext && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={onLoadMore}
            variant="outline"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LottieLoader size="small" />
                <span className="ml-2">Loading...</span>
              </>
            ) : (
              'Load More Reviews'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewList; 