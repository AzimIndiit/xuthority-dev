export interface Author {
  name: string;
  avatarUrl?: string;
}

export interface Explanation {
  _id: string;
  content: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  createdAt: string;
}

export interface DisputedReview {
  id: string;
  title: string;
  rating: number;
  date: string;
  content: string;
  isOwnReview: boolean;
  firstName: string;
  lastName: string;
  avatar?: string;
  companyName?: string;
  companySize?: string;
  isVerified?: boolean;
  slug?: string;  
}

export interface Dispute {
  id: string;
  disputer: Author;
  date: string;
  reason: string;
  status: 'Active' | 'Resolved' | 'Dismissed';
  description: string;
  explanations?: string;
  claims: string[]; 
  explanationsId?: string;
  // Additional fields for API integration
  isOwner?: boolean;
  vendorId?: string;
  reviewId?: string;
} 