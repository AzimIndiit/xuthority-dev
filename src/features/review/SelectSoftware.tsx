import React, { useState, useCallback, useEffect } from "react";
import { RadioGroup } from "@/components/ui/radio-group";
import { Software } from "@/types/review";
import SoftwareSelectionCard from "./SoftwareSelectionCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, X } from "lucide-react";
import ReviewCategorySearch from "./ReviewCategorySearch";
import { useReviewStore } from "@/store/useReviewStore";
import useUserStore from "@/store/useUserStore";
import useUIStore from "@/store/useUIStore";
import { useFetchProductById, useProducts, useProductsByCategory } from "@/hooks/useProducts";
import { useSoftwareOptions } from "@/hooks/useSoftwareOptions";
import useDebounce from "@/hooks/useDebounce";

// Skeleton component for individual software cards
const SoftwareCardSkeleton = () => (
  <div className="h-full">
    <div className="bg-white rounded-lg border border-gray-200 p-4 h-full flex flex-col items-center text-center space-y-3 animate-pulse">
      {/* Logo skeleton */}
      <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
      
      {/* Name skeleton */}
      <div className="w-20 h-4 bg-gray-200 rounded"></div>
      
      {/* Rating skeleton */}
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
        ))}
      </div>
      
      {/* Review count skeleton */}
      <div className="w-16 h-3 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Skeleton grid component
const SoftwareSelectionSkeleton = () => (
  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 gap-y-10 min-h-[200px] sm:min-h-[300px]">
    {[...Array(6)].map((_, index) => (
      <SoftwareCardSkeleton key={index} />
    ))}
  </div>
);

const SelectSoftware = ({
  setShowStepper,
}: {
  setShowStepper?: (show: boolean) => void;
}) => {
  const { isLoggedIn } = useUserStore();
  const openAuthModal = useUIStore((state) => state.openAuthModal);
  const { selectedSoftware, setSelectedSoftware, resetReview } = useReviewStore();
  const setCurrentStep = useReviewStore((state) => state.setCurrentStep);
  const { options: softwareOptions, isLoading: softwareLoading } = useSoftwareOptions();
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  // Local state for selected software (before committing to store)
  const [localSelectedSoftware, setLocalSelectedSoftware] = useState<{id: string, name: string, logoUrl: string} | null>(selectedSoftware);
  useEffect(() => {
    setCurrentStep(1);
    resetReview();
    setLocalSelectedSoftware(null);
  }, []); 

  // Fetch products with search query
  const { data, isLoading, isFetching } = useProductsByCategory(
    "software", 
    selectedCategory, 
    debouncedSearchQuery, 
    1, 
    100
  );
  
  const products = Array.isArray(data?.data) ? data?.data : [];

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);
  console.log('isLoading', isLoading)
  console.log('isFetching', isFetching)

  return (
    <div className="space-y-8">
      {localSelectedSoftware && (
        <div className="sm:hidden block">
          <button
            onClick={() => {
              setShowStepper && setShowStepper(true);
              setLocalSelectedSoftware(null);
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      )}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Search for tools to power your workplace.
        </h2>
        <p className="mt-2 text-gray-600">
          If you're researching new business software or services, you know how
          helpful reviews from real people can be. Our community is a place for
          professionals to help one another find the best business solutions.
        </p>
      </div>

      <ReviewCategorySearch
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        popularMentions={[{label: "All Categories", value: "", slug: "" },...softwareOptions]}  
        onSearch={handleSearch}
      />


  

      {/* Products grid */}
      <div className="mt-10 min-h-[200px] sm:min-h-[300px] ">

      {/* Loading state */}
      {(isLoading || isFetching) && (
        <SoftwareSelectionSkeleton />
      )}
            {/* No results state */}
      {(!isLoading || !isFetching) && products.length === 0  && (
        <div className=" flex flex-col justify-center items-center py-8 w-full text-center min-h-[200px] sm:min-h-[300px]">
          <img src="/svg/no_data.svg" alt="No results" className="w-1/4 mb-4" />
          <p className="text-gray-500">No software found </p>
          <p className="text-sm text-gray-400 mt-2">Try searching with different keywords</p>
        </div>
      )}
      {!(isLoading || isFetching) && products.length > 0 && (
        <RadioGroup
          value={localSelectedSoftware?.id || ""}
          onValueChange={(value) => {
            const software = products.find((s) => s._id === value);
            if (software) {
              setLocalSelectedSoftware({ 
                id: software._id, 
                name: software.name, 
                logoUrl: software.logoUrl || "" 
              });
            }
          }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 gap-y-10">
            {products.slice(0, 6).map((software) => (
              <label key={software._id} htmlFor={software._id} className="h-full">
                <SoftwareSelectionCard
                  id={software._id}
                  name={software.name}
                  logoUrl={software.logoUrl || ""}
                  rating={software.avgRating}
                  reviewCount={software.totalReviews}
                  slug={software.slug}
                  logoBackground={software.brandColors || ""}
                  software={software}
                  isSelected={localSelectedSoftware?.id === software._id}
                />
              </label>
            ))}
          </div>
        </RadioGroup>
      )}
      </div>

      {/* Footer */}
      <div className="mt-12">
        <div className="flex justify-between items-center gap-2">
          <div>
            {localSelectedSoftware?.id && (
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-14 h-14 rounded-lg border-2 border-red-500 bg-red-50 flex items-center justify-center">
                    <img
                      src={localSelectedSoftware?.logoUrl}
                      alt={localSelectedSoftware?.name}
                      className="w-10 h-10 object-contain rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setLocalSelectedSoftware(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 cursor-pointer bg-gray-400 text-white rounded-full flex items-center justify-center text-xs shadow hover:bg-gray-500"
                    aria-label="Remove selection"
                  >
                    ×
                  </button>
                </div>
                <span className="ml-4 font-bold text-lg capitalize">
                    {localSelectedSoftware?.name}
                </span>
              </div>
            )}
          </div>
          <Button
            size="lg"
            variant="default"
            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!localSelectedSoftware?.id}
            onClick={() => {
              if(!isLoggedIn) {
                openAuthModal();
                return;
              }
              // Set the selected software in the store when continuing
              if (localSelectedSoftware) {
                setSelectedSoftware(localSelectedSoftware);
              }
              setShowStepper && setShowStepper(false);
              setCurrentStep(2);
            }}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectSoftware;
