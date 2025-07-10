import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface VendorInvitationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (invitationLink: string) => void;
  onChooseDifferentOption: () => void;
}

const schema = z.object({
  invitationLink: z
    .string()
    .min(1, "Please fill in this field.")
    .url("Please enter a valid URL"),
});

type FormValues = z.infer<typeof schema>;

const VendorInvitationModal: React.FC<VendorInvitationModalProps> = ({
  open,
  onClose,
  onSuccess,
  onChooseDifferentOption,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = async (data: FormValues) => {
    // Simulate async processing
    await new Promise((res) => setTimeout(res, 1000));
    if (onSuccess) onSuccess(data.invitationLink);
    reset();
  };

  const handleChooseDifferent = () => {
    onChooseDifferentOption();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => (!open ? onClose() : undefined)}
    >
      <DialogContent className="max-w-lg p-8 rounded-2xl">
        <DialogHeader className="text-center w-full">
          <DialogTitle className="text-3xl font-bold text-center mb-2">
            Verify where you work
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-center mb-8">
            Help us quickly verify your review by telling us where you work
            <br />
            and confirming your company email.
          </DialogDescription>
        </DialogHeader>
        
        <form
          className="space-y-6 "
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-2">
            <label 
              htmlFor="invitationLink" 
              className="text-base font-medium text-gray-900 block"
            >
              Vendor Invitation Link
            </label>
            <div className="relative">
              <Input
                id="invitationLink"
                type="url"
                placeholder="Enter Vendor Invitation Link"
                className={`w-full px-4 py-4 text-base rounded-full border-2 focus:outline-none focus:ring-0 ${
                  errors.invitationLink 
                    ? "border-red-500 focus:border-red-500" 
                    : "border-gray-300 focus:border-blue-500"
                }`}
                {...register("invitationLink")}
              />
            
            </div>
            {errors.invitationLink && (
              <div className="text-red-500 text-sm mt-1">
                {errors.invitationLink.message}
              </div>
            )}
          </div>
          
          <Button
            type="submit"
            className="w-full rounded-full py-4 text-lg font-semibold mt-8 bg-blue-600 hover:bg-blue-700 text-white h-12"
            size="lg"
            disabled={ isSubmitting}
            loading={isSubmitting}
          >
            Continue
          </Button>
        </form>
        
        <DialogFooter className="flex items-center justify-center mt-4 w-full text-center">
          <Button
            onClick={handleChooseDifferent}
            variant="link"
            className="text-blue-600 underline text-base hover:text-blue-800 p-0 h-auto w-full"
          >
            Or Choose a Different Option
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VendorInvitationModal; 