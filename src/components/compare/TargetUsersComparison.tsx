import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { CompareProduct } from "@/store/useCompareStore";

interface TargetUsersComparisonProps {
  products: CompareProduct[];
  className?: string;
}

export default function TargetUsersComparison({ products, className }: TargetUsersComparisonProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (productId: string, section: string) => {
    const key = `${productId}-${section}`;
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderDataWithViewAll = (
    data: any[], 
    productId: string, 
    section: string, 
    maxItems: number = 20
  ) => {
    const key = `${productId}-${section}`;
    const isExpanded = expandedSections[key];
    const displayData = isExpanded ? data : data.slice(0, maxItems);
    const hasMore = data.length > maxItems;

    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {displayData.map((item: any, index: number) => (
            <Badge key={index} variant="secondary" className="bg-gray-100 text-xs">
              {typeof item === 'string' ? item : item?.name || 'Unknown'}
            </Badge>
          ))}
        </div>
        {hasMore && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleSection(productId, section)}
            className="!text-xs  p-4 rounded-full"
          >
            {isExpanded ? 'Show Less' : `View All (+${data.length-maxItems})`}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className={cn("bg-blue-50 rounded-lg border overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="text-left p-3 sm:p-4 font-medium text-gray-700 w-1/4 bg-blue-50 border-b border-blue-100 border-r">
                Target Users & Industries
              </th>
              {products.map((product) => (
                <th
                  key={product.id}
                  className="text-center p-3 sm:p-4 font-semibold bg-blue-50 border-b border-blue-100 w-1/4 border-r"
                >
                  {product.name}
                </th>
              ))}
              {products.length < 3 && [...Array(3 - products.length)].map((_, index) => (
                <th key={`empty-${index}`} className="text-center p-3 sm:p-4 bg-blue-50 border-b border-blue-100 w-1/4 border-r">
                  {/* Empty header */}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {/* Who Can Use Row */}
            <tr className="border-t">
              <td className="p-3 sm:p-4 font-medium text-gray-700 align-top w-1/4 border-r">
                Who Can Use
              </td>
              {products.map((product) => (
                <td key={product.id} className="p-3 sm:p-4 text-left align-top w-1/4 border-r">
                  {product?.whoCanUse && Array.isArray(product.whoCanUse) && product.whoCanUse.length > 0 ? (
                    renderDataWithViewAll(product.whoCanUse, product.id, 'whoCanUse')
                  ) : (
                    <span className="text-gray-400 italic text-sm">
                      No data available
                    </span>
                  )}
                </td>
              ))}
              {products.length < 3 && [...Array(3 - products.length)].map((_, index) => (
                <td key={`empty-who-${index}`} className="p-3 sm:p-4 text-center align-top w-1/4 border-r">
                  <span className="text-gray-300 italic text-sm">
                    No product selected
                  </span>
                </td>
              ))}
            </tr>

            {/* Industries Row */}
            <tr className="border-t">
              <td className="p-3 sm:p-4 font-medium text-gray-700 align-top w-1/4 border-r">
                Industries
              </td>
              {products.map((product) => (
                <td key={product.id} className="p-3 sm:p-4 text-left align-top w-1/4 border-r">
                  {product?.industries && Array.isArray(product.industries) && product.industries.length > 0 ? (
                    renderDataWithViewAll(product.industries, product.id, 'industries')
                  ) : (
                    <span className="text-gray-400 italic text-sm">
                      No data available
                    </span>
                  )}
                </td>
              ))}
              {products.length < 3 && [...Array(3 - products.length)].map((_, index) => (
                <td key={`empty-industries-${index}`} className="p-3 sm:p-4 text-center align-top w-1/4 border-r">
                  <span className="text-gray-300 italic text-sm">
                    No product selected
                  </span>
                </td>
              ))}
            </tr>

            {/* Market Segment Row */}
            <tr className="border-t">
              <td className="p-3 sm:p-4 font-medium text-gray-700 align-top w-1/4 border-r">
                Market Segment
              </td>
              {products.map((product) => (
                <td key={product.id} className="p-3 sm:p-4 text-left align-top w-1/4 border-r">
                  {product?.marketSegment && Array.isArray(product.marketSegment) && product.marketSegment.length > 0 ? (
                    renderDataWithViewAll(product.marketSegment, product.id, 'marketSegment')
                  ) : (
                    <span className="text-gray-400 italic text-sm">
                      No data available
                    </span>
                  )}
                </td>
              ))}
              {products.length < 3 && [...Array(3 - products.length)].map((_, index) => (
                <td key={`empty-segment-${index}`} className="p-3 sm:p-4 text-center align-top w-1/4">
                  <span className="text-gray-300 italic text-sm">
                    No product selected
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 