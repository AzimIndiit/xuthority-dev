import { createBrowserRouter, Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ProtectedRoute, RoleRoute } from "./ProtectedRoute";
import useUserStore from "@/store/useUserStore";
import { SuspenseLoader } from "@/components/EnhancedLoader";
import ScrollToTop from "@/components/ScrollToTop";
import SoftwareCategoryPage from "@/pages/software/SoftwareCategoryPage";
import SubCategoryPage from "@/pages/software/SubCategoryPage";
import CommunityPage from "@/pages/product/CommunityPage";
import AuthAwareWrapper from "@/components/layout/AuthAwareWrapper";
import HookErrorBoundary from "@/components/layout/HookErrorBoundary";
import DisputesPage from '@/pages/product/DisputesPage';
import WriteReviewPage from '@/pages/review/WriteReviewPage';
import ReviewCommentsPage from '@/pages/review/ReviewCommentsPage';
import AuthCallback from '@/pages/auth/AuthCallback';
import UserOnlyRoute from './UserOnlyRoute';

const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordPage"));
const AuthLayout = ({ children }: { children?: React.ReactNode }) => (
  <div>
    <ScrollToTop />
    {children || <Outlet />}
  </div>
);

const RootLayout = lazy(() => import("@/components/layout/RootLayout"));
const Home = lazy(() => import("@/pages/Home"));
const ResourcesPage = lazy(() => import("@/pages/resource/ResourcesPage").then(module => ({ default: module.ResourcesPage })));
const BlogDetailPage = lazy(() => import("@/pages/resource/BlogDetailPage").then(module => ({ default: module.BlogDetailPage })));

// Lazy load legal pages
const TermsConditionsPage = lazy(() => import("@/pages/legal").then(module => ({ default: module.TermsConditionsPage })));
const PrivacyPolicyPage = lazy(() => import("@/pages/legal").then(module => ({ default: module.PrivacyPolicyPage })));
const RefundPolicyPage = lazy(() => import("@/pages/legal").then(module => ({ default: module.RefundPolicyPage })));

// Lazy load vendor pages
const ForVendorsPage = lazy(() => import("@/pages/vendor").then(module => ({ default: module.ForVendorsPage })));
const AboutPage = lazy(() => import("@/pages/about").then(module => ({ default: module.AboutPage })));
const ComparePage = lazy(() => import("@/pages/product/ComparePage"));
// Lazy load software category routes
const ProductDetailPage = lazy(
  () => import("@/pages/product/ProductDetailPage")
);

// Lazy load user and vendor routes
const UserProfile = lazy(() => import("../pages/user/Profile"));
const PublicProfileBySlug = lazy(() => import('../pages/public-profile/PublicProfileBySlug'));



const Loader = () => <SuspenseLoader text="Loading page..." minTime={800} />;

// Guard for auth pages: redirect to home if already logged in
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useUserStore();
  if (isLoggedIn) {
    window.location.replace("/");
    return null;
  }
  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: "/",
    Component: (props: any) => (
      <Suspense fallback={<Loader />}>
        <RootLayout {...props} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        Component: (props: any) => (
          <Suspense fallback={<Loader />}>
            <Home {...props} />
          </Suspense>
        ),
      },
      {
        path: "auth",
        Component: AuthLayout,
        children: [
       
          {
            path: "callback",
            Component: AuthCallback,
          },
          {
            path: "reset-password",
            Component: (props: any) => (
              <AuthGuard>
                <Suspense fallback={<Loader />}>
                  <ResetPasswordPage {...props} />
                </Suspense>
              </AuthGuard>
            ),
          },
        ],
      },
      
      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <RoleRoute role={["user", "vendor"]} />,
            children: [
              {
                path: "/profile",
                Component: (props: any) => (
                  <Suspense fallback={<Loader />}>
                    <UserProfile {...props} />
                  </Suspense>
                ),
              },
              {
                path: "/profile/:tab",
                Component: (props: any) => (
                  <Suspense fallback={<Loader />}>
                    <UserProfile {...props} />
                  </Suspense>
                ),
              },
              {
                path: "/profile/:tab/:subTab",
                Component: (props: any) => (
                  <Suspense fallback={<Loader />}>
                    <UserProfile {...props} />
                  </Suspense>
                ),
              },
              
            ],
          },
        ],
      },
      // Public profile by slug route (accessible to all authenticated users)
      {
        path: "/public-profile/:slug",
        children: [
          {
            index: true,
            Component: (props: any) => (
              <Suspense fallback={<Loader />}>
                <HookErrorBoundary>
                  <AuthAwareWrapper>
                    <PublicProfileBySlug {...props} />
                  </AuthAwareWrapper>
                </HookErrorBoundary>
              </Suspense>
            ),
          },
        ],
      },
      {
        element: <UserOnlyRoute>
          <WriteReviewPage />
        </UserOnlyRoute>,
        path: "/write-review",
      },
      {
        path: "/resources",
        children: [
          {
            index: true,
            Component: (props: any) => (
              <Suspense fallback={<Loader />}>
                <ResourcesPage {...props} />
              </Suspense>
            ),
          },
          {
            path: ":slug",
            Component: (props: any) => (
              <Suspense fallback={<Loader />}>
                <BlogDetailPage {...props} />
              </Suspense>
            ),
          },
          
        ],
      },
      // For Vendors page
      {
        path: "/for-vendors",
        Component: (props: any) => (
          <Suspense fallback={<Loader />}>
            <ForVendorsPage {...props} />
          </Suspense>
        ),
      },
      // About page
      {
        path: "/about-us",
        Component: (props: any) => (
          <Suspense fallback={<Loader />}>
            <AboutPage {...props} />
          </Suspense>
        ),
      },
      // Legal pages
      {
        path: "/terms",
        Component: (props: any) => (
          <Suspense fallback={<Loader />}>
            <TermsConditionsPage {...props} />
          </Suspense>
        ),
      },
      {
        path: "/privacy",
        Component: (props: any) => (
          <Suspense fallback={<Loader />}>
            <PrivacyPolicyPage {...props} />
          </Suspense>
        ),
      },
      {
        path: "/refund",
        Component: (props: any) => (
          <Suspense fallback={<Loader />}>
            <RefundPolicyPage {...props} />
          </Suspense>
        ),
      },
      {
        path: "/:category",
        children: [
          { index: true, Component: SoftwareCategoryPage },
          {
            path: ":subCategory",
            children: [
              { 
                index: true, 
                element: (
                  <HookErrorBoundary>
                    <AuthAwareWrapper>
                      <SubCategoryPage />
                    </AuthAwareWrapper>
                  </HookErrorBoundary>
                )
              },
              {
                path: ":productSlug",
                
              },
            ],
          },
        ],
      },
      {
        path: "/product-detail/:productSlug",
        children: [
          { index: true, Component: ProductDetailPage },
          {
            path: "community",
            Component: CommunityPage,
          },
          {
            path: "disputes",
            Component: DisputesPage,
          }
        ],
      },
      {
        path: "/product-compare",
        Component: (props: any) => (
          <Suspense fallback={<Loader />}>
            <ComparePage {...props} />
          </Suspense>
        ),
      },        
      {
        path: "/product-detail/:productSlug/reviews",
        Component: (props: any) => (
          <Suspense fallback={<Loader />}>
            <ReviewCommentsPage {...props} />
          </Suspense>
        ),
      },
      // {
      //   path: "/product-detail/:productSlug/reviews",
      //   children: [
      //     { index: true, Component: ProductReviews },
         
      //   ],
      // },
    ],
  },
]);

export default router;
