import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useReviewStore, useUserName } from "@/store/useReviewStore";
import { Heart, Star, ThumbsUp } from "lucide-react";
import useUserStore from "@/store/useUserStore";

interface ReviewCompleteProps {
  setShowStepper?: (show: boolean) => void;
}

const ReviewComplete: React.FC<ReviewCompleteProps> = ({ setShowStepper }) => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const { resetReview } = useReviewStore();
  const userName = useUserName();
  
  const handleGoHome = () => {
    resetReview(); // Clear the review data
    navigate("/"); // Navigate to home page
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen ">
      <div className=" w-full text-center">
        
        {/* Illustration - Responsive sizing */}
        <div className="mb-8 sm:mb-12 relative">
          <svg
            width="100%"
            height="auto"
            viewBox="0 0 400 300"
            fill="none"
            className="mx-auto max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl"
          >
            {/* Background clouds */}
            <ellipse cx="100" cy="50" rx="60" ry="30" fill="#E0F2FE" opacity="0.6" />
            <ellipse cx="300" cy="80" rx="70" ry="35" fill="#EFF6FF" opacity="0.8" />
            <ellipse cx="200" cy="250" rx="80" ry="40" fill="#DBEAFE" opacity="0.7" />
            
            {/* Laptop */}
            <rect x="150" y="180" width="100" height="60" rx="5" fill="#374151" />
            <rect x="155" y="185" width="90" height="50" rx="2" fill="#1F2937" />
            <rect x="140" y="240" width="120" height="8" rx="4" fill="#6B7280" />
            
            {/* Laptop screen elements */}
            <rect x="160" y="195" width="70" height="3" rx="1" fill="#3B82F6" />
            <rect x="160" y="205" width="50" height="2" rx="1" fill="#9CA3AF" />
            <rect x="160" y="210" width="60" height="2" rx="1" fill="#9CA3AF" />
            <rect x="160" y="215" width="40" height="2" rx="1" fill="#9CA3AF" />
            
            {/* Person */}
            <ellipse cx="120" cy="200" rx="25" ry="12" fill="#F59E0B" opacity="0.3" />
            <rect x="105" y="150" width="30" height="50" rx="15" fill="#F59E0B" />
            <circle cx="120" cy="130" r="18" fill="#FBBF24" />
            <rect x="95" y="160" width="15" height="25" rx="7" fill="#F59E0B" transform="rotate(-15 102 172)" />
            <rect x="130" y="160" width="15" height="25" rx="7" fill="#F59E0B" transform="rotate(15 137 172)" />
            <rect x="110" y="200" width="8" height="30" rx="4" fill="#1E40AF" />
            <rect x="122" y="200" width="8" height="30" rx="4" fill="#1E40AF" />
            
            {/* Hair */}
            <path d="M102 125 C102 115 108 110 120 110 C132 110 138 115 138 125" fill="#1E40AF" />
            
            {/* Floating review elements */}
            
            {/* Heart icon */}
            <g transform="translate(60, 40)">
              <circle cx="15" cy="15" r="15" fill="#EF4444" />
              <svg x="9" y="9" width="12" height="12" viewBox="0 0 24 24" fill="white">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </g>
            
            {/* 5-star rating badge */}
            <g transform="translate(280, 30)">
              <rect x="0" y="0" width="80" height="25" rx="12" fill="#10B981" />
              <g transform="translate(8, 5)">
                {[0, 1, 2, 3, 4].map((i) => (
                  <svg key={i} x={i * 12} y="0" width="10" height="10" viewBox="0 0 24 24" fill="white">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                  </svg>
                ))}
              </g>
            </g>
            
            {/* Review card 1 */}
            <g transform="translate(80, 80)">
              <rect x="0" y="0" width="120" height="50" rx="8" fill="white" style={{filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))"}} />
              <circle cx="15" cy="15" r="8" fill="#6366F1" />
              <rect x="28" y="10" width="60" height="3" rx="1" fill="#E5E7EB" />
              <rect x="28" y="18" width="40" height="2" rx="1" fill="#E5E7EB" />
              <g transform="translate(28, 25)">
                {[0, 1, 2].map((i) => (
                  <svg key={i} x={i * 8} y="0" width="6" height="6" viewBox="0 0 24 24" fill="#FCD34D">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                  </svg>
                ))}
              </g>
              <rect x="10" y="35" width="80" height="2" rx="1" fill="#E5E7EB" />
              <rect x="10" y="40" width="60" height="2" rx="1" fill="#E5E7EB" />
            </g>
            
            {/* Thumbs up icon */}
            <g transform="translate(320, 120)">
              <circle cx="15" cy="15" r="15" fill="#3B82F6" />
              <svg x="9" y="9" width="12" height="12" viewBox="0 0 24 24" fill="white">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
              </svg>
            </g>
            
            {/* Review card 2 */}
            <g transform="translate(250, 160)">
              <rect x="0" y="0" width="100" height="45" rx="8" fill="white" style={{filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))"}} />
              <circle cx="12" cy="12" r="6" fill="#8B5CF6" />
              <rect x="24" y="8" width="50" height="2" rx="1" fill="#E5E7EB" />
              <rect x="24" y="14" width="30" height="2" rx="1" fill="#E5E7EB" />
              <g transform="translate(24, 20)">
                {[0, 1, 2, 3].map((i) => (
                  <svg key={i} x={i * 6} y="0" width="5" height="5" viewBox="0 0 24 24" fill="#FCD34D">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                  </svg>
                ))}
              </g>
              <rect x="8" y="30" width="60" height="2" rx="1" fill="#E5E7EB" />
              <rect x="8" y="35" width="45" height="2" rx="1" fill="#E5E7EB" />
            </g>
            
            {/* Review card 3 */}
            <g transform="translate(50, 190)">
              <rect x="0" y="0" width="110" height="48" rx="8" fill="white" style={{filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))"}} />
              <circle cx="13" cy="13" r="7" fill="#EC4899" />
              <rect x="26" y="8" width="55" height="3" rx="1" fill="#E5E7EB" />
              <rect x="26" y="16" width="35" height="2" rx="1" fill="#E5E7EB" />
              <g transform="translate(26, 22)">
                {[0, 1, 2, 3, 4].map((i) => (
                  <svg key={i} x={i * 7} y="0" width="5" height="5" viewBox="0 0 24 24" fill="#FCD34D">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                  </svg>
                ))}
              </g>
              <rect x="10" y="32" width="70" height="2" rx="1" fill="#E5E7EB" />
              <rect x="10" y="37" width="50" height="2" rx="1" fill="#E5E7EB" />
            </g>
            
            {/* Star rating badge */}
            <g transform="translate(30, 110)">
              <rect x="0" y="0" width="70" height="22" rx="11" fill="#3B82F6" />
              <g transform="translate(6, 4)">
                {[0, 1, 2, 3, 4].map((i) => (
                  <svg key={i} x={i * 11} y="0" width="8" height="8" viewBox="0 0 24 24" fill="white">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                  </svg>
                ))}
              </g>
            </g>
            
            {/* Heart floating */}
            <g transform="translate(320, 220)">
              <circle cx="12" cy="12" r="12" fill="#EF4444" />
              <svg x="7" y="7" width="10" height="10" viewBox="0 0 24 24" fill="white">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </g>
          </svg>
        </div>
        
        {/* Thank you message - Responsive text sizing */}
        <h1 className="text-xl sm:text-3xl  font-bold text-red-500 mb-4 sm:mb-6 leading-tight ">
          {user?.displayName}, thanks for your review!
        </h1>
        
        {/* Description - Responsive text and spacing */}
        <p className="text-base  text-gray-600 mb-8 sm:mb-12 leading-relaxed ">
          Once approved, your review will be publicly viewable on XUTHORITY. We require 3 business days 
          to moderate all submit reviews. Thank You!
        </p>
        
        {/* Go to Home Button - Responsive sizing */}
        <div className="px-4">
          <Button
            onClick={handleGoHome}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full text-xs sm:text-sm font-semibold transition-all transform hover:scale-105 shadow-lg w-full sm:w-auto max-w-xs sm:max-w-none sm:h-12 h-10"
          >
            Go To Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewComplete; 