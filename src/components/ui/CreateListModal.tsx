import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useProducts } from '@/hooks/useProducts';
import { useCreateFavoriteList, useAddToFavorites } from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Form validation schema
const createListSchema = z.object({
  listName: z.string()
    .min(1, 'List name is required')
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

const CreateListModal: React.FC<CreateListModalProps> = ({
  isOpen,
  onOpenChange,
  onSuccess,
  className
}) => {
  // Form setup with validation
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<CreateListFormData>({
    resolver: zodResolver(createListSchema),
    mode: 'onChange',
    defaultValues: {
      listName: '',
      productId: '',
    }
  });

  // Watch form values
  const watchedProductId = watch('productId');

  // API hooks
  const createListMutation = useCreateFavoriteList();
  const addToFavoritesMutation = useAddToFavorites();
  const { data: productsData, isLoading: productsLoading } = useProducts(1, 50);

  // Process products data
  const products = Array.isArray(productsData?.data) ? productsData.data : [];

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

  // Handle modal close
  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  // Loading state
  const isSubmitting = createListMutation.isPending || addToFavoritesMutation.isPending;

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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* List Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                List Name
              </label>
              <Input
                {...register('listName')}
                placeholder="Enter List Name"
                className={cn(
                  "w-full h-12 px-4 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  errors.listName && "border-red-500 focus:ring-red-500"
                )}
                disabled={isSubmitting}
              />
              {errors.listName && (
                <p className="mt-2 text-sm text-red-600">{errors.listName.message}</p>
              )}
            </div>

            {/* Add Product Field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Add Product
              </label>
              <Select
                value={watchedProductId}
                onValueChange={(value) => setValue('productId', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full h-12 px-4 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <SelectValue placeholder="Select Product" />
                </SelectTrigger>
                <SelectContent>
                  {productsLoading ? (
                    <SelectItem value="" disabled>
                      Loading products...
                    </SelectItem>
                  ) : products.length === 0 ? (
                    <SelectItem value="" disabled>
                      No products available
                    </SelectItem>
                  ) : (
                    products.map((product) => (
                      <SelectItem key={product._id || product.id} value={product._id || product.id}>
                        {product.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full mt-8 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Continue'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateListModal; 