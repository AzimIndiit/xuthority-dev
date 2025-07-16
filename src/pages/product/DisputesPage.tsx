import React, { useMemo } from 'react';
import DisputeCard from '@/components/dispute/DisputeCard';
import { DisputedReview, Dispute } from '@/types/dispute';
import { useAllDisputes, useDispute, useVendorDisputes } from '@/hooks/useDispute';
import { formatDate } from '@/utils/formatDate';
import { getUserDisplayName } from '@/utils/userHelpers';
import LottieLoader from '@/components/LottieLoader';
import useUserStore from '@/store/useUserStore';
import { DISPUTE_REASONS } from '@/services/dispute';
import SecondaryLoader from '@/components/ui/SecondaryLoader';
import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import NotFoundPage from '@/components/common/NotFoundPage';

// Skeleton loader component for dispute cards
const DisputeCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-20"></div>
    </div>
    
    <div className="space-y-3 mb-4">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
    
    <div className="border-t pt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 rounded w-24"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  </div>
);

const DisputesPage = () => {
  const { user, isLoggedIn } = useUserStore();

  const navigate = useNavigate();
  // Only fetch disputes if user is logged in and is a vendor
  const isVendor = user?.role === 'vendor';
  const { productSlug } = useParams<{ productSlug: string }>();
  // Fetch disputes from API
  const { data: disputesData, isLoading, refetch: refetchDisputes, isError ,error} = useAllDisputes({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    productSlug: productSlug
  });
const errorData = error as any;
 console.log('errorData?.message', errorData)
  // Transform API data to match the UI structure - MOVED BEFORE CONDITIONAL RETURNS
  const transformedDisputes = useMemo(() => {
    // Check if disputesData has disputes array or if it's the array itself
    const disputes = disputesData?.disputes || disputesData || [];
    
    if (!Array.isArray(disputes) || disputes.length === 0) return [];

    return disputes.map((dispute: any) => {
      // Add null checks for nested objects
      if (!dispute || !dispute.review || !dispute.review.reviewer || !dispute.vendor) {
        console.warn('Skipping dispute with missing required data:', dispute);
        return null;
      }

      // Transform review data
      const review: DisputedReview = {
        id: dispute.review._id,
        title: dispute.review.title || '',
        rating: dispute.review.overallRating || 0,
        date: formatDate(dispute.review.createdAt || dispute.createdAt),
        content: dispute.review.content || '',
        isOwnReview: dispute.review.reviewer._id === user?.id,
        firstName: dispute.review.reviewer.firstName || '',
        lastName: dispute.review.reviewer.lastName || '',
        avatar: dispute.review.reviewer.avatar || '',
        companyName: dispute.review.reviewer.companyName || '',
        companySize: dispute.review.reviewer.companySize || '',
        isVerified: dispute.review.reviewer.isVerified || false,
        slug: dispute.review.reviewer.slug || '',
      };

      // Find the label for the dispute reason
      const reasonLabel = DISPUTE_REASONS.find(r => r.value === dispute.reason)?.label || dispute.reason;

      // Parse description to extract explanation and claims
      // The API returns a simple description string, but the UI expects explanation and claims separately
      const descriptionLines = (dispute.description || '').split('\n').filter(line => line.trim());
      const description = descriptionLines[0] || dispute.description || '';
      const claims = descriptionLines.slice(1).filter(line => line.trim());
      const product = dispute.product || {};
      
      // Transform dispute data
      const transformedDispute: Dispute = {
        id: dispute._id,
        disputer: {
          name: getUserDisplayName(dispute.vendor),
          avatarUrl: dispute.vendor.avatar || `https://ui-avatars.com/api/?name=${getUserDisplayName(dispute.vendor)}`,
        },
        date: formatDate(dispute.createdAt),
        reason: reasonLabel,
        reasonValue: dispute.reason, // Add the original value for editing
        status: dispute.status ? dispute.status.toLowerCase() : 'pending',
        description: description,
        claims: claims,
        explanations: dispute.explanations && dispute.explanations.length > 0 ? dispute.explanations[0]?.content : '',
        explanationsId: dispute.explanations && dispute.explanations.length > 0 ? dispute.explanations[0]?._id : null,
        // Add additional fields for ownership check
        isOwner: user?.id === dispute.vendor._id,
        vendorId: dispute.vendor._id,
        reviewId: dispute.review._id,
      };
      return { review, dispute: transformedDispute, product };
    }).filter(Boolean); // Remove any null entries
  }, [disputesData, user]);

  // Handle loading state with skeleton
  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Disputes</h1>
          <div className="space-y-8">
            {[...Array(3)].map((_, index) => (
              <DisputeCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (isError && errorData?.response?.data?.error?.code.includes('PRODUCT_NOT_FOUND')) {
    return (
      <NotFoundPage 
        title="Oops! Product not found."
        description="The product you're looking for doesn't exist or has been removed."
        buttonText="Go Back Home"
        navigateTo={`/`}
        showBackButton={false}
      />
    );
  }
  // Handle error state
  if (isError) {
    return (
      <div className="bg-white min-h-screen">
        <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-2">
          <span className="block lg:hidden" onClick={() => navigate(-1)}>
            {" "}
            <ArrowLeftIcon className="w-6 h-6" />
          </span>
            <h1 className="text-2xl sm:text-3xl font-bold">Disputes</h1>
          </div>  
         
          <div className="text-center py-12 text-red-500">
            <p className="text-lg font-semibold">Failed to load disputes</p>
            <p className="text-sm mt-2">Please try refreshing the page or contact support if the issue persists.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="block lg:hidden" onClick={() => navigate(-1)}>
            {" "}
            <ArrowLeftIcon className="w-6 h-6" />
          </span>
            <h1 className="text-2xl sm:text-3xl font-bold">Disputes</h1>
          </div>
        {transformedDisputes.length === 0 ? (
          <div className="text-center py-12 text-gray-500 min-h-[60vh] flex flex-col justify-center items-center">
            <img src="/svg/no_data.svg" alt="No results" className="w-1/4 mb-4" />
            <p>No disputes found.</p>
            <p className="text-sm mt-2">Disputes will appear here when you dispute reviews on your products.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {transformedDisputes.map(({ review, dispute, product}) => (
                  <DisputeCard key={dispute.id} review={review} dispute={dispute} product={product} refetchDisputes={refetchDisputes} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DisputesPage; 