import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

export interface UserInfo {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "vendor";
  avatar: string;
  followers: number;
  following: number;
  // Add more fields as needed
}

interface UserState {
  token: string | null;
  user: UserInfo | null;
  isLoggedIn: boolean;
  login: (token: string, user: UserInfo) => void;
  logout: () => void;
  updateUser: (user: Partial<UserInfo>) => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoggedIn: false,
      login: (token, user) => {
        set({ token, user, isLoggedIn: true });
        toast.success("Successfully logged in!");
      },
      logout: () => {
        set({ token: null, user: null, isLoggedIn: false });
        // toast.success("Successfully logged out!");
      },
      updateUser: (userUpdate) => set((state) => ({
        user: state.user ? { ...state.user, ...userUpdate } : null,
      })),
    }),
    {
      name: "user-store",
      partialize: (state) => ({ token: state.token, user: state.user, isLoggedIn: state.isLoggedIn }),
    }
  )
);

export default useUserStore; 