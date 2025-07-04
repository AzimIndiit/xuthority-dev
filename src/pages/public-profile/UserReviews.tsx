import ReviewCard from '@/components/product/ReviewCard';
import SoftwareReviewCard from '@/components/product/SoftwareReviewCard';
import Pagination from '@/components/ui/pagination';
import { useUserReviewsById } from '@/hooks/useAuth';
import { usePagination } from '@/hooks/usePagination';
import useUserStore from '@/store/useUserStore';
import { getTruncatedDisplayName } from '@/utils/userHelpers';
import { StarIcon } from 'lucide-react';
import React, { useEffect } from 'react'

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
                            {getTruncatedDisplayName(publicProfile, 10)}'s Reviews
                        </h2>
                
                    </div>
                
                {/* Reviews Content */}
                <div className="my-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <StarIcon className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
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