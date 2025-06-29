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

interface ConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'default' | 'destructive';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'destructive',
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 rounded-xl flex flex-col items-center justify-center">
        <DialogHeader >
          <DialogTitle className="text-xl font-bold text-center">{title}</DialogTitle>
          <DialogDescription className="text-gray-600 pt-2 text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4 sm:justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" className='rounded-full' variant="outline" >
              {cancelText}
            </Button>
          </DialogClose>
          <Button type="button" className='rounded-full bg-blue-600 text-white hover:bg-blue-700' variant={confirmVariant} onClick={onConfirm} > 
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal; 