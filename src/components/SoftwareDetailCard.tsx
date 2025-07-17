import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Users, Building2, Network, Heart, Star, Edit, Delete, DeleteIcon, Trash } from "lucide-react";
import StarRating from "./ui/StarRating";
import useUserStore from "@/store/useUserStore";
import { formatCurrency } from "@/utils/formatCurrency";
import ConfirmationModal from "./ui/ConfirmationModal";
import AddToListModal from "./ui/AddToListModal";
import { useState } from "react";
import { useDeleteProduct } from "@/hooks/useProducts";
import useCompareStore from "@/store/useCompareStore";
import { useToast } from "@/hooks/useToast";
import { useFavoriteStatus } from "@/hooks/useFavorites";
import useUIStore from "@/store/useUIStore";

interface FeatureDescription {
  value: string;
}

interface ProductFeature {
  title: string;
  description: FeatureDescription[];
}

interface SoftwareDetailCardProps {
  id: string;
  logo?: string;
  name: string;
  rating: number;
  reviewCount: number;
  logoBackground: string;
  description: string;
  users: string;
  industries: string;
  marketSegment: string;
  entryPrice: string;
  onWriteReview?: () => void;
  onSave?: () => void;
  onTry?: () => void;
  compareChecked?: boolean;
  onCompareChange?: (checked: boolean) => void;
  slug?: string;
  features?: ProductFeature[];
  websiteUrl?: string;
  whoCanUse?: string[];
  industriesAll?: any[];
  marketSegmentAll?: any[];
  whoCanUseAll?: any[];
  showCompare?: boolean;
  hasUserReviewed?: boolean;
  }

function renderStars(rating: number) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  return (
    <span className="flex items-center gap-0.5 text-yellow-400">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="w-5 h-5 fill-yellow-400 stroke-yellow-400" />
      ))}
      {halfStar && (
        <Star
          className="w-5 h-5 fill-yellow-400 stroke-yellow-400"
          style={{ clipPath: "inset(0 50% 0 0)" }}
        />
      )}
      {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, i) => (
        <Star key={i + 10} className="w-5 h-5 text-gray-300" />
      ))}
    </span>
  );
}

export default function SoftwareDetailCard({
  id,
  logo = "https://placehold.co/64x64?text=Logo",
  name,
  rating,
  logoBackground,
  reviewCount,
  description,
  users,
  industries,
  marketSegment,
  entryPrice,
  onWriteReview,
  onSave,
  onTry,
  compareChecked = false,
  onCompareChange,
  features,
  slug,
  websiteUrl,
  whoCanUse,
  industriesAll,
  marketSegmentAll,
  showCompare = false,
  hasUserReviewed = false,
}: SoftwareDetailCardProps) {
  const {user, isLoggedIn} = useUserStore();
  const {openAuthModal} = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddToListModal, setShowAddToListModal] = useState(false);
  const minPrice = Array.isArray(entryPrice) && entryPrice.length > 0
  ? Math.min(...entryPrice.map(p => Number(p.price) || 0))
  : null;
