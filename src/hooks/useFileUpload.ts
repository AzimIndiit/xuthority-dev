import { useMutation } from '@tanstack/react-query';
import { FileUploadService, FileUploadResponse } from '@/services/fileUpload';
import toast from 'react-hot-toast';

// Hook for single file upload
export const useFileUpload = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const response = await FileUploadService.uploadFile(file);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to upload file');
      }
      return response.data;
    },
    onSuccess: (data: FileUploadResponse) => {
      toast.success('File uploaded successfully');
    },
    onError: (error: any) => {
      console.error('File upload error:', error);
      toast.error(error.message || 'Failed to upload file');
    },
  });
};

// Hook for multiple file upload
export const useMultipleFileUpload = () => {
  return useMutation({
    mutationFn: async (files: File[]) => {
      const response = await FileUploadService.uploadMultipleFiles(files);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to upload files');
      }
      return response.data;
    },
    onSuccess: (data: FileUploadResponse[]) => {
      toast.success(`${data.length} file(s) uploaded successfully`);
    },
    onError: (error: any) => {
      console.error('Multiple file upload error:', error);
      toast.error(error.message || 'Failed to upload files');
    },
  });
};

// Hook for profile image upload
export const useProfileImageUpload = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      // Validate the file first
      const validation = FileUploadService.validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const response = await FileUploadService.uploadProfileImage(file);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to upload profile image');
      }
      return response.data;
    },
    onSuccess: (data: FileUploadResponse) => {
      toast.success('Profile image uploaded successfully');
    },
    onError: (error: any) => {
      console.error('Profile image upload error:', error);
      toast.error(error.message || 'Failed to upload profile image');
    },
  });
};

// Hook for image upload with validation
export const useImageUpload = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      // Validate the file first
      const validation = FileUploadService.validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const response = await FileUploadService.uploadFile(file);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to upload image');
      }
      return response.data;
    },
    onSuccess: (data: FileUploadResponse) => {
      toast.success('Image uploaded successfully');
    },
    onError: (error: any) => {
      console.error('Image upload error:', error);
      toast.error(error.message || 'Failed to upload image');
    },
  });
}; 