import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Product } from '../../types/product';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice, calculateDiscount } from '../../utils/formatters';
import { Button } from '../common/Button';
import { RatingStars } from '../common/RatingStars';
import { Modal } from '../common/Modal';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const discount = calculateDiscount(product.originalPrice, product.price);
  const isSaved = isInWishlist(product.id);
  const currentSize = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard');

  const handleAddToCart = () => {
    addItem(product, quantity, currentSize);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Gallery Column */}
        <div className="space-y-3">
          <div className="w-full aspect-[4/5] bg-beige/20 rounded-sm overflow-hidden border border-beige">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 rounded-sm overflow-hidden border shrink-0 transition-colors ${
                    selectedImageIndex === idx ? 'border-champagne ring-1 ring-champagne' : 'border-beige'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Column */}
        <div className="flex flex-col space-y-5">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-champagne font-sans font-semibold">
              {product.category} • {product.collection}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-light mt-1">
              {product.name}
            </h2>

            <div className="mt-2 flex items-center gap-3">
              <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
              <span className="text-xs text-charcoal-muted">•</span>
              <span className="text-xs text-charcoal-muted font-sans font-light">
                {product.material}
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pb-3 border-b border-beige">
            <span className="font-sans text-2xl font-medium text-charcoal">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="font-sans text-sm text-charcoal-muted line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {discount > 0 && (
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-white bg-amber-700 px-2 py-0.5 rounded-xs">
                Save {discount}%
              </span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-charcoal-muted font-sans leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="text-charcoal font-medium uppercase tracking-wider">Select Size</span>
                <span className="text-charcoal-muted text-[11px]">Size Selected: {currentSize}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3.5 py-2 text-xs font-sans border transition-all rounded-xs ${
                      currentSize === size
                        ? 'border-charcoal bg-charcoal text-ivory'
                        : 'border-beige-dark/60 bg-white text-charcoal hover:border-champagne'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center border border-charcoal/20 bg-white h-12">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-charcoal hover:bg-beige/40 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs font-sans font-medium text-charcoal">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 text-charcoal hover:bg-beige/40 transition-colors"
                >
                  +
                </button>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleAddToCart}
                className="h-12"
              >
                Add to Bag
              </Button>

              <button
                onClick={() => toggleWishlist(product)}
                className="w-12 h-12 border border-charcoal/30 flex items-center justify-center text-charcoal hover:text-champagne hover:border-champagne transition-colors shrink-0"
                aria-label="Toggle wishlist"
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-champagne text-champagne' : ''}`} />
              </button>
            </div>

            {/* View full page link */}
            <div className="pt-2 text-center">
              <Link
                to={`/product/${product.slug}`}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-[0.2em] text-charcoal-muted hover:text-champagne transition-colors"
              >
                <span>View Full Atelier Specifications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Trust note */}
          <div className="pt-2 border-t border-beige flex items-center gap-4 text-[11px] text-charcoal-muted font-sans">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-champagne" />
              18k Solid Hallmark
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-champagne" />
              Insured White Glove Courier
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
