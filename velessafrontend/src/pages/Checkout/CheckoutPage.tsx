import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, CheckCircle2, ArrowRight, Lock, Sparkles, User as UserIcon, Phone, Loader2, KeyRound } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { cartService } from '../../services/cartService';
import { authService } from '../../services/authService';
import { Modal } from '../../components/common/Modal';
import { CartItem } from '../../types/cart';
import { ShippingAddress, DeliveryMethod, PaymentDetails, Order } from '../../types/order';
import { formatPrice } from '../../utils/formatters';
import { Button } from '../../components/common/Button';

const DELIVERY_METHODS: DeliveryMethod[] = [
  {
    id: 'standard-insured',
    name: 'Free Standard Delivery',
    description: 'Safe, tamper-proof packaging with insured tracking.',
    estimatedDays: '2-3 Business Days',
    price: 0,
  },
  {
    id: 'express-courier',
    name: 'Express Delivery',
    description: 'Next-day fast delivery in a premium sealed jewellery gift box.',
    estimatedDays: 'Next Business Day',
    price: 999,
  },
];

export const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const directBuyItem = location.state?.directBuyItem as CartItem | undefined;
  const { items: bagItems, summary: bagSummary, clearCart, removeItem } = useCart();

  const items = useMemo(() => {
    return directBuyItem ? [directBuyItem] : bagItems;
  }, [directBuyItem, bagItems]);

  const summary = useMemo(() => {
    if (directBuyItem) {
      return cartService.calculateSummary([directBuyItem], null);
    }
    return bagSummary;
  }, [directBuyItem, bagSummary]);

  const { showToast } = useToast();
  const { user, isAuthenticated, checkoutVerifyPhone } = useAuth();
  const navigate = useNavigate();

  // Multi-step index: 1: Contact & Shipping, 2: Delivery & Payment, 3: Completed
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Mobile OTP verification modal states
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Form states - initialized with logged-in user details or user's saved address
  const [address, setAddress] = useState<ShippingAddress>(() => {
    // Only load saved shipping address if a user is actively authenticated
    const currentUser = user || authService.getCurrentUser();
    if (currentUser) {
      const userSavedKey = `velessa_saved_shipping_address_${currentUser.id}`;
      const saved = localStorage.getItem(userSavedKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            ...parsed,
            firstName: currentUser.firstName || parsed.firstName || '',
            lastName: currentUser.lastName || parsed.lastName || '',
            email: currentUser.email || parsed.email || '',
            phone: currentUser.phoneNumber || currentUser.phone || parsed.phone || '',
            country: parsed.country || 'India',
          };
        } catch {
          // fallback
        }
      }
      return {
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phoneNumber || currentUser.phone || '',
        addressLine1: currentUser.address || '',
        addressLine2: '',
        city: currentUser.city || '',
        state: currentUser.state || '',
        postalCode: currentUser.postalCode || '',
        country: currentUser.country || 'India',
      };
    }
    // For guest users, ALWAYS start with a clean empty form
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
    };
  });

  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryMethod>(DELIVERY_METHODS[0]);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'apple_pay' | 'wire_transfer'>('credit_card');
  const [cardDetails, setCardDetails] = useState(() => ({
    number: '•••• •••• •••• 4242',
    name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
    expiry: '12/28',
    cvv: '888',
  }));

  // Automatically populate or reset whenever the authenticated user state changes
  useEffect(() => {
    if (user) {
      const userSavedKey = `velessa_saved_shipping_address_${user.id}`;
      let parsedSaved: Partial<ShippingAddress> = {};
      try {
        const saved = localStorage.getItem(userSavedKey);
        if (saved) parsedSaved = JSON.parse(saved);
      } catch {
        // ignore
      }

      setAddress((prev) => ({
        firstName: user.firstName || parsedSaved.firstName || prev.firstName,
        lastName: user.lastName || parsedSaved.lastName || prev.lastName,
        email: user.email || parsedSaved.email || prev.email,
        phone: user.phoneNumber || user.phone || parsedSaved.phone || prev.phone,
        addressLine1: parsedSaved.addressLine1 || user.address || prev.addressLine1,
        addressLine2: parsedSaved.addressLine2 || prev.addressLine2,
        city: parsedSaved.city || user.city || prev.city,
        state: parsedSaved.state || user.state || prev.state,
        postalCode: parsedSaved.postalCode || user.postalCode || prev.postalCode,
        country: parsedSaved.country || user.country || prev.country || 'India',
      }));
      setCardDetails((prev) => ({
        ...prev,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || prev.name,
      }));
    } else {
      // Patron logged out: clean out all previous user details
      setAddress({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
      });
      setCardDetails((prev) => ({
        ...prev,
        name: '',
      }));
    }
  }, [user]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const triggerSendOtp = async (phoneToVerify: string) => {
    setIsSendingOtp(true);
    setOtpError(null);
    try {
      const res = await authService.sendOtp(phoneToVerify);
      if (res.devOtp) {
        setDevOtpCode(res.devOtp);
      }
      setOtpTimer(60);
      setIsOtpModalOpen(true);
      showToast(res.message || 'Verification code dispatched.', 'info', 'OTP Dispatched');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not dispatch verification code.';
      setOtpError(msg);
      showToast(msg, 'error');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setOtpError('Please enter the 6-digit verification code.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError(null);
    try {
      const authenticatedUser = await checkoutVerifyPhone(
        address.phone,
        otpCode.trim(),
        address.firstName,
        address.lastName,
        address.email
      );
      if (authenticatedUser?.id) {
        try {
          localStorage.setItem(`velessa_saved_shipping_address_${authenticatedUser.id}`, JSON.stringify(address));
        } catch {
          // ignore
        }
      }
      try {
        localStorage.removeItem('velessa_saved_shipping_address');
      } catch {
        // ignore
      }
      setIsOtpModalOpen(false);
      setOtpCode('');
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid or expired OTP code.';
      setOtpError(msg);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.firstName || !address.lastName || !address.email || !address.addressLine1 || !address.city || !address.phone) {
      showToast('Please complete all required shipping details.', 'error');
      return;
    }

    const cleanedPhone = address.phone.replace(/\D/g, '');
    if (cleanedPhone.length < 10) {
      showToast('Please provide a valid 10-digit mobile number for order dispatch.', 'error');
      return;
    }

    if (user?.id) {
      try {
        localStorage.setItem(`velessa_saved_shipping_address_${user.id}`, JSON.stringify(address));
      } catch {
        // storage unavailable
      }
    }
    try {
      localStorage.removeItem('velessa_saved_shipping_address');
    } catch {
      // ignore
    }

    // If user is not yet logged in, verify mobile number to authenticate and keep logged in
    if (!isAuthenticated) {
      await triggerSendOtp(address.phone);
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
        userId: user?.id,
        items,
        shippingAddress: address,
        deliveryMethod: selectedDelivery,
        paymentDetails: payment,
        summary: finalSummary,
      });

      setCompletedOrder(newOrder);
      if (directBuyItem) {
        removeItem(directBuyItem.id);
      } else {
        clearCart();
      }
      showToast('Order placed successfully! Thank you for shopping with Velessa.', 'success', 'Order Confirmed');
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
              Order Confirmed!
            </span>

            <h1 className="font-serif text-3xl sm:text-5xl font-light text-charcoal">
              Thank You, {user?.firstName || completedOrder.shippingAddress.firstName}
            </h1>

            {/* Logged in Active Member Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                Account Active &amp; Logged In: <strong>{user?.firstName || completedOrder.shippingAddress.firstName} {user?.lastName || completedOrder.shippingAddress.lastName}</strong> ({user?.phoneNumber || completedOrder.shippingAddress.phone})
              </span>
            </div>

            <p className="text-sm text-charcoal-muted font-sans max-w-md mx-auto leading-relaxed">
              Your order <strong className="text-charcoal font-mono">{completedOrder.orderNumber}</strong> has been confirmed and packed. Our team is preparing your package for express dispatch.
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
                <span>Total Amount:</span>
                <span className="font-sans">{formatPrice(completedOrder.summary.total)}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link to="/shop">
                <Button variant="primary" size="lg">
                  Continue Shopping
                </Button>
              </Link>
              <Link to="/account">
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-champagne" />
                  <span>View My Account &amp; Orders</span>
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="lg">
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
            <span>256-Bit SSL Encrypted Checkout</span>
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-beige gap-2">
                  <h3 className="font-serif text-2xl text-charcoal font-normal">
                    Contact & Delivery Details
                  </h3>
                  {isAuthenticated && (
                    <span className="self-start sm:self-auto text-[10px] uppercase font-bold tracking-wider text-champagne-dark bg-champagne/15 px-2.5 py-1 rounded-xs border border-champagne/30">
                      Logged-in Patron Auto-Filled
                    </span>
                  )}
                </div>

                {/* Logged in User Identification Card */}
                {isAuthenticated && user ? (
                  <div className="bg-[#FAF7F2] border border-champagne/40 p-3 sm:p-4 rounded-sm flex items-center justify-between gap-3 text-xs font-sans">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-champagne/20 text-champagne-dark font-serif font-bold text-base flex items-center justify-center shrink-0 border border-champagne/40">
                        {user.firstName?.charAt(0) || 'V'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-charcoal truncate">
                          Delivering for <span className="text-champagne-dark">{user.firstName} {user.lastName}</span>
                        </p>
                        <p className="text-[11px] text-charcoal-muted truncate">
                          {user.email} {user.phoneNumber ? `• ${user.phoneNumber}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted bg-white px-2 py-0.5 rounded-xs border border-beige shrink-0">
                      Verified Member
                    </span>
                  </div>
                ) : (
                  <div className="bg-[#FAF8F5] p-3 rounded-sm border border-beige text-xs text-charcoal-muted flex items-center justify-between">
                    <span>Already have an account with Velessa?</span>
                    <Link to="/login" className="text-champagne-dark font-medium underline hover:text-charcoal transition-colors">
                      Sign In for Express Checkout →
                    </Link>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  <div>
                    <label className="block text-charcoal-muted mb-1 uppercase tracking-wider">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="First Name"
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
                      placeholder="Last Name"
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
                      placeholder="name@example.com"
                      value={address.email}
                      onChange={(e) => setAddress({ ...address, email: e.target.value })}
                      className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
                    />
                  </div>
                  <div>
                    <label className="block text-charcoal-muted mb-1 uppercase tracking-wider">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
                    />
                    {!isAuthenticated && (
                      <p className="text-[11px] text-charcoal-muted mt-1.5 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-champagne shrink-0" />
                        <span>A 6-digit OTP will verify your mobile number and log you in automatically.</span>
                      </p>
                    )}
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
                      placeholder="e.g. Mumbai"
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
                      placeholder="e.g. Maharashtra"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-charcoal-muted mb-1 uppercase tracking-wider">
                      PIN / Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 400001"
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
                    ← Return to Cart
                  </Link>
                  <Button type="submit" variant="primary" size="lg" className="flex items-center gap-2" disabled={isSendingOtp}>
                    {isSendingOtp ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-champagne" />
                        <span>Sending Verification Code...</span>
                      </>
                    ) : (
                      <>
                        <span>{isAuthenticated ? 'Continue to Delivery & Payment' : 'Verify Mobile & Continue'}</span>
                        <ArrowRight className="w-4 h-4 text-champagne" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              /* Step 2: Delivery Method & Payment */
              <div className="space-y-6">
                {/* Delivery Method Selector */}
                <div className="bg-white border border-beige p-6 sm:p-8 rounded-sm shadow-sm space-y-4">
                  <h3 className="font-serif text-2xl text-charcoal font-normal pb-3 border-b border-beige">
                    Delivery Options
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
                          {method.price === 0 ? 'Free' : formatPrice(method.price)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mock Payment Interface */}
                <div className="bg-white border border-beige p-6 sm:p-8 rounded-sm shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-beige">
                    <h3 className="font-serif text-2xl text-charcoal font-normal">
                      Payment Method
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
                      Credit / Debit Card
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
                      UPI / Google Pay
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
                      Net Banking
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
                        Pay securely using Google Pay, PhonePe, Paytm, or any UPI app. (Demo Mode: Instant simulated approval).
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'wire_transfer' && (
                    <div className="p-6 bg-beige/20 text-center rounded-sm space-y-2">
                      <p className="text-xs font-sans text-charcoal-muted">
                        Pay directly using Net Banking via all major Indian banks (SBI, HDFC, ICICI, Axis).
                      </p>
                    </div>
                  )}

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs uppercase tracking-wider text-charcoal-muted hover:text-champagne font-sans"
                    >
                      ← Back to Shipping Details
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
                      <span>Place Order &amp; Pay • {formatPrice(summary.total + selectedDelivery.price)}</span>
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
                Order Summary ({items.length})
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
                    <span>Special Discount</span>
                    <span>-{formatPrice(summary.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-charcoal-muted">
                  <span>Delivery</span>
                  <span className="text-charcoal font-medium">
                    {selectedDelivery.price === 0 ? 'Free' : formatPrice(selectedDelivery.price)}
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
                  <span>100% Safe &amp; Insured Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-champagne" />
                  <span>7-Day Easy Returns &amp; Exchanges</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile OTP Verification & Auto-Login Modal */}
      <Modal
        isOpen={isOtpModalOpen}
        onClose={() => {
          if (!isVerifyingOtp) setIsOtpModalOpen(false);
        }}
        title="Verify Mobile Number"
        maxWidth="md"
        bodyClassName="p-6 space-y-5 font-sans"
      >
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-full bg-champagne/15 border border-champagne/30 text-champagne mx-auto flex items-center justify-center mb-2">
              <Phone className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-xl text-charcoal font-normal">
              Confirm Your Mobile Contact
            </h4>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto leading-relaxed">
              We sent a 6-digit verification code to{' '}
              <strong className="text-charcoal font-semibold">{address.phone}</strong> to confirm your order and activate your Velessa Circle account.
            </p>
          </div>

          {/* Dev Test Code Quick Auto-Fill Banner */}
          {devOtpCode && (
            <div className="bg-amber-50 border border-amber-200 rounded-sm p-3 text-xs text-amber-900 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Dev OTP Code: <strong className="font-mono text-sm tracking-widest">{devOtpCode}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOtpCode(devOtpCode)}
                className="px-2.5 py-1 bg-amber-600 text-white rounded-xs font-semibold text-[10px] uppercase tracking-wider hover:bg-amber-700 transition-colors cursor-pointer shrink-0"
              >
                Auto-Fill
              </button>
            </div>
          )}

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal-muted mb-1.5 font-medium text-center">
                Enter 6-Digit OTP Code
              </label>
              <input
                type="text"
                maxLength={6}
                autoFocus
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className="w-full text-center tracking-[0.4em] font-mono text-2xl py-3 px-4 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne text-charcoal"
              />
              {otpError && (
                <p className="text-xs text-rose-600 mt-1.5 text-center font-medium">
                  {otpError}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isVerifyingOtp || otpCode.length !== 6}
              className="flex items-center justify-center gap-2 h-11"
            >
              {isVerifyingOtp ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-champagne" />
                  <span>Verifying &amp; Logging In...</span>
                </>
              ) : (
                <span>Verify &amp; Proceed to Payment</span>
              )}
            </Button>

            <div className="flex items-center justify-between pt-2 text-xs text-charcoal-muted border-t border-beige">
              <button
                type="button"
                onClick={() => setIsOtpModalOpen(false)}
                className="hover:text-charcoal transition-colors underline cursor-pointer"
              >
                Change Phone Number
              </button>

              {otpTimer > 0 ? (
                <span className="text-[11px] text-charcoal-muted">
                  Resend in <strong className="font-mono">{otpTimer}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => triggerSendOtp(address.phone)}
                  disabled={isSendingOtp}
                  className="text-champagne-dark font-medium hover:underline cursor-pointer"
                >
                  Resend OTP Code
                </button>
              )}
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
