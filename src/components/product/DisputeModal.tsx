import React, { useEffect, useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateDispute, useUpdateDispute } from '@/hooks/useDispute';
import { DISPUTE_REASONS } from '@/services/dispute';
import { X } from 'lucide-react';

interface DisputeModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  reviewId: string;
  isEdit?: boolean;
  dispute?: any;
  onSuccess?: () => void;
}

const DisputeModal: React.FC<DisputeModalProps> = ({ 
  isOpen, 
  onOpenChange,
  reviewId,
  isEdit,
  dispute,
  onSuccess
}) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const createDisputeMutation = useCreateDispute();
  const updateDisputeMutation = useUpdateDispute();

  useEffect(() => {
    if (isOpen) {
      if (isEdit && dispute) {
       
        setReason(dispute.reasonValue || dispute.reason);
        setDescription(dispute.description || '');
        setStatus(dispute.status || '');
      } else {
        // Reset values for create mode
        setReason('');
        setDescription('');
        setStatus('');
      }
    }
  }, [isOpen, isEdit, dispute]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason || !description.trim() || description.trim().length < 10) {
      return;
    }

    try {
      if (isEdit) {
        await updateDisputeMutation.mutateAsync({
          id: dispute.id,
          data: {
            reason: reason as any,
            description: description.trim(),
            status: status.toLowerCase() as any
          }
        });
      } else {  
        await createDisputeMutation.mutateAsync({
        reviewId,
        reason: reason as any,
        description: description.trim()
      });
      }
      // Reset form and close modal on success
      setReason('');
      setDescription('');
      setStatus('');
      onOpenChange(false);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleClose = () => {
    setReason('');
    setDescription('');
    setStatus('');
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <div className="relative">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          
          <form onSubmit={handleSubmit}>
            <DialogHeader className="p-6 pb-4">
              <DialogTitle className="text-2xl font-bold text-center">
                {isEdit? 'Edit Dispute': 'Dispute a Review'}
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600 mt-2">
                Describe your issue, and we'll review it to find a solution.
              </DialogDescription>
            </DialogHeader>
            
            <div className="px-6 pb-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-sm font-medium text-gray-700">
                  Reason
                </Label>
                <Select
                  value={reason}
                  onValueChange={setReason}
                  required
                  disabled={createDisputeMutation.isPending || updateDisputeMutation.isPending}
                >
                  <SelectTrigger 
                    id="reason"
                    className="w-full h-12 rounded-full border-gray-300"
                  >
                    <SelectValue placeholder="Select Reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {DISPUTE_REASONS.map((disputeReason) => (
                      <SelectItem 
                        key={disputeReason.value} 
                        value={disputeReason.value}
                      >
                        {disputeReason.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Explain dispute in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[150px] rounded-lg border-gray-300 resize-none"
                  required
                  minLength={10}
                  disabled={createDisputeMutation.isPending || updateDisputeMutation.isPending}
                  maxLength={2000}
                />
                <p className="text-xs text-gray-500 text-right">
                  {description.length}/2000 characters
                </p>
              </div>

              {isEdit &&
                 <div className="space-y-2">
                 <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                   Status
                 </Label>
                    <Select
                    disabled={updateDisputeMutation.isPending}
                    value={status}
                    onValueChange={setStatus}
                    required
                  >
                    <SelectTrigger 
                      id="status"
                      className="w-full h-12 rounded-full border-gray-300"
                    >
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {['active', 'resolved'].map((status) => (
                        <SelectItem 
                          key={status} 
                          value={status}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  </div>
                  }

              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-base font-medium"
                disabled={!reason || !description.trim() || description.trim().length < 10 || (isEdit && !status) || createDisputeMutation.isPending || updateDisputeMutation.isPending}
              >
                {createDisputeMutation.isPending || updateDisputeMutation.isPending ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DisputeModal; 