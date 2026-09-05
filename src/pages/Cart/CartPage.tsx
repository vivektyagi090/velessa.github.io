import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ShieldCheck, Tag, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { CartItemRow } from '../../components/cart/CartItemRow';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Button } from '../../components/common/Button';
import { formatPrice } from '../../utils/formatters';

export const CartPage: React.FC = () => {
  const {
    items,
    itemCount,
    summary,
    updateQuantity,
    removeItem,
    applyPromoCode,
    removePromoCode,
    clearCart
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const navigate = useNavigate();

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    setIsApplyingPromo(true);
    await applyPromoCode(promoInput);
    setIsApplyingPromo(false);
    setPromoInput('');
  };

  const freeShippingProgress = Math.min(
    100,
    (summary.subtotal / summary.freeShippingThreshold) * 100
  );

  return (
    <div className="min-h-screen bg-ivory pb-24">
      {/* Header Banner */}
      <div className="bg-beige/30 border-b border-beige py-12 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-[11px] uppercase tracking-[0.3em] text-champagne font-sans font-medium mb-2 block">
            Review Your Order
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-charcoal tracking-tight">
            Your Shopping Bag
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted font-sans mt-2">
            Complimentary insured white-glove courier delivery on all orders over ₹15,000.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumb items={[{ label: 'Shopping Bag' }]} />

        {items.length === 0 ? (
          /* Empty Bag State */
          <div className="bg-white border border-beige rounded-sm p-12 sm:p-20 text-center max-w-2xl mx-auto mt-8 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-champagne/10 border border-champagne/30 flex items-center justify-center mx-auto mb-6 text-champagne">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-light mb-3">
              Your Bag is Empty
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted font-sans max-w-md mx-auto leading-relaxed mb-8">
              Explore our master jewelers’ collections of solitaire engagement rings, tennis collarettes, and statement cuffs.
            </p>
            <Link to="/shop">
              <Button variant="primary" size="lg" className="group flex items-center gap-2 mx-auto">
                <span>Shop All Fine Jewellery</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-champagne" />
              </Button>
            </Link>
          </div>
        ) : (
          /* Cart Content: Items table + Summary sidebar */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mt-8">
            {/* Items Column */}
            <div className="lg:col-span-8 bg-white border border-beige rounded-sm p-6 sm:p-8 shadow-sm">
              {/* Free Shipping Tier Bar */}
              <div className="p-4 bg-beige/30 border border-beige rounded-sm mb-6 text-xs font-sans">
                <div className="flex items-center justify-between mb-2">
                  {summary.remainingForFreeShipping > 0 ? (
                    <span className="text-charcoal-muted">
                      Add <strong className="text-charcoal font-semibold">{formatPrice(summary.remainingForFreeShipping)}</strong> more for complimentary insured delivery
                    </span>
                  ) : (
                    <span className="text-champagne-dark font-medium flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-champagne" />
                      Congratulations! You qualify for Complimentary Worldwide Insured Delivery.
                    </span>
                  )}
                  <span className="font-mono text-charcoal-muted">
                    {Math.round(freeShippingProgress)}%
                  </span>
                </div>
                <div className="w-full bg-beige-dark/40 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-champagne h-full rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-beige">
                {items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>

              {/* Clear Cart / Continue Shopping Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-beige text-xs font-sans">
                <Link
                  to="/shop"
                  className="text-charcoal-muted hover:text-champagne uppercase tracking-wider transition-colors"
                >
                  ← Continue Exploring Creations
                </Link>
                <button
                  onClick={clearCart}
                  className="text-charcoal-muted hover:text-rose-600 transition-colors uppercase tracking-wider"
                >
                  Clear Bag
                </button>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-beige rounded-sm p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="font-serif text-2xl text-charcoal font-normal pb-4 border-b border-beige">
                  Order Summary
                </h3>

                {/* Pricing Breakdowns */}
                <div className="space-y-3 text-xs font-sans">
                  <div className="flex justify-between text-charcoal-muted">
                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                    <span className="text-charcoal font-medium">
                      {formatPrice(summary.subtotal)}
                    </span>
                  </div>

                  {summary.discount > 0 && (
                    <div className="flex justify-between text-champagne-dark font-medium">
                      <span>Privé Code ({summary.appliedPromo?.code})</span>
                      <span>-{formatPrice(summary.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-charcoal-muted">
                    <span>Insured Shipping</span>
                    <span className="text-charcoal">
                      {summary.shipping === 0 ? (
                        <span className="text-champagne font-medium uppercase tracking-wider">
                          Complimentary
                        </span>
                      ) : (
                        formatPrice(summary.shipping)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-charcoal-muted">
                    <span>Estimated Sales Tax</span>
                    <span className="text-charcoal font-medium">
                      {formatPrice(summary.tax)}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-beige flex justify-between text-base sm:text-lg font-serif text-charcoal font-medium">
                    <span>Estimated Total</span>
                    <span>{formatPrice(summary.total)}</span>
                  </div>
                </div>

                {/* Promo code input */}
                <div className="pt-4 border-t border-beige space-y-2">
                  <span className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                    Privé Invitation Code
                  </span>

                  {summary.appliedPromo ? (
                    <div className="flex items-center justify-between p-3 bg-champagne/10 border border-champagne/30 rounded-xs text-xs font-sans">
                      <div className="flex items-center gap-2 text-champagne-dark font-medium">
                        <Tag className="w-3.5 h-3.5" />
                        <span>{summary.appliedPromo.code} ({summary.appliedPromo.percentage}% Off)</span>
                      </div>
                      <button
                        onClick={removePromoCode}
                        className="text-charcoal-muted hover:text-rose-600 p-1"
                        aria-label="Remove promo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Try 'VELESSA10'"
                        className="flex-1 p-2.5 bg-beige/20 border border-beige text-xs font-sans uppercase tracking-wider outline-none focus:border-champagne"
                      />
                      <Button
                        type="submit"
                        variant="secondary"
                        size="sm"
                        isLoading={isApplyingPromo}
                        className="shrink-0"
                      >
                        Apply
                      </Button>
                    </form>
                  )}
                </div>

                {/* Checkout CTA */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => navigate('/checkout')}
                  className="group flex items-center justify-center gap-3 shadow-luxury"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-champagne" />
                </Button>

                {/* Assurance Details */}
                <div className="space-y-2 pt-4 border-t border-beige text-[11px] text-charcoal-muted font-sans">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-champagne shrink-0" />
                    <span>256-Bit Encrypted Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-champagne shrink-0" />
                    <span>30-Day Hassle-Free Returns & Resizing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
