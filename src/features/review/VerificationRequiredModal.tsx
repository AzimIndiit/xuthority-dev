import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface VerificationRequiredModalProps {
  open: boolean;
  onClose: () => void;
  onVerifyNow: () => void;
  onBackToHome: () => void;
}

const VerificationRequiredModal: React.FC<VerificationRequiredModalProps> = ({
  open,
  onClose,
  onVerifyNow,
  onBackToHome,
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => (!open ? onClose() : undefined)}
    >
      <DialogContent className="max-w-md p-8 rounded-2xl text-center">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-6">
            {/* Illustration of person leaving through door */}
            <div className="w-64 h-48 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
              {/* Background elements */}
              <div className="absolute bottom-0 left-4">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M8 32V16L16 8L24 16V32H20V24H12V32H8Z" fill="#4ADE80" />
                  <ellipse cx="20" cy="12" rx="3" ry="2" fill="#22C55E" />
                  <ellipse cx="12" cy="16" rx="2" ry="1.5" fill="#22C55E" />
                </svg>
              </div>
              
              {/* Door */}
              <div className="absolute right-8 top-4 w-16 h-32 bg-orange-300 rounded-lg">
                <div className="w-full h-full bg-orange-400 rounded-lg relative">
                  <div className="absolute right-2 top-16 w-2 h-2 bg-orange-600 rounded-full"></div>
                  <div className="absolute inset-1 border-2 border-orange-500 rounded"></div>
                </div>
              </div>
              
              {/* Person */}
              <div className="relative z-10">
                <svg width="80" height="100" viewBox="0 0 80 100" fill="none">
                  {/* Body */}
                  <ellipse cx="40" cy="85" rx="15" ry="10" fill="#1E40AF" opacity="0.3" />
                  <rect x="30" y="50" width="20" height="35" rx="10" fill="#1E40AF" />
                  
                  {/* Arms */}
                  <ellipse cx="20" cy="60" rx="8" ry="15" fill="#1E40AF" transform="rotate(-20 20 60)" />
                  <ellipse cx="60" cy="65" rx="8" ry="15" fill="#1E40AF" transform="rotate(30 60 65)" />
                  
                  {/* Head */}
                  <circle cx="40" cy="35" r="12" fill="#FCA5A5" />
                  <path d="M35 32L37 34L45 30" stroke="#1E40AF" strokeWidth="2" fill="none" />
                  
                  {/* Hair */}
                  <path d="M28 30C28 22 33 18 40 18C47 18 52 22 52 30" fill="#1E40AF" />
                  
                  {/* Legs */}
                  <rect x="32" y="85" width="6" height="15" rx="3" fill="#1E40AF" />
                  <rect x="42" y="85" width="6" height="15" rx="3" fill="#1E40AF" />
                </svg>
              </div>
            </div>
          </div>
          
          <DialogTitle className="text-2xl font-bold text-gray-900 mb-2 text-center ">
            It's sad to see you leave.
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-base text-center">
            Additional verification is required to continue with this review.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-8">
          <Button
            onClick={onVerifyNow}
            className="w-full rounded-full py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white h-12"
            size="lg"
          >
            Verify Now
          </Button>
          
          <Button
            onClick={onBackToHome}
            variant="link"
            className="text-blue-600 underline text-base hover:text-blue-800 p-0 h-auto"
          >
            Back to Home
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationRequiredModal; 