import { Order } from '../types/order';
import { getStorageItem, setStorageItem } from '../utils/storage';

const ORDERS_KEY = 'velessa_orders_history';

export const orderService = {
  async createOrder(orderPayload: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Promise<Order> {
    await new Promise((r) => setTimeout(r, 600)); // simulate secure gateway confirmation

    const orderNumber = `VEL-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      ...orderPayload,
      id: `ord_${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      trackingNumber: `VLSA-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    };

    const existingOrders = getStorageItem<Order[]>(ORDERS_KEY, []);
    setStorageItem(ORDERS_KEY, [newOrder, ...existingOrders]);

    return newOrder;
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    await new Promise((r) => setTimeout(r, 200));
    const orders = getStorageItem<Order[]>(ORDERS_KEY, []);
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId) || null;
  }
};
