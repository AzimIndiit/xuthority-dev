import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { AuthService, LoginRequest, User, UserRegisterRequest, VendorRegisterRequest } from "../services/auth";
import { queryClient } from "@/lib/queryClient";
import { queryKeys } from "@/hooks/useAuth";

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
        AuthService.tokenStorage.removeToken();
        // Aggressively clear all TanStack Query cache
        queryClient.removeQueries();
        queryClient.clear();
        // If using persistence, clear localStorage
        localStorage.removeItem('REACT_QUERY_OFFLINE_CACHE');
        set({ token: null, user: null, isLoggedIn: false });
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
          console.log('response', response)
          if (response.success && response.data) {
            // Map API response to UserInfo format
            const userInfo: User = {
              id: response.data.user._id,
              displayName: `${response.data.user.firstName} ${response.data.user.lastName}`,
              ...response.data.user
            };
            
            // Extract accessToken from user object
            const token = response.data.user.accessToken || response.data.token;
            
            // Set the token in storage immediately
            if (token) {
              AuthService.tokenStorage.setToken(token);
            }
            
            set({
              user: userInfo,
              token: token,
              isLoggedIn: true,
              isLoading: false,
              error: null,
            });
            toast.dismiss()
            toast.success('Login successful!');
            return true;
          } else {
            set({
              isLoading: false,
              error: response.error?.message || 'Login failed',
            });
            console.log('response', response)
            return false;
          }
        } catch (error: any) {
          console.log('error', error)
          toast.dismiss()
          toast.error(error.response?.data?.error?.message || 'Login failed');
          const errorMessage = error.response?.data?.message || error.message || 'Login failed';
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
            // Extract accessToken from user object
            const token = response.data.user.accessToken || response.data.token;
            
            // Set the token in storage immediately
            if (token) {
              AuthService.tokenStorage.setToken(token);
            }
       
            set({
              user: userInfo,
              token: token,
              isLoggedIn: true,
              isLoading: false,
              error: null,
            });

            queryClient.removeQueries();
            queryClient.clear();
            localStorage.removeItem('REACT_QUERY_OFFLINE_CACHE');
    
              // Fetch fresh profile data after successful login
            // await getProfileWithAPI();
            
            // Set fresh query data with updated profile
            const user = useUserStore.getState().user;
            if (user) {
              queryClient.setQueryData(queryKeys.user, user);
              queryClient.setQueryData(queryKeys.profile, user);
            }
            toast.dismiss()
            toast.success('Registration successful!');
            return true;
          } else {
            set({
              isLoading: false,
              error: response.error?.message || 'Registration failed',
            });
            toast.dismiss()            
            toast.error(response.error?.message || 'Registration failed');
            return false;
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.error?.message || 'Registration failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          toast.dismiss()
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
            
            // Extract accessToken from user object
            const token = response.data.user.accessToken || response.data.token;
            
            // Set the token in storage immediately
            if (token) {
              AuthService.tokenStorage.setToken(token);
            }
            
            set({
              user: userInfo,
              token: token,
              isLoggedIn: true,
              isLoading: false,
              error: null,
            });
            toast.dismiss()
            toast.success('Registration successful!');
            return true;
          } else {
            set({
              isLoading: false,
              error: response.error?.message || 'Registration failed',
            });
            toast.dismiss()
            toast.error(response.error?.message || 'Registration failed');
            return false;
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.error?.message || 'Registration failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          toast.dismiss()
          toast.error(errorMessage);
          return false;
        }
      },
      
      logoutWithAPI: async () => {
        set({ isLoading: true });
        try {
          AuthService.tokenStorage.removeToken();
          queryClient.removeQueries();
          queryClient.clear();
          localStorage.removeItem('REACT_QUERY_OFFLINE_CACHE');
          set({
            user: null,
            token: null,
            isLoggedIn: false,
            isLoading: false,
            error: null,
          });
          toast.dismiss()
          toast.success('Successfully logged out!');
        } catch (error) {
          AuthService.tokenStorage.removeToken();
          queryClient.removeQueries();
          queryClient.clear();
          localStorage.removeItem('REACT_QUERY_OFFLINE_CACHE');
          set({
            user: null,
            token: null,
            isLoggedIn: false,
            isLoading: false,
            error: null,
          });
          toast.dismiss()
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