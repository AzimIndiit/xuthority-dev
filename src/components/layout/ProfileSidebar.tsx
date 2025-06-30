import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChevronRightIcon } from 'lucide-react';
import { formatNumber } from '@/utils/formatNumber';
import { getTruncatedDisplayName, getUserDisplayName, getUserInitials } from '@/utils/userHelpers';
import { User } from '@/services/auth';

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

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  user,
  sidebarItems,
  activeTab,
  onTabChange,
  onFollowersClick,
  onFollowingClick,
}) => {
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
              {formatNumber(user?.followers || 0)}
            </div>
            <div className="text-sm text-gray-500 ">Followers</div>
          </button>
          <button
            onClick={onFollowingClick}
            className="text-center rounded-lg p-2 transition-all duration-200 cursor-pointer group"
            disabled={!onFollowingClick}
          >
            <div className="text-xl font-black text-gray-800 ">
              {formatNumber(user?.following || 0)}
            </div>
            <div className="text-sm text-gray-500 ">Following</div>
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">{getTruncatedDisplayName(user, 15)}</h3>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>

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