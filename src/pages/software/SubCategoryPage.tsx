import SoftwareDetailCard from "@/components/SoftwareDetailCard";
import React, { useState } from "react";
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
import { useReviewStore } from "@/store/useReviewStore";
import { useProductsByCategory } from "@/hooks/useProducts";
import LottieLoader from "@/components/LottieLoader";

const PAGE_SIZE = 10;

const SubCategoryPage = () => {
  const { isLoggedIn } = useUserStore();
  const openAuthModal = useUIStore((state) => state.openAuthModal);
  const navigate = useNavigate();
  const { setSelectedSoftware, setCurrentStep } = useReviewStore();
  const { subCategory, category } = useParams<{ subCategory: string, category: string }>();
  const [page, setPage] = useState(1);
  const [sortValue, setSortValue] = useState<string | null>("ratings-desc");
  const [filters, setFilters] = useState({
    segment: "all",
    categories: ["Project Management", "Accounting"],
    industries: ["IT & Services", "Computer Software"],
    price: [10, 250],
  });

  // Fetch products by category and subcategory
  const {
    data: productsResult,
    isLoading,
    isError,
    error
  } = useProductsByCategory(category || '', subCategory || '', page, PAGE_SIZE);

  const products = Array.isArray(productsResult?.data) ? productsResult?.data : [];
  const pagination = productsResult?.meta?.pagination || {
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    pages: 1,
    hasNext: false,
    hasPrev: false
  };

  const total = pagination.total;
  const totalPages = pagination.pages;
  const start = (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LottieLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load products. {error?.message}
      </div>
    );
  }

  return (
    <section className="flex justify-center items-center py-8">
      <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
        {/* Heading and controls */}
        <div className="flex flex-col flex-wrap md:flex-row md:items-center sm:justify-between mb-6 gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {total} Listings in{" "}
            {subCategory ? subCategory.replace(/-/g, " ") : "Category"}{" "}
            Available
          </h2>
          <div className="flex gap-2 sm:gap-4 items-start sm:items-center">
            <SortByDropdown value={sortValue} onChange={setSortValue} />
            <FilterDropdown filters={filters} onFilterChange={setFilters} />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12 gap-y-12">
          {products?.map((product: any) => (
            <SoftwareDetailCard
              key={product._id}
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
                             onWriteReview={() => {
                 if (!isLoggedIn) {
                   openAuthModal();
                   return;
                 }
                 setSelectedSoftware(product.name);
                 setCurrentStep(2);
                 navigate("/write-review");
               }}
               id={product._id}
               slug={product.slug}
            />
          ))}
        </div>

        {/* No products message */}
        {products?.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              There are no products available in this category yet.
            </p>
          </div>
        )}

        {/* Pagination and showing text */}
        {total > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8 gap-2">
            <div className="text-sm text-gray-600">
              Showing {start} to {end} of {total}
            </div>
            <div className="flex gap-1 items-center">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-gray-300"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={page === i + 1 ? "default" : "outline"}
                  size="icon"
                  className="rounded-full border-gray-300 w-8 h-8"
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              )).slice(0, 3)}
              {totalPages > 3 && <span className="px-2 text-gray-400">...</span>}
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-gray-300"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SubCategoryPage;
