import { useState, useEffect } from 'react';

export interface NotificationPreferences {
  reviews: boolean;
  comments: boolean;
  badges: boolean;
  followers: boolean;
}

const defaultPreferences: NotificationPreferences = {
  reviews: true,
  comments: false,
  badges: true,
  followers: false,
};

export const useNotificationSettings = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('notificationPreferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences({ ...defaultPreferences, ...parsed });
      } catch (err) {
        console.error('Failed to parse notification preferences:', err);
      }
    }
  }, []);

  const updatePreference = (type: keyof NotificationPreferences, value: boolean) => {
    setPreferences(prev => {
      const updated = { ...prev, [type]: value };
      // Save to localStorage
      localStorage.setItem('notificationPreferences', JSON.stringify(updated));
      return updated;
    });
  };

  const savePreferences = async (newPreferences: NotificationPreferences) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setPreferences(newPreferences);
      localStorage.setItem('notificationPreferences', JSON.stringify(newPreferences));
      
      console.log('Notification preferences saved:', newPreferences);
    } catch (err) {
      setError('Failed to save preferences. Please try again.');
      console.error('Error saving preferences:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem('notificationPreferences');
  };

  return {
    preferences,
    isLoading,
    error,
    updatePreference,
    savePreferences,
    resetPreferences,
  };
}; 