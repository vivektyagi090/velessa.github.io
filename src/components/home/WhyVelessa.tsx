import React from 'react';
import { Gem, Compass, Award, Box, Sparkles } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';

const PILLARS = [
  {
    icon: Gem,
    title: 'Premium Craftsmanship',
    description: 'Every creation undergoes over 120 hours of hand-carving, prong tension testing, and optical alignment by master European goldsmiths.'
  },
  {
    icon: Compass,
    title: 'Elegant Designs',
    description: 'Distinctive architectural lines that balance bold presence with feminine grace. Designed to be effortlessly worn daily and celebrated for eternity.'
  },
  {
    icon: Award,
    title: 'Quality Materials',
    description: 'Forged strictly in 18k solid gold, 950 platinum, and ethical conflict-free diamonds accompanied by accredited gemological certificates.'
  },
  {
    icon: Box,
    title: 'Secure Packaging',
    description: 'Enclosed within our handcrafted solid wood jewelry vault, lined with Italian silk velvet and secured with wax-sealed certificates of authenticity.'
  }
];

export const WhyVelessa: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-ivory border-t border-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="The Velessa Standard"
          title="Why Choose Velessa"
          description="Uncompromising excellence from initial sketch to the moment our signature vault box rests in your hands."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={index}
                className="group relative p-8 bg-white border border-beige hover:border-champagne/60 rounded-sm shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col items-center text-center"
              >
                {/* Decorative icon container */}
                <div className="w-16 h-16 rounded-full bg-champagne/10 border border-champagne/30 flex items-center justify-center text-champagne group-hover:scale-110 group-hover:bg-champagne group-hover:text-charcoal transition-all duration-300 mb-6">
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="font-serif text-xl sm:text-2xl text-charcoal font-normal mb-3">
                  {pillar.title}
                </h3>

                <p className="text-xs sm:text-sm text-charcoal-muted font-sans font-light leading-relaxed">
                  {pillar.description}
                </p>

                <div className="mt-6 pt-4 border-t border-beige/60 w-full flex items-center justify-center gap-1 text-[10px] uppercase tracking-[0.2em] text-champagne font-sans">
                  <Sparkles className="w-3 h-3" />
                  <span>Certified Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
