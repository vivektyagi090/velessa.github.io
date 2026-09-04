import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

export const EditorialBanner: React.FC = () => {
  return (
    <section className="relative py-24 sm:py-32 bg-charcoal overflow-hidden my-8">
      {/* Editorial Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?auto=format&fit=crop&w=2000&q=85"
          alt="The Velessa Signature Collection"
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.1]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      {/* Decorative Gold Border Line Framing */}
      <div className="absolute inset-4 sm:inset-8 border border-champagne/30 pointer-events-none z-10 hidden sm:block" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-champagne font-sans font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Limited Atelier Series</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-ivory tracking-tight leading-[1.1]">
            THE VELESSA <br />
            <span className="italic gold-gradient-text font-normal">SIGNATURE COLLECTION</span>
          </h2>

          <p className="text-sm sm:text-base text-ivory/80 font-sans font-light leading-relaxed max-w-lg">
            A celebration of sculptural symmetry and radiant gold engineering. Each limited creation
            features our proprietary satin-brushed champagne gold and calibrated VS1 diamonds.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link to="/shop?collection=Signature+Collection">
              <Button
                variant="gold"
                size="lg"
                className="group flex items-center gap-3 shadow-gold-glow"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link to="/collections/signature-collection">
              <Button
                variant="secondary"
                size="lg"
                className="!bg-white/10 hover:!bg-white/20 !text-ivory !border-white/30 backdrop-blur-sm"
              >
                <span>View Lookbook</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
