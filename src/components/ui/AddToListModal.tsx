import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  useFavoriteLists, 
  useAddToFavorites, 
  useCreateFavoriteList 
} from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/FormInput';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from './input';

// Form validation schema
const addToListSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('existing'),
    selectedListName: z.string().min(1, 'Please select a list'),
  }),
  z.object({
    mode: z.literal('new'),
    newListName: z.string()
      .min(2, 'List name must be at least 2 characters')
      .max(100, 'List name must be less than 100 characters')
      .trim().nonempty('List name is required'),
  }),
]);

type AddToListFormData = z.infer<typeof addToListSchema>;

interface AddToListModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName?: string;
  onSuccess?: () => void;
  className?: string;
}

const AddToListModal: React.FC<AddToListModalProps> = ({
  isOpen,
  onOpenChange,
  productId,
  productName,
  onSuccess,
  className,
}) => {
  const [mode, setMode] = useState<'existing' | 'new'>('existing');

  // Form setup with validation
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<AddToListFormData>({
    resolver: zodResolver(addToListSchema),
    mode: 'onChange',
    defaultValues: {
      mode: 'existing',
      selectedListName: '',
    },
  });

  const currentMode = watch('mode');

  // API hooks
  const { data: listsData, isLoading: listsLoading } = useFavoriteLists();
  const addToFavoritesMutation = useAddToFavorites();
  const createListMutation = useCreateFavoriteList();

  // Process lists data for dropdown
  const availableLists = React.useMemo(() => {
    if (!listsData?.lists) return [];
    return listsData.lists.map(list => ({
      value: list.listName,
      label: list.listName,
    }));
  }, [listsData]);

  // Form submission handler
  const onSubmit = async (data: AddToListFormData) => {
    try {
      let listNameToUse = '';

      if (data.mode === 'new') {
        // Create new list first
        await createListMutation.mutateAsync(data.newListName);
        listNameToUse = data.newListName;
      } else {
        listNameToUse = data.selectedListName;
      }

      // Add product to the list
      await addToFavoritesMutation.mutateAsync({
        productId,
        listName: listNameToUse,
      });

      // Reset form and close modal
      handleClose();
      onSuccess?.();
    } catch (error) {
      console.error('Error adding to list:', error);
    }
  };

  // Handle form errors
  const onError = (errors: any) => {
    console.log('Form validation errors:', errors);
  };

  // Handle modal close
  const handleClose = () => {
    reset({
      mode: 'existing',
      selectedListName: '',
    });
    setMode('existing');
    onOpenChange(false);
  };

  // Handle mode change
  const handleModeChange = (newMode: 'existing' | 'new') => {
    setMode(newMode);
    // Reset form with new mode
    reset({
      mode: newMode,
      ...(newMode === 'existing' ? { selectedListName: '' } : { newListName: '' }),
    });
  };

  // Loading state
  const isFormSubmitting = addToFavoritesMutation.isPending || createListMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-[440px] p-0", className)}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Add to My List
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
            {/* Mode Selection */}
            <div className="space-y-4 w-full">
              <div className="flex items-center space-x-3 w-full">
                <Controller
                  name="mode"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleModeChange(value as 'existing' | 'new');
                      }}
                      className="space-y-4 w-full"
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <RadioGroupItem value="existing" id="existing" />
                        <Label htmlFor="existing" className="text-sm font-medium text-gray-700">
                          Choose from existing lists
                        </Label>
                      </div>
                      {currentMode === 'existing' && 
              <div className="space-y-2 w-full">
                <Controller
                  name="selectedListName"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={listsLoading || isFormSubmitting}
                    >
                      <SelectTrigger className="w-full h-12 px-4 border border-gray-300  bg-gray-50 hover:bg-gray-100 transition-colors rounded-full ">
                        <SelectValue placeholder="Select List" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableLists.length > 0 ? (
                          availableLists.map((list) => (
                            <SelectItem key={list.value} value={list.value}>
                              {list.label}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-lists" disabled>
                            No lists available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                {(errors as any).selectedListName && (
                  <p className="text-red-500 text-sm">{(errors as any).selectedListName.message}</p>
                )}
              </div>}
          
                      
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="new" id="new" />
                        <Label htmlFor="new" className="text-sm font-medium text-gray-700">
                          Create new list
                        </Label>
                      </div>
                      {currentMode === 'new' && <div className="space-y-2">
                <Controller
                  name="newListName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter list name"
                      className='rounded-full'
                      disabled={isFormSubmitting}
                      maxLength={100}
                    />
                  )}
                />
                {(errors as any).newListName && (
                  <p className="text-red-500 text-sm">{(errors as any).newListName.message}</p>
                )}
              </div>
              }
                    </RadioGroup>
                  )}
                />
              </div>
            </div>

        

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isValid || isFormSubmitting || listsLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFormSubmitting ? 'Adding...' : 'Add'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToListModal; 