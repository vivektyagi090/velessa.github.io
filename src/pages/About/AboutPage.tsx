import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Gem, Award, Shield, ArrowRight } from 'lucide-react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Button } from '../../components/common/Button';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-ivory pb-24">
      {/* Editorial Hero */}
      <section className="relative h-[65vh] sm:h-[75vh] flex items-center justify-center bg-charcoal overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=2000&q=85"
            alt="Velessa Haute Joaillerie Atelier"
            className="w-full h-full object-cover filter brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-black/60" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-ivory space-y-4">
          <span className="text-[11px] uppercase tracking-[0.35em] text-champagne font-sans font-medium flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            The Maison Story
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight">
            Sculpted for Eternity, <br />
            <span className="italic gold-gradient-text font-normal">Born in Light.</span>
          </h1>
          <p className="text-sm sm:text-base text-ivory/80 font-sans font-light max-w-xl mx-auto leading-relaxed">
            Where old-world European craftsmanship converses with modern architectural purity.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumb items={[{ label: 'About Velessa' }]} />

        {/* Section 1: Our Story */}
        <section className="py-16 sm:py-24 border-b border-beige">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.3em] text-champagne font-sans font-semibold">
                Genesis & Heritage
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-light text-charcoal leading-tight">
                Our Story
              </h2>
              <div className="w-12 h-[1px] bg-champagne" />
              <p className="text-sm text-charcoal-muted font-sans font-light leading-relaxed">
                Velessa was established with an uncompromising mission: to liberate fine jewellery from seasonal fashion whims and return to the realm of pure sculpture. Conceived in Milan and crafted by generational masters, our jewels represent intimate monuments of devotion, milestones, and personal power.
              </p>
              <p className="text-sm text-charcoal-muted font-sans font-light leading-relaxed">
                We believe fine jewellery shouldn't be sequestered in safe vaults waiting for rare celebrations. It belongs against the warmth of your skin, capturing daylight during quiet mornings and commanding moonlit evenings.
              </p>
            </div>

            <div className="lg:col-span-6 aspect-[4/5] rounded-sm overflow-hidden shadow-luxury border border-beige">
              <img
                src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85"
                alt="Atelier Goldsmith Hand"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Our Philosophy & Design */}
        <section className="py-16 sm:py-24 border-b border-beige">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 lg:order-2 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.3em] text-champagne font-sans font-semibold">
                The Aesthetic Manifesto
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-light text-charcoal leading-tight">
                Design Philosophy
              </h2>
              <div className="w-12 h-[1px] bg-champagne" />
              <p className="text-sm text-charcoal-muted font-sans font-light leading-relaxed">
                Our design ethos is anchored in restraint. We subtract the extraneous until only essential beauty remains. We study the way metal reflects ambient candlelight, the exact balance of a pendant resting along the clavicle, and the weight of an 18k solid gold bangle against the wrist.
              </p>
              <div className="p-6 bg-beige/30 border-l-2 border-champagne space-y-2">
                <p className="font-serif italic text-lg text-charcoal">
                  “Simplicity is not the lack of detail; it is the absolute mastery of proportion.”
                </p>
                <span className="text-[11px] uppercase font-sans tracking-widest text-champagne block">
                  — Atelier Director, Velessa
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 lg:order-1 aspect-[4/5] rounded-sm overflow-hidden shadow-luxury border border-beige">
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85"
                alt="Fluid Gold Design"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Section 3: Craftsmanship */}
        <section className="py-16 sm:py-24 border-b border-beige">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] uppercase tracking-[0.3em] text-champagne font-sans font-semibold">
              Master Goldsmithing
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-charcoal mt-2">
              The Art of Craftsmanship
            </h2>
            <div className="w-12 h-[1px] bg-champagne mx-auto my-4" />
            <p className="text-sm text-charcoal-muted font-sans font-light leading-relaxed">
              Every curve is hand-filed, every bezel burnished with meticulous patience. We preserve artisanal techniques that have elevated fine jewellery for centuries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-beige p-8 rounded-sm text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-champagne/10 border border-champagne/30 flex items-center justify-center mx-auto text-champagne">
                <Gem className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-charcoal">Microscope Stone Setting</h3>
              <p className="text-xs text-charcoal-muted font-sans leading-relaxed">
                Micro-pavé diamonds are positioned under 40x stereoscopic magnification, securing each stone with microscopic shared beads that maximize refraction.
              </p>
            </div>

            <div className="bg-white border border-beige p-8 rounded-sm text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-champagne/10 border border-champagne/30 flex items-center justify-center mx-auto text-champagne">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-charcoal">18k Champagne Gold</h3>
              <p className="text-xs text-charcoal-muted font-sans leading-relaxed">
                Our bespoke alloy blends 75% pure gold with copper and silver in secret proprietary ratios, delivering our trademark silky, buttery champagne tone.
              </p>
            </div>

            <div className="bg-white border border-beige p-8 rounded-sm text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-champagne/10 border border-champagne/30 flex items-center justify-center mx-auto text-champagne">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-charcoal">Ethical Conflict-Free</h3>
              <p className="text-xs text-charcoal-muted font-sans leading-relaxed">
                We trace every gemstone to responsible origins. Our diamonds adhere strictly to the Kimberley Process and sustainable lab-synthesis certification.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Our Promise */}
        <section className="py-20 text-center max-w-4xl mx-auto space-y-6">
          <span className="text-[11px] uppercase tracking-[0.3em] text-champagne font-sans font-semibold">
            Lifetime Commitment
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-charcoal">
            The Velessa Promise
          </h2>
          <p className="text-sm sm:text-base text-charcoal-muted font-sans font-light leading-relaxed max-w-2xl mx-auto">
            When you acquire a Velessa creation, you enter our circle. We stand behind our pieces with lifetime complimentary cleaning, annual prong inspections, and certificate re-verification.
          </p>

          <div className="pt-6">
            <Link to="/shop">
              <Button variant="primary" size="lg" className="group flex items-center gap-2 mx-auto">
                <span>Explore Current Salon Creations</span>
                <ArrowRight className="w-4 h-4 text-champagne group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
