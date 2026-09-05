import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[75vh] lg:min-h-[82vh] flex flex-col items-center justify-start overflow-hidden bg-charcoal">
      {/* Background Hero Image with atmospheric overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=2000&q=85"
          alt="Velessa Haute Joaillerie Hero"
          className="w-full h-full object-cover object-center scale-105 animate-pulse-subtle filter brightness-[0.78] contrast-[1.05]"
        />
        {/* Editorial Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-black/50" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-ivory pt-3 sm:pt-4 lg:pt-6 pb-10 sm:pb-14 animate-fade-in">
        {/* Kicker & Festive Celebration Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3 sm:mb-4">
          <Link
            to="/shop?collection=Festive+Collection"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-950/80 via-amber-900/80 to-rose-950/80 backdrop-blur-md border border-amber-400/50 text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.2em] text-amber-200 shadow-gold-glow hover:border-amber-300 transition-all group"
          >
            <span className="text-sm">🌺</span>
            <span>Ganpati Utsav Celebration • Flat 15% OFF</span>
            <span className="text-amber-400/70 hidden sm:inline">|</span>
            <span className="hidden sm:inline font-mono font-bold bg-amber-800/80 px-2 py-0.5 rounded text-[10px] text-white">
              CODE: GANPATI15
            </span>
          </Link>

          <Link
            to="/shop?filter=new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-charcoal/60 backdrop-blur-md border border-champagne/40 text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.2em] text-champagne hover:bg-charcoal/80 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-champagne" />
            <span>New Arrivals 2026</span>
          </Link>
        </div>

        {/* Elegant Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.08] text-ivory mb-4 sm:mb-6 max-w-4xl mx-auto">
          Timeless Elegance, <br className="hidden sm:inline" />
          <span className="italic font-normal gold-gradient-text">Made to Be Yours.</span>
        </h1>

        {/* Short Brand Description */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg font-sans font-light text-ivory/85 leading-relaxed tracking-wide mb-8 sm:mb-10">
          Handcrafted 1 Gram Gold Forming, royal Kundan chokers, and American Diamond jewellery.
          Indistinguishable from hallmarked gold with long-lasting anti-tarnish guarantee.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 max-w-md mx-auto">
          <Link to="/shop" className="w-full sm:w-auto">
            <Button
              variant="gold"
              size="lg"
              fullWidth
              className="group flex items-center justify-center gap-3 !px-8 shadow-gold-glow"
            >
              <span>Shop Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-charcoal" />
            </Button>
          </Link>

          <Link to="/about" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              className="!bg-ivory/10 hover:!bg-ivory/20 !text-ivory !border-ivory/30 backdrop-blur-sm"
            >
              <span>Explore Velessa</span>
            </Button>
          </Link>
        </div>

        {/* Key Metrics / Heritage Badges */}
        <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto mt-16 pt-10 border-t border-ivory/20 text-center font-sans">
          <div>
            <span className="block font-serif text-xl sm:text-2xl text-champagne">18k & 950</span>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-ivory/70">Solid Gold & Platinum</span>
          </div>
          <div>
            <span className="block font-serif text-xl sm:text-2xl text-champagne">100%</span>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-ivory/70">Ethical Diamonds</span>
          </div>
          <div>
            <span className="block font-serif text-xl sm:text-2xl text-champagne">Milan</span>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-ivory/70">Atelier Heritage</span>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-1.5 text-ivory/60 hover:text-champagne transition-colors">
        <span className="text-[9px] uppercase tracking-[0.25em] font-sans font-light">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  );
};
