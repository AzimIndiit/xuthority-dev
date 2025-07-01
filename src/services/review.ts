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

export async function createReview(payload: CreateReviewPayload) {
  return ApiService.post('/product-reviews', payload);
}
