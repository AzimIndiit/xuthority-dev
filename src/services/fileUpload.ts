import { ApiService, ApiResponse } from './api';

// File upload response interface
export interface FileUploadResponse {
  _id: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  s3Key: string;
  uploadedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// File upload request interface
export interface FileUploadRequest {
  file: File;
}

// Multiple file upload request interface
export interface MultipleFileUploadRequest {
  files: File[];
}

// File upload service class
export class FileUploadService {
  // Upload single file (backend returns array of files)
  static async uploadFile(file: File): Promise<ApiResponse<FileUploadResponse[]>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return await ApiService.post<FileUploadResponse[]>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Upload multiple files
  static async uploadMultipleFiles(files: File[]): Promise<ApiResponse<FileUploadResponse[]>> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    return await ApiService.post<FileUploadResponse[]>('/files/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Upload profile image
  static async uploadProfileImage(file: File): Promise<ApiResponse<FileUploadResponse[]>> {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }

    // Backend already returns array, no need to wrap again
    const formData = new FormData();
    formData.append('file', file);
    
    return await ApiService.post<FileUploadResponse[]>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Upload company avatar image
  static async uploadCompanyImage(file: File): Promise<ApiResponse<FileUploadResponse[]>> {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }

    // Backend already returns array, no need to wrap again
    const formData = new FormData();
    formData.append('file', file);
    
    return await ApiService.post<FileUploadResponse[]>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Get file URL from response
  static getFileUrl(fileResponse: FileUploadResponse): string {
    return fileResponse.url;
  }

  // Validate image file
  static validateImageFile(file: File): { isValid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return { isValid: false, error: 'File must be an image' };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { isValid: false, error: 'File size must be less than 5MB' };
    }

    // Check file extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(fileExtension)) {
      return { isValid: false, error: 'File must be a valid image format (JPG, PNG, GIF, WebP)' };
    }

    return { isValid: true };
  }
}

export default FileUploadService; 