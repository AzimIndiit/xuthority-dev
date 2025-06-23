import React from "react";
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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface CompanyVerifyModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const schema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters.'),
  companyEmail: z.string().email('Please enter a valid email address.'),
});

type FormValues = z.infer<typeof schema>;

const CompanyVerifyModal: React.FC<CompanyVerifyModalProps> = ({ open, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: FormValues) => {
    // Simulate async submit
    await new Promise((res) => setTimeout(res, 1200));
    onSuccess(); // Call onSuccess after submit
    // reset();
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
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="block font-medium mb-2">Your Company Name</label>
            <Input
              type="text"
              placeholder="Enter Your Company Name"
              className={`rounded-full px-6 py-4 text-lg ${errors.companyName && touchedFields.companyName ? 'border-red-500' : ''}`}
              {...register('companyName')}
              aria-invalid={!!errors.companyName}
              aria-describedby="company-name-error"
              disabled={isSubmitting}
            />
            {errors.companyName && (
              <div className="text-red-500 text-sm mt-1" id="company-name-error">{errors.companyName.message}</div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-2">Your Company Email</label>
            <Input
              type="email"
              placeholder="Enter Your Company Email"
              className={`rounded-full px-6 py-4 text-lg ${errors.companyEmail && touchedFields.companyEmail ? 'border-red-500' : ''}`}
              {...register('companyEmail')}
              aria-invalid={!!errors.companyEmail}
              aria-describedby="company-email-error"
              disabled={isSubmitting}
            />
            {errors.companyEmail && (
              <div className="text-red-500 text-sm mt-1" id="company-email-error">{errors.companyEmail.message}</div>
            )}
          </div>
          <Button
            type="submit"
            className="w-full rounded-full py-4 text-lg font-semibold mt-2 bg-blue-600 hover:bg-blue-700 text-white h-12"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Continue'}
          </Button>
        </form>
        <DialogFooter className="flex flex-col items-center mt-2 w-full  text-center">
          <DialogClose asChild className="w-full">
            <Button variant="link" className="text-blue-600 underline text-base hover:text-blue-800 p-0 h-auto">
              Or Choose a Different Option
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyVerifyModal; 