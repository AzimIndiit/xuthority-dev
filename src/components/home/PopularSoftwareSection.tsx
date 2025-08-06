import { StyledAccordion } from "@/components/ui/StyledAccordion";
import { usePopularSoftwares } from "@/hooks/useFeaturedSoftwares";
import { useMemo, useEffect, useState } from "react";
import { useLandingPageSection } from "@/hooks/useLandingPageSection";

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
  // Comment out old implementation - keeping for reference
  // const { popularSoftwares, isLoading, error, hasData } = usePopularSoftwares({
  //   limit: 12, // Get more softwares to ensure good coverage
  //   productsPerSoftware: 4, // Get top 4 products per software
  //   minRating: 3, // Only show well-rated products
  //   sortBy: 'totalReviews',
  //   sortOrder: 'desc'
  // });
  
  // New implementation using admin-configured data
  const { data: popularData, isLoading: popularLoading } = useLandingPageSection('user', 'popular');
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data when popularData changes
  useEffect(() => {
    const fetchPopularData = async () => {
      if (!popularData?.solutions || popularData.solutions.length === 0) {
        setCategories([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const api = (await import('@/services/api')).default;
        const transformedCategories: CategoryItem[] = [];
        
        // Process each solution/software item
        for (const item of popularData.solutions) {
          let categoryTitle = '';
          let categoryId = '';
          
          // Determine if it's software or solution
          if (item.software) {
            categoryId = typeof item.software === 'object' && item.software._id 
              ? item.software._id 
              : item.software;
            
            // Fetch software details if not populated
            if (typeof item.software === 'string') {
              try {
                const softwareRes = await api.get(`/softwares/${categoryId}`);
                categoryTitle = softwareRes.data.data?.name || categoryId;
              } catch (err) {
                categoryTitle = categoryId;
              }
            } else {
              categoryTitle = item.software.name || categoryId;
            }
          } else if (item.solution) {
            categoryId = typeof item.solution === 'object' && item.solution._id 
              ? item.solution._id 
              : item.solution;
              
            // Fetch solution details if not populated
            if (typeof item.solution === 'string') {
              try {
                const solutionRes = await api.get(`/solutions/${categoryId}`);
                categoryTitle = solutionRes.data.data?.name || categoryId;
              } catch (err) {
                categoryTitle = categoryId;
              }
            } else {
              categoryTitle = item.solution.name || categoryId;
            }
          }
          
          // Extract product IDs
          const productIds = item.products?.map((product: any) => {
            if (typeof product === 'string') return product;
            if (typeof product === 'object' && product._id) return product._id;
            return null;
          }).filter(Boolean) || [];
          
          // Fetch product details
          const productItems: ProductItem[] = [];
          
          for (const productId of productIds) {
            try {
              const productRes = await api.get(`/products/${productId}`);
              const product = productRes.data.data;
              
              if (product) {
                productItems.push({
                  value: product.name,
                  rating: product.avgRating || 0,
                  reviews: product.totalReviews || 0,
                  slug: product.slug || productId
                });
              }
            } catch (err) {
              console.error(`Failed to fetch product ${productId}:`, err);
            }
          }
          
          if (categoryTitle && productItems.length > 0) {
            transformedCategories.push({
              title: categoryTitle,
              items: productItems
            });
          }
        }
        
        setCategories(transformedCategories);
      } catch (err) {
        console.error('Error fetching popular data:', err);
        setError('Failed to load popular software categories');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPopularData();
  }, [popularData]);
  
  const hasData = categories.length > 0;
  const sectionHeading = popularData?.heading || "Popular Software Categories";
const sectionSubtext=popularData?.subtext
  // Loading state
  if (isLoading || popularLoading) {
    return (
      <section className="py-24 md:py-20 bg-gray-50">
        <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            {sectionHeading}
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
                  className="bg-[#e6f0fa] rounded-xl overflow-hidden"
                >
                  {/* Accordion header skeleton */}
                  <div className="px-6 py-4 border-b border-[#d1dfe9]">
                    <div className="flex items-center justify-between">
                      <div className="h-6 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                      <div className="h-5 w-5 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Accordion content skeleton - show for first 3 items */}
                  {idx < 3 && (
                    <div className="px-6 py-4 space-y-3">
                      {Array.from({ length: 4 }).map((_, itemIdx) => (
                        <div key={itemIdx} className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                          </div>
                          <div className="ml-4 flex items-center space-x-2">
                            <div className="h-3 w-8 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
            {sectionHeading}
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
    <section className="py-24 bg-gray-50">
      <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl md:text-5xl font-bold text-center">
          {sectionHeading}
        </h2>
        <p className="mt-4 text-lg text-gray-600 text-center max-w-4xl mx-auto leading-relaxed">
        {sectionSubtext}
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
        
       
      </div>
    </section>
  );
};

export default PopularSoftwareSection; 