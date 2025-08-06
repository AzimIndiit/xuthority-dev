import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import useUserStore from "@/store/useUserStore";
import useUIStore from "@/store/useUIStore";
import { useReviewStore } from "@/store/useReviewStore";
import { useLandingPageSection } from "@/hooks/useLandingPageSection";

export default function LeaveReviewSection() {
  const { setSelectedSoftware, setCurrentStep } = useReviewStore();
  const { isLoggedIn,user } = useUserStore();
  const { openAuthModal } = useUIStore();
  const navigate = useNavigate();
  
  // Fetch review CTA section data from admin configuration
  const { data: reviewCtaData, isLoading } = useLandingPageSection('user', 'reviewCta');
  
  // Use admin-configured text or fallback to defaults
  const heading = reviewCtaData?.heading || 'Experience with Software? Leave a Review!';
  const subtext = reviewCtaData?.subtext || 'Experience seamless coordination and personalized attention with our Dedicated Project Manager. From inception to execution, your project will be in expert hands, ensuring efficient communication, timely deliverables, and a tailored approach that meets your unique objectives.';
  const buttonText = reviewCtaData?.buttonText || 'Write a Review';

  if (isLoading) {
    return (
      <section className="w-full bg-white py-24 px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="w-full lg:max-w-screen-xl mx-auto flex flex-col-reverse sm:flex-row-reverse items-center sm:gap-12">
          {/* Text Content Skeleton */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
            <div className="h-12 md:h-14 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="space-y-3 w-full max-w-lg">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
            </div>
            <div className="h-12 bg-gray-300 rounded-full w-40 mt-6"></div>
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
    <section className="w-full bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="w-full lg:max-w-screen-xl mx-auto flex flex-col-reverse sm:flex-row-reverse items-center  sm:gap-12">
        {/* Text Content */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-2xl  md:text-5xl  text-gray-900 mb-4" dangerouslySetInnerHTML={{ __html: heading.replace(/\n/g, '<br class="hidden sm:block" />') }} />
          <p className="text-gray-600 mb-6 max-w-lg leading-relaxed">
            {subtext}
          </p>
         {(!isLoggedIn  || user?.role === 'user' ) && <Button
            onClick={()=>{
              if (!isLoggedIn) {
                openAuthModal();
                return;
              }
              setSelectedSoftware(null);
              setCurrentStep(1);
              navigate('/write-review');
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 py-3 shadow transition-all"
          >
            {buttonText} <span aria-hidden className="ml-2">→</span>
          </Button>}
        </div>
        {/* Illustration */}
        <div className="w-full sm:w-1/2 flex justify-center mb-8 md:mb-0">
          <img
            src="/svg/home/home_section_1.svg"
      
            alt="Leave a review illustration"
            className="w-full h-40 sm:h-80 object-contain " 
          />
        </div>
      </div>
    </section>
  );
} 