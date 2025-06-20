import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating?: number;
  totalStars?: number;
  className?: string;
  starClassName?: string;
}

const StarRating = ({
  rating = 0,
  totalStars = 5,
  className,
  starClassName,
}: StarRatingProps) => {
  // Handle case for no rating: all stars are gray outlines
  if (!rating || rating === 0) {
    return (
      <div className={cn("flex items-center gap-0.5 text-gray-300", className)}>
        {[...Array(totalStars)].map((_, i) => (
          <Star key={`empty-${i}`} className={cn("w-5 h-5", starClassName)} />
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
          className={cn(`w-5 h-5 fill-current `, starClassName)}
        />
      ))}
      {halfStar && (
        <div className="relative inline-flex items-center">
          {/* Background star (outline) - inherits colorClass */}
          <Star
            key="half-outline"
            className={cn("w-5 h-5", starClassName)}
          />
          {/* Foreground star (filled and clipped) - inherits colorClass */}
          <Star
            key="half-filled"
            className={cn(
              "w-5 h-5 fill-current absolute top-0 left-0",
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
            className={cn(`w-5 h-5 ${colorClass}`, starClassName)}
          />
        ))}
    </div>
  );
};

export default StarRating; 