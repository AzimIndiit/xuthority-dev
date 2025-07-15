import { useEffect, useState } from 'react';
import useUserStore from '@/store/useUserStore';

interface AuthAwareWrapperProps {
  children: React.ReactNode;
}

/**
 * Wrapper component that forces re-renders when authentication state changes
 * This helps prevent "hooks order" issues during login/logout
 */
const AuthAwareWrapper: React.FC<AuthAwareWrapperProps> = ({ children }) => {
  const { isLoggedIn, user } = useUserStore();
  const [authKey, setAuthKey] = useState(0);

  // Force re-render when authentication state changes
  useEffect(() => {
    setAuthKey(prev => prev + 1);
  }, [isLoggedIn, user?.id]);

  return (
    <div key={`auth-${authKey}`}>
      {children}
    </div>
  );
};

export default AuthAwareWrapper; 