import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { AuthModal } from "@/features/auth/AuthModal";
import Breadcrumb from "./Breadcrumb";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "@/components/ScrollToTop";

// Root layout with Navbar
function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Breadcrumb />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AuthModal />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}
export default RootLayout;
