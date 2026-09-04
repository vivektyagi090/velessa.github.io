import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types/product';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { PRODUCTS } from '../data/products';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistProducts: Product[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
const WISHLIST_STORAGE_KEY = 'velessa_wishlist_items';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() =>
    getStorageItem<string[]>(WISHLIST_STORAGE_KEY, ['vel-001', 'vel-003'])
  );
  const { showToast } = useToast();

  useEffect(() => {
    setStorageItem(WISHLIST_STORAGE_KEY, wishlistIds);
  }, [wishlistIds]);

  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));
  const wishlistCount = wishlistIds.length;

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  const toggleWishlist = (product: Product) => {
    const exists = wishlistIds.includes(product.id);
    if (exists) {
      setWishlistIds((prev) => prev.filter((id) => id !== product.id));
      showToast(`"${product.name}" removed from your wishlist.`, 'info');
    } else {
      setWishlistIds((prev) => [...prev, product.id]);
      showToast(`"${product.name}" saved to your wishlist.`, 'success', 'Added to Wishlist');
    }
  };

  const removeFromWishlist = (productId: string) => {
    const p = PRODUCTS.find((item) => item.id === productId);
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
    if (p) {
      showToast(`"${p.name}" removed from your wishlist.`, 'info');
    }
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
