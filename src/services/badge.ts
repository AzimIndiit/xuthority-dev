import api from './api';

export interface Badge {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  criteria?: string[];
  colorCode?: string;
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
  requested?: boolean;
  approved?: boolean;
}

export interface UserBadge {
  _id: string;
  badge: Badge;
  status: 'approved' | 'requested' | 'pending' | 'accepted';
  requestedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

export interface BadgeRequestData {
  badgeId: string;
  reason: string;
}

export interface BadgesResponse {
  data: Badge[];
  meta?: {
    pagination: {
      total: number;
      page: number;
      limit: number;
    }
  }
}

export interface UserBadgesResponse {
  data: UserBadge[];
  meta?: {
    pagination: {
      total: number;
      page: number;
      limit: number;
    }
  }
}

export const getUserBadges = async (): Promise<UserBadgesResponse> => {
  const response = await api.get('/user-badges/me');
  console.log(response.data,'response');
  return response.data;
};

export const getAllBadges = async (): Promise<BadgesResponse> => {
  const response = await api.get('/badges');
  return response.data;
};

export const requestBadge = async (data: BadgeRequestData): Promise<UserBadge> => {
  const response = await api.post('/user-badges/request', data);
  return response.data.data;
}; 