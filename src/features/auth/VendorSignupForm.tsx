import { useState, useEffect } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Check, X } from "lucide-react";
import useUIStore from "@/store/useUIStore";
import { useRegisterVendor, useSocialLogin } from "@/hooks/useAuth";
import { GoogleIcon, LinkedInIcon } from "@/assets/svg";
import { useToast } from "@/hooks/useToast";
import { useReviewStore } from "@/store/useReviewStore";
import { useNavigate } from "react-router-dom";
import { scrollToTop } from "@/utils/scrollToTop";
import { useIndustryOptions } from "@/hooks/useIndustry";
import { FormSelect } from "@/components/ui/FormSelect";

const vendorSignupSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }).trim().max(50, { message: "First name must be less than 50 characters" }).nonempty({ message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }).trim().max(50, { message: "Last name must be less than 50 characters" }).nonempty({ message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  companyName: z.string().min(1, { message: "Company name is required" }).trim().max(100, { message: "Company name must be less than 100 characters" }).nonempty({ message: "Company name is required" }),
  companyEmail: z.string().email({ message: "Invalid company email address" }),
  industry: z.string().min(1, { message: "Please select an industry" }),
  companySize: z.string().min(1, { message: "Please select a company size" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(128, { message: "Password must be no more than 128 characters" })
    .regex(/(?=.*[a-z])/, { message: "Password must contain at least one lowercase letter" })
    .regex(/(?=.*[A-Z])/, { message: "Password must contain at least one uppercase letter" })
    .regex(/(?=.*\d)/, { message: "Password must contain at least one number" }),
  terms: z.literal<boolean>(true, {
    errorMap: () => ({
      message: "You must accept the terms and conditions",
    }),
  }),
  updates: z.boolean().optional(),
});

type VendorSignupFormInputs = z.infer<typeof vendorSignupSchema>;

// Password requirements checker component
const PasswordRequirementsChecker = ({ password }: { password: string }) => {
  const requirements = [
    {
      label: 'At least 8 characters',
      test: (pwd: string) => pwd.length >= 8,
    },
    {
      label: 'One uppercase letter (A-Z)',
      test: (pwd: string) => /[A-Z]/.test(pwd),
    },
    {
      label: 'One lowercase letter (a-z)',
      test: (pwd: string) => /[a-z]/.test(pwd),
    },
    {
      label: 'One number (0-9)',
      test: (pwd: string) => /\d/.test(pwd),
    },
  ];

  return (
    <div className="text-xs text-gray-500 mt-2 space-y-1">
      <p className="font-medium mb-2">Password must contain:</p>
      <ul className="space-y-1">
        {requirements.map((req, index) => {
          const isValid = req.test(password);
          return (
            <li key={index} className="flex items-center gap-2">
              {isValid ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <X className="w-3 h-3 text-gray-400" />
              )}
              <span className={isValid ? 'text-green-600' : 'text-gray-500'}>
                {req.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export function VendorSignupForm() {
  const { setAuthModalView, closeAuthModal, postLoginAction, clearPostLoginAction } = useUIStore();
  const { setSelectedSoftware, setCurrentStep } = useReviewStore();
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const toast = useToast();
 
  // Use the new authentication hooks
  const registerMutation = useRegisterVendor();
  const { googleLogin, linkedInLogin } = useSocialLogin();
  const { options: industryOptions } = useIndustryOptions();
  const methods = useForm<VendorSignupFormInputs>({
    resolver: zodResolver(vendorSignupSchema),
    defaultValues: {
      updates: false,
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = methods;

  // Watch the password field for real-time validation
  const watchedPassword = watch('password', '');
  
  useEffect(() => {
    setPassword(watchedPassword || '');
  }, [watchedPassword]);

  const onSubmit = async (data: VendorSignupFormInputs) => {
    try {
      await registerMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        companyName: data.companyName,
        companyEmail: data.companyEmail,
        industry: data.industry, // Send the ObjectId value directly
        companySize: data.companySize,
        acceptedTerms: data.terms,
        acceptedMarketing: data.updates || false,
      });
      
      // Execute post-login action if exists
      if (postLoginAction?.type === 'navigate-to-write-review') {
        setSelectedSoftware(postLoginAction.payload.software);
        setCurrentStep(postLoginAction.payload.currentStep);
        clearPostLoginAction();
        closeAuthModal();
        navigate('/write-review');
      } else {
        closeAuthModal();
      }
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Vendor registration error:', error);
    }
  };

  const handleGoogleLogin = () => {
    googleLogin('vendor');
  };

  const handleLinkedInLogin = () => {
    linkedInLogin('vendor');
  };

  return (
    <FormProvider {...methods}>
      <form id="vendor-signup-form" onSubmit={handleSubmit(onSubmit)} className="space-y-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="Enter First Name"
            {...register("firstName")}
            className="rounded-full h-14 px-4"
            disabled={registerMutation.isPending}
            maxLength={50}
          />
          <div className="min-h-[20px]">
            {errors.firstName && (
              <p className="text-red-500 text-xs ">
                {errors.firstName.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Enter Last Name"
            {...register("lastName")}
            className="rounded-full h-14 px-4"
            disabled={registerMutation.isPending}
            maxLength={50}
          />
          <div className="min-h-[20px]">
            {errors.lastName && (
              <p className="text-red-500 text-xs ">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" placeholder="Enter Email" {...register("email")} className="rounded-full h-14 px-4" disabled={registerMutation.isPending} />
        <div className="min-h-[20px]">
          {errors.email && <p className="text-red-500 text-xs ">{errors.email.message}</p>}
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input id="companyName" placeholder="Enter Company Name" {...register("companyName")} className="rounded-full h-14 px-4" disabled={registerMutation.isPending} maxLength={100} />
        <div className="min-h-[20px]">
          {errors.companyName && <p className="text-red-500 text-xs ">{errors.companyName.message}</p>}
        </div>
      </div>
       <div className="grid gap-2">
        <Label htmlFor="companyEmail">Company Email</Label>
        <Input id="companyEmail" placeholder="Enter Company Email" {...register("companyEmail")} className="rounded-full h-14 px-4" disabled={registerMutation.isPending} maxLength={254} />
        <div className="min-h-[20px]">
          {errors.companyEmail && <p className="text-red-500 text-xs ">{errors.companyEmail.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <FormSelect
            name="industry"
            searchable={true}
            label="Industry"
            placeholder="Select industry"
            options={industryOptions}
            disabled={registerMutation.isPending}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="companySize">Company Size</Label>
           <Controller
            name="companySize"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={registerMutation.isPending}>
                <SelectTrigger className="rounded-full h-14 px-4 w-full"><SelectValue placeholder="Select Company Size" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10 Employees">1-10 Employees</SelectItem>
                  <SelectItem value="11-50 Employees">11-50 Employees</SelectItem>
                  <SelectItem value="51-100 Employees">51-100 Employees</SelectItem>
                   <SelectItem value="100-200 Employees">100-200 Employees</SelectItem>
                  <SelectItem value="201-500 Employees">201-500 Employees</SelectItem>
                  <SelectItem value="500+ Employees">500+ Employees</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <div className="min-h-[20px]">
            {errors.companySize && <p className="text-red-500 text-xs ">{errors.companySize.message}</p>}
          </div>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={passwordVisible ? "text" : "password"}
            placeholder="Enter Password"
            {...register("password")}
            className="rounded-full h-14 px-4"
            disabled={registerMutation.isPending}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-4"
            onClick={() => setPasswordVisible(!passwordVisible)}
            disabled={registerMutation.isPending}
          >
            {passwordVisible ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs">
            {errors.password.message}
          </p>
        )}
        {/* Dynamic Password Requirements Checker */}
        <PasswordRequirementsChecker password={password} />
      </div>
     <div className="space-y-3 pt-2">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            onCheckedChange={(checked) => {
              setValue("terms", checked as boolean);
              trigger("terms");
            }}
            disabled={registerMutation.isPending}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms"
              className="text-[12px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              To continue, please agree to our{" "}
              <a href="/terms" target="_blank" className="font-semibold text-red-500 hover:underline">
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a href="/privacy" target="_blank" className="font-semibold text-red-500 hover:underline">
                Privacy Policy
              </a>
              .
            </label>
            {errors.terms && (
              <p className="text-red-500 text-xs ">
                {errors.terms.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="updates"
            onCheckedChange={(checked) => setValue("updates", checked as boolean)}
            disabled={registerMutation.isPending}
          />
          <label
            htmlFor="updates"
            className="text-[12px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            I would like to receive updates about products, solutions, and
            special offers from XUTHORITY.
          </label>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full my-4"
        disabled={registerMutation.isPending}
        loading={registerMutation.isPending}
      >
        Sign Up as Vendor
      </Button>

      {/* Social Signup Buttons */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={registerMutation.isPending}
            className="w-full py-3 rounded-full border-gray-300"
          >
            <GoogleIcon />
            Google
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleLinkedInLogin}
            disabled={registerMutation.isPending}
            className="w-full py-3 rounded-full border-gray-300"
          >
            <LinkedInIcon />
            LinkedIn
          </Button>
        </div>
      </div>
      <div className="mt-6 text-center text-sm">
        <span className="text-gray-500">Already have an account? </span>
        <button
          type="button"
          disabled={registerMutation.isPending}
          onClick={() => setAuthModalView("login")}
          className="font-semibold text-red-500 hover:underline cursor-pointer"
        >
          Log In
        </button>
      </div>
    
      </form>
    </FormProvider>
  );
} 