import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReviewState {
  // Software Selection
  selectedSoftware: string | null;
  
  // Review Steps
  currentStep: number;
  
  // Review Data
  reviewData: {
    rating?: number;
    title?: string;
    description?: string;
    pros?: string[];
    cons?: string[];
  };
  
  // Verification Data
  verificationData: {
    method?: 'screenshot' | 'vendor-invitation' | 'company-email' | null;
    screenshot?: File | null;
    vendorInvitationLink?: string;
    companyEmail?: string;
    isVerified?: boolean;
  };
}

interface ReviewActions {
  // Software Selection Actions
  setSelectedSoftware: (software: string | null) => void;
  
  // Step Management Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  
  // Review Data Actions
  updateReviewData: (data: Partial<ReviewState['reviewData']>) => void;
  setRating: (rating: number) => void;
  setReviewTitle: (title: string) => void;
  setReviewDescription: (description: string) => void;
  addPro: (pro: string) => void;
  removePro: (index: number) => void;
  addCon: (con: string) => void;
  removeCon: (index: number) => void;
  
  // Verification Actions
  setVerificationMethod: (method: ReviewState['verificationData']['method']) => void;
  setScreenshot: (screenshot: File | null) => void;
  setVendorInvitationLink: (link: string) => void;
  setCompanyEmail: (email: string) => void;
  setVerificationStatus: (isVerified: boolean) => void;
  
  // Reset Actions
  resetReview: () => void;
  resetVerification: () => void;
}

type ReviewStore = ReviewState & ReviewActions;

const initialState: ReviewState = {
  selectedSoftware: null,
  currentStep: 1,
  reviewData: {},
  verificationData: {
    method: null,
    screenshot: null,
    vendorInvitationLink: '',
    companyEmail: '',
    isVerified: false,
  },
};

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Software Selection Actions
      setSelectedSoftware: (software) => 
        set({ selectedSoftware: software }),
      
      // Step Management Actions
      setCurrentStep: (step) => 
        set({ currentStep: Math.max(1, Math.min(4, step)) }),
      
      nextStep: () => 
        set((state) => ({ 
          currentStep: Math.min(4, state.currentStep + 1) 
        })),
      
      previousStep: () => 
        set((state) => ({ 
          currentStep: Math.max(1, state.currentStep - 1) 
        })),
      
      // Review Data Actions
      updateReviewData: (data) =>
        set((state) => ({
          reviewData: { ...state.reviewData, ...data }
        })),
      
      setRating: (rating) =>
        set((state) => ({
          reviewData: { ...state.reviewData, rating }
        })),
      
      setReviewTitle: (title) =>
        set((state) => ({
          reviewData: { ...state.reviewData, title }
        })),
      
      setReviewDescription: (description) =>
        set((state) => ({
          reviewData: { ...state.reviewData, description }
        })),
      
      addPro: (pro) =>
        set((state) => ({
          reviewData: {
            ...state.reviewData,
            pros: [...(state.reviewData.pros || []), pro]
          }
        })),
      
      removePro: (index) =>
        set((state) => ({
          reviewData: {
            ...state.reviewData,
            pros: state.reviewData.pros?.filter((_, i) => i !== index) || []
          }
        })),
      
      addCon: (con) =>
        set((state) => ({
          reviewData: {
            ...state.reviewData,
            cons: [...(state.reviewData.cons || []), con]
          }
        })),
      
      removeCon: (index) =>
        set((state) => ({
          reviewData: {
            ...state.reviewData,
            cons: state.reviewData.cons?.filter((_, i) => i !== index) || []
          }
        })),
      
      // Verification Actions
      setVerificationMethod: (method) =>
        set((state) => ({
          verificationData: { ...state.verificationData, method }
        })),
      
      setScreenshot: (screenshot) =>
        set((state) => ({
          verificationData: { ...state.verificationData, screenshot }
        })),
      
      setVendorInvitationLink: (vendorInvitationLink) =>
        set((state) => ({
          verificationData: { ...state.verificationData, vendorInvitationLink }
        })),
      
      setCompanyEmail: (companyEmail) =>
        set((state) => ({
          verificationData: { ...state.verificationData, companyEmail }
        })),
      
      setVerificationStatus: (isVerified) =>
        set((state) => ({
          verificationData: { ...state.verificationData, isVerified }
        })),
      
      // Reset Actions
      resetReview: () => 
        set(initialState),
      
      resetVerification: () =>
        set((state) => ({
          verificationData: initialState.verificationData
        })),
    }),
    {
      name: 'review-store',
      // Don't persist file objects
      partialize: (state) => ({
        ...state,
        verificationData: {
          ...state.verificationData,
          screenshot: null, // Don't persist file objects
        },
      }),
    }
  )
);

// Selector hooks for better performance
export const useSelectedSoftware = () => useReviewStore((state) => state.selectedSoftware);
export const useCurrentStep = () => useReviewStore((state) => state.currentStep);
export const useReviewData = () => useReviewStore((state) => state.reviewData);
export const useVerificationData = () => useReviewStore((state) => state.verificationData);

// Add this helper hook to get user name from auth store if you have one
export const useUserName = () => {
  // Replace this with actual user name from your auth store
  // Example: return useAuthStore((state) => state.user?.name) || "User";
  return "Nikol"; // Placeholder
}; 