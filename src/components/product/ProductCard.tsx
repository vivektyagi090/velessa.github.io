import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { Product } from '../../types/product';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice, calculateDiscount } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { RatingStars } from '../common/RatingStars';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isSaved = isInWishlist(product.id);
  const discount = calculateDiscount(product.originalPrice, product.price);

  const primaryImage = product.images[0];
  const secondaryImage = product.images.length > 1 ? product.images[1] : product.images[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <div
      className={`group relative flex flex-col bg-transparent transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Showcase Container */}
      <div className="relative w-full aspect-[4/5] bg-beige/20 overflow-hidden rounded-sm">
        {/* Main Image Link */}
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={primaryImage}
            alt={product.name}
            className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              isHovered && secondaryImage !== primaryImage ? 'opacity-0' : 'opacity-100'
            }`}
            loading="lazy"
          />
          {secondaryImage !== primaryImage && (
            <img
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                isHovered ? 'opacity-100 scale-105 transition-transform duration-700' : 'opacity-0 scale-100'
              }`}
              loading="lazy"
            />
          )}
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.festiveTag && (
            <Badge variant="festive" className="!text-[9px] !tracking-[0.15em] flex items-center gap-1 shadow-sm">
              <span>🌺</span>
              <span>{product.festiveTag}</span>
            </Badge>
          )}
          {product.isNew && <Badge variant="charcoal">New Arrival</Badge>}
          {product.isBestSeller && !product.festiveTag && <Badge variant="gold">Best Seller</Badge>}
          {discount > 0 && <Badge variant="sale">-{discount}%</Badge>}
          {!product.inStock && <Badge variant="subtle">Pre-Order</Badge>}
        </div>

        {/* Wishlist Top Right Icon */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-charcoal hover:text-champagne transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isSaved ? 'fill-champagne text-champagne' : 'text-charcoal'
            }`}
          />
        </button>

        {/* Hover Action Bar (Desktop bottom slide-up) */}
        <div className="absolute inset-x-3 bottom-3 z-10 flex gap-2 transition-all duration-300 transform opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
          {onQuickView && (
            <button
              onClick={handleQuickViewClick}
              className="flex-1 py-2.5 px-3 bg-white/95 text-charcoal hover:bg-white text-[10px] uppercase tracking-[0.2em] font-sans font-medium flex items-center justify-center gap-1.5 shadow-md hover:text-champagne transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quick View</span>
            </button>
          )}

          <button
            onClick={handleQuickAdd}
            className="flex-1 py-2.5 px-3 bg-charcoal text-ivory hover:bg-black text-[10px] uppercase tracking-[0.2em] font-sans font-medium flex items-center justify-center gap-1.5 shadow-md hover:text-champagne transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="pt-4 flex flex-col flex-1">
        {/* Category & Material */}
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-champagne font-sans mb-1">
          <span>{product.category}</span>
          <span className="text-charcoal-muted/70 text-[10px] normal-case tracking-normal">
            {typeof product.material === 'string' && product.material.includes('Gold') ? '18k Gold' : product.material}
          </span>
        </div>

        {/* Product Title */}
        <Link
          to={`/product/${product.slug}`}
          className="font-serif text-base sm:text-lg font-light text-charcoal hover:text-champagne transition-colors line-clamp-1 leading-snug"
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div className="mt-1.5 mb-2">
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="sm" />
        </div>

        {/* Price & Discounts */}
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="font-sans text-sm sm:text-base font-medium text-charcoal">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="font-sans text-xs text-charcoal-muted line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
