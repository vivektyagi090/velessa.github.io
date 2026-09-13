import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Copy, 
  Check, 
  Timer, 
  Gift, 
  Tag, 
  Percent, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Crown
} from 'lucide-react';
import festiveBannerImg from '../../assets/images/festive_offer_banner.jpg';
import diamondBannerImg from '../../assets/images/diamond_offer_banner.jpg';
import kundanBannerImg from '../../assets/images/kundan_offer_banner.jpg';
import banglesBannerImg from '../../assets/images/bangles_offer_banner.jpg';
import jewelleryBackdropImg from '../../assets/images/jewellery_banner_backdrop.jpg';

interface OfferSlide {
  id: string;
  badge: string;
  tabLabel: string;
  title: string;
  highlightText: string;
  description: string;
  couponCode: string;
  discountBadge: string;
  perk: string;
  ctaText: string;
  ctaLink: string;
  image: string;
}

const OFFERS: OfferSlide[] = [
  {
    id: 'festive-utsav',
    badge: 'Limited Festive Utsav Edition',
    tabLabel: '✨ Festive Gold (20% Off)',
    title: 'ROYAL GOLD UTSAV',
    highlightText: 'FLAT 20% OFF + FREE COIN',
    description: 'Celebrate with handcrafted 1 Gram Gold Forming & Royal Kundan Heirlooms. Receive a complimentary 24K gold polish coin on all orders above ₹1,999.',
    couponCode: 'UTSAV20',
    discountBadge: 'FLAT 20% OFF',
    perk: '🎁 Free 1 Gram Gold Polish Coin Included',
    ctaText: 'Claim Festive Offer',
    ctaLink: '/shop?collection=Signature+Collection',
    image: festiveBannerImg,
  },
  {
    id: 'bridal-solitaire',
    badge: 'Special Bridal & Solitaire Week',
    tabLabel: '💎 Solitaire & Diamonds (Buy 2 Get 1)',
    title: 'ATELIER BRIDAL GLOW',
    highlightText: 'BUY 2 GET 1 PENDANT FREE',
    description: 'Indulge in calibrated American Diamond chokers and rose gold creations. Purchase any 2 pieces and receive an exclusive matching solitaire pendant.',
    couponCode: 'BRIDALGLOW',
    discountBadge: 'BUY 2 GET 1',
    perk: '✨ Lifetime Free Anti-Tarnish Re-Polishing',
    ctaText: 'Explore Bridal Offers',
    ctaLink: '/shop?category=Necklaces',
    image: diamondBannerImg,
  },
  {
    id: 'kundan-meenakari',
    badge: 'Royal Heritage Kundan Edition',
    tabLabel: '🦚 Royal Kundan (30% Off)',
    title: 'HERITAGE MEENAKARI SPECIAL',
    highlightText: 'FLAT 30% OFF ON KUNDAN',
    description: 'Exquisite hand-painted Rajasthani Meenakari choker sets studded with un-cut Polki stones and emerald drops with genuine 18K gold forming finish.',
    couponCode: 'KUNDAN30',
    discountBadge: 'FLAT 30% OFF',
    perk: '👑 Authentic Jodhpur Artisan Certified',
    ctaText: 'Shop Kundan Sets',
    ctaLink: '/shop?material=Kundan+%26+Meenakari',
    image: kundanBannerImg,
  },
  {
    id: 'temple-bangles',
    badge: 'Antique Temple Kada Festival',
    tabLabel: '⭕ Temple Bangles (Buy 1 Get 1 50% Off)',
    title: 'SOUTH TEMPLE KADA FEST',
    highlightText: 'BUY 1 GET 2ND AT 50% OFF',
    description: 'Traditional Lakshmi & Peacock carved 1-Gram gold forming bangles and antique openable kadas. Micro-plated with 24K pure gold layer.',
    couponCode: 'TEMPLE50',
    discountBadge: '2ND AT 50% OFF',
    perk: '🛡️ 24K Micro Gold Hard Plated - 1 Year Guarantee',
    ctaText: 'Shop Bangles & Kadas',
    ctaLink: '/shop?category=Bangles',
    image: banglesBannerImg,
  },
  {
    id: 'imperial-necklace',
    badge: 'Artisan Handcrafted 1-Gram Gold',
    tabLabel: '⚜️ Imperial Gold Sets (25% Off)',
    title: 'IMPERIAL GOLD FORMING ATELIER',
    highlightText: 'FLAT 25% OFF ON SETS',
    description: 'Intricately embossed South Indian temple motifs with freshwater seed pearls and ruby accents. Finished in lustrous 24K pure gold micro-forming.',
    couponCode: 'GOLD25',
    discountBadge: 'FLAT 25% OFF',
    perk: '✨ 100% Skin-Friendly & Anti-Allergic Gold Layer',
    ctaText: 'Shop Necklace Sets',
    ctaLink: '/shop?category=Necklaces',
    image: jewelleryBackdropImg,
  },
];

