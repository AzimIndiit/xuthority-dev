import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChevronRightIcon } from 'lucide-react';
import { formatNumber } from '@/utils/formatNumber';
import { getTruncatedDisplayName, getUserDisplayName, getUserInitials } from '@/utils/userHelpers';
import { User } from '@/services/auth';
import { useUserProfileStats } from '@/hooks/useAuth';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface ProfileSidebarProps {
    user: User;
  sidebarItems: SidebarItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
}

// Skeleton component for Profile Header
const ProfileHeaderSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      {/* Profile Header Skeleton */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full" />
        <div className="flex items-center space-x-6">
          <div className="text-center rounded-lg p-2">
            <div className="h-6 w-12 bg-gray-200 rounded mb-1" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
          <div className="text-center rounded-lg p-2">
            <div className="h-6 w-12 bg-gray-200 rounded mb-1" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-40 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

// Skeleton component for Navigation Menu Items with role-based menu count
const NavigationMenuSkeleton: React.FC<{ userRole?: string }> = ({ userRole = 'user' }) => {
  // Different menu counts based on role
  const getMenuItemCount = (role: string) => {
    switch (role) {
      case 'vendor':
        return 6; // Vendors typically have: Profile, Products, Reviews, Followers, Notifications, Settings
      case 'user':
      default:
        return 5; // Regular users have: Profile, Reviews, Favorites, Followers, Settings
    }
  };

  const menuItemCount = getMenuItemCount(userRole);

  return (
    <nav className="space-y-2">
      {[...Array(menuItemCount)].map((_, index) => (
        <div
          key={index}
          className="w-full flex items-center justify-between px-4 py-3.5 rounded-full animate-pulse"
        >
          <div className="flex items-center space-x-4">
            <div className="w-6 h-6 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
          <div className="w-5 h-5 bg-gray-200 rounded" />
        </div>
      ))}
    </nav>
  );
};

// Complete skeleton component for the entire sidebar with role handling
const ProfileSidebarSkeleton: React.FC<{ userRole?: string }> = ({ userRole = 'user' }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <ProfileHeaderSkeleton />
      
      {/* Divider */}
      <div className="border-t border-gray-200 mb-4"></div>
      
      {/* Navigation Menu Skeleton with role-based items */}
      <NavigationMenuSkeleton userRole={userRole} />
    </div>
  );
};

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  user,
  sidebarItems,
  activeTab,
  onTabChange,
  onFollowersClick,
  onFollowingClick,
}) => {
  const { data: userStats, isLoading: userStatsLoading } = useUserProfileStats(user?._id || '');
  
  // Show complete skeleton when loading or no user data
  if (userStatsLoading || !user) {
    return <ProfileSidebarSkeleton userRole={user?.role} />;
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 ">
      {/* Profile Header */}
      <div className="flex items-center space-x-4 mb-4">
        <Avatar className="w-16 h-16">
          <AvatarImage className="object-cover" src={user?.avatar || ''} alt="Profile" />
          <AvatarFallback className="text-lg">{getUserInitials(user)}</AvatarFallback>
        </Avatar>
        <div className="flex items-center space-x-6">
          <button
            onClick={onFollowersClick}
            className="text-center  rounded-lg p-2 transition-all duration-200 cursor-pointer group"
            disabled={!onFollowersClick}
          >
            <div className="text-xl font-black text-gray-800 ">
              {formatNumber(userStats?.followers || 0)}
            </div>
            <div className="text-sm text-gray-500 ">Followers</div>
          </button>
          <button
            onClick={onFollowingClick}
            className="text-center rounded-lg p-2 transition-all duration-200 cursor-pointer group"
            disabled={!onFollowingClick}
          >
            <div className="text-xl font-black text-gray-800 ">
              {formatNumber(userStats?.following || 0)}
            </div>
            <div className="text-sm text-gray-500 ">Following</div>
          </button>
        </div>
      </div>

      {user?._id && <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">{getTruncatedDisplayName(user, 20)}</h3>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>}

      {/* Divider */}
      <div className="border-t border-gray-200 mb-4"></div>

      {/* Navigation Menu */}
      <nav className="space-y-2">
        {sidebarItems.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors duration-200 cursor-pointer  ${
              activeTab === item.id
                ? 'bg-blue-600 text-white rounded-full'
                : 'text-gray-700 rounded-full hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center justify-center w-6 h-6 ${
                  activeTab === item.id ? 'text-white' : 'text-gray-600'
                }`}
              >
                {item.icon}
              </div>
              <span className="font-semibold text-base">{item.label}</span>
            </div>
            <ChevronRightIcon
              className={`w-5 h-5 transition-transform ${
                activeTab === item.id ? 'text-white' : 'text-gray-400'
              }`}
            />
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ProfileSidebar; 