import React, { useEffect, useState, useRef } from 'react';
import { useForm, useFieldArray, FormProvider, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addProduct, Product } from '../../services/product';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { FormInput } from '../../components/ui/FormInput';
import { FormSelect } from '../../components/ui/FormSelect';
import { FormTextarea } from '../../components/ui/FormTextarea';

import { useIndustryOptions } from '@/hooks/useIndustry';
import { useSoftwareOptions } from '@/hooks/useSoftwareOptions';
import { useSolutionOptions } from '@/hooks/useSolutionOptions';
import { useUserRoleOptions } from '@/hooks/useUserRoleOptions';
import { useIntegrationOptions } from '@/hooks/useIntegrationOptions';
import { useLanguageOptions } from '@/hooks/useLanguageOptions';
import { useMarketSegmentOptions } from '@/hooks/useMarketSegmentOptions';
import { ArrowLeftIcon, X } from 'lucide-react';
import { FileUpload } from '@/types/file';
import { useToast } from '@/hooks/useToast';
import { useAddProduct, useFetchProductById, useUpdateProduct } from '@/hooks/useProducts';
import { getNestedError, hasNestedError, getNestedErrorMessage } from '@/utils/formUtils';
import { Switch } from '@/components/ui/switch';
const fileOrString = z.union([z.instanceof(File), z.string()]);
const MAX_FILE_SIZE_MB = 10;
const MAX_MEDIA_FILES = 5;
const schema = z.object({
  name: z.string().min(3, 'Product name is required').trim().nonempty('Product name is required'),
  websiteUrl: z.string().url('Enter a valid URL').trim().nonempty('Website URL is required'),
  contactEmail: z.string().email('Enter a valid email address').trim().nonempty('Contact email is required'),
  softwareIds: z.array(z.string()).min(1, 'Software is required'),
  solutionIds: z.array(z.string()).min(1, 'Solution is required'),
  whoCanUse: z.array(z.string()).min(1, 'Who can use is required'),
  industries: z.array(z.string()).min(1, 'Industry is required'),
  integrations: z.array(z.string()).min(1, 'Integration is required'),
  languages: z.array(z.string()).min(1, 'Language is required'),
  marketSegment: z.array(z.string()).min(1, 'Market segment is required'),
  brandColors: z.string().min(1, 'Brand color is required').trim().nonempty('Brand color is required'),
  description: z.string().min(10, 'Description is required').trim().nonempty('Description is required'),
  logoUrl: fileOrString, // Required, single File or URL
  isFree: z.boolean().default(false),

  mediaUrls: z
    .array(fileOrString) // Array of File or URL
    .min(5, "You must provide exactly 5 media files (images/videos).")
    .max(5, "You must provide exactly 5 media files (images/videos)."),
  features: z
  .array(
    z.object({
      title: z.string().min(1, 'Feature title is required') .trim().nonempty('Feature title is required'),
      description: z
        .array(
          z.object({
            value: z.string().min(1, 'Feature description is required') .trim().nonempty('Feature description is required'),
          })
        )
        .min(1, 'At least one description is required'),
    })
  )
  .optional()
  .default([]),

pricing: z
  .array(
    z.object({
      name: z.string().min(1, 'Pricing name is required') .trim().nonempty('Pricing name is required'),
      price: z.coerce.number().min(0, 'Price must be a positive number').max(1000000, 'Price cannot exceed 1,000,000'),
      seats: z.coerce.number().min(1, 'No of seats must be at least 1').max(10000, 'No of seats cannot exceed 10,000'),
      description: z.string().min(1, 'Pricing description is required') .trim().nonempty('Pricing description is required'),
      features: z
        .array(
          z.object({
            value: z.string().min(1, 'Feature is required') .trim().nonempty('Feature is required'),
          })
        )
        .min(1, 'At least one feature is required'),
    })
  )
  .optional()
  .default([]),
}).superRefine((data, ctx) => {
  // Validate pricing based on product's isFree status
  if (!data.isFree && data.pricing) {
    data.pricing.forEach((plan, index) => {
      if (plan.price <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['pricing', index, 'price'],
          message: 'Price must be greater than 0 for paid products',
        });
      }
    });
  }
});

