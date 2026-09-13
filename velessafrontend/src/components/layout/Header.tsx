import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, User, LogOut, ChevronDown, Sparkles, Package, Store } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { SearchOverlay } from './SearchOverlay';
import { MobileNavDrawer } from './MobileNavDrawer';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const { openCart, itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const [shopkeeperSession, setShopkeeperSession] = useState<{ name: string; role?: string } | null>(() => {
    try {
      const saved = localStorage.getItem('velessa_shopkeeper_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleAuthSync = () => {
      try {
        const saved = localStorage.getItem('velessa_shopkeeper_session');
        setShopkeeperSession(saved ? JSON.parse(saved) : null);
      } catch {
        setShopkeeperSession(null);
      }
    };
    window.addEventListener('storage', handleAuthSync);
    window.addEventListener('velessa-auth-changed', handleAuthSync);
    return () => {
      window.removeEventListener('storage', handleAuthSync);
      window.removeEventListener('velessa-auth-changed', handleAuthSync);
    };
  }, []);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Header dynamic classes based on scroll and current page
  const headerBackgroundClass = isHomePage
    ? isScrolled
      ? 'bg-ivory/95 backdrop-blur-md shadow-sm border-b border-beige text-charcoal'
      : 'bg-transparent text-charcoal'
    : 'bg-ivory/95 backdrop-blur-md shadow-sm border-b border-beige text-charcoal';

  const navItemClass = (path: string) => {
    const isActive = location.pathname === path;
    return `text-[11px] xl:text-xs uppercase tracking-[0.16em] xl:tracking-[0.2em] font-sans transition-all duration-200 hover:text-champagne relative py-1 whitespace-nowrap ${
      isActive ? 'text-champagne font-medium' : 'text-charcoal/90'
    }`;
  };

  return (
    <>
      {shopkeeperSession && (
        <div className="bg-charcoal text-champagne border-b border-champagne/30 py-1.5 px-4 text-xs z-50 print:hidden">
          <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
            <span className="flex items-center gap-2 text-[11px] font-medium text-ivory">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Atelier Staff Mode: <strong className="text-champagne">{shopkeeperSession.name}</strong></span>
            </span>
            <Link
              to="/shopkeeper"
              className="text-[11px] font-semibold uppercase tracking-wider text-champagne hover:text-ivory flex items-center gap-1.5 transition-colors group"
            >
              <Store className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>Open Shopkeeper Desk →</span>
            </Link>
          </div>
        </div>
      )}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 print:hidden ${headerBackgroundClass}`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center h-16 sm:h-20 lg:h-24">
            {/* Left Zone: Mobile Hamburger or Desktop Left Nav */}
            <div className="flex items-center justify-start">
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
              <nav className="hidden lg:flex items-center gap-5 xl:gap-8">
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
            </div>

            {/* Center Zone: Perfectly Centered Brand Logo */}
            <div className="flex flex-col items-center justify-center text-center px-4 sm:px-8 xl:px-14 shrink-0">
              <Link to="/" className="group flex flex-col items-center">
                <span className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-[0.26em] font-light text-charcoal group-hover:text-champagne transition-colors duration-300">
                  VELESSA
                </span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-champagne font-sans font-medium -mt-1">
                  1 Gram Gold &amp; Imitation
                </span>
              </Link>
            </div>

            {/* Right Zone: Desktop Right Nav & Actions, or Mobile Right Actions */}
            <div className="flex items-center justify-end gap-3 sm:gap-4 xl:gap-6">
              {/* Desktop Right Navigation (About, Contact) */}
              <nav className="hidden lg:flex items-center gap-5 xl:gap-7 mr-1 xl:mr-2">
                <Link to="/about" className={navItemClass('/about')}>
                  About
                </Link>
                <Link to="/contact" className={navItemClass('/contact')}>
                  Contact
                </Link>
              </nav>

              {/* Action Icons */}
              <div className="hidden lg:flex items-center gap-2 sm:gap-3 xl:gap-4">
                {/* Search Button */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-1.5 text-charcoal hover:text-champagne transition-colors relative group"
                  aria-label="Search creations"
                >
                  <Search className="w-5 h-5" />
                  <span className="sr-only">Search</span>
                </button>

                {/* Account Button / Dropdown */}
                {shopkeeperSession ? (
                  <div className="relative" ref={accountMenuRef}>
                    <button
                      onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                      className="hidden sm:flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-champagne/20 hover:bg-champagne/30 border border-champagne text-charcoal transition-all cursor-pointer shadow-xs"
                      aria-label="Shopkeeper Atelier Menu"
                    >
                      <div className="w-5 h-5 rounded-full bg-champagne text-charcoal text-[10px] font-serif font-bold flex items-center justify-center">
                        {shopkeeperSession.name ? shopkeeperSession.name.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <span className="text-xs font-sans font-semibold text-charcoal max-w-[100px] truncate">
                        {shopkeeperSession.name}
                      </span>
                      <span className="text-[9px] bg-charcoal text-champagne px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                        Staff
                      </span>
                      <ChevronDown className={`w-3 h-3 text-champagne transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Shopkeeper Fast Dropdown */}
                    {isAccountMenuOpen && (
                      <div className="absolute right-0 top-full mt-2.5 w-64 bg-white border border-beige shadow-luxury rounded-sm py-3 px-4 z-50 animate-fade-in font-sans">
                        <div className="absolute -top-1.5 right-6 w-3 h-3 bg-white border-t border-l border-beige rotate-45 pointer-events-none" />
                        <div className="border-b border-beige pb-2.5 mb-2">
                          <span className="text-[9px] uppercase tracking-widest text-champagne font-medium flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Atelier Merchant Clearance
                          </span>
                          <p className="font-serif text-base text-charcoal font-medium mt-0.5">
                            {shopkeeperSession.name}
                          </p>
                          <p className="text-[11px] text-charcoal-muted">
                            {shopkeeperSession.role || 'Shopkeeper'}
                          </p>
                        </div>

                        <div className="space-y-1 text-xs text-charcoal">
                          <Link
                            to="/shopkeeper"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 py-2 px-2 hover:bg-amber-50 text-amber-950 rounded-xs transition-colors font-semibold"
                          >
                            <Store className="w-4 h-4 text-champagne-dark" />
                            <span>Open Shopkeeper Desk →</span>
                          </Link>
                        </div>

                        <div className="border-t border-beige pt-2 mt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAccountMenuOpen(false);
                              localStorage.removeItem('velessa_shopkeeper_session');
                              setShopkeeperSession(null);
                              window.dispatchEvent(new Event('velessa-auth-changed'));
                            }}
                            className="w-full flex items-center gap-2.5 py-2 px-2 text-rose-600 hover:bg-rose-50 rounded-xs text-xs font-medium transition-colors cursor-pointer"
                          >
                            <LogOut className="w-4 h-4 text-rose-500" />
                            <span>Log Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : isAuthenticated && user ? (
                  <div className="relative" ref={accountMenuRef}>
                    <button
                      onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                      className="hidden sm:flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-champagne/10 hover:bg-champagne/20 border border-champagne/30 text-charcoal transition-all"
                      aria-label="Account Menu"
                    >
                      <div className="w-5 h-5 rounded-full bg-champagne text-charcoal text-[10px] font-serif font-bold flex items-center justify-center">
                        {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'P'}
                      </div>
                      <span className="text-xs font-sans font-medium text-charcoal max-w-[90px] truncate">
                        {user.firstName}
                      </span>
                      <ChevronDown className={`w-3 h-3 text-champagne transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Luxury Account Dropdown */}
                    {isAccountMenuOpen && (
                      <div className="absolute right-0 top-full mt-2.5 w-64 bg-white border border-beige shadow-luxury rounded-sm py-3 px-4 z-50 animate-fade-in font-sans">
                        {/* Triangle indicator pointing up to the button */}
                        <div className="absolute -top-1.5 right-6 w-3 h-3 bg-white border-t border-l border-beige rotate-45 pointer-events-none" />
                        <div className="border-b border-beige pb-3 mb-2">
                          <span className="text-[9px] uppercase tracking-widest text-champagne font-medium flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {user.tier || 'Privé Circle'}
                          </span>
                          <p className="font-serif text-base text-charcoal font-medium mt-0.5">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-[11px] text-charcoal-muted truncate">
                            {user.email || user.phoneNumber}
                          </p>
                          {user.lastLoginAtUtc && (
                            <p className="text-[10px] text-champagne font-medium mt-1">
                              Last login: {new Date(user.lastLoginAtUtc).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1 text-xs text-charcoal">
                          <Link
                            to="/account"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 py-2 px-2 hover:bg-beige/20 rounded-xs transition-colors"
                          >
                            <User className="w-4 h-4 text-champagne" />
                            <span>My Profile & Account</span>
                          </Link>
                          <Link
                            to="/account#orders"
                            onClick={() => {
                              setIsAccountMenuOpen(false);
                              const el = document.getElementById('orders');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="flex items-center gap-2.5 py-2 px-2 hover:bg-beige/20 rounded-xs transition-colors"
                          >
                            <Package className="w-4 h-4 text-champagne" />
                            <span>My Orders</span>
                          </Link>
                          <Link
                            to="/wishlist"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 py-2 px-2 hover:bg-beige/20 rounded-xs transition-colors"
                          >
                            <Heart className="w-4 h-4 text-champagne" />
                            <span>Saved Creations ({wishlistCount})</span>
                          </Link>
                          {user && (user.role?.toLowerCase() === 'shopkeeper' || user.role?.toLowerCase() === 'admin') && (
                            <Link
                              to="/shopkeeper"
                              onClick={() => setIsAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 py-2 px-2 hover:bg-amber-50 text-amber-900 rounded-xs transition-colors font-medium"
                            >
                              <Store className="w-4 h-4 text-champagne-dark" />
                              <span>Shopkeeper & Inventory Portal</span>
                            </Link>
                          )}
                        </div>

                        <div className="border-t border-beige pt-2 mt-2">
                          <button
                            type="button"
                            onClick={async () => {
                              setIsAccountMenuOpen(false);
                              await logout();
                            }}
                            className="w-full flex items-center gap-2.5 py-2 px-2 text-rose-600 hover:bg-rose-50 rounded-xs text-xs font-medium transition-colors cursor-pointer"
                          >
                            <LogOut className="w-4 h-4 text-rose-500" />
                            <span>Log Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="hidden sm:block p-1.5 text-charcoal hover:text-champagne transition-colors"
                    aria-label="Account"
                  >
                    <User className="w-5 h-5" />
                    <span className="sr-only">Sign In</span>
                  </Link>
                )}

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

              {/* Mobile Sign Up / Account / Logout Actions */}
              <div className="flex items-center lg:hidden gap-1 -mr-1">
                {shopkeeperSession ? (
                  <Link
                    to="/shopkeeper"
                    className="py-1 px-2 rounded-full bg-champagne/20 border border-champagne text-charcoal text-xs font-medium flex items-center gap-1 shadow-xs"
                    aria-label="Shopkeeper Atelier Desk"
                  >
                    <Store className="w-3.5 h-3.5 text-champagne-dark" />
                    <span className="text-[11px] font-semibold">{shopkeeperSession.name?.split(' ')[0]}</span>
                    <span className="text-[9px] bg-charcoal text-champagne px-1 rounded font-bold uppercase">Staff</span>
                  </Link>
                ) : isAuthenticated && user ? (
                  <>
                    <Link
                      to="/account"
                      className="p-1.5 text-charcoal hover:text-champagne transition-colors flex items-center justify-center"
                      aria-label="My Account"
                      title={`Hello, ${user.firstName}`}
                    >
                      <div className="w-6 h-6 rounded-full bg-champagne text-charcoal text-[11px] font-serif font-bold flex items-center justify-center shadow-xs">
                        {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'P'}
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={async () => {
                        await logout();
                      }}
                      className="p-1.5 text-charcoal-muted hover:text-rose-600 transition-colors"
                      title="Log Out"
                      aria-label="Log Out"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="p-2 text-charcoal hover:text-champagne transition-colors flex items-center justify-center"
                    aria-label="Sign In or Sign Up"
                  >
                    <User className="w-5 h-5 stroke-[1.8]" />
                  </Link>
                )}
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
