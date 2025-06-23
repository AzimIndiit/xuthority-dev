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
  logo: string;
  rating: number;
  reviewsCount: number;
  logoBackground?: string;
}
