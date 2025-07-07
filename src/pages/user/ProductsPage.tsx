import React, { useState } from 'react';
import { useMyProducts } from '../../hooks/useProducts';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/services/product';
import SoftwareDetailCard from '@/components/SoftwareDetailCard';
import { ArrowLeftIcon } from 'lucide-react';
import Pagination from '@/components/ui/pagination';
import SecondaryLoader from '@/components/ui/SecondaryLoader';

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
  const products = Array.isArray(productsData) ? productsData : [];
  console.log(productsData,"productsData");
  const totalPages = productsData?.pagination?.totalPages || 1;


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

      {isLoading ? (
        <SecondaryLoader text="Loading your products..." containerClasses='min-h-[60vh]' />
      ) : isError ? (
        <div className="text-center text-red-500">Failed to load products.</div>
      ) : (
        <>
          {products?.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <div className="text-lg font-semibold mb-2">No products found</div>
              <p className="text-gray-600">You haven't added any products yet.</p>
              <Button
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full"
                onClick={() => navigate('/profile/products/add-product')}
              >
                Add Your First Product
              </Button>
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
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {products?.length > 0 && totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={productsData?.pagination?.totalItems || 0}
            itemsPerPage={itemsPerPage}
            showInfo={true}
          />
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
