
import { cn } from "@/lib/utils";
import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  className?: string;
  size?: number;
}

const RatingStars = ({ 
  rating, 
  maxRating = 5, 
  className,
  size = 16 
}: RatingStarsProps) => {
  return (
    <div className={cn("flex items-center", className)}>
      {Array.from({ length: maxRating }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            "transition-colors",
            i < Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : i < rating
              ? "fill-amber-400/50 text-amber-400"
              : "fill-gray-200 text-gray-200"
          )}
        />
      ))}
    </div>
  );
};

export default RatingStars;
