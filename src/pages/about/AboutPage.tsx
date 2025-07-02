import React from 'react';
import { Button } from '@/components/ui/button';
import { HeroSection, ValuesSection, FeatureSection } from '@/components/common';
import { useAuthenticatedAction } from '@/hooks/useAuthenticatedAction';
import TestimonialsCarousel from '@/components/home/TestimonialsCarousel';

export const AboutPage: React.FC = () => {
  const { executeAction } = useAuthenticatedAction({
    redirectTo: '/write-review',
    resetReviewStore: true
  });

  const handleWriteReview = () => {
    executeAction();
  };

  const handleJoinUs = () => {
    executeAction();
  };

  const customValues = [
    {
      id: 1,
      title: "Real People, Real Reviews, 100% Verified",
      description: "Every reviewer is verified by multi-step processes to ensure only genuine product reviews surface.",
      image: "/svg/about-us/section_2_2.svg",
      imageAlt: "Innovation icon"
    },
    {
      id: 2,
      title: "Ad-Free, Unbiased Reviews",
      description: "We maintain complete transparency by not selling paid placements. Every review and ranking is based on genuine user feedback.",
      image: "/svg/about-us/section_2_3.svg",
      imageAlt: "Success icon"
    },
    {
      id: 3,
      title: "Prioritizing Excellence",
      description: "Each review is vetted for quality, depth, and detail by our Research Team before publishing.",
      image: "/svg/about-us/section_2_1.svg",
      imageAlt: "Success icon"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection
        title="Manage & Master Your Reviews!"
        subtitle="XUTHORITY is the trusted platform for managing and optimizing reviews. Businesses and professionals rely on it to track, respond to, and leverage customer feedback—powered by real, verified insights to build credibility and trust."
        backgroundImage="/svg/home_bg.svg"
        illustration="/svg/about-us/section_1.svg"
        illustrationAlt="Manage and master your reviews illustration"
      />

      {/* Our Values Section */}
      <ValuesSection 
        title="Why Choose Us"
        values={customValues}
        buttonText="Write a Review"
        onButtonClick={handleWriteReview}
      />

      {/* Feature Section */}
      <FeatureSection
        title="Achieve More. We're Here to Help."
        description="XUTHORITY is transforming the way businesses manage feedback by prioritizing real, user-driven insights. Instead of relying on biased ratings, we empower you with authentic customer experiences to build trust and make informed decisions. Your reputation, backed by real voices, helps you reach new heights."
        illustration="/svg/home/home_section_1.svg"
        illustrationAlt="Leave a review illustration"
        reverse={true}
      >
        <Button
          onClick={handleWriteReview}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 py-3 shadow transition-all"
        >
          Write a Review <span aria-hidden className="ml-2">→</span>
        </Button>
      </FeatureSection>

      {/* Testimonials */}
      <TestimonialsCarousel />
    </div>
  );
}; 