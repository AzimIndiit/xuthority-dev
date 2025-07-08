import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { formatDate } from '@/utils/formatDate';
import { getNotificationIcon, getNotificationIconComponent } from '@/utils/notificationIcons';
import { useMarkNotificationAsRead } from '@/hooks/useNotifications';
import { Notification } from '@/types/notification';

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
  className?: string;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClick,
  className,
}) => {
  const navigate = useNavigate();
  const markAsReadMutation = useMarkNotificationAsRead();

  const iconConfig = getNotificationIcon(notification.type);
  const IconComponent = getNotificationIconComponent(notification.type);

  const handleClick = () => {
    // Mark as read if unread
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification._id);
    }

    // Handle navigation if actionUrl is provided
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }

    // Call optional onClick handler
    onClick?.();
  };

  const formatNotificationDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just Now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'min' : 'mins'} ago`;
    } else if (diffInMinutes < 1440) { // Less than 24 hours
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ${hours === 1 ? 'hr' : 'hrs'} ago`;
    } else if (diffInMinutes < 2880) { // Less than 2 days
      return 'Yesterday';
    } else {
      return formatDate(dateString);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 space-y-2 border rounded-md bg-white',
        !notification.isRead && 'bg-blue-50/30',
        className
      )}
    >
      {/* Icon */}
      <div className={cn(
        'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
        iconConfig.bgColor
      )}>
        <IconComponent className={cn('w-5 h-5', iconConfig.iconColor)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              'font-medium text-sm text-gray-900 truncate',
              !notification.isRead && 'font-semibold'
            )}>
              {notification.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {notification.message}
            </p>
          </div>

          {/* Timestamp */}
          <div className="flex-shrink-0 text-xs text-gray-500">
            {formatNotificationDate(notification.createdAt)}
          </div>
        </div>

        {/* Unread indicator */}
        {!notification.isRead && (
          <div className="flex items-center gap-1 mt-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-blue-600 font-medium">New</span>
          </div>
        )}
      </div>
    </div>
  );
}; 