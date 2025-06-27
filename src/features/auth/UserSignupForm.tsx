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
import { useRegisterUser, useSocialLogin } from "@/hooks/useAuth";
import { GoogleIcon, LinkedInIcon } from "@/assets/svg";

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
  const { setAuthModalView, closeAuthModal } = useUIStore();
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  // Use the new authentication hooks
  const registerMutation = useRegisterUser();
  const { googleLogin, linkedInLogin } = useSocialLogin();
  
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

  const onSubmit = async (data: SignupFormInputs) => {
    try {
      await registerMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        acceptedTerms: data.terms,
        acceptedMarketing: data.updates || false,
      });
      closeAuthModal();
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Registration error:', error);
    }
  };

  const handleGoogleLogin = () => {
    googleLogin('user');
  };

  const handleLinkedInLogin = () => {
    linkedInLogin('user');
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
            disabled={registerMutation.isPending}
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
            disabled={registerMutation.isPending}
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
          disabled={registerMutation.isPending}
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
            disabled={registerMutation.isPending}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms"
              className="text-[10px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
            disabled={registerMutation.isPending}
          />
          <label
            htmlFor="updates"
            className="text-[10px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I would like to receive updates about products, solutions, and
            special offers from XUTHORITY.
          </label>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 h-14 rounded-full text-base"
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? "Creating Account..." : "Sign Up"}
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
      
      <div         className={`mt-6 text-center text-sm `}
        >
              <span className="text-gray-500">Already have an account? </span>
              <button
                disabled={registerMutation.isPending}
                onClick={() => setAuthModalView("login")}
                className="font-semibold text-red-500 hover:underline cursor-pointer"
              >
                Log In
              </button>
            </div>
    
    </form>
  );
} 