import React, { useState } from 'react';
import ProductCard from '../../components/product/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/services/product';
import SoftwareDetailCard from '@/components/SoftwareDetailCard';

const PAGE_SIZE = 6;

const ProductsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useProducts(page, PAGE_SIZE);
  const navigate = useNavigate();
  const products  =Array.isArray(data?.data) ? data.data : [];
  const pagination = data?.meta?.pagination;
  const totalPages = pagination?.pages ?? 1;
console.log('products', products)
  return (
    <div className="max-w-7xl mx-auto py-8 px-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button
          className="bg-blue-600 text-white px-4 py-2 rounded-full"
          onClick={() => navigate('/profile/products/add-product')}
        >
          + Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : isError ? (
        <div className="text-center text-red-500">Failed to load products.</div>
      ) : (
        <>
          {products?.length === 0 ? (
            <div className="text-center text-gray-500">No products found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 gap-y-12">
            {products.map((item, idx) => (
              <SoftwareDetailCard
                id={item._id}
                key={item.name + idx}
                name={item.name}
                logo={item.logoUrl}
                logoBackground={item.brandColors}
                rating={item.avgRating}
                reviewCount={item.totalReviews}
                description={item.description}
                users={item.whoCanUse?.map((user:any) => user.name).join(', ')}
                industries={item.industries?.map((industry:any) => industry.name).join(', ')}
                marketSegment={item.marketSegment?.map((marketSegment:any) => marketSegment.name).join(', ')}
                entryPrice={item.pricing}
                slug={item.slug}
               
              />
            ))}
          </div>
          )}
        </>
      )}

      {pagination && totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <button
            className="px-3 py-1 rounded border disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                className={`px-3 py-1 rounded border ${
                  page === pageNum ? 'bg-blue-500 text-white' : ''
                }`}
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            className="px-3 py-1 rounded border disabled:opacity-50"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
