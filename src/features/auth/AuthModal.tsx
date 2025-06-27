import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Linkedin } from "lucide-react";
import { LoginForm } from "./LoginForm";
import { UserSignupForm } from "./UserSignupForm";
import { VendorSignupForm } from "./VendorSignupForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import useUIStore, { AuthView } from "@/store/useUIStore";
import { Button } from "@/components/ui/button";

export function AuthModal() {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalView, 
    setAuthModalView 
  } = useUIStore();

  if (!isAuthModalOpen) return null;

  const renderTitle = () => {
    switch (authModalView) {
      case "user-signup":
        return  <>
        <span className="text-red-500">Let's,</span>  Create your account.
      </>
      case "vendor-signup":
        return "Sign Up as Vendor";
      case "forgot-password":
        return "Forgot Password";
      case "login":
      default:
        return (
          <>
            <span className="text-red-500">Hello,</span> Welcome Back!
          </>
        );
    }
  };

  const renderDescription = () => {
    switch (authModalView) {
      case "user-signup":
        return "Kindly fill in your sign up details to proceed";
      case "vendor-signup":
        return "Create your vendor account.";
      case "forgot-password":
        return "Please enter your registered email address below to recover your password.";
      case "login":
      default:
        return "Kindly fill in your login details to proceed.";
    }
  };

  const renderForm = () => {
    switch (authModalView) {
      case "login":
        return <LoginForm />;
      case "user-signup":
        return <UserSignupForm />;
      case "vendor-signup":
        return <VendorSignupForm />;
      case "forgot-password":
        return <ForgotPasswordForm />;
      default:
        return <LoginForm />;
    }
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={closeAuthModal}>
      <DialogContent className="sm:max-w-[500px] p-8 rounded-2xl">
        <DialogHeader className="text-center items-center">
          <img
            src="/xuthority_sm_logo.svg"
            alt="Xuthority Logo"
            className="mb-4 h-16 w-16"
          />
          <DialogTitle className="text-2xl font-bold text-black">
            {renderTitle()}
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-center text-xs sm:text-sm">
            {renderDescription()}
          </DialogDescription>
        </DialogHeader>

        {renderForm()}

       
      </DialogContent>
    </Dialog>
  );
}
