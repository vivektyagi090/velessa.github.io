import React, { useState } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const activeImage = images[selectedIndex] || images[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 sm:gap-6">
      {/* Thumbnails Row / Column */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[540px] shrink-0 no-scrollbar py-1">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`relative w-16 h-20 sm:w-20 sm:h-24 bg-beige/20 rounded-sm overflow-hidden border transition-all duration-200 shrink-0 ${
              selectedIndex === idx
                ? 'border-champagne ring-1 ring-champagne'
                : 'border-beige hover:border-charcoal/40'
            }`}
            aria-label={`Select product image ${idx + 1}`}
          >
            <img
              src={img}
              alt={`${productName} thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Main Image Showcase with Zoom Hover */}
      <div className="relative flex-1 aspect-[4/5] bg-beige/10 rounded-sm overflow-hidden border border-beige group">
        <div
          className="w-full h-full cursor-crosshair overflow-hidden relative"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setIsLightboxOpen(true)}
        >
          <img
            src={activeImage}
            alt={productName}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            style={
              isZoomed
                ? {
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  }
                : undefined
            }
          />
        </div>

        {/* Expand Fullscreen Button */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-beige flex items-center justify-center text-charcoal hover:text-champagne transition-all shadow-sm opacity-90 group-hover:opacity-100"
          aria-label="View fullscreen image"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Navigation Arrows for Mobile/Tablet */}
        {images.length > 1 && (
          <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none sm:hidden">
            <button
              onClick={handlePrev}
              className="pointer-events-auto w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-charcoal shadow-sm"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="pointer-events-auto w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-charcoal shadow-sm"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="absolute bottom-3 left-4 pointer-events-none hidden sm:block">
          <span className="text-[10px] uppercase tracking-wider text-charcoal/70 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-sm border border-beige/60 font-sans">
            Hover to magnify • Click to expand
          </span>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in">
          {/* Close button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-champagne transition-colors p-2 z-20"
            aria-label="Close fullscreen view"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Lightbox Main Image */}
          <div className="relative max-w-5xl max-h-[85vh] flex items-center justify-center">
            <img
              src={activeImage}
              alt={productName}
              className="max-w-full max-h-[85vh] object-contain rounded-sm"
            />
          </div>

          {/* Prev/Next arrows in Lightbox */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-champagne transition-colors p-3"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-champagne transition-colors p-3"
                aria-label="Next image"
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            </>
          )}

          {/* Counter at bottom */}
          <div className="absolute bottom-6 text-xs text-white/60 font-sans tracking-widest uppercase">
            {selectedIndex + 1} / {images.length} • {productName}
          </div>
        </div>
      )}
    </div>
  );
};
