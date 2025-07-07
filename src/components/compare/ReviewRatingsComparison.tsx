import { cn } from "@/lib/utils";
import StarRating from "@/components/ui/StarRating";

interface Product {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
}

interface ReviewRatingsComparisonProps {
  products: Product[];
  className?: string;
}

export default function ReviewRatingsComparison({ products, className }: ReviewRatingsComparisonProps) {
  return (
    <div className={cn("bg-blue-50 rounded-lg overflow-hidden", className)}>
      <h2 className="text-xl sm:text-2xl font-bold p-4 sm:p-6 pb-0">Review and Ratings</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="text-left p-4 sm:p-6 font-medium text-gray-700 w-1/4"></th>
              {products.map((product) => (
                <th key={product.id} className="text-center p-4 sm:p-6 font-semibold">
                  {product.name}
                </th>
              ))}
              {products.length < 3 && [...Array(3 - products.length)].map((_, index) => (
                <th key={`empty-${index}`} className="text-center p-4 sm:p-6">
                  {/* Empty header */}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            <tr className="border-t">
              <td className="p-4 sm:p-6 font-medium text-gray-700">Ratings</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 sm:p-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <StarRating rating={product.rating} size="md" showEmpty />
                    <span className="text-sm sm:text-base font-medium">
                      {product.rating.toFixed(1)} out of 5
                    </span>
                  </div>
                </td>
              ))}
              {products.length < 3 && [...Array(3 - products.length)].map((_, index) => (
                <td key={`empty-${index}`} className="p-4 sm:p-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <StarRating rating={0} size="md" showEmpty />
                    <span className="text-sm sm:text-base font-medium">
                      0.0 out of 5
                    </span>
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-t">
              <td className="p-4 sm:p-6 font-medium text-gray-700">Review Counts</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 sm:p-6 text-center">
                  <span className="text-lg sm:text-xl font-semibold">{product.reviewCount}</span>
                </td>
              ))}
              {products.length < 3 && [...Array(3 - products.length)].map((_, index) => (
                <td key={`empty-${index}`} className="p-4 sm:p-6 text-center">
                  <span className="text-lg sm:text-xl font-semibold">0</span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 