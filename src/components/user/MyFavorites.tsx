import React, { useState } from 'react';
import { useFavoriteLists, useCreateFavoriteList, useAddToFavorites } from '@/hooks/useFavorites';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MoreHorizontal, Plus, Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import LottieLoader from '@/components/LottieLoader';

interface MyFavoritesProps {
  className?: string;
}

const MyFavorites: React.FC<MyFavoritesProps> = ({ className }) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('mostRecent');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  // Fetch user's favorite lists
  const { data: favoritesData, isLoading, error } = useFavoriteLists();
  const createListMutation = useCreateFavoriteList();
  const addToFavoritesMutation = useAddToFavorites();

  // Fetch products for the dropdown
  const { data: productsData, isLoading: productsLoading } = useProducts(1, 50); // Get first 50 products
  const products = Array.isArray(productsData?.data) ? productsData.data : [];

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    
    try {
      // First create the list
      await createListMutation.mutateAsync(newListName.trim());
      
      // Then add the selected product to the list if one is selected
      if (selectedProduct) {
        await addToFavoritesMutation.mutateAsync({
          productId: selectedProduct,
          listName: newListName.trim()
        });
      }
      
      setNewListName('');
      setSelectedProduct('');
      setShowCreateDialog(false);
    } catch (error) {
      // Error handled by mutation hooks
    }
  };

  const handleListClick = (listName: string) => {
    // Navigate to the list detail page
    navigate(`/profile/favorites/${encodeURIComponent(listName)}`);
  };

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

  if (isLoading) {
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

  const lists = favoritesData?.lists || [];

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
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                <Plus className="w-4 h-4 mr-2" />
                Create New List
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0">
              {/* Close Button */}
              <button
                onClick={() => setShowCreateDialog(false)}
                className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>

              <div className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Create New List</h2>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Create a new list to save and organize the best software<br />
                    products tailored to your needs.
                  </p>
                </div>

                {/* Form */}
                <div className="space-y-6">
                  {/* List Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      List Name
                    </label>
                    <Input
                      placeholder="Enter List Name"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleCreateList();
                        }
                      }}
                      className="w-full h-12 px-4 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Add Product */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Add Product
                    </label>
                    <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                      <SelectTrigger className="w-full h-12 px-4 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <SelectValue placeholder="Select Product" />
                      </SelectTrigger>
                      <SelectContent>
                        {productsLoading ? (
                          <SelectItem value="" disabled>
                            Loading products...
                          </SelectItem>
                        ) : products.length === 0 ? (
                          <SelectItem value="" disabled>
                            No products available
                          </SelectItem>
                        ) : (
                          products.map((product) => (
                            <SelectItem key={product._id || product.id} value={product._id || product.id}>
                              {product.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Continue Button */}
                  <Button
                    onClick={handleCreateList}
                    disabled={!newListName.trim() || createListMutation.isPending || addToFavoritesMutation.isPending}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full mt-8"
                  >
                    {(createListMutation.isPending || addToFavoritesMutation.isPending) ? 'Creating...' : 'Continue'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Favorite Lists */}
      {lists.length === 0 ? (
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {lists.map((list) => (
            <Card 
              key={list.listName} 
              className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => handleListClick(list.listName)}
            >
              <CardContent className="p-6">
                {/* List Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">{list.listName}</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle menu actions (rename, delete, etc.)
                    }}
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </div>

                {/* Product Grid */}
                {list.products.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No products in this list yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {list.products.slice(0, 3).map((product) => (
                      <div key={product.productId} className="space-y-2">
                        {/* Product Icon */}
                        <div className="w-16 h-16 mx-auto">
                          {getProductIcon(product.logoUrl, product.name)}
                        </div>
                        
                        {/* Product Name */}
                        <p className="text-center text-sm font-medium text-gray-700 truncate">
                          {product.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* View All Link */}
                {list.products.length > 0 && (
                  <div className="text-center">
                    <button 
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleListClick(list.listName);
                      }}
                    >
                      View All ({list.totalProducts})
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFavorites; 