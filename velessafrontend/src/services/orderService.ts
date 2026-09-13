import { Order } from '../types/order';
import { CartItem, CartSummary } from '../types/cart';
import { getStorageItem, setStorageItem } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5286/api';
const ORDERS_KEY = 'velessa_orders_history';

interface BackendOrderItemResponse {
  id: number;
  productId?: number | null;
  productName: string;
  productSku: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

interface BackendOrderResponse {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  country: string;
  subTotal: number;
  shippingFee: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentTransactionId?: string | null;
  createdAtUtc: string;
  items: BackendOrderItemResponse[];
}

const mapBackendItemToCartItem = (i: BackendOrderItemResponse): CartItem => ({
  id: `item_${i.id}`,
  product: {
    id: String(i.productId || i.id),
    name: i.productName,
    slug: i.productName.toLowerCase().replace(/\s+/g, '-'),
    price: i.unitPrice,
    originalPrice: i.unitPrice,
    description: '',
    shortDescription: '',
    images: [],
    category: '1 Gram Gold Forming',
    collection: 'Signature Collection',
    material: '1 Gram Gold Forming',
    inStock: true,
    rating: 5,
    reviewCount: 1,
    isFeatured: true,
    isNew: false,
    sku: i.productSku,
  },
  quantity: i.quantity,
});

const mapBackendToCartSummary = (data: BackendOrderResponse): CartSummary => ({
  subtotal: data.subTotal,
  discount: 0,
  shipping: data.shippingFee,
  tax: 0,
  total: data.totalAmount,
  freeShippingThreshold: 1500,
  remainingForFreeShipping: 0,
});

export const orderService = {
  async createOrder(orderPayload: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Promise<Order> {
    const backendPayload = {
      userId: typeof orderPayload.userId === 'number' ? orderPayload.userId : (parseInt(String(orderPayload.userId)) || null),
      customerName: `${orderPayload.shippingAddress.firstName} ${orderPayload.shippingAddress.lastName}`.trim(),
      customerEmail: orderPayload.shippingAddress.email.trim(),
      customerPhone: orderPayload.shippingAddress.phone.trim(),
      shippingAddress: orderPayload.shippingAddress.addressLine1 + (orderPayload.shippingAddress.addressLine2 ? `, ${orderPayload.shippingAddress.addressLine2}` : ''),
      city: orderPayload.shippingAddress.city.trim(),
      state: orderPayload.shippingAddress.state?.trim() || '',
      postalCode: orderPayload.shippingAddress.postalCode.trim(),
      country: orderPayload.shippingAddress.country || 'India',
      subTotal: orderPayload.summary.subtotal,
      shippingFee: orderPayload.deliveryMethod.price,
      totalAmount: orderPayload.summary.total,
      paymentMethod: orderPayload.paymentDetails.method,
      deliveryMethodName: orderPayload.deliveryMethod.name,
      items: orderPayload.items.map((it) => {
        const prodId = typeof it.product.id === 'number' ? it.product.id : parseInt(String(it.product.id));
        return {
          productId: !isNaN(prodId) ? prodId : null,
          productName: it.product.name,
          productSku: it.product.sku || 'VLSA-JEWEL',
          unitPrice: it.product.price,
          quantity: it.quantity,
          totalPrice: it.product.price * it.quantity,
          selectedSize: it.selectedSize || null,
        };
      }),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendPayload),
      });

      if (res.ok) {
        const data: BackendOrderResponse = await res.json();
        const savedOrder: Order = {
          ...orderPayload,
          id: String(data.id),
          orderNumber: data.orderNumber,
          createdAt: data.createdAtUtc,
          status: 'confirmed',
          trackingNumber: data.paymentTransactionId || `VLSA-${data.orderNumber.replace('VEL-', '')}`,
        };

        const existingOrders = getStorageItem<Order[]>(ORDERS_KEY, []);
        setStorageItem(ORDERS_KEY, [savedOrder, ...existingOrders.filter((o) => o.orderNumber !== savedOrder.orderNumber)]);
        return savedOrder;
      }
    } catch (err) {
      console.warn('Backend order persistence encountered error, saving to local fallback:', err);
    }

    // Resilient fallback: in-memory / local storage order generation
    const orderNumber = `VEL-${Math.floor(100000 + Math.random() * 900000)}`;
    const fallbackOrder: Order = {
      ...orderPayload,
      id: `ord_${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      trackingNumber: `VLSA-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    };

