import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormInput } from '../ui/FormInput';
import { FormSelect } from '../ui/FormSelect';
import { useUpdateProfileWithImage } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import useUserStore from '@/store/useUserStore';
import { useIndustryOptions } from '@/hooks/useIndustry';
import { companySizeOptions } from '@/config/constants';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '@/services/auth';
import { queryClient } from '@/lib/queryClient';

// Schema for required vendor fields
const vendorOnboardingSchema = z.object({
  companyName: z.string()
    .min(2, "Company name must be at least 2 characters")
    .trim()
    .max(100, "Company name must be less than 100 characters")
    .nonempty("Company name is required"),
  companyEmail: z.string()
    .email("Invalid company email address")
    .max(254, "Company email must be less than 254 characters")
    .nonempty("Company email is required"),
  industry: z.string()
    .min(1, "Please select an industry")
    .refine((val) => {
      // Validate that it's a valid MongoDB ObjectId format
      return /^[0-9a-fA-F]{24}$/.test(val);
    }, "Please select a valid industry"),
  companySize: z.string()
    .min(1, "Please select company size")
    .nonempty("Company size is required"),
});

type VendorOnboardingFormData = z.infer<typeof vendorOnboardingSchema>;

interface VendorOnboardingModalProps {
  isOpen: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

const VendorOnboardingModal: React.FC<VendorOnboardingModalProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const navigate = useNavigate();
  const { user, showVendorOnboarding, setShowVendorOnboarding } = useUserStore();
  const toast = useToast();
  const updateProfileMutation = useUpdateProfileWithImage();
  const { options: industryOptions } = useIndustryOptions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is a vendor with pending status
  const isVendorPending = user?.role === 'vendor' && user?.status === 'pending';
  
  // Determine if modal should be open
  // Modal should be open if:
  // 1. External isOpen prop is true, OR
  // 2. User is a pending vendor (for automatic display on page refresh)
  const shouldShowModal = isOpen || (isVendorPending && showVendorOnboarding);

  // Auto-show modal if user is a pending vendor and modal is not already shown
  useEffect(() => {
    if (isVendorPending && !showVendorOnboarding) {
      setShowVendorOnboarding(true);
    }
  }, [isVendorPending, showVendorOnboarding, setShowVendorOnboarding]);

  const formMethods = useForm<VendorOnboardingFormData>({
    mode: 'onChange',
    resolver: zodResolver(vendorOnboardingSchema),
    defaultValues: {
      companyName: user?.companyName || '',
      companyEmail: user?.companyEmail || '',
      industry: user?.industry || '',
      companySize: user?.companySize || '',
    },
  });

  // Reset form when modal opens to ensure fresh data
  useEffect(() => {
    if (shouldShowModal && user) {
      formMethods.reset({
        companyName: user.companyName || '',
        companyEmail: user.companyEmail || '',
        industry: user.industry || '',
        companySize: user.companySize || '',
      });
    }
  }, [shouldShowModal, user, formMethods]);

  // Cleanup effect to ensure modal state is properly managed
  useEffect(() => {
    return () => {
      // If component unmounts and user is no longer pending, close the modal
      if (!isVendorPending) {
        setShowVendorOnboarding(false);
      }
    };
  }, [isVendorPending, setShowVendorOnboarding]);

  // Don't render modal if not open
  if (!shouldShowModal) {
    return null;
  }
  
  // Additional check to ensure we only show for pending vendors
  if (!isVendorPending) {
    // If modal is open but user is not a pending vendor, close it
    if (onOpenChange) {
      onOpenChange(false);
    }
    setShowVendorOnboarding(false);
    return null;
  }

  const handleSubmit = async (data: VendorOnboardingFormData) => {
    try {
      setIsSubmitting(true);
      
      // Ensure we have the token set for the API call
      const token = useUserStore.getState().token;
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Ensure token is set for API calls
      AuthService.tokenStorage.setToken(token);
      
      // Update profile with required vendor fields
      await updateProfileMutation.mutateAsync({
        profileData: {
          companyName: data.companyName,
          companyEmail: data.companyEmail,
          industry: data.industry,
          companySize: data.companySize,
          // Include existing user data to avoid overwriting
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          status: "approved"
        },
      });

      // The mutation's onSuccess will update the user in the store
      // We need to ensure the user is properly logged in
      const updatedUser = useUserStore.getState().user;
      
      if (updatedUser) {
        // Properly log in the user - this sets isLoggedIn to true
        useUserStore.getState().login(token, updatedUser);
        
        // Force refresh of auth state
        await queryClient.invalidateQueries();
      }

      // toast.success('Profile updated successfully! Your account is now active.');
      
      // Close modal after successful update
      if (onOpenChange) {
        onOpenChange(false);
      }
      
      // Also close the internal state
      setShowVendorOnboarding(false);
      
      // Navigate after a small delay
      setTimeout(() => {
        navigate('/profile/products/add-product');
      }, 300);
      
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={shouldShowModal} 
      onOpenChange={(open) => {
        // Prevent closing the modal by clicking outside or pressing escape
        // Modal can only be closed by completing the form
        if (!open) {
          // If trying to close, only allow it if user is no longer a pending vendor
          if (!isVendorPending) {
            if (onOpenChange) {
              onOpenChange(false);
            }
            setShowVendorOnboarding(false);
          }
        }
      }}
    >
      <DialogContent 
        className="sm:max-w-lg p-0 rounded-2xl"
        onPointerDownOutside={(e) => {
          // Only prevent closing if user is still pending
          if (isVendorPending) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          // Only prevent closing if user is still pending
          if (isVendorPending) {
            e.preventDefault();
          }
        }}
      >
        <div className="p-6 sm:p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Complete Your Vendor Profile
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Welcome! To activate your vendor account, please provide the following required information about your company.
            </DialogDescription>
          </DialogHeader>

          <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormInput
                  name="companyName"
                  label="Company Name *"
                  placeholder="Enter your company name"
                  maxLength={100}
                  disabled={isSubmitting}
                />

                <FormInput
                  name="companyEmail"
                  label="Company Email *"
                  type="email"
                  placeholder="company@example.com"
                  maxLength={254}
                  disabled={isSubmitting}
                />

                <FormSelect
                  name="industry"
                  label="Industry *"
                  placeholder={industryOptions.length === 0 ? "Loading industries..." : "Select your industry"}
                  options={industryOptions}
                  searchable={true}
                  disabled={isSubmitting || industryOptions.length === 0}
                />

                <FormSelect
                  name="companySize"
                  label="Company Size *"
                  placeholder="Select company size"
                  options={companySizeOptions}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !formMethods.formState.isValid}
                  loading={isSubmitting}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-full"
                >
                  {isSubmitting ? 'Updating...' : 'Complete Setup'}
                </Button>
              </div>
            </form>
          </FormProvider>

          {/* Show validation errors if any */}
          {Object.keys(formMethods.formState.errors).length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                Please fill in all required fields correctly.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VendorOnboardingModal;