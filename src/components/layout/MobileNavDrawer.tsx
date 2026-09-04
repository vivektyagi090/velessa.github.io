import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ChevronRight, Heart, ShoppingBag, User, Phone, Sparkles } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../data/categories';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ isOpen, onClose }) => {
  const { wishlistCount } = useWishlist();
  const { itemCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNav = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-sm bg-ivory text-charcoal h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto animate-fade-in border-r border-champagne/30">
        <div>
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-beige">
            <div className="flex flex-col">
              <span className="font-serif text-2xl tracking-[0.25em] font-light text-charcoal">
                VELESSA
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-champagne font-sans font-medium">
                Haute Joaillerie
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-charcoal-muted hover:text-champagne transition-colors"
              aria-label="Close navigation"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Quick Info */}
          <div className="px-6 py-3 bg-beige/30 border-b border-beige flex items-center justify-between text-xs font-sans">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-champagne" />
              <span>{isAuthenticated && user ? `Hello, ${user.firstName}` : 'Velessa Privé Circle'}</span>
            </div>
            <Link
              to={isAuthenticated ? '/account' : '/login'}
              onClick={onClose}
              className="text-champagne font-medium hover:underline"
            >
              {isAuthenticated ? 'My Profile' : 'Sign In'}
            </Link>
          </div>

          {/* Primary Nav Links */}
          <div className="px-6 py-6 space-y-4">
            <button
              onClick={() => handleNav('/')}
              className="w-full text-left font-serif text-xl hover:text-champagne transition-colors tracking-wide"
            >
              Home
            </button>
            <button
              onClick={() => handleNav('/shop')}
              className="w-full text-left font-serif text-xl hover:text-champagne transition-colors tracking-wide flex items-center justify-between"
            >
              <span>Shop All Creations</span>
              <ChevronRight className="w-4 h-4 text-champagne" />
            </button>
            <button
              onClick={() => handleNav('/collections')}
              className="w-full text-left font-serif text-xl hover:text-champagne transition-colors tracking-wide flex items-center justify-between"
            >
              <span>Collections</span>
              <ChevronRight className="w-4 h-4 text-champagne" />
            </button>
            <button
              onClick={() => handleNav('/shop?filter=new')}
              className="w-full text-left font-serif text-xl hover:text-champagne transition-colors tracking-wide flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                New Arrivals
                <span className="text-[10px] uppercase font-sans tracking-widest px-2 py-0.5 bg-champagne text-charcoal font-semibold rounded-full">
                  New
                </span>
              </span>
            </button>
            <button
              onClick={() => handleNav('/about')}
              className="w-full text-left font-serif text-xl hover:text-champagne transition-colors tracking-wide"
            >
              About The Atelier
            </button>
            <button
              onClick={() => handleNav('/contact')}
              className="w-full text-left font-serif text-xl hover:text-champagne transition-colors tracking-wide"
            >
              Concierge & Contact
            </button>
          </div>

          {/* Categories Grid */}
          <div className="px-6 pt-4 pb-6 border-t border-beige">
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-champagne font-sans font-semibold mb-3">
              Browse by Category
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleNav(`/shop?category=${cat.name}`)}
                  className="text-left text-xs uppercase tracking-wider font-sans text-charcoal hover:text-champagne py-2 px-3 bg-white/50 border border-beige/60 rounded-sm hover:border-champagne transition-all flex items-center justify-between"
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="p-6 border-t border-beige bg-beige-light/40 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleNav('/wishlist')}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-beige text-xs uppercase tracking-wider font-sans text-charcoal hover:text-champagne transition-colors"
            >
              <Heart className="w-4 h-4 text-champagne" />
              <span>Wishlist ({wishlistCount})</span>
            </button>

            <button
              onClick={() => handleNav('/cart')}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-charcoal text-ivory text-xs uppercase tracking-wider font-sans hover:bg-black transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-champagne" />
              <span>Bag ({itemCount})</span>
            </button>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-charcoal-muted font-sans">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-champagne" />
              <span>+1 (800) 835-3772</span>
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-champagne" />
              <span>Private Appointments</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
