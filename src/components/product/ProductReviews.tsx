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

// Skeleton loader for the header section
const HeaderSkeleton = () => (
  <div className="flex flex-col md:flex-row justify-between md:items-start mb-8 animate-pulse">
    <div className="flex-1">
      <div className="h-8 bg-gray-200 rounded w-64 mb-3"></div>
      <div className="flex items-center mt-2">
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-5 h-5 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="ml-2 h-6 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
    <div className="h-12 bg-gray-200 rounded w-40 mt-4 md:mt-0"></div>
  </div>
);

// Skeleton loader for the rating breakdown section
const RatingBreakdownSkeleton = () => (
  <div className="bg-white p-6 rounded-lg animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center">
          <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
          <div className="flex-1 h-2 bg-gray-200 rounded mx-2"></div>
          <div className="w-8 h-4 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

// Skeleton loader for the search section
const SearchSkeleton = () => (
  <div className="bg-white p-6 rounded-lg animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
    <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
      <div className="flex flex-wrap gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-6 bg-gray-200 rounded w-16"></div>
        ))}
      </div>
    </div>
  </div>
);

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

// Skeleton loader for the review list section
const ReviewListSkeleton = () => (
  <div className="space-y-6">
    {[...Array(5)].map((_, i) => (
      <ReviewItemSkeleton key={i} />
    ))}
  </div>
);

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
    try {
      if (reviewsResponse?.meta?.productInfo?.ratingDistribution) {
        return transformRatingDistribution(reviewsResponse.meta.productInfo.ratingDistribution);
      }
      if (statsResponse?.data?.ratingDistribution) {
        return transformRatingDistribution(statsResponse.data.ratingDistribution);
      }
    } catch (error) {
      console.error('Error transforming rating distribution:', error);
    }
    return [];
  }, [reviewsResponse, statsResponse]);

  const popularMentions = useMemo(() => {
    if (statsResponse?.data?.popularMentions && Array.isArray(statsResponse.data.popularMentions)) {
      // If popularMentions is an array of objects, extract the mention strings
      return statsResponse.data.popularMentions.map((item: any) => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item.mention) return item.mention;
        return String(item);
      });
    }
    return ['All Reviews'];
  }, [statsResponse]);

  // Get current stats
  const rating = Number(reviewsResponse?.meta?.productInfo?.avgRating || 
                 statsResponse?.data?.avgRating || 
                 product.avgRating || 0);
  const reviewCount = Number(reviewsResponse?.meta?.productInfo?.totalReviews || 
                      statsResponse?.data?.totalReviews || 
                      product.totalReviews || 0);

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

  // Show skeleton loading when data is loading
  if (reviewsLoading && !reviewsResponse) {
    return (
      <div className="bg-[#F7F7F7] py-12">
        <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
          <HeaderSkeleton />
          
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
            <div className="lg:col-span-4">
              <RatingBreakdownSkeleton />
            </div>
            <div className="lg:col-span-3">
              <SearchSkeleton />
            </div>
          </div>
          
          <div className="mt-8">
            <ReviewListSkeleton />
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
              <p className="ml-2 text-lg text-gray-600">({reviewCount}) {rating.toFixed(1)} out of 5.0</p>
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