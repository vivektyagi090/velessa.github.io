import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, Tag, Sparkles, QrCode, Barcode, Check } from 'lucide-react';
import { Product } from '../../types/product';
import { formatPrice } from '../../utils/formatters';
import { Button } from '../common/Button';

interface JewelleryTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const JewelleryTagModal: React.FC<JewelleryTagModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const [printCount, setPrintCount] = useState<number>(product?.stockQuantity || 4);

  useEffect(() => {
    if (product) {
      setPrintCount(Math.min(product.stockQuantity || 4, 12));
    }
  }, [product]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('has-tag-portal');
      return () => {
        document.body.classList.remove('has-tag-portal');
      };
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handlePrint = () => {
    window.print();
  };

  const grossWt = product.grossWeightGrams || 18.5;
  const netWt = product.netWeightGrams || (grossWt * 0.88).toFixed(1);
  const sku = product.sku || `VLSA-${product.id}`;

  return createPortal(
    <div className="tag-modal-portal fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-charcoal/70 backdrop-blur-xs animate-fade-in font-sans print:p-0 print:m-0 print:bg-white print:static print:block print:overflow-visible">
      <div className="fixed inset-0 print:hidden" onClick={onClose} aria-hidden="true" />

      <div className="tag-modal-card relative w-full max-w-2xl bg-white border border-beige shadow-2xl rounded-sm z-10 my-8 overflow-hidden print:m-0 print:border-none print:shadow-none print:max-w-none print:w-full print:static">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-charcoal text-ivory border-b border-champagne/30 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-champagne text-charcoal flex items-center justify-center font-bold">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg tracking-wide text-ivory">
                Jewellery Price &amp; Barcode Tag Print
              </h2>
              <p className="text-[11px] text-ivory/70">
                Atelier Butterfly &amp; Dumbbell Label Generator (50mm × 25mm)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-champagne hover:bg-champagne/90 text-charcoal text-xs font-semibold rounded-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print {printCount} Tags</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-ivory/70 hover:text-ivory transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Controls (Hidden on Print) */}
        <div className="p-5 bg-beige/20 border-b border-beige flex flex-wrap items-center justify-between gap-4 print:hidden text-xs text-charcoal">
          <div className="flex items-center gap-3">
            <span className="font-medium text-charcoal-muted">Number of Tags to Print:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 4, 8, 12].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPrintCount(num)}
                  className={`px-2.5 py-1 rounded-xs border text-xs font-mono font-medium transition-colors cursor-pointer ${
                    printCount === num
                      ? 'bg-charcoal text-ivory border-charcoal'
                      : 'bg-white hover:bg-beige/40 border-beige text-charcoal'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-charcoal-muted">
            Format: <strong>50mm × 25mm Standard Thermal Label Sheet</strong>
          </div>
        </div>

        {/* Printable Tags Canvas */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto bg-beige/5">
          <div className="text-[11px] uppercase tracking-widest text-champagne font-bold flex items-center gap-1.5 print:hidden">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real-Time Label Sticker Sheet Preview</span>
          </div>

          {/* Grid of Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3">
            {Array.from({ length: printCount }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-charcoal/30 rounded-xs p-3 font-sans text-charcoal shadow-xs flex flex-col justify-between h-[130px] select-none hover:border-champagne transition-colors"
                style={{ pageBreakInside: 'avoid' }}
              >
                {/* Tag Top: Brand & Category */}
                <div className="flex justify-between items-start border-b border-charcoal/20 pb-1">
                  <div>
                    <span className="font-serif text-sm tracking-[0.2em] font-bold text-charcoal block leading-none">
                      VELESSA
                    </span>
                    <span className="text-[7.5px] uppercase tracking-widest text-champagne font-bold block mt-0.5">
                      1G GOLD FORMING
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-mono uppercase bg-beige/40 px-1 py-0.5 rounded-2xs">
                      HSN: 7117
                    </span>
                  </div>
                </div>

                {/* Tag Middle: Product & Weights */}
                <div className="py-1">
                  <div className="font-serif text-[11px] font-medium text-charcoal truncate">
                    {product.name}
                  </div>
                  <div className="flex justify-between items-center text-[8.5px] font-mono text-charcoal-muted mt-0.5">
                    <span>GW: <strong>{grossWt}g</strong></span>
                    <span>NW: <strong>{netWt}g</strong></span>
                    <span className="text-emerald-800 font-semibold">100% HALLMARK</span>
                  </div>
                </div>

                {/* Tag Bottom: Barcode Line & Price */}
                <div className="border-t border-charcoal/20 pt-1 flex items-center justify-between">
                  {/* Simulated Code-128 Barcode lines */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-0.5 h-4">
                      <div className="w-[1.5px] h-full bg-charcoal" />
                      <div className="w-[2.5px] h-full bg-charcoal" />
                      <div className="w-[1px] h-full bg-charcoal" />
                      <div className="w-[2px] h-full bg-charcoal" />
                      <div className="w-[1px] h-full bg-charcoal" />
                      <div className="w-[3px] h-full bg-charcoal" />
                      <div className="w-[1.5px] h-full bg-charcoal" />
                      <div className="w-[2px] h-full bg-charcoal" />
                      <div className="w-[1px] h-full bg-charcoal" />
                      <div className="w-[2.5px] h-full bg-charcoal" />
                      <div className="w-[1.5px] h-full bg-charcoal" />
                      <div className="w-[2px] h-full bg-charcoal" />
                      <div className="w-[1px] h-full bg-charcoal" />
                      <div className="w-[2px] h-full bg-charcoal" />
                    </div>
                    <div className="font-mono text-[8px] tracking-wider text-charcoal font-bold">
                      {sku}
                    </div>
                  </div>

                  {/* MRP */}
                  <div className="text-right">
                    <span className="text-[7.5px] uppercase text-charcoal-muted block leading-none">MRP (Incl Taxes)</span>
                    <span className="font-serif text-sm font-bold text-charcoal block leading-tight">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer (Hidden on Print) */}
        <div className="p-4 bg-beige/20 border-t border-beige flex items-center justify-end gap-3 print:hidden">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="w-3.5 h-3.5 text-champagne" />
            <span>Print Label Stickers</span>
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
