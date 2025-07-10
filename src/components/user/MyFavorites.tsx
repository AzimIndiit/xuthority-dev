import React, { useState, useMemo } from 'react';
import { useFavoriteLists, useFavoriteListProducts, useDeleteFavoriteList } from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeftIcon, Plus, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import LottieLoader from '@/components/LottieLoader';
import { 
  CreateListModal, 
  ListActionsDropdown,
} from '@/components/ui';
import ConfirmationModal from '../ui/ConfirmationModal';

// Skeleton component for individual product items
const ProductItemSkeleton = () => (
  <div className="flex flex-col items-center animate-pulse">
    <div className="w-14 h-14 bg-gray-200 rounded-md mb-2" />
    <div className="h-3 bg-gray-200 rounded w-16" />
    <div className="h-3 bg-gray-200 rounded w-12 mt-1" />
  </div>
);

// Skeleton component for individual favorite list cards
const FavoriteListCardSkeleton = () => (
  <Card className="bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse">
    {/* Header with background */}
    <div className="bg-gray-100 rounded-t-lg p-4 flex items-center justify-between">
      <div className="h-5 bg-gray-200 rounded w-32" />
      <div className="w-6 h-6 bg-gray-200 rounded" />
    </div>
    
    <CardContent className="p-4">
      {/* Product Grid */}
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <ProductItemSkeleton key={index} />
        ))}
      </div>
      
      {/* View All Link */}
      <div className="text-center mt-2 mb-1">
        <div className="h-4 bg-gray-200 rounded w-16 mx-auto" />
      </div>
    </CardContent>
  </Card>
);

// Skeleton component for the header
const HeaderSkeleton = () => (
  <div className="flex items-center justify-between mb-8 animate-pulse">
    <div className="flex items-center gap-2">
      <div className="block lg:hidden w-6 h-6 bg-gray-200 rounded" />
      <div className="h-7 bg-gray-200 rounded w-32" />
    </div>
    <div className="h-10 bg-gray-200 rounded-full w-36" />
  </div>
);

// Skeleton component for the favorites grid
const FavoritesGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[...Array(6)].map((_, index) => (
      <FavoriteListCardSkeleton key={index} />
    ))}
  </div>
);

// Skeleton component for load more button
const LoadMoreSkeleton = () => (
  <div className="text-center mt-8 animate-pulse">
    <div className="h-12 bg-gray-200 rounded-full w-40 mx-auto" />
  </div>
);

// Complete skeleton for MyFavorites page
const MyFavoritesSkeleton = () => (
  <div className="max-w-7xl mx-auto">
    <HeaderSkeleton />
    <FavoritesGridSkeleton />
    <LoadMoreSkeleton />
  </div>
);

interface MyFavoritesProps {
  className?: string;
}

