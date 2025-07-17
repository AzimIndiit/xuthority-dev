import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { CompareProduct } from "@/store/useCompareStore";

interface KeyFeaturesComparisonProps {
  products: CompareProduct[];
  className?: string;
}

export default function KeyFeaturesComparison({ products, className }: KeyFeaturesComparisonProps) {
  // Only show up to 2 products for side-by-side comparison
  const visibleProducts = products;

  return (
    <div className={cn("bg-blue-50 rounded-lg border overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr>
              <th className="text-left p-3 sm:p-4 font-medium text-gray-700 w-1/4 bg-blue-50 border-b border-blue-100 border-r">
                Key Features
              </th>
              {visibleProducts.map((product) => (
                <th
                  key={product.id}
                  className="text-center p-3 sm:p-4 font-semibold bg-blue-50 border-b border-blue-100 w-1/4 border-r"
                >
                  {product.name}
                </th>
              ))}
              {/* Empty columns for up to 2 products */}
              {visibleProducts.length < 2 &&
                [...Array(2 - visibleProducts.length)].map((_, idx) => (
                  <th
                    key={`empty-header-${idx}`}
                    className="text-center p-3 sm:p-4 bg-blue-50 border-b border-blue-100 w-1/4 border-r"
                  ></th>
                ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            <tr className="border-t">
              <td className="p-3 sm:p-4 font-medium text-gray-700 align-top w-1/4 border-r">
                Features
              </td>
              {visibleProducts.map((product,index) => {
                console.log('product features', product.features, 'type:', typeof product.features, 'length:', product.features?.length, 'index:', index)
                
                // Check if features exist and have valid data
                const hasValidFeatures = product.features && 
                  Array.isArray(product.features) && 
                  product.features.length > 0 &&
                  product.features.some(category => 
                    category?.title && 
                    category?.description && 
                    Array.isArray(category.description) && 
                    category.description.length > 0
                  );

                return (
                  <td key={product.id} className="p-3 sm:p-4 text-left align-top w-1/4 border-r">
                    {hasValidFeatures ? (
                      <ul className="space-y-2">
                        {product.features.map((category, catIdx) => {
                          // Skip categories without valid data
                          if (!category?.title || !category?.description || !Array.isArray(category.description) || category.description.length === 0) {
                            return null;
                          }
                          
                          return (
                            <li key={catIdx}>
                              <div className="font-semibold text-gray-900 mb-1 text-sm">
                                {category.title}
                              </div>
                              <ul className="ml-3 list-disc space-y-1">
                                {category.description.map((feature, featureIdx) => {
                                  // Skip features without value
                                  if (!feature?.value) {
                                    return null;
                                  }
                                  
                                  return (
                                    <li
                                      key={featureIdx}
                                      className="text-gray-700 text-sm"
                                      style={{ listStyleType: "disc" }}
                                    >
                                      {feature.value}
                                    </li>
                                  );
                                })}
                              </ul>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className="flex items-center justify-center ">
                        <span className="text-gray-300  italic text-sm font-medium">
                          No features available
                        </span>
                      </div>
                    )}
                  </td>
                )
              })}
               {visibleProducts.length < 3 && [...Array(3 - visibleProducts.length)].map((_, index) => (
                <td key={`empty-pricing-${index}`} className="p-3 sm:p-4 text-center align-top w-1/4 border-r">
                  <span className="text-gray-300 italic text-sm">
                    No product selected
                  </span>
                </td>
              ))}
              {/* Empty columns for up to 2 products */}
              {visibleProducts.length < 3 &&
                [...Array(2 - visibleProducts.length)].map((_, idx) => (
                  <td
                    key={`empty-features-${idx}`}
                    className="p-3 sm:p-4 text-center align-top w-1/4 "
                  >
                    <div className="text-gray-300 italic text-sm ">
                      No product selected
                    </div>
                  </td>
                ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}