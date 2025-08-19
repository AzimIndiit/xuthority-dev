import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useReviewStore, useSelectedSoftware } from "@/store/useReviewStore";
import { ChevronLeft, HelpCircle } from "lucide-react";
import StarRating from "@/components/ui/StarRating";
import { useMutation } from '@tanstack/react-query';
import { createReview, updateReview, Review } from '@/services/review';
import { useToast } from '@/hooks/useToast';
import { useUserHasReviewed } from '@/hooks/useReview';
import { queryClient } from "@/lib/queryClient";
import { FileUploadService } from '@/services/fileUpload';

// Skeleton loader component for WriteReview
const WriteReviewSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="max-w-2xl">
      {/* Header skeleton */}
      <div className="space-y-4 mb-8">
        <div className="h-16 bg-gray-200 rounded-lg w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
      </div>

      {/* Overall Rating skeleton */}
      <div className="space-y-4 mb-8">
        <div className="h-6 bg-gray-200 rounded w-48"></div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-10 h-10 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>

      {/* Review Title skeleton */}
      <div className="space-y-4 mb-8">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
        <div className="h-12 bg-gray-200 rounded w-full"></div>
      </div>

      {/* Review Description skeleton */}
      <div className="space-y-4 mb-8">
        <div className="h-6 bg-gray-200 rounded w-36"></div>
        <div className="h-32 bg-gray-200 rounded w-full"></div>
      </div>

      {/* Sub Ratings skeleton */}
      <div className="space-y-6 mb-8">
        <div className="h-6 bg-gray-200 rounded w-28"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg">
              <div className="bg-gray-100 px-2 py-1 mb-3">
                <div className="h-5 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="flex items-center gap-2 p-2">
                {[...Array(8)].map((_, j) => (
                  <div key={j} className="w-8 h-8 bg-gray-200 rounded-full"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button skeleton */}
      <div className="flex justify-end pt-4">
        <div className="h-12 bg-gray-200 rounded-full w-32"></div>
      </div>
    </div>
  </div>
);

interface WriteReviewProps {
  setShowStepper?: (show: boolean) => void;
}

const subRatingCategories = [
  { key: 'easeOfUse', label: 'Ease of Use' },
  { key: 'customerSupport', label: 'Customer Support' },
  { key: 'features', label: 'Features' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'technicalSupport', label: 'Technical Support' },
] as const;

const schema = z.object({
  rating: z
    .number()
    .min(1, "Please select an overall rating")
    .max(5, "Rating cannot exceed 5 stars"),
  title: z
    .string()
    .min(1, "Review title is required")
    .min(10, "Review title must be at least 10 characters")
    .max(100, "Review title cannot exceed 100 characters"),
  description: z
    .string()
    .min(1, "Review description is required")
    .min(50, "Review description must be at least 50 characters")
    .max(2000, "Review description cannot exceed 2000 characters"),
  subRatings: z.object({
    easeOfUse: z.string().min(1, "Ease of Use rating is required").refine((val) => val === 'N/A' || (parseInt(val) >= 1 && parseInt(val) <= 7), {
      message: "Please select a valid rating"
    }),
    customerSupport: z.string().min(1, "Customer Support rating is required").refine((val) => val === 'N/A' || (parseInt(val) >= 1 && parseInt(val) <= 7), {
      message: "Please select a valid rating"
    }),
    features: z.string().min(1, "Features rating is required").refine((val) => val === 'N/A' || (parseInt(val) >= 1 && parseInt(val) <= 7), {
      message: "Please select a valid rating"
    }),
    pricing: z.string().min(1, "Pricing rating is required").refine((val) => val === 'N/A' || (parseInt(val) >= 1 && parseInt(val) <= 7), {
      message: "Please select a valid rating"
    }),
    technicalSupport: z.string().min(1, "Technical Support rating is required").refine((val) => val === 'N/A' || (parseInt(val) >= 1 && parseInt(val) <= 7), {
      message: "Please select a valid rating"
    }),
  }),
  files: z
    .array(z.instanceof(File))
    .max(3, "You can attach up to 3 images")
    .refine(
      (files) => files.length === 0 || files.every((file) => file.size <= 5 * 1024 * 1024),
      { message: "Each image must be less than 5MB" }
    )
    .refine(
      (files) => {
        if (files.length === 0) return true;
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        return files.every((file) => allowedTypes.includes(file.type));
      },
      { message: "Only JPG, JPEG, PNG, and GIF images are allowed" }
    ),
});

type FormValues = z.infer<typeof schema>;

const WriteReview: React.FC<WriteReviewProps> = ({ setShowStepper }) => {
  const selectedSoftware = useSelectedSoftware();
  const { 
    reviewData, 
    updateReviewData, 
    nextStep,
    setCurrentStep,
    verificationData,
    resetReviewData
  } = useReviewStore();
  const toast = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingFileUrls, setExistingFileUrls] = useState<string[]>([]);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  console.log('selectedSoftware', selectedSoftware)
  // Check if user has already reviewed this product
  const { hasReviewed, review: userReview, isLoading: isCheckingReview } = useUserHasReviewed(selectedSoftware?.id);

  // Debug verification data
  console.log('WriteReview - verificationData:', verificationData.method);

  // Handle click outside to close tooltip
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showTooltip && !target.closest('[data-tooltip-container]')) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      rating: 0,
      title: "",
      description: "",
      subRatings: {
        easeOfUse: '',
        customerSupport: '',
        features: '',
        pricing: '',
        technicalSupport: '',
      },
      files: [],
    },
  });

  const watchedRating = watch("rating");
  const watchedSubRatings = watch("subRatings");
  const watchedFiles = watch("files");

  console.log('userReview', userReview)

  // File handling functions
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if(files.length>3){
      return toast.review.error("Max 3 images allowed")
    }

    if (files.length > 0) {
      const maxBytes = 5 * 1024 * 1024;
      const oversized = files.filter((f) => f.size > maxBytes);
      const validFiles = files.filter((f) => f.size <= maxBytes);
      if (oversized.length > 0) {
        toast.review.error('Each image must be less than 5MB');
      }
      const remainingSlots = Math.max(0, 3 - (existingFileUrls.length + selectedFiles.length));
      const toAdd = validFiles.slice(0, remainingSlots);
      const combined = [...selectedFiles, ...toAdd];
      setSelectedFiles(combined);
      setValue("files", combined, { shouldValidate: true });
    }
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    setExistingFileUrls([]);
    setValue("files", []);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const removeSelectedFileAt = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    setValue("files", updated, { shouldValidate: true });
  };

  const removeExistingFileAt = (index: number) => {
    setExistingFileUrls((prev) => prev.filter((_, i) => i !== index));
  };
  // Set edit mode and populate form when existing review is found
  useEffect(() => {
    console.log('userReview changed:', userReview);
    
    if (userReview !== null && userReview !== undefined) {
      setIsEditMode(true);
      setExistingReview(userReview);
      
      // Handle existing file attachments
      if (userReview.metaData?.attachments && userReview.metaData.attachments.length > 0) {
        const urls = userReview.metaData.attachments.map((a) => a.fileUrl).slice(0, 3);
        setExistingFileUrls(urls);
      }
      
      // Populate form with existing review data
      const formData = {
        rating: userReview.overallRating,
        title: userReview.title,
        description: userReview.content,
        subRatings: {
          easeOfUse: userReview.subRatings?.easeOfUse ? userReview.subRatings.easeOfUse.toString() : 'N/A',
          customerSupport: userReview.subRatings?.customerSupport ? userReview.subRatings.customerSupport.toString() : 'N/A',
          features: userReview.subRatings?.features ? userReview.subRatings.features.toString() : 'N/A',
          pricing: userReview.subRatings?.pricing ? userReview.subRatings.pricing.toString() : 'N/A',
          technicalSupport: userReview.subRatings?.technicalSupport ? userReview.subRatings.technicalSupport.toString() : 'N/A',
        },
        files: [], // Don't populate files in form, we'll handle display separately
      };
      
      reset(formData);
      updateReviewData({
        rating: userReview.overallRating,
        title: userReview.title,
        description: userReview.content,
      });
    } else {
      // No review exists - reset form to empty state
      console.log('No review found - resetting form to empty state');
      setIsEditMode(false);
      setExistingReview(null);
      setExistingFileUrls([]);
      clearFiles();
      
      // Reset form to default empty values
      const emptyFormData = {
        rating: 0,
        title: "",
        description: "",
        subRatings: {
          easeOfUse: '',
          customerSupport: '',
          features: '',
          pricing: '',
          technicalSupport: '',
        },
        files: [],
      };
      
      reset(emptyFormData);
      // Don't reset review data here as it would clear verification data
      // Only clear the actual review content, not verification
    }
  }, [userReview, reset, updateReviewData]);

  const createMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      toast.review.success('Review submitted successfully!');
      // Invalidate product-related queries to refresh ratings and review data
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      queryClient.invalidateQueries({ queryKey: ['userReview'] });
      setCurrentStep(4);
      // Don't reset verification data after successful submission
    },
    onError: (err: any) => {
      toast.review.error(err?.response?.data?.error?.message || 'Failed to submit review');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ reviewId, payload }: { reviewId: string; payload: any }) => 
      updateReview(reviewId, payload),
    onSuccess: () => {
      toast.review.success('Review updated successfully!');
      // Invalidate product-related queries to refresh ratings and review data
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      queryClient.invalidateQueries({ queryKey: ['userReview'] });
      setCurrentStep(4);
      // Don't reset verification data after successful update
    },
    onError: (err: any) => {
      toast.review.error(err?.response?.data?.error?.message || 'Failed to update review');
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      updateReviewData({
        rating: data.rating,
        title: data.title,
        description: data.description,
      });

      const subRatingsPayload = Object.fromEntries(
        Object.entries(data.subRatings).map(([k, v]) => [k, v === 'N/A' ? 0 : parseInt(v)])
      );

      // Require at least 1 image (up to 3) when screenshot verification is not selected
      const shouldRequireAttachment = (verificationData?.method !== 'screenshot') || (isEditMode && existingReview?.verification?.verificationType !== 'screenshot');
      if (shouldRequireAttachment) {
        const totalCount = (data.files?.length || 0) + (existingFileUrls?.length || 0);
        if (totalCount < 1) {
          toast.review.error('Please attach at least 1 image (up to 3).');
          return;
        }
      }

      // Handle file upload if present
      const originalExisting = (existingReview?.metaData?.attachments || []).slice(0, 3);
      const hasNewFiles = Array.isArray(data.files) && data.files.length > 0;
      const hasExistingChanged = originalExisting.length !== (existingFileUrls?.length || 0)
        || originalExisting.some((att: any) => !existingFileUrls.includes(att.fileUrl));

      let metaData: any = {
        reviewVersion: '1.0',
        attachments: []
      };

      // If we have new files, upload them
      if (hasNewFiles) {
        setIsUploadingFile(true);
        toast.loading('Uploading images...');
        try {
          // Start with kept existing attachments so we never lose them if upload returns empty
          const keptExisting = (isEditMode && originalExisting.length)
            ? originalExisting.filter((att: any) => existingFileUrls.includes(att.fileUrl))
            : [];
          metaData.attachments = keptExisting.slice(0, 3);

          // Upload files individually for consistent response handling
          const newAttachments = [];
          for (const file of data.files) {
            const uploadResponse = await FileUploadService.uploadFile(file);
            if (uploadResponse.success && uploadResponse.data) {
              newAttachments.push({
                fileName: uploadResponse.data.originalName || uploadResponse.data.filename || file.name,
                fileUrl: uploadResponse.data.url || uploadResponse.data.bestImageUrl || FileUploadService.getFileUrl(uploadResponse.data),
                fileType: uploadResponse.data.mimeType || file.type,
                fileSize: uploadResponse.data.size || file.size,
                uploadedAt: new Date().toISOString()
              });
            }
          }
          metaData.attachments = [...metaData.attachments, ...newAttachments].slice(0, 3);
          toast.dismiss();
        } catch (uploadError) {
          toast.dismiss();
          toast.review.error('Failed to upload images. Please try again.');
          return;
        } finally {
          setIsUploadingFile(false);
        }
      }
      // If we're in edit mode and have no new files, reflect deletions or keep originals
      else if (isEditMode) {
        if (hasExistingChanged) {
          const keptExisting = originalExisting.filter((att: any) => existingFileUrls.includes(att.fileUrl));
          metaData.attachments = keptExisting.slice(0, 3);
        } else {
          metaData.attachments = originalExisting;
        }
      }

      if (isEditMode && existingReview) {
        // Update existing review
        const updatePayload: any = {
          overallRating: data.rating,
          title: data.title,
          content: data.description,
          subRatings: subRatingsPayload,
          // Always send metaData on update so backend persists additions/removals/no-change correctly
          metaData,
        };
        
        updateMutation.mutate({ 
          reviewId: existingReview._id, 
          payload: updatePayload 
        });
      } else {
        // Create new review
        let verification: any = undefined;
        if (verificationData && verificationData.method) {
          let verificationType: 'company_email' | 'linkedin' | 'vendor_invite' | 'screenshot' = 'company_email';
          let verificationDataField: any = {};
          if (verificationData.method === 'company-email') {
            verificationType = 'company_email';
            verificationDataField = { companyEmail: verificationData.companyEmail };
          } else if (verificationData.method === 'vendor-invitation') {
            verificationType = 'vendor_invite';
            verificationDataField = { vendorInvitationLink: verificationData.vendorInvitationLink };
          } else if (verificationData.method === 'screenshot') {
            verificationType = 'screenshot';
            verificationDataField = { screenshot: verificationData.screenshot };
            metaData.attachments= verificationData.attachments
          } else if (verificationData.method === 'linkedin') {
            verificationType = 'linkedin';
            verificationDataField = { ...verificationData?.linkedInData  };
          }
          verification = {
            isVerified: verificationData.isVerified || false,
            verificationType,
            verificationData: verificationDataField,
          };
        }

        const createPayload = {
          product: selectedSoftware?.id || '',
          overallRating: data.rating,
          title: data.title,
          content: data.description,
          subRatings: subRatingsPayload,
          verification,
          ...(metaData.attachments.length > 0 && { metaData })
        };
        
        createMutation.mutate(createPayload);
      }
    } catch (error) {
      console.log('error', error)
      toast.dismiss();
      toast.review.error('Error preparing review data');
    }
  };

  const handleRatingChange = (rating: number) => {
    setValue("rating", rating, { shouldValidate: true });
  };
  console.log('verificationData', verificationData, 'existingReview', existingReview)

  const handleSubRatingChange = (category: string, rating: number) => {
    setValue(`subRatings.${category}` as any, rating.toString(), { shouldValidate: true });
  };

  const SubRatingRow = ({ 
    category, 
    label 
  }: { 
    category: string; 
    label: string; 
  }) => {
    const currentRating = watchedSubRatings[category as keyof typeof watchedSubRatings] || '';
    return (
      <div className="rounded-lg border border-gray-200">
        <div className="flex items-center justify-between  bg-blue-50 px-2 py-2">
          <span className="font-medium text-gray-900">• {label}</span>
        </div>
        <div className="flex items-center gap-2 p-4">
          {[1, 2, 3, 4, 5, 6, 7].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => handleSubRatingChange(category, rating)}
              className={`w-10 h-10 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                currentRating === rating.toString()
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              {rating}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setValue(`subRatings.${category}` as any, 'N/A', { shouldValidate: true })}
            className={`  w-10 h-10 rounded-full text-sm font-medium transition-colors cursor-pointer flex items-center justify-center ${
              currentRating === 'N/A'
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            N/A
          </button>
        </div>
        {errors.subRatings?.[category as keyof typeof errors.subRatings] && (
          <p className="text-red-500 text-sm my-2 px-2">
            {(errors.subRatings[category as keyof typeof errors.subRatings] as any)?.message || 'Invalid rating'}
          </p>
        )}
      </div>
    );
  };

  if (isCheckingReview) {
    return <WriteReviewSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Mobile stepper button */}
      {!isEditMode && <div className="sm:hidden block">
        <button
          onClick={() => setShowStepper && setShowStepper(true)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back </span>
        </button>
      </div>}

      <div className="max-w-2xl">
        <h1 className="font-buffalo font-normal text-gray-900 mb-4" style={{ fontSize: '59px', lineHeight: '100%', letterSpacing: '0px' }}>
          {isEditMode ? 'Edit your review for' : 'Write a review for'} {selectedSoftware ? selectedSoftware.name : 'this software'}
        </h1>
        
        {/* {isEditMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 font-medium">
              You're editing your existing review. Changes will be reviewed by our team before being published.
            </p>
          </div>
        )} */}

        {/* Disclaimer */}
        <div className="text-sm text-gray-600 mb-8 space-y-1">
          <p>• Your review will only be published after it has been reviewed by our team and passed quality checks.</p>
          <p>• This may take up to <strong>3 business days</strong>.</p>
          <p>• If your review is incentivised, it can take up to <strong>1-2 additional business days</strong> to receive it.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Overall Rating */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Select Overall Rating
            </h3>
            <div className="flex items-center gap-1">
              <StarRating
                rating={watchedRating}
                starClassName="w-10 h-10"
                onRatingChange={handleRatingChange}
              />
            </div>
            {errors.rating && (
              <p className="text-red-500 text-sm mt-2">{errors.rating.message}</p>
            )}
          </div>

          {/* Review Title */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Review Title
            </h3>
            <Input
              {...register("title")}
              placeholder="Write review title..."
              className={`w-full ${errors.title ? "border-red-500" : ""}`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-2">{errors.title.message}</p>
            )}
          </div>

          {/* Review Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Write Review
            </h3>
            <Textarea
              {...register("description")}
              placeholder="Write about your experience..."
              className={`w-full min-h-32 max-h-[300px] rounded-lg resize-none break-all ${errors.description ? "border-red-500" : ""}`}
              rows={6}
              maxLength={2000}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-2">{errors.description.message}</p>
            )}
          </div>

          {/* Sub Ratings */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Sub Ratings
              </h3>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowTooltip(!showTooltip)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                  aria-label="Rating scale information"
                >
                  <HelpCircle className="w-5 h-5 text-gray-500" />
                </button>
                
                {showTooltip && (
                  <div 
                    className="absolute left-0 top-8 z-10 w-72 p-3 bg-white border border-gray-200 rounded-lg shadow-lg"
                    data-tooltip-container
                  >
                    <div className="text-sm text-gray-700">
                      <div className="font-medium mb-2">Rating Scale Guide:</div>
                      <div className="space-y-1">
                        <div><strong>1:</strong> Very Poor</div>
                        <div><strong>2:</strong> Poor</div>
                        <div><strong>3:</strong> Fair</div>
                        <div><strong>4:</strong> Good</div>
                        <div><strong>5:</strong> Very Good</div>
                        <div><strong>6:</strong> Excellent</div>
                        <div><strong>7:</strong> Outstanding</div>
                        <div><strong>N/A:</strong> Not Applicable/No Experience</div>
                      </div>
                    </div>
                    {/* Arrow pointing up */}
                    <div className="absolute -top-2 left-4 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4">
              {subRatingCategories.map(({ key, label }) => (
                <SubRatingRow
                  key={key}
                  category={key}
                  label={label}
                />
              ))}
            </div>
          </div>

          {/* File Upload Section - Hidden if verification type is screenshot */}
          {(verificationData?.method !== 'screenshot' || existingReview && existingReview?.verification?.verificationType !== 'screenshot') && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Attach Images (1-3)
              </h3>
              <p className="text-gray-500 text-sm mb-4">Confirm that you are a current user of {selectedSoftware?.name} by uploading a screenshot showing you logged into {selectedSoftware?.name}.</p>
            <div
              className="border-2 border-dashed border-blue-400 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-blue-50 transition"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const dropped = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
                if (dropped.length > 0) {
                  const maxBytes = 5 * 1024 * 1024;
                  const oversized = dropped.filter((f) => f.size > maxBytes);
                  const validFiles = dropped.filter((f) => f.size <= maxBytes);
                  if (oversized.length > 0) {
                    toast.review.error('Each image must be less than 5MB');
                  }
                  const remainingSlots = Math.max(0, 3 - (existingFileUrls.length + selectedFiles.length));
                  if (validFiles.length > remainingSlots) {
                    toast.review.error('Max 3 images allowed');
                  }
                  const toAdd = validFiles.slice(0, remainingSlots);
                  const combined = [...selectedFiles, ...toAdd];
                  setSelectedFiles(combined);
                  setValue("files", combined, { shouldValidate: true });
                }
              }}
            >
              <input
                {...register("files")}
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              {selectedFiles.length > 0 || (watchedFiles && watchedFiles.length > 0) || existingFileUrls.length > 0 ? (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {existingFileUrls.map((url, idx) => (
                    <div key={`existing-${idx}`} className="relative">
                      <img src={url} alt={`Existing attachment ${idx + 1}`} className="w-full h-48 object-cover rounded-lg" />
                 
                        <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeExistingFileAt(idx);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {selectedFiles.map((file, idx) => (
                    <div key={`selected-${idx}`} className="relative">
                      <img src={URL.createObjectURL(file)} alt={`Selected image ${idx + 1}`} className="w-full h-48 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSelectedFileAt(idx);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <div className="col-span-full flex justify-end">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); clearFiles(); }}
                      className="text-sm text-red-600 hover:text-red-700 underline"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
                    <path
                      d="M24 34V14m0 0l-7 7m7-7l7 7"
                      stroke="#2563EB"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="8"
                      y="34"
                      width="32"
                      height="6"
                      rx="3"
                      fill="#2563EB"
                      fillOpacity=".1"
                    />
                  </svg>
                  <div className="mt-2 text-base">
                    <span className="text-blue-600 underline cursor-pointer">
                      Click here
                    </span>{" "}
                    to upload or drop images here (max 3)
                  </div>
                  <div className="text-gray-500 text-sm mt-1">
                    Support JPG, PNG, GIF (Max 5MB)
                  </div>
                </div>
              )}
            </div>
            {errors.files && (
              <p className="text-red-500 text-sm mt-2">{(errors.files as any)?.message}</p>
            )}
          </div>
          )}
          
          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending || isUploadingFile}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold min-w-32"
              loading={createMutation.isPending || updateMutation.isPending || isUploadingFile}
            >
              {isUploadingFile ? "Uploading..." : isEditMode ? "Update" : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WriteReview; 