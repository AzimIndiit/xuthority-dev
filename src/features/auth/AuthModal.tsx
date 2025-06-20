import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Linkedin } from "lucide-react";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
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

        {(authModalView === "login" || authModalView === "user-signup" || authModalView === "vendor-signup") && (
          <>
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
                variant="outline"
                className="w-full py-3 rounded-full border-gray-300"
              >
                <GoogleIcon className="mr-2 h-5 w-5" />
                Google
              </Button>
              <Button
                variant="outline"
                className="w-full py-3 rounded-full border-gray-300"
              >
                <Linkedin className="mr-2 h-5 w-5" />
                LinkedIn
              </Button>
            </div>
          </>
        )}

        <div
          className={`mt-6 text-center text-sm ${
            authModalView !== "forgot-password" ? "border-t pt-4" : ""
          }`}
        >
          {authModalView === "forgot-password" ? (
            <div>
              <button
                onClick={() => setAuthModalView("login")}
                className="text-gray-900 hover:underline cursor-pointer"
              >
                Back To <span className="font-semibold text-red-500">Login</span>
              </button>
            </div>
          ) : authModalView !== "login" ? (
            <div>
              <span className="text-gray-500">Already have an account? </span>
              <button
                onClick={() => setAuthModalView("login")}
                className="font-semibold text-red-500 hover:underline cursor-pointer"
              >
                Log In
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 divide-x">
              <div className="pr-4">
                <span className="text-gray-500">Sign Up as </span>
                <button
                  onClick={() => setAuthModalView("user-signup")}
                  className="font-semibold text-red-500 hover:underline cursor-pointer"
                >
                  User
                </button>
              </div>
              <div className="pl-4">
                <span className="text-gray-500">Sign Up as </span>
                <button
                  onClick={() => setAuthModalView("vendor-signup")}
                  className="font-semibold text-red-500 hover:underline cursor-pointer"
                >
                  Vendor
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
