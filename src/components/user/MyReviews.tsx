import React from 'react';
import useUserStore from '@/store/useUserStore';
import { useUserReviews } from '@/hooks/useAuth';
import { usePagination } from '@/hooks/usePagination';
import SoftwareReviewCard from '@/components/product/SoftwareReviewCard';
import Pagination from '@/components/ui/pagination';
import { ArrowLeft, ArrowLeftIcon, Star as StarIcon } from 'lucide-react';
import SecondaryLoader from '@/components/ui/SecondaryLoader';
import { useNavigate } from 'react-router-dom';

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
  const { data: reviewsData, isLoading } = useUserReviews(userId, {
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
        {isLoading ? (
          <SecondaryLoader text="Loading your reviews..." containerClasses='min-h-[60vh]' />
        ) : reviews.length > 0 ? (
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