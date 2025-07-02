export interface Review {
  id: string;
  title: string;
  rating: number;
  date: string;
  content: string;
  reviewer: {
    firstName: string;
    lastName: string;
    avatar: string;
    title: string;
    isVerified: boolean;
    companyName: string;
    companySize: string;
    industry: string;
  };
  verification: {
    isVerified: boolean;
    verificationType?: string;
    verificationData?: any;
    verifiedAt?: string;
  };
}

// New backend-compatible interfaces
export interface BackendReview {
  _id: string;
  product: {
    _id: string;
    name: string;
    slug: string;
  };
  reviewer: {
    _id: string;
   
    email: string;
    isVerified: boolean;
    avatar: string;
    firstName: string;
    lastName: string;
    title: string;
    companyName: string;
    companySize: string;
    industry: string;
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

// Rating distribution interface
export interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

// Helper function to transform backend review to frontend review
export function transformBackendReview(backendReview: BackendReview): Review {
  // Handle null or undefined input
  if (!backendReview) {
    throw new Error('BackendReview is required for transformation');
  }

  // Safely extract reviewer name with fallbacks
  const reviewerName = backendReview.reviewer?.firstName + ' ' + backendReview.reviewer?.lastName || 'Anonymous User';
  
  return {
    id: backendReview._id || 'unknown',
    title: backendReview.title || 'Untitled Review',
    rating: backendReview.overallRating || 1,
    date: new Date(backendReview.publishedAt || backendReview.submittedAt || Date.now()).toLocaleDateString(),
    content: backendReview.content || '',
    reviewer: {
      firstName: backendReview.reviewer.firstName || '',
      lastName: backendReview.reviewer.lastName || '',
      avatar: backendReview.reviewer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewerName)}&background=f3f4f6&color=374151`,
      title: backendReview.reviewer.title || 'Verified User',
      isVerified: backendReview.reviewer.isVerified || false,
      companyName: backendReview.reviewer.companyName || '',
      companySize: backendReview.reviewer.companySize || '',
      industry: backendReview.reviewer.industry || '',
    },
    verification: {
      isVerified: backendReview.verification?.isVerified || false,
      verificationType: backendReview.verification?.verificationType || '',
      verificationData: backendReview.verification?.verificationData || {},
      verifiedAt: backendReview.verification?.verifiedAt || '',
    },
  };
}

// Helper function to transform rating distribution from backend format
export function transformRatingDistribution(backendDistribution: {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}): RatingDistribution[] {
  const total = Object.values(backendDistribution).reduce((sum, count) => sum + count, 0);
  
  return [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: backendDistribution[stars as keyof typeof backendDistribution] || 0,
    percentage: total > 0 ? ((backendDistribution[stars as keyof typeof backendDistribution] || 0) / total) * 100 : 0,
  }));
}

export interface Software {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
}

export interface ReviewData {
  rating?: number;
  title?: string;
  description?: string;
  pros?: string[];
  cons?: string[];
}

export interface LinkedInVerificationData {
  linkedInId: string;
  firstName: string;
  lastName: string;
  email: string;
  profileUrl: string;
  profilePicture?: string;
  headline?: string;
  industry?: string;
}

export interface VerificationData {
  method?: 'screenshot' | 'vendor-invitation' | 'company-email' | 'linkedin' | null;
  screenshot?: File | null;
  vendorInvitationLink?: string;
  companyEmail?: string;
  linkedInData?: LinkedInVerificationData;
  isVerified?: boolean;
}

export interface ReviewFormData {
  software: Software;
  verification: VerificationData;
  review: ReviewData;
}
