import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { ReviewReplyService, ReviewReplyFilters, CreateReplyRequest, UpdateReplyRequest } from '@/services/reviewReply';
import { useToast } from './useToast';
import useUserStore from '@/store/useUserStore';

// Hook to get replies for a review
export const useReviewReplies = (reviewId: string, filters: ReviewReplyFilters = {}) => {
  return useQuery({
    queryKey: ['reviewReplies', reviewId, filters],
    queryFn: () => ReviewReplyService.getRepliesForReview(reviewId, filters),
    enabled: !!reviewId,
  });
};

// Hook to create a reply
export const useCreateReply = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: string; data: CreateReplyRequest }) =>
      ReviewReplyService.createReply(reviewId, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['reviewReplies', variables.reviewId] });
        toast.success('Comment added successfully!');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to add comment');
    },
  });
};

// Hook to update a reply
export const useUpdateReply = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ replyId, data }: { replyId: string; data: UpdateReplyRequest }) =>
      ReviewReplyService.updateReply(replyId, data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['reviewReplies'] });
        toast.success('Comment updated successfully!');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to update comment');
    },
  });
};

// Hook to delete a reply
export const useDeleteReply = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (replyId: string) => ReviewReplyService.deleteReply(replyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewReplies'] });
      toast.success('Comment deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to delete comment');
    },
  });
};

// Hook to vote helpful on a reply
export const useReplyHelpfulVote = () => {
  const queryClient = useQueryClient();
  const { user } = useUserStore();

  const voteHelpful = useMutation({
    mutationFn: (replyId: string) => ReviewReplyService.voteHelpful(replyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewReplies'] });
    },
  });

  const removeVote = useMutation({
    mutationFn: (replyId: string) => ReviewReplyService.removeHelpfulVote(replyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewReplies'] });
    },
  });

  const hasVoted = (reply: any) => {
    if (!user || !reply.helpfulVotes?.voters) return false;
    return reply.helpfulVotes.voters.some((voter: any) => voter.user === user.id);
  };

  return {
    voteHelpful: voteHelpful.mutate,
    removeVote: removeVote.mutate,
    isVoting: voteHelpful.isPending,
    isRemoving: removeVote.isPending,
    hasVoted,
  };
}; 