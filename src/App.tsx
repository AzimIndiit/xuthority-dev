import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import useUserStore from "@/store/useUserStore";
import AppRoutes from "@/routes";
import { queryClient } from "@/lib/queryClient";

function App() {
  const { initializeAuth } = useUserStore();
  
  // Test query to ensure React Query is working

  useEffect(() => {
    // Initialize authentication on app start
    initializeAuth();
  }, [initializeAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={AppRoutes} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App; 