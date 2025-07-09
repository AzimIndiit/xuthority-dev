import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import StarRating from '@/components/ui/StarRating';
import { VerifiedBadge } from '@/components/icons/VerifiedBadge';
import { useReviewReplies, useCreateReply, useUpdateReply, useDeleteReply, useReplyHelpfulVote } from '@/hooks/useReviewReply';
import { useProductReview } from '@/hooks/useReview';
import useUserStore from '@/store/useUserStore';
import useUIStore from '@/store/useUIStore';
import { getUserDisplayName, getUserInitials } from '@/utils/userHelpers';
import { formatRelativeTime, formatDate } from '@/utils/formatDate';
import LottieLoader from '@/components/LottieLoader';
import { cn } from '@/lib/utils';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { transformBackendReview } from '@/types/review';
import ReviewCard from '@/components/product/ReviewCard';

// Skeleton component for the entire page
const ReviewCommentsPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
        {/* Header skeleton */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Enhanced Review Card skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-32 bg-gray-200 rounded" />
                  <div className="h-4 w-4 bg-gray-200 rounded" />
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
                  ))}
                </div>
              </div>
              
              <div className="h-4 w-48 bg-gray-200 rounded mb-2" />
              <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
              
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-4/5" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
              
              <div className="flex items-center gap-4 mt-4">
                <div className="h-8 w-20 bg-gray-200 rounded" />
                <div className="h-8 w-16 bg-gray-200 rounded" />
                <div className="h-8 w-14 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
          <div className="p-6 border-b border-gray-200">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Comment Form skeleton */}
          <div className="p-6 border-b border-gray-200">
            <div className="h-24 bg-gray-200 rounded mb-4 animate-pulse" />
            <div className="flex justify-end">
              <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Comments List skeleton */}
          <div className="p-6">
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((index) => (
                <CommentSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced skeleton component for individual comments
const CommentSkeleton: React.FC = () => {
  return (
    <div className="flex items-start gap-3 animate-pulse">
      <div className="w-10 h-10 bg-gray-200 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
            <div className="h-4 w-12 bg-gray-200 rounded" />
          </div>
          <div className="h-4 w-4 bg-gray-200 rounded" />
        </div>
        <div className="space-y-2 mb-3">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-4/5" />
          <div className="h-4 bg-gray-200 rounded w-3/5" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

// New skeleton for load more comments
const LoadMoreCommentsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((index) => (
        <CommentSkeleton key={index} />
      ))}
    </div>
  );
};

// New skeleton for comment being posted
const CommentPostingSkeleton: React.FC = () => {
  return (
    <div className="flex items-start gap-3 animate-pulse bg-blue-50 p-4 rounded-lg border border-blue-200">
      <div className="w-10 h-10 bg-blue-200 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-24 bg-blue-200 rounded" />
          <div className="h-4 w-12 bg-blue-200 rounded" />
        </div>
        <div className="space-y-2 mb-3">
          <div className="h-4 bg-blue-200 rounded w-full" />
          <div className="h-4 bg-blue-200 rounded w-3/4" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-16 bg-blue-200 rounded" />
        </div>
      </div>
    </div>
  );
};

const ReviewCommentsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn } = useUserStore();
  const { openAuthModal } = useUIStore();
  
  // Get reviewId from location state
  const reviewId = location.state?.reviewId;
  const reviewFromState = location.state?.review;
  
  const [comment, setComment] = useState('');
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [replyToDelete, setReplyToDelete] = useState<string | null>(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [allReplies, setAllReplies] = useState<any[]>([]);
  const [hasMoreReplies, setHasMoreReplies] = useState(true);
  const [totalComments, setTotalComments] = useState(0);
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set());

  // Redirect if no reviewId in state
  useEffect(() => {
    if (!reviewId) {
      navigate(-1);
    }
  }, [reviewId, navigate]);

  // Fetch the review details (only if not provided in state)
  const { data: reviewResponse, isLoading: reviewLoading } = useProductReview(reviewId as string);

  // Fetch replies with pagination
  const { data: repliesResponse, isLoading: repliesLoading, refetch: refetchReplies } = useReviewReplies(reviewId || '', {
    page,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Update allReplies when new data arrives
  useEffect(() => {
    if (repliesResponse?.data && !loadedPages.has(page)) {
      if (page === 1) {
        // Reset replies for first page
        setAllReplies(repliesResponse.data);
        setLoadedPages(new Set([1]));
      } else {
        // Append new replies for subsequent pages only if not already loaded
        setAllReplies(prev => {
          // Filter out any duplicates based on _id
          const existingIds = new Set(prev.map(r => r._id));
          const newReplies = repliesResponse.data.filter((r: any) => !existingIds.has(r._id));
          return [...prev, ...newReplies];
        });
        setLoadedPages(prev => new Set([...prev, page]));
      }
      
      // Update total comments and pagination status
      const pagination = repliesResponse.meta?.pagination;
      setHasMoreReplies(pagination?.hasNext || false);
      setTotalComments(repliesResponse.meta?.total || 0);
    }
  }, [repliesResponse, page, loadedPages]);

  // Mutations
  const createReplyMutation = useCreateReply();
  const updateReplyMutation = useUpdateReply();
  const deleteReplyMutation = useDeleteReply();
  const { voteHelpful, removeVote, isVoting, isRemoving, hasVoted } = useReplyHelpfulVote();

  // Use review from state if available, otherwise from API
  const review = reviewFromState || transformBackendReview(reviewResponse?.data as any);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }

    if (!comment.trim() || !reviewId) return;

    try {
      const response = await createReplyMutation.mutateAsync({
        reviewId,
        data: { content: comment.trim() }
      });
      
      // Add the new comment to the beginning of the list
      if (response.success && response.data) {
        const newReply = {
          ...response.data,
          author: {
            _id: user?.id,
            firstName: user?.firstName,
            lastName: user?.lastName,
            avatar: user?.avatar,
            email: user?.email,
            slug: user?.slug
          }
        };
        
        // Add new reply to the beginning and update total count
        setAllReplies(prev => [newReply, ...prev]);
        setTotalComments(prev => prev + 1);
        setComment('');
        
        // If we're adding the first comment on a new page, update hasMoreReplies
        if (totalComments % 10 === 0) {
          setHasMoreReplies(true);
        }
      }
    } catch (error) {
      console.error('Failed to create reply:', error);
    }
  };

  const handleEdit = (replyId: string, content: string) => {
    setEditingReplyId(replyId);
    setEditingContent(content);
  };

  const handleUpdate = async () => {
    if (!editingContent.trim() || !editingReplyId) return;

    try {
      await updateReplyMutation.mutateAsync({
        replyId: editingReplyId,
        data: { content: editingContent.trim() }
      });
      setEditingReplyId(null);
      setEditingContent('');
      // Update the reply in allReplies
      setAllReplies(prev => prev.map(reply => 
        reply._id === editingReplyId 
          ? { ...reply, content: editingContent.trim(), isEdited: true }
          : reply
      ));
    } catch (error) {
      console.error('Failed to update reply:', error);
    }
  };

  const handleDeleteClick = (replyId: string) => {
    setReplyToDelete(replyId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!replyToDelete) return;

    try {
      await deleteReplyMutation.mutateAsync(replyToDelete);
      setShowDeleteModal(false);
      setReplyToDelete(null);
      // Remove the reply from allReplies and update count
      setAllReplies(prev => prev.filter(reply => reply._id !== replyToDelete));
      setTotalComments(prev => prev - 1);
    } catch (error) {
      console.error('Failed to delete reply:', error);
    }
  };

  const handleHelpfulClick = async (reply: any) => {
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }

    const wasVoted = hasVoted(reply);
    
    // Optimistically update the UI
    setAllReplies(prev => prev.map(r => {
      if (r._id === reply._id) {
        if (wasVoted) {
          // Remove vote
          return {
            ...r,
            helpfulVotes: {
              ...r.helpfulVotes,
              count: r.helpfulVotes.count - 1,
              voters: r.helpfulVotes.voters.filter((v: any) => v.user !== user?.id)
            }
          };
        } else {
          // Add vote
          return {
            ...r,
            helpfulVotes: {
              ...r.helpfulVotes,
              count: r.helpfulVotes.count + 1,
              voters: [...r.helpfulVotes.voters, { user: user?.id, votedAt: new Date().toISOString() }]
            }
          };
        }
      }
      return r;
    }));

    // Make the API call
    try {
      if (wasVoted) {
        await removeVote(reply._id);
      } else {
        await voteHelpful(reply._id);
      }
    } catch (error) {
      // Revert on error
      setAllReplies(prev => prev.map(r => r._id === reply._id ? reply : r));
    }
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  // Show skeleton loader when loading initial data
  if (!reviewId || (reviewLoading && !reviewFromState) || !review) {
    return <ReviewCommentsPageSkeleton />;
  }

  const isLoadingInitial = repliesLoading && page === 1 && allReplies.length === 0;
  const isLoadingMore = repliesLoading && page > 1;
