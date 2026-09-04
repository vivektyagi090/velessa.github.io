import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

export const BrandStorySection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-beige/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Editorial Imagery Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative z-10 w-4/5 aspect-[3/4] overflow-hidden rounded-sm shadow-2xl border border-beige-dark/40">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85"
                alt="Velessa Model Adorned in Fine Jewellery"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Overlapping secondary detail picture */}
            <div className="absolute -bottom-8 right-2 sm:right-6 z-20 w-1/2 aspect-square overflow-hidden rounded-sm shadow-2xl border-4 border-ivory">
              <img
                src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85"
                alt="Velessa Solitaire Detail"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Golden decorative accent badge */}
            <div className="absolute -top-4 -left-4 z-20 hidden sm:flex items-center gap-2 px-4 py-2 bg-charcoal text-champagne border border-champagne/40 rounded-full text-xs font-sans tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Milan Atelier</span>
            </div>
          </div>

          {/* Right Editorial Story Text */}
          <div className="lg:col-span-6 space-y-6 pt-6 lg:pt-0">
            <span className="text-[11px] uppercase tracking-[0.3em] text-champagne font-sans font-medium block">
              The Maison Heritage
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-charcoal leading-[1.18] tracking-tight">
              Jewellery that celebrates <br />
              <span className="italic font-normal gold-gradient-text">every version of you.</span>
            </h2>

            <div className="w-16 h-[1px] bg-champagne" />

            <p className="text-sm sm:text-base text-charcoal-muted font-sans font-light leading-relaxed">
              Founded on the belief that luxury should be both sublime and intimately personal,
              Velessa marries ancestral European goldsmith traditions with clean, contemporary architecture.
            </p>

            <p className="text-sm sm:text-base text-charcoal-muted font-sans font-light leading-relaxed">
              Every ring, collarette, and cuff is sculpted from ethically cast 18k solid gold and
              hand-selected diamonds possessing rare fire. We do not design for temporary seasons;
              we forge modern heirlooms destined to be treasured across lifetimes.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Link to="/about">
                <Button variant="primary" size="lg" className="group flex items-center gap-2">
                  <span>Discover Our Story</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-champagne" />
                </Button>
              </Link>

              <div className="flex items-center gap-3 text-xs font-sans text-charcoal-muted uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-champagne" />
                <span>Ethically Sourced • Master Hand-Set</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
