import React from 'react';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import StarRating from '@/components/ui/StarRating';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Review } from '@/types/review';
import { ProductReview } from '@/services/review';
import { VerifiedBadge } from '../icons/VerifiedBadge';
import { useHelpfulVote } from '@/hooks/useReview';
import useUserStore from '@/store/useUserStore';
import useUIStore from '@/store/useUIStore';
import { cn } from '@/lib/utils';
import { getUserDisplayName } from '@/utils/userHelpers';

interface ReviewCardProps {
  review: Review;
  backendReview?: ProductReview; // Optional backend review data for enhanced features
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, backendReview }) => {
  const { isLoggedIn } = useUserStore();
  const { openAuthModal } = useUIStore();
  const { voteHelpful, removeVote, isVoting, isRemoving, hasVoted } = useHelpfulVote();

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
  console.log(review);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header: Title, Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 px-4 pt-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-semibold text-gray-900 mb-0 leading-tight">
            <span className="font-normal text-black">"</span>
            {review.title}
            <span className="font-normal text-black">"</span>
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium mt-2 sm:mt-0">
          <button
            onClick={handleHelpfulClick}
            disabled={isVoting || isRemoving}
            className={cn(
              "flex items-center gap-1.5 px-0 py-0 bg-transparent border-none outline-none hover:underline transition-colors",
              isUserVoted ? "text-red-600" : "text-red-500",
              (isVoting || isRemoving) && "opacity-50 cursor-not-allowed"
            )}
            style={{ minWidth: 0 }}
          >
            <ThumbsUp size={14} className="mr-0.5" />
            {isVoting || isRemoving ? "..." : (
              <>
                <span className="font-semibold">Helpful?</span>
                {helpfulCount > 0 && (
                  <span className="ml-0.5 text-xs font-normal">
                    ({helpfulCount})
                  </span>
                )}
              </>
            )}
          </button>
          <button className="flex items-center gap-1.5 px-0 py-0 bg-transparent border-none outline-none text-blue-600 hover:underline">
            <MessageSquare size={14} className="mr-0.5" />
            <span className="font-semibold">Add Comment</span>
          </button>
        </div>
      </div>
      {/* Rating and Date */}
      <div className="flex items-center px-4 mt-1 mb-1">
        <StarRating rating={review?.rating || 1} className="!text-yellow-400" />
        <span className="text-gray-600 text-xs ml-2">{review?.date || new Date().toLocaleDateString()}</span>
      </div>
      {/* Review Content */}
      <p className="text-gray-700 text-[13px] leading-relaxed px-4 mb-2">
        {review.content}
      </p>
      {/* Footer: Reviewer Info and Verification */}
      <div className="bg-pink-50 px-4 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-pink-100">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <Avatar className="h-10 w-10">
              <AvatarImage src={review.reviewer.avatar} alt={getUserDisplayName(review.reviewer as any)} />
              <AvatarFallback>{getUserDisplayName(review.reviewer as any)}</AvatarFallback>
            </Avatar>
            {review.reviewer.isVerified && (
              <VerifiedBadge className="absolute bottom-0 -right-2 w-5 h-5 text-blue-600" />
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-[13px] leading-tight">{getUserDisplayName(review.reviewer as any)}</p>
            <p className="text-xs text-gray-600 leading-tight">
              {review.reviewer.title.split(' ').slice(0, 2).join(' ')}
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
              className="text-[10px] text-gray-600 border border-gray-300 rounded-full px-2 py-1 text-center bg-white"
              style={{ minWidth: 90, fontWeight: 500 }}
            >
              Validated Review
            </span>
          )}
          {review.verification?.verificationType && (
            <span
              className="text-[10px] text-gray-600 border border-gray-300 rounded-full px-2 py-1 text-center bg-white"
              style={{ minWidth: 90, fontWeight: 500 }}
            >
              Review Source: {review.verification.verificationType.replace('_', ' ')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;