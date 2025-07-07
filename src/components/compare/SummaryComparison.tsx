import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  description: string;
  slug?: string;
}

interface SummaryComparisonProps {
  products: Product[];
  className?: string;
}

export default function SummaryComparison({ products, className }: SummaryComparisonProps) {
  // Truncate description to a specific length
  const truncateDescription = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  return (
    <div className={cn("bg-white rounded-lg p-6 sm:p-8", className)}>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Summary Comparison</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="space-y-3">
            <h3 className="text-lg sm:text-xl font-semibold">{product.name}</h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Voted one of the top Global Software companies of 2023 on XUTHORITY, {product.name} is a customizable platform where teams can create and shape the tools they need to run every aspect of their work. With easy-to-use bu{" "}
              <Link 
                to={`/product-detail/${product.slug}`} 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ... Read More
              </Link>
            </p>
          </div>
        ))}
        
        {/* Empty slots */}
        {products.length < 3 && [...Array(3 - products.length)].map((_, index) => (
          <div key={`empty-${index}`} className="opacity-0">
            {/* Empty slot for alignment */}
          </div>
        ))}
      </div>
    </div>
  );
} 