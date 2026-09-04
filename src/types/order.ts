import { CartItem, CartSummary } from './cart';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type DeliveryMethod = {
  id: string;
  name: string;
  description: string;
  estimatedDays: string;
  price: number;
};

export type PaymentMethodType = 'credit_card' | 'apple_pay' | 'wire_transfer' | 'mock_gateway';

export interface PaymentDetails {
  method: PaymentMethodType;
  cardNumber?: string;
  cardHolder?: string;
  expiry?: string;
  cvv?: string;
  transactionId?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  deliveryMethod: DeliveryMethod;
  paymentDetails: PaymentDetails;
  summary: CartSummary;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
  trackingNumber?: string;
}
