import { ApiService, ApiResponse } from './api';
import { Notification, NotificationsResponse, NotificationListParams } from '../types/notification';

export class NotificationService {
  private static readonly BASE_URL = '/notifications';

  /**
   * Get list of notifications with pagination
   */
  static async getNotifications(params: NotificationListParams = {}): Promise<ApiResponse<NotificationsResponse>> {
    const { page = 1, limit = 10, unreadOnly = false } = params;
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(unreadOnly && { unreadOnly: 'true' })
    });

    const response = await ApiService.get<Notification[]>(`${this.BASE_URL}?${queryParams}`);
    
    // Transform the response to match the expected NotificationsResponse structure
    if (response.success && response.data) {
      return {
        ...response,
        data: {
          notifications: response.data,
          total: response.meta?.total || 0,
          pagination: response.meta?.pagination || { page, limit }
        }
      };
    }
    
    return response as ApiResponse<NotificationsResponse>;
  }

  /**
   * Mark a specific notification as read
   */
  static async markAsRead(notificationId: string): Promise<ApiResponse<Notification>> {
    return ApiService.patch<Notification>(`${this.BASE_URL}/${notificationId}/read`);
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(): Promise<ApiResponse<null>> {
    return ApiService.patch<null>(`${this.BASE_URL}/read-all`);
  }

  /**
   * Get unread notifications count
   */
  static async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    return ApiService.get<{ count: number }>(`${this.BASE_URL}/unread-count`);
  }

  /**
   * Delete a notification
   */
  static async deleteNotification(notificationId: string): Promise<ApiResponse<null>> {
    return ApiService.delete<null>(`${this.BASE_URL}/${notificationId}`);
  }
} 