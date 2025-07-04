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
    .trim(),
  productId: z.string().optional(),
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
  existingProducts?: Array<{
    productId: string;
    name: string;
    logoUrl?: string;
    brandColors?: string;
  }>;
}

const CreateListModal: React.FC<CreateListModalProps> = ({
  isOpen,
  onOpenChange,
  onSuccess,
  className,
  mode = 'create',
  existingListName = '',
  existingProducts = []
}) => {
  const [selectedProducts, setSelectedProducts] = React.useState<Array<{
    productId: string;
    name: string;
    logoUrl?: string;
    brandColors?: string;
  }>>([]);

  // Form setup with validation
  const methods = useForm<ListModalFormData>({
    resolver: zodResolver(listModalSchema),
    mode: 'onChange',
    defaultValues: {
      listName: '',
      productId: '',
    },
  });

  const { 
    handleSubmit, 
    reset, 
    setValue,
    watch,
    formState: { isValid, isDirty } 
  } = methods;

  const selectedProductId = watch('productId');

  // API hooks
  const createListMutation = useCreateFavoriteList();
  const renameListMutation = useRenameFavoriteList();
  const addToFavoritesMutation = useAddToFavorites();
  const removeFromFavoritesMutation = useRemoveFromFavorites();
  const { data: productsData, isLoading: productsLoading } = useProducts(1, 50);

  // Process products data for FormSelect (exclude already selected products)
  const productOptions = React.useMemo(() => {
    if (!productsData?.data?.data) return [];
    
    const selectedProductIds = selectedProducts.map(p => p.productId);
    
    return productsData.data.data
      .filter(product => !selectedProductIds.includes(product._id))
      .map((product) => ({
        value: product._id,
        label: product.name,
      }));
  }, [productsData, selectedProducts]);

  // Reset form and selected products when modal opens/closes or mode changes
  React.useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && existingListName) {
        reset({ listName: existingListName, productId: '' });
        setSelectedProducts(existingProducts);
      } else {
        reset({ listName: '', productId: '' });
        setSelectedProducts([]);
      }
    } else {
      // Reset when modal closes
      reset({ listName: '', productId: '' });
      setSelectedProducts([]);
    }
  }, [isOpen, mode, existingListName, reset]);

  // Update selected products when existingProducts changes (only for edit mode)
  React.useEffect(() => {
    if (isOpen && mode === 'edit' && existingProducts.length > 0) {
      setSelectedProducts(existingProducts);
    }
  }, [isOpen, mode, existingProducts.length]);

  // Add product to selected list
  const handleAddProduct = () => {
    if (!selectedProductId) return;

    const product = productsData?.data?.data?.find(p => p._id === selectedProductId);
    if (!product) return;

    const newProduct = {
      productId: product._id,
      name: product.name,
      logoUrl: product.logoUrl,
      brandColors: product.brandColors
    };

    setSelectedProducts(prev => [...prev, newProduct]);
    setValue('productId', ''); // Clear selection
  };

  // Remove product from selected list
  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.productId !== productId));
  };

  // Form submission handler
  const onSubmit = async (data: ListModalFormData) => {
    try {
      if (mode === 'create') {
        // Create new list
        await createListMutation.mutateAsync(data.listName);
        
        // Add selected products to the new list
        for (const product of selectedProducts) {
          await addToFavoritesMutation.mutateAsync({
            productId: product.productId,
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
        const existingProductIds = existingProducts.map(p => p.productId);
        const newProductIds = selectedProducts.map(p => p.productId);

        // Add new products
        const productsToAdd = selectedProducts.filter(p => !existingProductIds.includes(p.productId));
        for (const product of productsToAdd) {
          await addToFavoritesMutation.mutateAsync({
            productId: product.productId,
            listName: data.listName
          });
        }

        // Remove products that were removed
        const productsToRemove = existingProducts.filter(p => !newProductIds.includes(p.productId));
        for (const product of productsToRemove) {
          await removeFromFavoritesMutation.mutateAsync({
            productId: product.productId,
            listName: data.listName
          });
        }
      }
      
      // Reset form and close modal
      reset();
      setSelectedProducts([]);
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
    reset();
    setSelectedProducts([]);
    onOpenChange(false);
  };

  // Loading state
  const isFormSubmitting = createListMutation.isPending || 
                          renameListMutation.isPending || 
                          addToFavoritesMutation.isPending || 
                          removeFromFavoritesMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            <p className="text-gray-500 text-sm leading-relaxed">
              {mode === 'edit' 
                ? 'Update your list name and manage the products<br />in your favorite software collection.'
                : 'Create a new list to save and organize the best software<br />products tailored to your needs.'
              }
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

              {/* Add Product Section */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <FormSelect
                      name="productId"
                      label="Add Product"
                      placeholder="Select Product"
                      options={productOptions}
                      searchable
                      disabled={productsLoading || isFormSubmitting}
                    />
                  </div>
                  <div className="pt-8">
                    <Button
                      type="button"
                      onClick={handleAddProduct}
                      disabled={!selectedProductId || isFormSubmitting}
                      className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* Selected Products */}
                {selectedProducts.length > 0 && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-900">
                      Selected Products ({selectedProducts.length})
                    </label>
                    <div className="max-h-40 overflow-y-auto space-y-2 border rounded-lg p-3 bg-gray-50">
                      {selectedProducts.map((product) => (
                        <div
                          key={product.productId}
                          className="flex items-center justify-between bg-white rounded-lg p-3 border"
                        >
                          <div className="flex items-center gap-3">
                            {product.logoUrl ? (
                              <div 
                                className="w-8 h-8 rounded-md flex items-center justify-center border"
                                style={{ backgroundColor: product.brandColors || '#f3f4f6' }}
                              >
                                <img 
                                  src={product.logoUrl} 
                                  alt={product.name} 
                                  className="w-6 h-6 object-contain" 
                                />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-sm">
                                  {product.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <span className="font-medium text-gray-900">{product.name}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveProduct(product.productId)}
                            disabled={isFormSubmitting}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!isValid || (!isDirty && selectedProducts.length === existingProducts.length) || isFormSubmitting}
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