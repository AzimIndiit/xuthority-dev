import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating?: number;
  totalStars?: number;
  className?: string;
  starClassName?: string;
  onRatingChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg" | "xl";
  showEmpty?: boolean; // Add this prop to always show empty stars
}

const StarRating = ({
  rating = 0,
  totalStars = 5,
  className,
  starClassName,
  onRatingChange,
  size = "lg",
  showEmpty = false // Default to false for backward compatibility
}: StarRatingProps) => {
  // Size variants for stars
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4", 
    lg: "w-5 h-5",
    xl: "w-6 h-6"
  };

  const starSize = sizeClasses[size];
  const isInteractive = !!onRatingChange;

  const handleStarClick = (starIndex: number) => {
    if (onRatingChange) {
      onRatingChange(starIndex + 1);
    }
  };

  // Handle case for no rating: all stars are gray outlines
  if (!rating || rating === 0 || showEmpty) {
    return (
      <div className={cn("flex items-center gap-0.5 text-gray-300", className)}>
        {[...Array(totalStars)].map((_, i) => (
          <Star 
            key={`empty-${i}`} 
            className={cn(
              starSize, 
              starClassName,
              isInteractive && "cursor-pointer hover:text-gray-400 transition-colors"
            )}
            onClick={() => handleStarClick(i)}
          />
        ))}
      </div>
    );
  }

  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

  // Determine color based on rating
  const colorClass = rating < 3 ? "text-red-500" : "text-yellow-400";

  return (
    <div className={cn("flex items-center gap-0.5", colorClass, className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className={cn(
            starSize,
            "fill-current",
            starClassName,
            isInteractive && "cursor-pointer hover:opacity-80 transition-opacity"
          )}
          onClick={() => handleStarClick(i)}
        />
      ))}
      {halfStar && (
        <div className="relative inline-flex items-center">
          {/* Background star (outline) - inherits colorClass */}
          <Star
            key="half-outline"
            className={cn(
              starSize, 
              starClassName,
              isInteractive && "cursor-pointer hover:opacity-80 transition-opacity"
            )}
            onClick={() => handleStarClick(fullStars)}
          />
          {/* Foreground star (filled and clipped) - inherits colorClass */}
          <Star
            key="half-filled"
            className={cn(
              starSize,
              "fill-current absolute top-0 left-0",
              starClassName
            )}
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        </div>
      )}
      {emptyStars > 0 &&
        [...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={cn(
              starSize,
              colorClass,
              starClassName,
              isInteractive && "cursor-pointer hover:opacity-80 transition-opacity"
            )}
            onClick={() => handleStarClick(fullStars + (halfStar ? 1 : 0) + i)}
          />
        ))}
    </div>
  );
};

export default StarRating; 