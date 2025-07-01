export interface Review {
  id: string;
  title: string;
  rating: number;
  date: string;
  content: string;
  author: {
    name: string;
    avatarUrl: string;
    title: string;
    verified?: boolean;
  };
  tags: string[];
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
