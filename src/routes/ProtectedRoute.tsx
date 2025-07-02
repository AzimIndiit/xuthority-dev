import useUserStore from "@/store/useUserStore";
import { Navigate, Outlet } from "react-router-dom";
import { useToast } from "@/hooks/useToast";
import { useEffect } from "react";

// Auth guard
export function ProtectedRoute() {
  const { isLoggedIn } = useUserStore();
  const toast = useToast();

  useEffect(() => {
    if (!isLoggedIn) {
      toast.dismiss()
      toast.auth.error("Please log in first.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
}

// Role guard
export function RoleRoute({ role }: { role: "user" | "vendor" | ("user" | "vendor")[] }) {
  const { user } = useUserStore();
  const toast = useToast();
  const allowedRoles = Array.isArray(role) ? role : [role];
  const isAuthorized = user && allowedRoles.includes(user.role);

  useEffect(() => {
    if (!isAuthorized) {
      toast.auth.error("You are not authorized to view this page.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isAuthorized ? <Outlet /> : <Navigate to="/" replace />;
}

