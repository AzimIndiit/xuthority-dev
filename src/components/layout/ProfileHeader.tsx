import React from 'react';

interface ProfileHeaderProps {
  breadcrumb: {
    home: string;
    current: string;
  };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ breadcrumb }) => {
  return (
    <div className="bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-300 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-700">{breadcrumb.home}</span>
          <span className="text-gray-400">/</span>
          <span className="text-blue-600 font-medium">{breadcrumb.current}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader; 