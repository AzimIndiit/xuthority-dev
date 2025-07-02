import React from 'react';
import { cn } from '@/lib/utils';

interface VerifiedBadgeProps {
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ className }) => {
  return (
    <div className={cn("w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center", className)}>
      <svg
        className="w-3 h-3 text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}; 