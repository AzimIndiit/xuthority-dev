import React from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useRequestBadge } from '@/hooks/useBadges';

interface BadgeCardProps {
  title: string;
  requestStatus: 'approved' | 'requested' | 'available';
  icon?: string;
  bgColor?: string;
  iconColor?: string;
  badgeId: string;
  onRequestBadge?: () => void;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ 
  title, 
  requestStatus,
  icon,
  bgColor,
  iconColor,
  badgeId
}) => {
  const requestBadgeMutation = useRequestBadge();

  const isDisabled = requestStatus === 'approved' || requestStatus === 'requested';
  const handleRequestBadge = (badgeId: string) => {
    if (!requestBadgeMutation.isPending) {
      requestBadgeMutation.mutate(badgeId);
    }
  };
  const getButtonText = () => {
    switch(requestStatus) {
      case 'approved':
        return 'Approved';
      case 'requested':
        return 'Requested';
      default:
        return 'Request Badge';
    }
  };

  const getButtonClassName = () => {
    if (requestStatus === 'approved' || requestStatus === 'requested') {
      return 'text-green-500 bg-white hover:bg-white cursor-default';
    } else {
      return 'bg-red-500 text-white hover:bg-red-600';
    }
  };

  return (
    <div className="max-w-sm h-64 rounded-2xl p-4 flex flex-col items-center justify-between text-center relative max-h-[200px]" style={{ backgroundColor: requestStatus === 'approved' ? bgColor : '#F4F4F4' }}>
      {/* Icon Container */}
      <div className="w-24 h-24 rounded-full flex items-center justify-center absolute -top-12 left-1/2 transform -translate-x-1/2 shadow-lg border-2 border-white" style={{ backgroundColor: requestStatus === 'approved' ? iconColor : '#F4F4F4' }}>
        <img
          src={icon as string}
          alt={`${title} Badge`}
          style={{ filter: requestStatus === 'approved' ? 'grayscale(0) opacity(1)' : 'grayscale(1) opacity(0.5)' }}
          className="w-16 h-16"
        />
      </div>

      {/* Title - with flex-grow to push button to bottom */}
      <h2 className="text-base font-semibold text-black mt-8 flex-grow flex items-center line-clamp-2">
        {title}
      </h2>

      {/* Status Box - Always at bottom */}
      <Button 
        className={`h-10 w-full ${getButtonClassName()}`}
        onClick={isDisabled ? undefined : () => handleRequestBadge(badgeId)}
        loading={requestBadgeMutation.isPending}
      >
        {getButtonText()} 
      </Button>
    </div>
  );
};

export default BadgeCard; 