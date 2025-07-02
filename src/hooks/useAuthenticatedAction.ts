import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '@/store/useUserStore';
import useUIStore from '@/store/useUIStore';
import { useReviewStore } from '@/store/useReviewStore';

interface UseAuthenticatedActionOptions {
  redirectTo?: string;
  resetReviewStore?: boolean;
}

export const useAuthenticatedAction = (options: UseAuthenticatedActionOptions = {}) => {
  const { isLoggedIn } = useUserStore();
  const { openAuthModal } = useUIStore();
  const { setSelectedSoftware, setCurrentStep } = useReviewStore();
  const navigate = useNavigate();

  const executeAction = useCallback((callback?: () => void) => {
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }

    if (options.resetReviewStore) {
      setSelectedSoftware(null);
      setCurrentStep(1);
    }

    if (options.redirectTo) {
      navigate(options.redirectTo);
    }

    if (callback) {
      callback();
    }
  }, [
    isLoggedIn, 
    openAuthModal, 
    navigate, 
    setSelectedSoftware, 
    setCurrentStep, 
    options.redirectTo, 
    options.resetReviewStore
  ]);

  return {
    executeAction,
    isLoggedIn
  };
}; 