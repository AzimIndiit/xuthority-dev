import React, { useRef } from "react";
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
import {  useResendOTP, useVerifyOTP } from '@/hooks/useOTP';

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

  const handleOtpChange = (val: string) => {
    setValue('otp', val);
    clearErrors('otp');
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await verifyOTP.mutateAsync({email, otp: data.otp, type: 'review_verification'});
      
    } catch (error) {
      // Error is already handled by the hook
    }
  };

  const handleResendClick = async () => {
    try {
      await resendOTP.mutateAsync({email, type: 'review_verification'});
    
    } catch (error) {
      // Error is already handled by the hook
    }
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
            <div className="text-center font-medium mb-6 text-lg">Enter OTP sent to your email</div>
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
          <button
            type="button"
            className="text-blue-600 underline text-base hover:text-blue-800"
            onClick={handleResendClick}
            disabled={resendOTP.isPending}
          >
            {resendOTP.isPending ? 'Resending...' : 'Resend OTP'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtpVerifyModal; 