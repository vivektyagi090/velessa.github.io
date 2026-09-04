import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product } from '../types/product';
import { CartItem, CartSummary, PromoDiscount } from '../types/cart';
import { cartService } from '../services/cartService';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  summary: CartSummary;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, quantity?: number, selectedSize?: string, selectedMaterial?: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removePromoCode: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'velessa_cart_items';
const PROMO_STORAGE_KEY = 'velessa_applied_promo';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => getStorageItem<CartItem[]>(CART_STORAGE_KEY, []));
  const [appliedPromo, setAppliedPromo] = useState<PromoDiscount | null>(() =>
    getStorageItem<PromoDiscount | null>(PROMO_STORAGE_KEY, null)
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setStorageItem(CART_STORAGE_KEY, items);
  }, [items]);

  useEffect(() => {
    setStorageItem(PROMO_STORAGE_KEY, appliedPromo);
  }, [appliedPromo]);

  const summary = useMemo(() => {
    return cartService.calculateSummary(items, appliedPromo);
  }, [items, appliedPromo]);

  const itemCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addItem = (product: Product, quantity: number = 1, selectedSize?: string, selectedMaterial?: string) => {
    const size = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard');
    const material = selectedMaterial || (typeof product.material === 'string' ? product.material : 'Standard');
    const cartItemId = `${product.id}-${size}-${material}`;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            id: cartItemId,
            product,
            quantity,
            selectedSize: size,
            selectedMaterial: material,
          },
        ];
      }
    });

    showToast(`"${product.name}" added to your bag.`, 'success', 'Added to Shopping Bag');
    setIsCartOpen(true);
  };

  const removeItem = (cartItemId: string) => {
    const itemToRemove = items.find((i) => i.id === cartItemId);
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
    if (itemToRemove) {
      showToast(`Removed from your shopping bag.`, 'info');
    }
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromo(null);
  };

  const applyPromoCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    const res = await cartService.validatePromoCode(code, summary.subtotal);
    if (res.promo) {
      setAppliedPromo(res.promo);
      showToast(`${res.promo.description} has been applied.`, 'success', 'Privilege Applied');
      return { success: true, message: 'Promo code applied successfully' };
    } else {
      showToast(res.error || 'Invalid code', 'error', 'Error');
      return { success: false, message: res.error || 'Invalid code' };
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    showToast('Promo code removed', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        summary,
        isCartOpen,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
