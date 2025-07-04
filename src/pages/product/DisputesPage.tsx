import React, { useMemo } from 'react';
import DisputeCard from '@/components/dispute/DisputeCard';
import { DisputedReview, Dispute } from '@/types/dispute';
import { useAllDisputes, useDispute, useVendorDisputes } from '@/hooks/useDispute';
import { formatDate } from '@/utils/formatDate';
import { getUserDisplayName } from '@/utils/userHelpers';
import LottieLoader from '@/components/LottieLoader';
import useUserStore from '@/store/useUserStore';
import { DISPUTE_REASONS } from '@/services/dispute';

const DisputesPage = () => {
  const { user, isLoggedIn } = useUserStore();

  // Only fetch disputes if user is logged in and is a vendor
  const isVendor = user?.role === 'vendor';
  
  // Fetch disputes from API
  const { data: disputesData, isLoading ,refetch: refetchDisputes } = useAllDisputes({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
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
        isOwnReview: dispute.review.reviewer._id === user?.id,
        firstName: dispute.review.reviewer.firstName,
        lastName: dispute.review.reviewer.lastName,
        avatar: dispute.review.reviewer.avatar,
        companyName: dispute.review.reviewer.companyName,
        companySize: dispute.review.reviewer.companySize,
        isVerified: dispute.review.reviewer.isVerified,
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
        status: dispute.status === 'active' ? 'Active' : 'Resolved',
        description: description,
        claims: claims,
        explanations: dispute.explanations && dispute.explanations.length > 0 ? dispute.explanations[0]?.content : '',
        explanationsId: dispute.explanations && dispute.explanations.length > 0 ? dispute.explanations[0]?._id : null,
        // Add additional fields for ownership check
        isOwner: user?.id === dispute.vendor._id,
        vendorId: dispute.vendor._id,
        reviewId: dispute.review._id,
      };
      return { review, dispute: transformedDispute, product  };
    });
  }, [disputesData, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LottieLoader size="large" />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Disputes</h1>
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

export default DisputesPage; 