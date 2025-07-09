import Pagination from '@/components/ui/pagination';
import { useUserProductsById } from '@/hooks/useProducts';
import { usePagination } from '@/hooks/usePagination';
import useUserStore from '@/store/useUserStore';
import { getTruncatedDisplayName } from '@/utils/userHelpers';
import { Package } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SoftwareDetailCard from '@/components/SoftwareDetailCard';
import useUIStore from '@/store/useUIStore';
import { useReviewStore } from '@/store/useReviewStore';
import SecondaryLoader from '@/components/ui/SecondaryLoader';
import { Card } from '@/components/ui/card';

// Skeleton loader for software detail cards
const SoftwareDetailCardSkeleton: React.FC = () => {
  return (
    <div className="relative w-full mx-auto h-full">
      {/* Floating Logo Skeleton */}
      <div className="absolute -top-8 left-4 md:left-6 z-10">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      
      <Card className="relative bg-white rounded-lg shadow p-4 md:p-6 border flex flex-col gap-2 sm:gap-3 pt-4 sm:pt-10 h-full">
        {/* Compare checkbox skeleton */}
        <div className="flex items-start gap-4">
          <div className="flex-1" />
          <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
        </div>
        
        {/* Name and Rating Skeleton */}
        <div className="flex sm:flex-row flex-col sm:items-start justify-between gap-4 mt-8">
          <div className="flex-1">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="flex items-center gap-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        
        {/* Description Skeleton */}
        <div>
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        
        {/* Other Info Skeleton */}
        <div>
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="divide-y divide-gray-200">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2 py-2">
                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse ml-1" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom Actions Skeleton */}
        <div className="flex sm:flex-row flex-col lg:items-center justify-between gap-2 mt-4">
          <div className="h-5 w-28 bg-gray-200 rounded animate-pulse" />
          <div className="flex sm:flex-row flex-col sm:items-center gap-2">
            <div className="h-10 w-40 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </Card>
    </div>
  );
};

const UserProducts = ({publicProfile}) => {
    const { isLoggedIn, user } = useUserStore();
    const navigate = useNavigate();
    const { openAuthModal } = useUIStore();
    const { setSelectedSoftware } = useReviewStore();
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;

    // Fetch user products with pagination
    const { data: productsData, isLoading: productsLoading } = useUserProductsById(publicProfile?._id, {
        page: currentPage,
        limit: itemsPerPage,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        status: 'published' // Only show published products in public profile
    });
    console.log('productsData', productsData)
    const products = Array.isArray(productsData?.data) ? productsData?.data : [];

    // Create pagination object based on fetched data
    const pagination = usePagination({
        initialPage: 1,
        initialItemsPerPage: itemsPerPage,
        totalItems: productsData?.meta?.pagination?.totalItems || 0
    });

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of products section when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };



    const handleSave = () => {
        // Handle save to list logic
        console.log('Save to list clicked');
    };

    const handleTry = () => {
        // Handle try for free logic
        console.log('Try for free clicked');
    };
    
    return (
        <div className="sm:col-span-10 lg:col-span-12 xl:col-span-13">
            <div className="">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="sm:text-xl lg:text-2xl font-bold text-gray-900">
                        {getTruncatedDisplayName(publicProfile, 10)}'s Products
                    </h2>
                </div>
                
                {/* Products Content */}
                <div className="my-6 mt-12">
                    {productsLoading ? (
                        <div className="grid grid-cols-1 gap-6 gap-y-8">
                          {[1, 2, 3].map((i) => (
                            <SoftwareDetailCardSkeleton key={i} />
                          ))}
                        </div>
                    ) : products && products?.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 gap-y-8">
                            {products.map((product: any) => (
                                <SoftwareDetailCard
                                    key={product._id}
                                    id={product._id}
                                    name={product.name}
                                    logo={product.logoUrl}
                                    logoBackground={product.brandColors}
                                    rating={product.avgRating}
                                    reviewCount={product.totalReviews}
                                    description={product.description}
                                    users={product.whoCanUse?.map((user: any) => user.name).join(', ')}
                                    industries={product.industries?.map((industry: any) => industry.name).join(', ')}
                                    marketSegment={product.marketSegment?.map((segment: any) => segment.name).join(', ')}
                                    entryPrice={product.pricing}
                                    slug={product.slug}
                                    features={product.features}
                                    onWriteReview={()=>{
                                        if(!isLoggedIn){
                                            openAuthModal();
                                            return;
                                        }
                                        setSelectedSoftware({id:product._id,name:product.name,logoUrl:product.logoUrl   });
                                        navigate('/write-review');
                                    }}
                                    onSave={handleSave}
                                    onTry={handleTry}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center  flex flex-col items-center justify-center min-h-[50vh]">
                         <img src="/svg/no_data.svg" alt="no-products" className="w-1/4 mb-4" />
                            <p className="text-gray-600">This user hasn't added any products yet.</p>
                        </div>
                    )}
                </div>
                
                {/* Pagination */}
                {products && products.length > 0 && pagination.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                            totalItems={productsData?.meta?.pagination?.totalItems}
                            itemsPerPage={itemsPerPage}
                            showInfo={true}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProducts;