import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { SectionHeading } from '../common/SectionHeading';
import { formatPrice } from '../../utils/formatters';

export const FeaturedCategories: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Curated Categories"
          title="Exceptional Creations"
          description="Explore our meticulously crafted fine jewellery categories, each embodying our devotion to architectural lines and everlasting brilliance."
        />

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.name}`}
              className="group relative h-[380px] sm:h-[440px] overflow-hidden rounded-sm bg-charcoal shadow-luxury hover:shadow-luxury-hover transition-all duration-500 flex flex-col justify-end p-6 sm:p-8"
            >
              {/* Background Image with Zoom */}
              <div className="absolute inset-0 z-0">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out filter brightness-[0.85] group-hover:brightness-95"
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300" />
                <div className="absolute inset-0 border border-champagne/0 group-hover:border-champagne/60 transition-colors duration-500 m-3 pointer-events-none" />
              </div>

              {/* Card Content */}
              <div className="relative z-10 text-ivory transform transition-transform duration-300 group-hover:-translate-y-1">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-champagne font-sans font-medium block mb-1">
                  From {formatPrice(category.startingPrice)} • {category.itemCount} Designs
                </span>

                <h3 className="font-serif text-2xl sm:text-3xl font-light text-ivory group-hover:text-champagne-light transition-colors duration-300">
                  {category.name}
                </h3>

                <p className="text-xs text-ivory/70 font-sans mt-2 line-clamp-2 leading-relaxed opacity-90">
                  {category.description}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-champagne font-sans font-medium">
                  <span>Discover {category.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
