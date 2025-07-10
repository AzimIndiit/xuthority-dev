import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useUIStore from "@/store/useUIStore";
import { useForgotPassword } from "@/hooks/useAuth";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type ForgotPasswordFormInputs = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const { setAuthModalView, closeAuthModal } = useUIStore();
  
  // Use the new authentication hooks
  const forgotPasswordMutation = useForgotPassword();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormInputs) => {
    try {
      await forgotPasswordMutation.mutateAsync({ email: data.email });
      // Close modal after successful email sent
      closeAuthModal();
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Forgot password error:', error);
    }
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
            className="rounded-full h-14 flex-1 px-5 py-3"
            disabled={forgotPasswordMutation.isPending}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-2">
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full"
          disabled={forgotPasswordMutation.isPending}
          loading={forgotPasswordMutation.isPending}
        >
          Send Reset Link
        </Button>
        

      </div>
      <div  className={`mt-6 text-center text-sm`}>
              <button
              disabled={forgotPasswordMutation.isPending}
                onClick={() => setAuthModalView("login")}
                className="text-gray-900 hover:underline cursor-pointer"
              >
                Back To <span className="font-semibold text-red-500">Login</span>
              </button>
            </div>
    </form>
  );
}