console.log(allReplies,'allReplies');
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft size={20} />
            <span>Back to Reviews</span>
          </button>
        </div>

        {/* Review Card */}
        <ReviewCard review={review} backendReview={reviewResponse?.data as any} showComments={false} showDispute={false} />

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Comments ({totalComments})
            </h2>
          </div>

          {/* Comment Form */}
          <div className="p-6 border-b border-gray-200">
            <form onSubmit={handleSubmit}>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={isLoggedIn ? "Write your comment here..." : "Please log in to comment"}
                className="w-full mb-4 min-h-[100px]"
                disabled={!isLoggedIn}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!comment.trim() || createReplyMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {createReplyMutation.isPending ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </form>
          </div>

          {/* Comments List */}
          <div className="p-6">
            {/* Show comment being posted */}
            {createReplyMutation.isPending && (
              <div className="mb-6">
                <CommentPostingSkeleton />
              </div>
            )}

            {isLoadingInitial ? (
              // Show comment skeletons while loading initial comments
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((index) => (
                  <CommentSkeleton key={index} />
                ))}
              </div>
            ) : allReplies.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <img src="/svg/no_data.svg" alt="No reviews" className="w-1/4 mx-auto mb-4" />
                <p className="text-lg text-gray-500">No comments yet.</p>
          
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {allReplies.map((reply: any) => (
                    <div key={reply._id} className="flex items-start gap-3 animate-fadeIn">
                      <Avatar className="w-10 h-10 cursor-pointer" onClick={() => {  if(reply.author.id !== user?.id){ navigate(`/public-profile/${reply.author.slug}`)}else{
                        navigate(`/profile`)
                      }}}>
                        <AvatarImage 
                          src={reply.author.avatar || reply.author.profilePicture} 
                          alt={getUserDisplayName(reply.author)} 
                        />
                        <AvatarFallback>
                          {getUserInitials(reply.author)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {getUserDisplayName(reply.author)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatRelativeTime(reply.createdAt)}
                            </span>
                            {reply.isEdited && (
                              <span className="text-sm text-gray-400">(edited)</span>
                            )}
                          </div>
                          
                          {user?.id === reply.author._id && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="text-gray-400 hover:text-gray-600 p-1">
                                  <MoreVertical size={16} />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(reply._id, reply.content)}>
                                  <Edit2 className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteClick(reply._id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                        
                        {editingReplyId === reply._id ? (
                          <div className="mt-2">
                            <Textarea
                              value={editingContent}
                              onChange={(e) => setEditingContent(e.target.value)}
                              className="w-full mb-2 min-h-[80px]"
                              disabled={updateReplyMutation.isPending}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className='bg-red-600 hover:bg-red-700 text-white'
                                onClick={handleUpdate}
                                disabled={!editingContent.trim() || updateReplyMutation.isPending}
                              >
                                {updateReplyMutation.isPending ? 'Saving...' : 'Save'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingReplyId(null);
                                  setEditingContent('');
                                }}
                                disabled={updateReplyMutation.isPending}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                        )}
                        
                        <div className="mt-3">
                          <button
                            onClick={() => handleHelpfulClick(reply)}
                            disabled={isVoting || isRemoving}
                            className={cn(
                              "flex items-center gap-1.5 text-sm transition-colors",
                              hasVoted(reply)
                                ? "text-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                            )}
                          >
                            <ThumbsUp size={14} className={cn(hasVoted(reply) && "fill-current")} />
                            <span>Helpful ({reply.helpfulVotes?.count || 0})</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show loading skeleton when loading more comments */}
                {isLoadingMore && (
                  <div className="mt-6">
                    <LoadMoreCommentsSkeleton />
                  </div>
                )}

                {/* Load More Button */}
                {hasMoreReplies && (
                  <div className="flex justify-center mt-8">
                    <Button
                      onClick={handleLoadMore}
                      variant="outline"
                      size="lg"
                      disabled={isLoadingMore}
                      className='border-red-600 text-red-600 text-xs rounded-full hover:text-red-500'
                    >
                      {isLoadingMore ? 'Loading...' : 'Load More Comments'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onOpenChange={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Comment"
        description="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="destructive"
      />
    </div>
  );
};

export default ReviewCommentsPage; 