import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Button } from '../../components/common/Button';

export const WishlistPage: React.FC = () => {
  const { wishlistProducts, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToBag = (product: any) => {
    addItem(product, 1);
  };

  return (
    <div className="min-h-screen bg-ivory pb-24">
      {/* Top Banner */}
      <div className="bg-beige/30 border-b border-beige py-12 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-[11px] uppercase tracking-[0.3em] text-champagne font-sans font-medium mb-2 block">
            Private Curation
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-charcoal tracking-tight">
            Saved Creations
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted font-sans mt-2">
            Your personal salon collection of treasured pieces reserved for future consideration.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumb items={[{ label: 'Wishlist' }]} />

        {wishlistProducts.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-beige rounded-sm p-12 sm:p-20 text-center max-w-2xl mx-auto mt-8 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-champagne/10 border border-champagne/30 flex items-center justify-center mx-auto mb-6 text-champagne">
              <Heart className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-light mb-3">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted font-sans max-w-md mx-auto leading-relaxed mb-8">
              Explore our fine jewellery salon and click the heart icon on any solitaire, collarette, or bangle to preserve your desires here.
            </p>
            <Link to="/shop">
              <Button variant="primary" size="lg" className="group flex items-center gap-2 mx-auto">
                <span>Explore Creations</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-champagne" />
              </Button>
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="mt-8">
            <div className="flex items-center justify-between pb-4 border-b border-beige mb-6">
              <span className="text-xs uppercase tracking-[0.2em] font-sans text-charcoal-muted">
                {wishlistProducts.length} Saved {wishlistProducts.length === 1 ? 'Creation' : 'Creations'}
              </span>
              <Link
                to="/shop"
                className="text-xs uppercase tracking-wider font-sans text-champagne hover:underline"
              >
                Continue Browsing
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white border border-beige hover:border-champagne/60 rounded-sm overflow-hidden shadow-xs hover:shadow-luxury transition-all duration-300 flex flex-col justify-between p-4"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/5] bg-beige/20 overflow-hidden rounded-sm mb-4">
                    <Link to={`/product/${product.slug}`}>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </Link>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 text-charcoal-muted hover:text-rose-600 flex items-center justify-center transition-colors shadow-xs"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-champagne font-sans">
                      <span>{product.category}</span>
                      <span className="text-emerald-700">
                        {product.inStock ? 'In Stock' : 'Bespoke Order'}
                      </span>
                    </div>

                    <Link
                      to={`/product/${product.slug}`}
                      className="font-serif text-base text-charcoal hover:text-champagne transition-colors line-clamp-1 block font-normal"
                    >
                      {product.name}
                    </Link>

                    <div className="flex items-baseline gap-2 font-sans text-sm font-semibold text-charcoal">
                      <span>{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-charcoal-muted line-through font-normal">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Move to bag button */}
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => handleMoveToBag(product)}
                    className="flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-champagne" />
                    <span>Add to Bag</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
