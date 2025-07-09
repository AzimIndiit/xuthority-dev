import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useProducts } from '@/hooks/useProducts';
import { 
  useCreateFavoriteList, 
  useAddToFavorites, 
  useRenameFavoriteList,
  useRemoveFromFavorites,
  useFavoriteListProducts 
} from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Form validation schema
const listModalSchema = z.object({
  listName: z.string()
    .min(2, 'List name must be at least 2 characters')
    .max(100, 'List name must be less than 100 characters')
    .trim().nonempty('List name is required'),
  productIds: z.array(z.string()).min(1, 'At least one product is required')
});

type ListModalFormData = z.infer<typeof listModalSchema>;

interface CreateListModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  className?: string;
  // Edit mode props
  mode?: 'create' | 'edit';
  existingListName?: string;
  existingProductIds?: string[];
}

const CreateListModal: React.FC<CreateListModalProps> = ({
  isOpen,
  onOpenChange,
  onSuccess,
  className,
  mode = 'create',
  existingListName = '',
  existingProductIds = []
}) => {
  // Form setup with validation - initialize based on mode
  const getInitialFormValues = React.useCallback(() => ({
    listName: mode === 'edit' ? existingListName : '',
    productIds: mode === 'edit' ? (existingProductIds || []) : [],
  }), [mode, existingListName, existingProductIds]);

  const initialValues = getInitialFormValues();
  
  const methods = useForm<ListModalFormData>({
    resolver: zodResolver(listModalSchema),
    mode: 'onChange',
    defaultValues: initialValues,
    values: initialValues, // This ensures form updates when props change
  });

  const { 
    handleSubmit, 
    reset, 
    watch,
    formState: { isValid } 
  } = methods;

  const selectedProductIds = watch('productIds') || [];
console.log('existingProductIds', existingProductIds)
  // API hooks
  const createListMutation = useCreateFavoriteList();
  const renameListMutation = useRenameFavoriteList();
  const addToFavoritesMutation = useAddToFavorites();
  const removeFromFavoritesMutation = useRemoveFromFavorites();
  const { data: productsData, isLoading: productsLoading } = useProducts(1, 50);
  const productsDataArray = productsData?.data && Array.isArray(productsData.data) ? productsData.data : []

  // Process products data for FormSelect
  const productOptions = React.useMemo(() => {
    if (!productsDataArray || productsDataArray.length === 0) return [];
    
    return productsDataArray.map((product) => ({
      value: product._id,
      label: product.name,
    }));
  }, [productsDataArray]);
  
  // Debug logging
  console.log('Modal Debug:', {
    mode,
    existingListName,
    existingProductIds,
    initialValues,
    selectedProductIds,
    productOptionsLength: productOptions.length
  });

  // Initialize form when modal opens
  const initializeModal = () => {
    const initialValues = getInitialFormValues();
    reset(initialValues);
  };

  // Reset form when modal closes
  const resetModal = () => {
    reset({ listName: '', productIds: [] });
  };

  // No need for separate add/remove functions since we're using FormSelect with multiple

  // Form submission handler
  const onSubmit = async (data: ListModalFormData) => {
    try {
      if (mode === 'create') {
        // Create new list first
        await createListMutation.mutateAsync(data.listName);
        
        // Add selected products to the new list
        for (const productId of data.productIds) {
          await addToFavoritesMutation.mutateAsync({
            productId: productId,
            listName: data.listName
          });
        }
      } else {
        // Edit existing list
        if (data.listName !== existingListName) {
          // Rename list if name changed
          await renameListMutation.mutateAsync({
            listName: existingListName,
            newListName: data.listName
          });
        }

        // Handle product changes
        const currentProductIds = existingProductIds || [];
        const newProductIds = data.productIds || [];

        // Add new products
        const productsToAdd = newProductIds.filter(productId => !currentProductIds.includes(productId));
        for (const productId of productsToAdd) {
          await addToFavoritesMutation.mutateAsync({
            productId: productId,
            listName: data.listName
          });
        }

        // Remove products that were removed
        const productsToRemove = currentProductIds.filter(productId => !newProductIds.includes(productId));
        for (const productId of productsToRemove) {
          await removeFromFavoritesMutation.mutateAsync({
            productId: productId,
            listName: data.listName
          });
        }
      }
      
      // Reset form and close modal
      resetModal();
      onOpenChange(false);
      onSuccess?.();
      
    } catch (error) {
      // Errors are handled by mutation hooks with toast notifications
      console.error('Error saving list:', error);
    }
  };

  // Handle form errors
  const onError = (errors: any) => {
    console.log('Form validation errors:', errors);
  };

  // Handle modal close
  const handleClose = () => {
    resetModal();
    onOpenChange(false);
  };

  // Handle modal open/close changes
  const handleOpenChange = (open: boolean) => {
    if (open) {
      initializeModal();
    } else {
      resetModal();
    }
    onOpenChange(open);
  };

  // Loading state
  const isFormSubmitting = createListMutation.isPending || 
                          renameListMutation.isPending || 
                          addToFavoritesMutation.isPending || 
                          removeFromFavoritesMutation.isPending;
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={handleOpenChange}
      key={`dialog-${mode}-${existingListName}-${Array.isArray(existingProductIds) ? existingProductIds.join(',') : ''}-${productOptions.length}`} // Force re-initialization when mode or data changes
    >
      <DialogContent className={cn("sm:max-w-[600px] p-0", className)}>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {mode === 'edit' ? 'Edit List' : 'Create New List'}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
              {mode === 'edit' 
                ? 'Update your list name and manage the products in your favorite software collection.'
                : 'Create a new list to save and organize the best software products tailored to your needs.'
              }
            </p>
          </div>

          {/* Form */}
          <FormProvider {...methods} key={`form-${mode}-${existingListName}-${Array.isArray(existingProductIds) ? existingProductIds.join(',') : ''}-${productOptions.length}`}>
            <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
              {/* List Name Field */}
              <FormInput
                name="listName"
                label="List Name"
                placeholder="Enter List Name"
                maxLength={100}
                disabled={isFormSubmitting}
              />

              {/* Add Product Section */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <FormSelect
                      name="productIds"
                      label="Select Products"
                      placeholder={productsLoading ? "Loading products..." : "Select Products"}
                      options={productOptions}
                      searchable
                      disabled={productsLoading || isFormSubmitting}
                      multiple
                      key={`select-${productOptions.length}`} // Force re-render when options change
                    />
                  </div>
                
                </div>

          
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!isValid || selectedProductIds.length === 0 || isFormSubmitting || productsLoading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full mt-8 disabled:opacity-50"
              >
                {isFormSubmitting 
                  ? (mode === 'edit' ? 'Updating...' : 'Creating...') 
                  : (mode === 'edit' ? 'Update List' : 'Continue')
                }
              </Button>
            </form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateListModal; 