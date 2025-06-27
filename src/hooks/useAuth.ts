import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import useUserStore from '@/store/useUserStore';
import { AuthService, LoginRequest, UserRegisterRequest, VendorRegisterRequest, UpdateProfileRequest, ChangePasswordRequest } from '../services/auth';
import { FileUploadService } from '../services/fileUpload';
import toast from 'react-hot-toast';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  publicProfile: (userId: string) => [...authKeys.all, 'public-profile', userId] as const,
};

// Custom hook for authentication state
export const useAuth = () => {
  const { user, isLoggedIn, isLoading, error, clearError } = useUserStore();

  return {
    user,
    isAuthenticated: isLoggedIn,
    isLoading,
    error,
    clearError,
  };
};

// Hook for user profile query
export const useProfile = () => {
  const { user, isLoggedIn, getProfileWithAPI } = useUserStore();

  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      if (isLoggedIn) {
        await getProfileWithAPI();
      }
      return user;
    },
    enabled: isLoggedIn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for public profile query
export const usePublicProfile = (userId: string) => {
  return useQuery({
    queryKey: authKeys.publicProfile(userId),
    queryFn: async () => {
      const response = await AuthService.getPublicProfile(userId);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch profile');
      }
      return response.data;
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Hook for login mutation
export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { loginWithAPI, isLoading, error, clearError } = useUserStore();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const success = await loginWithAPI(credentials);
      if (success) {
        // Invalidate and refetch user data
        await queryClient.invalidateQueries({ queryKey: ['user'] });
        // Navigate to dashboard or home
        navigate('/');
      }
      return success;
    },
    onError: (error: any) => {
      console.error('Login error:', error);
    },
  });
};

// Hook for user registration mutation
export const useRegisterUser = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { registerUserWithAPI } = useUserStore();

  return useMutation({
    mutationFn: async (data: UserRegisterRequest) => {
      const success = await registerUserWithAPI(data);
      if (success) {
        // Invalidate and refetch user data
        await queryClient.invalidateQueries({ queryKey: ['user'] });
        // Navigate to dashboard or home
        navigate('/');
      }
      return success;
    },
    onError: (error: any) => {
      console.error('Registration error:', error);
    },
  });
};

// Hook for vendor registration mutation
export const useRegisterVendor = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { registerVendorWithAPI } = useUserStore();

  return useMutation({
    mutationFn: async (data: VendorRegisterRequest) => {
      const success = await registerVendorWithAPI(data);
      if (success) {
        // Invalidate and refetch user data
        await queryClient.invalidateQueries({ queryKey: ['user'] });
        // Navigate to dashboard or home
        navigate('/');
      }
      return success;
    },
    onError: (error: any) => {
      console.error('Vendor registration error:', error);
    },
  });
};

// Hook for logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logoutWithAPI } = useUserStore();

  return useMutation({
    mutationFn: async () => {
      await logoutWithAPI();
      // Clear all queries
      await queryClient.clear();
      // Navigate to home
      
    },
    onError: (error: any) => {
      console.error('Logout error:', error);
    },
  });
};

// Hook for profile update mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useUserStore();

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
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    },
  });
};

// Hook for profile update with image upload
export const useUpdateProfileWithImage = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useUserStore();

  return useMutation({
    mutationFn: async ({ profileData, imageFile }: { profileData: UpdateProfileRequest; imageFile?: File }) => {
      let avatarUrl = profileData.avatar;

      // Upload image if provided
      if (imageFile) {
        const validation = FileUploadService.validateImageFile(imageFile);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }

        const uploadResponse = await FileUploadService.uploadProfileImage(imageFile);
        if (!uploadResponse.success) {
          throw new Error(uploadResponse.error?.message || 'Failed to upload image');
        }
        console.log('uploadResponse', uploadResponse)
        avatarUrl = uploadResponse.data[0].url;
      }

      // Update profile with new avatar URL
      const updateData = {
        ...profileData,
        avatar: avatarUrl,
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
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      console.error('Profile update with image error:', error);
      toast.error(error.message || 'Failed to update profile');
    },
  });
};

// Hook for change password mutation
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      const response = await AuthService.changePassword(data);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to change password');
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: any) => {
      console.error('Password change error:', error);
      toast.error(error.message || 'Failed to change password');
    },
  });
};

// Hook for forgot password mutation
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await AuthService.forgotPassword(data);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to send reset email');
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password reset email sent successfully');
    },
    onError: (error: any) => {
      console.error('Forgot password error:', error);
      toast.error(error.message || 'Failed to send reset email');
    },
  });
};

// Hook for reset password mutation
export const useResetPassword = () => {
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
      toast.success('Password reset successfully');
      navigate('/login');
    },
    onError: (error: any) => {
      console.error('Reset password error:', error);
      toast.error(error.message || 'Failed to reset password');
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
