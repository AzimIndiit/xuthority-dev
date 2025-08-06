import React from 'react';

export const LegalPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6 py-16">
        {/* Title skeleton */}
        <div className="h-10 md:h-12 bg-gray-300 rounded w-64 mb-8"></div>
        
        <div className="space-y-8">
          {/* Last updated skeleton */}
          <div className="h-4 bg-gray-300 rounded w-40 mb-6"></div>
          
          {/* Intro paragraphs skeleton */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-5 bg-gray-300 rounded w-full"></div>
              <div className="h-5 bg-gray-300 rounded w-5/6"></div>
              <div className="h-5 bg-gray-300 rounded w-4/6"></div>
            </div>
            <div className="space-y-2">
              <div className="h-5 bg-gray-300 rounded w-full"></div>
              <div className="h-5 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>

          {/* Section skeletons */}
          {[1, 2, 3, 4, 5].map((section) => (
            <div key={section} className="space-y-4">
              {/* Section title skeleton */}
              <div className="h-8 bg-gray-300 rounded w-72 mb-4"></div>
              
              {/* Section content skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-4/5"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
              </div>
              
              {/* List items skeleton */}
              {section % 2 === 0 && (
                <div className="pl-6 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              )}
            </div>
          ))}

          {/* Contact section skeleton */}
          <div className="space-y-4">
            <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
            <div className="p-4 bg-gray-200 rounded-lg">
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-64"></div>
                <div className="h-4 bg-gray-300 rounded w-56"></div>
                <div className="h-4 bg-gray-300 rounded w-48"></div>
                <div className="h-4 bg-gray-300 rounded w-52"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};