import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/useToast";
import useUserStore from "@/store/useUserStore";

export default function UserOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useUserStore();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!isLoggedIn || user?.role !== "user") {
      toast.dismiss();  
      toast.auth.error("You don't have permission");
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, user, navigate]);

  if (!isLoggedIn || user?.role !== "user") {
    return null;
  }

  return <>{children}</>;
} 