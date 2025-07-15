import { cn } from "@/lib/utils";
import StarRating from "@/components/ui/StarRating";
import type { CompareProduct } from "@/store/useCompareStore";

interface ReviewRatingsComparisonProps {
  products: CompareProduct[];
  className?: string;
}

export default function ReviewRatingsComparison({ products, className }: ReviewRatingsComparisonProps) {
  return (
    <div className={cn("bg-blue-50 rounded-lg overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border">
          <thead>
            <tr>
              <th className="text-left p-3 sm:p-4 font-medium text-gray-700 w-1/4 bg-blue-50 border-b border-blue-100 w-1/4">
                Review and Ratings
              </th>
              {products.map((product) => (
                <th
                  key={product.id}
                  className="text-center p-3 sm:p-4 font-semibold bg-blue-50 border-b border-blue-100"
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
              <td className="p-3 sm:p-4 font-medium text-gray-700 w-1/4">Ratings</td>
              {products.map((product) => {
                return (
                  <td key={product.id} className="p-3 sm:p-4 text-center w-1/4">
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
                <td key={`empty-${index}`} className="p-3 sm:p-4 text-center w-1/4">
                  <div className="flex flex-col items-center gap-2">
                    {/* <StarRating rating={0} size="md" showEmpty /> */}
                    <span className="text-sm sm:text-base font-medium text-gray-300">
                    -
                    </span>
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-t">
              <td className="p-3 sm:p-4 font-medium text-gray-700 w-1/4">Review Counts</td>
              {products.map((product) => (
                <td key={product.id} className="p-3 sm:p-4 text-center text-sm">
                  <span className="text-lg font-semibold">{product?.totalReviews}</span>
                </td>
              ))}
              {products.length < 3 && [...Array(3 - products.length)].map((_, index) => (
                <td key={`empty-${index}`} className="p-3 sm:p-4 text-center w-1/4">
                  <span className="text-lg font-semibold text-gray-300">-</span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 