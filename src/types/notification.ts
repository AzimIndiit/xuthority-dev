// Notification types from backend
export type NotificationType = 
  | 'WELCOME'
  | 'PROFILE_UPDATE'
  | 'PASSWORD_CHANGE'
  | 'PRODUCT_REVIEW'
  | 'REVIEW_DISPUTE'
  | 'DISPUTE_STATUS_UPDATE'
  | 'PROFILE_VERIFIED'
  | 'FOLLOW'
  | 'BADGE_REQUEST'
  | 'BADGE_STATUS'
  | 'DISPUTE_EXPLANATION'
  | 'DISPUTE_EXPLANATION_UPDATE';

export type NotificationStatus = 'sent' | 'failed' | 'pending';

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  meta?: Record<string, any>;
  actionUrl?: string;
  isRead: boolean;
  status: NotificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  pagination: {
    page: number;
    limit: number;
  };
}

export interface NotificationIconConfig {
  icon: string;
  bgColor: string;
  iconColor: string;
}

export interface NotificationListParams {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
} 