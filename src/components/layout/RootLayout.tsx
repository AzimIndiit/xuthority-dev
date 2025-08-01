import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { AuthModal } from "@/features/auth/AuthModal";
import Breadcrumb from "./Breadcrumb";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "@/components/ScrollToTop";
import CompareButton from "@/components/CompareButton";
import { Helmet } from "@dr.pogodin/react-helmet";

// Root layout with Navbar
function RootLayout() {
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex, nocache" />
        <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      </Helmet>
      <ScrollToTop />
      <Navbar />
      <Breadcrumb />
      <main className="flex-1 min-h-[calc(100vh-500px)]">
        <Outlet />
      </main>
      <Footer />
      <AuthModal />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}
export default RootLayout;
