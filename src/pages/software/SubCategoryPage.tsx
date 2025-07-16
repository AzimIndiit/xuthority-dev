import SoftwareDetailCard from "@/components/SoftwareDetailCard";
import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import SortByDropdown from "@/components/SortByDropdown";
import FilterDropdown from "@/components/FilterDropdown";
import useUserStore from "@/store/useUserStore";
import useUIStore from "@/store/useUIStore";
import useStableAuth from "@/hooks/useStableAuth";
import { useReviewStore } from "@/store/useReviewStore";
import { useProductsByCategory } from "@/hooks/useProducts";
import LottieLoader from "@/components/LottieLoader";
import SecondaryLoader from "@/components/ui/SecondaryLoader";
import CompareButton from "@/components/CompareButton";
import Pagination from "@/components/ui/pagination";

// Skeleton for the header section
const HeaderSkeleton = () => (
  <div className="flex flex-col flex-wrap md:flex-row md:items-center sm:justify-between mb-6 gap-2 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-64"></div>
    <div className="flex gap-2 sm:gap-4 items-start sm:items-center">
      <div className="h-10 bg-gray-200 rounded w-32"></div>
      <div className="h-10 bg-gray-200 rounded w-28"></div>
    </div>
  </div>
);

// Skeleton for individual software cards
const SoftwareCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
    <div className="flex items-start gap-4 mb-4">
      <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
      <div className="flex-1">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
    
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-4/5"></div>
      <div className="h-4 bg-gray-200 rounded w-3/5"></div>
    </div>
    
    <div className="space-y-3 mb-4">
      <div className="flex items-center gap-2">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-4 bg-gray-200 rounded w-28"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-36"></div>
      </div>
    </div>
    
    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
      <div className="h-6 bg-gray-200 rounded w-24"></div>
      <div className="flex gap-2">
        <div className="h-9 bg-gray-200 rounded w-28"></div>
        <div className="h-9 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  </div>
);

// Skeleton for the grid of software cards
const SoftwareGridSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12 gap-y-12">
    {[...Array(8)].map((_, index) => (
      <SoftwareCardSkeleton key={index} />
    ))}
  </div>
);

// Skeleton for pagination
const PaginationSkeleton = () => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8 gap-2 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-32"></div>
    <div className="flex gap-1 items-center">
      <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-8 w-8 bg-gray-200 rounded-full"></div>
      ))}
      <div className="h-4 bg-gray-200 rounded w-6"></div>
      <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

// Complete page skeleton
const SubCategoryPageSkeleton = () => (
  <section className="flex justify-center items-center py-8">
    <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
      <HeaderSkeleton />
      <SoftwareGridSkeleton />
      <PaginationSkeleton />
    </div>
  </section>
);

const PAGE_SIZE = 10;

