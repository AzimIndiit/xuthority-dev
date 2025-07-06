import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotificationSettings, NotificationPreferences } from '@/hooks/useNotificationSettings';

interface NotificationSettingsProps {
  className?: string;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  className,
}) => {
  const { preferences, isLoading, error, savePreferences } = useNotificationSettings();
  const [localPreferences, setLocalPreferences] = useState<NotificationPreferences>(preferences);

  // Update local preferences when the hook preferences change
  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handlePreferenceChange = (type: keyof NotificationPreferences, value: boolean) => {
    const newPreferences = {
      ...localPreferences,
      [type]: value,
    };
    setLocalPreferences(newPreferences);
    // Save immediately when changed
    savePreferences(newPreferences);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-6" align="end">
        <DropdownMenuLabel className="text-base font-semibold mb-4 p-0">
          Notification Settings
        </DropdownMenuLabel>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="font-medium text-gray-900">Reviews Notifications</div>
            <Switch
              checked={localPreferences.reviews}
              onCheckedChange={(checked) => handlePreferenceChange('reviews', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="font-medium text-gray-900">Comments Notifications</div>
            <Switch
              checked={localPreferences.comments}
              onCheckedChange={(checked) => handlePreferenceChange('comments', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="font-medium text-gray-900">Badges Notifications</div>
            <Switch
              checked={localPreferences.badges}
              onCheckedChange={(checked) => handlePreferenceChange('badges', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="font-medium text-gray-900">Followers Notifications</div>
            <Switch
              checked={localPreferences.followers}
              onCheckedChange={(checked) => handlePreferenceChange('followers', checked)}
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 rounded-md">
            <div className="text-sm text-red-600">
              {error}
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 