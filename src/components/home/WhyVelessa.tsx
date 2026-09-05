import React from 'react';
import { Gem, Compass, Award, Box, Sparkles } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';

const PILLARS = [
  {
    icon: Gem,
    title: '1 Gram Real Gold Look',
    description: 'Advanced 1-Gram 24K Gold Forming micro-plating that matches the exact luster, color, and reassuring weight of 22K hallmarked gold.'
  },
  {
    icon: Compass,
    title: 'Anti-Tarnish Coating',
    description: 'Treated with cutting-edge protective nano-lacquer that shields against sweat, moisture, and daily wear for enduring radiance.'
  },
  {
    icon: Award,
    title: 'Skin-Safe & Hypoallergenic',
    description: 'Forged strictly with 100% lead, nickel, and cadmium-free brass and copper cores, making them completely safe for sensitive skin.'
  },
  {
    icon: Box,
    title: 'Affordable Luxury',
    description: 'Wear royal bridal Kundan, temple harams, and diamond solitaires with confidence and peace of mind at a fraction of solid gold costs.'
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
