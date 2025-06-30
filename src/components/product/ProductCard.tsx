import React from 'react';
import { Product } from '../../services/product';
import StarRating from '../ui/StarRating';
import { Card } from '../ui/card';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const industries = Array.isArray(product.industries)
    ? product.industries.map((i:any) => i.name).join(', ')
    : 'N/A';

  const marketSegment = Array.isArray(product.marketSegment)
    ? product.marketSegment.map((m:any) => m.name).join(', ')
    : 'N/A';

  const users = Array.isArray(product.whoCanUse)
    ? product.whoCanUse.map((u:any) => u.name).join(', ')
    : 'N/A';

  return (
    <Card className="relative flex flex-col h-full p-4 bg-white rounded-xl shadow border border-gray-200">
      {/* Floating Logo */}
      <div className="absolute -top-6 left-4 z-10">
        <div className="w-14 h-14 rounded-md bg-white flex items-center justify-center border border-gray-100 shadow">
          {product.logoUrl ? (
            <img src={product.logoUrl} alt={product.name} className="w-10 h-10 object-contain rounded-md" />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-md" />
          )}
        </div>
      </div>
      <div className="pt-10 flex-1 flex flex-col">
        <h3 className="font-semibold text-base sm:text-lg md:text-xl text-gray-900 mb-1 mt-1 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <StarRating rating={product.avgRating} />
          <span className="text-gray-600 text-xs">
            ({product.totalReviews}) {product.avgRating} out of 5
          </span>
        </div>
        <div className="font-semibold text-sm mb-1">Product Description</div>
        <div className="text-xs text-gray-700 line-clamp-3 mb-2">
          {product.description}
        </div>
        {/* Other Info */}
        <div className="mt-auto text-xs text-gray-600 space-y-1">
          <div><b>Users:</b> {users}</div>
          <div><b>Industries:</b> {industries}</div>
          <div><b>Market Segment:</b> {marketSegment}</div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
