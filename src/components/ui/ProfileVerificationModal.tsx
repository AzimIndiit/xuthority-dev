import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ProfileVerificationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
}

const ProfileVerificationModal: React.FC<ProfileVerificationModalProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 rounded-2xl flex flex-col items-center justify-center">
        <div className="flex flex-col items-center w-full p-8">
          {/* Dummy illustration */}
          <div className="w-48 h-48 mb-6 flex items-center justify-center">
            {/* Replace with real SVG later */}
            <img src='/svg/profile-verification.svg' alt='profile verification' className='w-full h-full' />
          </div>
          <DialogHeader className="w-full">
            <DialogTitle className="text-2xl font-bold text-center mb-2">Profile Verification in Progress</DialogTitle>
            <DialogDescription className="text-gray-500 text-center text-sm mb-6">
              We’re reviewing your profile details to ensure everything is accurate and secure. Once verified, you’ll have full access to all features and can start interacting with the community. Thank you for your patience!
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex justify-center items-center">
            <Button
              type="button"
              className="rounded-full w-full max-w-xs bg-blue-600 text-white hover:bg-blue-700 text-base font-semibold py-3"
              onClick={onConfirm}
            >
              Ok Got It
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileVerificationModal;