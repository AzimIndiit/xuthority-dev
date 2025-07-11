import React from 'react';
import { cn } from '@/lib/utils';
import { ResourceTab } from '@/types/resource';

interface ResourceTabsProps {
  activeTab: ResourceTab;
  onTabChange: (tab: ResourceTab) => void;
  className?: string;
  tabs: { id: ResourceTab; label: string; slug: string }[];
}

const ResourceTabs: React.FC<ResourceTabsProps> = ({
  activeTab,
  onTabChange,
  className,
  tabs
}) => {
  return (
    <div className={cn('mb-8', className)}>
      {/* Mobile: Horizontal scroll container */}
      <div className="md:hidden">
        <div className="overflow-x-auto scrollbar-hide px-4 -mx-4">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit min-w-full" style={{ scrollBehavior: 'smooth' }}>
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.slug)}
                className={cn(
                  'px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer flex-shrink-0 touch-manipulation',
                  // Add extra margin to first and last items for better mobile UX
                  index === 0 && 'ml-1',
                  index === tabs.length - 1 && 'mr-1',
                  activeTab === tab.slug
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 active:bg-gray-200'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: Normal flex layout */}
      <div className="hidden md:block">
        <div className="flex flex-wrap items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.slug)}
              className={cn(
                'px-4 py-4 text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer',
                activeTab === tab.slug
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourceTabs; 