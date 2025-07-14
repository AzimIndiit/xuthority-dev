import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import useUserStore from '@/store/useUserStore';
import { AuthService, LoginRequest, UserRegisterRequest, VendorRegisterRequest, UpdateProfileRequest, ChangePasswordRequest } from '../services/auth';
import { FileUploadService } from '../services/fileUpload';

import { queryClient } from '@/lib/queryClient';
import useToast from './useToast';



// Query keys
export const queryKeys = {
  user: ['user'] as const,
  profile: ['profile'] as const,
  publicProfile: (userId: string) => ['publicProfile', userId] as const,
};

// Hook for authentication state
export const useAuth = () => {
  const { user, isLoggedIn, isLoading, error } = useUserStore();
  return { user, isLoggedIn, isLoading, error };
};

// Hook for user profile query
export const useProfile = () => {
  const { getProfileWithAPI, user } = useUserStore();

  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: async () => {
      // Get the latest user from store (not the closure)
      const currentUser = useUserStore.getState().user;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
     
      await getProfileWithAPI();
      // Return the latest user data from store
      return useUserStore.getState().user;
    },
    enabled: !!user,
    staleTime: 0, // 5 minutes
    gcTime: 0,
  });
};

// Hook for public user profile query
export const usePublicProfile = (userId: string) => {
  return useQuery({
    queryKey: ['publicProfile', userId],
    queryFn: async () => {
      const response = await AuthService.getPublicProfile(userId);
      if (response.success && response.data) {
        return response.data.user;
      }
      throw new Error(response.error?.message || 'Failed to fetch public profile');
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for public profile query by slug
export const usePublicProfileBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['publicProfileBySlug', slug],
    queryFn: async () => {
      const response = await AuthService.getPublicProfileBySlug(slug);
      if (response.success && response.data) {
        return response.data.user;
      }
      throw new Error(response.error?.message || 'Failed to fetch public profile');
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for user reviews query
export const useUserReviews = (userId: string, options?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['userReviews', userId, options],
    queryFn: async () => {
      const response = await AuthService.getUserReviews(userId, options);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to fetch user reviews');
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook for user reviews query by slug
export const useUserReviewsById = (userId: string, options?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['userReviewsById', userId, options],
    queryFn: async () => {
      const response = await AuthService.getUserReviews(userId, options);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to fetch user reviews');
    },
    select: (data: any) => data,
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook for user profile statistics query
export const useUserProfileStats = (userId: string) => {
  return useQuery({
    queryKey: ['userProfileStats', userId],
    queryFn: async () => {
      const response = await AuthService.getUserProfileStats(userId);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to fetch user profile statistics');
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for user profile statistics query by slug
export const useUserProfileStatsBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['userProfileStatsBySlug', slug],
    queryFn: async () => {
      const response = await AuthService.getUserProfileStatsBySlug(slug);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to fetch user profile statistics');
    },
    enabled: !!slug,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for login mutation
export const useLogin = () => {
  const navigate = useNavigate();
  const { loginWithAPI, getProfileWithAPI } = useUserStore();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const success = await loginWithAPI(credentials);
      if (success) {
        // Clear cache first, then set fresh data
        queryClient.removeQueries();
        queryClient.clear();
        localStorage.removeItem('REACT_QUERY_OFFLINE_CACHE');

        // Wait a bit to ensure token is properly set in headers
        await new Promise(resolve => setTimeout(resolve, 100));

        // Fetch fresh profile data after successful login
        await getProfileWithAPI();
        
        // Set fresh query data with updated profile
        const user = useUserStore.getState().user;
        if (user) {
          queryClient.setQueryData(queryKeys.user, user);
          queryClient.setQueryData(queryKeys.profile, user);
        }
         
        return success;
      } else {
        // Throw error if login failed so React Query treats it as failure
        throw new Error('Login failed');
      }
    },
    onError: (error: any) => {
      console.error('Login error:', error);
    },
  });
};

// Hook for user registration mutation
export const useRegisterUser = () => {
  const navigate = useNavigate();
  const { registerUserWithAPI, getProfileWithAPI } = useUserStore();

  return useMutation({
    mutationFn: async (data: UserRegisterRequest) => {
      const success = await registerUserWithAPI(data);
      if (success) {
        // Clear cache first, then set fresh data
        queryClient.removeQueries();
        queryClient.clear();
        localStorage.removeItem('REACT_QUERY_OFFLINE_CACHE');
        
        // Wait a bit to ensure token is properly set in headers
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Fetch fresh profile data after successful registration
        await getProfileWithAPI();
        
        // Set fresh query data with updated profile
        const user = useUserStore.getState().user;
        if (user) {
          queryClient.setQueryData(queryKeys.user, user);
          queryClient.setQueryData(queryKeys.profile, user);
        }
        
        // Navigate to dashboard or home
        navigate('/');
        return success;
      } else {
        // Throw error if registration failed so React Query treats it as failure
        throw new Error('Registration failed');
      }
    },
    onError: (err: any) => {
      console.error('Registration error:', err);
    },
  });
};

// Hook for vendor registration mutation
export const useRegisterVendor = () => {
  const navigate = useNavigate();
  const { registerVendorWithAPI, getProfileWithAPI } = useUserStore();

  return useMutation({
    mutationFn: async (data: VendorRegisterRequest) => {
      const success = await registerVendorWithAPI(data);
      if (success) {
        // Clear cache first, then set fresh data
        queryClient.removeQueries();
        queryClient.clear();
        localStorage.removeItem('REACT_QUERY_OFFLINE_CACHE');
        
        // Wait a bit to ensure token is properly set in headers
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Fetch fresh profile data after successful registration
        await getProfileWithAPI();
        
        // Set fresh query data with updated profile
        const user = useUserStore.getState().user;
        if (user) {
          queryClient.setQueryData(queryKeys.user, user);
          queryClient.setQueryData(queryKeys.profile, user);
        }
        
        // Navigate to dashboard or home
        navigate('/');
        return success;
      } else {
        // Throw error if vendor registration failed so React Query treats it as failure
        throw new Error('Vendor registration failed');
      }
    },
    onError: (err: any) => {
      console.error('Vendor registration error:', err);
    },
  });
};

// Hook for logout mutation
export const useLogout = () => {
  const navigate = useNavigate();
  const { logoutWithAPI } = useUserStore();

  return useMutation({
    mutationFn: async () => {
      await logoutWithAPI();
      
      // Navigate to home after logout
      // navigate('/');
    },
    onError: (error: any) => {
      console.error('Logout error:', error);
    },
  });
};

// Hook for profile update mutation
export const useUpdateProfile = () => {
  const { updateUser } = useUserStore();
  const { success, error } = useToast ();

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await AuthService.updateProfile(data);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to update profile');
      }
      return response.data;
    },
    onSuccess: (data: { user: any }) => {
      // Update local state
      updateUser(data.user);
      // Directly update React Query cache with fresh data
      queryClient.setQueryData(queryKeys.user, data.user);
      queryClient.setQueryData(queryKeys.profile, data.user);
      // Also invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      success('Profile updated successfully');
    },
    onError: (err: any) => {
      console.error('Profile update error:', err);
      error(err.message || 'Failed to update profile');
    },
  });
};

// Hook for profile update with image upload
export const useUpdateProfileWithImage = () => {
  const { updateUser } = useUserStore();
  const { success, error } = useToast ();
  return useMutation({
    mutationFn: async ({ 
      profileData, 
      imageFile, 
      companyImageFile 
    }: { 
      profileData: UpdateProfileRequest; 
      imageFile?: File;
      companyImageFile?: File;
    }) => {
      let avatarUrl = profileData.avatar;
      let companyAvatarUrl = (profileData as any).companyAvatar;

      // Upload profile image if provided
      if (imageFile) {
        console.log('Profile image file debug info:', FileUploadService.getFileDebugInfo(imageFile));
        const validation = FileUploadService.validateImageFile(imageFile);
        if (!validation.isValid) {
          console.error('Profile image validation failed:', validation.error);
          throw new Error(validation.error);
        }

        const uploadResponse = await FileUploadService.uploadProfileImage(imageFile);
        if (!uploadResponse.success) {
          throw new Error(uploadResponse.error?.message || 'Failed to upload profile image');
        }
        console.log('uploadResponse', uploadResponse)
        avatarUrl = FileUploadService.getFileUrl(uploadResponse.data);
      }

      // Upload company image if provided
      if (companyImageFile) {
        console.log('Company image file debug info:', FileUploadService.getFileDebugInfo(companyImageFile));
        const validation = FileUploadService.validateImageFile(companyImageFile);
        if (!validation.isValid) {
          console.error('Company image validation failed:', validation.error);
          throw new Error(validation.error);
        }

        const uploadResponse = await FileUploadService.uploadCompanyImage(companyImageFile);
        if (!uploadResponse.success) {
          throw new Error(uploadResponse.error?.message || 'Failed to upload company image');
        }
        console.log('company uploadResponse', uploadResponse)
        companyAvatarUrl = FileUploadService.getFileUrl(uploadResponse.data);
      }

      // Update profile with new avatar URLs
      const updateData = {
        ...profileData,
        avatar: avatarUrl,
        ...(companyAvatarUrl && { companyAvatar: companyAvatarUrl }),
      };
      console.log("updateData", updateData);

      const response = await AuthService.updateProfile(updateData);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to update profile');
      }
      return response.data;
    },
    onSuccess: (data: { user: any }) => {
      // Update local state
      updateUser(data.user);
      // Directly update React Query cache with fresh data
      queryClient.setQueryData(queryKeys.user, data.user);
      queryClient.setQueryData(queryKeys.profile, data.user);
      // Also invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      success('Profile updated successfully');
    },
    onError: (err: any) => {
      console.error('Profile update with image error:', err);
      error(err.message || 'Failed to update profile');
    },
  });
};

// Hook for change password mutation
export const useChangePassword = () => {
  const {success, error} = useToast();
  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      const response = await AuthService.changePassword(data);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to change password');
      }
      return response.data;
    },
    onSuccess: () => {
      success('Password changed successfully');
    },
    onError: (err: any) => {
      console.log('Password change error:', err.response.error.message);
      error(err.response.error.message || 'Failed to change password');
    },
  });
};

