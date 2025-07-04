import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationService } from '../services/notification';
import { NotificationListParams } from '../types/notification';
import toast from 'react-hot-toast';

// Query keys
export const notificationQueryKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationQueryKeys.all, 'list'] as const,
  list: (params: NotificationListParams) => [...notificationQueryKeys.lists(), params] as const,
  unreadCount: () => [...notificationQueryKeys.all, 'unreadCount'] as const,
};

// Hook for notifications list query
export const useNotifications = (params: NotificationListParams = {}) => {
  return useQuery({
    queryKey: notificationQueryKeys.list(params),
    queryFn: async () => {
      const response = await NotificationService.getNotifications(params);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to fetch notifications');
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for unread notifications count
export const useUnreadNotificationsCount = () => {
  return useQuery({
    queryKey: notificationQueryKeys.unreadCount(),
    queryFn: async () => {
      const response = await NotificationService.getUnreadCount();
      if (response.success && response.data) {
        return response.data.count;
      }
      return 0;
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

// Hook for marking notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await NotificationService.markAsRead(notificationId);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to mark notification as read');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch notifications and unread count
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
    onError: (error: any) => {
      console.error('Mark notification as read error:', error);
      toast.error(error.message || 'Failed to mark notification as read');
    },
  });
};

// Hook for marking all notifications as read
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await NotificationService.markAllAsRead();
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to mark all notifications as read');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch all notification queries
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
      toast.success('All notifications marked as read');
    },
    onError: (error: any) => {
      console.error('Mark all notifications as read error:', error);
      toast.error(error.message || 'Failed to mark all notifications as read');
    },
  });
};

// Hook for deleting a notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await NotificationService.deleteNotification(notificationId);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete notification');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
      toast.success('Notification deleted');
    },
    onError: (error: any) => {
      console.error('Delete notification error:', error);
      toast.error(error.message || 'Failed to delete notification');
    },
  });
}; 