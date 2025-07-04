import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRenameFavoriteList } from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/FormInput';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Form validation schema
const editListSchema = z.object({
  listName: z.string()
    .min(2, 'List name must be at least 2 characters')
    .max(100, 'List name must be less than 100 characters')
    .trim(),
});

type EditListFormData = z.infer<typeof editListSchema>;

interface EditListModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentListName: string;
  onSuccess?: () => void;
  className?: string;
}

const EditListModal: React.FC<EditListModalProps> = ({
  isOpen,
  onOpenChange,
  currentListName,
  onSuccess,
  className
}) => {
  // Form setup with validation
  const methods = useForm<EditListFormData>({
    resolver: zodResolver(editListSchema),
    mode: 'onChange',
    defaultValues: {
      listName: currentListName,
    },
  });

  const { 
    handleSubmit, 
    reset, 
    formState: { isValid, isDirty } 
  } = methods;

  // API hooks
  const renameMutation = useRenameFavoriteList();

  // Form submission handler
  const onSubmit = async (data: EditListFormData) => {
    try {
      await renameMutation.mutateAsync({
        listName: currentListName,
        newListName: data.listName
      });
      
      // Reset form and close modal
      reset();
      onOpenChange(false);
      onSuccess?.();
      
    } catch (error) {
      // Errors are handled by mutation hooks with toast notifications
      console.error('Error renaming list:', error);
    }
  };

  // Handle form errors
  const onError = (errors: any) => {
    console.log('Form validation errors:', errors);
  };

  // Handle modal close
  const handleClose = () => {
    reset({ listName: currentListName });
    onOpenChange(false);
  };

  // Reset form when modal opens with new list name
  React.useEffect(() => {
    if (isOpen && currentListName) {
      reset({ listName: currentListName });
    }
  }, [isOpen, currentListName, reset]);

  // Loading state
  const isFormSubmitting = renameMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-[500px] p-0", className)}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Edit List</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Update the name of your favorite list to better<br />
              organize your saved software products.
            </p>
          </div>

          {/* Form */}
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
              {/* List Name Field */}
              <FormInput
                name="listName"
                label="List Name"
                placeholder="Enter List Name"
                maxLength={100}
                disabled={isFormSubmitting}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!isValid || !isDirty || isFormSubmitting}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full mt-8 disabled:opacity-50"
              >
                {isFormSubmitting ? 'Updating...' : 'Update List'}
              </Button>
            </form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditListModal; 