// Hook for forgot password mutation
export const useForgotPassword = () => {
  const {success, error} = useToast();
  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await AuthService.forgotPassword(data);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to send reset email');
      }
      return response.data;
    },
    onSuccess: () => {
      success('Reset email sent successfully');
    },
    onError: (err: any) => {
      console.error('Forgot password error:', err);
      error(err.message || 'Failed to send reset email');
    },
  });
};

// Hook for verifying reset token
export const useVerifyResetToken = () => {
  const {success, error} = useToast();
  return useMutation({
    mutationFn: async (data: { token: string }) => {
      const response = await AuthService.verifyResetToken(data);
      if (!response.success) {
        throw new Error(response.error?.message || 'Invalid or expired reset token');
      }
      return response.data;
    },
    onError: (error: any) => {
      console.error('Verify reset token error:', error);
      error(error.response.data.message || 'Invalid or expired reset token');
    },
  });
};

// Hook for reset password mutation
export const useResetPassword = () => {
  const {success, error} = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: { token: string; newPassword: string; confirmNewPassword: string }) => {
      const response = await AuthService.resetPassword(data);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to reset password');
      }
      return response.data;
    },
    onSuccess: () => {
      success('Password reset successfully');
      navigate('/');
    },
    onError: (err: any) => {
      console.error('Reset password error:', err);
      error(err.message || 'Failed to reset password');
    },
  });
};

// Hook for social login
export const useSocialLogin = () => {
  const googleLogin = (role: 'user' | 'vendor' = 'user') => {
    window.location.href = AuthService.getGoogleLoginUrl(role);
  };

  const linkedInLogin = (role: 'user' | 'vendor' = 'user') => {
    window.location.href = AuthService.getLinkedInLoginUrl(role);
  };

  return { googleLogin, linkedInLogin };
};
