import React, { useState } from 'react';
import { useMyProducts } from '../../hooks/useProducts';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/services/product';
import SoftwareDetailCard from '@/components/SoftwareDetailCard';
import { ArrowLeftIcon } from 'lucide-react';
import Pagination from '@/components/ui/pagination';
import SecondaryLoader from '@/components/ui/SecondaryLoader';

// Skeleton component for the header section
const HeaderSkeleton = () => (
  <div className="flex justify-between items-center mb-6 animate-pulse">
    <div className="flex items-center gap-2">
      <span className="block lg:hidden">
        <div className="w-6 h-6 bg-gray-200 rounded" />
      </span>
      <div className="h-8 bg-gray-200 rounded w-40" />
    </div>
    <div className="h-10 bg-gray-200 rounded w-32" />
  </div>
);

// Skeleton component for individual product cards
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
    <div className="flex items-start gap-4 mb-4">
      <div className="w-16 h-16 bg-gray-200 rounded-lg" />
      <div className="flex-1">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="flex items-center gap-2 mb-2">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
            ))}
          </div>
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
      </div>
    </div>
    
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-4/5" />
      <div className="h-4 bg-gray-200 rounded w-3/5" />
    </div>
    
    <div className="space-y-3 mb-4">
      <div className="flex items-center gap-2">
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="h-4 bg-gray-200 rounded w-32" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-28" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-4 bg-gray-200 rounded w-36" />
      </div>
    </div>
    
    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
      <div className="h-6 bg-gray-200 rounded w-24" />
      <div className="flex gap-2">
        <div className="h-9 bg-gray-200 rounded w-28" />
        <div className="h-9 bg-gray-200 rounded w-24" />
      </div>
    </div>
  </div>
);

// Skeleton component for the product grid
const ProductGridSkeleton = () => (
  <div className="grid grid-cols-1 gap-6 mt-12 gap-y-12">
    {[...Array(6)].map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);

// Skeleton component for pagination
const PaginationSkeleton = () => (
  <div className="mt-8">
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-40" />
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 bg-gray-200 rounded" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 w-10 bg-gray-200 rounded" />
        ))}
        <div className="h-10 w-10 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

// Main skeleton component for the entire page
const ProductsPageSkeleton = () => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-2">
      <HeaderSkeleton />
      <ProductGridSkeleton />
      <PaginationSkeleton />
    </div>
  );
};

const ProductsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { data: productsData, isLoading, isError } = useMyProducts({
    page: currentPage,
    limit: itemsPerPage,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  const navigate = useNavigate();
  
  // Handle the response structure correctly
  const products = productsData?.data || [];
  const totalPages = productsData?.meta?.pagination?.pages || 1;
  const totalItems = productsData?.meta?.pagination?.total || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show skeleton when loading
  if (isLoading) {
    return <ProductsPageSkeleton />;
  }

  // Show error state
  if (isError) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-2">
        <div className="flex justify-between items-center mb-6">
          <div className='flex items-center gap-2'>
            <span className="block lg:hidden" onClick={() => navigate(-1)}>
              <ArrowLeftIcon className="w-6 h-6" />
            </span> 
            <h1 className="text-2xl font-bold">My Products</h1>
          </div>
          <Button
            className="bg-blue-600 text-white px-4 py-2 rounded-full"
            onClick={() => navigate('/profile/products/add-product')}
          >
            + Add Product
          </Button>
        </div>
        <div className="text-center text-red-500 py-12">
          <div className="text-lg font-semibold mb-2">Failed to load products</div>
          <p className="text-gray-600">Please try refreshing the page or contact support if the issue persists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-2">
      <div className="flex justify-between items-center mb-6">
        <div className='flex items-center gap-2'>
          <span className="block lg:hidden" onClick={() => navigate(-1)}>
            <ArrowLeftIcon className="w-6 h-6" />
          </span> 
          <h1 className="text-2xl font-bold">My Products</h1>
        </div>
        <Button
          className="bg-blue-600 text-white px-4 py-2 rounded-full"
          onClick={() => navigate('/profile/products/add-product')}
        >
          + Add Product
        </Button>
      </div>

      {products?.length === 0 ? (
        <div className="text-center text-gray-500 flex flex-col items-center justify-center min-h-[50vh]">
          <img src="/svg/no_data.svg" alt="no-products" className="w-1/4 mb-4" />
          <div className="text-lg font-semibold mb-2">No products found</div>
          <p className="text-gray-600">You haven't added any products yet.</p>
        
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 mt-12 gap-y-12">
          {products.map((item: Product, idx: number) => (
            <SoftwareDetailCard
              id={item._id}
              key={item.name + idx}
              name={item.name}
              logo={item.logoUrl}
              logoBackground={item.brandColors}
              rating={item.avgRating}
              reviewCount={item.totalReviews}
              description={item.description}
              users={item.whoCanUse?.map((user: any) => user.name).join(', ')}
              industries={item.industries?.map((industry: any) => industry.name).join(', ')}
              marketSegment={item.marketSegment?.map((marketSegment: any) => marketSegment.name).join(', ')}
              entryPrice={item.pricing as any}
              slug={item.slug}
              features={item.features}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {products?.length > 0 && totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            showInfo={true}
          />
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
