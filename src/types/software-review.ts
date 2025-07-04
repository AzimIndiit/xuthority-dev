export interface Software {
  id: string;
  name: string;
  avgRating: number;
  totalReviews: number;
  category?: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  brandColor?: string;
  slug?: string;
  userId?: string;
}

export interface SoftwareReview {
  id: string;
  title: string;
  overallRating: number;
  updatedAt: string;
  content: string;
  isHelpful?: boolean;
  helpfulVotes?: {
    count: number;
    userId: string;
  };
  commentsCount?: number;
  author?: {
    id: string;
    name: string;
    avatar?: string;
    verified?: boolean;
  };
  tags?: string[];
  pros?: string[];
  cons?: string[];
  verified?: boolean;
  totalReplies?: number;

}

export interface SoftwareReviewCardProps {
  software: Software;
  review: SoftwareReview;
  onHelpfulClick?: (reviewId: string) => void;
  onCommentClick?: (reviewId: string) => void;
  onAuthorClick?: (authorId: string) => void;
  className?: string;
  showAuthor?: boolean;
  showTags?: boolean;
  showProsCons?: boolean;
  compact?: boolean;
  showComments?: boolean;
  showDispute?: boolean;
  showAction?: boolean;
}

export interface ReviewFilters {
  rating?: number;
  dateRange?: {
    from: Date;
    to: Date;
  };
  category?: string;
  verified?: boolean;
  sortBy?: 'date' | 'rating' | 'helpful';
  sortOrder?: 'asc' | 'desc';
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verifiedReviews: number;
  helpfulReviews: number;
} 