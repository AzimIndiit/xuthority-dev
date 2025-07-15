import { useMemo } from 'react';
import useUserStore from '@/store/useUserStore';

/**
 * Custom hook that provides stable authentication state
 * This prevents hook order issues during login/logout by ensuring
 * consistent references across re-renders
 */
export const useStableAuth = () => {
  const { isLoggedIn, user, isLoading, error } = useUserStore();

  // Create stable references to prevent hook order issues
  const stableIsLoggedIn = useMemo(() => isLoggedIn, [isLoggedIn]);
  const stableUser = useMemo(() => user, [user]);
  const stableIsLoading = useMemo(() => isLoading, [isLoading]);
  const stableError = useMemo(() => error, [error]);

  return {
    isLoggedIn: stableIsLoggedIn,
    user: stableUser,
    isLoading: stableIsLoading,
    error: stableError,
  };
};

export default useStableAuth; 