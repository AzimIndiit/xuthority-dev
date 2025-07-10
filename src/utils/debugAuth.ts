// Debug utility for authentication
export const debugAuth = {
  checkToken: () => {
    const token = localStorage.getItem('xuthority_access_token');
    console.log('Current token in localStorage:', token);
    return token;
  },
  
  checkAuthHeaders: () => {
    // This will be called by the axios interceptor
    console.log('Auth headers will be set by axios interceptor');
  },
  
  logAuthState: () => {
    const token = localStorage.getItem('xuthority_access_token');
    const userStore = localStorage.getItem('user-store');
    console.log('=== Auth Debug Info ===');
    console.log('Token:', token);
    console.log('User Store:', userStore);
    console.log('======================');
  }
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).debugAuth = debugAuth;
} 