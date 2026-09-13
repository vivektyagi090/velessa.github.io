import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { COLLECTIONS } from '../../data/collections';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Button } from '../../components/common/Button';

export const CollectionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-ivory pb-24">
      {/* Editorial Header */}
      <div className="bg-beige/30 border-b border-beige py-12 sm:py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[11px] uppercase tracking-[0.3em] text-champagne font-sans font-medium mb-3 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Themes
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-charcoal tracking-tight">
            Velessa Collections
          </h1>
          <div className="w-16 h-[1px] bg-champagne mx-auto my-4" />
          <p className="text-sm sm:text-base text-charcoal-muted font-sans font-light max-w-2xl mx-auto leading-relaxed">
            Each collection represents a distinct philosophy of form, material harmony, and modern expression—handcrafted for lifetime devotion.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumb items={[{ label: 'Collections' }]} />

        {/* Collections Editorial Grid / Vertical Showcase */}
        <div className="space-y-16 sm:space-y-24 mt-8">
          {COLLECTIONS.map((collection, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={collection.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center bg-white/70 border border-beige rounded-sm overflow-hidden p-6 sm:p-10 shadow-luxury"
              >
                {/* Image Column */}
                <div
                  className={`lg:col-span-7 relative aspect-[16/10] overflow-hidden rounded-sm group ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <img
                    src={collection.heroImage}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  {collection.accentQuote && (
                    <div className="absolute bottom-4 left-4 right-4 text-ivory font-serif text-sm sm:text-base italic bg-charcoal/60 backdrop-blur-xs p-3 rounded-xs border-l-2 border-champagne">
                      “{collection.accentQuote}”
                    </div>
                  )}
                </div>

                {/* Text Column */}
                <div
                  className={`lg:col-span-5 space-y-4 ${
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-champagne font-sans font-semibold">
                    {collection.tagline}
                  </span>

                  <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-light leading-tight">
                    {collection.name}
                  </h2>

                  <p className="text-xs sm:text-sm text-charcoal-muted font-sans leading-relaxed">
                    {collection.description}
                  </p>

                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    <Link to={`/shop?collection=${encodeURIComponent(collection.name)}`}>
                      <Button
                        variant="primary"
                        size="md"
                        className="group flex items-center gap-2"
                      >
                        <span>Shop {collection.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-champagne" />
                      </Button>
                    </Link>

                    <Link to={`/shop?collection=${encodeURIComponent(collection.name)}`}>
                      <Button variant="secondary" size="md">
                        Explore Line
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
