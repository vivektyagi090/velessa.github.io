import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Phone, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { GoogleSignInButton } from '../../components/auth/GoogleSignInButton';
import { PhoneOtpVerificationModal } from '../../components/auth/PhoneOtpVerificationModal';
import { authService } from '../../services/authService';

export const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP Verification state for registration & Google OAuth
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isGoogleFlow, setIsGoogleFlow] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleFirstName, setGoogleFirstName] = useState('');
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  const { user, isAuthenticated, register, googleLogin, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    const cleanPhone = phoneNumber.trim();
    if (!cleanPhone || cleanPhone.length < 8) {
      showToast('Please enter a valid mobile number with country code.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    if (!agreeTerms) {
      showToast('Please accept the Velessa Circle terms.', 'error');
      return;
    }

    // Trigger OTP dispatch to mobile number before finalizing registration
    try {
      setIsSubmitting(true);
      const res = await authService.sendOtp(cleanPhone);
      showToast(res.message, 'info', 'OTP Dispatched');
      if (res.devOtp) {
        setDevOtpHint(res.devOtp);
      }
      setIsGoogleFlow(false);
      setIsOtpModalOpen(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to dispatch verification OTP.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyRegistrationOtp = async (_verifiedPhone: string, otpCode: string) => {
    const success = await register(firstName, lastName, email, password, phoneNumber.trim(), otpCode);
    if (!success) {
      throw new Error('Registration failed with provided OTP.');
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

  // If user is already authenticated, don't show registration form
  if (isAuthenticated && user) {
    return (
      <div className="min-h-[80vh] bg-ivory flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-white border border-beige p-8 sm:p-12 rounded-sm shadow-luxury space-y-6 animate-fade-in text-center">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-champagne font-sans font-medium flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Active Membership
            </span>
            <h1 className="font-serif text-3xl font-light text-charcoal">
              Already Registered
            </h1>
            <p className="text-xs text-charcoal-muted font-sans">
              You are currently signed in as <strong>{user.firstName} {user.lastName}</strong> ({user.email}).
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link to="/shop" className="block">
              <Button variant="primary" size="lg" fullWidth className="flex items-center justify-center gap-2">
                <span>Explore Creations</span>
                <ArrowRight className="w-4 h-4 text-champagne" />
              </Button>
            </Link>

            <Link to="/account" className="block">
              <Button variant="outline" size="md" fullWidth>
                View Account Profile
              </Button>
            </Link>

            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-ivory flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-lg bg-white border border-beige p-8 sm:p-12 rounded-sm shadow-luxury space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-champagne font-sans font-medium flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Privé Circle Membership
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-charcoal">
            Join Velessa
          </h1>
          <p className="text-xs text-charcoal-muted font-sans max-w-sm mx-auto">
            Become a recognized patron. Enjoy private previews, bespoke atelier consultations, and complimentary insured shipping.
          </p>
        </div>

        {/* Google OAuth Quick Sign-Up */}
        <div className="space-y-4">
          <GoogleSignInButton onSuccess={handleGoogleSuccess} text="signup_with" />

          <div className="relative flex items-center justify-center">
            <div className="border-t border-beige w-full"></div>
            <span className="bg-white px-3 text-[10px] uppercase tracking-widest text-charcoal-muted font-sans font-medium">
              or register with email & mobile
            </span>
            <div className="border-t border-beige w-full"></div>
          </div>
        </div>

        <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-charcoal-muted mb-1 uppercase tracking-wider">
                First Name *
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Eleanor"
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
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Vance"
                className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
              />
            </div>
          </div>

          <div>
            <label className="block text-charcoal-muted mb-1 uppercase tracking-wider">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="eleanor.vance@example.com"
              className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
            />
          </div>

          <div>
            <label className="block text-charcoal-muted mb-1 uppercase tracking-wider font-medium">
              Mobile Number * <span className="text-[11px] text-champagne normal-case font-normal">(will be verified with OTP)</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-charcoal-muted">
                <Phone className="w-4 h-4" />
              </span>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-3 py-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-charcoal-muted mb-1 uppercase tracking-wider">
                Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
              />
            </div>
            <div>
              <label className="block text-charcoal-muted mb-1 uppercase tracking-wider">
                Confirm Password *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-charcoal-muted leading-relaxed">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 accent-champagne mt-0.5"
              />
              <span>
                I agree to the Velessa Privé Circle terms, complimentary membership privileges, and confidential privacy policy.
              </span>
            </label>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="gold"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              className="group flex items-center justify-center gap-2 shadow-gold-glow"
            >
              <span>Verify Mobile & Create Account</span>
              <ArrowRight className="w-4 h-4 text-charcoal group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </form>

        <div className="text-center pt-4 border-t border-beige text-xs font-sans text-charcoal-muted">
          <span>Already registered in our circle? </span>
          <Link to="/login" className="text-champagne font-medium hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>

      {/* Mobile OTP Verification Modal for Registration & Google OAuth */}
      <PhoneOtpVerificationModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        tempToken={isGoogleFlow ? tempToken : undefined}
        email={isGoogleFlow ? googleEmail : email}
        firstName={isGoogleFlow ? googleFirstName : firstName}
        initialPhoneNumber={phoneNumber}
        initialStep={isGoogleFlow ? 'phone' : 'otp'}
        initialDevOtp={devOtpHint}
        onVerifyCustom={isGoogleFlow ? undefined : handleVerifyRegistrationOtp}
        onSuccess={() => {
          setIsOtpModalOpen(false);
          navigate('/shop');
        }}
      />
    </div>
  );
};
