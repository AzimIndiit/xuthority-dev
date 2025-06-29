import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import useUserStore from "@/store/useUserStore";
import { useNavigate } from "react-router-dom";
import useUIStore from "@/store/useUIStore";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { getUserDisplayName, getUserInitials, getTruncatedDisplayName } from "@/utils/userHelpers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";
import { useReviewStore } from "@/store/useReviewStore";
import { formatNumber } from "@/utils/formatNumber";
import { queryClient } from "@/lib/queryClient";

const navLinks = [
  { label: "Software", href: "/software" },
  { label: "Solutions", href: "/solutions" },
  { label: "Resources", href: "#" },
  { label: "For Vendors", href: "#" },
  { label: "About Us", href: "#" },
  { label: "Reviews", href: "#" },
  { label: "Favourites", href: "#" },
  { label: "Notifications", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Return  Policy", href: "#" },
  // Log Out handled separately
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { setSelectedSoftware } = useReviewStore();
  const { resetReview } = useReviewStore();
  const setCurrentStep = useReviewStore((state) => state.setCurrentStep);
  
  // Use the new authentication hooks
  const { user, isLoggedIn } = useAuth();
  const logoutMutation = useLogout();
  
  const openAuthModal = useUIStore((state) => state.openAuthModal);
  const navigate = useNavigate();
  
  // Auto-close drawer on desktop (lg and up)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    // Also close on mount if already desktop
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      localStorage.clear();
      queryClient.clear();
      resetReview();
      setDrawerOpen(false)
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <header className="w-full bg-white border-b border-gray-100 ">
        {/* Responsive nav: px-4 on mobile/tablet, px-6 on desktop */}
        <nav className="lg:max-w-screen-xl mx-auto flex items-center justify-between h-20 px-4 lg:px-6">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            {/* Replace with actual logo image if available */}
            <img
              src="/xuthority_logo.svg"
              alt="Xuthority Logo"
              className="h-10"
            />
          </div>
          {/* Desktop Nav Links (only on lg+) */}
          <div className="flex items-center justify-between lg:space-x-3 xl:space-x-8">
            <ul className="hidden lg:flex lg:space-x-6 xl:space-x-8">
              {navLinks.slice(0, 5).map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-end ">
              {/* Actions: visible on md+ (tablet and up) and also on lg+ (desktop) */}
              <div className="hidden sm:flex  items-center space-x-4 w-full">
               
                {(!isLoggedIn || user?.role === "user") && (
                  <Button
                    onClick={() => {
                      if (!isLoggedIn) {
                        openAuthModal();
                        return;
                      }
                      setSelectedSoftware(null);
                      setCurrentStep(1);
                      navigate("/write-review");
                    }}
                    className="bg-blue-600 text-white font-semibold rounded-full px-6 py-2 text-base shadow hover:bg-blue-700 transition-colors sm:max-w-40"
                    disabled={logoutMutation.isPending}
                  >
                    Write A Review
                  </Button>
                )}
                {isLoggedIn && user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center space-x-2 border-blue-600 rounded-full pl-2 pr-3 py-1.5 h-auto max-w-40"
                        disabled={logoutMutation.isPending}
                      >
                        <Avatar className="h-8 w-8 ">
                          <AvatarImage
                          className="object-cover"
                            src={user?.avatar || ""}
                            alt={getUserDisplayName(user)}
                          />
                          <AvatarFallback className="text-xs">{getUserInitials(user)}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-blue-600 truncate max-w-24">
                          {getTruncatedDisplayName(user, 20)}
                        </span>
                        <ChevronDown className="h-4 w-4 text-blue-600" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuItem onClick={() => navigate("/profile")}>
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                      >
                        {logoutMutation.isPending ? "Logging out..." : "Log out"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    variant="outline"
                    className="border border-blue-600 text-blue-600 font-semibold rounded-full px-6 py-2 text-base bg-white hover:bg-blue-50 transition-colors sm:max-w-40"
                    onClick={() => openAuthModal()}
                    disabled={logoutMutation.isPending}
                  >
                    Join or Log In
                  </Button>
                )}
              </div>
              {/* Hamburger for mobile & tablet (shown below lg) */}
              <Button
                className="lg:hidden ml-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
                variant="ghost"
                disabled={logoutMutation.isPending}
              >
                <svg
                  width="28"
                  height="28"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="text-gray-900"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </nav>
      </header>
      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity duration-300 ${
          drawerOpen
            ? "opacity-60 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-80 max-w-full bg-white shadow-lg transform transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
        style={{ willChange: "transform" }}
        aria-label="Mobile menu"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div
            className="flex items-center  cursor-pointer"
            onClick={() => navigate("/")}
          >
          <img
            src="/xuthority_logo.svg"
            alt="Xuthority Logo"
              className="h-10"
          />
          </div>
          <Button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            variant="ghost"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="text-gray-900"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>
        {/* Profile Section */}
        {isLoggedIn && user && (
          <div className="flex flex-col  px-4 py-6 border-b border-gray-100">
            <div className="flex items-center gap-2 ju">
             
                        <Avatar className="h-16 w-16">
                          <AvatarImage
                          className="object-cover"
                            src={user?.avatar || ""}
                            alt={getUserDisplayName(user)}
                          />
                          <AvatarFallback className="">{getUserInitials(user)}</AvatarFallback>
                        </Avatar>
              <div className="flex space-x-6 mt-3 mb-1">
                <button
                  onClick={() => {
                    navigate('/profile/followers')
                    setDrawerOpen(false)
                  }}
                  className="text-center hover:bg-gray-50 rounded-lg p-1 transition-colors duration-200"
                >
                  <div className="font-bold text-gray-900 text-base leading-tight">
                    {formatNumber(user?.followers)}
                  </div>
                  <div className="text-xs text-gray-500">Followers</div>
                </button>
                <button
                  onClick={() => {
                    navigate('/profile/following')
                    setDrawerOpen(false)
                  }}
                  className="text-center hover:bg-gray-50 rounded-lg p-1 transition-colors duration-200"
                >
                  <div className="font-bold text-gray-900 text-base leading-tight">
                    {formatNumber(user?.following)}
                  </div>
                  <div className="text-xs text-gray-500">Following</div>
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div className="flex flex-col">
                <div className="font-semibold text-gray-900 text-base mt-1 truncate">
                  {getTruncatedDisplayName(user, 15)}
                </div>
                <div className="text-xs text-gray-500 mb-2">{user?.email}</div>
              </div>
              <Button
                size="sm"
                onClick={() => {navigate("/profile")
                  setDrawerOpen(false)
                }}
                className="flex items-center bg-blue-600 text-white font-semibold rounded-full px-4 py-1.5 text-sm mt-1 hover:bg-blue-700 transition-colors"
              >
                View Profile
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            </div>
          </div>
        )}
        {/* Nav Links */}
        <ul className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                className="flex items-center justify-between px-6 py-3 text-base text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  {link.label}
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                </a>
              </li>
            ))}
          {isLoggedIn && user && (
            <li>
              <a
                onClick={handleLogout}
                className="flex items-center justify-between px-6 py-3 text-base text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Log Out
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </li>
          )}
        </ul>
        {/* Drawer Footer Actions (always visible in drawer) */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 border-t border-gray-100">
       {(!isLoggedIn || user?.role === 'user') &&   <Button
            onClick={() => {
              if (!isLoggedIn) {
                openAuthModal();
                return;
              }
              setSelectedSoftware(null);
              setCurrentStep(1);
              navigate("/write-review");
            }}
            className="bg-blue-600 text-white font-semibold rounded-full px-4 sm:px-6 py-2 text-sm sm:text-base shadow hover:bg-blue-700 transition-colors w-full sm:w-1/2"
          >
            Write A Review
          </Button>}
            {!isLoggedIn && (
            <Button
              onClick={() => {
                openAuthModal();
                setDrawerOpen(false);
              }}
              variant="outline"
              className="border border-blue-600 text-blue-600 font-semibold rounded-full px-4 sm:px-6 py-2 text-sm sm:text-base bg-white hover:bg-blue-50 transition-colors w-full sm:w-1/2"
            >
              Join or Log In
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}
