import React, { useState, useEffect } from 'react';
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
import { useCreateAnswer, useUpdateAnswer } from '@/hooks/useCommunity';

interface WriteAnswreModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  questionId?: string;
  isEditMode?: boolean;
  editAnswerId?: string;
  editAnswerContent?: string;
}

const WriteAnswreModal: React.FC<WriteAnswreModalProps> = ({ 
  isOpen, 
  onOpenChange, 
  questionId,
  isEditMode = false,
  editAnswerId,
  editAnswerContent = ''
}) => {
  const [answer, setAnswer] = useState('');
  const createAnswerMutation = useCreateAnswer();
  const updateAnswerMutation = useUpdateAnswer();

  // Set initial content when opening in edit mode
  useEffect(() => {
    if (isOpen && isEditMode && editAnswerContent) {
      setAnswer(editAnswerContent);
    } else if (!isOpen) {
      setAnswer('');
    }
  }, [isOpen, isEditMode, editAnswerContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!answer.trim()) return;

    try {
      if (isEditMode && editAnswerId) {
        // Update existing answer
        await updateAnswerMutation.mutateAsync({
          id: editAnswerId,
          data: { content: answer.trim() }
        });
      } else if (questionId) {
        // Create new answer
        await createAnswerMutation.mutateAsync({
          questionId,
          data: { content: answer.trim() }
        });
      }
      
      // Reset form and close modal on success
      setAnswer('');
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleClose = () => {
    setAnswer('');
    onOpenChange(false);
  };

  const isPending = isEditMode ? updateAnswerMutation.isPending : createAnswerMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg p-8 rounded-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="text-center">
            <DialogTitle className="text-3xl font-bold">
              {isEditMode ? 'Edit Answer' : 'Write Answer'}
            </DialogTitle>
            <DialogDescription className="text-base text-gray-500 pt-2">
              {isEditMode 
                ? 'Update your answer to provide better insights and clarity.'
                : 'Write your answer to the question and get insights from experts, vendors, and experienced users.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="answer" className="text-base font-semibold text-gray-900">
              Answer
            </Label>
            <Textarea
              placeholder="Type Your Answer..."
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="mt-2 min-h-[120px] rounded-lg"
              required
            />
            
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              size="lg" 
              className="w-full bg-blue-600 hover:bg-blue-700 rounded-full h-12"
              disabled={!answer.trim() || isPending}
            >
              {isPending ? (isEditMode ? 'Updating...' : 'Submitting...') : (isEditMode ? 'Update' : 'Submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WriteAnswreModal; 