import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';

export const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const { register, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      showToast('Please complete all required fields.', 'error');
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

    const success = await register(firstName, lastName, email, password);
    if (success) {
      navigate('/shop');
    }
  };

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

        <form onSubmit={handleRegister} className="space-y-4 text-xs font-sans">
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
              isLoading={isLoading}
              className="group flex items-center justify-center gap-2 shadow-gold-glow"
            >
              <span>Create Circle Account</span>
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
    </div>
  );
};
