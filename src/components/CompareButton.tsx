import { Button } from "./ui/button";
import { X } from "lucide-react";
import useCompareStore, { MIN_COMPARE_PRODUCTS } from "@/store/useCompareStore";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function CompareButton() {
  const { products, clearProducts, removeProduct } = useCompareStore();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  
  const canCompare = products.length >= MIN_COMPARE_PRODUCTS;
  
  useEffect(() => {
    if (products.length > 0) {
      setIsVisible(true);
    } else {
      const timeout = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [products.length]);
  
  const handleCompare = () => {
    if (canCompare) {
      navigate(`/product-compare`);
    }
  };
  
  if (!isVisible && products.length === 0) return null;
  
  return (
    <div
      className={cn(
        "fixed bottom-3 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 w-[calc(100%-1.5rem)] sm:w-auto max-w-[600px]",
        products.length > 0 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-20 pointer-events-none"
      )}
    >
      <div className="bg-white rounded-full shadow-lg border px-3 sm:px-6 py-2 sm:py-3 flex items-center gap-2 sm:gap-4">
        {/* Product Logos */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="relative group animate-in zoom-in-50 duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center border-2 border-gray-200 overflow-hidden transition-all group-hover:border-red-400"
                style={{ backgroundColor: product.logoBackground }}
              >
                <img
                  src={product.logo}
                  alt={product.name}
                  className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                />
              </div>
              {/* Individual remove button on hover - hidden on mobile */}
              <button
                onClick={() => removeProduct(product.id)}
                className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full items-center justify-center hidden sm:hidden sm:group-hover:flex transition-all hover:scale-110"
                aria-label={`Remove ${product.name}`}
              >
                <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
              </button>
            </div>
          ))}
          
          {/* Empty slots for remaining products */}
          {[...Array(3 - products.length)].map((_, index) => (
            <div
              key={`empty-${index}`}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center animate-in fade-in duration-300"
              style={{ animationDelay: `${(products.length + index) * 50}ms` }}
            >
              <span className="text-gray-400 text-xs">+</span>
            </div>
          ))}
        </div>
        
        {/* Remove All Button */}
        <Button
          onClick={clearProducts}
          variant="ghost"
          className="text-gray-600 hover:text-red-500 font-medium text-sm px-3 py-1.5 transition-colors"
        >
          Remove All
        </Button>
        
        {/* Compare Now Button */}
        <Button
          onClick={handleCompare}
          disabled={!canCompare}
          className={cn(
            "rounded-full px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-all flex-shrink-0 h-10",
            canCompare
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          )}
        >
          <span className="hidden sm:inline">Compare Now </span>
          <span className="sm:hidden">Compare </span>
          ({products.length})
        </Button>
      </div>
    </div>
  );
} 