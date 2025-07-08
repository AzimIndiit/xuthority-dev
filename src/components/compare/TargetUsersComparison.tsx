import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { CompareProduct } from "@/store/useCompareStore";

interface TargetUsersComparisonProps {
  products: CompareProduct[];
  className?: string;
}

export default function TargetUsersComparison({ products, className }: TargetUsersComparisonProps) {
  return (
    <div className={cn("bg-blue-50 rounded-lg overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border">
          <thead>
            <tr>
              <th className="text-left p-3 sm:p-4 font-medium text-gray-700 w-1/4 bg-blue-50 border-b border-blue-100 ">
                Target Users & Industries
              </th>
              {products.map((product) => (
                <th
                  key={product.id}
                  className="text-center p-3 sm:p-4 font-semibold bg-blue-50 border-b border-blue-100 w-1/4"
                >
                  {product.name}
                </th>
              ))}
              {products.length < 3 && [...Array(3 - products.length)].map((_, index) => (
                <th key={`empty-${index}`} className="text-center p-3 sm:p-4 bg-blue-50 border-b border-blue-100 w-1/4">
                  {/* Empty header */}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {/* Who Can Use Row */}
            <tr className="border-t">
              <td className="p-3 sm:p-4 font-medium text-gray-700 align-top w-1/4">
                Who Can Use
              </td>
              {products.map((product) => (
                <td key={product.id} className="p-3 sm:p-4 text-left align-top w-1/4">
                  <div className="flex flex-wrap gap-2">
                    {product?.whoCanUse && Array.isArray(product.whoCanUse) && product.whoCanUse.length > 0 ? (
                      product.whoCanUse.map((user: any, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-gray-100 text-xs">
                          {typeof user === 'string' ? user : user?.name || 'Unknown'}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400 italic text-sm">
                        No data available
                      </span>
                    )}
                  </div>
                </td>
              ))}
              {products.length < 3 && [...Array(3 - products.length)].map((_, index) => (
                <td key={`empty-who-${index}`} className="p-3 sm:p-4 text-center align-top w-1/4">
                  <span className="text-gray-300 italic text-sm">
                    No product selected
                  </span>
                </td>
              ))}
            </tr>

            {/* Industries Row */}
            <tr className="border-t">
              <td className="p-3 sm:p-4 font-medium text-gray-700 align-top w-1/4">
                Industries
              </td>
              {products.map((product) => (
                <td key={product.id} className="p-3 sm:p-4 text-left align-top w-1/4">
                  <div className="flex flex-wrap gap-2">
                    {product?.industries && Array.isArray(product.industries) && product.industries.length > 0 ? (
                      product.industries.map((industry: any, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-gray-100 text-xs">
                          {typeof industry === 'string' ? industry : industry?.name || 'Unknown'}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400 italic text-sm">
                        No data available
                      </span>
                    )}
                  </div>
                </td>
              ))}
              {products.length < 3 && [...Array(3 - products.length)].map((_, index) => (
                <td key={`empty-industries-${index}`} className="p-3 sm:p-4 text-center align-top w-1/4">
                  <span className="text-gray-300 italic text-sm">
                    No product selected
                  </span>
                </td>
              ))}
            </tr>

            {/* Market Segment Row */}
            <tr className="border-t">
              <td className="p-3 sm:p-4 font-medium text-gray-700 align-top w-1/4">
                Market Segment
              </td>
              {products.map((product) => (
                <td key={product.id} className="p-3 sm:p-4 text-left align-top w-1/4">
                  <div className="flex flex-wrap gap-2">
                    {product?.marketSegment && Array.isArray(product.marketSegment) && product.marketSegment.length > 0 ? (
                      product.marketSegment.map((segment: any, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-gray-100 text-xs">
                          {typeof segment === 'string' ? segment : segment?.name || 'Unknown'}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400 italic text-sm">
                        No data available
                      </span>
                    )}
                  </div>
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