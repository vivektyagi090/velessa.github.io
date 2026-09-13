import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '../../types/cart';
import { formatPrice } from '../../utils/formatters';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  compact?: boolean;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  compact = false,
}) => {
  const { product, quantity, selectedSize, selectedMaterial } = item;

  return (
    <div className={`flex gap-4 ${compact ? 'py-4 border-b border-beige' : 'py-6 border-b border-beige'}`}>
      {/* Product Image */}
      <Link
        to={`/product/${product.slug}`}
        className={`relative shrink-0 bg-beige/20 overflow-hidden rounded-sm ${
          compact ? 'w-20 h-20' : 'w-24 h-24 sm:w-28 sm:h-28'
        }`}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <Link
              to={`/product/${product.slug}`}
              className="font-serif text-sm sm:text-base font-normal text-charcoal hover:text-champagne transition-colors line-clamp-1"
            >
              {product.name}
            </Link>
            <button
              onClick={() => onRemove(item.id)}
              className="text-charcoal-muted/60 hover:text-rose-600 transition-colors p-1"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Variants info */}
          <div className="text-[11px] font-sans text-charcoal-muted mt-1 space-x-2">
            {selectedSize && <span>Size: {selectedSize}</span>}
            {selectedMaterial && (
              <span>• {selectedMaterial}</span>
            )}
          </div>
        </div>

        {/* Quantity Controls & Price */}
        <div className="flex items-center justify-between mt-3">
          {/* Quantity selector */}
          <div className="inline-flex items-center border border-charcoal/20 bg-white">
            <button
              onClick={() => onUpdateQuantity(item.id, quantity - 1)}
              className="px-2 py-1 text-charcoal hover:bg-beige/40 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-3 py-1 text-xs font-sans font-medium text-charcoal select-none">
              {quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, quantity + 1)}
              className="px-2 py-1 text-charcoal hover:bg-beige/40 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Line item price */}
          <div className="text-right">
            <span className="font-sans text-sm font-semibold text-charcoal">
              {formatPrice(product.price * quantity)}
            </span>
            {quantity > 1 && (
              <span className="block text-[10px] text-charcoal-muted font-sans">
                {formatPrice(product.price)} each
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
