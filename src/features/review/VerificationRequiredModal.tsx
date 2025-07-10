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
              {/* Background elements */}
               <img src="/svg/review/leave.svg" alt="verification-required" className="w-52 h-52" />
             
         
          </div>
          
          <DialogTitle className="text-xl font-bold text-gray-900 mb-2 text-center ">
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