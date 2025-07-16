import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/useToast";
import useUserStore from "@/store/useUserStore";

export default function UserOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useUserStore();
  const navigate = useNavigate();
  const toast = useToast();
  const wasLoggedInRef = useRef(isLoggedIn);
  const hasShownErrorRef = useRef(false);

  useEffect(() => {
    // Track if user was previously logged in
    if (isLoggedIn) {
      wasLoggedInRef.current = true;
      hasShownErrorRef.current = false; // Reset error flag when user logs in
    }

    if (!isLoggedIn || user?.role !== "user") {
      // Only show error toast if:
      // 1. User was never logged in (initial unauthorized access)
      // 2. OR user has wrong role (not a logout scenario)
      // 3. AND we haven't already shown the error for this session
      const isLogoutScenario = wasLoggedInRef.current && !isLoggedIn;
      const isWrongRole = isLoggedIn && user?.role !== "user";
      
      if ((isWrongRole || !wasLoggedInRef.current) && !hasShownErrorRef.current) {
        toast.dismiss();  
        toast.auth.error("You don't have permission");
        hasShownErrorRef.current = true;
      }
      
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, user, navigate, toast]);

  if (!isLoggedIn || user?.role !== "user") {
    return null;
  }

  return <>{children}</>;
} 