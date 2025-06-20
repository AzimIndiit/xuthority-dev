import { create } from 'zustand';

export type AuthView =
  | "login"
  | "user-signup"
  | "vendor-signup"
  | "forgot-password";

interface UIState {
  isAuthModalOpen: boolean;
  authModalView: AuthView;
  openAuthModal: (view?: AuthView) => void;
  closeAuthModal: () => void;
  setAuthModalView: (view: AuthView) => void;
}

const useUIStore = create<UIState>((set) => ({
  isAuthModalOpen: false,
  authModalView: 'login',
  openAuthModal: (view = 'login') => set({ isAuthModalOpen: true, authModalView: view }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  setAuthModalView: (view) => set({ authModalView: view }),
}));

export default useUIStore; 