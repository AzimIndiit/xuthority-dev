import React from 'react';
import { Review } from '@/types/review';
import ReviewCard from './ReviewCard';
import { Button } from '@/components/ui/button';

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <div className="bg-[#F7F7F7]">
      <div className="w-full ">
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-full px-8 py-3">
            View All Reviews
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewList; 