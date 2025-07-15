import React, { useState } from 'react';
import { Star, ThumbsUp, MessageSquare, FileText, Reply, Edit, Loader2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SoftwareReviewCardProps } from '@/types/software-review';
import StarRating from '../ui/StarRating';
import { useNavigate } from 'react-router-dom';
import useUserStore from '@/store/useUserStore';
import useUIStore from '@/store/useUIStore';
import { useDeleteReview, useHelpfulVote } from '@/hooks/useReview';
import DisputeModal from './DisputeModal';
import { Button } from '../ui/button';
import ConfirmationModal from '../ui/ConfirmationModal';
import { useReviewStore } from '@/store/useReviewStore';

const   SoftwareReviewCard: React.FC<SoftwareReviewCardProps> = ({
  software,
  review,
  className,
  showComments = false,
  showDispute = false,
  showAction = false
}) => {
    const { isLoggedIn, user } = useUserStore();
    const { openAuthModal } = useUIStore();
    const { setSelectedSoftware, setCurrentStep } = useReviewStore();
  const navigate = useNavigate();
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const contentRef = React.useRef<HTMLParagraphElement>(null);
  const { voteHelpful, removeVote, isVoting, isRemoving, hasVoted } = useHelpfulVote();
  const deleteReviewMutation = useDeleteReview();
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

  // Check if review content needs truncation
  React.useEffect(() => {
    const checkTruncation = () => {
      if (contentRef.current) {
        // Temporarily remove truncation to measure full height
        const element = contentRef.current;
        const originalStyle = element.style.cssText;
        
        // Set to full display to measure actual height
        element.style.display = 'block';
        element.style.webkitLineClamp = 'none';
        element.style.overflow = 'visible';
        element.style.whiteSpace = 'pre-line';
        
        const lineHeight = parseFloat(getComputedStyle(element).lineHeight) || 22;
        const maxHeight = lineHeight * 4; // 4 lines
        const actualHeight = element.scrollHeight;
        
        // Restore original style
        element.style.cssText = originalStyle;
        
        setShowReadMore(actualHeight > maxHeight);
      }
    };

    // Use setTimeout to ensure the content is rendered
    const timer = setTimeout(checkTruncation, 0);
    return () => clearTimeout(timer);
  }, [review.content]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
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

  const handleDeleteReview = () => {
    deleteReviewMutation.mutate(review.id);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 shadow-sm', className)}>
      {/* Header Section */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center space-x-4">
            {/* Software Logo */}
            <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0  ${software.slug && software.isActive === 'active' ? 'cursor-pointer' : 'cursor-not-allowed'}`} onClick={() => {
              if(software.slug && software.isActive === 'active'){
                navigate(`/product-detail/${software.slug}`)
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
                <span className="text-sm text-black font-semibold">
                  ({software.totalReviews}) {software.avgRating.toFixed(1) } out of 5.0
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
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
              <Reply  size={16} className="mr-0.5 "  />
              <span className="font-semibold text-base " >
                View Reply
                {review?.totalReplies ? ` (${ review.totalReplies})` : ''}
              </span>
            </button>
           {software?.userId === user?.id && <button
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

        {
  showAction &&    <div className="flex gap-2 self-end sm:self-start flex-shrink-0">
        {  software.isActive === 'active' && <Button onClick={() => {
          
             setSelectedSoftware({
              id: software.id,
              name: software.name,
              logoUrl: software.logoUrl,
            
             });
              setCurrentStep(3);
              navigate(`/write-review`);
            
          }} className="bg-blue-600 text-white rounded-full hover:bg-blue-700 px-4 py-2 !text-xs font-semibold flex items-center h-10">
            <Edit className="w-2 h-2" />
          <span className="hidden sm:block text-xs"> Edit Review</span>
          </Button>}
          <Button 
            variant="destructive" 
            className="rounded-full px-4 py-2 !text-xs font-semibold flex items-center h-10"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={deleteReviewMutation.isPending}
            loading={deleteReviewMutation.isPending}
          >
            <Trash2 className="w-2 h-2" />
            <span className="hidden sm:block text-xs"> Delete Review</span>
          </Button>

         
        </div>
        }
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
            <span className="text-sm text-black font-semibold">
              {formatDate(review.updatedAt)}
            </span>
          </div>

          {/* Review Content */}
          <div>
            <p 
              ref={contentRef}
              className="text-gray-700 leading-relaxed text-sm sm:text-base"
              style={{
                display: !isExpanded && showReadMore ? '-webkit-box' : 'block',
                WebkitLineClamp: !isExpanded && showReadMore ? 4 : 'none',
                WebkitBoxOrient: 'vertical' as const,
                overflow: !isExpanded && showReadMore ? 'hidden' : 'visible',
                whiteSpace: !isExpanded && showReadMore ? 'normal' : 'pre-line'
              }}
            >
              {review.content}
            </p>
            {showReadMore && (
              <button
                onClick={toggleExpanded}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 transition-colors inline-flex items-center gap-1 hover:underline cursor-pointer"
              >
                {isExpanded ? "Read less" : "Read more"}
                <span className="text-xs">
                  {isExpanded ? "▲" : "▼"}
                </span>
              </button>
            )}
          </div>

          
        </div>
      </div>
      { software?.userId === user?.id && (
        <DisputeModal
          isOpen={isDisputeModalOpen}
          onOpenChange={setIsDisputeModalOpen}
          reviewId={review.id}
        />
      )}

       {/* Delete Review Confirmation Modal */}
       <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleDeleteReview}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default SoftwareReviewCard; 