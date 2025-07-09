import React from 'react';
import useUserStore from '@/store/useUserStore';
import { useUserReviews } from '@/hooks/useAuth';
import { usePagination } from '@/hooks/usePagination';
import SoftwareReviewCard from '@/components/product/SoftwareReviewCard';
import Pagination from '@/components/ui/pagination';
import { ArrowLeft, ArrowLeftIcon, Star as StarIcon } from 'lucide-react';
import SecondaryLoader from '@/components/ui/SecondaryLoader';
import { useNavigate } from 'react-router-dom';

// Skeleton component for individual review cards
const ReviewCardSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
    <div className="flex items-start space-x-4">
      {/* Software logo placeholder */}
      <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0" />
      
      <div className="flex-1 space-y-3">
        {/* Software name and rating row */}
        <div className="flex items-center justify-between">
          <div className="h-5 bg-gray-200 rounded w-32" />
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
        
        {/* Review title placeholder */}
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        
        {/* Review content placeholder */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-4/5" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
        
        {/* Review metadata placeholder */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-200 rounded w-16" />
            <div className="h-8 bg-gray-200 rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Skeleton component for the header
const HeaderSkeleton = () => (
  <div className="flex items-center gap-2 mb-6 animate-pulse">
    <div className="block lg:hidden w-6 h-6 bg-gray-200 rounded" />
    <div className="h-7 bg-gray-200 rounded w-32" />
  </div>
);

// Skeleton component for pagination
const PaginationSkeleton = () => (
  <div className="px-6 py-4 border-t border-gray-200 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="h-4 bg-gray-200 rounded w-32" />
      <div className="flex space-x-2">
        <div className="h-8 bg-gray-200 rounded w-8" />
        <div className="h-8 bg-gray-200 rounded w-8" />
        <div className="h-8 bg-gray-200 rounded w-8" />
      </div>
    </div>
  </div>
);

// Skeleton component for the reviews list
const ReviewsListSkeleton = () => (
  <div className="space-y-6">
    {[...Array(5)].map((_, index) => (
      <ReviewCardSkeleton key={index} />
    ))}
  </div>
);

// Complete skeleton for MyReviews page
const MyReviewsSkeleton = () => (
  <div className="">
    <HeaderSkeleton />
    <ReviewsListSkeleton />
    <PaginationSkeleton />
  </div>
);

const MyReviews: React.FC = () => {
  const { user } = useUserStore();
  const userId = user?.id || user?._id;
  const itemsPerPage = 10;
  const navigate = useNavigate();
  // Pagination state
  const pagination = usePagination({
    initialPage: 1,
    initialItemsPerPage: itemsPerPage,
    totalItems: 0 // will update after fetch
  });

  // Fetch reviews for current user
  const { data: reviewsData, isLoading, isError, error, refetch } = useUserReviews(userId, {
    page: pagination.currentPage,
    limit: pagination.itemsPerPage,
    sortBy: 'publishedAt',
    sortOrder: 'desc',
  });

  // Update total items for pagination
  React.useEffect(() => {
    if (reviewsData?.pagination?.totalItems) {
      pagination.setItemsPerPage(pagination.itemsPerPage); // triggers reset
    }
  }, [reviewsData?.pagination?.totalItems]);

  const reviews = reviewsData?.reviews || [];
  const totalPages = reviewsData?.pagination?.totalPages || 1;
  const totalItems = reviewsData?.pagination?.totalItems || 0;

  if (isLoading) {
    return <MyReviewsSkeleton />;
  }

  if (isError) {
    return (
      <div className="">
        <div className='flex items-center gap-2 mb-6'> 
          <span className="block lg:hidden" onClick={() => navigate(-1)}>
            <ArrowLeftIcon className="w-6 h-6" />
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            My Reviews
          </h1>
        </div>
        
        <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <StarIcon className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Reviews</h3>
          <p className="text-gray-600 mb-4 text-center max-w-md">
            {error?.message || "Something went wrong while loading your reviews. Please try again."}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
   
      <div className='flex items-center gap-2 mb-6'> 
      <span className="block lg:hidden" onClick={() => navigate(-1)}>
            {" "}
            <ArrowLeftIcon className="w-6 h-6" />
          </span>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
        
        My Reviews</h1>
        
      </div>  
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review: any) => (
            <SoftwareReviewCard
              key={review._id || review.id}
              software={review.product}
              review={review}
              className="bg-white"
              showComments={false}
              showDispute={false}
              showAction={true}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <StarIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
            <p className="text-gray-600">You haven't written any reviews yet.</p>
          </div>
        )}
      </div>
      {/* Pagination */}
      {reviews.length > 0 && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={totalPages}
            onPageChange={pagination.setCurrentPage}
            totalItems={totalItems}
            itemsPerPage={pagination.itemsPerPage}
            showInfo={true}
          />
        </div>
      )}
    </div>
  );
};

export default MyReviews;