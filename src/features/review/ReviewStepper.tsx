import React from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { useCurrentStep, useReviewStore } from "@/store/useReviewStore";
import useUserStore from '@/store/useUserStore';
import useUIStore from '@/store/useUIStore';

const ReviewStepper: React.FC<{setShowStepper: (show: boolean) => void}> = ({setShowStepper}) => {
  const currentStep = useCurrentStep();
  const { isLoggedIn } = useUserStore();
  const openAuthModal = useUIStore((state) => state.openAuthModal);
  const setCurrentStep = useReviewStore((state) => state.setCurrentStep);
  const steps = [
    "Select Software and Services",
    "Verify Your Identity", 
    "Leave a Review",
    "Finished"
  ];

  return (
    <div className=" rounded-lg">
      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8 leading-tight">
        Write your review to follow<br />
        these simple steps.
      </h2>
      
      {/* Steps */}
      <div className="space-y-0">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isFuture = stepNumber > currentStep;

          return (
            <div
              key={index}
              onClick={() => {
                if(!isLoggedIn) {
                  openAuthModal();
                  return;
                }
                setCurrentStep(stepNumber);
                setShowStepper(false);
              }}
              className="flex items-center justify-between py-6 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex items-center">
                <span
                  className={`text-base  font-medium ${
                    isCompleted || isActive 
                      ? "text-gray-900" 
                      : "text-gray-400"
                  }`}
                >
                  {step}
                </span>
              </div>
              
              <div className="flex items-center mr-4">
                {isCompleted && (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                )}
                {(isActive || isFuture) && (
                  <ChevronRight 
                    className={`h-6 w-6 ${
                      isActive ? "text-gray-900" : "text-gray-400"
                    }`} 
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewStepper; 