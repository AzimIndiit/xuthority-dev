import React, { useState } from "react";
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

  // State for tracking expanded/collapsed state for each product
  const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({});
  const [showReadMoreForProduct, setShowReadMoreForProduct] = useState<Record<string, boolean>>({});
  const contentRefs = React.useRef<Record<string, HTMLDivElement>>({});

  // Toggle expanded state for a specific product
  const toggleExpanded = (productId: string) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Check if content needs truncation for each product
  React.useEffect(() => {
    const checkTruncation = () => {
      visibleProducts.forEach(product => {
        const element = contentRefs.current[product.id];
        if (element) {
          // Temporarily remove truncation to measure full height
          const originalStyle = element.style.cssText;
          
          // Set to full display to measure actual height
          element.style.maxHeight = 'none';
          element.style.overflow = 'visible';
          
          const maxHeight = 300; // Max height before showing read more (about 4-5 feature categories)
          const actualHeight = element.scrollHeight;
          
          // Restore original style
          element.style.cssText = originalStyle;
          
          setShowReadMoreForProduct(prev => ({
            ...prev,
            [product.id]: actualHeight > maxHeight
          }));
        }
      });
    };

    // Use setTimeout to ensure the content is rendered
    const timer = setTimeout(checkTruncation, 100);
    return () => clearTimeout(timer);
  }, [visibleProducts]);

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

                const isExpanded = expandedProducts[product.id] || false;
                const shouldShowReadMore = showReadMoreForProduct[product.id] || false;

                return (
                  <td key={product.id} className="p-3 sm:p-4 text-left align-top w-1/4 border-r">
                    {hasValidFeatures ? (
                      <div className="relative">
                        <div
                          ref={(el) => {
                            if (el) contentRefs.current[product.id] = el;
                          }}
                          style={{
                            maxHeight: !isExpanded && shouldShowReadMore ? '300px' : 'none',
                            overflow: !isExpanded && shouldShowReadMore ? 'hidden' : 'visible',
                            transition: 'max-height 0.3s ease-in-out'
                          }}
                        >
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
                        </div>
                        
                        {/* Read More/Less Button */}
                        {shouldShowReadMore && (
                          <div className="mt-3">
                            <button
                              onClick={() => toggleExpanded(product.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors inline-flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              {isExpanded ? "Read less" : "Read more"}
                              <span className="text-xs">
                                {isExpanded ? "▲" : "▼"}
                              </span>
                            </button>
                          </div>
                        )}
                        
                        {/* Gradient overlay when collapsed */}
                        {!isExpanded && shouldShowReadMore && (
                          <div 
                            className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none"
                            style={{ marginBottom: '36px' }} // Account for the read more button height
                          />
                        )}
                      </div>
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