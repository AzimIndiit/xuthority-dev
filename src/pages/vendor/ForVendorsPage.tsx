import React from 'react';
import { Button } from '@/components/ui/button';
import { HeroSection, ValuesSection, FeatureSection } from '@/components/common';
import { useAuthenticatedAction } from '@/hooks/useAuthenticatedAction';
import TestimonialsCarousel from '@/components/home/TestimonialsCarousel';
import useUserStore from '@/store/useUserStore';
import useUIStore from '@/store/useUIStore';

export const ForVendorsPage: React.FC = () => {
  const { isLoggedIn } = useUserStore();
  const { openAuthModal } = useUIStore();
  const { executeAction } = useAuthenticatedAction({
    redirectTo: '/write-review',
    resetReviewStore: true
  });

  const handleClaimProfile = () => {
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }
  };

  

  const customValues = [
    {
      id: 1,
      title: "Amplify Customer Feedback",
      description: "We simplify the process of gathering customer feedback, ensuring their voices are heard and helping you build trust.",
      image: "/svg/for-vendors/section_1_1.svg",
      imageAlt: "Innovation icon"
    },
    {
      id: 2,
      title: "One Easy Platform",
      description: "Access all the tools you need to capture customer feedback and leverage intent data to drive informed business decisions.",
      image: "/svg/for-vendors/section_1_2.svg",
      imageAlt: "Success icon"
    },
    {
      id: 3,
      title: "Win More Deals",
      description: "Track in-market buyers, boost win rates, and reduce churn with actionable intent signals for better outcomes.",
      image: "/svg/for-vendors/section_1_3.svg",
      imageAlt: "Success icon"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection
        title="Trusted Reviews to Grow Your Business."
        subtitle="Harness the power of genuine customer reviews to establish trust, enhance your reputation, and drive business growth. By showcasing real user experiences, you can attract more clients and make data-driven decisions that lead to long-term success."
        backgroundImage="/svg/home_bg.svg"
        illustration="/svg/for-vendors/section_1.svg"
        illustrationAlt="Manage and master your reviews illustration"
      />

      {/* Our Values Section */}
      <ValuesSection
        title="Empowering Tech Vendors to Sell with Trust!"
        values={customValues}
        buttonText="Join Us"
        onButtonClick={handleClaimProfile}
      />

      {/* Feature Section */}
      <FeatureSection
        title="Reach More Potential Buyers for Your Software."
        description="Experience seamless coordination and personalized attention with our Dedicated Project Manager. From inception to execution, your project will be in expert hands, ensuring efficient communication, timely deliverables, and a tailored approach that meets your unique objectives."
        illustration="/svg/home/home_section_3.svg"
        illustrationAlt="Leave a review illustration"
        reverse={true}

      
      >
       {!isLoggedIn && <Button
          onClick={handleClaimProfile}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 py-3 shadow transition-all"
        >
         Claim Your Profile <span aria-hidden className="ml-2">→</span>
        </Button>}
      </FeatureSection>

      {/* Testimonials */}
      <TestimonialsCarousel />
    </div>
  );
}; 