import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useUserStore from "@/store/useUserStore";

export default function UserOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || user?.role !== "user") {
      toast.dismiss();  
      toast.error("You don't have permission");
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, user, navigate]);

  if (!isLoggedIn || user?.role !== "user") {
    return null;
  }

  return <>{children}</>;
} 