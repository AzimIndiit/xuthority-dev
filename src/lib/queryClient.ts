import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401) return false;
        return failureCount < 3;
      },
    },
    mutations: {
      // Add global mutation timeout
      retry: (failureCount, error: any) => {
        // Don't retry 4xx client errors (including 400, 401, 403, 404, etc.)
        // These are client errors that won't succeed on retry
        const status = error?.response?.status;
        if ((status >= 400 && status < 500) || 
            error?.message?.includes('timeout') || 
            error?.message?.includes('validation')) {
          return false;
        }
        return failureCount < 2;
      },
      // Global mutation timeout of 60 seconds as a safety net
      onError: (error: any) => {
        // Log all mutation errors for debugging
        console.error('Mutation error:', error);
      },
    },
  },
}); 