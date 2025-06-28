import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Check, X } from "lucide-react";
import useUIStore from "@/store/useUIStore";
import { useRegisterUser, useSocialLogin } from "@/hooks/useAuth";
import { GoogleIcon, LinkedInIcon } from "@/assets/svg";

const signupSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }).max(50, { message: "First name must be less than 50 characters" }),
  lastName: z.string().min(1, { message: "Last name is required" }).max(50, { message: "Last name must be less than 50 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
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

type SignupFormInputs = z.infer<typeof signupSchema>;

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

export function UserSignupForm() {
  const { setAuthModalView, closeAuthModal } = useUIStore();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  
  // Use the new authentication hooks
  const registerMutation = useRegisterUser();
  const { googleLogin, linkedInLogin } = useSocialLogin();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      updates: false,
    },
  });

  // Watch the password field for real-time validation
  const watchedPassword = watch('password', '');
  
  useEffect(() => {
    setPassword(watchedPassword || '');
  }, [watchedPassword]);

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
            maxLength={50}
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
            maxLength={50}
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
        {registerMutation.isPending ? "Creating Account..." : "Sign Up as User"}
      </Button>
      
      {/* Social Login Buttons */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or Continue With
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          onClick={handleGoogleLogin}
          disabled={registerMutation.isPending}
          variant="outline"
          className="w-full py-3 rounded-full border-gray-300"
        >
          <GoogleIcon />
          Google
        </Button>
        <Button
          type="button"
          onClick={handleLinkedInLogin}
          disabled={registerMutation.isPending}
          variant="outline"
          className="w-full py-3 rounded-full border-gray-300"
        >
          <LinkedInIcon />
          LinkedIn
        </Button>
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
  );
} 