import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUploadService } from "@/services/fileUpload";
import { useToast } from "@/hooks/useToast";

interface UploadImagesModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (attachments: any[]) => void;
  softwareName?: string;
  existingAttachments?: any[];
}

const MAX_SIZE_MB = 5;
const MAX_FILES = 3;

const UploadImagesModal: React.FC<UploadImagesModalProps> = ({
  open,
  onClose,
  onSuccess,
  softwareName,
  existingAttachments = [],
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const [attachments, setAttachments] = useState<any[]>(existingAttachments);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check total count
    const currentCount = attachments.length;
    const remainingSlots = MAX_FILES - currentCount;

    if (files.length > remainingSlots) {
      toast.error(`You can only add ${remainingSlots} more image(s). Maximum ${MAX_FILES} images allowed.`);
      return;
    }

    // Validate file sizes
    const maxBytes = MAX_SIZE_MB * 1024 * 1024;
    const oversized = files.filter((f) => f.size > maxBytes);
    if (oversized.length > 0) {
      toast.error(`Each image must be less than ${MAX_SIZE_MB}MB`);
      return;
    }

    // Add new files to attachments
    const newAttachments = [...attachments, ...files].slice(0, MAX_FILES);
    setAttachments(newAttachments);
    
    // Clear input
    if (e.target) {
      e.target.value = "";
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    
    if (files.length === 0) return;

    // Check total count
    const currentCount = attachments.length;
    const remainingSlots = MAX_FILES - currentCount;

    if (files.length > remainingSlots) {
      toast.error(`You can only add ${remainingSlots} more image(s). Maximum ${MAX_FILES} images allowed.`);
      return;
    }

    // Validate file sizes
    const maxBytes = MAX_SIZE_MB * 1024 * 1024;
    const oversized = files.filter((f) => f.size > maxBytes);
    if (oversized.length > 0) {
      toast.error(`Each image must be less than ${MAX_SIZE_MB}MB`);
      return;
    }

    // Add new files to attachments
    const newAttachments = [...attachments, ...files].slice(0, MAX_FILES);
    setAttachments(newAttachments);
  };

  const removeAttachmentAt = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setAttachments([]);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onSubmit = async () => {
    if (attachments.length < 1) {
      toast.error('Please attach at least 1 image');
      return;
    }

    setIsSubmitting(true);
    try {
      const finalAttachments: any[] = [];
      
      // Separate existing attachments from new files
      const existingAttachmentsKept = attachments.filter(item => !(item instanceof File));
      const newFiles = attachments.filter(item => item instanceof File) as File[];
      
      // Add existing attachments directly
      finalAttachments.push(...existingAttachmentsKept);
      
      // Upload new files if any
      if (newFiles.length > 0) {
        toast.loading('Uploading images...');
        
        // Upload files one by one or in batch
        const uploadedAttachments = [];
        for (const file of newFiles) {
          const response = await FileUploadService.uploadFile(file);
          if (response.success && response.data) {
            uploadedAttachments.push({
              fileName: response.data.originalName || response.data.filename || file.name,
              fileUrl: response.data.url || response.data.bestImageUrl || FileUploadService.getFileUrl(response.data),
              fileType: response.data.mimeType || response.data.mimetype || file.type,
              fileSize: response.data.size || file.size,
              uploadedAt: new Date().toISOString()
            });
          }
        }
        
        finalAttachments.push(...uploadedAttachments);
        toast.dismiss();
      }
      
      // Call onSuccess with the attachments
      if (onSuccess) {
        onSuccess(finalAttachments.slice(0, MAX_FILES));
      }
      
      // Show success message
      // toast.success('Images uploaded successfully!');
      
      // Reset and close
      setAttachments([]);
      onClose();
    } catch (error: any) {
      console.error('File upload failed:', error);
      toast.error(error.message || 'Failed to upload images. Please try again.');
    } finally {
      setIsSubmitting(false);
      toast.dismiss();
    }
  };

  const handleClose = () => {
    setAttachments(existingAttachments);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => (!open ? handleClose() : undefined)}
    >
      <DialogContent className="max-w-2xl p-8 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center mb-2">
            Upload screenshots of you using
            <br />
            {softwareName ? (
              <span className="capitalize">{softwareName}</span>
            ) : (
              "your software"
            )}
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-center mb-8">
            Upload 1-3 screenshots to help verify your review.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-blue-400 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-blue-50 transition min-h-[200px]"
            onClick={handleClick}
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              ref={inputRef}
              onChange={handleFileChange}
            />
            
            {attachments.length > 0 ? (
              <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-4">
                {attachments.map((attachment, idx) => {
                  const isFile = attachment instanceof File;
                  const imageUrl = isFile 
                    ? URL.createObjectURL(attachment) 
                    : attachment.fileUrl;
                  const altText = `Image ${idx + 1}`;
                  
                  return (
                    <div key={idx} className="relative">
                      <img 
                        src={imageUrl} 
                        alt={altText} 
                        className="w-full h-32 object-cover rounded-lg" 
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAttachmentAt(idx);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
                
                {/* {attachments.length < MAX_FILES && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-32">
                    <div className="text-center">
                      <svg className="w-8 h-8 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <p className="text-xs text-gray-500 mt-1">Add more</p>
                    </div>
                  </div>
                )} */}
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
                  to upload or drop images here (1-3)
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  Support JPG, PNG, GIF (Max {MAX_SIZE_MB}MB each)
                </div>
              </div>
            )}
          </div>
          
          {attachments.length > 0 && (
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {attachments.length} of {MAX_FILES} images selected
              </p>
           
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-col gap-2 mt-6">
          <Button
            onClick={onSubmit}
            className="w-full rounded-full py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white h-12"
            size="lg"
            disabled={isSubmitting || attachments.length < 1}
            loading={isSubmitting}
          >
            Continue
          </Button>
        
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadImagesModal;