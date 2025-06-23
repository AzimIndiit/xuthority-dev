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

interface WriteAnswreModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const WriteAnswreModal: React.FC<WriteAnswreModalProps> = ({ isOpen, onOpenChange }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-8 rounded-xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl font-bold">Write Answer</DialogTitle>
          <DialogDescription className="text-base text-gray-500 pt-2">
            Write your answer to the question and get insights from experts, vendors, and experienced users.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="answer" className="text-base font-semibold text-gray-900">
            Answer
          </Label>
          <Textarea
            placeholder="Type Your Answer..."
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

export default WriteAnswreModal; 