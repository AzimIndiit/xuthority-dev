import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { CompareProduct } from "@/store/useCompareStore";

interface SummaryComparisonProps {
  products: CompareProduct[];
  className?: string;
}

export default function SummaryComparison({ products, className }: SummaryComparisonProps) {
  // Truncate description to a specific length
  const truncateDescription = (text: string, maxLength: number = 300) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  return (
      <div className={cn("bg-blue-50 rounded-lg border overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="text-left p-3 sm:p-4 font-medium text-gray-700 w-1/4 bg-blue-50 border-b border-blue-100 border-r">
                Summary
              </th>
              {products.map((product) => (
                <th
                  key={product.id}
                  className="text-center p-3 sm:p-4 font-semibold bg-blue-50 border-b border-blue-100 border-r"
                >
                  {product.name}
                </th>
              ))}
              {products.length < 3 && [...Array(3 - products.length)].map((_, index) => (
                <th key={`empty-${index}`} className="text-center p-3 sm:p-4 bg-blue-50 border-b border-blue-100 border-r">
                  {/* Empty header */}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {/* Product Description Row */}
            <tr className="border-t">
              <td className="p-3 sm:p-4 font-medium text-gray-700 align-top border-r">
                Description
              </td>
              {products.map((product) => (
                <td key={product.id} className="p-3 sm:p-4 text-left align-top w-1/4 border-r">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {product.description.length > 300 ? (
                        <>
                          {truncateDescription(product.description, 300)}
                          <Link 
                            to={`/product-detail/${product.slug}`} 
                            className="text-blue-600 hover:text-blue-700 font-medium ml-1"
                          >
                            Read More
                          </Link>
                        </>
                      ) : (
                        product.description
                      )}
                    </p>
                  </div>
                </td>
              ))}
              {products.length < 3 && [...Array(3 - products.length)].map((_, index) => (
                <td key={`empty-desc-${index}`} className="p-3 sm:p-4 text-center align-top w-1/4 border-r">
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