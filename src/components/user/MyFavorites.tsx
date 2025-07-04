import React, { useState, useMemo } from 'react';
import { useFavoriteLists, useFavoriteListProducts } from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import LottieLoader from '@/components/LottieLoader';
import { 
  CreateListModal, 
  DeleteConfirmModal, 
  ListActionsDropdown 
} from '@/components/ui';

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
    productCount: number;
  } | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [allLists, setAllLists] = useState<any[]>([]);
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

  const ITEMS_PER_PAGE = 10;

  // Fetch user's favorite lists with pagination
  const { data: favoritesData, isLoading, error, refetch, isFetching } = useFavoriteLists({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  // Fetch products for the selected list when editing
  const { data: editListProducts, isLoading: editListProductsLoading } = useFavoriteListProducts(
    showEditDialog && selectedList?.name ? selectedList.name : '',
    { page: 1, limit: 100 } // Get all products for editing
  );

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

  const handleListClick = (listName: string) => {
    navigate(`/profile/favorites/${encodeURIComponent(listName)}`);
  };

  const handleCreateSuccess = () => {
    handleRefetch();
  };

  const handleEditSuccess = () => {
    handleRefetch();
  };

  const handleDeleteSuccess = () => {
    handleRefetch();
  };

  const handleEditClick = (listName: string, productCount: number) => {
    setSelectedList({ name: listName, productCount });
    setShowEditDialog(true);
  };

  const handleDeleteClick = (listName: string, productCount: number) => {
    setSelectedList({ name: listName, productCount });
    setShowDeleteDialog(true);
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  // Check if there are more lists to load
  const hasMoreLists = favoritesData?.pagination?.currentPage < favoritesData?.pagination?.totalPages;

  // Prepare existing products for edit modal
  const existingProducts = React.useMemo(() => {
    if (!editListProducts?.products) return [];
    
    return editListProducts.products.map(product => ({
      productId: product.productId,
      name: product.name,
      logoUrl: product.logoUrl,
      brandColors: product.brandColors
    }));
  }, [editListProducts]);

  const getProductIcon = (logoUrl?: string, name?: string) => {
    if (logoUrl) {
      return (
        <img 
          src={logoUrl} 
          alt={name} 
          className="w-full h-full object-cover rounded-lg"
          onError={(e) => {
            e.currentTarget.src = '';
            e.currentTarget.style.display = 'none';
          }}
        />
      );
    }
    
    // Fallback to first letter of product name
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
        {name?.charAt(0).toUpperCase() || '?'}
      </div>
    );
  };

  if (isLoading && !hasLoadedInitial) {
    return (
      <div className={cn("flex items-center justify-center py-20", className)}>
        <LottieLoader size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("text-center py-20", className)}>
        <p className="text-lg text-gray-500">Failed to load favorites. Please try again.</p>
      </div>
    );
  }

  return (
    <div className={cn("max-w-7xl mx-auto", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
        
        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mostRecent">Most Recent</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
              <SelectItem value="mostProducts">Most Products</SelectItem>
            </SelectContent>
          </Select>

          {/* Create New List Button */}
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New List
          </Button>
        </div>
      </div>

      {/* Favorite Lists */}
      {sortedLists.length === 0 && hasLoadedInitial ? (
        <div className="text-center py-20">
          <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Star className="w-16 h-16 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No favorites yet</h3>
          <p className="text-gray-500 mb-6">Start saving products you love to organize them in lists</p>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate('/software')}
          >
            Browse Products
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedLists.map((list) => (
              <Card
                key={list.listName}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200 p-0 gap-0"
                onClick={() => handleListClick(list.listName)}
              >
                {/* Header with background */}
                <div className="bg-blue-100 rounded-t-2xl p-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 m-0">{list.listName}</h2>
                  <div onClick={(e) => e.stopPropagation()}>
                    <ListActionsDropdown
                      onEdit={() => handleEditClick(list.listName, list.totalProducts)}
                      onDelete={() => handleDeleteClick(list.listName, list.totalProducts)}
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
                      {list.products.slice(0, 3).map((product) => (
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

                  {/* View All Link */}
                  {list.products.length > 3 && (
                    <div className="text-center mt-2 mb-1">
                      <button
                        className="text-blue-600 hover:text-blue-700 font-medium text-base underline underline-offset-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleListClick(list.listName);
                        }}
                      >
                        View All
                      </button>
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
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-3"
              >
                {isFetching ? 'Loading...' : 'Load More Lists'}
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
            existingProducts={existingProducts}
          />

          <DeleteConfirmModal
            isOpen={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            listName={selectedList.name}
            productCount={selectedList.productCount}
            onSuccess={handleDeleteSuccess}
          />
        </>
      )}
    </div>
  );
};

export default MyFavorites; 