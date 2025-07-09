import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { VerifiedBadge } from "@/components/icons/VerifiedBadge";
import { FormInput } from "../ui/FormInput";
import { FormSelect } from "../ui/FormSelect";
import { FormTextarea } from "../ui/FormTextarea";
import { ChangePasswordModal } from "../ui/ChangePasswordModal";
import {
  companySizeOptions,
  regionOptions,
  yearFoundedOptions,
} from "@/config/constants";
import { useIndustryOptions } from "@/hooks/useIndustry";
import { ArrowLeftIcon, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUpdateProfileWithImage } from "@/hooks/useAuth";
import { getUserDisplayName, getUserInitials } from "@/utils/userHelpers";
import useUserStore from "@/store/useUserStore";

// Skeleton component for form sections
const FormSectionSkeleton = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
    {children}
  </div>
);

// Skeleton component for avatar section
const AvatarSectionSkeleton = () => (
  <div className="flex items-center mb-6">
    <div className="relative">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full"></div>
      <div className="absolute -bottom-1 -right-1">
        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  </div>
);

// Skeleton component for form input fields
const FormInputSkeleton = ({ isFullWidth = false }: { isFullWidth?: boolean }) => (
  <div className={`space-y-2 ${isFullWidth ? 'col-span-full' : ''}`}>
    <div className="h-4 bg-gray-200 rounded w-24"></div>
    <div className="h-10 bg-gray-200 rounded w-full"></div>
  </div>
);

// Skeleton component for textarea fields
const FormTextareaSkeleton = () => (
  <div className="space-y-2">
    <div className="h-4 bg-gray-200 rounded w-32"></div>
    <div className="h-32 sm:h-40 bg-gray-200 rounded w-full"></div>
  </div>
);

// Skeleton component for form grid
const FormGridSkeleton = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
    {children}
  </div>
);

// Skeleton component for action buttons
const ActionButtonsSkeleton = () => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 sm:pt-6 border-t border-gray-200 gap-4 sm:gap-0 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-48 order-2 sm:order-1"></div>
    <div className="h-10 bg-gray-200 rounded w-full sm:w-24 order-1 sm:order-2"></div>
  </div>
);

// Main skeleton component for the entire form
const ProfileDetailsFormSkeleton = () => {
  const navigate = useNavigate();
  
  return (
    <div className="animate-pulse">
      <div className="flex items-center gap-2 mb-6 sm:mb-8">
        <span className="block lg:hidden" onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="w-6 h-6" />
        </span>
        <div className="h-8 bg-gray-200 rounded w-40"></div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Personal Details Skeleton */}
        <FormSectionSkeleton title="Personal details">
          <AvatarSectionSkeleton />
          <FormGridSkeleton>
            <FormInputSkeleton />
            <FormInputSkeleton />
            <FormInputSkeleton />
            <FormInputSkeleton />
          </FormGridSkeleton>
          <div className="mt-4 sm:mt-6">
            <FormTextareaSkeleton />
          </div>
        </FormSectionSkeleton>

        {/* Professional Details Skeleton */}
        <FormSectionSkeleton title="Professional Details">
          <FormGridSkeleton>
            <FormInputSkeleton />
            <FormInputSkeleton />
            <FormInputSkeleton />
            <FormInputSkeleton />
          </FormGridSkeleton>
        </FormSectionSkeleton>

        {/* Social Links Skeleton */}
        <FormSectionSkeleton title="Social Links">
          <FormGridSkeleton>
            <FormInputSkeleton />
            <FormInputSkeleton />
          </FormGridSkeleton>
        </FormSectionSkeleton>

        {/* Action Buttons Skeleton */}
        <ActionButtonsSkeleton />
      </div>
    </div>
  );
};

// Zod schema for profile validation, exported for reuse
export const profileSchema = z.object({
  avatar: z.string().optional(),
  companyAvatar: z.string().optional(),
  displayName: z.string().optional(),
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50, "First name must be less than 50 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  region: z.string().min(1, "Please select a region"),
  description: z.string().optional().refine((val) => !val || val.length <= 1000, "Description must be less than 1000 characters"),
  industry: z.string().min(1, "Please select an industry"),
  title: z.string().min(2, "Title must be at least 2 characters").max(100, "Title must be less than 100 characters"),
  companyName: z.string().min(2, "Company name must be at least 2 characters").max(100, "Company name must be less than 100 characters"),
  companySize: z.string().min(1, "Please select company size"),
  linkedinUrl: z
    .string()
    .url("Invalid LinkedIn URL")
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || val.length <= 200, "LinkedIn URL must be less than 200 characters"),
  twitterUrl: z
    .string()
    .url("Invalid Twitter URL")
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || val.length <= 200, "Twitter URL must be less than 200 characters"),
  
});

export type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileDetailsFormProps {
  initialData?: ProfileFormData;
  onSubmit?: (data: ProfileFormData) => void;
  isLoading?: boolean;
}

