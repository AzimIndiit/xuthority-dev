import React, { useState } from 'react';
import { Star, ThumbsUp, MessageSquare, FileText, Reply } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SoftwareReviewCardProps } from '@/types/software-review';
import StarRating from '../ui/StarRating';
import { useNavigate } from 'react-router-dom';
import useUserStore from '@/store/useUserStore';
import useUIStore from '@/store/useUIStore';
import { useHelpfulVote } from '@/hooks/useReview';
import DisputeModal from './DisputeModal';

const   SoftwareReviewCard: React.FC<SoftwareReviewCardProps> = ({
  software,
  review,
  className,
  showComments = false,
  showDispute = false   
}) => {
    const { isLoggedIn, user } = useUserStore();
    const { openAuthModal } = useUIStore();
  const navigate = useNavigate();
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const { voteHelpful, removeVote, isVoting, isRemoving, hasVoted } = useHelpfulVote();
  const isUserVoted = review ? hasVoted(review as any) : false;
  const helpfulCount = review?.helpfulVotes?.count || 0;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  



  const handleHelpfulClick = () => {
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }

    if (!review) return;

    if (isUserVoted) {
      removeVote(review.id);
    } else {
      voteHelpful(review.id);
    }
  };
  const handleCommentClick = () => {
      if (!isLoggedIn) {
        openAuthModal();
        return;
      }
      navigate(`/product-detail/${software.slug}/reviews`, {
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
    <div className={cn('bg-white rounded-lg border border-gray-200 shadow-sm', className)}>
      {/* Header Section */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center space-x-4">
            {/* Software Logo */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0" onClick={() => {
              if(software.slug){
                navigate(`/product/${software.slug}`)
              }
            }}>
              {software.logoUrl ? (
                <img 
                  src={software.logoUrl} 
                  alt={`${software.name} logo`}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                />
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-400 via-yellow-400 to-green-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-base sm:text-lg">
                    {software.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Software Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 truncate">
                {software.name}
              </h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <StarRating rating={software.avgRating} />
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  ({software.totalReviews})
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          { showComments &&      <div className="flex items-center gap-4 text-xs font-medium mb-2 sm:mt-0">
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
          <button onClick={handleCommentClick} className="flex items-center gap-1.5 px-0 py-0 bg-transparent border-none outline-none text-blue-600 hover:underline cursor-pointer">
            <MessageSquare size={14} className="mr-0.5" />
            <span className="font-semibold">
            Add Comments {review?.totalReplies ? ` (${review.totalReplies})` : ''}
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
              <Reply  size={14} className="mr-0.5 "  />
              <span className="font-semibold text-xs " >
                View Reply
                {review?.totalReplies ? ` (${ review.totalReplies})` : ''}
              </span>
            </button>
           {software?.userId === user?.id && <button
              onClick={handleDisputeClick}
              className="flex items-center gap-1.5 px-0 py-0 bg-transparent border-none outline-none text-blue-600 hover:underline cursor-pointer"
              style={{ minWidth: 0 }}
            >
              <FileText size={14} className="mr-0.5" />
              <span className="font-semibold text-xs " >
                Dispute
              </span>
            </button>}
          </div>
        )}
        </div>

        {/* Review Content */}
        <div className="space-y-3">
          {/* Review Title */}
          <h4 className="text-lg sm:text-xl font-semibold text-gray-900 leading-tight">
            "{review.title}"
          </h4>

          {/* Review Rating and Date */}
          <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                <StarRating rating={review.overallRating} />
            </div>
            <span className="text-sm text-gray-500">
              {formatDate(review.updatedAt)}
            </span>
          </div>

          {/* Review Content */}
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            {review.content}
          </p>

          
        </div>
      </div>
      { software?.userId === user?.id && (
        <DisputeModal
          isOpen={isDisputeModalOpen}
          onOpenChange={setIsDisputeModalOpen}
          reviewId={review.id}
        />
      )}
    </div>
  );
};

export default SoftwareReviewCard; 