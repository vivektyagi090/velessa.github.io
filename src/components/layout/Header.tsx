import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { SearchOverlay } from './SearchOverlay';
import { MobileNavDrawer } from './MobileNavDrawer';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const { openCart, itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated } = useAuth();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleOpenSearch = () => setIsSearchOpen(true);
    window.addEventListener('open-velessa-search', handleOpenSearch);
    return () => window.removeEventListener('open-velessa-search', handleOpenSearch);
  }, []);

  // Header dynamic classes based on scroll and current page
  const headerBackgroundClass = isHomePage
    ? isScrolled
      ? 'bg-ivory/95 backdrop-blur-md shadow-sm border-b border-beige text-charcoal'
      : 'bg-transparent text-charcoal'
    : 'bg-ivory/95 backdrop-blur-md shadow-sm border-b border-beige text-charcoal';

  const navItemClass = (path: string) => {
    const isActive = location.pathname === path;
    return `text-xs uppercase tracking-[0.2em] font-sans transition-all duration-200 hover:text-champagne relative py-1 ${
      isActive ? 'text-champagne font-medium' : 'text-charcoal/90'
    }`;
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${headerBackgroundClass}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 text-charcoal hover:text-champagne transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Desktop Left Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to="/" className={navItemClass('/')}>
                Home
              </Link>
              <Link to="/shop" className={navItemClass('/shop')}>
                Shop
              </Link>
              <Link to="/collections" className={navItemClass('/collections')}>
                Collections
              </Link>
              <Link to="/shop?filter=new" className={navItemClass('/shop?filter=new')}>
                New Arrivals
              </Link>
            </nav>

            {/* Center Logo */}
            <div className="flex flex-col items-center justify-center text-center mx-auto lg:mx-0">
              <Link to="/" className="group flex flex-col items-center">
                <span className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-[0.28em] font-light text-charcoal group-hover:text-champagne transition-colors duration-300">
                  VELESSA
                </span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.35em] text-champagne font-sans font-medium -mt-1">
                  Haute Joaillerie
                </span>
              </Link>
            </div>

            {/* Desktop Right Navigation + Actions */}
            <div className="flex items-center space-x-6 sm:space-x-8">
              <nav className="hidden lg:flex items-center space-x-8">
                <Link to="/about" className={navItemClass('/about')}>
                  About
                </Link>
                <Link to="/contact" className={navItemClass('/contact')}>
                  Contact
                </Link>
              </nav>

              {/* Action Icons */}
              <div className="flex items-center space-x-4 sm:space-x-5">
                {/* Search Button */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-1.5 text-charcoal hover:text-champagne transition-colors relative group"
                  aria-label="Search creations"
                >
                  <Search className="w-5 h-5" />
                  <span className="sr-only">Search</span>
                </button>

                {/* Account Button */}
                <Link
                  to={isAuthenticated ? '/account' : '/login'}
                  className="hidden sm:block p-1.5 text-charcoal hover:text-champagne transition-colors"
                  aria-label="Account"
                >
                  <User className="w-5 h-5" />
                  <span className="sr-only">{isAuthenticated ? user?.firstName : 'Account'}</span>
                </Link>

                {/* Wishlist Button */}
                <Link
                  to="/wishlist"
                  className="p-1.5 text-charcoal hover:text-champagne transition-colors relative"
                  aria-label="View Wishlist"
                >
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 bg-champagne text-charcoal text-[10px] font-bold font-sans rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Cart Bag Button */}
                <button
                  onClick={openCart}
                  className="p-1.5 text-charcoal hover:text-champagne transition-colors relative"
                  aria-label="Open shopping bag"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 bg-charcoal text-ivory text-[10px] font-bold font-sans rounded-full w-4 h-4 flex items-center justify-center border border-champagne">
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Overlays */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <MobileNavDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
};
