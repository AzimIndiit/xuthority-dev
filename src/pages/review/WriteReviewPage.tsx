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
  return <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
    <p className="text-gray-600">Checking existing review...</p>
  </div>
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
