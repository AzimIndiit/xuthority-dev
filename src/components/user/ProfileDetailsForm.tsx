import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { VerifiedBadge } from '@/components/icons/VerifiedBadge';
import { FormInput } from '../ui/FormInput';
import { FormSelect } from '../ui/FormSelect';
import { FormTextarea } from '../ui/FormTextarea';
import { ChangePasswordModal } from '../ui/ChangePasswordModal';
import {
  companySizeOptions,
  industryOptions,
  regionOptions,
} from '@/config/constants';
import { ArrowLeftIcon, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUpdateProfileWithImage } from '@/hooks/useAuth';
import { getUserDisplayName, getUserInitials } from '@/utils/userHelpers';
import useUserStore from '@/store/useUserStore';

// Zod schema for profile validation, exported for reuse
export const profileSchema = z.object({
  avatar: z.string().optional(),
  displayName: z.string().optional(),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  region: z.string().min(1, 'Please select a region'),
  description: z.string().optional(),
  industry: z.string().min(1, 'Please select an industry'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  companySize: z.string().min(1, 'Please select company size'),
  linkedinUrl: z
    .string()
    .url('Invalid LinkedIn URL')
    .optional()
    .or(z.literal('')),
  twitterUrl: z
    .string()
    .url('Invalid Twitter URL')
    .optional()
    .or(z.literal('')),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileDetailsFormProps {
  initialData: ProfileFormData;
  onSubmit?: (data: ProfileFormData) => void;
}

const ProfileDetailsForm: React.FC<ProfileDetailsFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const updateProfileMutation = useUpdateProfileWithImage();



  const formMethods = useForm<ProfileFormData>({
    mode: 'onChange',
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
  });
    //set default values
    useEffect(() => {
      formMethods.reset(initialData);
    }, [initialData]);
    console.log("initialData",user, initialData);

  const handleImageSelect = (file: File) => {
    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('File size must be less than 5MB');
      return;
    }

    setSelectedImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfileMutation.mutateAsync({
        profileData: {
          firstName: data.firstName,
          lastName: data.lastName,
          region: data.region,
          description: data.description,
          industry: data.industry,
          title: data.title,
          companyName: data.companyName,
          companySize: data.companySize,
          socialLinks: {
            linkedin: data.linkedinUrl,
            twitter: data.twitterUrl,
          },
          avatar: data.avatar,
        },
        imageFile: selectedImageFile || undefined,
      });

      // Clear selected image after successful upload
      setSelectedImageFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      // Call custom onSubmit if provided
      if (onSubmit) {
        onSubmit(data);
      }
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  const handleImageClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleImageSelect(file);
      }
    };
    input.click();
  };

  const currentAvatar = previewUrl || formMethods.watch('avatar') || user?.avatar;
  const displayName = getUserDisplayName(user);

  return (
    <FormProvider {...formMethods}>
      <div className="">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center gap-2">
          <span className='block lg:hidden' onClick={() => navigate(-1)}> <ArrowLeftIcon className='w-6 h-6' /></span>
          Profile Details</h2>

        <form onSubmit={formMethods.handleSubmit(handleSubmit)} className="space-y-6 sm:space-y-8">
          {/* Personal Details */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
              Personal details
            </h3>

            <div className="flex items-center mb-4 sm:mb-6">
              <div className="relative">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
                  <AvatarImage className="object-cover" src={currentAvatar} alt="Profile" />
                  <AvatarFallback className="text-sm sm:text-base">
                    {getUserInitials(user)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1">
                  <button
                    type="button"
                    onClick={handleImageClick}
                    disabled={updateProfileMutation.isPending}
                    className="bg-blue-500 rounded-full p-1 shadow-md hover:shadow-lg transition-shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormInput name="firstName" label="First Name" />
              <FormInput name="lastName" label="Last Name" />
              <FormInput name="email" label="Email" type="email" disabled={true} />
              <FormSelect
                name="region"
                label="Region"
                placeholder="Select region"
                options={regionOptions}
              />
            </div>

            <div className="mt-4 sm:mt-6">
              <FormTextarea
                name="description"
                label="Description"
                rows={4}
                className="min-h-32 sm:min-h-40"
              />
            </div>
          </div>

          {/* Professional Details */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
              Professional Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormSelect
                name="industry"
                label="Industry"
                placeholder="Select industry"
                options={industryOptions}
              />
              <FormInput name="title" label="Title" />
              <FormInput name="companyName" label="Company Name" />
              <FormSelect
                name="companySize"
                label="Company Size"
                placeholder="Select company size"
                options={companySizeOptions}
              />
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
              Social Links
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormInput
                type="url"
                name="linkedinUrl"
                label="LinkedIn Profile URL"
                placeholder="https://www.linkedin.com/in/your-profile"
              />
              <FormInput
                type="url"
                name="twitterUrl"
                label="Twitter Profile URL"
                placeholder="https://twitter.com/your-handle"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 sm:pt-6 border-t border-gray-200 gap-4 sm:gap-0">
            <button
              type="button"
              onClick={() => setIsChangePasswordModalOpen(true)}
              className="text-red-600 hover:text-red-700 font-medium text-sm order-2 sm:order-1"
            >
              Looking to change your password?
            </button>

            <Button 
              type="submit" 
              disabled={updateProfileMutation.isPending}
              className="w-full sm:w-auto px-6 sm:px-8 rounded-full bg-blue-500 text-white hover:bg-blue-600 order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>

        {/* Change Password Modal */}
        <ChangePasswordModal
          isOpen={isChangePasswordModalOpen}
          onOpenChange={setIsChangePasswordModalOpen}
        />
      </div>
    </FormProvider>
  );
};

export default ProfileDetailsForm;