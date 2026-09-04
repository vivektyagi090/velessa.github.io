import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsLoading(false);
    setIsSubmitted(true);
    showToast('You have joined the Velessa Circle. Privé privileges are on the way.', 'success', 'Welcome to the Circle');
  };

  return (
    <section className="py-20 sm:py-28 bg-charcoal text-ivory relative overflow-hidden border-t border-champagne/20">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-champagne/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne/10 border border-champagne/30 text-[10px] uppercase tracking-[0.3em] text-champagne font-sans font-medium mb-6">
          <Sparkles className="w-3 h-3" />
          <span>Private Circle Invitation</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-ivory mb-4">
          Join the Velessa Circle
        </h2>

        <div className="w-12 h-[1px] bg-champagne mx-auto my-5" />

        <p className="text-sm sm:text-base text-ivory/70 font-sans font-light max-w-xl mx-auto leading-relaxed mb-8">
          Be the first to discover new collections, exclusive launches and private offers. Receive invitations to secret salon previews.
        </p>

        {isSubmitted ? (
          <div className="inline-flex items-center gap-3 bg-champagne/15 border border-champagne/40 px-6 py-4 rounded-sm text-champagne text-sm font-sans">
            <CheckCircle2 className="w-5 h-5" />
            <span>Thank you. Your invitation to the Circle has been dispatched.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-ivory/40 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-ivory/10 border border-ivory/20 focus:border-champagne text-ivory placeholder:text-ivory/40 outline-none text-xs sm:text-sm font-sans transition-colors rounded-sm"
              />
            </div>

            <Button
              type="submit"
              variant="gold"
              size="md"
              isLoading={isLoading}
              className="shrink-0 flex items-center justify-center gap-2 !py-3.5 shadow-gold-glow"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-4 h-4 text-charcoal" />
            </Button>
          </form>
        )}

        <span className="block text-[11px] text-ivory/40 font-sans mt-4">
          We honor your privacy. Unsubscribe at any time with a single click.
        </span>
      </div>
    </section>
  );
};