type FormData = z.infer<typeof schema>;

const defaultValues: FormData = {
  name: '',
  websiteUrl: '',
  contactEmail: '',
  softwareIds: [],
  solutionIds: [],
  whoCanUse: [],
  industries: [],
  integrations: [],
  languages: [],
  marketSegment: [],
  brandColors: '',
  description: '',
  logoUrl: '',
  isFree: false,
  mediaUrls: [],
  features: [],
  pricing: [],
};

interface PricingFeaturesFieldArrayProps {
  nestIndex: number;
  control: Control<FormData>;
  loading: boolean;
  errors: any;
}

interface FeaturesDescriptionFieldArrayProps {
  nestIndex: number;
  control: Control<FormData>;
  loading: boolean;
  errors: any;
}

const PricingFeaturesFieldArray: React.FC<PricingFeaturesFieldArrayProps> = ({ nestIndex, control, loading, errors }) => {

  const { fields, append, remove } = useFieldArray({
    control,
    name: `pricing.${nestIndex}.features` as any,
  });
  
  return (
    <div>
      {fields.map((field, fIdx) => {
        const fieldPath = `pricing.${nestIndex}.features.${fIdx}.value`;
        const fieldError = getNestedErrorMessage(errors, fieldPath);
        
        return (
        <div key={field.id} className="flex items-end gap-2 mb-4">
          <div className="flex-1">
            <FormInput
              name={`pricing.${nestIndex}.features.${fIdx}.value` as const}
              label={`Feature ${fIdx + 1}`}
              placeholder={`Enter plan feature ${fIdx + 1}`}
              maxLength={200}
              disabled={loading}
              customError={fieldError}
            />
            {fieldError && <p className="text-red-500 text-sm mt-1">{fieldError}</p>}
          </div>
          <div className="flex  gap-2 mb-1">
            {fields.length > 1 && (
              <button
                disabled={loading}
                type="button"
                className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl hover:bg-red-600 transition cursor-pointer"
                onClick={() => remove(fIdx)}
                title="Remove Feature"
              >
                &minus;
              </button>
            )}
            {fIdx === fields.length - 1 && (
              <button
                disabled={loading}
                type="button"
                className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl hover:bg-blue-700 transition cursor-pointer"
                onClick={() => append({value: ''})}
                title="Add Feature"
              >
                +
              </button>
            )}
          </div>
        </div>
        );
      })}
    </div>
  );
};
const FeaturesDescriptionFieldArray: React.FC<FeaturesDescriptionFieldArrayProps> = ({
  nestIndex,
  control,
  loading,
  errors
}) => {

  const { fields, append, remove } = useFieldArray({
    control,
    name: `features.${nestIndex}.description`, // Now this is an array of objects
  });

  return (
    <div>
      <label className="block font-medium mb-2">Feature Descriptions</label>
      {fields.map((field, fIdx) => {
        const fieldPath = `features.${nestIndex}.description.${fIdx}.value`;
        const fieldError = getNestedErrorMessage(errors, fieldPath);
        
        return (
        <div key={field.id} className="flex items-end gap-2 mb-4">
          <div className="flex-1">
            <FormInput
              name={`features.${nestIndex}.description.${fIdx}.value` as const}
              label={`Description ${fIdx + 1}`}
              placeholder={`Enter feature description ${fIdx + 1}`}
              maxLength={200}
              disabled={loading}
              customError={fieldError}
            />
            {fieldError && <p className="text-red-500 text-sm mt-1">{fieldError}</p>}
          </div>
          <div className="flex  gap-2 mb-1">
            {fields.length > 1 &&  (
              <button
                disabled={loading}
                type="button"
                className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl hover:bg-red-600 transition cursor-pointer"
                onClick={() => remove(fIdx)}
                title="Remove Description"
              >
                &minus;
              </button>
            )}
            {fIdx === fields.length - 1 && (
              <button
                disabled={loading}
                type="button"
                className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl hover:bg-blue-700 transition cursor-pointer  "
                onClick={() => append({ value: '' })}
                title="Add Description"
              >
                +
              </button>
            )}
          </div>
        </div>
        );
      })}
    </div>
  );
};

const AddProductPage: React.FC = () => {
  const addProductMutation = useAddProduct();
  const [isLogoDragActive, setIsLogoDragActive] = useState(false);
  const [isMediaDragActive, setIsMediaDragActive] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  
  // File upload refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const { handleSubmit, control, setValue,reset,getValues, formState: { isSubmitting } ,watch ,formState:{errors},clearErrors,setError} = methods;
  console.log(errors,"errors");
  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control,
    name: 'features',
  });
  const { fields: pricingFields, append: appendPricing, remove: removePricing } = useFieldArray({
    control,
    name: 'pricing',
  });
  console.log('errors', errors)

  const { options: industryOptions, isLoading: industryLoading } = useIndustryOptions();
  const { options: softwareOptions, isLoading: softwareLoading } = useSoftwareOptions();
  const { options: solutionOptions, isLoading: solutionLoading } = useSolutionOptions();
  const { options: userRoleOptions, isLoading: userRoleLoading } = useUserRoleOptions();
  const { options: integrationOptions, isLoading: integrationLoading } = useIntegrationOptions();
  const { options: languageOptions, isLoading: languageLoading } = useLanguageOptions();
  const { options: marketSegmentOptions, isLoading: marketSegmentLoading } = useMarketSegmentOptions();
  const [mediaFiles, setMediaFiles] = useState<File[] | FileUpload[]>([]);

  // Click handlers for triggering file inputs
  const handleLogoAreaClick = () => {
    logoInputRef.current?.click();
  };

  const handleMediaAreaClick = () => {
    mediaInputRef.current?.click();
  };

  const handleLogoChange = async (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>
  ) => {
    let file: File | undefined;
  
    // Handle drag-and-drop
    if ("dataTransfer" in e) {
      e.preventDefault();
      file = e.dataTransfer.files?.[0];
    } else {
      file = e.target.files?.[0];
    }
  
    if (!file) return;
  
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`File size must be less than ${MAX_FILE_SIZE_MB}MB`);
      return;
    }
  
    setValue("logoUrl", file);
    console.log(file,"sd");
  
    // Clear input field if coming from <input>
    if ("target" in e) {
      (e.target as HTMLInputElement).value = "";
    }
  };

  const handleMediaChange = async (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
  
    let files: File[] = [];
  
    // Get files from input or drag-and-drop
    if ("dataTransfer" in e) {
      files = Array.from(e.dataTransfer.files || []);
    } else {
      files = Array.from(e.target.files || []);
    }
  
    if (!files.length) return;
  
    // Validate size
    const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE_MB * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error(`Each file must be less than ${MAX_FILE_SIZE_MB}MB`);
      return;
    }
  
    // Combine with existing and check count
    const currentFiles = mediaFiles || [];
    const totalFiles = currentFiles.length + files.length;
  
    if (totalFiles > MAX_MEDIA_FILES) {
      toast.error(`You can only upload up to ${MAX_MEDIA_FILES} media files`);
      return;
    }
  
    const newFiles = [...currentFiles, ...files];
   clearErrors('mediaUrls')
    setMediaFiles(newFiles as File[] | FileUpload[]);
    setValue('mediaUrls', newFiles as File[] | string[]);
  
   
  
    // Clear file input
    if ("target" in e) {
      (e.target as HTMLInputElement).value = "";
    }
  };
  

  const onSubmit = async (data: FormData) => {
    // Filter out empty features and pricing
    const filteredData = {
      ...data,
      features: data.features?.filter(feature => 
        feature.title.trim() !== '' || 
        feature.description.some(desc => desc.value.trim() !== '')
      ),
      pricing: data.pricing?.filter(price => 
        price.name.trim() !== '' || 
        price.description.trim() !== '' ||
        price.price > 0
      )
    };

    await addProductMutation.mutateAsync(filteredData as any);
    navigate('/profile/products');
  };

  // Function to capitalize each word in the product name
  const capitalizeProductName = (value: string) => {
    return value
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Handle product name change with capitalization
  const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const capitalizedValue = capitalizeProductName(e.target.value);
    setValue('name', capitalizedValue);
  };

  const onError = (errors: any) => {
    const firstErrorKey = Object.keys(errors)[0];
    const targetId = firstErrorKey === "mediaUrls" ? "mediaUrlsLabel" : firstErrorKey === "logoUrl" ? "logoUrlLabel" : firstErrorKey;
    const element = document.getElementById(targetId);
    console.log(element,"element");
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus?.();
      }, 0);
    }
  };
