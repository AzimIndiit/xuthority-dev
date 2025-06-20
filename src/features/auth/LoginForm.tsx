import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import useUIStore from "@/store/useUIStore";
import useUserStore from "@/store/useUserStore";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export function LoginForm() {
  const {login} = useUserStore();
  const navigate = useNavigate();
  const {setAuthModalView,closeAuthModal} = useUIStore();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "demo@xuthority.com",
      password: "123456",
    },
  });

  const onSubmit = (data: LoginFormInputs) => {
    console.log(data);
    // Here you would typically handle the login logic,
    // like calling an API endpoint.
    login("123456",{
      id: "1",
      email: data.email,
      name: "John Doe Smith John Doe Smith ",
      role: "vendor",
      avatar: "https://github.com/shadcn.png",
    });
   
   navigate("/");
   closeAuthModal();
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
            className="rounded-full h-14 flex-1 px-5 py-3 "
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
              className="rounded-full h-14 flex-1 px-5 py-3 "
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
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
        <button
          type="button"
          onClick={() => setAuthModalView("forgot-password")}
          className="text-sm text-right text-gray-500 hover:underline cursor-pointer"
        >
          Forgot Password?
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full"
        >
          Login
        </Button>
      </div>
    </form>
  );
} 