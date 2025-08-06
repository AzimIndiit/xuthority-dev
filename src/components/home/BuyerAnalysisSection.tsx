import { Button } from "../ui/button";
import { useLandingPageSection } from "@/hooks/useLandingPageSection";

export default function BuyerAnalysisSection() {
  // Fetch buyer insights section data from admin configuration
  const { data: insightsData, isLoading } = useLandingPageSection('user', 'insights');
  
  // Use admin-configured text or fallback to defaults
  const heading = insightsData?.heading || 'Our Analysis of Buyer Behavior!';
  const subtext = insightsData?.subtext || 'AI drives increased software spending, but buyers demand quick ROI, according to a 2024 Buyer Behavior Report based on a survey of over 1,900 B2B buyers worldwide';
  const buttonText = insightsData?.buttonText || 'Download Report';

  if (isLoading) {
    return (
      <section className="w-full bg-[#f1f8ff] py-24 px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="w-full lg:max-w-screen-xl mx-auto flex flex-col-reverse md:flex-row items-center md:gap-12 justify-between">
          {/* Text Content Skeleton */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
            <div className="h-12 sm:h-14 md:h-16 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="space-y-3 w-full max-w-lg">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
            </div>
            <div className="h-12 bg-gray-300 rounded-full w-44 mt-6"></div>
          </div>
          {/* Illustration Skeleton */}
          <div className="w-full sm:w-1/2 flex justify-center mb-8 md:mb-0">
            <div className="w-full h-40 sm:h-80 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#f1f8ff] py-24 px-4 sm:px-6 lg:px-8">
      <div className="w-full lg:max-w-screen-xl mx-auto flex flex-col-reverse md:flex-row items-center  md:gap-12 justify-between">
        {/* Text Content */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-5xl  text-gray-900 mb-4" dangerouslySetInnerHTML={{ __html: heading.replace(/\n/g, '<br class="hidden sm:block" />') }} />
          <p className="text-gray-600 mb-6 max-w-lg leading-relaxed">
            {subtext}
          </p>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 py-3 shadow transition-all"
          >
            {buttonText} <span aria-hidden className="ml-2">→</span>
          </Button>
        </div>
        {/* Illustration */}
        <div className="w-full sm:w-1/2 flex justify-center mb-8 md:mb-0">
          <img
            src="/svg/home/home_section_2.svg"
    
            alt="Buyer analysis illustration"
            className="w-full h-40 sm:h-80 w object-contain " 
          />
        </div>
      </div>
    </section>
  );
} 