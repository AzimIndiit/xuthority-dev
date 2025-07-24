import React, { useState } from 'react';
import { useRequestBadge } from '@/hooks/useBadges';
import { useToast } from '@/hooks/useToast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface BadgeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  badgeId: string;
  badgeTitle: string;
}

const BadgeRequestModal: React.FC<BadgeRequestModalProps> = ({
  isOpen,
  onClose,
  badgeId,
  badgeTitle
}) => {
  const [reason, setReason] = useState('');
  const requestBadgeMutation = useRequestBadge();
  const toast = useToast();

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for requesting this badge');
      return;
    }

    try {
      await requestBadgeMutation.mutateAsync({
        badgeId,
        reason: reason.trim()
      });
      
      toast.success('Badge request submitted successfully!');
      setReason('');
      onClose();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error?.message || 'Failed to submit badge request';
      toast.error(errorMessage);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !requestBadgeMutation.isPending) {
      setReason('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-6 rounded-2xl text-center">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Request Badge
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-center">
            Tell us why you need this badge and how it will help you access
            the right features or services.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6 ">
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium text-gray-700">
              Reason
            </Label>
            <Textarea
              id="reason"
              value={reason}

              onChange={(e) => setReason(e.target.value)}
              placeholder="Write Your Reason..."
              rows={5}
              disabled={requestBadgeMutation.isPending}
              className="resize-none"
              maxLength={500}
            />
            <div className="text-right text-xs text-gray-400">
              {reason.length}/500
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!reason.trim() || requestBadgeMutation.isPending}

            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-medium"
            loading={requestBadgeMutation.isPending}
          >
        Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BadgeRequestModal; 