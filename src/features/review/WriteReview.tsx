import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useReviewStore, useSelectedSoftware } from "@/store/useReviewStore";
import { ChevronLeft } from "lucide-react";
import StarRating from "@/components/ui/StarRating";

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
});

type FormValues = z.infer<typeof schema>;

const WriteReview: React.FC<WriteReviewProps> = ({ setShowStepper }) => {
  const selectedSoftware = useSelectedSoftware();
  const { 
    reviewData, 
    updateReviewData, 
    nextStep,
    setCurrentStep 
  } = useReviewStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      rating: reviewData.rating || 0,
      title: reviewData.title || "",
      description: reviewData.description || "",
      subRatings: {
        easeOfUse: '',
        customerSupport: '',
        features: '',
        pricing: '',
        technicalSupport: '',
      },
    },
  });

  const watchedRating = watch("rating");
  const watchedSubRatings = watch("subRatings");
console.log('watchedSubRatings', watchedSubRatings)
  const onSubmit = async (data: FormValues) => {
    try {
      // Update store with form data
      updateReviewData({
        rating: data.rating,
        title: data.title,
        description: data.description,
      });
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Move to next step
      nextStep();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleRatingChange = (rating: number) => {
    setValue("rating", rating, { shouldValidate: true });
  };

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
        <div className="flex items-center justify-between mb-3 bg-blue-50 px-2 py-1">
          <span className="font-medium text-gray-900">• {label}</span>
        </div>
        <div className="flex items-center gap-2 p-2">
          {[1, 2, 3, 4, 5, 6, 7].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => handleSubRatingChange(category, rating)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
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
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
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

  return (
    <div className="space-y-8">
      {/* Mobile stepper button */}
      <div className="sm:hidden block">
        <button
          onClick={() => setShowStepper && setShowStepper(true)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back to Steps</span>
        </button>
      </div>

      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Write a review for {selectedSoftware ? selectedSoftware.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) : 'this software'}
        </h1>
        
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
                // size="xl"
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
              className="w-full"
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
              className="w-full min-h-32"
              rows={6}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-2">{errors.description.message}</p>
            )}
          </div>

          {/* Sub Ratings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Sub Ratings
            </h3>
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

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold min-w-32"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WriteReview; 