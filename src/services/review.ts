import { ApiService } from './api';

export interface ReviewVerification {
  isVerified: boolean;
  verificationType: 'company_email' | 'linkedin' | 'vendor_invite' | 'screenshot';
  verificationData: any;
  verifiedAt?: string;
}

export interface CreateReviewPayload {
  product: string;
  overallRating: number;
  title: string;
  content: string;
  subRatings?: {
    easeOfUse?: number;
    customerSupport?: number;
    features?: number;
    pricing?: number;
    technicalSupport?: number;
  };
  reviewSource?: string;
  verification?: ReviewVerification;
}

export interface UpdateReviewPayload {
  overallRating: number;
  title: string;
  content: string;
  subRatings?: {
    easeOfUse?: number;
    customerSupport?: number;
    features?: number;
    pricing?: number;
    technicalSupport?: number;
  };
}

export interface Review {
  _id: string;
  product: string;
  user: string;
  overallRating: number;
  title: string;
  content: string;
  subRatings: {
    easeOfUse?: number;
    customerSupport?: number;
    features?: number;
    pricing?: number;
    technicalSupport?: number;
  };
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  verification?: ReviewVerification;
  submittedAt: string;
  publishedAt?: string;
}

export async function createReview(payload: CreateReviewPayload) {
  return ApiService.post('/product-reviews', payload);
}

export async function updateReview(reviewId: string, payload: UpdateReviewPayload) {
  return ApiService.put(`/product-reviews/${reviewId}`, payload);
}

export async function getReviewById(reviewId: string) {
  return ApiService.get(`/product-reviews/${reviewId}`);
}

export async function getProductReviews(productId: string, params?: any) {
  return ApiService.get(`/product-reviews/product/${productId}`, { params });
}

export async function getUserReviewForProduct(productId: string): Promise<Review | null> {
  try {
    // Use the optimized endpoint to get user's specific review
    const response = await ApiService.get(`/product-reviews/product/${productId}/my-review`);
    return (response as any).data || null;
  } catch (error: any) {
    // If 404, user hasn't reviewed this product yet
    if (error?.response?.status === 404) {
      return null;
    }
    console.error('Error fetching user review:', error);
    return null;
  }
}

export async function checkUserHasReviewed(productId: string): Promise<boolean> {
  const review = await getUserReviewForProduct(productId);
  return review !== null;
}
