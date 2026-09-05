import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Welcome to the Velessa Circle. Privé preview details dispatched to your inbox.', 'success', 'Circle Joined');
  };

  return (
    <footer className="bg-charcoal text-ivory pt-16 pb-32 lg:pb-12 border-t border-champagne/30">
      {/* Brand Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-ivory/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-champagne/10 border border-champagne/30 flex items-center justify-center shrink-0 text-champagne">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base text-ivory tracking-wide">1 Gram Gold Forming</h4>
              <p className="text-xs text-ivory/60 font-sans mt-1 leading-relaxed">
                Looks 100% like real 22k gold with high-density micro plating.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-champagne/10 border border-champagne/30 flex items-center justify-center shrink-0 text-champagne">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base text-ivory tracking-wide">Pan-India Delivery & COD</h4>
              <p className="text-xs text-ivory/60 font-sans mt-1 leading-relaxed">
                Express insured shipping with Cash on Delivery available.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-champagne/10 border border-champagne/30 flex items-center justify-center shrink-0 text-champagne">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base text-ivory tracking-wide">Anti-Tarnish Guarantee</h4>
              <p className="text-xs text-ivory/60 font-sans mt-1 leading-relaxed">
                Sweat-proof nano-lacquer protection for enduring polish.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-champagne/10 border border-champagne/30 flex items-center justify-center shrink-0 text-champagne">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base text-ivory tracking-wide">Skin-Safe & Hypoallergenic</h4>
              <p className="text-xs text-ivory/60 font-sans mt-1 leading-relaxed">
                100% lead and nickel-free brass alloys for sensitive skin.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col">
              <span className="font-serif text-3xl tracking-[0.28em] font-light text-ivory">
                VELESSA
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-champagne font-sans font-medium">
                1 Gram Gold & Imitation Jewellery
              </span>
            </div>
            <p className="text-sm text-ivory/70 font-sans leading-relaxed max-w-sm">
              The splendor of 22k gold, royal Kundan chokers, and American Diamond solitaires, crafted with precision 1-Gram Gold Forming micro-technology.
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-4 text-ivory/70">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-ivory/20 flex items-center justify-center hover:border-champagne hover:text-champagne transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-ivory/20 flex items-center justify-center hover:border-champagne hover:text-champagne transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-ivory/20 flex items-center justify-center hover:border-champagne hover:text-champagne transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] text-champagne font-sans font-semibold">
              Creations
            </h4>
            <ul className="space-y-2.5 text-sm font-sans text-ivory/70">
              <li>
                <Link to="/shop?category=Rings" className="hover:text-champagne transition-colors">
                  Rings & Solitaires
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Necklaces" className="hover:text-champagne transition-colors">
                  Necklaces & Collars
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Earrings" className="hover:text-champagne transition-colors">
                  Earrings & Drops
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Bracelets" className="hover:text-champagne transition-colors">
                  Tennis Bracelets
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Bangles" className="hover:text-champagne transition-colors">
                  Solid Bangles
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Pendants" className="hover:text-champagne transition-colors">
                  Pendants & Talismans
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] text-champagne font-sans font-semibold">
              Concierge Care
            </h4>
            <ul className="space-y-2.5 text-sm font-sans text-ivory/70">
              <li>
                <Link to="/contact" className="hover:text-champagne transition-colors">
                  Book Salon Consultation
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-champagne transition-colors">
                  Atelier Craftsmanship
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-champagne transition-colors">
                  Ring Sizing Guide
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-champagne transition-colors">
                  Insured Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-champagne transition-colors">
                  Bespoke Commissions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-champagne transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] text-champagne font-sans font-semibold">
              The Velessa Circle
            </h4>
            <p className="text-xs text-ivory/70 font-sans leading-relaxed">
              Receive private invitations to preview haute joaillerie debuts and salon collections.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-champagne text-xs font-sans py-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>You are subscribed to the Circle.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative flex items-center border-b border-ivory/30 focus-within:border-champagne transition-colors">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-transparent py-2.5 text-xs text-ivory placeholder:text-ivory/40 outline-none font-sans"
                  />
                  <button
                    type="submit"
                    className="text-champagne hover:text-white transition-colors p-1"
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[10px] text-ivory/40 font-sans block">
                  By joining, you agree to our Privacy Terms.
                </span>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar / Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-ivory/10 flex flex-col sm:flex-row items-center justify-between text-xs text-ivory/50 font-sans gap-4">
        <p>© 2026 VELESSA. All rights reserved.</p>
        <div className="flex items-center space-x-6">
          <Link to="/contact" className="hover:text-champagne transition-colors">
            Privacy Policy
          </Link>
          <Link to="/contact" className="hover:text-champagne transition-colors">
            Terms & Conditions
          </Link>
          <Link to="/contact" className="hover:text-champagne transition-colors">
            Shipping & Returns
          </Link>
        </div>
      </div>
    </footer>
  );
};
