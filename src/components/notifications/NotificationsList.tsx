import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowLeftIcon, Bell, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NotificationItem } from './NotificationItem';
import { NotificationSettings } from './NotificationSettings';
import { useNotifications, useMarkAllNotificationsAsRead } from '@/hooks/useNotifications';
import { NotificationListParams } from '@/types/notification';
import LottieLoader from '@/components/LottieLoader';
import SecondaryLoader from '../ui/SecondaryLoader';
import { useNavigate } from 'react-router-dom';

// Skeleton component for the header
const HeaderSkeleton = () => (
  <div className="flex items-center justify-between mb-6 animate-pulse">
    <div className='flex items-center gap-2'>
      <span className="block lg:hidden">
        <div className="w-6 h-6 bg-gray-200 rounded" />
      </span>
      <div className="h-8 bg-gray-200 rounded w-40" />
    </div>
    <div className="flex items-center gap-2">
      <div className="h-8 bg-gray-200 rounded w-24" />
      <div className="h-8 w-8 bg-gray-200 rounded" />
    </div>
  </div>
);

// Skeleton component for individual notification items
const NotificationItemSkeleton = () => (
  <div className="p-4 animate-pulse">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
          <div className="ml-4 flex flex-col items-end space-y-1">
            <div className="h-3 bg-gray-200 rounded w-12" />
            <div className="w-2 h-2 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Skeleton component for the notifications list
const NotificationsListSkeleton = () => (
  <div className="divide-y divide-gray-100">
    {[...Array(8)].map((_, index) => (
      <NotificationItemSkeleton key={index} />
    ))}
  </div>
);

// Complete page skeleton
const NotificationsPageSkeleton = () => {
  const navigate = useNavigate();
  
  return (
    <div className='w-full'>
      <HeaderSkeleton />
      <NotificationsListSkeleton />
    </div>
  );
};

interface NotificationsListProps {
  className?: string;
  onNotificationClick?: () => void;
}

export const NotificationsList: React.FC<NotificationsListProps> = ({
  className,
  onNotificationClick,
}) => {
  const navigate = useNavigate();
  const [params, setParams] = useState<NotificationListParams>({
    page: 1,
    limit: 20,
  });
  
  // State to accumulate all notifications across pages
  const [allNotifications, setAllNotifications] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  const { data, isLoading, error, isError, isFetching } = useNotifications(params);
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  // Update accumulated notifications when new data arrives
  useEffect(() => {
    if (data?.notifications) {
      if (params.page === 1) {
        // First page - replace all notifications
        setAllNotifications(data.notifications);
      } else {
        // Subsequent pages - append new notifications
        setAllNotifications(prev => {
          // Filter out duplicates based on _id
          const existingIds = new Set(prev.map(notif => notif._id));
          const newNotifications = data.notifications.filter(notif => !existingIds.has(notif._id));
          return [...prev, ...newNotifications];
        });
      }
      
      // Check if there's more data to load
      const totalLoaded = params.page * params.limit;
      setHasMoreData(totalLoaded < (data.total || 0));
      setIsLoadingMore(false);
    }
  }, [data, params.page, params.limit]);

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleLoadMore = () => {
    if (hasMoreData && !isLoadingMore && !isFetching) {
      setIsLoadingMore(true);
      setParams(prev => ({
        ...prev,
        page: prev.page! + 1,
      }));
    }
  };

  // Reset pagination when component mounts or when mark all as read is called
  useEffect(() => {
    if (markAllAsReadMutation.isSuccess) {
      setParams({ page: 1, limit: 20 });
      setAllNotifications([]);
      setHasMoreData(true);
    }
  }, [markAllAsReadMutation.isSuccess]);

  const unreadCount = allNotifications.filter(n => !n.isRead).length || 0;

  // Show skeleton when loading initial page
  if (isLoading && params.page === 1) {
    return <NotificationsPageSkeleton />;
  }

  return (
    <div className='w-full'>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className='flex items-center gap-2'> 
          <span className="block lg:hidden cursor-pointer" onClick={() => navigate(-1)}>
            <ArrowLeftIcon className="w-6 h-6 text-gray-600 hover:text-gray-900" />
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Notifications
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0 || markAllAsReadMutation.isPending}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            {markAllAsReadMutation.isPending ? 'Marking...' : 'Mark All Read'}
          </Button>
          <NotificationSettings />
        </div>
      </div>

      {/* Notifications List */}
      {isError ? (
        <div className='w-full min-h-[60vh] flex items-center justify-center min-h-[50vh]'>
          <div className="p-8 flex flex-col items-center justify-center">
 
            <p className="text-gray-500 text-center">
              Failed to load notifications. Please try again later.
            </p>
            <p className="text-sm text-gray-400 mt-2">{error?.message}</p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {allNotifications.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
             
              <img src="/svg/no_data.svg" alt="no-notifications" className="w-1/4 mb-4" />
              <p className="text-gray-500 text-center">No notifications yet</p>
              <p className="text-sm text-gray-400 mt-2">
                When you have notifications, they'll appear here.
              </p>
            </div>
          ) : (
            <div className='space-y-2'>
              {allNotifications.map((notification, index) => (
                <div 
                  key={notification._id}
                  className=""
                  style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
                >
                  <NotificationItem
                    notification={notification}
                    onClick={onNotificationClick}
                  />
                </div>
              ))}

              {/* Load More Button */}
              {hasMoreData && (
                <div className="p-6 border-t border-gray-200 flex justify-center">
                  <Button
                    onClick={handleLoadMore}
                    variant="outline"
                    size="lg"
                    disabled={isLoadingMore || isFetching}
                    className="rounded-full !text-sm min-w-[120px] transition-all duration-200 hover:scale-105"
                  >
                    {isLoadingMore || isFetching ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        Loading...
                      </div>
                    ) : (
                      'Load More'
                    )}
                  </Button>
                </div>
              )}

              {/* Loading skeleton for new items */}
              {isLoadingMore && (
                <div className="divide-y divide-gray-100">
                  {[...Array(3)].map((_, i) => (
                    <NotificationItemSkeleton key={`skeleton-${i}`} />
                  ))}
                </div>
              )}

              {/* End of list indicator */}
              {!hasMoreData && allNotifications.length > 10 && (
                <div className="p-4 text-center">
                  <p className="text-sm text-gray-500">You've reached the end of your notifications</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 