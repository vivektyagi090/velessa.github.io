import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

import categorySetsImg from '../../assets/images/categories/category_sets.jpg';
import categoryEarringsImg from '../../assets/images/categories/category_earrings.jpg';
import categoryRingsImg from '../../assets/images/categories/category_rings.jpg';
import categoryBanglesImg from '../../assets/images/categories/category_bangles.jpg';
import categoryMangalsutrasImg from '../../assets/images/categories/category_mangalsutras.jpg';
import categoryNecklacesImg from '../../assets/images/categories/category_necklaces.jpg';
import categoryPendantsImg from '../../assets/images/categories/category_pendants.jpg';
import categoryBraceletsImg from '../../assets/images/categories/category_bracelets.jpg';
import categoryMaangtikkaImg from '../../assets/images/categories/category_maangtikka.jpg';
import categoryPayalImg from '../../assets/images/categories/category_payal.jpg';
import categoryNathImg from '../../assets/images/categories/category_nath.jpg';
import categoryFormingImg from '../../assets/images/categories/category_forming.jpg';

interface CategoryItem {
  id: string;
  name: string;
  tagline: string;
  badge?: string;
  image: string;
  link: string;
  count: string;
}

const QUICK_CATEGORIES: CategoryItem[] = [
  {
    id: 'sets',
    name: 'Jewellery Sets',
    tagline: 'Choker & Jhumka Sets',
    badge: 'Trending',
    image: categorySetsImg,
    link: '/shop?category=Necklaces',
    count: '16+ Sets',
  },
  {
    id: 'earrings',
    name: 'Earrings',
    tagline: 'Jhumkas & Chandbalis',
    badge: 'Popular',
    image: categoryEarringsImg,
    link: '/shop?category=Earrings',
    count: '24+ Designs',
  },
  {
    id: 'rings',
    name: 'Rings',
    tagline: 'Solitaire & Bands',
    badge: 'Bestseller',
    image: categoryRingsImg,
    link: '/shop?category=Rings',
    count: '18+ Designs',
  },
  {
    id: 'bangles',
    name: 'Bangles',
    tagline: 'Kadas & Chudas',
    badge: '24K Polish',
    image: categoryBanglesImg,
    link: '/shop?category=Bangles',
    count: '14+ Designs',
  },
  {
    id: 'mangalsutras',
    name: 'Mangalsutras',
    tagline: 'Sacred Beads & Pendants',
    badge: 'Daily Wear',
    image: categoryMangalsutrasImg,
    link: '/shop?category=Mangalsutras',
    count: '12+ Designs',
  },
  {
    id: 'necklaces',
    name: 'Necklaces',
    tagline: 'Chokers & Harams',
    badge: 'Bridal',
    image: categoryNecklacesImg,
    link: '/shop?category=Necklaces',
    count: '20+ Designs',
  },
  {
    id: 'pendants',
    name: 'Pendants',
    tagline: 'Solitaire & Drop Chains',
    badge: 'New',
    image: categoryPendantsImg,
    link: '/shop?category=Pendants',
    count: '15+ Designs',
  },
  {
    id: 'bracelets',
    name: 'Bracelets',
    tagline: 'Tennis & Charm Chains',
    badge: 'Trending',
    image: categoryBraceletsImg,
    link: '/shop?category=Bracelets',
    count: '12+ Designs',
  },
  {
    id: 'maangtikka',
    name: 'Maang Tikka',
    tagline: 'Matha Patti & Borla',
    badge: 'Heritage',
    image: categoryMaangtikkaImg,
    link: '/shop?category=Necklaces',
    count: '10+ Designs',
  },
  {
    id: 'payal',
    name: 'Anklets (Payal)',
    tagline: 'Ghungroo & Filigree',
    badge: 'Classic',
    image: categoryPayalImg,
    link: '/shop?category=Bangles',
    count: '10+ Designs',
  },
  {
    id: 'nath',
    name: 'Nose Rings (Nath)',
    tagline: 'Bridal Kundan & Pearls',
    badge: 'Royal',
    image: categoryNathImg,
    link: '/shop?category=Earrings',
    count: '8+ Designs',
  },
  {
    id: 'forming',
    name: '1 Gram Gold',
    tagline: '24K Micro Gold Plated',
    badge: 'Exclusive',
    image: categoryFormingImg,
    link: '/shop?category=1+Gram+Gold+Forming',
    count: '35+ Designs',
  },
];

export const CategoryQuickStrip: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const amount = direction === 'left' ? -380 : 380;
    scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <section className="py-4 sm:py-6 bg-ivory border-b border-beige/60 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Strip Header: Subtle Luxury Presentation */}
        <div className="flex items-center justify-between mb-3 sm:mb-4 px-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-champagne animate-pulse" />
            <h2 className="font-serif text-base sm:text-xl font-normal text-charcoal tracking-wide">
              Explore Collections
            </h2>
            <span className="hidden sm:inline-block text-[11px] text-charcoal-muted font-sans border-l border-beige pl-2">
              12 Atelier Departments • Handcrafted 1 Gram Gold Forming
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/shop"
              className="text-[11px] sm:text-xs font-sans text-champagne-dark hover:text-charcoal font-medium flex items-center gap-1 group transition-colors"
            >
              <span>View All ({QUICK_CATEGORIES.length})</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Desktop Navigation Chevrons */}
            <div className="hidden md:flex items-center gap-1.5 ml-2">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="w-8 h-8 rounded-full border border-beige hover:border-champagne bg-white hover:bg-beige/20 text-charcoal flex items-center justify-center transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
                aria-label="Previous categories"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="w-8 h-8 rounded-full border border-beige hover:border-champagne bg-white hover:bg-beige/20 text-charcoal flex items-center justify-center transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
                aria-label="Next categories"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Category Showcase */}
        <div
          ref={scrollContainerRef}
          className="flex items-start gap-3 sm:gap-4 lg:gap-5 overflow-x-auto scrollbar-none pb-2 pt-1 px-1 snap-x snap-mandatory scroll-smooth"
        >
          {QUICK_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={cat.link}
              className="group flex flex-col items-center shrink-0 snap-start w-[102px] xs:w-[116px] sm:w-[136px] md:w-[148px] lg:w-[160px] cursor-pointer text-center select-none"
            >
              {/* Image Frame with Dual-Border & Gold Glow */}
              <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-[#F8F5EE] border border-beige hover:border-champagne shadow-xs group-hover:shadow-gold-glow transition-all duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
                />

                {/* Subtle Luxury Corner Tag */}
                {cat.badge && (
                  <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-sm bg-black/70 backdrop-blur-xs text-[8px] sm:text-[9px] font-sans font-semibold text-champagne uppercase tracking-wider border border-champagne/30">
                      <Sparkles className="w-2 h-2 text-champagne" />
                      <span>{cat.badge}</span>
                    </span>
                  </div>
                )}

                {/* Soft Bottom Gradient & Hover Sheen */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>

              {/* Title & Micro Tagline */}
              <h3 className="font-serif text-xs sm:text-sm font-medium text-charcoal group-hover:text-champagne-dark transition-colors tracking-wide mt-2 sm:mt-2.5 line-clamp-1">
                {cat.name}
              </h3>
              <span className="text-[10px] sm:text-[11px] text-charcoal-muted font-sans line-clamp-1 block mt-0.5 group-hover:text-charcoal transition-colors">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
