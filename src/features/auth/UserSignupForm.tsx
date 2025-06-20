import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import useUIStore from "@/store/useUIStore";

const signupSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
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

type SignupFormInputs = z.infer<typeof signupSchema>;

export function UserSignupForm() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      updates: false,
    },
  });

  const onSubmit = (data: SignupFormInputs) => {
    console.log("User signup data:", data);
    // Handle signup logic here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="Enter First Name"
            {...register("firstName")}
            className="rounded-full h-14 px-4"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Enter Last Name"
            {...register("lastName")}
            className="rounded-full h-14 px-4"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder="Enter Email Address"
          {...register("email")}
          className="rounded-full h-14 px-4"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
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
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-4"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">
            {errors.password.message}
          </p>
        )}
      </div>
      <div className="space-y-3 pt-2">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            onCheckedChange={(checked) => {
              setValue("terms", checked as boolean);
              trigger("terms");
            }}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms"
              className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              To continue, please agree to our{" "}
              <a href="#" className="font-semibold text-red-500 hover:underline">
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="font-semibold text-red-500 hover:underline">
                Privacy Policy
              </a>
              .
            </label>
            {errors.terms && (
              <p className="text-red-500 text-xs mt-1">
                {errors.terms.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="updates"
            onCheckedChange={(checked) => setValue("updates", checked as boolean)}
          />
          <label
            htmlFor="updates"
            className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I would like to receive updates about products, solutions, and
            special offers from XUTHORITY.
          </label>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 h-14 rounded-full text-base"
      >
        Sign Up
      </Button>
    </form>
  );
} 