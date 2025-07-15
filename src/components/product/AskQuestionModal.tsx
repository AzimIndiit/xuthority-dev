import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCreateQuestion } from '@/hooks/useCommunity';
import useUIStore from '@/store/useUIStore';
import useUserStore from '@/store/useUserStore';

interface AskQuestionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  productSlug?: string;
}

const AskQuestionModal: React.FC<AskQuestionModalProps> = ({ isOpen, onOpenChange, productSlug }) => {
  const [question, setQuestion] = useState('');
  const createQuestionMutation = useCreateQuestion(productSlug);
  const { isLoggedIn } = useUserStore();
  const { openAuthModal } = useUIStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }
    
    if (!question.trim()) return;

    try {
      await createQuestionMutation.mutateAsync({
        title: question.trim(),
      });
      
      // Reset form and close modal on success
      setQuestion('');
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleClose = () => {
    setQuestion('');
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg p-8 rounded-xl ">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="text-center">
            <DialogTitle className="text-3xl font-bold">Ask Question</DialogTitle>
            <DialogDescription className="text-base text-gray-500 pt-2">
              Have a question? Ask the community and get insights from experts, vendors, and experienced users.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="question" className="text-base font-semibold text-gray-900">
              Question
            </Label>
            <Textarea
              placeholder="Type Your Question..."
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="mt-2 min-h-[120px] max-h-[300px] rounded-lg resize-none break-all"
              required
              maxLength={1000}
            />
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={!question.trim() || createQuestionMutation.isPending}
              loading={createQuestionMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full"
            >
              Submit Question
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AskQuestionModal; 