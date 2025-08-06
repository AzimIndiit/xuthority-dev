import React from 'react';
import { Button } from '@/components/ui/button';
import { HeroSection, ValuesSection, FeatureSection, LandingPageSkeleton } from '@/components/common';
import { useAuthenticatedAction } from '@/hooks/useAuthenticatedAction';
import TestimonialsCarousel from '@/components/home/TestimonialsCarousel';
import useUserStore from '@/store/useUserStore';
import useUIStore from '@/store/useUIStore';
import { useLandingPageSection } from '@/hooks/useLandingPageSection';

export const ForVendorsPage: React.FC = () => {
  const { isLoggedIn } = useUserStore();
  const { openAuthModal } = useUIStore();
  const { executeAction } = useAuthenticatedAction({
    redirectTo: '/write-review',
    resetReviewStore: true
  });
  
  // Fetch hero section data from admin configuration
  const { data: heroData, isLoading: heroLoading } = useLandingPageSection('vendor', 'hero');
  
  // Use admin-configured text or fallback to defaults
  const heroHeading = heroData?.heading || "Trusted Reviews to Grow Your Business.";
  const heroSubtext = heroData?.subtext || "Harness the power of genuine customer reviews to establish trust, enhance your reputation, and drive business growth. By showcasing real user experiences, you can attract more clients and make data-driven decisions that lead to long-term success.";

  // Fetch trusted tech section data from admin configuration
  const { data: trustedTechData, isLoading: trustedTechLoading } = useLandingPageSection('vendor', 'trustedTech');
  
  // Transform trustedTech cards data to values format
  const customValues = trustedTechData?.cards?.map((card: any, index: number) => ({
    id: card.id || index + 1,
    title: card.heading,
    description: card.subtext,
    image: index === 0 ? "/svg/for-vendors/section_1_1.svg" : index === 1 ? "/svg/for-vendors/section_1_2.svg" : "/svg/for-vendors/section_1_3.svg",
    imageAlt: card.heading
  })) || [
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
  const trustedTechHeading = trustedTechData?.heading || "Join Us";
  const trustedTechButtonText = trustedTechData?.buttonText || "Join Us";

  const handleClaimProfile = () => {
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }
  };
  
  // Fetch reach buyers section data from admin configuration
  const { data: reachBuyersData, isLoading: reachBuyersLoading } = useLandingPageSection('vendor', 'reachBuyers');
  
  // Use admin-configured text or fallback to defaults
  const reachBuyersHeading = reachBuyersData?.heading || "Reach More Potential Buyers for Your Software.";
  const reachBuyersSubtext = reachBuyersData?.subtext || "Experience seamless coordination and personalized attention with our Dedicated Project Manager. From inception to execution, your project will be in expert hands, ensuring efficient communication, timely deliverables, and a tailored approach that meets your unique objectives.";
  const reachBuyersButtonText = reachBuyersData?.buttonText || "Claim Your Profile";

  // Check if any section is loading
  const isPageLoading = heroLoading || trustedTechLoading || reachBuyersLoading;

  // Return skeleton if page is loading
  if (isPageLoading) {
    return <LandingPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection
        title={heroHeading}
        subtitle={heroSubtext}
        backgroundImage="/svg/home_bg.svg"
        illustration="/svg/for-vendors/section_1.svg"
        illustrationAlt="Manage and master your reviews illustration"
      />

      {/* Our Values Section */}
      <ValuesSection
        title={trustedTechHeading}
        values={customValues}
        buttonText={trustedTechButtonText}
        onButtonClick={handleClaimProfile}
      />

      {/* Feature Section */}
      <FeatureSection
        title={reachBuyersHeading}
        description={reachBuyersSubtext}
        illustration="/svg/home/home_section_3.svg"
        illustrationAlt="Leave a review illustration"
        reverse={true}

      
      >
       {!isLoggedIn && <Button
          onClick={handleClaimProfile}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 py-3 shadow transition-all"
        >
         {reachBuyersButtonText} <span aria-hidden className="ml-2">→</span>
        </Button>}
      </FeatureSection>

      {/* Testimonials */}
      <TestimonialsCarousel />
    </div>
  );
}; 