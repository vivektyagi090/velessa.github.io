import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Eye, EyeOff, Phone, KeyRound, CheckCircle2, ShieldCheck, AlertCircle, LogOut, Pencil, Package, ShoppingBag, FileText, Truck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { GoogleSignInButton } from '../../components/auth/GoogleSignInButton';
import { PhoneOtpVerificationModal } from '../../components/auth/PhoneOtpVerificationModal';
import { OrderInvoiceModal } from '../../components/orders/OrderInvoiceModal';
import { OrderTrackingModal } from '../../components/orders/OrderTrackingModal';
import { authService } from '../../services/authService';
import { orderService } from '../../services/orderService';
import { Order } from '../../types/order';
import { formatPrice } from '../../utils/formatters';

export const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Edit Profile state (with mandatory phone OTP verification)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editPhoneNumber, setEditPhoneNumber] = useState('');
  const [editStep, setEditStep] = useState<'form' | 'otp'>('form');
  const [editOtpCode, setEditOtpCode] = useState('');
  const [editDevOtp, setEditDevOtp] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [isProfileSaving, setIsProfileSaving] = useState(false);

  // Forgot / Reset Password state (3-Step: Request -> Verify OTP -> Set Password)
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotStep, setForgotStep] = useState<'request' | 'otp' | 'password' | 'done'>('request');
  const [forgotPhone, setForgotPhone] = useState('');
  const [resetOtpCode, setResetOtpCode] = useState('');
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotDevOtp, setForgotDevOtp] = useState<string | null>(null);
  const [isResetLoading, setIsResetLoading] = useState(false);

  // OTP Verification state for Mobile Login & Google OAuth
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isGoogleFlow, setIsGoogleFlow] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleFirstName, setGoogleFirstName] = useState('');
  const [otpPhone, setOtpPhone] = useState('');
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [isOtpSending, setIsOtpSending] = useState(false);

  // Patron Orders history from SQL database
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Modals for Order Bill / Tax Invoice and Live Shipping Tracking
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<Order | null>(null);

  const { user, isAuthenticated, login, loginWithOtp, googleLogin, updateProfile, logout, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      setIsLoadingOrders(true);
      orderService.getOrdersByCustomer(user.email, user.phoneNumber)
        .then((fetched) => {
          setOrders(fetched);
        })
        .catch(() => {
          // ignore
        })
        .finally(() => {
          setIsLoadingOrders(false);
        });
    }
  }, [isAuthenticated, user]);

  // Smooth-scroll to #orders section when navigating with #orders hash
  useEffect(() => {
    if (window.location.hash === '#orders') {
      const el = document.getElementById('orders');
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 150);
      }
    }
  }, [orders]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      showToast('Please enter your email or mobile number, and password.', 'error');
      return;
    }

    const success = await login(identifier.trim(), password);
    if (success) {
      navigate('/shop');
    }
  };

  const handleMobileOtpLoginClick = async () => {
    const cleanNumber = identifier.trim().replace(" ", "").replace("-", "");
    if (!cleanNumber || cleanNumber.length < 8) {
      showToast('Please enter your mobile number above to receive an OTP.', 'info');
      return;
    }

    try {
      setIsOtpSending(true);
      const res = await authService.sendOtp(cleanNumber);
      showToast(res.message, 'info', 'OTP Dispatched');
      if (res.devOtp) {
        setDevOtpHint(res.devOtp);
      }
      setOtpPhone(cleanNumber);
      setIsGoogleFlow(false);
      setIsOtpModalOpen(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send OTP.';
      showToast(msg, 'error');
    } finally {
      setIsOtpSending(false);
    }
  };

  const handleVerifyLoginOtp = async (phone: string, otpCode: string) => {
    const success = await loginWithOtp(phone, otpCode);
    if (!success) {
      throw new Error('OTP Login failed.');
    }
  };

  const handleGoogleSuccess = async (credential: string) => {
    try {
      const res = await googleLogin(credential);
      if (res.requiresPhoneVerification && res.tempToken) {
        setTempToken(res.tempToken);
        setGoogleEmail(res.email || '');
        setGoogleFirstName(res.firstName || '');
        setIsGoogleFlow(true);
        setIsOtpModalOpen(true);
      } else {
        navigate('/shop');
      }
    } catch {
      // Error handled in context
    }
  };

  const openForgotModal = () => {
    setForgotIdentifier(identifier.trim());
    setForgotStep('request');
    setResetOtpCode('');
    setResetToken(null);
    setOtpError(null);
    setNewPassword('');
    setConfirmNewPassword('');
    setForgotDevOtp(null);
    setIsForgotModalOpen(true);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) {
      showToast('Please enter your email address or mobile number.', 'error');
      return;
    }

    try {
      setIsResetLoading(true);
      setOtpError(null);
      const res = await authService.forgotPassword(forgotIdentifier.trim());
      showToast(res.message, 'info', 'Reset Dispatched');

      if (res.isMobile && res.phoneNumber) {
        setForgotPhone(res.phoneNumber);
        setForgotDevOtp(res.devOtp || null);
        setForgotStep('otp');
      } else {
        setForgotStep('done');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to request password reset.';
      showToast(msg, 'error');
    } finally {
      setIsResetLoading(false);
    }
  };

  const handleVerifyResetOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = resetOtpCode.trim();
    if (!cleanCode || cleanCode.length !== 6) {
      const msg = 'Please enter the complete 6-digit OTP code.';
      setOtpError(msg);
      showToast(msg, 'error', 'Incomplete Code');
      return;
    }

    try {
      setIsResetLoading(true);
      setOtpError(null);
      const res = await authService.verifyResetOtp(forgotPhone || forgotIdentifier.trim(), cleanCode);
      showToast(res.message, 'success', 'Number Verified');
      if (res.resetToken) {
        setResetToken(res.resetToken);
      }
      setForgotStep('password');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Incorrect OTP code. Please check and try again.';
      setOtpError(msg);
      showToast(msg, 'error', 'Incorrect OTP');
    } finally {
      setIsResetLoading(false);
    }
  };

  const handleSetNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'error');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    try {
      setIsResetLoading(true);
      const res = await authService.resetPassword(
        {
          resetToken: resetToken || undefined,
          identifier: forgotPhone || forgotIdentifier.trim(),
          otpCode: resetOtpCode.trim(),
        },
        newPassword
      );
      showToast(res.message, 'success', 'Password Updated');
      setIsForgotModalOpen(false);
      setIdentifier(forgotPhone || forgotIdentifier);
      setPassword('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Password reset failed.';
      showToast(msg, 'error');
    } finally {
      setIsResetLoading(false);
    }
  };

  const openEditProfile = () => {
    if (!user) return;
    setEditFirstName(user.firstName || '');
    setEditLastName(user.lastName || '');
    setEditPhoneNumber(user.phoneNumber || '');
    setEditStep('form');
    setEditOtpCode('');
    setEditDevOtp(null);
    setEditError(null);
    setIsEditModalOpen(true);
  };

  const handleEditProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFirstName.trim() || !editLastName.trim()) {
      showToast('First and last name are required.', 'error');
      return;
    }

    const cleanNewPhone = editPhoneNumber.trim().replace(" ", "").replace("-", "");
    const cleanCurrentPhone = (user?.phoneNumber || '').trim().replace(" ", "").replace("-", "");
    const isPhoneChanged = cleanNewPhone !== cleanCurrentPhone;

    if (isPhoneChanged) {
      if (cleanNewPhone.length < 8) {
        showToast('Please enter a valid mobile number with country code.', 'error');
        return;
      }

      // Step 1: Send OTP to the new phone number
      try {
        setIsProfileSaving(true);
        setEditError(null);
        const res = await authService.sendOtp(cleanNewPhone);
        showToast(res.message, 'info', 'Verification Code Dispatched');
        if (res.devOtp) {
          setEditDevOtp(res.devOtp);
        }
        setEditStep('otp');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to dispatch verification OTP.';
        setEditError(msg);
        showToast(msg, 'error');
      } finally {
        setIsProfileSaving(false);
      }
    } else {
      // Phone not changed, update name directly
      try {
        setIsProfileSaving(true);
        await updateProfile({
          firstName: editFirstName.trim(),
          lastName: editLastName.trim(),
          phoneNumber: user?.phoneNumber,
        });
        setIsEditModalOpen(false);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to update profile.';
        showToast(msg, 'error');
      } finally {
        setIsProfileSaving(false);
      }
    }
  };

  const handleVerifyNewPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editOtpCode.trim() || editOtpCode.trim().length !== 6) {
      setEditError('Please enter the 6-digit verification code.');
      return;
    }

    try {
      setIsProfileSaving(true);
      setEditError(null);
      await updateProfile({
        firstName: editFirstName.trim(),
        lastName: editLastName.trim(),
        phoneNumber: editPhoneNumber.trim(),
        otpCode: editOtpCode.trim(),
      });
      setIsEditModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid verification code.';
      setEditError(msg);
      showToast(msg, 'error');
    } finally {
      setIsProfileSaving(false);
    }
  };

  const handleResendEditOtp = async () => {
    const cleanPhone = editPhoneNumber.trim().replace(" ", "").replace("-", "");
    try {
      setIsProfileSaving(true);
      const res = await authService.sendOtp(cleanPhone);
      showToast(res.message, 'info', 'New Code Sent');
      if (res.devOtp) {
        setEditDevOtp(res.devOtp);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to resend code.';
      showToast(msg, 'error');
    } finally {
      setIsProfileSaving(false);
    }
  };

  // If user is already authenticated, show their active Privé profile, database order history, and Logout option
  if (isAuthenticated && user) {
    return (
      <div className="min-h-[85vh] bg-ivory py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-champagne font-sans font-medium flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {user.tier || 'Privé Circle'} Member
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-charcoal">
              Welcome, {user.firstName}
            </h1>
            <p className="text-xs text-charcoal-muted font-sans">
              Your patron profile &amp; database order records are synchronized.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Patron Identity Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-beige p-6 sm:p-8 rounded-sm shadow-sm space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-champagne text-charcoal font-serif text-2xl font-bold flex items-center justify-center mx-auto shadow-xs">
                  {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'P'}
                </div>

                <div className="p-4 bg-beige/20 border border-beige rounded-sm text-left space-y-3 font-sans text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-beige/60">
                    <span className="text-charcoal-muted">Patron Name</span>
                    <strong className="text-charcoal font-medium">{user.firstName} {user.lastName}</strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-beige/60">
                    <span className="text-charcoal-muted">Email</span>
                    <span className="text-charcoal truncate max-w-[150px]">{user.email}</span>
                  </div>
                  {user.phoneNumber && (
                    <div className="flex justify-between items-center py-1 border-b border-beige/60">
                      <span className="text-charcoal-muted">Mobile</span>
                      <span className="text-charcoal flex items-center gap-1">
                        {user.phoneNumber}
                        <CheckCircle2 className="w-3.5 h-3.5 text-champagne" />
                      </span>
                    </div>
                  )}
                  {user.lastLoginAtUtc && (
                    <div className="flex justify-between items-center py-1 border-b border-beige/60">
                      <span className="text-charcoal-muted">Last Active</span>
                      <span className="text-charcoal font-medium text-[11px]">
                        {new Date(user.lastLoginAtUtc).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-1">
                    <span className="text-charcoal-muted">Tier</span>
                    <span className="text-champagne font-semibold tracking-wider uppercase text-[10px] bg-champagne/15 px-2 py-0.5 rounded-full">
                      {user.tier || 'Privé Circle'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={openEditProfile}
                    className="flex items-center justify-center gap-2 border-champagne/50 text-charcoal hover:bg-champagne/10 font-sans text-xs tracking-wider uppercase font-semibold"
                  >
                    <Pencil className="w-3.5 h-3.5 text-champagne" />
                    <span>Edit Profile &amp; Mobile</span>
                  </Button>

                  <a
                    href="#orders"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('orders')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="block"
                  >
                    <Button variant="outline" size="sm" fullWidth className="flex items-center justify-center gap-2">
                      <Package className="w-3.5 h-3.5 text-champagne" />
                      <span>Order History ({orders.length})</span>
                    </Button>
                  </a>

                  <Link to="/wishlist" className="block">
                    <Button variant="outline" size="sm" fullWidth>
                      Saved Wishlist
                    </Button>
                  </Link>

                  <button
                    type="button"
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Database Orders History */}
            <div id="orders" className="lg:col-span-8 space-y-4 scroll-mt-24">
              <div className="bg-white border border-beige p-6 sm:p-8 rounded-sm shadow-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-beige">
                  <div className="flex items-center gap-2.5">
                    <Package className="w-5 h-5 text-champagne" />
                    <h2 className="font-serif text-2xl text-charcoal font-normal">
                      Order History ({orders.length})
                    </h2>
                  </div>
                  <span className="text-[11px] font-sans text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium">
                    Saved in SQL Database
                  </span>
                </div>

                {isLoadingOrders ? (
                  <div className="py-12 text-center text-charcoal-muted text-xs font-sans">
                    Loading orders from database...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-12 text-center space-y-3 font-sans">
                    <div className="w-12 h-12 rounded-full bg-beige/30 text-charcoal-muted flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <p className="text-xs text-charcoal-muted">
                      No orders placed yet under this account.
                    </p>
                    <Link to="/shop" className="inline-block pt-1">
                      <Button variant="primary" size="sm">
                        Explore Creations
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-5 border border-beige rounded-sm bg-beige/10 hover:border-champagne/60 transition-colors space-y-3 font-sans text-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-beige/60 pb-2.5">
                          <div className="space-y-0.5">
                            <span className="text-[10px] uppercase text-charcoal-muted font-medium">Order Number</span>
                            <div className="font-mono font-bold text-charcoal text-sm">{order.orderNumber}</div>
                          </div>
                          <div className="text-right space-y-0.5">
                            <span className="text-[10px] uppercase text-charcoal-muted font-medium">Placed On</span>
                            <div className="text-charcoal text-xs">
                              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-wider rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                            {order.status}
                          </span>
                        </div>

                        {/* Line items preview */}
                        <div className="space-y-2 pt-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-charcoal">
                              <span className="truncate max-w-[280px] sm:max-w-md">
                                {item.product.name} × {item.quantity}
                              </span>
                              <span className="font-medium shrink-0">
                                {formatPrice(item.product.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Order footer details */}
                        <div className="pt-2 border-t border-beige/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="text-charcoal-muted text-[11px]">
                            Destination: {order.shippingAddress.city}, {order.shippingAddress.country}
                          </span>
                          <div className="font-serif text-sm font-medium text-charcoal">
                            Total: <span className="font-sans font-semibold">{formatPrice(order.summary.total)}</span>
                          </div>
                        </div>

                        {/* Order Action Buttons: Bill/Invoice & Live Tracking */}
                        <div className="pt-3 border-t border-beige/60 flex flex-wrap items-center justify-end gap-2.5">
                          <button
                            type="button"
                            onClick={() => setSelectedInvoiceOrder(order)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-beige/40 border border-beige hover:border-champagne text-charcoal text-[11px] font-sans font-medium rounded-xs transition-all shadow-2xs cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-champagne" />
                            <span>View Bill &amp; Tax Invoice</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedTrackingOrder(order)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-charcoal hover:bg-black text-ivory text-[11px] font-sans font-medium rounded-xs transition-all shadow-xs cursor-pointer"
                          >
                            <Truck className="w-3.5 h-3.5 text-champagne" />
                            <span>Track Shipment</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Edit Profile Modal */}
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            title={editStep === 'form' ? 'Edit Patron Profile' : 'Verify New Mobile Number'}
            maxWidth="md"
          >
            {editStep === 'form' ? (
              <form onSubmit={handleEditProfileSubmit} className="space-y-4 text-xs font-sans text-left">
                <p className="text-charcoal-muted text-[11px]">
                  Update your patron identity details. Changing your mobile number requires SMS OTP verification before saving.
                </p>

                {editError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{editError}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-charcoal-muted mb-1 uppercase tracking-wider font-medium">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editFirstName}
                      onChange={(e) => setEditFirstName(e.target.value)}
                      className="w-full p-2.5 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
                      placeholder="e.g. Vivek"
                    />
                  </div>
                  <div>
                    <label className="block text-charcoal-muted mb-1 uppercase tracking-wider font-medium">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editLastName}
                      onChange={(e) => setEditLastName(e.target.value)}
                      className="w-full p-2.5 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
                      placeholder="e.g. Tyagi"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-charcoal-muted mb-1 uppercase tracking-wider font-medium">
                    Email Address (Account Anchor)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user.email}
                    className="w-full p-2.5 bg-beige/40 border border-beige/60 text-charcoal-muted rounded-xs cursor-not-allowed"
                  />
                  <p className="text-[10px] text-charcoal-muted mt-0.5">Primary patron email cannot be changed directly.</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-charcoal-muted uppercase tracking-wider font-medium">
                      Mobile Number *
                    </label>
                    {editPhoneNumber.trim().replace(" ", "").replace("-", "") === (user.phoneNumber || '').trim().replace(" ", "").replace("-", "") ? (
                      <span className="text-[10px] text-champagne flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Currently Verified
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-600 flex items-center gap-1 font-medium bg-amber-50 px-1.5 py-0.5 rounded-xs">
                        <Phone className="w-3 h-3" />
                        OTP Verification Required
                      </span>
                    )}
                  </div>
                  <input
                    type="tel"
                    required
                    value={editPhoneNumber}
                    onChange={(e) => setEditPhoneNumber(e.target.value)}
                    className="w-full p-2.5 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
                    placeholder="e.g. 9082747226 or +91 9876543210"
                  />
                  {editPhoneNumber.trim().replace(" ", "").replace("-", "") !== (user.phoneNumber || '').trim().replace(" ", "").replace("-", "") && (
                    <div className="mt-2 p-2.5 bg-amber-50/70 border border-amber-200 rounded-xs text-amber-800 text-[11px] flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        Because you changed your mobile number, clicking <strong>Verify Mobile & Save</strong> will dispatch a 6-digit OTP to <strong>{editPhoneNumber}</strong> to confirm ownership.
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-beige">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditModalOpen(false)}
                    disabled={isProfileSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={isProfileSaving}
                  >
                    {editPhoneNumber.trim().replace(" ", "").replace("-", "") !== (user.phoneNumber || '').trim().replace(" ", "").replace("-", "")
                      ? 'Verify Mobile & Save'
                      : 'Save Changes'}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyNewPhoneOtp} className="space-y-4 text-xs font-sans text-left">
                <div className="p-3 bg-champagne/10 border border-champagne/30 rounded-xs flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-champagne/20 flex items-center justify-center text-champagne shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-charcoal font-medium">
                      Confirm Mobile Number: <strong>{editPhoneNumber}</strong>
                    </p>
                    <p className="text-[11px] text-charcoal-muted">
                      Enter the 6-digit security code dispatched to your new number.
                    </p>
                  </div>
                </div>

                {editDevOtp && (
                  <div className="p-2.5 bg-beige/40 border border-champagne/50 rounded-xs flex items-center justify-between text-[11px]">
                    <span className="text-charcoal-muted">
                      Dev Auto-Fill: <strong className="text-champagne font-mono tracking-widest">{editDevOtp}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditOtpCode(editDevOtp);
                        setEditError(null);
                      }}
                      className="text-champagne hover:underline font-medium text-[10px] uppercase tracking-wider"
                    >
                      Apply Code
                    </button>
                  </div>
                )}

                {editError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{editError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-charcoal-muted mb-1 uppercase tracking-wider font-medium">
                    6-Digit Verification Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={editOtpCode}
                    onChange={(e) => {
                      setEditOtpCode(e.target.value.replace(/\D/g, ''));
                      setEditError(null);
                    }}
                    placeholder="123456"
                    className={`w-full p-3 text-center tracking-[0.5em] font-mono text-base bg-beige/20 border rounded-xs outline-none focus:border-champagne ${
                      editError ? 'border-rose-400 bg-rose-50/20' : 'border-beige'
                    }`}
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setEditStep('form')}
                    className="text-champagne hover:underline text-[11px]"
                  >
                    ← Edit Details
                  </button>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleResendEditOtp}
                      disabled={isProfileSaving}
                    >
                      Resend Code
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      isLoading={isProfileSaving}
                    >
                      Confirm & Update
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </Modal>

          {/* Tax Invoice Bill Modal */}
          <OrderInvoiceModal
            isOpen={!!selectedInvoiceOrder}
            onClose={() => setSelectedInvoiceOrder(null)}
            order={selectedInvoiceOrder}
          />

          {/* Live Shipping Tracking Modal */}
          <OrderTrackingModal
            isOpen={!!selectedTrackingOrder}
            onClose={() => setSelectedTrackingOrder(null)}
            order={selectedTrackingOrder}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-ivory flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-white border border-beige p-8 sm:p-12 rounded-sm shadow-luxury space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-champagne font-sans font-medium flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Privé Circle
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-charcoal">
            Welcome Back
          </h1>
          <p className="text-xs text-charcoal-muted font-sans">
            Access your curated wishlist, acquisitions, and bespoke privileges.
          </p>
        </div>

        {/* Google OAuth Sign-in */}
        <div className="space-y-4">
          <GoogleSignInButton onSuccess={handleGoogleSuccess} text="continue_with" />

          <div className="relative flex items-center justify-center">
            <div className="border-t border-beige w-full"></div>
            <span className="bg-white px-3 text-[10px] uppercase tracking-widest text-charcoal-muted font-sans font-medium">
              or sign in with email or mobile
            </span>
            <div className="border-t border-beige w-full"></div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block text-charcoal-muted mb-1 uppercase tracking-wider font-medium">
              Email Address or Mobile Number
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. collector@velessa.com or 9082747226"
              autoComplete="username"
              className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-charcoal-muted uppercase tracking-wider font-medium">
                Password
              </label>
              <button
                type="button"
                onClick={openForgotModal}
                className="text-champagne hover:underline text-[11px]"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2 space-y-2.5">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading && !isOtpSending}
              className="group flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4 text-champagne group-hover:translate-x-1 transition-transform" />
            </Button>

            <button
              type="button"
              onClick={handleMobileOtpLoginClick}
              disabled={isOtpSending}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-champagne-light/30 hover:bg-champagne-light/60 border border-champagne/40 text-charcoal text-[11px] uppercase tracking-wider font-medium rounded-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-champagne" />
              <span>{isOtpSending ? 'Dispatching OTP...' : 'Sign in with Mobile OTP'}</span>
            </button>
          </div>
        </form>

        <div className="text-center pt-4 border-t border-beige text-xs font-sans text-charcoal-muted">
          <span>New to Velessa? </span>
          <Link to="/register" className="text-champagne font-medium hover:underline">
            Request an Invitation / Register
          </Link>
        </div>
      </div>

      {/* Mobile OTP Verification Modal for Google OAuth & Mobile OTP Login */}
      <PhoneOtpVerificationModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        tempToken={isGoogleFlow ? tempToken : undefined}
        email={isGoogleFlow ? googleEmail : undefined}
        firstName={isGoogleFlow ? googleFirstName : 'Patron'}
        initialPhoneNumber={isGoogleFlow ? '' : otpPhone}
        initialStep={isGoogleFlow ? 'phone' : 'otp'}
        initialDevOtp={devOtpHint}
        onVerifyCustom={isGoogleFlow ? undefined : handleVerifyLoginOtp}
        onSuccess={() => {
          setIsOtpModalOpen(false);
          navigate('/shop');
        }}
      />

      {/* Forgot / Reset Password Modal with Email and Mobile OTP Support */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Reset Password"
        maxWidth="md"
      >
        {forgotStep === 'request' && (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 text-xs font-sans">
            <p className="text-charcoal-muted leading-relaxed">
              Enter the email address or registered mobile number associated with your Velessa profile to receive security reset instructions.
            </p>
            <div>
              <label className="block text-charcoal-muted mb-1 uppercase tracking-wider font-medium">
                Email Address or Mobile Number
              </label>
              <input
                type="text"
                required
                value={forgotIdentifier}
                onChange={(e) => setForgotIdentifier(e.target.value)}
                placeholder="e.g. collector@velessa.com or 9082747226"
                className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsForgotModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isResetLoading}>
                Send Verification Code
              </Button>
            </div>
          </form>
        )}

        {forgotStep === 'otp' && (
          <form onSubmit={handleVerifyResetOtpSubmit} className="space-y-4 text-xs font-sans">
            <div className="p-3 bg-champagne-light/30 border border-champagne/40 rounded-xs space-y-1">
              <p className="text-charcoal leading-relaxed font-medium">
                Verification code dispatched to <strong>{forgotPhone}</strong>.
              </p>
              <p className="text-[11px] text-charcoal-muted">
                Enter the 6-digit code sent to your mobile device to verify your identity before resetting your password.
              </p>
            </div>

            <div>
              <label className="block text-charcoal-muted mb-1 uppercase tracking-wider font-medium">
                6-Digit OTP Code *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={resetOtpCode}
                onChange={(e) => {
                  setResetOtpCode(e.target.value.replace(/\D/g, ''));
                  if (otpError) setOtpError(null);
                }}
                placeholder="123456"
                className={`w-full tracking-[0.4em] text-center font-mono text-xl py-2.5 bg-beige/20 border ${otpError ? 'border-rose-500 ring-1 ring-rose-500/20 bg-rose-50/30' : 'border-beige focus:border-champagne'} rounded-xs outline-none text-charcoal transition-all`}
              />

              {otpError && (
                <div className="mt-2 p-2.5 bg-rose-50 border border-rose-300 text-rose-700 rounded-xs flex items-center gap-2 text-[11px] animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span className="font-medium">{otpError}</span>
                </div>
              )}
            </div>

            {forgotDevOtp && (
              <div className="p-2.5 bg-champagne-light/40 border border-champagne/50 rounded-xs flex items-center justify-between text-charcoal">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <KeyRound className="w-3.5 h-3.5 text-champagne" />
                  <span>Dev OTP: <strong>{forgotDevOtp}</strong></span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setResetOtpCode(forgotDevOtp);
                    if (otpError) setOtpError(null);
                  }}
                  className="text-[10px] uppercase tracking-wider text-champagne hover:underline font-bold"
                >
                  Auto Fill
                </button>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-charcoal-muted pt-1">
              <span>Didn't receive the SMS code?</span>
              <button
                type="button"
                onClick={async () => {
                  try {
                    setIsResetLoading(true);
                    setOtpError(null);
                    const res = await authService.forgotPassword(forgotPhone || forgotIdentifier.trim());
                    showToast(res.message, 'info', 'OTP Dispatched');
                    if (res.devOtp) setForgotDevOtp(res.devOtp);
                  } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : 'Unable to resend OTP.';
                    showToast(msg, 'error');
                  } finally {
                    setIsResetLoading(false);
                  }
                }}
                disabled={isResetLoading}
                className="text-champagne font-medium hover:underline disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setForgotStep('request')}
                className="text-champagne hover:underline text-[11px]"
              >
                Change Number / Email
              </button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsForgotModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={isResetLoading}>
                  Verify Code
                </Button>
              </div>
            </div>
          </form>
        )}

        {forgotStep === 'password' && (
          <form onSubmit={handleSetNewPasswordSubmit} className="space-y-4 text-xs font-sans">
            <div className="p-3 bg-champagne-light/30 border border-champagne/40 rounded-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-champagne/20 flex items-center justify-center text-champagne shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-charcoal font-medium">
                  Mobile Number Verified ({forgotPhone})
                </p>
                <p className="text-[11px] text-charcoal-muted">
                  Your identity has been confirmed. Enter your new password below.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-charcoal-muted mb-1 uppercase tracking-wider font-medium">
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
                />
                <p className="text-[10px] text-charcoal-muted mt-0.5">Minimum 6 characters</p>
              </div>
              <div>
                <label className="block text-charcoal-muted mb-1 uppercase tracking-wider font-medium">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsForgotModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isResetLoading}>
                Set New Password
              </Button>
            </div>
          </form>
        )}

        {forgotStep === 'done' && (
          <div className="text-center space-y-4 py-4 text-xs font-sans">
            <CheckCircle2 className="w-10 h-10 text-champagne mx-auto" />
            <p className="text-charcoal leading-relaxed">
              If an account is registered with <strong>{forgotIdentifier}</strong>, security instructions have been dispatched.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsForgotModalOpen(false)}
            >
              Return to Login
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};
