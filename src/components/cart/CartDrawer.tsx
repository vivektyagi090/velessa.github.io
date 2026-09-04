import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { CartItemRow } from './CartItemRow';
import { Button } from '../common/Button';
import { formatPrice } from '../../utils/formatters';

export const CartDrawer: React.FC = () => {
  const {
    items,
    itemCount,
    summary,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem
  } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleNavigate = (path: string) => {
    closeCart();
    navigate(path);
  };

  const freeShippingProgress = Math.min(
    100,
    (summary.subtotal / summary.freeShippingThreshold) * 100
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/70 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={closeCart}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-ivory text-charcoal h-full shadow-2xl z-10 flex flex-col justify-between border-l border-champagne/30 animate-fade-in">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-beige flex items-center justify-between bg-white/50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-champagne" />
            <h3 className="font-serif text-xl tracking-wide font-normal text-charcoal">
              Shopping Bag ({itemCount})
            </h3>
          </div>
          <button
            onClick={closeCart}
            className="p-1 text-charcoal-muted hover:text-champagne transition-colors"
            aria-label="Close bag"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Free Shipping Tier Bar */}
        <div className="px-6 py-3 bg-beige/30 border-b border-beige text-xs font-sans">
          <div className="flex items-center justify-between mb-1.5">
            {summary.remainingForFreeShipping > 0 ? (
              <span className="text-charcoal-muted">
                Add <strong className="text-charcoal font-semibold">{formatPrice(summary.remainingForFreeShipping)}</strong> for complimentary insured delivery
              </span>
            ) : (
              <span className="text-champagne-dark font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-champagne" />
                You have unlocked Complimentary Insured Delivery!
              </span>
            )}
            <span className="text-[10px] text-charcoal-muted font-mono">
              {Math.round(freeShippingProgress)}%
            </span>
          </div>
          <div className="w-full bg-beige-dark/40 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-champagne h-full transition-all duration-500 ease-out rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Items Container */}
        <div className="flex-1 overflow-y-auto px-6 divide-y divide-beige">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-beige/40 border border-beige flex items-center justify-center mb-4 text-champagne">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-2xl text-charcoal mb-2 font-light">
                Your Bag is Empty
              </h4>
              <p className="text-xs text-charcoal-muted font-sans max-w-xs leading-relaxed mb-6">
                Discover our curated selections of diamond solitaires, fluid necklaces, and timeless heirlooms.
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => handleNavigate('/shop')}
              >
                Explore Creations
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
                compact
              />
            ))
          )}
        </div>

        {/* Drawer Footer / Summary */}
        {items.length > 0 && (
          <div className="p-6 border-t border-beige bg-white/70 space-y-4">
            <div className="space-y-2 text-xs font-sans">
              <div className="flex justify-between text-charcoal-muted">
                <span>Subtotal</span>
                <span className="text-charcoal font-medium font-sans">
                  {formatPrice(summary.subtotal)}
                </span>
              </div>
              {summary.discount > 0 && (
                <div className="flex justify-between text-champagne-dark font-medium">
                  <span>Privé Privilege ({summary.appliedPromo?.code})</span>
                  <span>-{formatPrice(summary.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-charcoal-muted">
                <span>Insured Shipping</span>
                <span className="text-charcoal">
                  {summary.shipping === 0 ? (
                    <span className="text-champagne font-medium uppercase tracking-wider text-[11px]">
                      Complimentary
                    </span>
                  ) : (
                    formatPrice(summary.shipping)
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-beige flex justify-between text-sm sm:text-base font-serif text-charcoal font-medium">
                <span>Estimated Total</span>
                <span>{formatPrice(summary.total)}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => handleNavigate('/checkout')}
                className="group flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={() => handleNavigate('/cart')}
              >
                View Full Bag & Privé Codes
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-charcoal-muted font-sans pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-champagne" />
              <span>Insured delivery • 30-day returns • Authenticity certified</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
