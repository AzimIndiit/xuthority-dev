import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb as ShadcnBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// A map to provide custom names for path segments.
const breadcrumbNameMap: { [key: string]: string } = {
  // Example: 'user-profile': 'User Profile'
};

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Don't render breadcrumbs on the homepage.
  if (pathnames.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 py-5">
      <div className="lg:max-w-screen-xl mx-auto px-4 lg:px-6 relative z-10">
        <ShadcnBreadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-gray-900 font-semibold hover:text-blue-600 capitalize">
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {pathnames.map((value, index) => {
              const to = `/${pathnames.slice(0, index + 1).join("/")}`;
              const isLast = index === pathnames.length - 1;
              const name =
                breadcrumbNameMap[value] ||
                value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, " ");

              return (
                <React.Fragment key={to}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="font-semibold text-blue-600 capitalize">
                        {name}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild className="text-gray-700 hover:text-blue-600 capitalize">
                        <Link to={to}>{name}</Link>
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
       <div className="absolute top-1/2 left-0 w-full h-full z-0">
         <div className="absolute top-0 left-[5%] w-32 h-1 bg-yellow-400/80 -rotate-45" />
         <div className="absolute top-10 right-[10%] w-40 h-1.5 bg-orange-300/80 -rotate-45" />
         <div className="absolute bottom-5 left-[20%] w-24 h-0.5 bg-yellow-400/60 -rotate-45" />
         <div className="absolute bottom-10 right-[30%] w-24 h-1 bg-red-300/60 -rotate-45" />
      </div>
    </section>
  );
};

export default Breadcrumb; 