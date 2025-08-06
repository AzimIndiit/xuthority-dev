import React from 'react';

export const LandingPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="relative flex flex-col min-h-[70dvh] w-full overflow-hidden bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="text-center mx-auto my-20">
            {/* Title skeleton */}
            <div className="h-12 sm:h-16 bg-gray-300 rounded-lg w-3/4 mx-auto mb-6"></div>
            {/* Subtitle skeleton */}
            <div className="space-y-3 w-full sm:max-w-5xl mx-auto">
              <div className="h-6 lg:h-8 bg-gray-300 rounded w-full"></div>
              <div className="h-6 lg:h-8 bg-gray-300 rounded w-5/6 mx-auto"></div>
              <div className="h-6 lg:h-8 bg-gray-300 rounded w-4/6 mx-auto"></div>
            </div>
          </div>
          {/* Illustration skeleton */}
          <div className="flex justify-center -mb-[60px] px-4 sm:px-6">
            <div className="w-full max-w-xl mx-auto h-[200px] md:h-[220px] lg:h-[330px] bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </section>

      {/* Values Section Skeleton */}
      <div className="py-24 bg-gradient-to-b from-gray-100/50 via-white to-gray-100/50">
        <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="h-10 md:h-12 bg-gray-300 rounded-lg w-64 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((index) => (
              <div key={index} className="border bg-gray-50/60 border-gray-200 rounded-lg p-8">
                <div className="flex justify-center mb-6">
                  <div className="w-52 h-52 bg-gray-300 rounded-lg"></div>
                </div>
                <div className="h-6 bg-gray-300 rounded w-full mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Button skeleton */}
          <div className="text-center">
            <div className="h-12 bg-gray-300 rounded-full w-40 mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Feature Section Skeleton */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="h-10 bg-gray-300 rounded w-3/4 mb-6"></div>
              <div className="space-y-3 mb-8">
                <div className="h-5 bg-gray-300 rounded w-full"></div>
                <div className="h-5 bg-gray-300 rounded w-5/6"></div>
                <div className="h-5 bg-gray-300 rounded w-4/6"></div>
              </div>
              <div className="h-12 bg-gray-300 rounded-full w-48"></div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="w-full h-[300px] lg:h-[400px] bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section Skeleton */}
      <div className="py-16 bg-gray-50">
        <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-96 mx-auto"></div>
          </div>
          <div className="flex justify-center gap-8">
            {[1, 2, 3].map((index) => (
              <div key={index} className="bg-white rounded-lg p-6 w-80 hidden md:block">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-20"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};