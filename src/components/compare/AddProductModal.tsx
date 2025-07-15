import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useDebounce from '@/hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@/services/api';
import useCompareStore from '@/store/useCompareStore';
import { cn } from '@/lib/utils';
import StarRating from '@/components/ui/StarRating';
import { formatCurrency } from '@/utils/formatCurrency';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  logoUrl: string;
  logoBackground?: string;
  brandColors?: string;
  avgRating: number;
  totalReviews: number;
  websiteUrl?: string;
  description?: string;
  pricing?: Array<{ 
    price: number | string;
    name?: string;
    seats?: string;
    description?: string;
    features?: Array<{ value: string }>;
  }>;
  industries?: any[];
  marketSegment?: any[];
  features?: Array<{
    title: string;
    description: Array<{ value: string }>;
  }>;
  whoCanUse?: any[];
  userId?: {
    firstName?: string;
    lastName?: string;
    companyName?: string;
  };
}

// Skeleton component for loading state
const ProductSkeleton = () => (
  <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 animate-pulse">
    <div className="w-12 h-12 rounded-lg bg-gray-200 flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
      <div className="flex items-center gap-4">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </div>
    </div>
    <div className="h-9 w-28 bg-gray-200 rounded-md" />
  </div>
);

export default function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { addProduct, products: compareProducts, isProductInCompare } = useCompareStore();

  // Fetch products based on search query
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products-search', debouncedSearchQuery],
    queryFn: async () => {
      if (!debouncedSearchQuery) {
        // Fetch all active products if no search query
        return ApiService.get<Product[]>('/products/active?limit=20&sortBy=avgRating&sortOrder=desc');
      }
      // Search products
      return ApiService.get<Product[]>(`/products/search?q=${debouncedSearchQuery}&limit=20`);
    },
    enabled: isOpen,
    staleTime: 5 * 60 * 1000,
  });

  const products = (data?.data as Product[]) || [];

  const handleAddProduct = (product: Product) => {
    // Get minimum price from pricing array
    const minPrice = Array.isArray(product.pricing) && product.pricing.length > 0
      ? Math.min(...product.pricing.map(p => Number(p.price) || 0))
      : 0;

    // Format product data for comparison
    const compareProduct = {
      id: product._id,
      logo: product.logoUrl,
      name: product.name,
      avgRating: product.avgRating || 0,
      totalReviews: product.totalReviews || 0,
      websiteUrl: product.websiteUrl || '',
      logoBackground: product.brandColors || product.logoBackground || '#f3f4f6',
      description: product.description || '',
      users: product.userId?.companyName || '', 
      industries: product.industries || [],
      marketSegment: product.marketSegment || [],
      entryPrice: product.pricing || [],
      slug: product.slug,
      features: product.features || [],
      whoCanUse: product.whoCanUse || [],
    };

    addProduct(compareProduct);
    onClose();
  };

  const isAlreadyAdded = (productId: string) => isProductInCompare(productId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden ">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add Product to Compare</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 h-12 text-base"
          />
        </div>

        {/* Products List */}
        <div className="mt-6 overflow-y-auto max-h-[calc(80vh-200px)] pr-2 min-h-[calc(80vh-200px)]">
          {(isLoading || isFetching) ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {debouncedSearchQuery 
                  ? `No products found for "${debouncedSearchQuery}"`
                  : 'No products available'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product: Product) => {
                const isAdded = isAlreadyAdded(product._id);
                const minPrice = Array.isArray(product.pricing) && product.pricing.length > 0
                  ? Math.min(...product.pricing.map(p => Number(p.price) || 0))
                  : null;

                return (
                  <div
                    key={product._id}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border transition-all",
                      isAdded 
                        ? "bg-gray-50 border-gray-300 opacity-60" 
                        : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm cursor-pointer"
                    )}
                    onClick={() => !isAdded && handleAddProduct(product)}
                  >
                    {/* Product Logo */}
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: product.brandColors || product.logoBackground || '#f3f4f6' }}
                    >
                      {product.logoUrl ? (
                        <img 
                          src={product.logoUrl} 
                          alt={product.name}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1">
                          <StarRating rating={product.avgRating || 0} size="sm" />
                          <span className="text-sm text-gray-600">
                            ({product.totalReviews || 0})
                          </span>
                        </div>
                        {minPrice !== null && (
                          <span className="text-sm text-gray-600">
                            From {formatCurrency(minPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      variant={isAdded ? "outline" : "default"}
                      size="sm"
                      className={cn(
                        "flex-shrink-0",
                        isAdded 
                          ? "bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed" 
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      )}
                      disabled={isAdded}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isAdded) handleAddProduct(product);
                      }}
                    >
                      {isAdded ? 'Added' : 'Add to Compare'}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-4 pt-4 border-t text-center text-sm text-gray-500">
          {compareProducts.length} of 3 products selected for comparison
        </div>
      </DialogContent>
    </Dialog>
  );
} 