import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useCompareStore from "@/store/useCompareStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, X, Check, Minus } from "lucide-react";
import StarRating from "@/components/ui/StarRating";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/lib/utils";
import { SummaryComparison, ReviewRatingsComparison, PricingComparison, TargetUsersComparison, KeyFeaturesComparison, AddProductModal } from "@/components/compare";

interface ComparisonFeature {
  category: string;
  features: {
    name: string;
    values: (string | boolean | number | null | any)[];
  }[];
}

export default function ComparePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products, removeProduct, clearProducts } = useCompareStore();
  const [comparisonData, setComparisonData] = useState<ComparisonFeature[]>([]);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // Validate and sanitize products data
  const sanitizedProducts = products.map(product => ({
    ...product,
    // Ensure these arrays contain proper data structure
    industries: Array.isArray(product.industries) ? product.industries : [],
    marketSegment: Array.isArray(product.marketSegment) ? product.marketSegment : [],
    whoCanUse: Array.isArray(product.whoCanUse) ? product.whoCanUse : [],
    features: Array.isArray(product.features) ? product.features : [],
    // Ensure entryPrice is properly structured
    entryPrice: product.entryPrice || [],
    isFree: product.isFree || false
  }));
console.log(products,"sanitizedProducts");
  const handleAddProduct = () => {
    setIsAddProductModalOpen(true);
  };

  const renderFeatureValue = (value: string | boolean | null) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <X className="w-5 h-5 text-red-500" />
      );
    }
    if (value === null || value === undefined) {
      return <Minus className="w-5 h-5 text-gray-400" />;
    }
    return value;
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl min-h-[60vh]">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-3xl font-bold mb-2">
          Compare {sanitizedProducts.map(p => p.name).join(' and ')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Compare features, pricing, and more to find the best solution for your needs.
        </p>
      </div>

      {sanitizedProducts.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center min-h-[40vh] flex flex-col items-center justify-center">
          <p className="text-gray-500 mb-4">No products selected for comparison.</p>
          <Button onClick={() => setIsAddProductModalOpen(true)} className="bg-blue-600 hover:bg-blue-700  mx-auto">
            Browse Products
          </Button>
        </Card>
      ) : (
        <div className="bg-white rounded-lg border overflow-x-auto">
          <div className="min-w-[768px]">
            {/* Product Header Row */}
            <div className="grid grid-cols-3 border-b bg-gray-50">
             
              {sanitizedProducts.map((product, index) => (
                <div key={product.id} className="p-3 sm:p-4 border-l relative">
               
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-2 sm:mb-3">
                      <div
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center mb-2"
                        style={{ backgroundColor: product.logoBackground }}
                      >
                        <img
                          src={product.logo}
                          alt={product.name}
                          className="w-8 h-8 sm:w-12 sm:h-12 object-contain"
                        />
                      </div>
                      <button
                        onClick={() => removeProduct(product.id)}
                        className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </button>
                    </div>
                    <h3 className="font-semibold text-sm sm:text-lg mb-1 line-clamp-2">{product.name}</h3>
                    <a href={product.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-gray-500 mb-2 line-clamp-1 hover:underline hover:text-blue-600 ">{product.websiteUrl.length > 30 ? product.websiteUrl.substring(0, 30) + "..." : product.websiteUrl}</a>
                  
                    <Button
                      variant="default"
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 h-10"
                    >
                      Try For Free
                    </Button>
                  </div>
                </div>
              ))}
              {sanitizedProducts.length < 3 && (
                <div className="p-3 sm:p-4 border-l">
                  <button
                    onClick={handleAddProduct}
                    className="w-full h-full min-h-[150px] sm:min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors cursor-pointer"
                  >
                    <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-2" />
                    <span className="text-sm sm:text-base text-gray-500">Add Product</span>
                  </button>
                </div>
              )}
            </div>


          </div>
        </div>
      )}

    

      {/* Additional Comparison Sections */}
      {sanitizedProducts.length > 0 && (
        <div className="mt-8 sm:mt-12 space-y-6 sm:space-y-8">
          {/* Summary Comparison */}
          <SummaryComparison products={sanitizedProducts} />
          
          {/* Review and Ratings */}
          <ReviewRatingsComparison products={sanitizedProducts} />
          
          {/* Pricing Comparison */}
          <PricingComparison products={sanitizedProducts} />
          
          {/* Key Features Comparison */}
          <KeyFeaturesComparison products={sanitizedProducts} />
          
          {/* Target Users & Industries */}
          <TargetUsersComparison products={sanitizedProducts} />
        </div>
      )}

      {/* Add Product Modal */}
      <AddProductModal 
        isOpen={isAddProductModalOpen} 
        onClose={() => setIsAddProductModalOpen(false)} 
      />
    </div>
  );
}