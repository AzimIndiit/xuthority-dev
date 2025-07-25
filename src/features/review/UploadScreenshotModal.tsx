import React, { useRef } from "react";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileUploadService } from "@/services/fileUpload";
import { useToast } from "@/hooks/useToast";

interface UploadScreenshotModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (fileUrl: string) => void;
  softwareName?: string;
}

const MAX_SIZE_MB = 10;
const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/zip",
];

const schema = z.object({
  file: z
    .any()
    .refine((file) => file instanceof File, "File is required")
    .refine(
      (file) => file && ACCEPTED_TYPES.includes(file.type),
      "Unsupported file type"
    )
    .refine(
      (file) => file && file.size <= MAX_SIZE_MB * 1024 * 1024,
      `File must be less than ${MAX_SIZE_MB}MB`
    ),
});

type FormValues = z.infer<typeof schema>;

const UploadScreenshotModal: React.FC<UploadScreenshotModalProps> = ({
  open,
  onClose,
  onSuccess,
  softwareName,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    clearErrors,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const file = watch("file");

  // Get the register function but destructure to avoid ref conflict
  const { ref: registerRef, ...registerProps } = register("file");

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setValue("file", droppedFile, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      clearErrors("file");
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setValue("file", selectedFile, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      clearErrors("file");
    }
    e.target.value = "";
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
    console.log("inputRef.current", inputRef.current);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      // Upload file using FileUploadService
      const response = await FileUploadService.uploadFile(data.file);
      
      if (response.success && response.data) {
        // Get the file URL using the FileUploadService helper
        const fileUrl = FileUploadService.getFileUrl(response.data);
        
        // Call onSuccess with the file URL
        if (onSuccess) {
          onSuccess(fileUrl);
        }
        
        // Show success message
        toast.success('Screenshot uploaded successfully!');
        
        // Reset form
        reset();
      } else {
        throw new Error('Failed to upload file');
      }
    } catch (error: any) {
      console.error('File upload failed:', error);
      toast.error(error.message || 'Failed to upload screenshot. Please try again.');
    }
  };

  // Normalize file value to always be a File or undefined
  let fileValue = file;
  if (file && typeof FileList !== "undefined" && file instanceof FileList) {
    fileValue = file[0];
  }
  const isImage =
    fileValue &&
    ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
      fileValue.type
    );
  const handleClose = () => {
    reset(); // Clear the form and selected file
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => (!open ? handleClose() : undefined)}
    >
      <DialogContent className="max-w-lg p-8 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center mb-2">
            Upload screenshot of you using
            <br />
            {softwareName ? (
              <span className="capitalize">{softwareName}</span>
            ) : (
              "your software"
            )}
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-center mb-8">
            Upload a screenshot to help the XUTHORITY moderation team verify
            your review securely.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-8"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div
            className="border-2 border-dashed border-blue-400 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-blue-50 transition"
            onClick={handleClick}
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <input
              id="file"
              type="file"
              accept="image/*"
              className="hidden"
              ref={(e) => {
                inputRef.current = e;
                registerRef(e);
              }}
              onChange={(e) => {
                registerProps.onChange(e);
                onFileChange(e);
              }}
              onBlur={registerProps.onBlur}
              name={registerProps.name}
            />
            {fileValue ? (
              <div className="w-full h-48 relative">
                <img
                  src={URL.createObjectURL(fileValue)}
                  alt="Uploaded file preview"
                  className="w-full h-full object-cover rounded-lg cursor-pointer"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
                  <path
                    d="M24 34V14m0 0l-7 7m7-7l7 7"
                    stroke="#2563EB"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="8"
                    y="34"
                    width="32"
                    height="6"
                    rx="3"
                    fill="#2563EB"
                    fillOpacity=".1"
                  />
                </svg>
                <div className="mt-2 text-base">
                  <span className="text-blue-600 underline cursor-pointer">
                    Click here
                  </span>{" "}
                  to upload or drop image here
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  Support Jpg, png
                </div>
              </div>
            )}
          </div>
          {errors.file && (
            <div className="text-red-500 text-sm text-center mt-2">
              {errors.file.message as string}
            </div>
          )}
          <Button
            type="submit"
            className="w-full rounded-full py-4 text-lg font-semibold mt-2 bg-blue-600 hover:bg-blue-700 text-white h-12"
            size="lg"
            disabled={isSubmitting || !fileValue}
            loading={isSubmitting}
          >
            Continue
          </Button>
        </form>
        <DialogFooter className="flex flex-col items-center mt-2 w-full  text-center">
          <Button
            variant="link"
            className="text-blue-600 underline text-base hover:text-blue-800 p-0 h-auto w-full"
            onClick={handleClose}
          >
            Or Choose a Different Option
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadScreenshotModal;
