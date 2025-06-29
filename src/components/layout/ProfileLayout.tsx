import React from 'react';
import ProfileSidebar from './ProfileSidebar';
import { User } from '@/services/auth';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface ProfileLayoutProps {
  user: User;
  sidebarItems: SidebarItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  breadcrumb: {
    home: string;
    current: string;
  };
  children: React.ReactNode;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({
  user,
  sidebarItems,
  activeTab,
  onTabChange,
  breadcrumb,
  children,
  onFollowersClick,
  onFollowingClick
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full lg:max-w-screen-xl mx-auto px-4 lg:px-6  py-4 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-4">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <ProfileSidebar
              user={user}
              sidebarItems={sidebarItems}
              activeTab={activeTab}
              onTabChange={onTabChange}
              onFollowersClick={onFollowersClick}
              onFollowingClick={onFollowingClick}
            />
          </div>

          {/* Right Content */}
          <div className="col-span-4 lg:col-span-3  lg:px-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout; 