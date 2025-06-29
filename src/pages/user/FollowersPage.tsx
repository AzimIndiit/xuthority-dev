import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FollowersFollowing from '@/components/user/FollowersFollowing';
import { useProfile } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const FollowersPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers');
  
  // Get current user to determine if they can remove followers
  const { data: currentUser } = useProfile();
  
  // Determine if this is the current user's page (can show remove buttons)
  const isCurrentUser = currentUser?._id === userId;

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h1>
          <p className="text-gray-600 mb-4">The user ID is missing from the URL.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const handleTabChange = (tab: 'followers' | 'following') => {
    setActiveTab(tab);
  
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="mb-4 flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {activeTab === 'followers' ? 'Followers' : 'Following'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isCurrentUser 
                  ? `Manage your ${activeTab}` 
                  : `View user's ${activeTab}`
                }
              </p>
            </div>
            
            {isCurrentUser && (
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <p className="text-sm text-blue-700">
                  {activeTab === 'followers' 
                    ? 'You can remove followers from your profile' 
                    : 'Users you are following'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Followers/Following Component */}
        <FollowersFollowing
          userId={userId}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          showRemoveButton={isCurrentUser && activeTab === 'followers'}
          className="shadow-lg"
        />

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            {isCurrentUser 
              ? 'This is your followers and following page. You can search and manage your connections here.'
              : 'You are viewing another user\'s followers and following list.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default FollowersPage; 