const MyFavorites: React.FC<MyFavoritesProps> = ({ className }) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('mostRecent');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedList, setSelectedList] = useState<{
    name: string;
    productIds: string[];
  } | null>(null);
  
  // Delete list mutation
  const deleteListMutation = useDeleteFavoriteList();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [allLists, setAllLists] = useState<any[]>([]);
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);
  
  // State to track expanded lists
  const [expandedLists, setExpandedLists] = useState<Set<string>>(new Set());

  const ITEMS_PER_PAGE = 10;

  // Fetch user's favorite lists with pagination
  const { data: favoritesData, isLoading, error, refetch, isFetching } = useFavoriteLists({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });
  // Accumulate lists for pagination
  React.useEffect(() => {
    if (favoritesData?.lists) {
      if (currentPage === 1) {
        // First page - replace all lists
        setAllLists(favoritesData.lists);
        setHasLoadedInitial(true);
      } else {
        // Subsequent pages - append new lists
        setAllLists(prev => [...prev, ...favoritesData.lists]);
      }
    }
  }, [favoritesData, currentPage]);

  // Reset pagination when refetching
  const handleRefetch = () => {
    setCurrentPage(1);
    setAllLists([]);
    setHasLoadedInitial(false);
    refetch();
  };

  // Sort lists based on selected criteria
  const sortedLists = useMemo(() => {
    const listsToSort = [...allLists];
    
    switch (sortBy) {
      case 'alphabetical':
        return listsToSort.sort((a, b) => a.listName.localeCompare(b.listName));
      case 'mostProducts':
        return listsToSort.sort((a, b) => b.totalProducts - a.totalProducts);
      case 'mostRecent':
      default:
        return listsToSort.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    }
  }, [allLists, sortBy]);


  const handleCreateSuccess = () => {
    handleRefetch();
  };

  const handleEditSuccess = () => {
    handleRefetch();
  };

  const handleDeleteSuccess = () => {
    if (selectedList) {
      deleteListMutation.mutate(selectedList.name, {
        onSuccess: () => {
          setShowDeleteDialog(false);
          setSelectedList(null);
          handleRefetch();
        }
      });
    }
  };

  const handleEditClick = (listName: string, productIds: string[]) => {
    setSelectedList({ name: listName, productIds });
    setShowEditDialog(true);
  };

  const handleDeleteClick = (listName: string, productIds: string[]) => {
    setSelectedList({ name: listName, productIds });
    setShowDeleteDialog(true);
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  // Toggle expanded state for a list
  const toggleListExpansion = (listName: string) => {
    setExpandedLists(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(listName)) {
        newExpanded.delete(listName);
      } else {
        newExpanded.add(listName);
      }
      return newExpanded;
    });
  };

  // Check if there are more lists to load
  const hasMoreLists = favoritesData?.pagination?.currentPage < favoritesData?.pagination?.totalPages;

  if (isLoading && !hasLoadedInitial) {
    return (
      <div className={cn("", className)}>
        <MyFavoritesSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("max-w-7xl mx-auto", className)}>
        <div className="flex items-center justify-between mb-8">
          <div className='flex items-center gap-2'> 
            <span className="block lg:hidden" onClick={() => navigate(-1)}>
              <ArrowLeftIcon className="w-6 h-6" />
            </span>
            <h1 className="sm:text-2xl text-xl font-bold text-gray-900">My Favorites</h1>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Favorites</h3>
          <p className="text-gray-600 mb-4 text-center max-w-md">
            Something went wrong while loading your favorites. Please try again.
          </p>
          <button
            onClick={() => handleRefetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("max-w-7xl mx-auto", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
      <div className='flex items-center gap-2'> 
      <span className="block lg:hidden" onClick={() => navigate(-1)}>
            {" "}
            <ArrowLeftIcon className="w-6 h-6" />
          </span>
      <h1 className=" sm:text-2xl text-xl font-bold text-gray-900">My Favorites</h1>
      </div>
        
        <div className="flex items-center gap-4">
   

          {/* Create New List Button */}
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full !text-sm h-10"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="w-2 h-2" />
            Create New List
          </Button>
        </div>
      </div>

      {/* Favorite Lists */}
      {sortedLists.length === 0 && hasLoadedInitial ? (
        <div className="text-center py-20">
           <img src="/svg/no_data.svg" alt="no-favorites" className="w-1/4 mx-auto mb-6" />
          <p className="text-lg font-semibold text-gray-500 mb-2">No favorites yet</p>
   
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedLists.map((list) => (
              <Card
                key={list.listName}
                className="bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200 p-0 gap-0"
          
              >
                {/* Header with background */}
                <div className="bg-blue-100 rounded-t-lg p-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 m-0">{list.listName}</h2>
                  <div onClick={(e) => e.stopPropagation()}>
                    <ListActionsDropdown
                      onEdit={() => handleEditClick(list.listName, list.products.map(product => product.productId))}
                      onDelete={() => handleDeleteClick(list.listName, list.products.map(product => product.productId))}
                    />
                  </div>
                </div>
                <CardContent className="p-4">
                  {/* Product Grid */}
                  {list.products.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No products in this list yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-4 ">
                      {(expandedLists.has(list.listName) ? list.products : list.products.slice(0, 3)).map((product) => (
                        <div key={product.productId} className="flex flex-col items-center">
                          {/* Product Icon with soft background */}
                          <div className=" cursor-pointer" >
                            <div className={`w-14 h-14 rounded-md  flex items-center justify-center  border border-white`} style={{ backgroundColor: product.brandColors }}>
                              <img src={product.logoUrl} alt={product.name} className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-md" />
                            </div>
                          </div>
                          {/* Product Name */}
                          <span className="text-sm font-medium text-gray-900 text-center leading-tight mt-2 line-clamp-2">
                            {product.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* View All/View Less Link */}
                  {list.totalProducts > 3 && (
                    <div className="text-center mt-2 mb-1">
                      <Button
                        className="text-red-500 border border-red-500 bg-white hover:bg-red-50 hover:text-red-600 font-medium rounded-full !text-sm px-4 py-2 h-10 mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleListExpansion(list.listName);
                        }}
                      >
                        {expandedLists.has(list.listName) ? 'View Less' : 'View All'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          {hasMoreLists && (
            <div className="text-center mt-8">
              <Button
                onClick={handleLoadMore}
                disabled={isFetching}
                loading={isFetching}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-3"
              >
                Load More Lists
              </Button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <CreateListModal
        isOpen={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleCreateSuccess}
        mode="create"
      />

      {selectedList && (
        <>
          <CreateListModal
            isOpen={showEditDialog}
            onOpenChange={setShowEditDialog}
            onSuccess={handleEditSuccess}
            mode="edit"
            existingListName={selectedList.name}
            existingProductIds={selectedList.productIds}
          />

          <ConfirmationModal
            isOpen={showDeleteDialog}
            onOpenChange={(open) => !deleteListMutation.isPending && setShowDeleteDialog(open)}
            onConfirm={handleDeleteSuccess}
            title="Delete List"
            description="Are you sure you want to delete this list? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            isLoading={deleteListMutation.isPending}
          />
        </>
      )}
    </div>
  );
};

export default MyFavorites; 