const deleteMutation = useDeleteProduct();

  // Compare store integration
  const { 
    addProduct, 
    removeProduct, 
    isProductInCompare, 
    canAddMore,
    products: compareProducts 
  } = useCompareStore();
  const { success, error, info } = useToast();
  
  // Check if product is already in favorites
  let favoriteStatus, isInFavorites = false;
  if (user?.role !== 'vendor') {
    const favoriteStatusQuery = useFavoriteStatus(id);
    favoriteStatus = favoriteStatusQuery.data;
    isInFavorites = favoriteStatus?.isFavorite || false;
  }
  
  const isInCompare = isProductInCompare(id);

  const handleCompareChange = (checked: boolean) => {
    if (checked) {
      if (!canAddMore()) {
        error("You can only compare up to 3 products at a time");
        return;
      }
      
      // Add product to compare
      addProduct({
        id,
        logo,
        name,
        avgRating: rating,
        totalReviews: reviewCount,
        logoBackground,
        description,
        users,
        industries: industriesAll,
        marketSegment: marketSegmentAll,
        entryPrice,
        slug,
        features,
        websiteUrl,
        whoCanUse
      });
      
      success(`${name} has been added to comparison (${compareProducts.length + 1}/3)`);
    } else {
      // Remove product from compare
      removeProduct(id);
      
      info(`${name} has been removed from comparison`);
    }
    
    // Call the parent's onChange if provided
    onCompareChange?.(checked);
  };

  const viewProductPage = () => {
    navigate(`/product-detail/${slug}`);
  };

  const onEdit = () => {
    navigate(`/profile/products/edit-product`,{
      state: {
        productID: id
      }
    });
  };

  const onDelete = () => {
    setShowDeleteModal(true);

  };
  return (
    <div className="relative w-full mx-auto h-full">
      {/* Floating Logo */}
      <div
        className="absolute -top-8  left-4 md:left-6 z-10 cursor-pointer"
        onClick={viewProductPage}
      >
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center  border-2 border-white`} style={{backgroundColor: logoBackground}}
        >
          <img
            src={logo}
            alt={name}
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-lg"
          />
        </div>
      </div>
      <Card className="relative l bg-[#F7F7F7] rounded-lg shadow p-4 md:p-6 border flex flex-col gap-2 sm:gap-3 pt-4 sm:pt-10 h-full">
        {/* Logo space is handled above */}
        {/* Logo and Compare */}
       {showCompare && <div className="flex items-start gap-4 ">
          <div className="flex-1" />
          <div className="flex-1 flex justify-end items-start">
            <label className="flex items-center gap-2 select-none cursor-pointer text-xs sm:text-sm text-gray-500">
              <input
                type="checkbox"
                checked={isInCompare}
                onChange={(e) => handleCompareChange(e.target.checked)}
                className="accent-blue-600 w-4 h-4 rounded border-gray-300"
                disabled={!isInCompare && !canAddMore()}
              />
              Compare Product
              {compareProducts.length > 0 && (
                <span className="text-xs text-gray-400">
                  ({compareProducts.length}/3)
                </span>
              )}
            </label>
          </div>
        </div>}
        {/* Name, Rating, Review, Write Review */}
        <div className={`flex sm:flex-row flex-col sm:items-start justify-between gap-4 ${!showCompare ? 'mt-8': 'mt-3'}`}>
          <div>
            <div
              onClick={viewProductPage}
              className="font-bold cursor-pointer text-base sm:text-xl text-gray-900 leading-tight capitalize line-clamp-2"
            >
              {name}
            </div>
            <div className=" flex items-center gap-2 mt-1">
              <StarRating rating={rating} />
              <span className="text-black font-semibold text-xs sm:text-sm">
                ({reviewCount}) {rating.toFixed(1)} out of 5.0
              </span>
            </div>
          </div>
        {(!isLoggedIn ||  user?.role !== 'vendor') ?  <Button
            className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-none px-4 py-2 text-xs sm:text-sm shadow min-w-[134px]"
            onClick={onWriteReview}
          >
            {hasUserReviewed ? 'Edit Review' : 'Write A Review'}
          </Button> :
           location.pathname === '/profile/products' && 

        <div className="flex items-center gap-2 absolute top-4 right-4">
        <Button
      leftIcon={Edit}
      title="Edit"
       className="bg-gray-200 hover:bg-gray-300 rounded-full text-gray-900 font-semibold w-10 h-10 px-4 py-2 text-xs sm:text-sm shadow"
       onClick={onEdit}
     >
      
     </Button>
     <Button
      title="Delete"
      leftIcon={Trash}
       className="bg-red-500 hover:bg-red-600 rounded-full text-white font-semibold w-10 h-10 px-4 py-2 text-xs sm:text-sm shadow"
       onClick={onDelete}
     >
     </Button>
</div>
          }
        </div>
        {/* Description */}
        <div>
          <div className="font-semibold text-gray-900 text-sm sm:text-base ">
            Product Description
          </div>
          <div className="text-gray-700 text-xs sm:text-sm mt-1 line-clamp-4 min-h-[100px]">
            {description}{" "}
           
          </div>
        </div>
        {/* Other Info */}
        <div className="">
          <div className="font-semibold text-gray-900 text-sm sm:text-base mb-2 ">
            Other Info
          </div>
          <div className="divide-y divide-gray-200">
            <div className="flex items-start justify-start gap-2 py-2">
              <Users className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-900 text-xs sm:text-sm">
                Users
              </span>
              <span className="text-gray-500 text-xs sm:text-sm ml-1 line-clamp-1  max-w-[80%]">
                ({users})
              </span>
            </div>
            <div className="flex items-center gap-2 py-2">
              <Building2 className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-900 text-xs sm:text-sm ">
                Industries
              </span>
              <span className="text-gray-500 text-xs sm:text-sm ml-1 line-clamp-1  max-w-[80%]">
                ({industries})
              </span>
            </div>
            <div className="flex items-center gap-2 py-2">
              <Network className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-900 text-xs sm:text-sm">
                Market Segment
              </span>
              <span className="text-gray-500 text-xs sm:text-sm ml-1 line-clamp-1  max-w-[80%]">
                ({marketSegment})
              </span>
            </div>
          </div>
        </div>
        {/* Bottom Actions */}
       {location.pathname !== '/profile/products' && <div className="flex sm:flex-row flex-col lg:items-center justify-between gap-2 mt-4 ">
         { <button
            onClick={() => { 
               if(!isLoggedIn){
                return openAuthModal()
               }
              
              setShowAddToListModal(true)}}
            className={`${user?.role==='vendor' ? 'invisible': 'flex'} items-center gap-1 !text-[11px] xl:!text-[14px] font-medium sm:px-2 py-1 rounded transition cursor-pointer ${
              isInFavorites 
                ? 'text-red-500' 
                : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <Heart className={`w-6 h-5 ${isInFavorites ? 'fill-red-500' : ''}`} /> Save to My List
          </button>}
          <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-2 ">
            <Button className="bg-white border hover:bg-white borderr-red-400 text-red-500 font-semibold rounded-full px-3 py-1 !text-[12px]  h-10 xl:h-12 sm:ml-2">
              Entry Level Price: {formatCurrency(minPrice || 0)}
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-5 py-2 !text-[12px]  h-10  xl:h-12 sm:ml-2"
              onClick={onTry}
            >
              Try For Free
            </Button>
          </div>
        </div>}
      </Card>
      <ConfirmationModal
        isOpen={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={()=>{
          deleteMutation.mutate(id);
          setShowDeleteModal(false);
        }}
        title="Delete Product?"
        description="Are you sure, You want to delete this product?"
        confirmText="Yes I'm Sure"
        cancelText="Cancel"
        confirmVariant="default"
        isLoading={deleteMutation.isPending}
      />
      
      <AddToListModal
        isOpen={showAddToListModal}
        onOpenChange={setShowAddToListModal}
        productId={id}
        productName={name}
        onSuccess={() => {
          success(`${name} has been added to your list!`);
        }}
      />
    </div>
  );
}
