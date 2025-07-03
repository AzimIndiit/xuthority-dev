import React, { useState, useMemo } from 'react';
import StarRating from '@/components/ui/StarRating';
import { Button } from '@/components/ui/button';
import RatingBreakdown from './RatingBreakdown';
import ReviewSearch from './ReviewSearch';
import ReviewList from './ReviewList';
import { Review, transformBackendReview, transformRatingDistribution, RatingDistribution } from '@/types/review';
import { useProductReviews, useProductReviewStats } from '@/hooks/useReview';
import useUserStore from '@/store/useUserStore';
import useUIStore from '@/store/useUIStore';
import { useReviewStore } from '@/store/useReviewStore';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/services/product';
import { ProductReviewFilters } from '@/services/review';
import LottieLoader from '../LottieLoader';

interface ProductReviewsProps {
  product: Product;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ product }) => {
  const { openAuthModal } = useUIStore();
  const { setSelectedSoftware } = useReviewStore();
  const { isLoggedIn,user } = useUserStore();
  const navigate = useNavigate();

  // State for filters
  const [filters, setFilters] = useState<ProductReviewFilters>({
    page: 1,
    limit: 10,
    sortBy: 'publishedAt',
    sortOrder: 'desc'
  });

  // Fetch reviews and stats
  const { 
    data: reviewsResponse, 
    isLoading: reviewsLoading, 
    error: reviewsError 
  } = useProductReviews(product._id, filters);

  const { 
    data: statsResponse, 
    isLoading: statsLoading 
  } = useProductReviewStats(product._id);

  // Transform data for UI
  const reviews: Review[] = useMemo(() => {
    if (!reviewsResponse?.data || !Array.isArray(reviewsResponse.data)) return [];
    
    try {
      return reviewsResponse.data.map(transformBackendReview);
    } catch (error) {
      console.error('Error transforming review data:', error);
      return [];
    }
  }, [reviewsResponse]);

  const ratingDistribution: RatingDistribution[] = useMemo(() => {
    if (reviewsResponse?.meta?.productInfo?.ratingDistribution) {
      return transformRatingDistribution(reviewsResponse.meta.productInfo.ratingDistribution);
    }
    if (statsResponse?.data?.ratingDistribution) {
      return transformRatingDistribution(statsResponse.data.ratingDistribution);
    }
    return [];
  }, [reviewsResponse, statsResponse]);

  console.log(reviews,'reviews');
  const popularMentions = useMemo(() => {
    return statsResponse?.data?.popularMentions || ['All Reviews'];
  }, [statsResponse]);

  // Get current stats
  const rating = reviewsResponse?.meta?.productInfo?.avgRating || 
                 statsResponse?.data?.avgRating || 
                 product.avgRating || 0;
  const reviewCount = reviewsResponse?.meta?.productInfo?.totalReviews || 
                      statsResponse?.data?.totalReviews || 
                      product.totalReviews || 0;

  const onWriteReview = () => {
    if (!isLoggedIn) {
      return openAuthModal();
    }
    setSelectedSoftware({id: product._id, name: product.name,logoUrl: product.logoUrl});
    navigate('/write-review');
  };

  const handleSearch = (query: string) => {
    // TODO: Implement search functionality with backend
    console.log("Search query:", query);
  };

  const handleFilterChange = (stars: number) => {
    setFilters(prev => ({
      ...prev,
      overallRating: stars,
      page: 1 // Reset to first page when filtering
    }));
  };

  if (reviewsLoading && !reviewsResponse) {
    return (
      <div className="bg-[#F7F7F7] py-12">
        <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="flex justify-center items-center py-20">
            <LottieLoader size="large" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F7F7] py-12">
      <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between md:items-start mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 line-clamp-2">
              {product.name} Reviews
            </h2>
            <div className="flex items-center mt-2">
              <StarRating rating={rating} />
              <p className="ml-2 text-lg text-gray-600">({reviewCount}) {rating} out of 5</p>
            </div>
          </div>
       { (!isLoggedIn ||  user?.role !== 'vendor') &&   <Button onClick={onWriteReview} className="bg-red-600 text-white hover:bg-red-700 mt-4 md:mt-0 px-8 py-4 text-lg rounded-none">
            Write A Review
          </Button>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <div className="lg:col-span-4">
            <RatingBreakdown
            filters={filters as any}
              rating={rating}
              reviewCount={reviewCount}
              ratingDistribution={ratingDistribution}
              onFilterChange={handleFilterChange}
            />
          </div>
          <div className="lg:col-span-3">
            <ReviewSearch
              popularMentions={popularMentions}
              onSearch={handleSearch}
            />
          </div>
        </div>
        <div className='mt-8'>
          <ReviewList 
            reviews={reviews} 
            backendReviews={reviewsResponse?.data}
            productSlug={product.slug}
            isLoading={reviewsLoading}
            pagination={reviewsResponse?.meta?.pagination}
            onLoadMore={() => {
              if (reviewsResponse?.meta?.pagination?.hasNext) {
                setFilters(prev => ({
                  ...prev,
                  page: (prev.page || 1) + 1
                }));
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductReviews; 