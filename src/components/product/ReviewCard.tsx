import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Reply, FileText } from 'lucide-react';
import StarRating from '@/components/ui/StarRating';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Review } from '@/types/review';
import { ProductReview } from '@/services/review';
import { VerifiedBadge } from '../icons/VerifiedBadge';
import { useHelpfulVote } from '@/hooks/useReview';
import useUserStore from '@/store/useUserStore';
import useUIStore from '@/store/useUIStore';
import { cn } from '@/lib/utils';
import { getUserDisplayName, getUserInitials } from '@/utils/userHelpers';
import { useNavigate, useParams } from 'react-router-dom';
import DisputeModal from './DisputeModal';
import { highlightText } from '@/utils/textHighlight';
import ReadMoreText from '@/components/ui/ReadMoreText';

interface ReviewCardProps {
  review: Review;
  backendReview?: ProductReview; // Optional backend review data for enhanced features
  showComments?: boolean;
  showDispute?: boolean;
  searchQuery?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, backendReview, showComments, showDispute, searchQuery = '' }) => {
  const { isLoggedIn, user } = useUserStore();
  const { openAuthModal } = useUIStore();
  const { productSlug } = useParams();
  const { voteHelpful, removeVote, isVoting, isRemoving, hasVoted } = useHelpfulVote();
  const navigate = useNavigate();
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const isUserVoted = backendReview ? hasVoted(backendReview) : false;
  const helpfulCount = backendReview?.helpfulVotes.count || 0;

  const handleHelpfulClick = () => {
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }

    if (!backendReview) return;

    if (isUserVoted) {
      removeVote(backendReview._id);
    } else {
      voteHelpful(backendReview._id);
    }
  };
  const handleCommentClick = () => {
      // if (!isLoggedIn) {
      //   openAuthModal();
      //   return;
      // }
      navigate(`/product-detail/${productSlug}/reviews`, {
        state: {
          reviewId: review.id,
          review: review
        }
      });
  };

  const handleDisputeClick = () => {
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }
    
    if (user?.role !== 'vendor') {
      // Only vendors can dispute reviews
      return;
    }
    
    setIsDisputeModalOpen(true);
  };



  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header: Title, Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 px-4 pt-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-[22px] font-semibold text-gray-900 mb-0 leading-tight">
            <span className="font-normal text-black">"</span>
            {highlightText(review.title, searchQuery)}
            <span className="font-normal text-black">"</span>
          </h3>
        </div>
 { showComments &&      <div className="flex items-center gap-4 text-base font-medium mb-2 sm:mt-0">
          <button
            onClick={handleHelpfulClick}
            disabled={isVoting || isRemoving}
            className={cn(
              "flex items-center gap-1.5 px-0 py-0 bg-transparent border-none outline-none hover:underline transition-colors cursor-pointer",
              isUserVoted ? "text-red-600" : "text-red-500",
              (isVoting || isRemoving) && "opacity-50 cursor-not-allowed"
            )}
            style={{ minWidth: 0 }}
          >
            <ThumbsUp size={16} className="mr-0.5" />
            {isVoting || isRemoving ? "..." : (
              <>
                <span className="font-semibold">Helpful?</span>
                {helpfulCount > 0 && (
                  <span className="ml-0.5 text-base font-normal">
                    ({helpfulCount})
                  </span>
                )}
              </>
            )}
          </button>
          <button onClick={handleCommentClick} className="flex items-center gap-1.5 px-0 py-0 bg-transparent border-none outline-none text-[#0071e3] hover:underline cursor-pointer">
            <MessageSquare size={16} className="mr-0.5" />
            <span className="font-semibold">
            Add Comments {backendReview?.totalReplies ? ` (${backendReview.totalReplies})` : ''}
            </span>
          </button>
        </div>}
        {showDispute && (
          <div className="flex items-center gap-4 text-base font-medium mb-2 sm:mt-0">
            <button
              onClick={handleCommentClick}
              className="flex items-center gap-1.5 px-0 py-0 bg-transparent border-none outline-none text-red-600 hover:underline cursor-pointer"
              style={{ minWidth: 0 }}
            >
              <Reply  size={16} className="mr-0.5 "  />
                <span className="font-semibold text-base " >
                View Reply
                {backendReview?.totalReplies ? ` (${backendReview.totalReplies})` : ''}
              </span>
            </button>
           {review.product?.userId === user?.id && <button
              onClick={handleDisputeClick}
              className="flex items-center gap-1.5 px-0 py-0 bg-transparent border-none outline-none text-[#0071e3] hover:underline cursor-pointer"
              style={{ minWidth: 0 }}
            >
                <FileText size={16} className="mr-0.5" />
              <span className="font-semibold text-base " >
                Dispute
              </span>
            </button>}
          </div>
        )}
      </div>
      {/* Rating and Date */}
      <div className="flex items-center px-4 mt-1 mb-1">
        <StarRating rating={review?.rating || 1} />
        <span className="text-black font-semibold text-base ml-2">{review?.date || new Date().toLocaleDateString()}</span>
      </div>
      {/* Review Content */}
      <div className="px-4 mb-2 mt-2">
        <ReadMoreText
          content={review.content}
          maxLines={4}
          className="text-gray-700 text-[16px] leading-relaxed"
          buttonClassName="text-blue-600 hover:text-blue-800"
        >
          {(content) => highlightText(content, searchQuery)}
        </ReadMoreText>
      </div>
      {/* Footer: Reviewer Info and Verification */}
      <div className="bg-pink-50 px-4 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-pink-100">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14">
            <Avatar className="h-14 w-14 cursor-pointer" onClick={() => {  if(review.reviewer.id !== user?.id){ navigate(`/public-profile/${review.reviewer.slug}`)}else{
              navigate(`/profile`)
            }}}>
              <AvatarImage src={review.reviewer.avatar} alt={getUserDisplayName(review.reviewer as any)} />
              <AvatarFallback>{getUserInitials(review.reviewer as any)}</AvatarFallback>
            </Avatar>
            {review.reviewer.isVerified && (
              <VerifiedBadge className="absolute bottom-0 -right-2 w-5 h-5 text-blue-600" />
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-[14px] leading-tight">{getUserDisplayName(review.reviewer as any)}</p>
            <p className="text-[14px] text-gray-600 leading-tight">
              {review.reviewer.title?.split(' ').slice(0, 2).join(' ')}
              {review.reviewer.companyName && (
                <>
                  , <span className="font-normal">{review.reviewer.companyName}</span>
                </>
              )}
              {review.reviewer.companySize && (
                <> ({review.reviewer.companySize} emp.)</>
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0">
          {review.verification?.isVerified && (
            <span
              className="text-[12px] text-gray-600 border border-gray-300 rounded-full px-2 py-1 text-center bg-white"
              style={{ minWidth: 90, fontWeight: 500 }}
            >
              Validated Review
            </span>
          )}
          {review.verification?.verificationType && (
            <span
              className="text-[12px] text-gray-600 border border-gray-300 rounded-full px-2 py-1 text-center bg-white"
              style={{ minWidth: 90, fontWeight: 500 }}
            >
              Review Source: {review.verification.verificationType.replace('_', ' ')}
            </span>
          )}
        </div>
      </div>
      
      {/* Dispute Modal */}
      {backendReview && (
        <DisputeModal
          isOpen={isDisputeModalOpen}
          onOpenChange={setIsDisputeModalOpen}
          reviewId={backendReview._id}
        />
      )}
    </div>
  );
};

export default ReviewCard;