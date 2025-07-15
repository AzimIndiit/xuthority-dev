import { create } from 'zustand';

export type AuthView =
  | "login"
  | "user-signup"
  | "vendor-signup"
  | "forgot-password";

interface PostLoginAction {
  type: 'navigate-to-write-review';
  payload: {
    software: {
      id: string;
      name: string;
      logoUrl: string;
    };
    currentStep: number;
  };
}

interface UIState {
  isAuthModalOpen: boolean;
  authModalView: AuthView;
  postLoginAction: PostLoginAction | null;
  openAuthModal: (view?: AuthView, postLoginAction?: PostLoginAction) => void;
  closeAuthModal: () => void;
  setAuthModalView: (view: AuthView) => void;
  setPostLoginAction: (action: PostLoginAction | null) => void;
  clearPostLoginAction: () => void;
}

const useUIStore = create<UIState>((set) => ({
  isAuthModalOpen: false,
  authModalView: 'login',
  postLoginAction: null,
  openAuthModal: (view = 'login', postLoginAction = null) => 
    set({ isAuthModalOpen: true, authModalView: view, postLoginAction }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  setAuthModalView: (view) => set({ authModalView: view }),
  setPostLoginAction: (action) => set({ postLoginAction: action }),
  clearPostLoginAction: () => set({ postLoginAction: null }),
}));

export default useUIStore; 