import { ApiService, ApiResponse } from './api';

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

// Product Review specific interfaces
export interface ProductReview {
  _id: string;
  product: {
    _id: string;
    name: string;
    slug: string;
    };
  reviewer: {
    _id: string;
    name: string;
    email: string;
    isVerified: boolean;
    avatar: string;
    firstName: string;
    lastName: string;
    title: string;
    companyName: string;
    companySize: string;
    industry: string;
    slug: string; 
  };
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
  verification: {
    isVerified: boolean;
    verificationType?: string;
    verificationData?: any;
    verifiedAt?: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  helpfulVotes: {
    count: number;
    voters: Array<{
      user: string;
      votedAt: string;
    }>;
  };
  totalReplies: number;
  reviewSource?: string;
  keywords: string[];
  mentions: string[];
  submittedAt: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductReviewsResponse {
  success: boolean;
  data: ProductReview[];
  message: string;
  meta: {
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    total: number;
    productInfo: {
      id: string;
      name: string;
      avgRating: number;
      totalReviews: number;
      ratingDistribution: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
      };
    };
  };
}

export interface ProductReviewStatsResponse {
  success: boolean;
  data: {
    avgRating: number;
    totalReviews: number;
    ratingDistribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
    subRatingsAverage: {
      easeOfUse: number;
      customerSupport: number;
      features: number;
      pricing: number;
      technicalSupport: number;
    };
    popularMentions: string[];
    recentKeywords: string[];
  };
  message: string;
}

export interface ProductReviewFilters {
  page?: number;
  limit?: number;
  search?: string;
  overallRating?: number;
  isVerified?: boolean;
  sortBy?: 'submittedAt' | 'publishedAt' | 'overallRating' | 'helpfulVotes.count';
  sortOrder?: 'asc' | 'desc';
  mention?: string[];
  keywords?: string[];
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

export async function getProductReviews(productId: string, filters?: ProductReviewFilters): Promise<ApiResponse<ProductReview[]>> {
  return ApiService.get(`/product-reviews/product/${productId}`, { params: filters });
}

export async function getProductReviewStats(productId: string): Promise<ApiResponse<{
  avgRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  subRatingsAverage: {
    easeOfUse: number;
    customerSupport: number;
    features: number;
    pricing: number;
    technicalSupport: number;
  };
  popularMentions: string[];
  recentKeywords: string[];
}>> {
  return ApiService.get(`/product-reviews/product/${productId}/stats`);
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

export async function voteHelpful(reviewId: string) {
  return ApiService.post(`/product-reviews/${reviewId}/helpful`);
}

export async function removeHelpfulVote(reviewId: string) {
  return ApiService.delete(`/product-reviews/${reviewId}/helpful`);
}

export async function deleteReview(reviewId: string) {
  return ApiService.delete(`/product-reviews/${reviewId}`);
}
