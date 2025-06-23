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
import useUserStore from '@/store/useUserStore';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile-details');
  const { user } = useUserStore();

  if (!user) {
    // Render a loading state or redirect if the user is not available
    return <div>Loading...</div>;
  }

  const getInitials = (name: string) => {
    const names = name?.split(' ');
    const initials = names?.map(n => n[0])?.join('');
    return initials?.toUpperCase();
  };

  const userForProfile = {
    ...user,
    initials: getInitials(user?.displayName),
  };

  const initialProfileData: ProfileFormData = {
    avatar: user?.avatar || '',
    displayName: user?.displayName || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    region: 'USA',
    description:
      'As a Reviewer provides insightful and balanced evaluations of tools and services, focusing on usability, functionality, and real-world impact. Their feedback reflects hands-on experience, offering valuable guidance to others seeking the best solutions for their business needs.',
    industry: 'IT and Services',
    title: 'Product Manager',
    companyName: 'infotech Pvt. Ltd',
    companySize: '100-200 Employees',
    linkedinUrl: 'https://www.linkedin.com/in/nikol-hansen',
    twitterUrl: 'https://twitter.com/nikol_hansen',
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

  const onSubmit = (data: ProfileFormData) => {
    console.log('Profile data submitted:', data);
    // Here you would typically dispatch an action or call an API
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile-details':
        return <ProfileDetailsForm initialData={initialProfileData} onSubmit={onSubmit} />;
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