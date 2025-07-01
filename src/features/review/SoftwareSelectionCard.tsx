import React from "react";
import { Software } from "@/types/review";
import StarRating from "@/components/ui/StarRating";
import { RadioGroupItem } from "@/components/ui/radio-group";

interface SoftwareSelectionCardProps {
  software: Software;
  isSelected: boolean;
  id: string;
  name: string;
  logoUrl: string;
  rating: number;
  reviewCount: number;
  slug: string;
  logoBackground: string;
}

const SoftwareSelectionCard: React.FC<SoftwareSelectionCardProps> = ({
  id,
  name,
  logoUrl,
  rating,
  reviewCount,
  slug,
  logoBackground,
  isSelected,
}) => {
  return (
    <div
      className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer h-full ${
        isSelected ? "border-red-500 bg-red-50" : "border-gray-200 bg-white"
      }`}
    >
      <div className="absolute -top-8  left-4  z-10 cursor-pointer">
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center  border border-white`} style={{ backgroundColor: logoBackground }}
        >
          <img
            src={logoUrl}
            alt={name}
            className="w-10 h-10  object-contain rounded-lg"
          />
        </div>
      </div>
      <div className="flex flex-col flex-grow items-start text-left mt-6">
        <h4 className="font-bold text-gray-900 capitalize">{name}</h4>
        <div className="flex lg:flex-row flex-col items-start lg:items-center gap-2 mt-1">
          <StarRating rating={rating} />
          <span className="text-sm text-gray-600">
            ({reviewCount})
          </span>
        </div>
      </div>
      <RadioGroupItem
        value={id}
        id={id}
        className="absolute top-4 right-4 h-6 w-6"
        checked={isSelected}
      />
    </div>
  );
};

export default SoftwareSelectionCard;
