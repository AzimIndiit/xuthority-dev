import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/useToast";
import ReviewStepper from "@/features/review/ReviewStepper";
import SelectSoftware from "@/features/review/SelectSoftware";
import VerifyIdentity from "@/features/review/VerifyIdentity";
import WriteReview from "@/features/review/WriteReview";
import ReviewComplete from "@/features/review/ReviewComplete";
import { useCurrentStep, useReviewStore } from "@/store/useReviewStore";
import { useUserHasReviewed } from "@/hooks/useReview";

// Skeleton loader for the entire WriteReviewPage
const WriteReviewPageSkeleton = () => (
  <div className="bg-white animate-pulse">
    <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-6">
        {/* Left Column: Stepper Skeleton */}
        <div className="sm:col-span-2 w-full sm:block hidden">
          <div className="space-y-8">
            {/* Stepper steps */}
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile Stepper Skeleton */}
        <div className="sm:col-span-2 w-full sm:hidden block">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-6 bg-gray-200 rounded w-32"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="flex space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-1 h-2 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Content Skeleton */}
        <div className="sm:col-span-4 sm:border-l border-gray-200 sm:px-8">
          <div className="space-y-8">
            {/* Header skeleton */}
            <div className="space-y-4">
              <div className="h-16 bg-gray-200 rounded-lg w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>
            </div>

            {/* Main content skeleton */}
            <div className="space-y-6">
              {/* Section 1 */}
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-10 h-10 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>

              {/* Section 2 */}
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-32"></div>
                <div className="h-12 bg-gray-200 rounded w-full"></div>
              </div>

              {/* Section 3 */}
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-36"></div>
                <div className="h-32 bg-gray-200 rounded w-full"></div>
              </div>

              {/* Section 4 - Sub ratings */}
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-28"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4">
                      <div className="h-5 bg-gray-200 rounded w-32 mb-3"></div>
                      <div className="flex items-center gap-2">
                        {[...Array(8)].map((_, j) => (
                          <div key={j} className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit button skeleton */}
              <div className="flex justify-end pt-4">
                <div className="h-12 bg-gray-200 rounded-full w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const WriteReviewPage = () => {
  const [showStepper, setShowStepper] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStep = useCurrentStep();
  const { setCurrentStep, setVerificationData ,selectedSoftware} = useReviewStore();
  const toast = useToast();
  const { hasReviewed, review, isLoading } = useUserHasReviewed(selectedSoftware?.id); 

  // Handle existing review redirect to edit mode
  useEffect(() => {
    if (hasReviewed && review && selectedSoftware && !isLoading && currentStep !== 4) {
      // User has already reviewed this product, skip to step 3 (WriteReview) for editing
      setCurrentStep(3);
    }
  }, [hasReviewed, review, selectedSoftware, isLoading, setCurrentStep,currentStep]);

  useEffect(() => {
    if (currentStep === 1 && !selectedSoftware) {
      setShowStepper(false);
    }
  }, [currentStep, selectedSoftware]);

  // Scroll to top when reaching step 4 (ReviewComplete)
  useEffect(() => {
    if (currentStep === 4) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [currentStep]);

  // Handle LinkedIn verification callback
  useEffect(() => {
    const linkedinVerified = searchParams.get('linkedin_verified');
    const linkedinData = searchParams.get('linkedin_data');
    const linkedinError = searchParams.get('linkedin_error');

    if (linkedinError) {
      toast.verification.error(`LinkedIn verification failed: ${linkedinError}`);
      // Clear the error parameter
      searchParams.delete('linkedin_error');
      setSearchParams(searchParams);
      return;
    }

    if (linkedinVerified === 'true' && linkedinData) {
      try {
        const parsedLinkedInData = JSON.parse(decodeURIComponent(linkedinData));
        
        // Set verification data
        setVerificationData({
          method: 'linkedin',
          isVerified: true,
          linkedInData: parsedLinkedInData
        });

        toast.verification.success('LinkedIn verification completed successfully!');
        
        // Move to next step
        setCurrentStep(3);
        
        // Clear URL parameters
        searchParams.delete('linkedin_verified');
        searchParams.delete('linkedin_data');
        setSearchParams(searchParams);
        
      } catch (error) {
        console.error('Error parsing LinkedIn data:', error);
        toast.verification.error('Error processing LinkedIn verification data');
        
        // Clear parameters
        searchParams.delete('linkedin_verified');
        searchParams.delete('linkedin_data');
        setSearchParams(searchParams);
      }
    }
  }, [searchParams, setSearchParams, setVerificationData, setCurrentStep]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <SelectSoftware setShowStepper={setShowStepper} />;
      case 2:
        return <VerifyIdentity setShowStepper={setShowStepper} />;
      case 3:
        return <WriteReview setShowStepper={setShowStepper} />;
      case 4:
        return <ReviewComplete setShowStepper={setShowStepper} />;
      default:
        return <SelectSoftware setShowStepper={setShowStepper} />;
    }
  };
if(isLoading) {
  return <WriteReviewPageSkeleton />;
}
  return (
    <div className=" bg-white">
      <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-6">
          {/* Left Column: Stepper */}
               {/* Desktop Stepper */}
          <div className="sm:col-span-2 w-full sm:block hidden ">
            <ReviewStepper setShowStepper={setShowStepper} />
          </div>
          {/* Mobile Stepper */}
          {showStepper && (
            <div className="sm:col-span-2 w-full  sm:hidden block ">
              <ReviewStepper
                setShowStepper={setShowStepper}
             
              />
            </div>
          )}
          {/* Right Column: Step Content */}
           {/* Desktop Stepper */}
           <div className="sm:col-span-4 sm:border-l  border-gray-200 sm:px-8 hidden sm:block">
            {renderCurrentStep()}
          </div>
          {/* Mobile Stepper */}
         {!showStepper && <div className="sm:col-span-4 sm:border-l  border-gray-200 sm:px-8  block sm:hidden">
            {renderCurrentStep()}
          </div>}
          
        </div>
      </div>
    </div>
  );
};

export default WriteReviewPage;
