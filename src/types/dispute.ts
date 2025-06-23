export interface Author {
  name: string;
  avatarUrl?: string;
}

export interface DisputedReview {
  id: string;
  title: string;
  rating: number;
  date: string;
  content: string;
}

export interface Dispute {
  id: string;
  disputer: Author;
  date: string;
  reason: string;
  status: 'Active' | 'Resolved' | 'Dismissed';
  explanation: string;
  claims: string[];
} 