import { Product } from './product';

export interface CartItem {
  id: string; // unique item id, often `${product.id}-${selectedSize || 'default'}`
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedMaterial?: string;
}

export interface PromoDiscount {
  code: string;
  percentage: number;
  description: string;
  minSpend?: number;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
  appliedPromo?: PromoDiscount | null;
}
