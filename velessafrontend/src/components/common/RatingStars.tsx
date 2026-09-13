import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
  showNumeric?: boolean;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  reviewCount,
  size = 'sm',
  showNumeric = true,
  className = ''
}) => {
  const starSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }).map((_, index) => {
          const filled = index < Math.round(rating);
          return (
            <Star
              key={index}
              className={`${starSize} ${
                filled
                  ? 'fill-champagne text-champagne'
                  : 'fill-transparent text-beige-dark'
              }`}
            />
          );
        })}
      </div>
      {showNumeric && (
        <span className="text-xs text-charcoal-muted font-sans ml-0.5">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-xs text-charcoal-muted/70 font-sans">
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
