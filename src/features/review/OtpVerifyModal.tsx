import React, { useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import OtpInput from '@/components/ui/OtpInput';
import { useResendOTP, useVerifyOTP } from '@/hooks/useOTP';

interface OtpVerifyModalProps {
  open: boolean;
  onClose: () => void;
  onResend: () => void;
  onSuccess?: () => void;
  email: string;
}

const schema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

type FormValues = z.infer<typeof schema>;

const OtpVerifyModal: React.FC<OtpVerifyModalProps> = ({ open, onClose, onResend, onSuccess, email }) => {
  const inputRefs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));
  const [countdown, setCountdown] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { otp: '' },
    mode: 'onBlur',
  });

  const verifyOTP = useVerifyOTP();
  const resendOTP = useResendOTP();
  const otp = watch('otp');

  // Start countdown when modal opens
  useEffect(() => {
    if (open) {
      startCountdown();
    }
  }, [open]);

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (countdown > 0) {
      setIsResendDisabled(true);
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [countdown]);

  const startCountdown = () => {
    setCountdown(60); // 1 minute = 60 seconds
    setIsResendDisabled(true);
  };

  const handleOtpChange = (val: string) => {
    setValue('otp', val);
    clearErrors('otp');
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await verifyOTP.mutateAsync({
        email, 
        otp: data.otp, 
        type: 'review_verification'
      });
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error is already handled by the hook
      console.error('OTP verification failed:', error);
    }
  };

  const handleResendClick = async () => {
    if (isResendDisabled) return;
    
    try {
      await resendOTP.mutateAsync({
        email, 
        type: 'review_verification'
      });
      
      // Start countdown after successful resend
      startCountdown();
      
      // Call onResend callback if provided
      if (onResend) {
        onResend();
      }
    } catch (error) {
      // Error is already handled by the hook
      console.error('OTP resend failed:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={open => !open ? onClose() : undefined}>
      <DialogContent className="max-w-lg p-8 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center mb-2">Verify where you work</DialogTitle>
          <DialogDescription className="text-gray-500 text-center mb-8">
            Help us quickly verify your review by telling us where you work<br />
            and confirming your company email.
          </DialogDescription>
        </DialogHeader>
        
        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <div className="text-center font-medium mb-2 text-lg">Enter OTP sent to your email</div>
            <div className="text-center text-sm text-gray-600 mb-6">
              Sent to: <span className="font-medium">{email}</span>
            </div>
            <OtpInput
              value={otp}
              onChange={handleOtpChange}
              disabled={verifyOTP.isPending}
              autoFocus
            />
            {errors.otp && (
              <div className="text-red-500 text-sm text-center mt-2">{errors.otp.message}</div>
            )}
          </div>
          
          <Button
            type="submit"
            className="w-full rounded-full py-4 text-lg font-semibold mt-2 bg-blue-600 hover:bg-blue-700 text-white h-12"
            size="lg"
            disabled={otp.length < 6 || verifyOTP.isPending}
          >
            {verifyOTP.isPending ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </form>
        
        <div className="flex justify-center mt-6">
          <Button
            type="button"
            className={`text-base underline transition-colors ${
              isResendDisabled || resendOTP.isPending
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:text-blue-800'
            } bg-transparent hover:bg-transparent`}
            onClick={handleResendClick}
          
            disabled={isResendDisabled || resendOTP.isPending}
          >
            {resendOTP.isPending? 'Resending...' : isResendDisabled 
                ? `Resend OTP (${formatTime(countdown)})` 
                : 'Resend OTP'
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtpVerifyModal; 