interface MarketingOffersSectionProps {
  isTopHero?: boolean;
}

export const MarketingOffersSection: React.FC<MarketingOffersSectionProps> = ({ isTopHero = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 38,
    seconds: 45,
  });

  // Countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto advance slide every 6 seconds (pauses when user hovers)
  useEffect(() => {
    if (isPaused) return;
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % OFFERS.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, [isPaused]);

  const handleCopyCode = (code: string) => {
    try {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    } catch {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  const activeOffer = OFFERS[currentSlide];

  return (
    <section 
      className={`relative bg-ivory ${isTopHero ? 'pt-2 sm:pt-3 pb-6 sm:pb-8' : 'py-4 sm:py-6'} border-b border-beige overflow-hidden`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Main Hero Offer Showcase Card - Grand & Expansive */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-charcoal border border-champagne/40 text-ivory">
          
          {/* Background Image Container with Expanded Height */}
          <div className="relative min-h-[580px] sm:min-h-[560px] lg:min-h-[650px] flex items-center">
            <div className="absolute inset-0 z-0">
              <img
                src={activeOffer.image}
                alt={activeOffer.title}
                className="w-full h-full object-cover object-center transition-all duration-700 ease-out filter brightness-[0.98] contrast-[1.03]"
              />
              {/* Premium Luxury Vignette - gentle on the left for text contrast, completely clear on the jewellery */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/60 via-55% to-transparent lg:bg-gradient-to-r lg:from-charcoal/85 lg:via-charcoal/40 lg:via-45% lg:to-transparent" />
            </div>

            {/* Decorative Gold Inner Border */}
            <div className="absolute inset-3 sm:inset-6 border border-champagne/25 rounded-xl sm:rounded-2xl pointer-events-none z-10 hidden sm:block" />

            {/* Slide Content Overlay - Generous left padding to keep text completely clear of navigation buttons */}
            <div className="relative z-20 w-full py-8 sm:py-12 lg:py-16 px-6 sm:pl-28 sm:pr-8 lg:pl-32 lg:pr-12 max-w-3xl space-y-5 sm:space-y-6">
              
              {/* Top Row: Kicker Pill & Live Urgency Timer */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 border border-champagne/60 text-champagne text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-sans font-medium backdrop-blur-md shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-champagne shrink-0" />
                  <span>{activeOffer.badge}</span>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/65 border border-ivory/25 text-ivory text-[10px] sm:text-[11px] font-mono tracking-wider backdrop-blur-md shadow-md">
                  <Timer className="w-3.5 h-3.5 text-champagne animate-pulse" />
                  <span>Ends in:</span>
                  <span className="text-champagne font-bold">
                    {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                  </span>
                </div>
              </div>

              {/* Title & Discount Highlight */}
              <div className="space-y-2">
                <span className="block text-xs uppercase tracking-[0.3em] text-champagne font-sans font-medium drop-shadow-sm">
                  {activeOffer.title}
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-[1.08] text-white drop-shadow-md">
                  <span className="gold-gradient-text font-normal">{activeOffer.highlightText}</span>
                </h2>
              </div>

              {/* Description - Completely clear of side arrows */}
              <p className="text-xs sm:text-sm md:text-base text-ivory font-sans font-light leading-relaxed max-w-xl drop-shadow-sm">
                {activeOffer.description}
              </p>

              {/* Perk Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-black/50 border border-champagne/40 text-champagne text-xs font-sans backdrop-blur-md shadow-sm">
                <span>{activeOffer.perk}</span>
              </div>

              {/* Action Area: Coupon Code + Shop CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                
                {/* Coupon Code Copy Box */}
                <div className="inline-flex items-center justify-between gap-3 px-4 py-2.5 rounded-md bg-black/75 border border-champagne/60 text-xs font-mono backdrop-blur-md shadow-inner">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-champagne" />
                    <span className="text-ivory/70 text-[11px] uppercase tracking-wider font-sans">CODE:</span>
                    <span className="text-champagne font-bold text-sm tracking-wider">{activeOffer.couponCode}</span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(activeOffer.couponCode)}
                    className="flex items-center gap-1 text-[11px] font-sans px-2.5 py-1 rounded bg-champagne text-charcoal font-semibold hover:bg-champagne-light transition-all active:scale-95 cursor-pointer"
                    title="Click to copy coupon code"
                  >
                    {copiedCode === activeOffer.couponCode ? (
                      <>
                        <Check className="w-3 h-3 text-charcoal" />
                        <span>COPIED!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-charcoal" />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Claim Offer CTA Button */}
                <Link to={activeOffer.ctaLink}>
                  <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-md bg-gradient-to-r from-champagne via-champagne-light to-champagne text-charcoal font-serif tracking-wider uppercase text-xs font-semibold shadow-gold-glow hover:brightness-105 active:scale-98 transition-all cursor-pointer">
                    <span>{activeOffer.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>

            </div>

            {/* Desktop Side Navigation Arrows - Positioned with safe clearance outside the text column */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? OFFERS.length - 1 : prev - 1))}
              className="hidden sm:flex absolute left-4 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-ivory hover:text-champagne border border-champagne/50 items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-xl hover:scale-105"
              aria-label="Previous Offer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % OFFERS.length)}
              className="hidden sm:flex absolute right-4 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-ivory hover:text-champagne border border-champagne/50 items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-xl hover:scale-105"
              aria-label="Next Offer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Slide Indicator Dots & Unified Navigation Pill */}
            <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-3 bg-black/60 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-md border border-champagne/30 shadow-xl">
              <button
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? OFFERS.length - 1 : prev - 1))}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-ivory/80 hover:text-champagne hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Previous Offer"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="flex items-center gap-2">
                {OFFERS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentSlide === idx ? 'w-8 sm:w-9 bg-champagne shadow-gold-glow' : 'w-2 sm:w-2.5 bg-ivory/40 hover:bg-ivory/70'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % OFFERS.length)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-ivory/80 hover:text-champagne hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Next Offer"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

          </div>

        </div>

        {/* 3 Quick-Offer Deals Ribbon Below */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          
          {/* Card 1 */}
          <div className="bg-white border border-beige rounded-xl p-5 shadow-xs hover:shadow-md hover:border-champagne/60 transition-all flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-beige/60 text-champagne-dark flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-champagne-dark">
                  FREE GIFT ABOVE ₹1,999
                </span>
                <span className="text-[10px] font-mono text-charcoal-muted bg-beige px-1.5 py-0.5 rounded">
                  AUTO-APPLIED
                </span>
              </div>
              <h4 className="font-serif text-sm font-normal text-charcoal">
                Complimentary 1g Gold Coin
              </h4>
              <p className="text-[11px] text-charcoal-muted font-sans leading-relaxed">
                Receive an authentic 24K micro-plated commemorative coin packed with every order.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-beige rounded-xl p-5 shadow-xs hover:shadow-md hover:border-champagne/60 transition-all flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-beige/60 text-champagne-dark flex items-center justify-center shrink-0">
              <Percent className="w-5 h-5" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-champagne-dark">
                  FIRST ORDER PERK
                </span>
                <button
                  onClick={() => handleCopyCode('FIRST300')}
                  className="text-[10px] font-mono text-champagne hover:underline cursor-pointer"
                >
                  {copiedCode === 'FIRST300' ? 'COPIED! ✓' : 'USE: FIRST300'}
                </button>
              </div>
              <h4 className="font-serif text-sm font-normal text-charcoal">
                Extra ₹300 Instant Discount
              </h4>
              <p className="text-[11px] text-charcoal-muted font-sans leading-relaxed">
                Enjoy ₹300 off your welcome purchase at checkout with zero minimum cart threshold.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-beige rounded-xl p-5 shadow-xs hover:shadow-md hover:border-champagne/60 transition-all flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-beige/60 text-champagne-dark flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-champagne-dark">
                  ATELIER ASSURANCE
                </span>
                <span className="text-[10px] font-mono text-charcoal-muted bg-beige px-1.5 py-0.5 rounded">
                  100% VERIFIED
                </span>
              </div>
              <h4 className="font-serif text-sm font-normal text-charcoal">
                Anti-Tarnish &amp; Insured Transit
              </h4>
              <p className="text-[11px] text-charcoal-muted font-sans leading-relaxed">
                Tamper-evident luxury red gift box packaging with full transit insurance on every dispatch.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
