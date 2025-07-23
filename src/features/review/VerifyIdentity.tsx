import React, { useState, useEffect } from "react";
import CompanyVerifyModal from "./CompanyVerifyModal";
import OtpVerifyModal from "./OtpVerifyModal";
import { useToast } from "@/hooks/useToast";
import UploadScreenshotModal from "./UploadScreenshotModal";
import VerificationRequiredModal from "@/features/review/VerificationRequiredModal";
import VendorInvitationModal from "@/features/review/VendorInvitationModal";
import { ChevronLeft } from "lucide-react";
import { useReviewStore } from "@/store/useReviewStore";
import { useNavigate } from "react-router-dom";

interface VerifyIdentityProps {
  setShowStepper?: (show: boolean) => void;
}

const options = [
  {
    label: "Provide your Company name and email",
    bg: "bg-[#F7D4D1]",
    border: "border-[#F7D4D1]",
    icon: (
      <img src="/svg/review/company_email.svg" alt="company-email" className="w-16 h-16" />
    ),
  },
  {
    label: "Connect your LinkedIn Profile",
    bg: "bg-[#EFE0FE]",
    border: "border-[#EFE0FE]",
    icon: (
      <img src="/svg/review/linkedin.svg" alt="linkedin" className="w-16 h-16" />
    ),
  },
  // {
  //   label: "Continue with unique vendor invitation link",
  //   bg: "bg-[#CCDAFA]",
  //   border: "border-[#CCDAFA]",
  //   icon: (
  //     <img src="/svg/review/link.svg" alt="vendor-invitation" className="w-16 h-16" />
  //   ),
  // },
  {
    label: "Upload a screenshot of your software",
    bg: "bg-[#FFF5D4]",
    border: "border-[#FFF5D4]",
    icon: (
      <img src="/svg/review/image.svg" alt="screenshot" className="w-16 h-16" />
    ),
  },
];

const VerifyIdentity: React.FC<VerifyIdentityProps> = ({ setShowStepper }) => {
  const navigate = useNavigate();
  const { 
    setCurrentStep,
    verificationData,
    setVerificationData
  } = useReviewStore();
  const toast = useToast();
  
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [screenshotModalOpen, setScreenshotModalOpen] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showVendorInvitationModal, setShowVendorInvitationModal] = useState(false);
  
  // Local state to store the company email for OTP verification
  const [currentCompanyEmail, setCurrentCompanyEmail] = useState<string>('');
  const [currentCompanyName, setCurrentCompanyName] = useState<string>('');

  // Cleanup effect to clear states on unmount
  useEffect(() => {
    return () => {
      // Clear all local states when component unmounts
      setCompanyModalOpen(false);
      setOtpModalOpen(false);
      setScreenshotModalOpen(false);
      setShowVerificationModal(false);
      setShowVendorInvitationModal(false);
      setCurrentCompanyEmail('');
      setCurrentCompanyName('');
    };
  }, []);

  // Handler for OTP verification
  const handleOtpVerified = () => {
    setVerificationData({
      companyName: currentCompanyName,
      companyEmail: currentCompanyEmail,
      method: "company-email",
      isVerified: true,
    });
    setOtpModalOpen(false);
    toast.verification.success('OTP verified successfully!');
    setCurrentStep(3);
  };

  const handleResendOtp = () => {
    toast.otp.success("OTP resent!");
  };

  const handleCompanyVerified = (companyEmail: string, companyName: string) => {
    // Store the company email for OTP verification
    setCurrentCompanyEmail(companyEmail);
    setCurrentCompanyName(companyName);
    setCompanyModalOpen(false);
    setOtpModalOpen(true);
  };

  // Handler for screenshot upload
  const handleScreenshotUploaded = (fileUrl: string) => {
    setVerificationData({
      screenshot: fileUrl,
      method: "screenshot",
      isVerified: true,
    });
    setScreenshotModalOpen(false);
    toast.verification.success('Screenshot uploaded successfully!');
    setCurrentStep(3);
  };

  // Handler for vendor invitation
  const handleVendorInvitationSuccess = (invitationLink: string) => {
    setVerificationData({
      vendorInvitationLink: invitationLink,
      method: "vendor-invitation",
      isVerified: true,
    });
    setShowVendorInvitationModal(false);
    toast.verification.success('Vendor invitation submitted successfully!');
    setCurrentStep(3);
  };

  // Handler for LinkedIn verification
  const handleLinkedInVerification = () => {
    // Redirect to LinkedIn OAuth verification endpoint
    const backendUrl = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8081/api/v1';
    window.location.href = `${backendUrl}/auth/linkedin/verify`;
  };

  const handleSkipVerification = () => {
    setShowVerificationModal(true);
  };

  const handleVerifyNow = () => {
    setShowVerificationModal(false);
  };

  const handleBackToHome = () => {
    setShowVerificationModal(false);
    navigate("/");
  };

  const handleVendorInvitationClick = () => {
    setShowVendorInvitationModal(true);
  };

  const handleChooseDifferentOption = () => {
    setShowVendorInvitationModal(false);
  };

  return (
    <div className="">
      <div className="sm:hidden block">
      <button
          onClick={() => setShowStepper && setShowStepper(true)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
      </div>
      <h2 className="text-3xl font-bold mb-2">3 ways to verify with XUTHORITY</h2>
      <p className="text-gray-700 mb-1">
        At XUTHORITY, we prioritize authentic reviews from users with real-world experience using the software in a professional environment.
      </p>
      <p className="text-gray-700 mb-8">Choose one of the following options:</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {options.map((option, idx) => (
          <button
            key={option.label}
            className={`flex flex-col items-center justify-center rounded-xl sm:rounded-2xl border ${option.bg} ${option.border} p-4 sm:p-6 lg:p-8 transition-shadow hover:shadow-lg focus:outline-none cursor-pointer`}
            style={{ minHeight: '180px'}}
            onClick={() => {
              if (idx === 0) setCompanyModalOpen(true);
              if (idx === 1) handleLinkedInVerification();
              // if (idx === 2) handleVendorInvitationClick();
              if (idx === 2) setScreenshotModalOpen(true);
            }}
          >
            <div className="mb-4 sm:mb-6">{option.icon}</div>
            <span className="text-sm lg:text-base font-bold text-gray-900 text-center px-2">
              {option.label}
            </span>
          </button>
        ))}
      </div>
      <div className="flex justify-center">
        <button
          className="text-blue-600 underline text-base hover:text-blue-800 cursor-pointer"
          onClick={handleSkipVerification}
        >
          I don't want to provide this information
        </button>
      </div>
      <CompanyVerifyModal
        open={companyModalOpen}
        onClose={() => setCompanyModalOpen(false)}
        onSuccess={handleCompanyVerified}

      />
      <OtpVerifyModal
        open={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        onResend={handleResendOtp}
        onSuccess={handleOtpVerified}
        email={currentCompanyEmail}
      />
      <UploadScreenshotModal
        open={screenshotModalOpen}
        onClose={() => setScreenshotModalOpen(false)}
        onSuccess={handleScreenshotUploaded}
      />
      <VerificationRequiredModal
        open={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onVerifyNow={handleVerifyNow}
        onBackToHome={handleBackToHome}
      />
     
      <VendorInvitationModal
        open={showVendorInvitationModal}
        onClose={() => setShowVendorInvitationModal(false)}
        onSuccess={handleVendorInvitationSuccess}
        onChooseDifferentOption={handleChooseDifferentOption}
      />
    </div>
  );
};

export default VerifyIdentity; 