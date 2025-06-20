import { createBrowserRouter, Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ProtectedRoute, RoleRoute } from "./ProtectedRoute";
import useUserStore from "@/store/useUserStore";
import LottieLoader from "@/components/LottieLoader";

const About = () => <div>About Page</div>;
const AuthLayout = ({ children }: { children?: React.ReactNode }) => (
  <div>{children || <Outlet />}</div>
);
const Login = () => <div>Login Page</div>;
const Register = () => <div>Register Page</div>;
const ConcertsHome = () => <div>Concerts Home</div>;
const ConcertsCity = () => <div>Concerts City</div>;
const ConcertsTrending = () => <div>Concerts Trending</div>;
const RootLayout = lazy(() => import("@/components/layout/RootLayout"));
const Home = lazy(() => import("@/pages/Home"));

// Lazy load software category routes
const SoftwareCategoryPage = lazy(
  () => import("@/pages/software/SoftwareCategoryPage")
);
const SubCategoryPage = lazy(
  () => import("@/pages/software/SubCategoryPage")
);
const ProductDetailPage = lazy(
  () => import("@/pages/software/ProductDetailPage")
);

// Lazy load user and vendor routes
const UserProfile = lazy(() => import("@/pages/user/Profile"));

const Loader = () => (
  <div className="w-full flex justify-center items-center min-h-[100dvh] text-lg font-semibold">
    <LottieLoader />
  </div>
);

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
      { path: "about", Component: About },
      {
        path: "auth",
        Component: AuthLayout,
        children: [
          {
            path: "login",
            Component: (props: any) => (
              <AuthGuard>
                <Login {...props} />
              </AuthGuard>
            ),
          },
          {
            path: "register",
            Component: (props: any) => (
              <AuthGuard>
                <Register {...props} />
              </AuthGuard>
            ),
          },
        ],
      },
      {
        path: "concerts",
        children: [
          { index: true, Component: ConcertsHome },
          { path: ":city", Component: ConcertsCity },
          { path: "trending", Component: ConcertsTrending },
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
              // ...other user routes
            ],
          },
       
        ],
      },
      {
        path: "/:category",
        Component: (props: any) => (
          <Suspense fallback={<Loader />}>
            <SoftwareCategoryPage {...props} />
          </Suspense>
        ),
      },
      {
        path: "/:category/:subCategory",
        Component: (props: any) => (
          <Suspense fallback={<Loader />}>
            <SubCategoryPage {...props} />
          </Suspense>
        ),
      },
      {
        path: "/:category/:subCategory/:productSlug",
        Component: (props: any) => (
          <Suspense fallback={<Loader />}>
            <ProductDetailPage {...props} />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