const ProfileDetailsForm: React.FC<ProfileDetailsFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedCompanyImageFile, setSelectedCompanyImageFile] = useState<File | null>(null);
  const [companyPreviewUrl, setCompanyPreviewUrl] = useState<string | null>(null);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const updateProfileMutation = useUpdateProfileWithImage();
  
  // Get industry options from API
  const { options: industryOptions } = useIndustryOptions();

  const formMethods = useForm<ProfileFormData>({
    mode: "onChange",
    resolver: zodResolver(profileSchema),
    defaultValues: initialData || {},
  });

  //set default values
  useEffect(() => {
    if (initialData) {
      formMethods.reset(initialData);
    }
  }, [initialData, formMethods]);

  // Show skeleton when loading or no initial data
  if (isLoading || !initialData) {
    return <ProfileDetailsFormSkeleton />;
  }

  const handleImageSelect = (file: File) => {
    // Validate file
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      alert("File size must be less than 5MB");
      return;
    }

    setSelectedImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleCompanyImageSelect = (file: File) => {
    // Validate file
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      alert("File size must be less than 5MB");
      return;
    }

    setSelectedCompanyImageFile(file);
    setCompanyPreviewUrl(URL.createObjectURL(file));
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
          // Vendor fields (only included if they exist in the form)
          
        },
        imageFile: selectedImageFile || undefined,
        companyImageFile: selectedCompanyImageFile || undefined,
      });

      // Clear selected images after successful upload
      setSelectedImageFile(null);
      setSelectedCompanyImageFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      if (companyPreviewUrl) {
        URL.revokeObjectURL(companyPreviewUrl);
        setCompanyPreviewUrl(null);
      }

      // Call custom onSubmit if provided
      if (onSubmit) {
        onSubmit(data);
      }
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  const handleImageClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleImageSelect(file);
      }
    };
    input.click();
  };

  const handleCompanyImageClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleCompanyImageSelect(file);
      }
    };
    input.click();
  };

  const currentAvatar =
    previewUrl || formMethods.watch("avatar") || user?.avatar;
  const currentCompanyAvatar =
    companyPreviewUrl || formMethods.watch("companyAvatar");
  const displayName = getUserDisplayName(user);

  return (
    <FormProvider {...formMethods}>
      <div className="">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center gap-2">
          <span className="block lg:hidden" onClick={() => navigate(-1)}>
            {" "}
            <ArrowLeftIcon className="w-6 h-6" />
          </span>
          Profile Details
        </h2>

        <form
          onSubmit={formMethods.handleSubmit(handleSubmit)}
          className="space-y-6 sm:space-y-8"
        >
          {/* Personal Details */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
              Personal details
            </h3>

            <div className="flex items-center mb-4 sm:mb-6">
              <div className="relative">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
                  <AvatarImage
                    className="object-cover"
                    src={currentAvatar}
                    alt="Profile"
                  />
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
              <FormInput name="firstName" label="First Name" maxLength={50} disabled={updateProfileMutation.isPending} />
              <FormInput name="lastName" label="Last Name" maxLength={50} disabled={updateProfileMutation.isPending} />
              <FormInput
                name="email"
                label="Email"
                type="email"
                disabled={true}
              />
              <FormSelect
                name="region"
                label="Region"
                placeholder="Select region"
                options={regionOptions}
                disabled={updateProfileMutation.isPending}
              />
            </div>

            <div className="mt-4 sm:mt-6">
              <FormTextarea
                name="description"
                label="Description"
                rows={4}
                maxLength={1000}
                className="min-h-32 sm:min-h-40"
                disabled={updateProfileMutation.isPending}
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
                searchable={true}
                label="Industry"
                placeholder="Select industry"
                options={industryOptions}
                disabled={updateProfileMutation.isPending}
              />
              <FormInput name="title" label="Title" maxLength={100} disabled={updateProfileMutation.isPending} />
              <FormInput name="companyName" label="Company Name" maxLength={100} disabled={updateProfileMutation.isPending} />
              <FormSelect
                name="companySize"
                label="Company Size"
                placeholder="Select company size"
                options={companySizeOptions}
                disabled={updateProfileMutation.isPending}
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
                maxLength={200}
                disabled={updateProfileMutation.isPending}
              />
              <FormInput
                type="url"
                name="twitterUrl"
                label="Twitter Profile URL"
                placeholder="https://twitter.com/your-handle"
                maxLength={200}
                disabled={updateProfileMutation.isPending}
              />
            </div>
          </div>

          {/* Form Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 sm:pt-6 border-t border-gray-200 gap-4 sm:gap-0">
          {user?.authProvider === "email" && (
              <button
                type="button"
                onClick={() => setIsChangePasswordModalOpen(true)}
                className="text-red-600 hover:text-red-700 font-medium text-sm order-2 sm:order-1"
                disabled={updateProfileMutation.isPending}
              >
                Looking to change your password?
              </button>
            )}
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="w-full sm:w-auto px-6 sm:px-8 rounded-full bg-blue-500 text-white hover:bg-blue-600 order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save"}
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
