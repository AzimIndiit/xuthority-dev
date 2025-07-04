import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useProducts } from '@/hooks/useProducts';
import { useCreateFavoriteList, useAddToFavorites } from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Form validation schema
const createListSchema = z.object({
  listName: z.string().nonempty()
    .min(2, 'List name is required')
    .max(100, 'List name must be less than 100 characters')
    .trim(),
  productId: z.string().optional(),
});

type CreateListFormData = z.infer<typeof createListSchema>;

interface CreateListModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  className?: string;
}

const defaultValues: CreateListFormData = {
  listName: '',
  productId: '',
};

const CreateListModal: React.FC<CreateListModalProps> = ({
  isOpen,
  onOpenChange,
  onSuccess,
  className
}) => {
  // Form setup with validation
  const methods = useForm<CreateListFormData>({
    resolver: zodResolver(createListSchema),
    mode: 'onChange',
    defaultValues,
  });

  const { 
    handleSubmit, 
    reset, 
    formState: { isSubmitting, isValid } 
  } = methods;

  // API hooks
  const createListMutation = useCreateFavoriteList();
  const addToFavoritesMutation = useAddToFavorites();
  const { data: productsData, isLoading: productsLoading } = useProducts(1, 50);

  // Process products data for FormSelect
  const productOptions = React.useMemo(() => {
    if (!productsData?.data) return [];
    return productsData.data.map((product) => ({
      value: product._id || product.id,
      label: product.name,
    }));
  }, [productsData]);

  // Form submission handler
  const onSubmit = async (data: CreateListFormData) => {
    try {
      // First create the list
      await createListMutation.mutateAsync(data.listName);
      
      // Then add the selected product to the list if one is selected
      if (data.productId) {
        await addToFavoritesMutation.mutateAsync({
          productId: data.productId,
          listName: data.listName
        });
      }
      
      // Reset form and close modal
      reset();
      onOpenChange(false);
      onSuccess?.();
      
    } catch (error) {
      // Errors are handled by mutation hooks with toast notifications
      console.error('Error creating list:', error);
    }
  };

  // Handle form errors
  const onError = (errors: any) => {
    console.log('Form validation errors:', errors);
  };

  // Handle modal close
  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  // Loading state
  const isFormSubmitting = createListMutation.isPending || addToFavoritesMutation.isPending;

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
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Create New List</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Create a new list to save and organize the best software<br />
              products tailored to your needs.
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

              {/* Add Product Field */}
              <FormSelect
                name="productId"
                label="Add Product"
                placeholder="Select Product"
                options={productOptions}
                searchable
                disabled={productsLoading || isFormSubmitting}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!isValid || isFormSubmitting}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full mt-8 disabled:opacity-50"
              >
                {isFormSubmitting ? 'Creating...' : 'Continue'}
              </Button>
            </form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateListModal; 