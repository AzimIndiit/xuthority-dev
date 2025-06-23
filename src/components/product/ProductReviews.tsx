import React from 'react';
import StarRating from '@/components/ui/StarRating';
import { Button } from '@/components/ui/button';
import RatingBreakdown from './RatingBreakdown';
import ReviewSearch from './ReviewSearch';
import ReviewList from './ReviewList';
import { Review } from '@/types/review';

interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

interface ProductReviewsProps {
  productName: string;
  rating: number;
  reviewCount: number;
  ratingDistribution: RatingDistribution[];
  popularMentions: string[];
  reviews: Review[];
  onSearch: (query: string) => void;
  onFilterChange: (stars: number) => void;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  productName,
  rating,
  reviewCount,
  ratingDistribution,
  popularMentions,
  reviews,
  onSearch,
  onFilterChange,
}) => {
  return (
    <div className="bg-[#F7F7F7] py-12">
      <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between md:items-start mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 line-clamp-2">
              {productName} Reviews
            </h2>
            <div className="flex items-center mt-2">
              <StarRating rating={rating} />
              <p className="ml-2 text-lg text-gray-600">({reviewCount}) {rating} out of 5</p>
            </div>
          </div>
          <Button className="bg-red-600 text-white hover:bg-red-700 mt-4 md:mt-0 px-8 py-4 text-lg rounded-none">
            Write A Review
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <div className="lg:col-span-4">
            <RatingBreakdown
              rating={rating}
              reviewCount={reviewCount}
              ratingDistribution={ratingDistribution}
              onFilterChange={onFilterChange}
            />
          </div>
          <div className="lg:col-span-3">
            <ReviewSearch
              popularMentions={popularMentions}
              onSearch={onSearch}
            />
          </div>
        </div>
        <div className='mt-8'>
        <ReviewList reviews={reviews} />
        </div>
      </div>
    </div>
  );
};

export default ProductReviews; 