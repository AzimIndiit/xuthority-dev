import React, { useMemo } from 'react';
import DisputeCard from '@/components/dispute/DisputeCard';
import { DisputedReview, Dispute } from '@/types/dispute';
import {  useVendorDisputes } from '@/hooks/useDispute';
import { formatDate } from '@/utils/formatDate';
import { getUserDisplayName } from '@/utils/userHelpers';
import LottieLoader from '@/components/LottieLoader';
import useUserStore from '@/store/useUserStore';
import { DISPUTE_REASONS } from '@/services/dispute';
import SecondaryLoader from '@/components/ui/SecondaryLoader';
import { ArrowLeft, ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserDisputes = () => {
  const { user, isLoggedIn } = useUserStore();
  const navigate = useNavigate();
  // Only fetch disputes if user is logged in and is a vendor
  const isVendor = user?.role === 'vendor';
  
  // Fetch disputes from API
  const { data: disputesData, isLoading ,refetch: refetchDisputes } = useVendorDisputes({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Transform API data to match the UI structure
  const transformedDisputes = useMemo(() => {
    // Check if disputesData has disputes array or if it's the array itself
    const disputes = disputesData?.disputes || disputesData || [];
    
    if (!Array.isArray(disputes) || disputes.length === 0) return [];

    return disputes.map((dispute: any) => {
      // Transform review data
      const review: DisputedReview = {
        id: dispute.review._id,
        title: dispute.review.title,
        rating: dispute.review.overallRating,
        date: formatDate(dispute.review.createdAt || dispute.createdAt),
        content: dispute.review.content,
        isOwnReview: dispute.review.reviewer._id === user?._id,
        firstName: dispute.review.reviewer.firstName,
        lastName: dispute.review.reviewer.lastName,
        avatar: dispute.review.reviewer.avatar,
        companyName: dispute.review.reviewer.companyName,
        companySize: dispute.review.reviewer.companySize,
        isVerified: dispute.review.reviewer.isVerified,
        slug: dispute.review.reviewer.slug,
      };

      // Find the label for the dispute reason
      const reasonLabel = DISPUTE_REASONS.find(r => r.value === dispute.reason)?.label || dispute.reason;

      // Parse description to extract explanation and claims
      // The API returns a simple description string, but the UI expects explanation and claims separately
      const descriptionLines = dispute.description.split('\n').filter(line => line.trim());
      const description = descriptionLines[0] || dispute.description;
      const claims = descriptionLines.slice(1).filter(line => line.trim());
      const product = dispute.product;
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
        status: dispute.status.toLowerCase() as any,
        description: description,
        claims: claims,
        explanations: dispute.explanations && dispute.explanations.length > 0 ? dispute.explanations[0]?.content : '',
        explanationsId: dispute.explanations && dispute.explanations.length > 0 ? dispute.explanations[0]?._id : null,
        // Add additional fields for ownership check
        isOwner: user?.id === dispute.vendor,
        vendorId: dispute.vendor._id,
        reviewId: dispute.review._id,
      };
      return { review, dispute: transformedDispute, product  };
    });
  }, [disputesData, user]);

  if (isLoading) {
    return <SecondaryLoader text="Loading disputes..." containerClasses='min-h-[60vh]' />;
  }

  return (
    <div className=" min-h-screen">
      <div className="w-full lg:max-w-screen-xl mx-auto">
      <div className='flex items-center gap-2'> 
      <span className="block lg:hidden" onClick={() => navigate(-1)}>
            {" "}
            <ArrowLeftIcon className="w-6 h-6" />
          </span>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
        
        Disputes</h1>
        
      </div>
       
        {transformedDisputes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No disputes found.</p>
            <p className="text-sm mt-2">Disputes will appear here when you dispute reviews on your products.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {transformedDisputes.map(({ review, dispute ,product}) => (
                  <DisputeCard key={dispute.id} review={review} dispute={dispute} product={product} refetchDisputes={refetchDisputes} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDisputes; 