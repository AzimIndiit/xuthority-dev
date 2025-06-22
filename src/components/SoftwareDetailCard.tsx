import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Users, Building2, Network, Heart, Star } from "lucide-react";
import StarRating from "./ui/StarRating";

interface SoftwareDetailCardProps {
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
}: SoftwareDetailCardProps) {
  const navigate = useNavigate();
  const viewProductPage = () => {
    const slug = name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    const subCategory = "sub-category";
    navigate(`/software/${subCategory}/${slug}`);
  };
  return (
    <div className="relative w-full mx-auto h-full">
      {/* Floating Logo */}
      <div
        className="absolute -top-8  left-4 md:left-6 z-10 cursor-pointer"
        onClick={viewProductPage}
      >
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg ${logoBackground} flex items-center justify-center  border border-white`}
        >
          <img
            src={logo}
            alt={name}
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-lg"
          />
        </div>
      </div>
      <Card className="relative bg-white rounded-lg shadow p-4 md:p-6 border flex flex-col gap-2 sm:gap-3 pt-4 sm:pt-10 h-full">
        {/* Logo space is handled above */}
        {/* Logo and Compare */}
        <div className="flex items-start gap-4 ">
          <div className="flex-1" />
          <div className="flex-1 flex justify-end items-start">
            <label className="flex items-center gap-2 select-none cursor-pointer text-xs sm:text-sm text-gray-500">
              <input
                type="checkbox"
                checked={compareChecked}
                onChange={(e) => onCompareChange?.(e.target.checked)}
                className="accent-blue-600 w-4 h-4 rounded border-gray-300"
              />
              Compare Product
            </label>
          </div>
        </div>
        {/* Name, Rating, Review, Write Review */}
        <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-4">
          <div>
            <div onClick={viewProductPage} className="font-bold cursor-pointer text-base sm:text-xl text-gray-900 leading-tight capitalize line-clamp-2">
              {name}   {name}   {name}               {name}   {name}   {name}
            </div>
            <div className=" flex items-center gap-2 mt-1">
                      <StarRating rating={rating} />
                      <span className="text-gray-600 text-xs sm:text-sm">
                        ({reviewCount}) {rating} out of 5
                      </span>
                    </div>
          </div>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-none px-4 py-2 text-xs sm:text-sm shadow"
            onClick={onWriteReview}
          >
            Write A Review
          </Button>
        </div>
        {/* Description */}
        <div>
          <div className="font-semibold text-gray-900 text-sm sm:text-base ">
            Product Description
          </div>
          <div className="text-gray-700 text-xs sm:text-sm mt-1 line-clamp-4">
            {description}{" "}
            <a href="#" className="text-blue-600 font-medium hover:underline">
              See More
            </a>
          </div>
        </div>
        {/* Other Info */}
        <div>
          <div className="font-semibold text-gray-900 text-sm sm:text-base mb-2">
            Other Info
          </div>
          <div className="divide-y divide-gray-200">
            <div className="flex items-center gap-2 py-2">
              <Users className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-900 text-xs sm:text-sm">
                Users
              </span>
              <span className="text-gray-500 text-xs sm:text-sm ml-1">
                ({users})
              </span>
            </div>
            <div className="flex items-center gap-2 py-2">
              <Building2 className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-900 text-xs sm:text-sm">
                Industries
              </span>
              <span className="text-gray-500 text-xs sm:text-sm ml-1">
                ({industries})
              </span>
            </div>
            <div className="flex items-center gap-2 py-2">
              <Network className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-900 text-xs sm:text-sm">
                Market Segment
              </span>
              <span className="text-gray-500 text-xs sm:text-sm ml-1">
                ({marketSegment})
              </span>
            </div>
          </div>
        </div>
        {/* Bottom Actions */}
        <div className="flex sm:flex-row flex-col lg:items-center justify-between gap-2 mt-4 ">
          <button
            onClick={onSave}
            className="flex items-center gap-1 text-gray-500 hover:text-red-500 !text-[11px] xl:!text-[12px]  font-medium sm:px-2 py-1 rounded transition"
          >
            <Heart className="w-5 h-5" /> Save to My List
          </button>
          <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-2 ">
            <Button className="bg-white border hover:bg-white border-red-400 text-red-500 font-semibold rounded-full px-3 py-1 !text-[12px] xl:!text-[14px] h-10 xl:h-12 sm:ml-2">
              Entry Level Price: {entryPrice}
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-5 py-2 !text-[12px] xl:!text-[14px] h-10  xl:h-12 sm:ml-2"
              onClick={onTry}
            >
              Try For Free
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
