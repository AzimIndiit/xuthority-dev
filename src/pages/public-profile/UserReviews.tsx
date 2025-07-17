import ReviewCard from '@/components/product/ReviewCard';
import SoftwareReviewCard from '@/components/product/SoftwareReviewCard';
import Pagination from '@/components/ui/pagination';
import SecondaryLoader from '@/components/ui/SecondaryLoader';
import { useUserReviewsById } from '@/hooks/useAuth';
import { usePagination } from '@/hooks/usePagination';
import useUserStore from '@/store/useUserStore';
import { getFirstName, getTruncatedDisplayName } from '@/utils/userHelpers';
import { StarIcon } from 'lucide-react';
import React, { useEffect } from 'react'

// Skeleton loader for software review cards
const SoftwareReviewCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
      {/* Header Section Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center space-x-4">
          {/* Software Logo Skeleton */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />
          
          {/* Software Info Skeleton */}
          <div className="flex-1 min-w-0">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="flex items-center space-x-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
        
        {/* Action Buttons Skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      
      {/* Review Content Skeleton */}
      <div className="space-y-3">
        {/* Review Title Skeleton */}
        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
        
        {/* Rating and Date Skeleton */}
        <div className="flex items-center space-x-3">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        
        {/* Review Content Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

const UserReviews = ({publicProfile}) => {
    const { isLoggedIn, user } = useUserStore();
    const { data: reviewsData, isLoading: reviewsLoading } = useUserReviewsById(publicProfile?._id, {
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });

    const pagination = usePagination({
        initialPage: 1,
        initialItemsPerPage: 10,
        totalItems: reviewsData?.pagination?.totalItems || 0
    });

    // Refetch data when pagination changes
    const { data: paginatedReviewsData, isLoading: paginatedReviewsLoading } = useUserReviewsById(publicProfile?._id, {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });

    const handlePageChange = (page: number) => {
        pagination.setCurrentPage(page);
        // Scroll to top of reviews section when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    console.log('reviewsData', paginatedReviewsData);
    
    const displayData = paginatedReviewsData || reviewsData;
    const isLoading = paginatedReviewsLoading || reviewsLoading;
    
    return (
        <div className="sm:col-span-10 lg:col-span-12 xl:col-span-13">
            <div className="">
                {/* Header */}
        
                    <div className="flex items-center justify-between">
                        <h2 className="sm:text-xl lg:text-2xl font-bold text-gray-900">
                            {getFirstName(publicProfile)}'s Reviews
                        </h2>
                
                    </div>
                
                {/* Reviews Content */}
                <div className="my-6">
                    {isLoading ? (
                        <div className="space-y-6">
                          {[1, 2, 3].map((i) => (
                            <SoftwareReviewCardSkeleton key={i} />
                          ))}
                        </div>
                    ) : displayData?.reviews && displayData.reviews.length > 0 ? (
                        <div className="space-y-6">
                            {displayData.reviews.map((review: any) => (
                                <SoftwareReviewCard 
                                   
                                    key={review._id} 
                                    software={review.product}
                                    review={review}
                                    className="bg-white"
                                    showComments={user?.role === 'user' || !isLoggedIn}
                                    showDispute={user?.role === 'vendor'}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center  flex flex-col items-center justify-center min-h-[50vh]">
                            <img src="/svg/no_data.svg" alt="no-reviews" className="w-1/4 mb-4" />
                            <p className="text-gray-600">This user hasn't written any reviews yet.</p>
                        </div>
                    )}
                </div>
                
                {/* Pagination */}
                {displayData?.reviews && displayData.reviews.length > 0 && pagination.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                            totalItems={displayData.pagination.totalItems}
                            itemsPerPage={pagination.itemsPerPage}
                            showInfo={true}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserReviews