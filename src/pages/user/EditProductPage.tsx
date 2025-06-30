import React, { useEffect, useState } from 'react';
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
import { toast } from 'react-hot-toast';
import { useFetchProductById, useUpdateProduct } from '@/hooks/useProducts';
const fileOrString = z.union([z.instanceof(File), z.string()]);
const MAX_FILE_SIZE_MB = 10;
const MAX_MEDIA_FILES = 5;
const schema = z.object({
  name: z.string().min(3, 'Product name is required'),
  websiteUrl: z.string().url('Enter a valid URL'),
  softwareIds: z.array(z.string()).min(1, 'Software is required'),
  solutionIds: z.array(z.string()).min(1, 'Solution is required'),
  whoCanUse: z.array(z.string()).min(1, 'Who can use is required'),
  industries: z.array(z.string()).min(1, 'Industry is required'),
  integrations: z.array(z.string()).min(1, 'Integration is required'),
  languages: z.array(z.string()).min(1, 'Language is required'),
  marketSegment: z.array(z.string()).min(1, 'Market segment is required'),
  brandColors: z.string().min(1, 'Brand color is required'),
  description: z.string().min(10, 'Description is required'),
  logoUrl: fileOrString, // Required, single File or URL

  mediaUrls: z
    .array(fileOrString) // Array of File or URL
    .min(5, "You must provide exactly 5 images.")
    .max(5, "You must provide exactly 5 images."),
  features: z
  .array(
    z.object({
      title: z.string().min(1, 'Feature title is required'),
      description: z
        .array(
          z.object({
            value: z.string().min(1, 'Feature description is required'),
          })
        )
        .min(1, 'At least one description is required'),
    })
      )
      .optional(), 

pricing: z
  .array(
    z.object({
      name: z.string().min(1, 'Pricing name is required'),
      price: z.string().min(1, 'Price is required'),
      seats: z.string().min(1, 'No of seats is required'),
      description: z.string().min(1, 'Pricing description is required'),
      features: z
        .array(
          z.object({
            value: z.string().min(1, 'Feature is required'),
          })
        )
        .min(1, 'At least one feature is required'),
    })
  )
  .optional(), 
});

type FormData = z.infer<typeof schema>;

const defaultValues: FormData = {
  name: '',
  websiteUrl: '',
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
  mediaUrls: [],
  features: [{ title: '', description: [{value: ''}] }],
  pricing: [{ name: '', price: '', seats: '', description: '', features: [{value: ''}] }],
};

interface PricingFeaturesFieldArrayProps {
  nestIndex: number;
  control: Control<FormData>;
}

interface FeaturesDescriptionFieldArrayProps {
  nestIndex: number;
  control: Control<FormData>;
}

const PricingFeaturesFieldArray: React.FC<PricingFeaturesFieldArrayProps> = ({ nestIndex, control }) => {
  const addProductMutation = useUpdateProduct();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `pricing.${nestIndex}.features` as any,
  });
  
  return (
    <div>
      {fields.map((field, fIdx) => (
        <div key={field.id} className="flex items-end gap-2 mb-4">
          <div className="flex-1">
            <FormInput
              name={`pricing.${nestIndex}.features.${fIdx}.value` as const}
              label={`Feature ${fIdx + 1}`}
              placeholder={`Enter plan feature ${fIdx + 1}`}
              maxLength={200}
              disabled={addProductMutation.isPending}
            />
          </div>
          <div className="flex  gap-2 mb-1">
            {fields.length > 1 && (
              <button
                disabled={addProductMutation.isPending}
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
                disabled={addProductMutation.isPending}
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
      ))}
    </div>
  );
};
const FeaturesDescriptionFieldArray: React.FC<FeaturesDescriptionFieldArrayProps> = ({
  nestIndex,
  control,
}) => {
  const addProductMutation = useUpdateProduct();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `features.${nestIndex}.description`, // Now this is an array of objects
  });

  return (
    <div>
      <label className="block font-medium mb-2">Feature Descriptions</label>
      {fields.map((field, fIdx) => (
        <div key={field.id} className="flex items-end gap-2 mb-4">
          <div className="flex-1">
            <FormInput
              name={`features.${nestIndex}.description.${fIdx}.value` as const}
              label={`Description ${fIdx + 1}`}
              placeholder={`Enter feature description ${fIdx + 1}`}
              maxLength={200}
              disabled={addProductMutation.isPending}
            />
          </div>
          <div className="flex  gap-2 mb-1">
            {fields.length > 1 &&  (
              <button
                disabled={addProductMutation.isPending}
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
                disabled={addProductMutation.isPending}
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
      ))}
    </div>
  );
};

const EditProductPage: React.FC = () => {
  const {productID} = useLocation().state as {productID: string};
  const {data: product, isLoading: productLoading} = useFetchProductById(productID as string);
  const addProductMutation = useUpdateProduct();
  const [isLogoDragActive, setIsLogoDragActive] = useState(false);
  const [isMediaDragActive, setIsMediaDragActive] = useState(false);
  const navigate = useNavigate();
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const { handleSubmit, control, setValue,reset,getValues, formState: { isSubmitting } ,watch ,formState:{errors},clearErrors} = methods;
  console.log(errors,"errors");
  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control,
    name: 'features',
  });
  const { fields: pricingFields, append: appendPricing, remove: removePricing } = useFieldArray({
    control,
    name: 'pricing',
  });

  useEffect(() => {
    if (product) {
      const payload:any ={
        ...product.data,
        industries: product.data.industries?.map((industry:any) => industry._id),
        languages: product.data.languages?.map((language:any) => language._id),
        integrations: product.data.integrations?.map((integration:any) => integration._id),
        marketSegment: product.data.marketSegment?.map((marketSegment:any) => marketSegment._id),
        whoCanUse: product.data.whoCanUse?.map((whoCanUse:any) => whoCanUse._id),
        softwareIds: product.data.softwareIds?.map((software:any) => software._id),
        solutionIds: product.data.solutionIds?.map((solution:any) => solution._id),

      }
      setMediaFiles(product.data.mediaUrls?.map((media:any) => media) || []);
      reset(payload);
    }
  }, [product]);
  console.log(getValues(),"getValues");
  const { options: industryOptions, isLoading: industryLoading } = useIndustryOptions();
  const { options: softwareOptions, isLoading: softwareLoading } = useSoftwareOptions();
  const { options: solutionOptions, isLoading: solutionLoading } = useSolutionOptions();
  const { options: userRoleOptions, isLoading: userRoleLoading } = useUserRoleOptions();
  const { options: integrationOptions, isLoading: integrationLoading } = useIntegrationOptions();
  const { options: languageOptions, isLoading: languageLoading } = useLanguageOptions();
  const { options: marketSegmentOptions, isLoading: marketSegmentLoading } = useMarketSegmentOptions();
  const [mediaFiles, setMediaFiles] = useState<File[] | FileUpload[]>([]);
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
      alert("File size must be less than 5MB");
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
   
    
    await addProductMutation.mutateAsync({id:productID,product:data as any});
    navigate('/profile/products');
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

  return (
    <div className="max-w-5xl mx-auto py-8 sm:px-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add Product</h1>
        <Button onClick={() => navigate('/profile/products')} className="bg-blue-600 text-white px-4 py-2 rounded-full" variant="default" leftIcon={ArrowLeftIcon}>Back To Products</Button>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit,onError)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput name="name" label="Product Name" maxLength={100} disabled={addProductMutation.isPending} placeholder='Enter product name'/>
            <FormInput name="websiteUrl" label="Product Website" maxLength={200} placeholder='Enter product website'/>
            <FormSelect name="softwareIds" label="Software" placeholder="Select software" options={softwareOptions} searchable disabled={softwareLoading || addProductMutation.isPending} multiple  />
            <FormSelect name="solutionIds" label="Solutions" placeholder="Select solutions" options={solutionOptions} searchable disabled={solutionLoading || addProductMutation.isPending} multiple  />
            <FormSelect name="whoCanUse" label="Who can use" placeholder="Select user roles" options={userRoleOptions} searchable disabled={userRoleLoading || addProductMutation.isPending} multiple  />
            <FormSelect name="industries" label="Industries" placeholder="Select industry" options={industryOptions} searchable disabled={industryLoading || addProductMutation.isPending} multiple  />
            <FormSelect name="integrations" label="Integrations" placeholder="Select integrations" options={integrationOptions} searchable disabled={integrationLoading || addProductMutation.isPending} multiple  />
            <FormSelect name="languages" label="Languages" placeholder="Select languages" options={languageOptions} searchable disabled={languageLoading || addProductMutation.isPending} multiple  />
            <FormSelect name="marketSegment" label="Market Segment" placeholder="Select market segment" options={marketSegmentOptions} searchable disabled={marketSegmentLoading || addProductMutation.isPending} multiple  />
            <FormInput name="brandColors" type='color' label="Brand Colors" maxLength={100} disabled={addProductMutation.isPending} />
          </div>
          <FormTextarea name="description" label="Description" rows={8} maxLength={2000} className="w-full" disabled={addProductMutation.isPending} placeholder='Enter product description'/>
          
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
          className={`border-2 ${isLogoDragActive ? 'border-blue-500' : 'border-dashed border-gray-300'} rounded-md p-4 flex items-center justify-center  h-40`}
        >
          
            <label className="cursor-pointer flex flex-col items-center text-gray-500 w-full h-full justify-center">
              <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
              <svg className="w-10 h-10 mb-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0 0V8m0 4h4m-4 0H8m12 4a4 4 0 01-4 4H8a4 4 0 01-4-4V8a4 4 0 014-4h8a4 4 0 014 4v8z" />
              </svg>
              <span>Drag & drop media or <span className="text-blue-600 underline">click here</span></span>
            </label>
          
         
        </div>
        {
            watch('logoUrl') &&
             <div className="relative w-28  ">
             <img src={typeof watch('logoUrl') === 'string' ? watch('logoUrl') as string : URL.createObjectURL(watch('logoUrl') as File)} alt="Logo Preview" className=" h-28 w-28 rounded object-cover" />
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
        <label className="block mb-1 font-medium" id="mediaUrlsLabel">Upload Product Images</label>
        <div
          onDrop={handleMediaChange}
          onDragOver={(e) => {
            e.preventDefault();
            setIsMediaDragActive(true);
          }}
          onDragLeave={() => setIsMediaDragActive(false)}
          className={`border-2 ${isMediaDragActive ? 'border-blue-500' : 'border-dashed border-gray-300'} rounded-md p-4 flex flex-col items-center justify-center text-center h-40`}
        >
          <label className="cursor-pointer flex flex-col items-center text-gray-500">
            <input type="file" accept="image/*" multiple onChange={handleMediaChange} className="hidden" />
            <svg className="w-10 h-10 mb-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0 0V8m0 4h4m-4 0H8m12 4a4 4 0 01-4 4H8a4 4 0 01-4-4V8a4 4 0 014-4h8a4 4 0 014 4v8z" />
            </svg>
            <span>Drag & drop media or <span className="text-blue-600 underline">click here</span></span>
            <p className="text-red-500 text-sm mt-1">Max 5 files allowed (10MB each)</p>
          </label>
        </div>
        {errors.mediaUrls && <p className="text-red-500 text-sm mt-1">{errors.mediaUrls.message}</p>}

        {mediaFiles.length > 0 && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {mediaFiles.map((file, idx) => (
              <div key={idx} className="relative">
                  <img src={ typeof file   === 'string' ? file : URL.createObjectURL(file)} alt={`media-${idx}`} className="rounded object-cover h-28 w-full" />
                <button
                  type="button"
                  onClick={() => setMediaFiles(mediaFiles.filter((_, i) => i !== idx) as File[])}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm cursor-pointer"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  
          
          {/* Features */}
          <div>
            <div className='flex justify-between items-center mb-4'>
              <h2 className="font-semibold text-lg">Features</h2>
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
                  {idx !== 0 && (
                    <button
                      disabled={addProductMutation.isPending}
                      type="button"
                      className="bg-red-500 text-white rounded-full flex items-center justify-center  w-12 h-12 shadow-md hover:bg-red-600 transition cursor-pointer"
                      onClick={() => removeFeature(idx)}
                      title="Remove Feature"
                    >
                      -
                    </button>
                  )}
                </div>
                <FormInput name={`features.${idx}.title`} label="Feature Title" maxLength={100} placeholder='Enter feature title' disabled={addProductMutation.isPending} />
                <FeaturesDescriptionFieldArray nestIndex={idx} control={control} />
              </div>
            ))}
          </div>
          
          {/* Pricing */}
          <div>
            <div className='flex justify-between items-center mb-4'>
              <h2 className="font-semibold text-xl">Pricing</h2>
              <button
                disabled={addProductMutation.isPending}
                type="button"
                className="bg-blue-600 text-white rounded-full flex items-center justify-center  w-12 h-12 shadow-md hover:bg-blue-700 transition"
                onClick={() => appendPricing({ name: '', price: '', seats: '', description: '', features: [{value: ''}] })}
                title="Add Pricing Plan"
              >
                +
              </button>
            </div>
            {pricingFields.map((field, idx) => (
                <div key={field.id} className="mb-8 p-6 rounded-lg border bg-white">
                <div className='flex justify-between items-center mb-4'>
                  <h3 className="font-semibold text-lg">Pricing Plan {idx + 1}</h3>
                  {idx !== 0 && (
                    <button
                      disabled={addProductMutation.isPending}
                      type="button"
                      className="bg-red-500 text-white rounded-full flex items-center justify-center  w-12 h-12 shadow-md hover:bg-red-600 transition cursor-pointer"
                      onClick={() => removePricing(idx)}
                      title="Remove Pricing Plan"
                    >
                      -
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <FormInput name={`pricing.${idx}.name`} label="Plan Name" maxLength={100} placeholder="Enter plan name" disabled={addProductMutation.isPending} />
                  <FormInput name={`pricing.${idx}.price`} label="Price" maxLength={100} placeholder="Enter price" disabled={addProductMutation.isPending} />
                  <FormInput name={`pricing.${idx}.seats`} label="No of Seats" maxLength={100} placeholder="Enter no of seats" disabled={addProductMutation.isPending} />
                </div>
                <FormTextarea name={`pricing.${idx}.description`} className="mb-6" label="Plan Description" rows={3} maxLength={500} placeholder="Enter plan description" disabled={addProductMutation.isPending} />
                <div className="mb-2 mt-2">
                  <h4 className="font-semibold text-lg mb-2">Plan Features</h4>
                  <PricingFeaturesFieldArray nestIndex={idx} control={control} />
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex sm:justify-end w-full">
            <Button type="submit" disabled={isSubmitting || addProductMutation.isPending} className="w-full sm:w-40 h-12 rounded-full bg-blue-600 text-white text-lg font-semibold">Save</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default EditProductPage;