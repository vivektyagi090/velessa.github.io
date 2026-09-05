import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, CheckCircle2, ArrowRight, Lock, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { orderService } from '../../services/orderService';
import { ShippingAddress, DeliveryMethod, PaymentDetails, Order } from '../../types/order';
import { formatPrice } from '../../utils/formatters';
import { Button } from '../../components/common/Button';

const DELIVERY_METHODS: DeliveryMethod[] = [
  {
    id: 'standard-insured',
    name: 'Complimentary Insured Courier',
    description: 'Armored discreet luxury packaging with adult signature required.',
    estimatedDays: '2-3 Business Days',
    price: 0,
  },
  {
    id: 'express-whiteglove',
    name: 'White-Glove VIP Courier',
    description: 'Next-day personal hand-delivery with sealed atelier presentation box.',
    estimatedDays: 'Next Business Day',
    price: 999,
  },
];

export const CheckoutPage: React.FC = () => {
  const { items, summary, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Multi-step index: 1: Contact & Shipping, 2: Delivery & Payment, 3: Completed
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Form states
  const [address, setAddress] = useState<ShippingAddress>({
    firstName: 'Eleanor',
    lastName: 'Vance',
    email: 'eleanor.vance@velessa-atelier.com',
    phone: '+1 (555) 234-5678',
    addressLine1: '742 Evergreen Terrace',
    addressLine2: 'Penthouse Suite 14B',
    city: 'New York',
    state: 'NY',
    postalCode: '10021',
    country: 'United States',
  });

  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryMethod>(DELIVERY_METHODS[0]);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'apple_pay' | 'wire_transfer'>('credit_card');
  const [cardDetails, setCardDetails] = useState({
    number: '•••• •••• •••• 4242',
    name: 'Eleanor Vance',
    expiry: '12/28',
    cvv: '888',
  });

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.firstName || !address.lastName || !address.email || !address.addressLine1 || !address.city) {
      showToast('Please complete all required shipping details.', 'error');
      return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      const payment: PaymentDetails = {
        method: paymentMethod,
        cardNumber: cardDetails.number,
        cardHolder: cardDetails.name,
        expiry: cardDetails.expiry,
      };

      const finalSummary = {
        ...summary,
        total: summary.total + selectedDelivery.price,
      };

      const newOrder = await orderService.createOrder({
        items,
        shippingAddress: address,
        deliveryMethod: selectedDelivery,
        paymentDetails: payment,
        summary: finalSummary,
      });

      setCompletedOrder(newOrder);
      clearCart();
      showToast('Order confirmed. Thank you for collecting with Velessa.', 'success', 'Acquisition Confirmed');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      showToast('Order could not be processed. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="min-h-screen bg-ivory py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-beige p-8 sm:p-14 rounded-sm shadow-luxury text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-champagne/15 border border-champagne/40 flex items-center justify-center mx-auto text-champagne">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs uppercase tracking-[0.3em] text-champagne font-sans font-medium block">
              Bespoke Acquisition Confirmed
            </span>

            <h1 className="font-serif text-3xl sm:text-5xl font-light text-charcoal">
              Thank You, {completedOrder.shippingAddress.firstName}
            </h1>

            <p className="text-sm text-charcoal-muted font-sans max-w-md mx-auto leading-relaxed">
              Your order <strong className="text-charcoal font-mono">{completedOrder.orderNumber}</strong> has been secured in our Milan atelier vault. Our master gemologist is preparing your certified packaging.
            </p>

            {/* Order Details Receipt Box */}
            <div className="p-6 bg-beige/25 border border-beige rounded-sm text-left font-sans text-xs space-y-3 max-w-lg mx-auto">
              <div className="flex justify-between border-b border-beige pb-2">
                <span className="text-charcoal-muted">Tracking Code:</span>
                <span className="font-mono font-semibold text-charcoal">{completedOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between border-b border-beige pb-2">
                <span className="text-charcoal-muted">Delivery Service:</span>
                <span className="font-medium text-charcoal">{completedOrder.deliveryMethod.name}</span>
              </div>
              <div className="flex justify-between border-b border-beige pb-2">
                <span className="text-charcoal-muted">Destination:</span>
                <span className="font-medium text-charcoal">{completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.country}</span>
              </div>
              <div className="flex justify-between font-serif text-sm font-medium pt-1">
                <span>Total Investment:</span>
                <span className="font-sans">{formatPrice(completedOrder.summary.total)}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/shop">
                <Button variant="primary" size="lg">
                  Explore More Creations
                </Button>
              </Link>
              <Link to="/">
                <Button variant="secondary" size="lg">
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-ivory flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-serif text-3xl text-charcoal mb-3">No Items to Checkout</h2>
        <p className="text-xs text-charcoal-muted font-sans mb-6">
          Your shopping bag is currently empty. Please add creations before proceeding.
        </p>
        <Link to="/shop">
          <Button variant="primary" size="md">
            Browse Catalogue
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pb-24">
      {/* Checkout Brand Header */}
      <div className="bg-white border-b border-beige py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex flex-col">
            <span className="font-serif text-2xl tracking-[0.25em] font-light text-charcoal">
              VELESSA
            </span>
            <span className="text-[8px] uppercase tracking-[0.3em] text-champagne font-sans font-medium">
              Secure Checkout
            </span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-sans text-charcoal-muted">
            <Lock className="w-3.5 h-3.5 text-champagne" />
            <span>256-Bit SSL Encrypted Salon</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Step Progression */}
        <div className="flex items-center justify-center gap-4 text-xs font-sans uppercase tracking-[0.2em] mb-10">
          <button
            onClick={() => setCurrentStep(1)}
            className={`pb-2 border-b-2 font-medium transition-colors ${
              currentStep === 1
                ? 'border-champagne text-charcoal'
                : 'border-transparent text-charcoal-muted'
            }`}
          >
            1. Shipping & Address
          </button>
          <span className="text-beige-dark pb-2">•</span>
          <button
            onClick={() => setCurrentStep(2)}
            className={`pb-2 border-b-2 font-medium transition-colors ${
              currentStep === 2
                ? 'border-champagne text-charcoal'
                : 'border-transparent text-charcoal-muted'
            }`}
          >
            2. Delivery & Payment
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Main Form Column */}
          <div className="lg:col-span-7 space-y-8">
            {currentStep === 1 ? (
              /* Step 1: Contact & Shipping */
              <form onSubmit={handleNextStep} className="bg-white border border-beige p-6 sm:p-8 rounded-sm shadow-sm space-y-6">
                <h3 className="font-serif text-2xl text-charcoal font-normal pb-3 border-b border-beige">
                  Contact & Delivery Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  <div>
                    <label className="block text-charcoal-muted mb-1 uppercase tracking-wider">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.firstName}
                      onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
                      className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
                    />
                  </div>
                  <div>
                    <label className="block text-charcoal-muted mb-1 uppercase tracking-wider">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.lastName}
                      onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
                      className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  <div>
                    <label className="block text-charcoal-muted mb-1 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={address.email}
                      onChange={(e) => setAddress({ ...address, email: e.target.value })}
                      className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
                    />
                  </div>
                  <div>
                    <label className="block text-charcoal-muted mb-1 uppercase tracking-wider">
                      Phone Number (for insured courier) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
                    />
                  </div>
                </div>

                <div className="space-y-4 text-xs font-sans">
                  <div>
                    <label className="block text-charcoal-muted mb-1 uppercase tracking-wider">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.addressLine1}
                      onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                      placeholder="Street address and house or building number"
                      className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
                    />
                  </div>
                  <div>
                    <label className="block text-charcoal-muted mb-1 uppercase tracking-wider">
                      Apartment, Suite, Unit (optional)
                    </label>
                    <input
                      type="text"
                      value={address.addressLine2}
                      onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                      placeholder="e.g. Penthouse 4B"
                      className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-sans">
                  <div>
                    <label className="block text-charcoal-muted mb-1 uppercase tracking-wider">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
                    />
                  </div>
                  <div>
                    <label className="block text-charcoal-muted mb-1 uppercase tracking-wider">
                      State / Region *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-charcoal-muted mb-1 uppercase tracking-wider">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <Link
                    to="/cart"
                    className="text-xs uppercase tracking-wider text-charcoal-muted hover:text-champagne font-sans"
                  >
                    ← Return to Bag
                  </Link>
                  <Button type="submit" variant="primary" size="lg" className="flex items-center gap-2">
                    <span>Continue to Delivery & Payment</span>
                    <ArrowRight className="w-4 h-4 text-champagne" />
                  </Button>
                </div>
              </form>
            ) : (
              /* Step 2: Delivery Method & Payment */
              <div className="space-y-6">
                {/* Delivery Method Selector */}
                <div className="bg-white border border-beige p-6 sm:p-8 rounded-sm shadow-sm space-y-4">
                  <h3 className="font-serif text-2xl text-charcoal font-normal pb-3 border-b border-beige">
                    Armored Delivery Service
                  </h3>

                  <div className="space-y-3 font-sans text-xs">
                    {DELIVERY_METHODS.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-start justify-between p-4 border rounded-sm cursor-pointer transition-all ${
                          selectedDelivery.id === method.id
                            ? 'border-champagne bg-champagne/10'
                            : 'border-beige hover:border-charcoal/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            checked={selectedDelivery.id === method.id}
                            onChange={() => setSelectedDelivery(method)}
                            className="accent-champagne mt-0.5"
                          />
                          <div>
                            <span className="font-medium text-charcoal block text-sm">
                              {method.name}
                            </span>
                            <span className="text-charcoal-muted mt-0.5 block leading-relaxed">
                              {method.description}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-champagne font-semibold mt-1 block">
                              Estimated: {method.estimatedDays}
                            </span>
                          </div>
                        </div>
                        <span className="font-semibold text-charcoal">
                          {method.price === 0 ? 'Complimentary' : formatPrice(method.price)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mock Payment Interface */}
                <div className="bg-white border border-beige p-6 sm:p-8 rounded-sm shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-beige">
                    <h3 className="font-serif text-2xl text-charcoal font-normal">
                      Payment Privilege
                    </h3>
                    <span className="text-[10px] uppercase tracking-wider text-champagne font-sans font-medium">
                      Sandbox Demo Mode
                    </span>
                  </div>

                  {/* Payment Method Tabs */}
                  <div className="grid grid-cols-3 gap-2 font-sans text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit_card')}
                      className={`py-3 px-2 border text-center transition-all ${
                        paymentMethod === 'credit_card'
                          ? 'border-charcoal bg-charcoal text-ivory'
                          : 'border-beige bg-white text-charcoal hover:border-champagne'
                      }`}
                    >
                      Credit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('apple_pay')}
                      className={`py-3 px-2 border text-center transition-all ${
                        paymentMethod === 'apple_pay'
                          ? 'border-charcoal bg-charcoal text-ivory'
                          : 'border-beige bg-white text-charcoal hover:border-champagne'
                      }`}
                    >
                      Apple / Google Pay
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('wire_transfer')}
                      className={`py-3 px-2 border text-center transition-all ${
                        paymentMethod === 'wire_transfer'
                          ? 'border-charcoal bg-charcoal text-ivory'
                          : 'border-beige bg-white text-charcoal hover:border-champagne'
                      }`}
                    >
                      Private Bank Wire
                    </button>
                  </div>

                  {/* Credit Card Form Fields */}
                  {paymentMethod === 'credit_card' && (
                    <div className="space-y-4 text-xs font-sans pt-2">
                      <div>
                        <label className="block text-charcoal-muted mb-1 uppercase tracking-wider">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                          className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
                        />
                      </div>
                      <div>
                        <label className="block text-charcoal-muted mb-1 uppercase tracking-wider">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardDetails.number}
                            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                            className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne font-mono"
                          />
                          <CreditCard className="w-4 h-4 text-charcoal-muted absolute right-3 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-charcoal-muted mb-1 uppercase tracking-wider">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
                          />
                        </div>
                        <div>
                          <label className="block text-charcoal-muted mb-1 uppercase tracking-wider">
                            Security CVV
                          </label>
                          <input
                            type="password"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'apple_pay' && (
                    <div className="p-6 bg-beige/20 text-center rounded-sm space-y-2">
                      <p className="text-xs font-sans text-charcoal-muted">
                        Simulated Apple Pay / Google Pay one-touch authentication will execute when placing order.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'wire_transfer' && (
                    <div className="p-6 bg-beige/20 text-center rounded-sm space-y-2">
                      <p className="text-xs font-sans text-charcoal-muted">
                        Our salon concierge will dispatch private Swiss and London routing instructions upon confirmation.
                      </p>
                    </div>
                  )}

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs uppercase tracking-wider text-charcoal-muted hover:text-champagne font-sans"
                    >
                      ← Back to Shipping
                    </button>
                    <Button
                      type="button"
                      variant="gold"
                      size="lg"
                      isLoading={isProcessing}
                      onClick={handlePlaceOrder}
                      className="shadow-gold-glow flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Authorize Acquisition • {formatPrice(summary.total + selectedDelivery.price)}</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-beige p-6 sm:p-8 rounded-sm shadow-sm space-y-6">
              <h3 className="font-serif text-2xl text-charcoal font-normal pb-4 border-b border-beige">
                Acquisition Summary ({items.length})
              </h3>

              {/* Items preview list */}
              <div className="divide-y divide-beige max-h-72 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="py-3 flex gap-3 items-center">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-xs border border-beige shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-xs text-charcoal truncate font-normal">
                        {item.product.name}
                      </h4>
                      <span className="text-[10px] text-charcoal-muted font-sans">
                        Qty: {item.quantity} {item.selectedSize ? `• ${item.selectedSize}` : ''}
                      </span>
                    </div>
                    <span className="text-xs font-sans font-medium text-charcoal shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="space-y-2.5 pt-4 border-t border-beige text-xs font-sans">
                <div className="flex justify-between text-charcoal-muted">
                  <span>Subtotal</span>
                  <span className="text-charcoal font-medium">{formatPrice(summary.subtotal)}</span>
                </div>
                {summary.discount > 0 && (
                  <div className="flex justify-between text-champagne-dark font-medium">
                    <span>Privé Privilege</span>
                    <span>-{formatPrice(summary.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-charcoal-muted">
                  <span>Insured Courier</span>
                  <span className="text-charcoal font-medium">
                    {selectedDelivery.price === 0 ? 'Complimentary' : formatPrice(selectedDelivery.price)}
                  </span>
                </div>
                <div className="flex justify-between text-charcoal-muted">
                  <span>Sales Tax (5%)</span>
                  <span className="text-charcoal font-medium">{formatPrice(summary.tax)}</span>
                </div>
                <div className="pt-3 border-t border-beige flex justify-between text-base font-serif font-medium text-charcoal">
                  <span>Total Amount</span>
                  <span>{formatPrice(summary.total + selectedDelivery.price)}</span>
                </div>
              </div>

              {/* Assurance Trust Badges */}
              <div className="pt-4 border-t border-beige space-y-2 text-[11px] text-charcoal-muted font-sans">
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-champagne" />
                  <span>Insured discreet packaging with seal</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-champagne" />
                  <span>Complimentary 30-day resizing policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
