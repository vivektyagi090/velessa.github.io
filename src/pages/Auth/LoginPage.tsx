import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isResetSubmitted, setIsResetSubmitted] = useState(false);

  const { login, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter your email and password.', 'error');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate('/shop');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setIsResetSubmitted(true);
    showToast('A private recovery link has been dispatched.', 'info');
  };

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

        <form onSubmit={handleLogin} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block text-charcoal-muted mb-1 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. collector@velessa.com"
              className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-charcoal-muted uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
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

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              className="group flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Enter Salon</span>
              <ArrowRight className="w-4 h-4 text-champagne group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </form>

        <div className="text-center pt-4 border-t border-beige text-xs font-sans text-charcoal-muted">
          <span>New to Velessa? </span>
          <Link to="/register" className="text-champagne font-medium hover:underline">
            Request an Invitation / Register
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Reset Salon Password"
        maxWidth="md"
      >
        {isResetSubmitted ? (
          <div className="text-center space-y-4 py-4 text-xs font-sans">
            <p className="text-charcoal leading-relaxed">
              If an account is associated with <strong>{forgotEmail}</strong>, instructions to safely reset your password have been sent.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsForgotModalOpen(false);
                setIsResetSubmitted(false);
              }}
            >
              Return to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4 text-xs font-sans">
            <p className="text-charcoal-muted leading-relaxed">
              Enter the email address registered with your Velessa profile to receive security reset instructions.
            </p>
            <div>
              <label className="block text-charcoal-muted mb-1 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="your.email@example.com"
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
              <Button type="submit" variant="primary" size="sm">
                Send Reset Link
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
