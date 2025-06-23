import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChevronRightIcon } from 'lucide-react';
import { UserInfo } from '@/store/useUserStore';
import { formatNumber } from '@/utils/formatNumber';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface ProfileSidebarProps {
  user: UserInfo;
  sidebarItems: SidebarItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  user,
  sidebarItems,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      {/* Profile Header */}
      <div className="flex items-center space-x-4 mb-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={user?.avatar || '/api/placeholder/64/64'} alt="Profile" />
          <AvatarFallback className="text-lg">{user?.displayName}</AvatarFallback>
        </Avatar>
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-xl font-black text-gray-800">
              {formatNumber(user?.followers)}
            </div>
            <div className="text-sm text-gray-500">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black text-gray-800">
              {formatNumber(user?.following)}
            </div>
            <div className="text-sm text-gray-500">Following</div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">{user?.displayName}</h3>
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
            className={`w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors duration-200  ${
              activeTab === item.id
                ? 'bg-blue-600 text-white rounded-full'
                : 'text-gray-700 rounded-lg'
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