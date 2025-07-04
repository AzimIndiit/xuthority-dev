import React, { useState } from 'react';
import { Settings, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NotificationItem } from './NotificationItem';
import { useNotifications, useMarkAllNotificationsAsRead } from '@/hooks/useNotifications';
import { NotificationListParams } from '@/types/notification';
import LottieLoader from '@/components/LottieLoader';

interface NotificationsListProps {
  className?: string;
  onNotificationClick?: () => void;
}

export const NotificationsList: React.FC<NotificationsListProps> = ({
  className,
  onNotificationClick,
}) => {
  const [params, setParams] = useState<NotificationListParams>({
    page: 1,
    limit: 20,
  });

  const { data, isLoading, error, isError } = useNotifications(params);
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleLoadMore = () => {
    if (data?.pagination && data.pagination.page * data.pagination.limit < data.total) {
      setParams(prev => ({
        ...prev,
        page: prev.page! + 1,
      }));
    }
  };

  const unreadCount = data?.notifications?.filter(n => !n.isRead).length || 0;

  if (isLoading) {
    return (
      <div className='w-full'>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" disabled>
              Mark All Read
            </Button>
            <Button variant="ghost" size="icon" disabled>
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="p-8 flex flex-col items-center justify-center">
          <LottieLoader />
          <p className="text-gray-500 mt-4">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='w-full'>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" disabled>
              Mark All Read
            </Button>
            <Button variant="ghost" size="icon" disabled>
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="p-8 flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Bell className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-gray-500 text-center">
            Failed to load notifications. Please try again later.
          </p>
          <p className="text-sm text-gray-400 mt-2">{error?.message}</p>
        </div>
      </div>
    );
  }

  const notifications = data?.notifications || [];

  return (
    <div className='w-full'>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0 || markAllAsReadMutation.isPending}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            Mark All Read
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-gray-100">
        {notifications.length === 0 ? (
          <div className="p-8 flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-center">No notifications yet</p>
            <p className="text-sm text-gray-400 mt-2">
              When you have notifications, they'll appear here.
            </p>
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onClick={onNotificationClick}
              />
            ))}

            {/* Load More Button */}
            {data?.pagination && 
             data.pagination.page * data.pagination.limit < data.total && (
              <div className="p-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}; 