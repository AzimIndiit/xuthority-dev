import { useMutation } from '@tanstack/react-query';
import otpService, { CreateOTPRequest, VerifyOTPRequest, ResendOTPRequest } from '@/services/otp';
import { useReviewStore } from '@/store/useReviewStore';
import { useToast } from './useToast';


  // Create OTP mutation
  export function useCreateOTP() {
    const toast = useToast();
   
    return useMutation({
      mutationFn: (data: CreateOTPRequest) => otpService.createOTP(data),
      onSuccess: (data) => {
        toast.otp.success('OTP sent successfully! Please check your email.');
      },
      onError: (error: any) => {
        const message = error?.response?.data?.errors?.message || 'Failed to create OTP. Please try again.';
        toast.otp.error(message);
      },
    });
  }

  // Verify OTP mutation
  export function useVerifyOTP() {
    const toast = useToast();
    const {
      setVerificationData,
      setCurrentStep,
    } = useReviewStore();
    return useMutation({
    mutationFn: (data: VerifyOTPRequest) => otpService.verifyOTP(data),
    onSuccess: (data) => {

      setVerificationData({
        verificationMethod: 'company-email',
        companyEmail: data.email,
        verificationStatus: true,
      });
      toast.otp.success('Company email verified successfully!');
      setCurrentStep(3);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to verify OTP. Please try again.';
      toast.otp.error(message);
    },
  });
}
  // Resend OTP mutation
  export function useResendOTP() {
    const toast = useToast();
    return useMutation({
    mutationFn: (data: ResendOTPRequest) => otpService.resendOTP(data),
    onSuccess: (data) => {
      toast.otp.success('OTP resent successfully! Please check your email.');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to resend OTP. Please try again.';
      console.log(error,'error');
      toast.otp.error(message);
    },
  });
}
