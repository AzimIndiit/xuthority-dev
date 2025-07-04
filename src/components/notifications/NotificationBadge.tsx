import React from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useUnreadNotificationsCount } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { routePaths } from '@/config/routePaths';

interface NotificationBadgeProps {
  className?: string;
  iconClassName?: string;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  className,
  iconClassName,
}) => {
  const { isLoggedIn } = useAuth();
  const { data: unreadCount = 0 } = useUnreadNotificationsCount();

  // Don't show if user is not logged in
  if (!isLoggedIn) {
    return null;
  }

  return (
    <Link
      to={routePaths.NOTIFICATIONS}
      className={cn(
        'relative p-2 rounded-lg hover:bg-gray-100 transition-colors',
        className
      )}
      aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ''}`}
    >
      <Bell className={cn('w-5 h-5 text-gray-600', iconClassName)} />
      
      {/* Unread count badge */}
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
}; 