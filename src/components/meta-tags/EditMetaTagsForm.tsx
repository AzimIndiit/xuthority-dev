import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const metaTagsSchema = z.object({
  pageName: z.string().min(1, "Page name is required"),
  metaTitle: z.string().min(1, "Meta title is required").max(60, "Meta title should not exceed 60 characters"),
  metaDescription: z.string().min(1, "Meta description is required").max(160, "Meta description should not exceed 160 characters"),
});

type MetaTagsFormInputs = z.infer<typeof metaTagsSchema>;

interface EditMetaTagsFormProps {
  initialData?: {
    pageName: string;
    metaTitle: string;
    metaDescription: string;
  };
  onSubmit: (data: MetaTagsFormInputs) => void;
}

export const EditMetaTagsForm = ({ initialData, onSubmit }: EditMetaTagsFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<MetaTagsFormInputs>({
    resolver: zodResolver(metaTagsSchema),
    defaultValues: initialData || {
      pageName: "Landing Page",
      metaTitle: "Discover Top Business Software",
      metaDescription: "Discover top-rated business software tailored to your needs. Easily compare features, explore verified solutions, and read trusted user reviews—all in one place to help you make confident, informed decisions.",
    },
  });

  const metaTitle = watch("metaTitle");
  const metaDescription = watch("metaDescription");

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-normal text-gray-700">
          Meta Tags <span className="text-gray-400">/</span> <span className="font-semibold text-gray-900">Edit Meta Tags</span>
        </h1>
        <Button 
          onClick={handleSubmit(onSubmit)}
          className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-full px-8 py-2.5 font-medium text-base"
        >
          Update
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="pageName" className="text-base font-medium text-gray-900">
            Page Name
          </Label>
          <Select 
            defaultValue={initialData?.pageName || "Landing Page"}
            onValueChange={(value) => setValue("pageName", value)}
          >
            <SelectTrigger 
              id="pageName"
              className="w-full h-12 rounded-lg border-gray-300 bg-gray-50 text-gray-900 font-normal"
            >
              <SelectValue placeholder="Select a page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Landing Page">Landing Page</SelectItem>
              <SelectItem value="About Page">About Page</SelectItem>
              <SelectItem value="Products Page">Products Page</SelectItem>
              <SelectItem value="Contact Page">Contact Page</SelectItem>
            </SelectContent>
          </Select>
          {errors.pageName && (
            <p className="text-red-500 text-sm mt-1">{errors.pageName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaTitle" className="text-base font-medium text-gray-900">
            Meta Title
          </Label>
          <div className="relative">
            <Input
              id="metaTitle"
              {...register("metaTitle")}
              className="w-full h-12 rounded-lg border-gray-300 bg-gray-50 text-gray-900 font-normal pr-12"
              placeholder="Enter meta title"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              aria-label="Expand meta title"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="#6B7280"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          {errors.metaTitle && (
            <p className="text-red-500 text-sm mt-1">{errors.metaTitle.message}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            {metaTitle.length}/60 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaDescription" className="text-base font-medium text-gray-900">
            Meta Description
          </Label>
          <Textarea
            id="metaDescription"
            {...register("metaDescription")}
            className="w-full min-h-[150px] rounded-lg border-gray-300 bg-gray-50 text-gray-900 font-normal resize-none"
            placeholder="Enter meta description"
          />
          {errors.metaDescription && (
            <p className="text-red-500 text-sm mt-1">{errors.metaDescription.message}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            {metaDescription.length}/160 characters
          </p>
        </div>
      </form>
    </div>
  );
};