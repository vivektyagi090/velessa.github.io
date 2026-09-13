import React, { useState, useEffect } from 'react';
import { ShieldCheck, Phone, ArrowRight, RotateCw, Sparkles, AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';

interface PhoneOtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tempToken?: string;
  email?: string;
  firstName?: string;
  initialPhoneNumber?: string;
  initialStep?: 'phone' | 'otp';
  initialDevOtp?: string | null;
  onVerifyCustom?: (phoneNumber: string, otpCode: string) => Promise<boolean | void>;
  onSuccess: () => void;
}

export const PhoneOtpVerificationModal: React.FC<PhoneOtpVerificationModalProps> = ({
  isOpen,
  onClose,
  tempToken,
  email,
  firstName,
  initialPhoneNumber = '',
  initialStep = 'phone',
  initialDevOtp = null,
  onVerifyCustom,
  onSuccess,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>(initialStep);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(initialDevOtp);
  const [otpError, setOtpError] = useState<string | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    if (initialPhoneNumber) {
      setPhoneNumber(initialPhoneNumber);
    }
  }, [initialPhoneNumber]);

  useEffect(() => {
    if (initialStep) {
      setStep(initialStep);
      if (initialStep === 'otp') {
        setCountdown(60);
      }
    }
  }, [initialStep]);

  useEffect(() => {
    if (initialDevOtp) {
      setDevOtpHint(initialDevOtp);
    }
  }, [initialDevOtp]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = phoneNumber.trim();

    if (!cleanNumber || cleanNumber.length < 8) {
      showToast('Please enter a valid mobile number with country code.', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const res = await authService.sendOtp(cleanNumber, tempToken);
      showToast(res.message, 'info', 'OTP Dispatched');
      if (res.devOtp) {
        setDevOtpHint(res.devOtp);
      }
      setStep('otp');
      setCountdown(60);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send OTP.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = otpCode.trim();
    if (!cleanCode || cleanCode.length !== 6) {
      const msg = 'Please enter the complete 6-digit OTP code.';
      setOtpError(msg);
      showToast(msg, 'error', 'Incomplete OTP');
      return;
    }

    try {
      setIsLoading(true);
      setOtpError(null);
      if (onVerifyCustom) {
        await onVerifyCustom(phoneNumber.trim(), cleanCode);
      } else if (tempToken) {
        await authService.verifyGooglePhone(tempToken, phoneNumber.trim(), cleanCode);
      }
      showToast('Mobile number verified successfully.', 'success', 'Access Confirmed');
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Incorrect OTP code. Please check and try again.';
      setOtpError(msg);
      showToast(msg, 'error', 'Incorrect OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
      setIsLoading(true);
      const res = await authService.sendOtp(phoneNumber.trim(), tempToken);
      showToast('A new OTP has been dispatched.', 'info');
      if (res.devOtp) {
        setDevOtpHint(res.devOtp);
      }
      setCountdown(60);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to resend OTP.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Privé Security Verification"
      maxWidth="md"
    >
      <div className="space-y-6 text-xs font-sans">
        <div className="text-center space-y-2 pb-2 border-b border-beige/60">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-champagne-light/50 text-champagne mb-1">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl text-charcoal font-normal">
            {step === 'phone' ? 'Verify Mobile Number' : 'Enter Verification Code'}
          </h2>
          <p className="text-charcoal-muted max-w-sm mx-auto leading-relaxed">
            {step === 'phone'
              ? `Welcome ${firstName ? firstName : 'Patron'} (${email || ''}). As a member of the Velessa Privé Circle, your mobile number is required for dispatch tracking and authentication.`
              : `Enter the 6-digit code dispatched to ${phoneNumber}.`}
          </p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-charcoal-muted uppercase tracking-wider mb-1.5 font-medium">
                Mobile Number (with country code) *
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-charcoal-muted">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne text-sm"
                />
              </div>
              <p className="text-[11px] text-charcoal-muted/80 mt-1">
                Include country code e.g. +91 for India, +1 for USA.
              </p>
            </div>

            <div className="pt-3">
              <Button
                type="submit"
                variant="gold"
                size="lg"
                fullWidth
                isLoading={isLoading}
                className="flex items-center justify-center gap-2 shadow-gold-glow"
              >
                <span>Send Verification OTP</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-charcoal-muted uppercase tracking-wider font-medium">
                  6-Digit OTP Code *
                </label>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-champagne hover:underline text-[11px]"
                >
                  Change Number
                </button>
              </div>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value.replace(/\D/g, ''));
                  if (otpError) setOtpError(null);
                }}
                className={`w-full tracking-[0.5em] text-center font-mono text-2xl py-3 bg-beige/20 border ${otpError ? 'border-rose-500 ring-1 ring-rose-500/20 bg-rose-50/30' : 'border-beige focus:border-champagne'} rounded-xs outline-none text-charcoal transition-all`}
              />

              {otpError && (
                <div className="mt-2.5 p-2.5 bg-rose-50 border border-rose-300 text-rose-700 rounded-xs flex items-center gap-2 text-[11px] animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span className="font-medium">{otpError}</span>
                </div>
              )}
            </div>

            {/* Dev helper code banner */}
            {devOtpHint && (
              <div className="p-3 bg-champagne-light/30 border border-champagne/40 rounded-xs flex items-center justify-between text-charcoal">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-champagne" />
                  <span>Dev OTP Code: <strong>{devOtpHint}</strong></span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setOtpCode(devOtpHint);
                    if (otpError) setOtpError(null);
                  }}
                  className="text-[10px] uppercase tracking-wider text-champagne hover:underline font-semibold"
                >
                  Auto Fill
                </button>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-charcoal-muted">
              <span>Didn&apos;t receive the code?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0 || isLoading}
                className="flex items-center gap-1 text-champagne hover:underline disabled:opacity-50 disabled:no-underline font-medium"
              >
                <RotateCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
              </button>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                className="flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Verify & Complete Registration</span>
                <ArrowRight className="w-4 h-4 text-champagne" />
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
