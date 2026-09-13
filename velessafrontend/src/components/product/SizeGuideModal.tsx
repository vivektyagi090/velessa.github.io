import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Ruler, Sparkles, HelpCircle, ZoomIn, X, ChevronRight } from 'lucide-react';
import { ProductCategory } from '../../types/product';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: ProductCategory | string;
}

type GuideTab = 'necklaces' | 'rings' | 'bangles' | 'earrings';

interface FullscreenImage {
  src: string;
  alt: string;
  title: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  category,
}) => {
  const getInitialTab = (): GuideTab => {
    if (!category) return 'necklaces';
    const cat = category.toLowerCase();
    if (cat.includes('ring')) return 'rings';
    if (cat.includes('bangle') || cat.includes('bracelet')) return 'bangles';
    if (cat.includes('earring')) return 'earrings';
    return 'necklaces';
  };

  const [activeTab, setActiveTab] = useState<GuideTab>(getInitialTab);
  const [fullscreenImage, setFullscreenImage] = useState<FullscreenImage | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(getInitialTab());
      setFullscreenImage(null);
    }
  }, [isOpen, category]);

  // Reusable Visual Demo Card Component
  const renderVisualDemoCard = (
    src: string,
    alt: string,
    title: string,
    shortTitle: string
  ) => (
    <div className="bg-white border border-beige rounded-sm overflow-hidden shadow-xs">
      {/* Visual Header Bar */}
      <div className="px-3 py-2 sm:px-4 sm:py-2.5 bg-[#FAF7F2] border-b border-beige/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-champagne/20 text-champagne-dark shrink-0">
            <Sparkles className="w-3 h-3 text-champagne-dark" />
          </span>
          <span className="font-serif text-xs sm:text-sm font-semibold text-charcoal truncate">
            <span className="sm:hidden">{shortTitle}</span>
            <span className="hidden sm:inline">{title}</span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => setFullscreenImage({ src, alt, title })}
          className="inline-flex items-center gap-1 text-[11px] text-charcoal-muted hover:text-champagne-dark transition-colors px-2 py-1 rounded-xs hover:bg-beige/40 cursor-pointer shrink-0"
          title="Click to view full image in high resolution"
        >
          <ZoomIn className="w-3.5 h-3.5 text-champagne" />
          <span className="text-[10px] uppercase tracking-wider font-semibold">
            Tap to Zoom
          </span>
        </button>
      </div>

      {/* Uncropped, Aspect-Preserved Visual Graphic */}
      <div
        onClick={() => setFullscreenImage({ src, alt, title })}
        className="group relative bg-white p-2 sm:p-3 cursor-zoom-in flex items-center justify-center overflow-hidden"
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-contain block mx-auto rounded-xs border border-beige/40 shadow-2xs transition-transform duration-200 group-hover:scale-[1.008]"
          loading="lazy"
        />
        <div className="absolute bottom-2.5 right-2.5 sm:bottom-3.5 sm:right-3.5 bg-charcoal/85 text-ivory text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-xs backdrop-blur-xs flex items-center gap-1 shadow-md opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-3 h-3 text-champagne" />
          <span>Tap to Expand</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Jewellery Size Guide"
        maxWidth="4xl"
        bodyClassName="p-3 sm:p-6 space-y-4 sm:space-y-6 font-sans text-charcoal"
      >
        {/* Category Navigation Tabs: Grid of 4 Equal Columns for Seamless Mobile & Desktop View */}
        <div className="grid grid-cols-4 border-b border-beige text-center">
          <button
            type="button"
            onClick={() => setActiveTab('necklaces')}
            className={`pb-2.5 sm:pb-3 px-1 sm:px-3 text-[11px] sm:text-xs md:text-sm uppercase tracking-wider font-medium transition-colors border-b-2 cursor-pointer flex items-center justify-center ${
              activeTab === 'necklaces'
                ? 'border-champagne text-champagne-dark font-semibold'
                : 'border-transparent text-charcoal-muted hover:text-charcoal'
            }`}
          >
            <span className="sm:hidden">Necklaces</span>
            <span className="hidden sm:inline">Chains & Necklaces</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rings')}
            className={`pb-2.5 sm:pb-3 px-1 sm:px-3 text-[11px] sm:text-xs md:text-sm uppercase tracking-wider font-medium transition-colors border-b-2 cursor-pointer flex items-center justify-center ${
              activeTab === 'rings'
                ? 'border-champagne text-champagne-dark font-semibold'
                : 'border-transparent text-charcoal-muted hover:text-charcoal'
            }`}
          >
            Rings
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bangles')}
            className={`pb-2.5 sm:pb-3 px-1 sm:px-3 text-[11px] sm:text-xs md:text-sm uppercase tracking-wider font-medium transition-colors border-b-2 cursor-pointer flex items-center justify-center ${
              activeTab === 'bangles'
                ? 'border-champagne text-champagne-dark font-semibold'
                : 'border-transparent text-charcoal-muted hover:text-charcoal'
            }`}
          >
            <span className="sm:hidden">Bangles</span>
            <span className="hidden sm:inline">Bangles & Bracelets</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('earrings')}
            className={`pb-2.5 sm:pb-3 px-1 sm:px-3 text-[11px] sm:text-xs md:text-sm uppercase tracking-wider font-medium transition-colors border-b-2 cursor-pointer flex items-center justify-center ${
              activeTab === 'earrings'
                ? 'border-champagne text-champagne-dark font-semibold'
                : 'border-transparent text-charcoal-muted hover:text-charcoal'
            }`}
          >
            Earrings
          </button>
        </div>

        {/* Tab 1: Necklaces & Chains */}
        {activeTab === 'necklaces' && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            {renderVisualDemoCard(
              '/images/size-guides/necklace-length-guide.jpg',
              'Necklace Length Visual Demonstration',
              'Necklace Drape Length Demonstration',
              'Necklace Length Demo'
            )}

            <div className="bg-beige/25 p-3 sm:p-4 rounded-sm border border-beige space-y-1">
              <h4 className="font-serif text-sm sm:text-base text-charcoal font-medium flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-champagne" />
                Chain & Necklace Length Guide
              </h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Find the ideal necklace length for pendants, mangalsutras, and chokers. Measurements refer to the total length when unclasped and laid flat.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <div className="p-3 sm:p-3.5 bg-white border border-beige rounded-sm hover:border-champagne/60 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-serif text-xs sm:text-sm font-semibold text-charcoal">16 Inches (40 cm)</span>
                  <span className="text-[10px] uppercase font-bold text-champagne tracking-wider bg-champagne/10 px-2 py-0.5 rounded-xs">Choker / Collar</span>
                </div>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  Rests comfortably right at the base of the throat. Ideal for open necklines, crew necks, and small solitary pendants.
                </p>
              </div>

              <div className="p-3 sm:p-3.5 bg-white border-2 border-champagne/80 rounded-sm shadow-xs bg-gradient-to-br from-champagne/5 to-white">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-serif text-xs sm:text-sm font-semibold text-charcoal">18 Inches (45 cm)</span>
                  <span className="text-[10px] uppercase font-bold text-champagne-dark tracking-wider bg-champagne/20 px-2 py-0.5 rounded-xs">Most Popular</span>
                </div>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  Falls gracefully over the collarbone. The standard versatile length for everyday pendant necklaces like the Velessa Knotted Heart.
                </p>
              </div>

              <div className="p-3 sm:p-3.5 bg-white border border-beige rounded-sm hover:border-champagne/60 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-serif text-xs sm:text-sm font-semibold text-charcoal">20 - 22 Inches (50-55 cm)</span>
                  <span className="text-[10px] uppercase font-bold text-champagne tracking-wider bg-champagne/10 px-2 py-0.5 rounded-xs">Matinee</span>
                </div>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  Sits just below the collarbone, near the upper bust. Perfect for workwear shirts, kurtis, and plunging necklines.
                </p>
              </div>

              <div className="p-3 sm:p-3.5 bg-white border border-beige rounded-sm hover:border-champagne/60 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-serif text-xs sm:text-sm font-semibold text-charcoal">24 - 30 Inches (60-75 cm)</span>
                  <span className="text-[10px] uppercase font-bold text-champagne tracking-wider bg-champagne/10 px-2 py-0.5 rounded-xs">Opera & Haram</span>
                </div>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  Falls midway down the bust or below. Ideal for royal traditional Mangalsutras, Temple Harams, and layered bridal sarees.
                </p>
              </div>
            </div>

            {/* How to measure */}
            <div className="bg-white p-3 sm:p-4 border border-beige rounded-sm space-y-2">
              <h5 className="text-xs uppercase tracking-wider font-semibold text-charcoal flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-champagne" />
                How to Measure Your Neck at Home
              </h5>
              <ol className="text-xs text-charcoal-muted space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>Take a piece of string or ribbon and wrap it comfortably around your neck where you want the necklace to rest.</li>
                <li>Mark the exact point where the ends meet.</li>
                <li>Lay the string flat against a standard ruler to read the length in inches or centimeters.</li>
              </ol>
            </div>
          </div>
        )}

        {/* Tab 2: Rings */}
        {activeTab === 'rings' && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            {renderVisualDemoCard(
              '/images/size-guides/ring-size-guide.jpg',
              'Ring Size Measurement Demonstration',
              'Ring Sizing Methods & Demonstration',
              'Ring Sizing Demo'
            )}

            {/* Understanding CM vs MM for Rings */}
            <div className="bg-[#FAF7F2] p-3 sm:p-3.5 border border-beige rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2 text-charcoal">
                <Ruler className="w-4 h-4 text-champagne shrink-0" />
                <div>
                  <span className="font-semibold text-charcoal">How to Read CM & MM: </span>
                  <span className="text-charcoal-muted">
                    <strong>1 cm = 10 mm</strong> on a ruler (divide mm by 10 to get cm).
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-champagne-dark bg-white px-2.5 py-1 rounded-xs border border-beige/70 shrink-0">
                <span>16.5 mm = 1.65 cm (Photo Method 1)</span>
                <span className="text-charcoal-muted font-normal">•</span>
                <span>53 mm = 5.3 cm (Photo Method 2)</span>
              </div>
            </div>

            <div className="bg-beige/25 p-3 sm:p-4 rounded-sm border border-beige space-y-1">
              <h4 className="font-serif text-sm sm:text-base text-charcoal font-medium flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-champagne" />
                Ring Size Conversion Table (Both CM & MM)
              </h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                We use standard Indian and US ring sizing. Measure the inner diameter of an existing ring or wrap a strip around your finger for circumference.
              </p>
            </div>

            <div>
              <div className="sm:hidden text-[10px] text-charcoal-muted flex items-center justify-end gap-1 mb-1 px-1">
                <span>Swipe chart horizontally</span>
                <ChevronRight className="w-3 h-3 text-champagne" />
              </div>

              <div className="overflow-x-auto border border-beige rounded-sm">
                <table className="w-full text-left text-xs font-sans min-w-[520px] sm:min-w-full">
                  <thead className="bg-beige/40 text-charcoal uppercase tracking-wider text-[10px] sm:text-[11px] font-semibold border-b border-beige">
                    <tr>
                      <th className="py-2 sm:py-2.5 px-2.5 sm:px-3">Indian Size</th>
                      <th className="py-2 sm:py-2.5 px-2.5 sm:px-3">US Size</th>
                      <th className="py-2 sm:py-2.5 px-2.5 sm:px-3">Inner Diameter (MM / CM)</th>
                      <th className="py-2 sm:py-2.5 px-2.5 sm:px-3">Circumference (MM / CM)</th>
                      <th className="py-2 sm:py-2.5 px-2.5 sm:px-3">Best For</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-beige/60 bg-white text-[11px] sm:text-xs">
                    <tr>
                      <td className="py-2 px-2.5 sm:px-3 font-semibold text-charcoal">Size 10</td>
                      <td className="py-2 px-2.5 sm:px-3">US 5.5</td>
                      <td className="py-2 px-2.5 sm:px-3 font-medium">15.9 mm <span className="text-charcoal-muted font-normal">(1.59 cm)</span></td>
                      <td className="py-2 px-2.5 sm:px-3">49.9 mm <span className="text-charcoal-muted">(~5.0 cm)</span></td>
                      <td className="py-2 px-2.5 sm:px-3 text-charcoal-muted">Petite / Pinky</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5 sm:px-3 font-semibold text-charcoal">Size 12</td>
                      <td className="py-2 px-2.5 sm:px-3">US 6.0</td>
                      <td className="py-2 px-2.5 sm:px-3 font-medium">16.5 mm <span className="text-charcoal-muted font-normal">(1.65 cm)</span></td>
                      <td className="py-2 px-2.5 sm:px-3">51.8 mm <span className="text-charcoal-muted">(~5.2 cm)</span></td>
                      <td className="py-2 px-2.5 sm:px-3 text-charcoal-muted">Small Ring Finger <span className="text-[10px] text-champagne-dark font-semibold">(Method 1 in Photo)</span></td>
                    </tr>
                    <tr className="bg-champagne/10">
                      <td className="py-2 px-2.5 sm:px-3 font-semibold text-charcoal-dark">Size 14</td>
                      <td className="py-2 px-2.5 sm:px-3 font-medium">US 7.0</td>
                      <td className="py-2 px-2.5 sm:px-3 font-bold text-champagne-dark">17.3 mm <span className="font-normal">(1.73 cm)</span></td>
                      <td className="py-2 px-2.5 sm:px-3 font-bold text-champagne-dark">54.4 mm <span className="font-normal">(~5.4 cm)</span></td>
                      <td className="py-2 px-2.5 sm:px-3 font-medium text-champagne-dark">Standard Women (Average)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5 sm:px-3 font-semibold text-charcoal">Size 16</td>
                      <td className="py-2 px-2.5 sm:px-3">US 7.5</td>
                      <td className="py-2 px-2.5 sm:px-3 font-medium">17.7 mm <span className="text-charcoal-muted font-normal">(1.77 cm)</span></td>
                      <td className="py-2 px-2.5 sm:px-3">55.6 mm <span className="text-charcoal-muted">(~5.6 cm)</span></td>
                      <td className="py-2 px-2.5 sm:px-3 text-charcoal-muted">Medium / Middle Finger</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5 sm:px-3 font-semibold text-charcoal">Size 18</td>
                      <td className="py-2 px-2.5 sm:px-3">US 8.5</td>
                      <td className="py-2 px-2.5 sm:px-3 font-medium">18.5 mm <span className="text-charcoal-muted font-normal">(1.85 cm)</span></td>
                      <td className="py-2 px-2.5 sm:px-3">58.1 mm <span className="text-charcoal-muted">(~5.8 cm)</span></td>
                      <td className="py-2 px-2.5 sm:px-3 text-charcoal-muted">Large / Men Small</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5 sm:px-3 font-semibold text-charcoal">Size 20</td>
                      <td className="py-2 px-2.5 sm:px-3">US 9.5</td>
                      <td className="py-2 px-2.5 sm:px-3 font-medium">19.4 mm <span className="text-charcoal-muted font-normal">(1.94 cm)</span></td>
                      <td className="py-2 px-2.5 sm:px-3">60.9 mm <span className="text-charcoal-muted">(~6.1 cm)</span></td>
                      <td className="py-2 px-2.5 sm:px-3 text-charcoal-muted">Men Standard</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5 sm:px-3 font-semibold text-charcoal">Size 22</td>
                      <td className="py-2 px-2.5 sm:px-3">US 10.0</td>
                      <td className="py-2 px-2.5 sm:px-3 font-medium">19.8 mm <span className="text-charcoal-muted font-normal">(1.98 cm)</span></td>
                      <td className="py-2 px-2.5 sm:px-3">62.2 mm <span className="text-charcoal-muted">(~6.2 cm)</span></td>
                      <td className="py-2 px-2.5 sm:px-3 text-charcoal-muted">Men Large</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-4 border border-beige rounded-sm space-y-2">
              <h5 className="text-xs uppercase tracking-wider font-semibold text-charcoal flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-champagne" />
                How to Measure Your Ring Size in CM or MM at Home
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-charcoal-muted leading-relaxed">
                <div className="bg-[#FAF8F5] p-2.5 rounded-xs border border-beige/60 space-y-1">
                  <span className="font-semibold text-charcoal block text-[11px] uppercase tracking-wider">
                    Method 1: Measure an Existing Ring (Inner Diameter)
                  </span>
                  <p>
                    Lay a well-fitting ring flat on a ruler. Count the millimeter lines across the widest inside opening. Example from photo: <strong>16.5 mm (1.65 cm) = Indian Size 12</strong>.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-2.5 rounded-xs border border-beige/60 space-y-1">
                  <span className="font-semibold text-charcoal block text-[11px] uppercase tracking-wider">
                    Method 2: Paper Strip (Finger Circumference)
                  </span>
                  <p>
                    Wrap a paper strip snugly around your finger knuckle. Mark where ends overlap and measure with a ruler in cm or mm. Example: <strong>5.3 cm – 5.4 cm (53 mm – 54 mm) = Indian Size 14</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Bangles & Bracelets */}
        {activeTab === 'bangles' && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            {renderVisualDemoCard(
              '/images/size-guides/bangle-size-guide.jpg',
              'Bangle and Bracelet Sizing Demonstration',
              'Hand Anatomy & Bangle Sizing Demonstration',
              'Bangle Size Demo'
            )}

            {/* Understanding CM vs MM for Bangles */}
            <div className="bg-[#FAF7F2] p-3 sm:p-3.5 border border-beige rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2 text-charcoal">
                <Ruler className="w-4 h-4 text-champagne shrink-0" />
                <div>
                  <span className="font-semibold text-charcoal">How to Read CM & MM: </span>
                  <span className="text-charcoal-muted">
                    <strong>1 cm = 10 mm</strong> (divide mm by 10 to get cm on your tape).
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-champagne-dark bg-white px-2.5 py-1 rounded-xs border border-beige/70 shrink-0">
                <span>54 mm = 5.4 cm</span>
                <span className="text-charcoal-muted font-normal">•</span>
                <span>57 mm = 5.7 cm</span>
                <span className="text-charcoal-muted font-normal">•</span>
                <span>60 mm = 6.0 cm</span>
                <span className="text-charcoal-muted font-normal">•</span>
                <span>64 mm = 6.4 cm</span>
              </div>
            </div>

            <div className="bg-beige/25 p-3 sm:p-4 rounded-sm border border-beige space-y-1">
              <h4 className="font-serif text-sm sm:text-base text-charcoal font-medium flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-champagne" />
                Standard Indian Bangle Sizing Chart
              </h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Traditional Indian sizes (2.2 to 2.8) represent the inner diameter in inches (e.g. 2-4 means 2 and 4/16 inches = 2.25 inches).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <div className="p-3 sm:p-3.5 bg-white border border-beige rounded-sm hover:border-champagne/60 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-serif text-xs sm:text-sm font-semibold text-charcoal">Size 2.2 (2-2)</span>
                  <span className="text-[10px] uppercase font-bold text-charcoal-muted bg-beige/40 px-2 py-0.5 rounded-xs">Extra Small</span>
                </div>
                <p className="text-xs text-charcoal font-medium">Inner Diameter: 5.4 cm (54 mm / 2.125 in)</p>
                <p className="text-[11px] text-charcoal-muted mt-0.5">Hand circumference up to 17.0 cm (170 mm / 6.7 in)</p>
              </div>

              <div className="p-3 sm:p-3.5 bg-white border border-beige rounded-sm hover:border-champagne/60 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-serif text-xs sm:text-sm font-semibold text-charcoal">Size 2.4 (2-4)</span>
                  <span className="text-[10px] uppercase font-bold text-charcoal-muted bg-beige/40 px-2 py-0.5 rounded-xs">Small</span>
                </div>
                <p className="text-xs text-charcoal font-medium">Inner Diameter: 5.7 cm (57 mm / 2.25 in)</p>
                <p className="text-[11px] text-charcoal-muted mt-0.5">Hand circumference up to 18.0 cm (180 mm / 7.1 in)</p>
              </div>

              <div className="p-3 sm:p-3.5 bg-white border-2 border-champagne/80 rounded-sm shadow-xs bg-gradient-to-br from-champagne/5 to-white">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-serif text-xs sm:text-sm font-semibold text-charcoal">Size 2.6 (2-6)</span>
                  <span className="text-[10px] uppercase font-bold text-champagne-dark bg-champagne/20 px-2 py-0.5 rounded-xs">Most Popular</span>
                </div>
                <p className="text-xs text-charcoal font-medium">Inner Diameter: 6.0 cm (60 mm / 2.375 in)</p>
                <p className="text-[11px] text-charcoal-muted mt-0.5 font-medium text-champagne-dark">Hand circumference up to 19.0 cm (190 mm / 7.5 in) — Average Indian Women</p>
              </div>

              <div className="p-3 sm:p-3.5 bg-white border border-beige rounded-sm hover:border-champagne/60 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-serif text-xs sm:text-sm font-semibold text-charcoal">Size 2.8 (2-8)</span>
                  <span className="text-[10px] uppercase font-bold text-charcoal-muted bg-beige/40 px-2 py-0.5 rounded-xs">Large</span>
                </div>
                <p className="text-xs text-charcoal font-medium">Inner Diameter: 6.4 cm (64 mm / 2.50 in)</p>
                <p className="text-[11px] text-charcoal-muted mt-0.5">Hand circumference up to 20.0 cm (200 mm / 7.8 in)</p>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-4 border border-beige rounded-sm space-y-2">
              <h5 className="text-xs uppercase tracking-wider font-semibold text-charcoal flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-champagne" />
                How to Measure Your Hand for Bangles
              </h5>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Bring your thumb and little finger tightly together as shown in the diagram above. Wrap a standard measuring tape or string around the widest part of your hand (across your knuckles). The measurement in centimeters or inches gives your exact bangle size!
              </p>
              <div className="text-[11px] text-charcoal-muted bg-[#FAF8F5] p-2 rounded-xs border border-beige/60">
                💡 <strong>Real-Life Visual Tip:</strong> Size 2.6 (6.0 cm / 60 mm) is about the top diameter of a standard teacup. Size 2.2 (5.4 cm / 54 mm) is the exact short-side width of a standard ATM or credit card.
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Earrings */}
        {activeTab === 'earrings' && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            {renderVisualDemoCard(
              '/images/size-guides/earring-size-guide.jpg',
              'Earring Size and Style Demonstration',
              'Earring Scale & Length Demonstration',
              'Earring Scale Demo'
            )}

            {/* Understanding CM vs MM on a standard ruler */}
            <div className="bg-[#FAF7F2] p-3 sm:p-3.5 border border-beige rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2 text-charcoal">
                <Ruler className="w-4 h-4 text-champagne shrink-0" />
                <div>
                  <span className="font-semibold text-charcoal">How to Read CM & MM: </span>
                  <span className="text-charcoal-muted">
                    <strong>1 cm = 10 mm</strong> on a ruler (divide mm by 10 to get cm).
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-champagne-dark bg-white px-2.5 py-1 rounded-xs border border-beige/70 shrink-0">
                <span>8 mm = 0.8 cm</span>
                <span className="text-charcoal-muted font-normal">•</span>
                <span>35 mm = 3.5 cm</span>
                <span className="text-charcoal-muted font-normal">•</span>
                <span>65 mm = 6.5 cm</span>
              </div>
            </div>

            <div className="bg-beige/25 p-3 sm:p-4 rounded-sm border border-beige space-y-1">
              <h4 className="font-serif text-sm sm:text-base text-charcoal font-medium flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-champagne" />
                Earring Styles, Length & Weight Guide
              </h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Every Velessa earring is engineered with skin-safe hypoallergenic copper-brass alloys and balanced weight distribution for all-day comfort.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {/* Card 1: Studs */}
              <div className="p-3 sm:p-3.5 bg-white border border-beige rounded-sm text-center space-y-2 hover:border-champagne/60 transition-colors">
                <span className="font-serif text-xs sm:text-sm font-semibold text-charcoal block">
                  Studs & Tops
                </span>
                <div className="space-y-1">
                  <span className="text-xs sm:text-sm text-champagne-dark font-bold block">
                    0.5 cm – 1.2 cm <span className="text-xs font-normal text-charcoal-muted">(5 mm – 12 mm)</span>
                  </span>
                  <span className="inline-block text-[10px] uppercase font-semibold tracking-wider text-charcoal-muted bg-beige/40 px-2 py-0.5 rounded-xs">
                    Demo in image: 8 mm (0.8 cm)
                  </span>
                </div>
                <p className="text-[11px] text-charcoal-muted leading-relaxed">
                  Featherlight (2–4g). Sits directly on the lobe. Perfect for daily wear, office, and second piercings.
                </p>
              </div>

              {/* Card 2: Drops */}
              <div className="p-3 sm:p-3.5 bg-white border-2 border-champagne/80 rounded-sm text-center space-y-2 shadow-xs bg-gradient-to-br from-champagne/5 to-white">
                <span className="font-serif text-xs sm:text-sm font-semibold text-charcoal block">
                  Drops & Danglers
                </span>
                <div className="space-y-1">
                  <span className="text-xs sm:text-sm text-champagne-dark font-bold block">
                    2.5 cm – 4.5 cm <span className="text-xs font-normal text-charcoal-muted">(25 mm – 45 mm)</span>
                  </span>
                  <span className="inline-block text-[10px] uppercase font-bold tracking-wider text-champagne-dark bg-champagne/20 px-2 py-0.5 rounded-xs">
                    Demo in image: 35 mm (3.5 cm)
                  </span>
                </div>
                <p className="text-[11px] text-charcoal-muted leading-relaxed">
                  Lightweight (6–9g). Hangs gently below the earlobe with elegant movement for cocktails and parties.
                </p>
              </div>

              {/* Card 3: Jhumkas */}
              <div className="p-3 sm:p-3.5 bg-white border border-beige rounded-sm text-center space-y-2 hover:border-champagne/60 transition-colors">
                <span className="font-serif text-xs sm:text-sm font-semibold text-charcoal block">
                  Jhumkas & Chandbalis
                </span>
                <div className="space-y-1">
                  <span className="text-xs sm:text-sm text-champagne-dark font-bold block">
                    5.0 cm – 7.5 cm <span className="text-xs font-normal text-charcoal-muted">(50 mm – 75 mm)</span>
                  </span>
                  <span className="inline-block text-[10px] uppercase font-semibold tracking-wider text-charcoal-muted bg-beige/40 px-2 py-0.5 rounded-xs">
                    Demo in image: 65 mm (6.5 cm)
                  </span>
                </div>
                <p className="text-[11px] text-charcoal-muted leading-relaxed">
                  Comfort-weighted (12–18g). Falls near the jawline. Traditional royal grandeur with secure push backs.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Assistance Banner */}
        <div className="pt-2 border-t border-beige flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-charcoal-muted">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <HelpCircle className="w-4 h-4 text-champagne shrink-0" />
            <span className="text-[11px] sm:text-xs">Unsure about your size? We offer free size exchanges on all orders.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-charcoal text-ivory rounded-xs hover:bg-champagne hover:text-charcoal transition-colors uppercase tracking-wider text-[11px] font-medium cursor-pointer shadow-xs"
          >
            Got It
          </button>
        </div>
      </Modal>

      {/* Fullscreen High-Resolution Lightbox for Mobile and Desktop Zoom */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-[70] bg-charcoal/95 backdrop-blur-md flex flex-col items-center justify-center p-2.5 sm:p-6 animate-fade-in"
          onClick={() => setFullscreenImage(null)}
        >
          <div
            className="w-full max-w-5xl flex items-center justify-between text-ivory mb-2 sm:mb-3 px-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <Sparkles className="w-4 h-4 text-champagne shrink-0" />
              <span className="font-serif text-xs sm:text-base font-medium text-ivory truncate">
                {fullscreenImage.title}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setFullscreenImage(null)}
              className="p-1.5 sm:p-2 rounded-full bg-white/15 hover:bg-champagne hover:text-charcoal text-white transition-colors cursor-pointer shrink-0"
              aria-label="Close fullscreen preview"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <div
            className="w-full max-w-5xl max-h-[82vh] overflow-auto rounded-sm border border-champagne/40 bg-charcoal/90 shadow-2xl p-1 sm:p-2 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={fullscreenImage.src}
              alt={fullscreenImage.alt}
              className="w-full h-auto max-h-[78vh] object-contain mx-auto rounded-xs select-none"
            />
          </div>

          <p className="text-[10px] sm:text-[11px] text-ivory/70 mt-2 tracking-wider uppercase text-center">
            Tap outside or close to exit
          </p>
        </div>
      )}
    </>
  );
};
