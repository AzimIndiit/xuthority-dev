import React, { useState } from "react";
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
    bg: "bg-red-50",
    border: "border-red-100",
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="12" fill="#FDE8EA"/>
        <g>
          <rect x="12" y="20" width="40" height="24" rx="4" fill="#fff"/>
          <path d="M16 24L32 36L48 24" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="24" y="28" width="16" height="8" rx="2" fill="#3B82F6" fillOpacity="0.1"/>
          <text x="32" y="38" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#F43F5E">@</text>
        </g>
      </svg>
    ),
  },
  {
    label: "Connect your LinkedIn Profile",
    bg: "bg-purple-50",
    border: "border-purple-100",
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="12" fill="#F3E8FF"/>
        <g>
          <rect x="16" y="24" width="32" height="16" rx="3" fill="#fff"/>
          <circle cx="44" cy="32" r="8" fill="#6366F1"/>
          <rect x="40" y="28" width="8" height="8" rx="2" fill="#fff"/>
          <text x="44" y="34" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2563EB">in</text>
        </g>
      </svg>
    ),
  },
  {
    label: "Continue with unique vendor invitation link",
    bg: "bg-blue-50",
    border: "border-blue-100",
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="12" fill="#EFF6FF"/>
        <g>
          <path d="M24 32h16" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
          <path d="M32 24l8 8-8 8" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="32" cy="32" r="24" stroke="#3B82F6" strokeWidth="2"/>
        </g>
      </svg>
    ),
  },
  {
    label: "Upload a screenshot of your software",
    bg: "bg-yellow-50",
    border: "border-yellow-100",
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="12" fill="#FEF9C3"/>
        <g>
          <rect x="16" y="28" width="32" height="16" rx="3" fill="#fff"/>
          <rect x="24" y="36" width="16" height="4" rx="2" fill="#FACC15"/>
          <circle cx="24" cy="36" r="2" fill="#34D399"/>
          <polygon points="32,32 36,36 28,36" fill="#60A5FA"/>
          <circle cx="44" cy="32" r="2" fill="#F59E42"/>
          <path d="M32 28v-4m0 0l-4 4m4-4l4 4" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/>
        </g>
      </svg>
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

  // Handler for OTP verification
  const handleOtpVerified = () => {
    setOtpModalOpen(false);
    toast.verification.success('OTP verified successfully!');
    setCurrentStep(3);
  };

  const handleResendOtp = () => {
    toast.otp.success("OTP resent!");
  };

  const handleCompanyVerified = (companyEmail: string) => {
    // Store the company email for OTP verification
    setCurrentCompanyEmail(companyEmail);
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
      <h2 className="text-3xl font-bold mb-2">4 ways to verify with XUTHORITY</h2>
      <p className="text-gray-700 mb-1">
        At XUTHORITY, we prioritize authentic reviews from users with real-world experience using the software in a professional environment.
      </p>
      <p className="text-gray-700 mb-8">Choose one of the following options:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {options.map((option, idx) => (
          <button
            key={option.label}
            className={`flex flex-col items-center justify-center rounded-xl sm:rounded-2xl border ${option.bg} ${option.border} p-4 sm:p-6 lg:p-8 transition-shadow hover:shadow-lg focus:outline-none cursor-pointer`}
            style={{ minHeight: '180px'}}
            onClick={() => {
              if (idx === 0) setCompanyModalOpen(true);
              if (idx === 1) handleLinkedInVerification();
              if (idx === 2) handleVendorInvitationClick();
              if (idx === 3) setScreenshotModalOpen(true);
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
          className="text-blue-600 underline text-base hover:text-blue-800"
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