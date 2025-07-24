import React, { useState } from 'react';
import BadgeCard from '@/components/badges/BadgeCard';
import BadgeRequestModal from '@/components/badges/BadgeRequestModal';
import { useAllBadges, useUserBadges, useRequestBadge } from '@/hooks/useBadges';
import SecondaryLoader from '@/components/ui/SecondaryLoader';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Skeleton component for the header
const HeaderSkeleton = () => (
  <div className="animate-pulse">
    <div className="mb-8 flex items-center justify-between">
      <div className='flex items-center gap-2'>
        <span className="block lg:hidden">
          <div className="w-6 h-6 bg-gray-200 rounded" />
        </span>
        <div className="h-8 bg-gray-200 rounded w-32" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-5 bg-gray-200 rounded w-full max-w-4xl" />
      <div className="h-5 bg-gray-200 rounded w-3/4 max-w-4xl" />
    </div>
  </div>
);

// Skeleton component for individual badge cards
const BadgeCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
    <div className="flex flex-col items-center text-center space-y-3">
      {/* Badge icon placeholder */}
      <div className="w-12 h-12 bg-gray-200 rounded-full" />
      
      {/* Badge title placeholder */}
      <div className="h-4 bg-gray-200 rounded w-20" />
      
      {/* Status button placeholder */}
      <div className="h-8 bg-gray-200 rounded-full w-24" />
    </div>
  </div>
);

// Skeleton component for the badges grid
const BadgesGridSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 space-y-12 mt-20">
    {[...Array(12)].map((_, index) => (
      <BadgeCardSkeleton key={index} />
    ))}
  </div>
);

// Complete page skeleton
const MyBadgesPageSkeleton = () => {
  const navigate = useNavigate();
  
  return (
    <div className="">
      <HeaderSkeleton />
      <BadgesGridSkeleton />
    </div>
  );
};

const MyBadgesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: allBadges, isLoading: isLoadingAll } = useAllBadges();
  const { data: userBadges, isLoading: isLoadingUser } = useUserBadges();

  // Modal state
  const [selectedBadge, setSelectedBadge] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if user is a vendor
  if (user && user.role !== 'vendor') {
    return <Navigate to="/profile" replace />;
  }

  // Show skeleton when loading
  if (isLoadingAll || isLoadingUser) {
    return <MyBadgesPageSkeleton />;
  }

  const badges = Array.isArray(allBadges?.data) ? allBadges.data : [];
  // Create a map of user badges for quick lookup
  const userBadgesData = Array.isArray(userBadges.data) ? userBadges.data : [];

  console.log(userBadgesData,'userBadgesData');

  // Handle badge request
  const handleBadgeRequest = (badgeId: string, badgeTitle: string) => {
    setSelectedBadge({ id: badgeId, title: badgeTitle });
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBadge(null);
  };

  return (
    <div className="">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
      <div className='flex items-center gap-2'> 
      <span className="block lg:hidden" onClick={() => navigate(-1)}>
            {" "}
            <ArrowLeftIcon className="w-6 h-6" />
          </span>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
        
          My Badges</h1>
        
      </div>
      </div>
      <p className="text-gray-600 text-lg max-w-4xl">
          Become a Verified Vendor! Request badges for your active contributions, level up, and showcase your 
          achievements on your profile. Grow your business and enjoy the journey!
        </p>
      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 space-y-12 mt-20">
        {badges.map((badge) => {
          const userStatus = userBadgesData.find((ub :any) => ub.badgeId === badge._id)?.status;
          return (
            <BadgeCard
              key={badge._id}
              badgeId={badge._id}
              title={badge.title}
              description={badge.description}
              icon={badge.icon}
              bgColor={badge.colorCode}
              iconColor={badge.colorCode}
              requestStatus={userStatus as 'approved' | 'requested' | 'available'}
              onRequest={() => handleBadgeRequest(badge._id, badge.title)}
            />
          );
        })}
      </div>

      {/* Empty State */}
      {badges.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No badges available at the moment.</p>
        </div>
      )}

      {/* Badge Request Modal */}
      {selectedBadge && (
        <BadgeRequestModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          badgeId={selectedBadge.id}
          badgeTitle={selectedBadge.title}
        />
      )}
    </div>
  );
};

export default MyBadgesPage; 