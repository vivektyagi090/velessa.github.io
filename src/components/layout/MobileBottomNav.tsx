import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Search, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { openCart, itemCount } = useCart();
  const { wishlistCount } = useWishlist();

  // Trigger search modal via global custom event
  const handleOpenSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('open-velessa-search'));
  };

  const isHomeActive = location.pathname === '/';
  const isShopActive =
    location.pathname.startsWith('/shop') ||
    location.pathname.startsWith('/collections');
  const isWishlistActive = location.pathname === '/wishlist';

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-ivory/95 backdrop-blur-xl border-t border-champagne/30 rounded-t-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)] pb-[max(0.5rem,env(safe-area-inset-bottom))] overflow-visible"
    >
      <div className="grid grid-cols-5 items-center h-16 px-1 max-w-lg mx-auto relative overflow-visible">
        {/* 1. Home */}
        <Link
          to="/"
          className={`group flex flex-col items-center justify-center py-1 select-none transition-transform active:scale-90 ${
            isHomeActive ? 'text-charcoal' : 'text-charcoal-muted hover:text-champagne'
          }`}
          aria-label="Home"
        >
          <div className="relative">
            <Home
              className={`w-5 h-5 transition-colors ${
                isHomeActive ? 'text-champagne stroke-[2.25]' : 'stroke-[1.75]'
              }`}
            />
            {isHomeActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-champagne rounded-full shadow-xs" />
            )}
          </div>
          <span
            className={`text-[10px] tracking-wider uppercase mt-1 font-sans transition-colors ${
              isHomeActive ? 'font-semibold text-charcoal' : 'text-charcoal-muted'
            }`}
          >
            Home
          </span>
        </Link>

        {/* 2. Shop / Explore */}
        <Link
          to="/shop"
          className={`group flex flex-col items-center justify-center py-1 select-none transition-transform active:scale-90 ${
            isShopActive ? 'text-charcoal' : 'text-charcoal-muted hover:text-champagne'
          }`}
          aria-label="Explore Catalogue"
        >
          <div className="relative">
            <Compass
              className={`w-5 h-5 transition-colors ${
                isShopActive ? 'text-champagne stroke-[2.25]' : 'stroke-[1.75]'
              }`}
            />
            {isShopActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-champagne rounded-full shadow-xs" />
            )}
          </div>
          <span
            className={`text-[10px] tracking-wider uppercase mt-1 font-sans transition-colors ${
              isShopActive ? 'font-semibold text-charcoal' : 'text-charcoal-muted'
            }`}
          >
            Shop
          </span>
        </Link>

        {/* 3. Center Elevated Floating Search Button (FAB) */}
        <div className="relative flex flex-col items-center justify-center">
          <button
            onClick={handleOpenSearch}
            type="button"
            className="group -mt-6 flex flex-col items-center justify-center select-none transition-transform active:scale-90 focus:outline-none"
            aria-label="Search Fine Jewellery"
          >
            {/* Elevated Circle with Outline & Glow */}
            <div className="w-13.5 h-13.5 sm:w-14 sm:h-14 w-[52px] h-[52px] rounded-full bg-charcoal border-2 border-champagne shadow-[0_6px_20px_rgba(198,161,91,0.4)] flex items-center justify-center text-champagne ring-4 ring-ivory group-hover:scale-105 group-hover:bg-black transition-all duration-300">
              <Search className="w-5 h-5 stroke-[2.2] group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="text-[10px] tracking-wider uppercase mt-1 font-sans font-semibold text-charcoal group-hover:text-champagne transition-colors">
              Search
            </span>
          </button>
        </div>

        {/* 4. Wishlist */}
        <Link
          to="/wishlist"
          className={`group flex flex-col items-center justify-center py-1 select-none transition-transform active:scale-90 ${
            isWishlistActive ? 'text-charcoal' : 'text-charcoal-muted hover:text-champagne'
          }`}
          aria-label={`Saved Pieces (${wishlistCount})`}
        >
          <div className="relative">
            <Heart
              className={`w-5 h-5 transition-colors ${
                isWishlistActive
                  ? 'fill-champagne text-champagne stroke-[2.25]'
                  : 'stroke-[1.75]'
              }`}
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-champagne text-charcoal text-[9px] font-bold font-sans rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
            {isWishlistActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-champagne rounded-full shadow-xs" />
            )}
          </div>
          <span
            className={`text-[10px] tracking-wider uppercase mt-1 font-sans transition-colors ${
              isWishlistActive ? 'font-semibold text-charcoal' : 'text-charcoal-muted'
            }`}
          >
            Wishlist
          </span>
        </Link>

        {/* 5. Bag / Cart */}
        <button
          onClick={openCart}
          type="button"
          className="group flex flex-col items-center justify-center py-1 select-none text-charcoal-muted hover:text-champagne transition-transform active:scale-90"
          aria-label={`Shopping Bag (${itemCount})`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[1.75] group-hover:text-champagne transition-colors" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-charcoal text-ivory text-[9px] font-bold font-sans rounded-full w-4 h-4 flex items-center justify-center border border-champagne shadow-xs">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-wider uppercase mt-1 font-sans text-charcoal-muted group-hover:text-champagne transition-colors">
            Bag
          </span>
        </button>
      </div>
    </nav>
  );
};
