import React from 'react';
import { Review } from '@/types/review';
import { ProductReview } from '@/services/review';
import ReviewCard from './ReviewCard';
import { Button } from '@/components/ui/button';
import LottieLoader from '../LottieLoader';

interface ReviewListProps {
  reviews: Review[];
  backendReviews?: ProductReview[];
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
  isLoading = false, 
  pagination,
  onLoadMore 
}) => {
  if (reviews.length === 0 && !isLoading) {
    return (
      <div className="bg-[#F7F7F7]">
        <div className="w-full text-center py-12">
          <p className="text-gray-500 text-lg">No reviews yet. Be the first to review this product!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F7F7]">
      <div className="w-full">
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <ReviewCard 
              key={review.id} 
              review={review} 
              backendReview={backendReviews[index]}
            />
          ))}
        </div>
        
        {isLoading && (
          <div className="flex justify-center mt-8">
            <LottieLoader size="medium" />
          </div>
        )}
        
        {pagination && pagination.hasNext && !isLoading && (
          <div className="text-center mt-10">
            <Button 
              onClick={onLoadMore}
              variant="outline" 
              className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-full px-8 py-3"
            >
              Load More Reviews ({pagination.totalItems - (pagination.currentPage * pagination.itemsPerPage)} remaining)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList; 