import React from "react";
import { Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import StarRating from "../ui/StarRating";

interface Product {
  name: string;
  rating: number;
  reviewCount: number;
  logoUrl: string;
  bannerUrl: string;
  entryPrice: string;
}

interface ProductDetailHeaderProps {
  product: Product;
}

export default function ProductDetailHeader({
  product,
}: ProductDetailHeaderProps) {
  return (
      <>
      {/* divBanner */}
      <div
        className="h-36 md:h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${product.bannerUrl})` }}
      />

      <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="relative sm:-mt-4">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            {/* Logo */}
            <div className="flex-shrink-0 absolute -top-4 left-0 ">
              <img
                className="h-24 w-24 sm:h-34 sm:w-34 rounded-xl bg-white  shadow-lg border-2  sm:border-3 border-white object-contain"
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
                      <h1 className="text-base lg:text-2xl font-bold text-gray-900">
                        {product.name}
                      </h1>
                      <Button
                        className="hidden lg:block bg-blue-600 hover:bg-blue-700 text-white"
                        size="lg"
                      >
                        Follow
                      </Button>
                    </div>
                    <div className=" flex items-center gap-2">
                      <StarRating rating={product.rating} />
                      <span className="text-gray-600 text-xs sm:text-sm">
                        ({product.reviewCount}) {product.rating.toFixed(1)} out of 5.0
                      </span>
                    </div>
                  </div>
                  <div className="  justify-end  flex-wrap text-xs sm:text-sm gap-2 hidden sm:flex">
                    <Button
                      className="hidden sm:block lg:hidden bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                    >
                      Follow
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <User className="w-4 h-4 mr-1" />
                      Contact
                    </Button>
                  </div>
                </div>

                <div className=" flex-wrap items-center justify-between gap-4  w-full hidden sm:flex">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 text-xs sm:text-sm">
                    <Heart className="w-5 h-5" />
                    <span>Save to My List</span>
                  </button>

                  <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-2 ">
                    <Button className="bg-white border hover:bg-white border-red-400 text-red-500 font-semibold rounded-full px-3 py-1 !text-[12px] xl:!text-[14px] h-10 xl:h-12 ml-2">
                      Entry Level Price: {product.entryPrice}
                    </Button>
                    <Button
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
        <div className="flex items-center justify-between gap-4  w-full mt-4 sm:hidden">
          <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 text-xs sm:text-sm">
            <Heart className="w-5 h-5" />
            <span>Save to My List</span>
          </button>
          <div className="flex   text-xs sm:text-sm gap-2">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              Follow
            </Button>
            <Button
              size="sm"
              variant="outline"
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
    </>
  );
} 