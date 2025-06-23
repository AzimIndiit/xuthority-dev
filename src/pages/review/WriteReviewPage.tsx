import React, { useState } from "react";
import ReviewStepper from "@/features/review/ReviewStepper";
import SelectSoftware from "@/features/review/SelectSoftware";
import VerifyIdentity from "@/features/review/VerifyIdentity";
import WriteReview from "@/features/review/WriteReview";
import ReviewComplete from "@/features/review/ReviewComplete";
import { useCurrentStep, useReviewStore } from "@/store/useReviewStore";

const WriteReviewPage = () => {
  const [showStepper, setShowStepper] = useState(true);
  const currentStep = useCurrentStep();
  const setCurrentStep = useReviewStore((state) => state.setCurrentStep);

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

  return (
    <div className="min-h-screen bg-white">
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
