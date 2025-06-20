import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Eye, EyeOff } from "lucide-react";

const vendorSignupSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  companyName: z.string().min(1, { message: "Company name is required" }),
  companyEmail: z.string().email({ message: "Invalid company email address" }),
  industry: z.string().min(1, { message: "Please select an industry" }),
  companySize: z.string().min(1, { message: "Please select a company size" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  terms: z.literal<boolean>(true, {
    errorMap: () => ({
      message: "You must accept the terms and conditions",
    }),
  }),
  updates: z.boolean().optional(),
});

type VendorSignupFormInputs = z.infer<typeof vendorSignupSchema>;

export function VendorSignupForm() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<VendorSignupFormInputs>({
    resolver: zodResolver(vendorSignupSchema),
    defaultValues: {
      updates: false,
    },
  });

  const onSubmit = (data: VendorSignupFormInputs) => {
    console.log("Vendor signup data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" placeholder="Enter First Name" {...register("firstName")} className="rounded-full h-14 px-4" />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" placeholder="Enter Last Name" {...register("lastName")} className="rounded-full h-14 px-4" />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" placeholder="Enter Email" {...register("email")} className="rounded-full h-14 px-4" />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input id="companyName" placeholder="Enter Company Name" {...register("companyName")} className="rounded-full h-14 px-4" />
        {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>}
      </div>
       <div className="grid gap-2">
        <Label htmlFor="companyEmail">Company Email</Label>
        <Input id="companyEmail" placeholder="Enter Company Email" {...register("companyEmail")} className="rounded-full h-14 px-4" />
        {errors.companyEmail && <p className="text-red-500 text-xs mt-1">{errors.companyEmail.message}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="industry">Industry</Label>
          <Controller
            name="industry"
            control={control}
            render={({ field }) => (
              <Select  onValueChange={field.onChange} defaultValue={field.value} >
                <SelectTrigger className="rounded-full h-14 px-4 w-full"><SelectValue placeholder="Select Industry" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="health">Healthcare</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="companySize">Company Size</Label>
           <Controller
            name="companySize"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="rounded-full h-14 px-4 w-full"><SelectValue placeholder="Select Company Size" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10</SelectItem>
                  <SelectItem value="11-50">11-50</SelectItem>
                  <SelectItem value="51-200">51-200</SelectItem>
                   <SelectItem value="201-500">201-500</SelectItem>
                  <SelectItem value="501+">501+</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.companySize && <p className="text-red-500 text-xs mt-1">{errors.companySize.message}</p>}
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input id="password" type={passwordVisible ? "text" : "password"} placeholder="Enter Password" {...register("password")} className="rounded-full h-14 px-4" />
          <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-4" onClick={() => setPasswordVisible(!passwordVisible)} >
            {passwordVisible ? (<EyeOff className="h-5 w-5 text-gray-400" />) : (<Eye className="h-5 w-5 text-gray-400" />)}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>
      <div className="space-y-3 pt-2">
        <div className="flex items-start space-x-2">
          <Checkbox id="terms" onCheckedChange={(checked) => { setValue("terms", checked as boolean); trigger("terms"); }} />
          <div className="grid gap-1.5 leading-none">
            <label htmlFor="terms" className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              To continue, please agree to our{" "}
              <a href="#" className="font-semibold text-red-500 hover:underline">Terms & Conditions</a>{" "}
              and{" "}
              <a href="#" className="font-semibold text-red-500 hover:underline">Privacy Policy</a>.
            </label>
            {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms.message}</p>}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="updates" onCheckedChange={(checked) => setValue("updates", checked as boolean)} />
          <label htmlFor="updates" className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >
            I would like to receive updates about products, solutions, and special offers from XUTHORITY.
          </label>
        </div>
      </div>
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 h-14 rounded-full text-base">
        Sign Up
      </Button>
    </form>
  );
} 