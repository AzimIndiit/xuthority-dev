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
import { useEffect } from "react";

export function AuthModal() {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalView, 
    setAuthModalView 
  } = useUIStore();

  // Scroll to top when vendor signup modal opens
  useEffect(() => {
    if (isAuthModalOpen && authModalView === "vendor-signup") {
      setTimeout(() => {
        const vendorForm = document.getElementById('vendor-signup-form');
        if (vendorForm) {
          vendorForm.scrollTop = 0;
        }
        // Also scroll window to top as backup
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 50);
    }
  }, [isAuthModalOpen, authModalView]);

  // Force re-render of vendor signup when switching back from login
  const vendorSignupKey = `vendor-signup-${isAuthModalOpen ? 'open' : 'closed'}-${authModalView}`;

  if (!isAuthModalOpen) return null;

  const renderTitle = () => {
    switch (authModalView) {
      case "user-signup":
        return  <>
        <span className="text-red-500">Let's,</span>  Create your account.
      </>
      case "vendor-signup":
        return  <>
        <span className="text-red-500">Let's,</span>  Create your account.
      </>
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
        return "Kindly fill in your sign up details to proceed";
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
    <Dialog open={isAuthModalOpen} onOpenChange={closeAuthModal} >
           {authModalView === "vendor-signup" ? (
        <DialogContent 
          key={vendorSignupKey}
          showCloseButton={false}
          className="vendor-modal-no-animation !fixed !inset-0 !z-50 !bg-transparent !border-none !shadow-none !p-0 !max-w-none !w-full !h-full !translate-x-0 !translate-y-0 !overflow-y-auto !rounded-none"
        >
             <div id="vendor-signup-form" className="h-full bg-black/50 flex items-start justify-center p-4 py-8 pb-16 !rounded-none">
               <div className="bg-white rounded-2xl p-8 w-full max-w-[500px] my-8 mb-16 relative">
                 <button
                   onClick={closeAuthModal}
                   className="absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden"
                 >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                   <span className="sr-only">Close</span>
                 </button>
                 
                 <DialogHeader className="text-center items-center">
                   <img
                     src="/xuthority_sm_logo.svg"
                     alt="Xuthority Logo"
                     className="mb-4 h-16 w-16"
                   />
                   <DialogTitle className="text-2xl font-bold text-black">
                     {renderTitle()}
                   </DialogTitle>
                   <DialogDescription className="text-gray-500 text-center text-xs sm:text-sm mb-4">
                     {renderDescription()}
                   </DialogDescription>
                 </DialogHeader>
   
                 <div key={authModalView === "vendor-signup" ? vendorSignupKey : authModalView}>
                   {renderForm()}
                 </div>
               </div>
             </div>
           </DialogContent> 
     ):(
      <DialogContent key={authModalView} className="animate-none transition-none translate-x-[-50%] translate-y-[-50%] sm:max-w-[500px] p-8 rounded-2xl">
      <DialogHeader className="text-center items-center">
        <img
          src="/xuthority_sm_logo.svg"
          alt="Xuthority Logo"
          className="mb-4 h-16 w-16"
        />
        <DialogTitle className="text-2xl font-bold text-black">
          {renderTitle()}
        </DialogTitle>
        <DialogDescription className="text-gray-500 text-center text-xs sm:text-sm mb-4">
          {renderDescription()}
        </DialogDescription>
      </DialogHeader>

      {renderForm()}

     
    </DialogContent>
     )}
     

    </Dialog>
  );
}
