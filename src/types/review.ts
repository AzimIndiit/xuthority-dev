import useUserStore from "@/store/useUserStore";

export interface Review {
  id: string;
  title: string;
  rating: number;
  date: string;
  content: string;
  isOwnReview?: boolean;
  product?: {
    _id: string;
    name: string;
    slug: string;
    userId?: string;
  };
  reviewer: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
    title: string;
    isVerified: boolean;
    companyName: string;
    companySize: string;
    industry: string;
    slug: string;
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
  product?: {
    _id: string;
    name: string;
    slug: string;
    userId?: string;
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
    slug: string;
  };
  overallRating: number;
  title: string;
  content: string;
  isOwnReview?: boolean;
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
    console.error('BackendReview is null or undefined');
    throw new Error('BackendReview is required for transformation');
  }

  try {
    // Safely extract reviewer with more defensive checks
    const reviewer = backendReview.reviewer || {};
    const product = backendReview.product || {};
    const verification = backendReview.verification || {};

    // Safely extract reviewer name with fallbacks
    const firstName = reviewer.firstName || '';
    const lastName = reviewer.lastName || '';
    const reviewerName = `${firstName} ${lastName}`.trim() || 'Anonymous User';
    
    return {
      id: backendReview._id || 'unknown',
      title: backendReview.title || 'Untitled Review',
      rating: Number(backendReview.overallRating) || 1,
     
      date: new Date(backendReview.publishedAt || backendReview.submittedAt || Date.now()).toLocaleDateString(),
      content: backendReview.content || '',
   
      reviewer: {
        id: reviewer._id || '',
        firstName: firstName,
        lastName: lastName,
        avatar: reviewer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewerName)}&background=f3f4f6&color=374151`,
        title: reviewer.title || 'Verified User',
        isVerified: Boolean(reviewer.isVerified),
        companyName: reviewer.companyName || '',
        companySize: reviewer.companySize || '',
        industry: reviewer.industry || '',
        slug: reviewer.slug || '',
      },
      product: {
        _id: product._id || '',
        name: product.name || '',
        slug: product.slug || '',
        userId: product.userId || '',
      },
      verification: {
        isVerified: Boolean(verification.isVerified),
        verificationType: verification.verificationType || '',
        verificationData: verification.verificationData || {},
        verifiedAt: verification.verifiedAt || '',
      },
    };
  } catch (error) {
    console.error('Error in transformBackendReview:', error, 'Review data:', backendReview);
    throw error;
  }
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
