import { useQuery } from '@tanstack/react-query';
import { getUserReviewForProduct, Review } from '@/services/review';
import useUserStore from '@/store/useUserStore';

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
  console.log(productId,'productId',review,isLoading);
  return {
    hasReviewed: !!review,
    review: review || null,
    isLoading,
  };
} 