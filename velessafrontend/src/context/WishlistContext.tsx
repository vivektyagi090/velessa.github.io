import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types/product';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage';
import { PRODUCTS } from '../data/products';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistProducts: Product[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const getWishlistKey = (userId?: string | number | null): string => {
  return userId ? `velessa_wishlist_${userId}` : 'velessa_wishlist_guest';
};

// Purge any legacy dummy mock seeds ('vel-001', 'vel-003') from previous templates
const purgeDummySeeds = () => {
  if (typeof window === 'undefined') return;
  const dummySeeds = ['vel-001', 'vel-003'];
  const keysToInspect: string[] = ['velessa_wishlist_items', 'velessa_wishlist_ids', 'velessa_wishlist_guest'];

  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith('velessa_wishlist') && !keysToInspect.includes(k)) {
      keysToInspect.push(k);
    }
  }

  for (const k of keysToInspect) {
    try {
      const raw = window.localStorage.getItem(k);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const onlyDummy = parsed.length > 0 && parsed.every((id: string) => dummySeeds.includes(id));
          if (onlyDummy) {
            window.localStorage.removeItem(k);
          } else {
            const filtered = parsed.filter((id: string) => !dummySeeds.includes(id));
            if (filtered.length !== parsed.length) {
              window.localStorage.setItem(k, JSON.stringify(filtered));
            }
          }
        }
      }
    } catch {
      window.localStorage.removeItem(k);
    }
  }
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    purgeDummySeeds();
    const key = getWishlistKey(user?.id);
    const stored = getStorageItem<string[]>(key, []);
    return Array.isArray(stored) ? stored.filter((id) => id !== 'vel-001' && id !== 'vel-003') : [];
  });

  const { showToast } = useToast();

  // Switch wishlist when user logs in or out without race conditions
  useEffect(() => {
    purgeDummySeeds();
    const key = getWishlistKey(user?.id);
    const stored = getStorageItem<string[]>(key, []);
    const clean = Array.isArray(stored) ? stored.filter((id) => id !== 'vel-001' && id !== 'vel-003') : [];
    setWishlistIds(clean);
  }, [user?.id]);

  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));
  const wishlistCount = wishlistIds.length;

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  const toggleWishlist = (product: Product) => {
    const exists = wishlistIds.includes(product.id);
    const key = getWishlistKey(user?.id);
    if (exists) {
      const updated = wishlistIds.filter((id) => id !== product.id);
      setWishlistIds(updated);
      setStorageItem(key, updated);
      showToast(`"${product.name}" removed from your wishlist.`, 'info');
    } else {
      const updated = [...wishlistIds, product.id];
      setWishlistIds(updated);
      setStorageItem(key, updated);
      showToast(`"${product.name}" saved to your wishlist.`, 'success', 'Added to Wishlist');
    }
  };

  const removeFromWishlist = (productId: string) => {
    const p = PRODUCTS.find((item) => item.id === productId);
    const key = getWishlistKey(user?.id);
    const updated = wishlistIds.filter((id) => id !== productId);
    setWishlistIds(updated);
    setStorageItem(key, updated);
    if (p) {
      showToast(`"${p.name}" removed from your wishlist.`, 'info');
    }
  };

  const clearWishlist = () => {
    const key = getWishlistKey(user?.id);
    setWishlistIds([]);
    removeStorageItem(key);
    showToast('Your wishlist has been cleared.', 'info');
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistProducts,
        wishlistCount,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
