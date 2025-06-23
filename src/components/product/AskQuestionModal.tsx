import React from 'react';
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

interface AskQuestionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const AskQuestionModal: React.FC<AskQuestionModalProps> = ({ isOpen, onOpenChange }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-8 rounded-xl">
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
            className="mt-2 min-h-[120px] rounded-lg"
          />
        </div>
        <DialogFooter>
          <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 rounded-full">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AskQuestionModal; 