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

const SelectSoftware = ({
  setShowStepper,
}: {
  setShowStepper?: (show: boolean) => void;
}) => {
  const { isLoggedIn } = useUserStore();
  const openAuthModal = useUIStore((state) => state.openAuthModal);
  const { selectedSoftware, setSelectedSoftware,resetReview } = useReviewStore();
  const setCurrentStep = useReviewStore((state) => state.setCurrentStep);
  const { options: softwareOptions, isLoading: softwareLoading } = useSoftwareOptions();
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  useEffect(() => {
    setCurrentStep(1);
    resetReview();
  }, []); 

  // Fetch products with search query
  const { data, isLoading } = useProductsByCategory(
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

  return (
    <div className="space-y-8">
      {selectedSoftware && (
        <div className="sm:hidden block">
          <button
            onClick={() => {
              setShowStepper && setShowStepper(true);
              setSelectedSoftware(null);
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

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* No results state */}
      {!isLoading && products.length === 0 && searchQuery && (
        <div className="text-center py-8">
          <p className="text-gray-500">No software found for "{searchQuery}"</p>
          <p className="text-sm text-gray-400 mt-2">Try searching with different keywords</p>
        </div>
      )}

      {/* Products grid */}
      {!isLoading && products.length > 0 && (
        <RadioGroup
          value={selectedSoftware?.id || ""}
          onValueChange={(value) => {
            const software = products.find((s) => s._id === value);
            if (software) {
              setSelectedSoftware({ 
                id: software._id, 
                name: software.name, 
                logoUrl: software.logoUrl || "" 
              });
            }
          }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 gap-y-10">
            {products.map((software) => (
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
                  isSelected={selectedSoftware?.id === software._id}
                />
              </label>
            ))}
          </div>
        </RadioGroup>
      )}

      {/* Footer */}
      <div className="mt-12">
        <div className="flex justify-between items-center gap-2">
          <div>
            {selectedSoftware?.id && (
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-14 h-14 rounded-lg border-2 border-red-500 bg-red-50 flex items-center justify-center">
                    <img
                      src={selectedSoftware?.logoUrl}
                      alt={selectedSoftware?.name}
                      className="w-10 h-10 object-contain rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSoftware(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 cursor-pointer bg-gray-400 text-white rounded-full flex items-center justify-center text-xs shadow hover:bg-gray-500"
                    aria-label="Remove selection"
                  >
                    ×
                  </button>
                </div>
                <span className="ml-4 font-bold text-lg capitalize">
                    {selectedSoftware?.name}
                </span>
              </div>
            )}
          </div>
          <Button
            size="lg"
            variant="default"
            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!selectedSoftware?.id}
            onClick={() => {
              if(!isLoggedIn) {
                openAuthModal();
                return;
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
