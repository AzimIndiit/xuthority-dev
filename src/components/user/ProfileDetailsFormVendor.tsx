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

// Zod schema for profile validation, exported for reuse
export const profileSchema = z.object({
  avatar: z.string().optional(),
  companyAvatar: z.string().optional(),
  displayName: z.string().optional(),
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50, "First name must be less than 50 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  region: z.string().min(1, "Please select a region"),
  description: z.string().optional(),
  industry: z.string().min(1, "Please select an industry"),
  companyName: z.string().min(2, "Company name must be at least 2 characters").max(100, "Company name must be less than 100 characters"),
  companyEmail: z.string().optional().or(z.literal("")).refine((val) => !val || z.string().email().safeParse(val).success, "Invalid company email address").refine((val) => !val || val.length <= 254, "Company email must be less than 254 characters"),
  companySize: z.string().min(1, "Please select company size"),
  yearFounded: z.string().optional().or(z.literal("")),
  hqLocation: z.string().optional().or(z.literal("")).refine((val) => !val || val.length <= 200, "HQ location must be less than 200 characters"),
  companyDescription: z.string().optional().or(z.literal("")).refine((val) => !val || val.length <= 2000, "Company description must be less than 2000 characters"),
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
  companyWebsiteUrl: z
    .string()
    .url("Invalid company website URL")
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || val.length <= 200, "Company website URL must be less than 200 characters"),
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
    defaultValues: initialData,
  });

  console.log("formMethods", formMethods.formState.errors);
  //set default values
  useEffect(() => {
    formMethods.reset(initialData);
  }, [initialData]);
  console.log("initialData", user, initialData);
  
  // Add form error debugging
  console.log("Form errors:", formMethods.formState.errors);
  console.log("Form is valid:", formMethods.formState.isValid);

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
      console.log('data', data)
      
      // Helper function to clean empty strings
      const cleanValue = (value: string | undefined) => {
        return value && value.trim() !== '' ? value : undefined;
      };
      
      await updateProfileMutation.mutateAsync({
        profileData: {
          firstName: data.firstName,
          lastName: data.lastName,
          region: data.region,
          description: cleanValue(data.description),
          industry: data.industry,
          companyName: data.companyName,
          companySize: data.companySize,
          socialLinks: {
            linkedin: cleanValue(data.linkedinUrl),
            twitter: cleanValue(data.twitterUrl),
          },
          avatar: cleanValue(data.avatar),
          companyEmail: cleanValue(data.companyEmail),
          yearFounded: cleanValue(data.yearFounded),
          hqLocation: cleanValue(data.hqLocation),
          companyDescription: cleanValue(data.companyDescription),
          companyWebsiteUrl: cleanValue(data.companyWebsiteUrl),
          companyAvatar: cleanValue(data.companyAvatar),
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

        {/* Form Validation Debug Info */}
        {/* {Object.keys(formMethods.formState.errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h4 className="text-red-800 font-medium mb-2">Please fix the following errors:</h4>
            <ul className="text-red-600 text-sm space-y-1">
              {Object.entries(formMethods.formState.errors).map(([field, error]) => (
                <li key={field}>
                  <strong>{field}:</strong> {error?.message}
                </li>
              ))}
            </ul>
          </div>
        )} */}

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

          </div>

          {/* Company Details */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
              Company Details
            </h3>

            <div className="flex items-center mb-4 sm:mb-6">
              <div className="relative">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
                  <AvatarImage
                    className="object-cover"
                    src={currentCompanyAvatar}
                    alt="Company Logo"
                  />
                  <AvatarFallback className="text-sm sm:text-base bg-gray-100">
                    {formMethods.watch("companyName")?.charAt(0)?.toUpperCase() || "C"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1">
                  <button
                    type="button"
                    onClick={handleCompanyImageClick}
                    disabled={updateProfileMutation.isPending}
                    className="bg-blue-500 rounded-full p-1 shadow-md hover:shadow-lg transition-shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </button>
                </div>
               
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormInput name="companyName" label="Company Name" maxLength={100} disabled={updateProfileMutation.isPending} />
              <FormInput name="companyEmail" label="Company Email" type="email" maxLength={254} disabled={updateProfileMutation.isPending} />
              <FormSelect
                name="industry"
                searchable={true}
                label="Industry"
                placeholder="Select industry"
                options={industryOptions}
                disabled={updateProfileMutation.isPending}
              />
              <FormSelect
                name="companySize"
                label="Company Size"
                placeholder="Select company size"
                options={companySizeOptions}
                disabled={updateProfileMutation.isPending}
              />
              <FormSelect
                name="yearFounded"
                searchable={true}
                label="Year Founded"
                placeholder="Select year"
                options={yearFoundedOptions}
                disabled={updateProfileMutation.isPending}
              />
              <FormInput name="hqLocation" label="HQ Location" maxLength={200} disabled={updateProfileMutation.isPending} />
            </div>

            <div className="mt-4 sm:mt-6">
              <FormTextarea
                name="companyDescription"
                label="Company Description"
                rows={4}
                maxLength={2000}
                className="min-h-32 sm:min-h-40"
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

            <div className="mt-4 sm:mt-6">
              <FormInput
                type="url"
                name="companyWebsiteUrl"
                label="Company Website URL"
                placeholder="https://www.yourcompany.com"
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
