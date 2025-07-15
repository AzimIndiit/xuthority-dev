import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Breadcrumb as ShadcnBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBlogBySlug } from "@/hooks/useResources";

// A map to provide custom names for path segments.
const breadcrumbNameMap: { [key: string]: string } = {
  'profile': 'Profile',
  'followers': 'Followers',
  'following': 'Following',
  'public-profile': 'Public Profile',
  // Example: 'user-profile': 'User Profile'
};

const Breadcrumb = () => {
  const location = useLocation();
  const params = useParams();
  const pathnames = location?.pathname?.split("/").filter((x) => x);
  
  // Check if we're on a blog detail page
  const isBlogDetailPage = pathnames[0] === 'resources' && pathnames.length === 2 && !!params.slug;
  
  // Fetch blog data if we're on a blog detail page
  const { data: blog, isLoading: blogLoading } = useBlogBySlug(
    params.slug || '', 
    isBlogDetailPage
  );

  console.log(pathnames[0],"sdasd");
  // Don't render breadcrumbs on the homepage.
  if (pathnames.length === 0 || ['for-vendors','about-us',].includes(pathnames[0])) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 py-5" style={{backgroundImage: 'url("/svg/breadcrumb_bg.svg") ', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="lg:max-w-screen-xl mx-auto px-4 lg:px-6 relative z-10">
        <ShadcnBreadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-gray-900 font-semibold hover:text-blue-600 capitalize text-base ">
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {pathnames.map((value, index) => {
              const to = `/${pathnames.slice(0, index + 1).join("/")}`;
              const isLast = index === pathnames.length - 1;
              
              // Special handling for profile tabs and blog detail pages
              let name = breadcrumbNameMap[value];
              if (!name) {
                // If this is the last segment of a blog detail page, use the actual blog title
                if (isBlogDetailPage && isLast && blog?.title) {
                  name = blog.title;
                } else if (isBlogDetailPage && isLast && blogLoading) {
                  // Show loading state for blog detail page
                  name = "Loading...";
                } else {
                  name = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, " ");
                }
              }

              // For profile tabs, make the link go to the profile base page
              const linkTo = value === 'followers' || value === 'following' ? '/profile' : value === 'product-detail' ? '/' : to;

              // Check if this item should be non-clickable
              const shouldBeNonClickable = isLast || value === 'public-profile' || value === 'product-detail';

              return (
                <React.Fragment key={to}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {shouldBeNonClickable ? (
                      <BreadcrumbPage className="font-semibold text-gray-700 capitalize text-base">
                        {name}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild className="text-gray-700 hover:text-blue-600 capitalize font-semibold text-base">
                        <Link to={linkTo}>{name}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </ShadcnBreadcrumb>
      </div>
       {/* Decorative elements to mimic the design */}
       {/* <div className="absolute top-1/2 left-0 w-full h-full z-0">
         <div className="absolute top-0 left-[5%] w-32 h-1 bg-yellow-400/80 -rotate-45" />
         <div className="absolute top-10 right-[10%] w-40 h-1.5 bg-orange-300/80 -rotate-45" />
         <div className="absolute bottom-5 left-[20%] w-24 h-0.5 bg-yellow-400/60 -rotate-45" />
         <div className="absolute bottom-10 right-[30%] w-24 h-1 bg-red-300/60 -rotate-45" />
      </div> */}
    </section>
  );
};

export default Breadcrumb; 