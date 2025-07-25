import React, { useState } from "react";
import { Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import StarRating from "./ui/StarRating";
import useUserStore from "@/store/useUserStore";
import { useFollowStatus, useToggleFollow } from "@/hooks/useFollow";
import toast from "react-hot-toast";
import useUIStore from "@/store/useUIStore";
import AddToListModal from "./ui/AddToListModal";
import { useFavoriteStatus } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/useToast";

interface Product {
  _id?: string;
  id?: string;
  name: string;
  rating: number;
  reviewCount: number;
  logoUrl: string;
  bannerUrl: string;
  entryPrice: string;
  brandColors?: string;
  website?: string;
}

interface ProductDetailHeaderProps {
  product: Product;
  productOwner: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  id: string;
}

export default function ProductDetailHeader({
  product,
  productOwner,
  id,
}: ProductDetailHeaderProps) {
  const {user} = useUserStore();
  const { isLoggedIn } = useUserStore();
  const { openAuthModal } = useUIStore();
  const { success } = useToast();
  const [showAddToListModal, setShowAddToListModal] = useState(false);
  
  console.log(productOwner,"productOwner");
  const { data: followStatus } = useFollowStatus(productOwner._id || '');
  const toggleFollowMutation = useToggleFollow();
  const isFollowing = followStatus?.isFollowing || false;
  
  // Check if product is already in favorites
  const { data: favoriteStatus } = useFavoriteStatus(id);
  const isInFavorites = favoriteStatus?.isFavorite || false;
  const handleFollowToggle = async () => {
    if(!isLoggedIn) {
      openAuthModal();
      return;
    }
    if (!productOwner?._id) return;
    
    try {
      await toggleFollowMutation.mutateAsync(productOwner._id);
      toast.success(
        isFollowing 
          ? `You've unfollowed ${productOwner?.firstName} ${productOwner?.lastName}` 
          : `You're now following ${productOwner?.firstName} ${productOwner?.lastName}`
      );
    } catch (error) {
      toast.error('Failed to update follow status. Please try again.');
    }
  };

  const handleSaveToList = () => {
    if(!isLoggedIn) {
      openAuthModal();
      return;
    }
    setShowAddToListModal(true);
  };
  return (
    <>
      {/* Banner */}
      <div
        className="h-36 md:h-72 bg-cover bg-center"
        style={{ backgroundImage: `url(${product.bannerUrl})` }}
      />

      <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="relative sm:-mt-4">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            {/* Logo */}
            <div className="flex-shrink-0 absolute -top-4 left-0 rounded-xl  shadow-lg border-2  sm:border-3 border-white object-contain " style={{background:`${product.brandColors}`}}>
              <img
                
                className="h-24 w-24 sm:h-34 sm:w-34 object-contain p-4"
                src={product.logoUrl}
                alt={`${product.name} logo`}
              />
            </div>

            {/* Info and Actions */}
            <div className="flex  justify-between items-start md:items-end  w-full mt-2 sm:mt-6 ">
              <div className="w-38 sm:w-46 h-10" />
              <div className="flex flex-col justify-between items-start gap-2 w-full ">
                <div className="flex justify-between items-start gap-4 w-full">
                  <div className="w-full">
                    <div className="flex items-start gap-4 w-full">
                      <h1 className="text-base lg:text-2xl font-bold text-gray-900 capitalize">
                        {product.name}
                      </h1>
                    {user?.role !== 'vendor' &&  <Button
                        className={`hidden lg:block ${isFollowing ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                        size="lg"
                        onClick={handleFollowToggle}
                        loading={toggleFollowMutation.isPending}
                      >
                        {isFollowing ? "Unfollow" : "Follow"}
                      </Button>}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <StarRating rating={product.rating} />
                      <span className="text-black font-semibold text-xs sm:text-sm">
                        ({product.reviewCount}) {product.rating.toFixed(1)} out of 5.0
                      </span>
                    </div>
                  </div>
                  <div className={` justify-end  flex-wrap text-xs sm:text-sm gap-2 hidden sm:flex`}>
                    {user?.role !== 'vendor' && <Button
                      className={`hidden sm:block lg:hidden ${isFollowing ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                      size="lg"
                      onClick={handleFollowToggle}
                      loading={toggleFollowMutation.isPending}
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </Button>}
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => window.open(`https://${product.website}`, '_blank')}
                      className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <User className="w-4 h-4 mr-1" />
                      Contact
                    </Button>
                  </div>
                </div>

                <div className={` flex-wrap items-center ${user?.role !== 'vendor' ? 'justify-between' : 'justify-end'} gap-4  w-full hidden sm:flex`}>
                {user?.role !== 'vendor' &&  <button 
                    onClick={handleSaveToList}
                    className={`flex items-center gap-2 text-xs sm:text-sm transition-colors cursor-pointer ${
                      isInFavorites 
                        ? 'text-red-500' 
                        : 'text-gray-600 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isInFavorites ? 'fill-red-500' : ''}`} />
                    <span>Save to My List</span>
                  </button>}

                  <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-2 ">
                    <Button className="bg-white border hover:bg-white border-red-400 text-red-500 font-semibold rounded-full px-3 py-1 !text-[12px] xl:!text-[14px] h-10 xl:h-12 ml-2" 
                    onClick={() => {
                      // scroll to pricing section
                      const pricingSection = document.getElementById('pricing');
                      if (pricingSection) {
                        pricingSection.scrollIntoView({
                          behavior: "smooth",
                        });
                      }
                     
                    }}
                    >
                      Entry Level Price: {product.entryPrice}
                    </Button>
                    <Button
                    onClick={() => {
                      // scroll to pricing section
                      const pricingSection = document.getElementById('pricing');
                      if (pricingSection) {
                        pricingSection.scrollIntoView({
                          behavior: "smooth",
                        });
                      }
                    }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-5 py-2 !text-[12px] xl:!text-[14px] h-10  xl:h-12 ml-2"
                    >
                      Try For Free
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`flex items-center ${user?.role !== 'vendor' ? 'justify-between' : 'justify-end'} gap-4  w-full mt-8 sm:hidden`}>
        {user?.role !== 'vendor' &&  <button 
            onClick={handleSaveToList}
            className={`flex items-center gap-2 text-xs sm:text-sm transition-colors cursor-pointer ${
              isInFavorites 
                ? 'text-red-500' 
                : 'text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isInFavorites ? 'fill-red-500' : ''}`} />
            <span>Save to My List</span>
          </button>}
          <div className="flex   text-xs sm:text-sm gap-2">
            {user?.role !== 'vendor' && <Button
              className={`${isFollowing ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
              size="sm"
              onClick={handleFollowToggle}
              loading={toggleFollowMutation.isPending}
            >
              {isFollowing ? "Unfollow" : "Follow"} 
            </Button>}
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(`https://${product.website}`, '_blank')}
              className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <User className="w-4 h-4 mr-1" />
              Contact
            </Button>
          </div>
        </div>
        <div className="flex  justify-between gap-2 mt-2  sm:hidden w-full">
          <Button className="bg-white border hover:bg-white border-red-400 text-red-500 font-semibold rounded-full px-3 py-1 !text-[12px] xl:!text-[14px] h-10 xl:h-12 ">
            Entry Level Price: {product.entryPrice}
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-5 py-2 !text-[12px] xl:!text-[14px] h-10  xl:h-12 "
          >
            Try For Free
          </Button>
        </div>
      </div>
      
      <AddToListModal
        isOpen={showAddToListModal}
        onOpenChange={setShowAddToListModal}
        productId={id}
        productName={product.name}
        onSuccess={() => {
          success(`${product.name} has been added to your list!`);
        }}
      />
    </>
  );
} 