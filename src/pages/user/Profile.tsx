import React, { useState } from 'react';
import {
  UserIcon,
  MessageSquare,
  HeartIcon,
  BellIcon,
  LogOutIcon,
} from 'lucide-react';
import ProfileLayout from '@/components/layout/ProfileLayout';
import ProfileDetailsForm, {
  ProfileFormData,
} from '@/components/user/ProfileDetailsForm';
import { useProfile } from '@/hooks/useAuth';
import { getUserDisplayName, getUserInitials } from '@/utils/userHelpers';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile-details');
  
  // Use the useProfile hook to trigger React Query
  const { data: user, isLoading, error } = useProfile();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !user) {
    return <div>Error loading profile or user not authenticated</div>;
  }

  const userForProfile = {
    ...user,
    initials: getUserInitials(user),
  };

  const initialProfileData: ProfileFormData = {
    avatar: user?.avatar || '',
    displayName: getUserDisplayName(user) || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    region: user?.region || '',
    description: user?.description || '',
    industry: user?.industry || '',
    title: user?.title || '',
    companyName: user?.companyName || '',
    companySize: user?.companySize || '',
    linkedinUrl: user?.socialLinks?.linkedin || '',
    twitterUrl: user?.socialLinks?.twitter || '',
  };

  const sidebarItems = [
    {
      id: 'profile-details',
      label: 'Profile Details',
      icon: <UserIcon className="w-5 h-5" />,
    },
    {
      id: 'my-reviews',
      label: 'My Reviews',
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      id: 'my-favourites',
      label: 'My Favourites',
      icon: <HeartIcon className="w-5 h-5" />,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <BellIcon className="w-5 h-5" />,
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: <LogOutIcon className="w-5 h-5" />,
    },
  ];

  const breadcrumb = {
    home: 'Home',
    current: 'My Profile',
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile-details':
        return <ProfileDetailsForm initialData={initialProfileData} />;
      // Placeholder for other tabs
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 ">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {sidebarItems.find(item => item.id === activeTab)?.label}
            </h2>
            <p className="text-gray-600">Content for {activeTab} will be implemented here.</p>
          </div>
        );
    }
  };

  return (
    <ProfileLayout
      user={userForProfile}
      sidebarItems={sidebarItems}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      breadcrumb={breadcrumb}
    >
      {renderContent()}
    </ProfileLayout>
  );
};

export default ProfilePage;