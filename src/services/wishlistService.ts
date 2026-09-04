import { getStorageItem, setStorageItem } from '../utils/storage';

const STORAGE_KEY = 'velessa_wishlist_ids';

export const wishlistService = {
  async getWishlistProductIds(): Promise<string[]> {
    return getStorageItem<string[]>(STORAGE_KEY, []);
  },

  async toggleWishlistItem(productId: string): Promise<boolean> {
    const list = getStorageItem<string[]>(STORAGE_KEY, []);
    const exists = list.includes(productId);
    let updated: string[];

    if (exists) {
      updated = list.filter((id) => id !== productId);
    } else {
      updated = [...list, productId];
    }

    setStorageItem(STORAGE_KEY, updated);
    return !exists; // returns true if now added, false if removed
  },

  async removeFromWishlist(productId: string): Promise<void> {
    const list = getStorageItem<string[]>(STORAGE_KEY, []);
    const updated = list.filter((id) => id !== productId);
    setStorageItem(STORAGE_KEY, updated);
  }
};
