import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { AuthService, LoginRequest, User, UserRegisterRequest, VendorRegisterRequest } from "../services/auth";

// Import query client to clear cache on logout
import { queryClient } from "../App";

interface UserState {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Keep existing interface
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  
  // Add API integration methods
  loginWithAPI: (credentials: LoginRequest) => Promise<boolean>;
  loginWithToken: (user: User, token: string) => Promise<boolean>;
  registerUserWithAPI: (data: UserRegisterRequest) => Promise<boolean>;
  registerVendorWithAPI: (data: VendorRegisterRequest) => Promise<boolean>;
  logoutWithAPI: () => Promise<void>;
  getProfileWithAPI: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,
      
      // Keep existing methods for backward compatibility
      login: (token, user) => {
        set({ token, user, isLoggedIn: true });
        // toast.success("Successfully logged in!");
      },
      logout: () => {
        // Clear token from storage
        AuthService.tokenStorage.removeToken();
        
        // Clear all TanStack Query cache
        queryClient.clear();
        
        set({ token: null, user: null, isLoggedIn: false });
        // toast.success("Successfully logged out!");
      },
      updateUser: (userUpdate) => set((state) => ({
        user: state.user ? { ...state.user, ...userUpdate } : null,
      })),
      
      // API integration methods
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      clearError: () => set({ error: null }),
      
      initializeAuth: async () => {
        const token = AuthService.getToken();
        if (token) {
          set({ token, isLoggedIn: true, isLoading: true });
          try {
            await get().getProfileWithAPI();
          } catch (error) {
            // Token is invalid, clear auth state
            set({ 
              user: null, 
              token: null, 
              isLoggedIn: false, 
              isLoading: false 
            });
          }
        }
      },
      
      loginWithAPI: async (credentials: LoginRequest): Promise<boolean> => {
        set({ isLoading: true, error: null });
        try {
          const response = await AuthService.login(credentials);
          if (response.success && response.data) {
            // Map API response to UserInfo format
            const userInfo: User = {
              id: response.data.user._id,
              displayName: `${response.data.user.firstName} ${response.data.user.lastName}`,
              ...response.data.user
            };
            
            set({
              user: userInfo,
              token: response.data.token,
              isLoggedIn: true,
              isLoading: false,
              error: null,
            });
            toast.success('Login successful!');
            return true;
          } else {
            set({
              isLoading: false,
              error: response.error?.message || 'Login failed',
            });
            toast.error(response.error?.message || 'Login failed');
            return false;
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.error?.message || 'Login failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          return false;
        }
      },
      
      loginWithToken: async (user: User, token: string): Promise<boolean> => {
        set({ isLoading: true, error: null });
        try {
          // Map API response to UserInfo format
          const userInfo: User = {
            id: user._id || user.id,
            displayName: `${user.firstName} ${user.lastName}`,
            ...user
          };
          
          set({
            user: userInfo,
            token: token,
            isLoggedIn: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (error: any) {
          const errorMessage = error.response?.data?.error?.message || 'Login failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          return false;
        }
      },
      
      registerUserWithAPI: async (data: UserRegisterRequest): Promise<boolean> => {
        set({ isLoading: true, error: null });
        try {
          const response = await AuthService.registerUser(data);
          if (response.success && response.data) {
            // Map API response to UserInfo format
            const userInfo: User = {
              id: response.data.user._id,
              displayName: `${response.data.user.firstName} ${response.data.user.lastName}`,
              ...response.data.user
          
            };
            
            set({
              user: userInfo,
              token: response.data.token,
              isLoggedIn: true,
              isLoading: false,
              error: null,
            });
            toast.success('Registration successful!');
            return true;
          } else {
            set({
              isLoading: false,
              error: response.error?.message || 'Registration failed',
            });
            toast.error(response.error?.message || 'Registration failed');
            return false;
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.error?.message || 'Registration failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          toast.error(errorMessage);
          return false;
        }
      },
      
      registerVendorWithAPI: async (data: VendorRegisterRequest): Promise<boolean> => {
        set({ isLoading: true, error: null });
        try {
          const response = await AuthService.registerVendor(data);
          if (response.success && response.data) {
            // Map API response to UserInfo format
            const userInfo: User = {
              id: response.data.user._id,
              displayName: `${response.data.user.firstName} ${response.data.user.lastName}`,
         
              ...response.data.user
            };
            
            set({
              user: userInfo,
              token: response.data.token,
              isLoggedIn: true,
              isLoading: false,
              error: null,
            });
            toast.success('Registration successful!');
            return true;
          } else {
            set({
              isLoading: false,
              error: response.error?.message || 'Registration failed',
            });
            toast.error(response.error?.message || 'Registration failed');
            return false;
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.error?.message || 'Registration failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          toast.error(errorMessage);
          return false;
        }
      },
      
      logoutWithAPI: async () => {
        set({ isLoading: true });
        try {
          // Clear token from storage
          AuthService.tokenStorage.removeToken();
          
          // Clear all TanStack Query cache
          queryClient.clear();
          
          // Clear local state
          set({
            user: null,
            token: null,
            isLoggedIn: false,
            isLoading: false,
            error: null,
          });
          
          toast.success('Successfully logged out!');
        } catch (error) {
          // Even if logout fails, clear local state and cache
          AuthService.tokenStorage.removeToken();
          queryClient.clear();
          set({
            user: null,
            token: null,
            isLoggedIn: false,
            isLoading: false,
            error: null,
          });
          toast.success('Successfully logged out!');
        }
      },
      
      getProfileWithAPI: async () => {
        try {
          const response = await AuthService.getProfile();
          if (response.success && response.data) {
            // Map API response to UserInfo format
            const userInfo: User = {
              id: response.data.user._id,
              displayName: `${response.data.user.firstName} ${response.data.user.lastName}`,
              ...response.data.user
            };
            
            set({
              user: userInfo,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              isLoading: false,
              error: response.error?.message || 'Failed to get profile',
            });
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.error?.message || 'Failed to get profile';
          set({
            isLoading: false,
            error: errorMessage,
          });
          // If profile fetch fails, user might not be authenticated
          if (error.response?.status === 401) {
            set({
              user: null,
              token: null,
              isLoggedIn: false,
            });
          }
        }
      },
    }),
    {
      name: "user-store",
      partialize: (state) => ({ token: state.token, user: state.user, isLoggedIn: state.isLoggedIn }),
    }
  )
);

export default useUserStore; 