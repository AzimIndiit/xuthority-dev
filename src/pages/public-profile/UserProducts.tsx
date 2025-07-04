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
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Yet</h3>
                            <p className="text-gray-600">
                                {publicProfile?.userType === 'vendor' 
                                    ? 'This vendor hasn\'t added any products yet.' 
                                    : 'This user hasn\'t added any products yet.'}
                            </p>
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