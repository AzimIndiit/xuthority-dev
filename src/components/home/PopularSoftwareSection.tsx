import { StyledAccordion } from "@/components/ui/StyledAccordion";
import { useFeaturedSoftwares } from "@/hooks/useFeaturedSoftwares";
import { useMemo } from "react";

interface ProductItem {
  value: string;
  rating: number;
  reviews: number;
  slug: string;
}

interface CategoryItem {
  title: string;
  items: ProductItem[];
}

const PopularSoftwareSection = () => {
  const { featuredSoftwares, isLoading, error, hasData } = useFeaturedSoftwares({
    limit: 12, // Get more softwares to ensure good coverage
    productsPerSoftware: 6, // Get more products per software
    minRating: 3.0, // Only show well-rated products
    sortBy: 'totalReviews',
    sortOrder: 'desc'
  });

  // Transform API data to accordion format
  const categories: CategoryItem[] = useMemo(() => {
    if (!hasData) return [];

    return featuredSoftwares.map((item) => ({
      title: item.software.name,
      items: item.topProducts.map((product) => ({
        value: `${product.name} (★ ${product.avgRating.toFixed(1)} • ${product.totalReviews} reviews)`,
        rating: product.avgRating,
        reviews: product.totalReviews,
        slug: product.slug
      }))
    }));
  }, [featuredSoftwares, hasData]);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            Popular Software Categories
          </h2>
          <p className="mt-4 text-lg text-gray-600 text-center max-w-3xl mx-auto">
            Loading our most popular software categories...
          </p>
          
          <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6 mt-12">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Loading skeleton */}
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-[#e6f0fa] px-6 py-4 rounded-xl animate-pulse"
                >
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            Popular Software Categories
          </h2>
          <div className="mt-8 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 font-medium">Unable to load software categories</p>
              <p className="text-red-500 text-sm mt-2">Please try again later</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // No data state
  if (!hasData || categories.length === 0) {
    return null
  }

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Popular Software Categories
        </h2>
        <p className="mt-4 text-lg text-gray-600 text-center max-w-3xl mx-auto">
          Explore our most popular software categories with top-rated products 
          to find the right solution for your business needs.
        </p>
      </div>

      <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6 mt-12">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <StyledAccordion
              key={cat.title + idx}
              title={cat.title}
              items={cat.items}
              isOpenByDefault={idx < 3}
            />
          ))}
        </div>
        
        {/* Show total count */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Showing {categories.length} featured software categories with top-rated products
          </p>
        </div>
      </div>
    </section>
  );
};

export default PopularSoftwareSection; 