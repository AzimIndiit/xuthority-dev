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
import { queryClient } from '@/lib/queryClient';

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
  // Explicitly check for null/undefined to ensure hasReviewed is false when no review exists
  const hasReviewed = review !== null && review !== undefined;
  
  console.log('useUserHasReviewed debug:', {
    productId,
    review: review ? 'exists' : 'null',
    hasReviewed,
    isLoading
  });
  
  return {
    hasReviewed,
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
    staleTime: 0, // 5 minutes
    gcTime:0
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
      staleTime: 0, // 10 minutes
      gcTime:0
    });
  }

  export function useHelpfulVote() {
    const { user } = useUserStore();

  const voteMutation = useMutation({
    mutationFn: voteHelpful,
    onSuccess: () => {
      // Invalidate and refetch all review-related queries
      queryClient.invalidateQueries({ queryKey: ['productReviews'] });
      queryClient.invalidateQueries({ queryKey: ['userReviews'] });
      queryClient.invalidateQueries({ queryKey: ['userReviewsById'] });
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
      queryClient.invalidateQueries({ queryKey: ['userReviews'] });
      queryClient.invalidateQueries({ queryKey: ['userReviewsById'] });
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
 
  const { success, error } = useToast();

  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      // Invalidate all review-related queries
      queryClient.invalidateQueries({ queryKey: ['productReviews'] });
      queryClient.invalidateQueries({ queryKey: ['userReview'] });
      queryClient.invalidateQueries({ queryKey: ['userReviews'] }); // This invalidates useUserReviews
      queryClient.invalidateQueries({ queryKey: ['userReviewsById'] });
      queryClient.invalidateQueries({ queryKey: ['productReviewStats'] });
      
      // Set a flag to indicate review was deleted - this will force verification on next visit
      sessionStorage.setItem('reviewDeleted', 'true');
      
      success('Review deleted successfully');
    },
    onError: (err: any) => {
      error(err.response?.data?.error?.message || 'Failed to delete review');
    }
  });
}; 