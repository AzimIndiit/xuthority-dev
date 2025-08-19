import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import useUIStore from "@/store/useUIStore";
import { useLogin, useSocialLogin } from "@/hooks/useAuth";
import { GoogleIcon, LinkedInIcon } from "@/assets/svg";
import { useReviewStore } from "@/store/useReviewStore";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { setAuthModalView, closeAuthModal, postLoginAction, clearPostLoginAction } = useUIStore();
  const { setSelectedSoftware, setCurrentStep } = useReviewStore();
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  // Use the new authentication hooks
  const loginMutation = useLogin();
  const { googleLogin, linkedInLogin } = useSocialLogin();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const success = await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });
      
      // If login was successful (not pending/blocked)
      if (success) {
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
      } else {
        // Login failed due to pending/blocked status, close auth modal
        closeAuthModal();
      }
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Login error:', error);
      closeAuthModal();
    }
  };

  const handleGoogleLogin = () => {
    googleLogin('user');
  };

  const handleLinkedInLogin = () => {
    linkedInLogin('user');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="Enter Email Address"
            {...register("email")}
            className={`rounded-full h-14 flex-1 px-5 py-3 ${errors.email ? "border-red-500" : ""}`}
            disabled={loginMutation.isPending}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">
              {errors.email.message}
            </p>
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
              className={`rounded-full h-14 flex-1 px-5 py-3 ${errors.password ? "border-red-500" : ""}`}
              disabled={loginMutation.isPending}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setPasswordVisible(!passwordVisible)}
              disabled={loginMutation.isPending}
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
        <button
          type="button"
          onClick={() => setAuthModalView("forgot-password")}
          className="text-sm text-right text-gray-500 hover:underline cursor-pointer"
          disabled={loginMutation.isPending}
        >
          Forgot Password?
        </button>
      </div>
      
      <div className="flex flex-col gap-4">
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full"
          disabled={loginMutation.isPending}
          loading={loginMutation.isPending}
        >
          Login
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
            disabled={loginMutation.isPending}
            variant="outline"
            className="w-full py-3 rounded-full border-gray-300"
          >
            <GoogleIcon />
            Google
          </Button>
          <Button
            type="button"
            onClick={handleLinkedInLogin}
            disabled={loginMutation.isPending}
            variant="outline"
            className="w-full py-3 rounded-full border-gray-300"
          >
            <LinkedInIcon />
            LinkedIn
          </Button>
        </div>
        <div     className={`mt-6 text-center text-sm ${
             "border-t pt-4" 
          }`}
        >
        <div className="grid grid-cols-2 divide-x">
              <div className="pr-4">
                <span className="text-gray-500">Sign Up as </span>
                <button
                  disabled={loginMutation.isPending}
                  onClick={() => setAuthModalView("user-signup")}
                  className="font-semibold text-red-500 hover:underline cursor-pointer"
                >
                  User
                </button>
              </div>
              <div
      
        >
              <div className="pl-4">
                <span className="text-gray-500">Sign Up as </span>
                <button
                  disabled={loginMutation.isPending}
                  onClick={() => setAuthModalView("vendor-signup")}
                  className="font-semibold text-red-500 hover:underline cursor-pointer"
                >
                  Vendor
                </button>
              </div>
            </div>
            </div>
            </div>

      </div>
    </form>
  );
} 