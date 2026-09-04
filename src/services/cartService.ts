import { CartItem, CartSummary, PromoDiscount } from '../types/cart';

const FREE_SHIPPING_THRESHOLD = 250;
const STANDARD_SHIPPING_RATE = 25;
const ESTIMATED_TAX_RATE = 0.05; // 5%

const PROMO_CODES: Record<string, PromoDiscount> = {
  'VELESSA10': {
    code: 'VELESSA10',
    percentage: 10,
    description: '10% Privé Circle Introductory Welcome Offer',
    minSpend: 0
  },
  'VIP15': {
    code: 'VIP15',
    percentage: 15,
    description: '15% Haute Joaillerie Collector Privilege',
    minSpend: 500
  },
  'DIAMOND20': {
    code: 'DIAMOND20',
    percentage: 20,
    description: '20% Fine Jewellery Salon Special',
    minSpend: 1500
  }
};

export const cartService = {
  calculateSummary(items: CartItem[], appliedPromo?: PromoDiscount | null): CartSummary {
    const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    let discount = 0;
    if (appliedPromo) {
      if (!appliedPromo.minSpend || subtotal >= appliedPromo.minSpend) {
        discount = (subtotal * appliedPromo.percentage) / 100;
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_RATE;
    const tax = discountedSubtotal * ESTIMATED_TAX_RATE;
    const total = discountedSubtotal + shipping + tax;

    const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

    return {
      subtotal,
      discount,
      shipping,
      tax,
      total,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      remainingForFreeShipping,
      appliedPromo: appliedPromo || null
    };
  },

  async validatePromoCode(code: string, currentSubtotal: number): Promise<{ promo: PromoDiscount | null; error?: string }> {
    await new Promise((r) => setTimeout(r, 200));
    const upper = code.trim().toUpperCase();
    const promo = PROMO_CODES[upper];

    if (!promo) {
      return { promo: null, error: 'Invalid invitation code' };
    }

    if (promo.minSpend && currentSubtotal < promo.minSpend) {
      return { promo: null, error: `Requires a minimum investment of $${promo.minSpend}` };
    }

    return { promo, error: undefined };
  }
};