const SubCategoryPage = () => {
  // ALL HOOKS MUST BE CALLED FIRST - NO CONDITIONS OR EARLY RETURNS BEFORE THIS
  const { isLoggedIn } = useStableAuth();
  const openAuthModal = useUIStore((state) => state.openAuthModal);
  const navigate = useNavigate();
  const { setSelectedSoftware, setCurrentStep } = useReviewStore();
  const { subCategory, category } = useParams<{ subCategory: string, category: string }>();
  
  // isLoggedIn is already stable from useStableAuth hook
  const [page, setPage] = useState(1);
  const [sortValue, setSortValue] = useState<string | null>("");
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);
  
  // Local filter state (for UI only)
  const [localFilters, setLocalFilters] = useState({
    segment: "all",
    categories: [],
    industries: [],
    price: null as [number, number] | null,
  });
  
  // Applied filter state (sent to API)
  const [appliedFilters, setAppliedFilters] = useState({
    segment: "all",
    categories: [],
    industries: [],
    price: null as [number, number] | null,
  });

  // Memoize API payload to prevent unnecessary API calls
  const apiPayload = useMemo(() => {
    const payload: any = {
      segment: appliedFilters.segment,
      categories: appliedFilters.categories,
      industries: appliedFilters.industries,
      sortBy: sortValue
    };
    
    // Only include price if it's been set
    if (appliedFilters.price !== null) {
      payload.price = appliedFilters.price;
    }
    
    return payload;
  }, [appliedFilters, sortValue]);

  // Fetch products by category and subcategory - MUST BE CALLED UNCONDITIONALLY
  const {
    data: productsResult,
    isLoading,
    isError,
    error
  } = useProductsByCategory(
    category || '',
    subCategory || '',
    "",
    page,
    PAGE_SIZE,
    apiPayload
  );

  // Validate category parameter and redirect if invalid
  React.useEffect(() => {
    if (category && !['software', 'solutions'].includes(category.toLowerCase())) {
      navigate('/', { replace: true });
    }
  }, [category, navigate]);

  // Reset filter loading state when products finish loading
  React.useEffect(() => {
    if (!isLoading && isApplyingFilters) {
      setIsApplyingFilters(false);
    }
  }, [isLoading, isApplyingFilters]);

  // Reset page to 1 when category or subCategory changes
  React.useEffect(() => {
    setPage(1);
  }, [category, subCategory]);

  // Add effect to handle authentication state changes gracefully
  React.useEffect(() => {
    // This effect helps prevent hook order issues during auth state changes
    // by ensuring the component re-renders consistently
    return () => {
      // Cleanup function to prevent state updates on unmounted component
      setIsApplyingFilters(false);
    };
  }, []);

  // Memoize pagination calculations
  const pagination: any = useMemo(() => {
    return productsResult?.meta?.pagination || {
      page: 1,
      limit: PAGE_SIZE,
      total: 0,
      pages: 1,
      hasNext: false,
      hasPrev: false
    };
  }, [productsResult?.meta?.pagination]);

  const products = useMemo(() => {
    return Array.isArray(productsResult?.data) ? productsResult?.data : [];
  }, [productsResult?.data]);

  // NOW ALL HOOKS ARE CALLED - WE CAN DO CONDITIONAL LOGIC AND EARLY RETURNS
  // Ensure we have valid category and subCategory values
  const validCategory = category || '';
  const validSubCategory = subCategory || '';

  const total = pagination?.total || 0;
  const totalPages = pagination.pages;
  const start = (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);

  // Check if any filters are applied
  const hasFiltersApplied = useMemo(() => {
    return (
      appliedFilters.segment !== "all" ||
      appliedFilters.categories.length > 0 ||
      appliedFilters.industries.length > 0 ||
      appliedFilters.price !== null
    );
  }, [appliedFilters]);

  // Handle local filter changes (UI only)
  const handleFilterChange = (newFilters: any) => {
    setLocalFilters(newFilters);
    // Don't update applied filters or trigger API call
  };

  const handleSortChange = (newSortValue: string) => {
    setSortValue(newSortValue);
    setPage(1); // Reset to first page when sort changes
  };

  const handleApplyFilters = async () => {
    setIsApplyingFilters(true);
    try {
      // Apply local filters to API filters
      setAppliedFilters(localFilters);
      setPage(1);
      
      // Wait a brief moment to ensure the state update is processed
      await new Promise(resolve => setTimeout(resolve, 100));
    } finally {
      setIsApplyingFilters(false);
    }
  };

  const handleClearFilters = () => {
    const resetFilters = {
      segment: "all",
      categories: [],
      industries: [],
      price: null as [number, number] | null,
    };
    setLocalFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setPage(1);
  };

  const handlePageChange = (page: number) => {
    setPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle error state - moved after all hooks
  if (isError) {
    return (
      <div className="text-center py-8 text-red-500 min-h-[60vh] flex justify-center items-center">
        Failed to load products. {error?.message}
      </div>
    );
  }

  // Handle loading state - moved after all hooks
  if (isLoading) {
    return <SubCategoryPageSkeleton />;
  }

  return (
    <section className="flex justify-center items-center py-8">
      <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
        {/* Heading and controls */}
        <div className="flex flex-col flex-wrap md:flex-row md:items-center sm:justify-between mb-6 gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {hasFiltersApplied ? (
              `${total} Listing Available`
            ) : (
              <>
                {total} Listings in{" "}
                <span className="capitalize">{subCategory ? subCategory.replace(/-/g, " ") : "Category"}</span>
                {" "}Available
              </>
            )}
          </h2>
          <div className="flex gap-2 sm:gap-4 items-start sm:items-center">
            <SortByDropdown value={sortValue} onChange={handleSortChange} />
            <FilterDropdown 
              filters={localFilters} 
              onFilterChange={handleFilterChange} 
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
              isLoading={isApplyingFilters}
            />
          </div>
        </div>

        {/* Grid */}
        <div className="relative mt-12 min-h-[60vh]">
          {/* Products Grid */}
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2  gap-6 gap-y-14">
              {products.map((product: any) => (
                <div
                  key={product._id}
                  className="h-full flex flex-col"
                >
                  <SoftwareDetailCard
                    name={product.name}
                    logo={product.logoUrl || "https://placehold.co/64x64?text=P"}
                    logoBackground={product.brandColors || "bg-blue-100"}
                    rating={Number(product.avgRating) || 0}
                    reviewCount={product.totalReviews || 0}
                    description={product.description || "No description available"}
                    users={product.whoCanUse?.map((user: any) => user.name).join(", ") || "All Users"}
                    industries={product.industries?.map((industry: any) => industry.name).join(", ") || "All Industries"}
                    marketSegment={product.marketSegment?.map((segment: any) => segment.name).join(", ") || "All Segments"}
                    entryPrice={product.pricing}
                    features={product.features}
                    onWriteReview={() => {
                      if (!isLoggedIn) {
                        openAuthModal();
                        return;
                      }
                      setSelectedSoftware({
                        id: product._id,
                        name: product.name,
                        logoUrl: product.logoUrl,
                      });
                      setCurrentStep(2);
                      navigate("/write-review");
                    }}
                    websiteUrl={product.websiteUrl}
                    whoCanUse={product.whoCanUse}
                    id={product._id}
                    slug={product.slug}
                    industriesAll={product.industries}
                    marketSegmentAll={product.marketSegment}
                    whoCanUseAll={product.whoCanUse}
                    showCompare={true}
                  />
                </div>
              ))}
            </div>
          ) : !isLoading ? (
            <div className="flex flex-col justify-center items-center w-full py-16 min-h-[60vh]">
              <img src="/svg/no_data.svg" alt="No results" className="w-32 h-32 mb-6" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No products found
              </h3>
              <p className="text-gray-500">
                There are no products available in this category yet.
              </p>
            </div>
          ) : null}
        </div>

        

        {/* Pagination and showing text */}
        {total > 0 && (
       <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={total}
          itemsPerPage={PAGE_SIZE}
          showInfo={true}
        />
        )}
      </div>
      <CompareButton />

    </section>
  );
};

export default SubCategoryPage;