console.log('mediaUrls', mediaFiles)
  return (
    <div className="max-w-5xl mx-auto py-8 sm:px-2">
      <div className="flex justify-between items-center mb-6">
         <h1 className="text-2xl font-bold">Add Product</h1>
        <Button onClick={() => navigate('/profile/products')} className="bg-blue-600 text-white px-4 py-2 rounded-full" variant="default" leftIcon={ArrowLeftIcon}>Back To Products</Button>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit,onError)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput 
              name="name" 
              label="Product Name" 
              maxLength={100} 
              disabled={addProductMutation.isPending} 
              placeholder='Enter product name'
              onChange={handleProductNameChange}
            />
            <FormInput name="websiteUrl" label="Product Website" maxLength={200} placeholder='Enter product website' disabled={addProductMutation.isPending} />
            <FormInput 
              name="contactEmail" 
              label="Contact Email" 
              type="email"
              maxLength={100} 
              placeholder='Enter contact email' 
              disabled={addProductMutation.isPending} 
            />
            <FormInput name="brandColors" type='color' label="Brand Colors" maxLength={100} disabled={addProductMutation.isPending}  />
            <FormSelect name="softwareIds" label="Software" placeholder="Select software" options={softwareOptions} searchable disabled={softwareLoading || addProductMutation.isPending} multiple  />
            <FormSelect name="solutionIds" label="Solutions" placeholder="Select solutions" options={solutionOptions} searchable disabled={solutionLoading || addProductMutation.isPending} multiple  />
            <FormSelect name="whoCanUse" label="Who can use" placeholder="Select user roles" options={userRoleOptions} searchable disabled={userRoleLoading || addProductMutation.isPending} multiple  />
            <FormSelect name="industries" label="Industries" placeholder="Select industry" options={industryOptions} searchable disabled={industryLoading || addProductMutation.isPending} multiple  />
            <FormSelect name="integrations" label="Integrations" placeholder="Select integrations" options={integrationOptions} searchable disabled={integrationLoading || addProductMutation.isPending} multiple  />
            <FormSelect name="languages" label="Languages" placeholder="Select languages" options={languageOptions} searchable disabled={languageLoading || addProductMutation.isPending} multiple  />
            <FormSelect name="marketSegment" label="Market Segment" placeholder="Select market segment" options={marketSegmentOptions} searchable disabled={marketSegmentLoading || addProductMutation.isPending} multiple  />
          </div>
          <FormTextarea name="description" label="Description" rows={8} maxLength={2000} className="w-full" disabled={addProductMutation.isPending} placeholder='Enter product description' />
          
          {/* Product Free Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            <div>
              <h3 className="font-medium text-gray-900">Product Pricing</h3>
              <p className="text-sm text-gray-600">Is this product available for trial?</p>
            </div>
            <label className="flex items-center gap-3">
              <span className="text-sm font-medium">Available for trial</span>
              <Switch
                checked={watch('isFree')}
                onCheckedChange={(checked) => setValue('isFree', checked)}
                disabled={addProductMutation.isPending}
              />
            </label>
          </div>

          {/* Logo and Media Uploads */}
          <div className="grid grid-cols-1  gap-6">
      {/* Logo Upload */}
      <div className='max-w-2xl'>
        <label className="block mb-1 font-medium " id="logoUrlLabel">Upload Product Logo</label>
      <div className='flex items-center justify-start gap-6'>
      <div
          onDrop={handleLogoChange}
          onDragOver={(e) => {
            e.preventDefault();
            setIsLogoDragActive(true);
          }}
          onDragLeave={() => setIsLogoDragActive(false)}
          onClick={handleLogoAreaClick}
          className={`border-2 ${isLogoDragActive ? 'border-blue-500' : 'border-dashed border-gray-300'} rounded-md p-4 flex items-center justify-center h-40 cursor-pointer hover:bg-gray-50 transition-colors`}
        >
          <input 
            ref={logoInputRef}
            type="file" 
            accept="image/*" 
            onChange={handleLogoChange} 
            className="hidden" 
          />
          <div className="flex flex-col items-center text-gray-500 w-full h-full justify-center">
            <svg className="w-10 h-10 mb-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0 0V8m0 4h4m-4 0H8m12 4a4 4 0 01-4 4H8a4 4 0 01-4-4V8a4 4 0 014-4h8a4 4 0 014 4v8z" />
            </svg>
            <span>Drag & drop media or <span className="text-blue-600 underline">click here</span></span>
          </div>
        </div>
        {
            watch('logoUrl') &&
             <div className="relative w-28  ">
             <img src={typeof watch('logoUrl') === 'string' ? watch('logoUrl') as string : URL.createObjectURL(watch('logoUrl') as File)} alt="Logo Preview" className=" h-28 w-28 rounded object-contain" />
             <button
               type="button"
               onClick={() => setValue('logoUrl', '', { shouldValidate: true })}
               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm cursor-pointer"
             >
               &times;
             </button>
           </div>
          }
      </div>
      </div>
      {errors.logoUrl && <p className="text-red-500 text-sm mt-1">{errors.logoUrl.message}</p>}

      {/* Media Upload */}
      <div>
        <label className="block mb-1 font-medium" id="mediaUrlsLabel">Upload Product Images & Videos</label>
        <div
          onDrop={handleMediaChange}
          onDragOver={(e) => {
            e.preventDefault();
            setIsMediaDragActive(true);
          }}
          onDragLeave={() => setIsMediaDragActive(false)}
          onClick={handleMediaAreaClick}
          className={`border-2 ${isMediaDragActive ? 'border-blue-500' : 'border-dashed border-gray-300'} rounded-md p-4 flex flex-col items-center justify-center text-center h-40 cursor-pointer hover:bg-gray-50 transition-colors`}
        >
          <input 
            ref={mediaInputRef}
            type="file" 
            accept="image/*,video/*" 
            multiple 
            onChange={handleMediaChange} 
            className="hidden" 
          />
          <div className="flex flex-col items-center text-gray-500">
            <svg className="w-10 h-10 mb-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0 0V8m0 4h4m-4 0H8m12 4a4 4 0 01-4 4H8a4 4 0 01-4-4V8a4 4 0 014-4h8a4 4 0 014 4v8z" />
            </svg>
            <span>Drag & drop images/videos or <span className="text-blue-600 underline">click here</span></span>
            <p className="text-red-500 text-sm mt-1">Max 5 files allowed (10MB each) - Images & Videos supported</p>
          </div>
        </div>
        {errors.mediaUrls && <p className="text-red-500 text-sm mt-1">{errors.mediaUrls.message}</p>}

        {mediaFiles.length > 0 && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {mediaFiles.map((file, idx) => {
              const fileUrl = typeof file === 'string' ? file : URL.createObjectURL(file);
              const isVideo = typeof file === 'string' 
                ? file.includes('.mp4') || file.includes('.webm') || file.includes('.mov') || file.includes('.avi')
                : file.type?.startsWith('video/');
              
              return (
                <div key={idx} className="relative">
                  {isVideo ? (
                    <video 
                      src={fileUrl} 
                      className="rounded object-cover h-28 w-full" 
                      controls
                      preload="metadata"
                    />
                  ) : (
                    <img 
                      src={fileUrl} 
                      alt={`media-${idx}`} 
                      className="rounded object-cover h-28 w-full" 
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setMediaFiles(mediaFiles.filter((_, i) => i !== idx) as File[])}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm cursor-pointer"
                  >
                    &times;
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  
          
          {/* Features */}
          <div>
            <div className='flex justify-between items-center mb-4'>
              <h2 className="font-semibold text-lg">Features <span className="text-sm font-normal text-gray-500">(Optional)</span></h2>
              <button
                disabled={addProductMutation.isPending}
                type="button"
                className="bg-blue-600 text-white rounded-full flex items-center justify-center  w-12 h-12 shadow-md hover:bg-blue-700 transition cursor-pointer"
                onClick={() => appendFeature({ title: '', description: [{value: ''}] })}
                title="Add Feature"
              >
                +
              </button>
            </div>
            {featureFields.map((field, idx) => (
              <div key={field.id} className="mb-6 grid grid-cols-1 gap-4 border rounded-lg p-6 bg-white">
                <div className='flex justify-between items-center mb-4'>
                  <h3 className="font-semibold text-lg">Feature {idx + 1}</h3>
                  {/* {idx !== 0 && ( */}
                    <button
                      disabled={addProductMutation.isPending}
                      type="button"
                      className="bg-red-500 text-white rounded-full flex items-center justify-center  w-12 h-12 shadow-md hover:bg-red-600 transition cursor-pointer"
                      onClick={() => removeFeature(idx)}
                      title="Remove Feature"
                    >
                      -
                    </button>
                  {/* )} */}
                </div>
                <FormInput name={`features.${idx}.title`} label="Feature Title" maxLength={100} placeholder='Enter feature title' disabled={addProductMutation.isPending} customError={getNestedErrorMessage(errors, `features.${idx}.title`)} />
                {getNestedErrorMessage(errors, `features.${idx}.title`) && (
                  <p className="text-red-500 text-sm mt-1">{getNestedErrorMessage(errors, `features.${idx}.title`)}</p>
                )}
                <FeaturesDescriptionFieldArray nestIndex={idx} control={control} loading={addProductMutation.isPending} errors={errors} />
              </div>
            ))}
          </div>
          
          {/* Pricing */}
          <hr className="my-6" />
          <div>
            <div className='flex justify-between items-center mb-4'>
              <h2 className="font-semibold text-xl">Pricing <span className="text-sm font-normal text-gray-500">(Optional)</span></h2>
              <button
                disabled={addProductMutation.isPending}
                type="button"
                className="bg-blue-600 text-white rounded-full flex items-center justify-center  w-12 h-12 shadow-md hover:bg-blue-700 transition cursor-pointer"
                onClick={() => appendPricing({ name: '', price: 0, seats: 1, description: '', features: [{value: ''}] })}
                title="Add Pricing Plan"
              >
                +
              </button>
            </div>
            {pricingFields.map((field, idx) => (
                <div key={field.id} className="mb-8 p-6 rounded-lg border bg-white">
                <div className='flex justify-between items-center mb-4'>
                  <h3 className="font-semibold text-lg">Pricing Plan {idx + 1}</h3>
                  {/* {idx !== 0 && ( */}
                    <button
                      disabled={addProductMutation.isPending}
                      type="button"
                      className="bg-red-500 text-white rounded-full flex items-center justify-center  w-12 h-12 shadow-md hover:bg-red-600 transition cursor-pointer"
                      onClick={() => removePricing(idx)}
                      title="Remove Pricing Plan"
                    >
                      -
                    </button>
                  {/* )} */}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        
                  <div>
                    <FormInput name={`pricing.${idx}.name`} label="Plan Name" maxLength={100} placeholder="Enter plan name" disabled={addProductMutation.isPending} customError={getNestedErrorMessage(errors, `pricing.${idx}.name`)} />
                    {getNestedErrorMessage(errors, `pricing.${idx}.name`) && (
                      <p className="text-red-500 text-sm mt-1">{getNestedErrorMessage(errors, `pricing.${idx}.name`)}</p>
                    )}
                  </div>
        
                  <div>
                    <FormInput 
                      name={`pricing.${idx}.price`} 
                      label="Price" 
                      type="number" 
                      min={0} 
                      max={1000000} 
                      step={1}
                      disabled={addProductMutation.isPending}
                      onKeyDown={(e) => {
                        // Prevent minus and plus signs
                        if (e.key === '-' || e.key === '+') {
                          e.preventDefault();
                          return;
                        }
                        
                        // Allow only numbers and decimal point
                        if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
                          const currentValue = (e.target as HTMLInputElement).value;
                          
                          // Prevent multiple decimal points
                          if (e.key === '.' && currentValue.includes('.')) {
                            e.preventDefault();
                            return;
                          }
                          
                          // Check decimal places
                          if (currentValue.includes('.')) {
                            const decimalPlaces = currentValue.split('.')[1]?.length || 0;
                            if (decimalPlaces >= 2 && e.key !== '.') {
                              e.preventDefault();
                              return;
                            }
                          }
                          
                          const newValue = currentValue + e.key;
                          if (parseFloat(newValue) > 1000000) {
                            e.preventDefault();
                          }
                        } else if (e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                          e.preventDefault();
                        }
                      }}
                      placeholder="Enter price" 
                      customError={getNestedErrorMessage(errors, `pricing.${idx}.price`)}
                    />
                    {getNestedErrorMessage(errors, `pricing.${idx}.price`) && (
                      <p className="text-red-500 text-sm mt-1">{getNestedErrorMessage(errors, `pricing.${idx}.price`)}</p>
                    )}
                  </div>
                  <div>
                    <FormInput 
                      name={`pricing.${idx}.seats`} 
                      label="No of Seats" 
                      type="number"
                      min={1}
                      max={10000}
                      placeholder="Enter no of seats" 
                      disabled={addProductMutation.isPending} 
                      customError={getNestedErrorMessage(errors, `pricing.${idx}.seats`)}
                    />
                    {getNestedErrorMessage(errors, `pricing.${idx}.seats`) && (
                      <p className="text-red-500 text-sm mt-1">{getNestedErrorMessage(errors, `pricing.${idx}.seats`)}</p>
                    )}
                  </div>
                </div>
                <div>
                  <FormTextarea name={`pricing.${idx}.description`} className="mb-6" label="Plan Description" rows={3} maxLength={500} placeholder="Enter plan description" disabled={addProductMutation.isPending} customError={getNestedErrorMessage(errors, `pricing.${idx}.description`)} />
                  {getNestedErrorMessage(errors, `pricing.${idx}.description`) && (
                    <p className="text-red-500 text-sm mt-1">{getNestedErrorMessage(errors, `pricing.${idx}.description`)}</p>
                  )}
                </div>
                <div className="mb-2 mt-2">
                  <h4 className="font-semibold text-lg mb-2">Plan Features</h4>
                  <PricingFeaturesFieldArray nestIndex={idx} control={control} loading={addProductMutation.isPending} errors={errors} />
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex sm:justify-end w-full">
            <Button type="submit" disabled={isSubmitting || addProductMutation.isPending} className="w-full sm:w-40 h-12 rounded-full bg-blue-600 text-white text-lg font-semibold" loading={addProductMutation.isPending}>
              {addProductMutation.isPending ? 'Uploading...' : 'Save'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default AddProductPage;