import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useCompareStore from "@/store/useCompareStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, X, Check, Minus } from "lucide-react";
import StarRating from "@/components/ui/StarRating";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/lib/utils";
import { SummaryComparison, ReviewRatingsComparison, PricingComparison } from "@/components/compare";

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

  useEffect(() => {
    // Get product IDs from URL if needed
    const productIds = searchParams.get('products')?.split(',') || [];
    console.log('Product IDs from URL:', productIds);
    
    // Mock comparison data - replace with actual API call
    setComparisonData([
      {
        category: "General",
        features: [
          { name: "Rating", values: products.map(p => p.rating) },
          { name: "Reviews", values: products.map(p => p.reviewCount) },
          { name: "Entry Price", values: products.map(p => p.entryPrice) },
        ]
      },
      {
        category: "Features",
        features: [
          { name: "API Integration", values: [true, true, false] },
          { name: "Mobile App", values: [true, false, true] },
          { name: "Custom Reports", values: [true, true, true] },
          { name: "Real-time Collaboration", values: [true, true, false] },
          { name: "Automation", values: [true, false, true] },
        ]
      },
      {
        category: "Support",
        features: [
          { name: "24/7 Support", values: [true, false, true] },
          { name: "Phone Support", values: [true, true, false] },
          { name: "Live Chat", values: [true, true, true] },
          { name: "Knowledge Base", values: [true, true, true] },
        ]
      },
      {
        category: "Security",
        features: [
          { name: "Two-Factor Authentication", values: [true, true, true] },
          { name: "SSO", values: [true, false, true] },
          { name: "Data Encryption", values: [true, true, true] },
          { name: "GDPR Compliant", values: [true, true, true] },
        ]
      }
    ]);
  }, [searchParams, products]);

  const handleAddProduct = () => {
    navigate('/');
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
    <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-3xl font-bold mb-2">
          Compare {products.map(p => p.name).join(' and ')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Compare features, pricing, and more to find the best solution for your needs.
        </p>
      </div>

      {products.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center">
          <p className="text-gray-500 mb-4">No products selected for comparison.</p>
          <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
            Browse Products
          </Button>
        </Card>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
          <div className="min-w-[768px]">
            {/* Product Header Row */}
            <div className="grid grid-cols-4 border-b bg-gray-50">
              <div className="p-3 sm:p-4 font-semibold text-gray-700 text-sm sm:text-base">
                {/* Empty cell for feature names column */}
              </div>
              {products.map((product, index) => (
                <div key={product.id} className="p-3 sm:p-4 border-l relative">
                  {index === 1 && products.length > 1 && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full hidden sm:block">
                      Selected
                    </div>
                  )}
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
                        className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </button>
                    </div>
                    <h3 className="font-semibold text-sm sm:text-lg mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-2 line-clamp-1">{product.industries}</p>
                    <div className="flex items-center gap-1 mb-2 sm:mb-3">
                      <StarRating rating={product.rating} size="sm" />
                      <span className="text-xs sm:text-sm text-gray-600">({product.reviewCount})</span>
                    </div>
                    <Button
                      variant="default"
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2"
                    >
                      Try For Free
                    </Button>
                  </div>
                </div>
              ))}
              {products.length < 3 && (
                <div className="p-3 sm:p-4 border-l">
                  <button
                    onClick={handleAddProduct}
                    className="w-full h-full min-h-[150px] sm:min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors"
                  >
                    <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-2" />
                    <span className="text-sm sm:text-base text-gray-500">Add Product</span>
                  </button>
                </div>
              )}
            </div>

            {/* Comparison Features */}
            {comparisonData.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="bg-gray-100 px-3 sm:px-4 py-2 font-semibold text-sm sm:text-base text-gray-700 border-b">
                  {category.category}
                </div>
                {category.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className={cn(
                      "grid grid-cols-4 border-b hover:bg-gray-50 transition-colors",
                      featureIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    )}
                  >
                    <div className="p-3 sm:p-4 font-medium text-sm sm:text-base text-gray-700">
                      {feature.name}
                    </div>
                    {products.map((product, productIndex) => (
                      <div
                        key={product.id}
                        className="p-3 sm:p-4 border-l flex items-center justify-center"
                      >
                        {feature.name === "Rating" ? (
                          <div className="flex items-center gap-1">
                            <StarRating rating={Number(feature.values[productIndex]) || 0} size="sm" />
                            <span className="text-xs sm:text-sm text-gray-600">
                              {Number(feature.values[productIndex] || 0).toFixed(1)}
                            </span>
                          </div>
                        ) : feature.name === "Entry Price" ? (
                          <span className="font-semibold text-sm sm:text-base text-green-600">
                            {formatCurrency(
                              Array.isArray(feature.values[productIndex]) 
                                ? Math.min(...(feature.values[productIndex] as any[]).map(p => Number(p.price) || 0))
                                : 0
                            )}
                          </span>
                        ) : (
                          renderFeatureValue(feature.values[productIndex])
                        )}
                      </div>
                    ))}
                    {products.length < 3 && (
                      <div className="p-3 sm:p-4 border-l">
                        {/* Empty cell for add product column */}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {products.length > 0 && (
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Button
            variant="outline"
            onClick={clearProducts}
            className="rounded-full w-full sm:w-auto"
          >
            Clear Comparison
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 rounded-full w-full sm:w-auto"
          >
            Add More Products
          </Button>
        </div>
      )}

      {/* Additional Comparison Sections */}
      {products.length > 0 && (
        <div className="mt-8 sm:mt-12 space-y-6 sm:space-y-8">
          {/* Summary Comparison */}
          <SummaryComparison products={products} />
          
          {/* Review and Ratings */}
          <ReviewRatingsComparison products={products} />
          
          {/* Pricing Comparison */}
          <PricingComparison products={products} />
        </div>
      )}
    </div>
  );
}