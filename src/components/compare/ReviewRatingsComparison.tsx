import { cn } from "@/lib/utils";
import StarRating from "@/components/ui/StarRating";
import type { CompareProduct } from "@/store/useCompareStore";

interface ReviewRatingsComparisonProps {
  products: CompareProduct[];
  className?: string;
}

export default function ReviewRatingsComparison({ products, className }: ReviewRatingsComparisonProps) {
  return (
    <div className={cn("bg-blue-50 rounded-lg border overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead  >
            <tr>
              <th className="text-left p-3 sm:p-4 font-medium text-gray-700  bg-blue-50 border-b border-blue-100 w-1/4 border-r">
                Review and Ratings
              </th>
              {products.map((product) => (
                <th
                  key={product.id}
                  className="text-center p-3 sm:p-4 font-semibold bg-blue-50 border-b border-blue-100 border-r w-1/4"
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
            <tr className="border-t">
              <td className="p-3 sm:p-4 font-medium text-gray-700 w-1/4 border-r">Ratings</td>
              {products.map((product) => {
                return (
                  <td key={product.id} className="p-3 sm:p-4 text-center w-1/4 border-r">
                    <div className="flex flex-col items-center gap-2">
                      <StarRating rating={product?.avgRating} size="md"  />
                      <span className="text-sm sm:text-base font-medium">
                        {product?.avgRating?.toFixed(1)} out of 5
                      </span>
                    </div>
                  </td>
                )
              })}
              {products.length < 3 && [...Array(3 - products.length)].map((_, index) => (
                <td key={`empty-${index}`} className="p-3 sm:p-4 text-center w-1/4 ">
                  <div className="flex flex-col items-center gap-2">
                    {/* <StarRating rating={0} size="md" showEmpty /> */}
                    <div className="text-gray-300 italic text-sm ">No Product Selected</div>
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-t">
              <td className="p-3 sm:p-4 font-medium text-gray-700 w-1/4 border-r">Review Counts</td>
              {products.map((product) => (
                <td key={product.id} className="p-3 sm:p-4 text-center text-sm border-r">
                  <span className="text-lg font-semibold">{product?.totalReviews}</span>
                </td>
              ))}
              {products.length < 3 && [...Array(3 - products.length)].map((_, index) => (
                <td key={`empty-${index}`} className="p-3 sm:p-4 text-center w-1/4">
                  <div className="text-gray-300 italic text-sm ">No Product Selected</div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 