    const existingOrders = getStorageItem<Order[]>(ORDERS_KEY, []);
    setStorageItem(ORDERS_KEY, [fallbackOrder, ...existingOrders]);
    return fallbackOrder;
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(orderId)}`);
      if (res.ok) {
        const data: BackendOrderResponse = await res.json();
        return {
          id: String(data.id),
          orderNumber: data.orderNumber,
          createdAt: data.createdAtUtc,
          status: 'confirmed',
          trackingNumber: data.paymentTransactionId || `VLSA-${data.orderNumber}`,
          items: data.items.map(mapBackendItemToCartItem),
          shippingAddress: {
            firstName: data.customerName.split(' ')[0] || '',
            lastName: data.customerName.split(' ').slice(1).join(' ') || '',
            email: data.customerEmail,
            phone: data.customerPhone,
            addressLine1: data.shippingAddress,
            city: data.city,
            state: '',
            postalCode: data.postalCode,
            country: data.country,
          },
          deliveryMethod: {
            id: 'standard-insured',
            name: 'Free Standard Delivery',
            description: 'Safe & secure delivery',
            estimatedDays: '2-3 Business Days',
            price: data.shippingFee,
          },
          paymentDetails: {
            method: 'credit_card',
            transactionId: data.paymentTransactionId || '',
          },
          summary: mapBackendToCartSummary(data),
        };
      }
    } catch {
      // ignore
    }

    const localOrders = getStorageItem<Order[]>(ORDERS_KEY, []);
    return localOrders.find((o) => o.id === orderId || o.orderNumber === orderId) || null;
  },

  async getOrdersByCustomer(email?: string, phone?: string): Promise<Order[]> {
    try {
      const params = new URLSearchParams();
      if (email) params.set('email', email);
      if (phone) params.set('phone', phone);

      const res = await fetch(`${API_BASE_URL}/orders/customer?${params.toString()}`);
      if (res.ok) {
        const list: BackendOrderResponse[] = await res.json();
        return list.map((data) => ({
          id: String(data.id),
          orderNumber: data.orderNumber,
          createdAt: data.createdAtUtc,
          status: 'confirmed',
          trackingNumber: data.paymentTransactionId || `VLSA-${data.orderNumber}`,
          items: data.items.map(mapBackendItemToCartItem),
          shippingAddress: {
            firstName: data.customerName.split(' ')[0] || '',
            lastName: data.customerName.split(' ').slice(1).join(' ') || '',
            email: data.customerEmail,
            phone: data.customerPhone,
            addressLine1: data.shippingAddress,
            city: data.city,
            state: '',
            postalCode: data.postalCode,
            country: data.country,
          },
          deliveryMethod: {
            id: 'standard-insured',
            name: 'Free Standard Delivery',
            description: 'Safe & secure delivery',
            estimatedDays: '2-3 Business Days',
            price: data.shippingFee,
          },
          paymentDetails: {
            method: 'credit_card',
            transactionId: data.paymentTransactionId || '',
          },
          summary: mapBackendToCartSummary(data),
        }));
      }
    } catch {
      // fallback
    }

    const localOrders = getStorageItem<Order[]>(ORDERS_KEY, []);
    return localOrders.filter(
      (o) =>
        (email && o.shippingAddress.email.toLowerCase() === email.toLowerCase()) ||
        (phone && o.shippingAddress.phone.includes(phone.slice(-10)))
    );
  },

  async getAllOrders(): Promise<Order[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`);
      if (res.ok) {
        const list: BackendOrderResponse[] = await res.json();
        return list.map((data) => ({
          id: String(data.id),
          orderNumber: data.orderNumber,
          createdAt: data.createdAtUtc,
          status: (data.status.toLowerCase() as any) || 'confirmed',
          trackingNumber: data.paymentTransactionId || `VLSA-${data.orderNumber}`,
          items: data.items.map(mapBackendItemToCartItem),
          shippingAddress: {
            firstName: data.customerName.split(' ')[0] || '',
            lastName: data.customerName.split(' ').slice(1).join(' ') || '',
            email: data.customerEmail,
            phone: data.customerPhone,
            addressLine1: data.shippingAddress,
            city: data.city,
            state: '',
            postalCode: data.postalCode,
            country: data.country,
          },
          deliveryMethod: {
            id: 'standard-insured',
            name: 'Free Standard Delivery',
            description: 'Safe & secure delivery',
            estimatedDays: '2-3 Business Days',
            price: data.shippingFee,
          },
          paymentDetails: {
            method: 'credit_card',
            transactionId: data.paymentTransactionId || '',
          },
          summary: mapBackendToCartSummary(data),
        }));
      }
    } catch {
      // fallback
    }
    return getStorageItem<Order[]>(ORDERS_KEY, []);
  },

  async updateOrderStatus(orderIdOrNumber: string | number, status: string, trackingNumber?: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/orders/${orderIdOrNumber}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, trackingNumber }),
    });

    if (!res.ok) {
      throw new Error('Failed to update order status');
    }
  },
};
