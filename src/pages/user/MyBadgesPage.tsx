import React from 'react';
import BadgeCard from '@/components/badges/BadgeCard';
import { useAllBadges, useUserBadges, useRequestBadge } from '@/hooks/useBadges';
import SecondaryLoader from '@/components/ui/SecondaryLoader';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyBadgesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: allBadges, isLoading: isLoadingAll } = useAllBadges();
  const { data: userBadges, isLoading: isLoadingUser } = useUserBadges();

  // Check if user is a vendor
  if (user && user.role !== 'vendor') {
    return <Navigate to="/profile" replace />;
  }

  // Use page loader hook to manage loading state
  if (isLoadingAll || isLoadingUser) {
    return <SecondaryLoader text="Loading badges..." containerClasses='min-h-[60vh]' />;
  }

  const badges = Array.isArray(allBadges?.data) ? allBadges.data : [];
  // Create a map of user badges for quick lookup
  const userBadgesData = Array.isArray(userBadges.data) ? userBadges.data : [];

  console.log(userBadgesData,'userBadgesData');


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
              icon={badge.icon}
              bgColor={badge.colorCode}
              iconColor={badge.colorCode}
       
              requestStatus={userStatus as 'approved' | 'requested' | 'available'}
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
    </div>
  );
};

export default MyBadgesPage; 