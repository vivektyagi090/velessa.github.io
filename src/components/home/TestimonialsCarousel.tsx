import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, CheckCircle2 } from 'lucide-react';
import { TESTIMONIALS } from '../../data/reviews';
import { SectionHeading } from '../common/SectionHeading';
import { RatingStars } from '../common/RatingStars';

export const TestimonialsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="py-20 sm:py-28 bg-beige/25 border-t border-beige overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Client Impressions"
          title="Words of Appreciation"
          description="Reflections from our international patrons and collectors on their bespoke Velessa acquisitions."
        />

        <div className="relative bg-white border border-beige rounded-sm p-8 sm:p-14 shadow-luxury">
          {/* Quote Icon */}
          <div className="absolute top-6 right-8 text-champagne/20">
            <Quote className="w-16 h-16" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Customer Avatar */}
            {current.image && (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-champagne shrink-0 shadow-md">
                <img
                  src={current.image}
                  alt={current.customerName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {/* Testimonial Content */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <RatingStars rating={current.rating} size="md" showNumeric={false} />

              <blockquote className="font-serif text-lg sm:text-2xl text-charcoal font-light italic leading-relaxed">
                “{current.review}”
              </blockquote>

              <div className="pt-2 border-t border-beige flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-1.5">
                    <span className="font-sans font-medium text-charcoal text-sm">
                      {current.customerName}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-champagne" />
                    <span className="text-[10px] uppercase font-sans text-charcoal-muted tracking-wider">
                      Verified Collector
                    </span>
                  </div>
                  <span className="text-xs text-charcoal-muted font-sans">
                    {current.location} • Acquired: {current.purchasedProduct}
                  </span>
                </div>

                {/* Carousel Controls */}
                <div className="flex items-center justify-center gap-2 pt-2 sm:pt-0">
                  <button
                    onClick={handlePrev}
                    className="w-10 h-10 rounded-full border border-beige hover:border-champagne hover:bg-champagne/10 flex items-center justify-center text-charcoal transition-colors"
                    aria-label="Previous review"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleNext}
                    className="w-10 h-10 rounded-full border border-beige hover:border-champagne hover:bg-champagne/10 flex items-center justify-center text-charcoal transition-colors"
                    aria-label="Next review"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  currentIndex === idx ? 'w-6 bg-champagne' : 'w-1.5 bg-beige-dark'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
