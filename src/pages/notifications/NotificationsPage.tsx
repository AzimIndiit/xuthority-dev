import React from 'react';
import { NotificationsList } from '@/components/notifications/NotificationsList';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export const NotificationsPage: React.FC = () => {
  const { isLoggedIn } = useAuth();

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
        <NotificationsList />
  );
}; 