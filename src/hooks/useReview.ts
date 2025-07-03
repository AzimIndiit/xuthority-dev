import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getProductReviews, 
  getProductReviewStats, 
  createReview, 
  updateReview, 
  getUserReviewForProduct,
  ProductReview,
  Review,
  ProductReviewFilters,
  voteHelpful,
  removeHelpfulVote,
  deleteReview
} from '@/services/review';
import useUserStore from '@/store/useUserStore';
import { toast } from 'react-hot-toast';
import { ApiService } from '@/services/api';
import { useToast } from './useToast';

export function useUserReview(productId: string | undefined) {
  const { user, isLoggedIn } = useUserStore();

  return useQuery({
    queryKey: ['userReview', productId, user?.id],
    queryFn: () => {
      if (!productId || !user?.id) return null;
      return getUserReviewForProduct(productId);
    },
    enabled: !!(productId && user?.id && isLoggedIn), 
   
  });
}

export function useUserHasReviewed(productId: string | undefined): {
  hasReviewed: boolean;
  review: Review | null;
  isLoading: boolean;
} {

  const { data: review, isLoading } = useUserReview(productId);
  return {
    hasReviewed: !!review,
    review: review || null,
    isLoading,
  };
}

// New hooks for product reviews
export function useProductReviews(productId: string | undefined, filters?: ProductReviewFilters) {
  return useQuery({
    queryKey: ['productReviews', productId, filters],
    queryFn: () => {
      if (!productId) throw new Error('Product ID is required');
      return getProductReviews(productId, filters);
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProductReviewStats(productId: string | undefined) {
  return useQuery({
    queryKey: ['productReviewStats', productId],
    queryFn: () => {
      if (!productId) throw new Error('Product ID is required');
      return getProductReviewStats(productId);
    },
    enabled: !!productId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useHelpfulVote() {
  const queryClient = useQueryClient();
  const { user } = useUserStore();

  const voteMutation = useMutation({
    mutationFn: voteHelpful,
    onSuccess: () => {
      // Invalidate and refetch product reviews
      queryClient.invalidateQueries({ queryKey: ['productReviews'] });
      // toast.success('Thank you for your feedback!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error?.message || 'Failed to vote';
      toast.error(errorMessage);
    }
  });

  const removeMutation = useMutation({
    mutationFn: removeHelpfulVote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productReviews'] });
      // toast.success('Vote removed');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error?.message || 'Failed to remove vote';
      toast.error(errorMessage);
    }
  });

  return {
    voteHelpful: voteMutation.mutate,
    removeVote: removeMutation.mutate,
    isVoting: voteMutation.isPending,
    isRemoving: removeMutation.isPending,
    hasVoted: (review: ProductReview) => {
      return review.helpfulVotes.voters.some(voter => voter.user === user?.id);
    }
  };
}

// Hook to get a single product review by ID
export const useProductReview = (reviewId: string) => {
  return useQuery({
    queryKey: ['productReview', reviewId],
    queryFn: async () => {
      const response = await ApiService.get<ProductReview>(`/product-reviews/${reviewId}`);
      return response;
    },
    enabled: !!reviewId,
  });
};

// Hook to delete a review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productReviews'] });
      queryClient.invalidateQueries({ queryKey: ['userReview'] });
      success('Review deleted successfully');
    },
    onError: (err: any) => {
      error(err.response?.data?.error?.message || 'Failed to delete review');
    }
  });
}; 