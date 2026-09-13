import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, Truck, Sparkles, MapPin, Phone, ShieldAlert, Barcode } from 'lucide-react';
import { Order } from '../../types/order';
import { formatPrice } from '../../utils/formatters';
import { Button } from '../common/Button';

interface ShippingLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const ShippingLabelModal: React.FC<ShippingLabelModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('has-label-portal');
      return () => {
        document.body.classList.remove('has-label-portal');
      };
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const orderNumClean = order.orderNumber.replace(/[^0-9]/g, '') || '343736';
  const awbNumber = order.trackingNumber || `BD-${orderNumClean}99IN`;

  return createPortal(
    <div className="label-modal-portal fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-charcoal/70 backdrop-blur-xs animate-fade-in font-sans print:p-0 print:m-0 print:bg-white print:static print:block print:overflow-visible">
      <div className="fixed inset-0 print:hidden" onClick={onClose} aria-hidden="true" />

      <div className="label-modal-card relative w-full max-w-lg bg-white border border-beige shadow-2xl rounded-sm z-10 my-8 overflow-hidden print:m-0 print:border-none print:shadow-none print:max-w-none print:w-full print:static">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-charcoal text-ivory border-b border-champagne/30 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-champagne text-charcoal flex items-center justify-center font-bold">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg tracking-wide text-ivory">
                4×6″ Courier Shipping Label
              </h2>
              <p className="text-[11px] text-ivory/70">
                BlueDart Express Air Priority • Doorstep Handover AWB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-champagne hover:bg-champagne/90 text-charcoal text-xs font-semibold rounded-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print 4×6″ Label</span>
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

        {/* Printable 4x6 Shipping Label Canvas */}
        <div className="p-6 text-xs text-charcoal space-y-4 bg-white max-h-[75vh] overflow-y-auto print:max-h-none print:p-2">
          {/* Label Card (Standard 4x6 inch aspect) */}
          <div className="border-4 border-black p-4 font-sans text-charcoal space-y-3 bg-white">
            {/* Courier Banner & AWB */}
            <div className="flex justify-between items-center border-b-2 border-black pb-2">
              <div>
                <span className="font-sans font-black text-xl tracking-tight text-black block leading-none">
                  BLUEDART
                </span>
                <span className="text-[9px] font-mono tracking-widest font-bold text-black uppercase block mt-0.5">
                  AIR EXPRESS GOLD PRIORITY
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-0.5 rounded-2xs">
                  DOMESTIC AIR
                </span>
                <div className="font-mono text-xs font-bold mt-1">HUB: BOM-MAH</div>
              </div>
            </div>

            {/* Barcode Strip */}
            <div className="text-center py-2 border-b-2 border-black space-y-1">
              {/* Simulated High-Density Courier Barcode lines */}
              <div className="flex items-center justify-center gap-[2.5px] h-11 w-4/5 mx-auto">
                <div className="w-[3px] h-full bg-black" />
                <div className="w-[1.5px] h-full bg-black" />
                <div className="w-[4px] h-full bg-black" />
                <div className="w-[2px] h-full bg-black" />
                <div className="w-[5px] h-full bg-black" />
                <div className="w-[1px] h-full bg-black" />
                <div className="w-[3.5px] h-full bg-black" />
                <div className="w-[2px] h-full bg-black" />
                <div className="w-[4.5px] h-full bg-black" />
                <div className="w-[1.5px] h-full bg-black" />
                <div className="w-[3px] h-full bg-black" />
                <div className="w-[5px] h-full bg-black" />
                <div className="w-[2px] h-full bg-black" />
                <div className="w-[4px] h-full bg-black" />
                <div className="w-[1px] h-full bg-black" />
                <div className="w-[3px] h-full bg-black" />
                <div className="w-[2.5px] h-full bg-black" />
                <div className="w-[4.5px] h-full bg-black" />
                <div className="w-[1.5px] h-full bg-black" />
                <div className="w-[3px] h-full bg-black" />
              </div>
              <div className="font-mono text-sm font-black tracking-widest text-black">
                AWB: {awbNumber}
              </div>
            </div>

            {/* Destination Deliver To Section */}
            <div className="border-b-2 border-black pb-3 space-y-1">
              <span className="text-[10px] font-black uppercase text-black block tracking-wider">
                DELIVER TO (PATRON):
              </span>
              <div className="font-bold text-base text-black font-sans leading-tight">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </div>
              <div className="text-xs font-medium text-black leading-snug">
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
              </div>
              <div className="text-sm font-black text-black">
                {order.shippingAddress.city}, {order.shippingAddress.state} — PIN: {order.shippingAddress.postalCode}
              </div>
              <div className="font-mono text-xs font-bold text-black pt-1">
                CONTACT: {order.shippingAddress.phone}
              </div>
            </div>

            {/* COD / Payment Badge */}
            <div className="border-2 border-black p-2 bg-black text-white flex justify-between items-center">
              <div>
                <span className="text-[9px] font-mono tracking-wider block">PAYMENT MODE:</span>
                <span className="font-black text-sm tracking-wider uppercase font-sans">
                  CASH ON DELIVERY (COD)
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono block">COLLECT FROM CUSTOMER:</span>
                <span className="font-black text-base font-mono">
                  {formatPrice(order.summary.total)}
                </span>
              </div>
            </div>

            {/* Return / Shipper Address */}
            <div className="border-b-2 border-black pb-2 text-[10px] space-y-0.5">
              <span className="font-black uppercase text-black block">IF UNDELIVERED, RETURN TO:</span>
              <div className="font-bold text-black">VELESSA ATELIER (LOGISTICS DESK)</div>
              <div>104, Zaveri Bazaar, Kalbadevi, Mumbai, Maharashtra 400002</div>
              <div>GSTIN: 27AABCV8910F1Z8 • Support: concierge@velessa.com</div>
            </div>

            {/* Footer Warnings */}
            <div className="flex justify-between items-center text-[9px] font-black pt-1">
              <span className="uppercase">FRAGILE • TAMPER-EVIDENT GOLD SEAL</span>
              <span className="font-mono">ORDER REF: #{order.orderNumber}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer (Hidden on Print) */}
        <div className="p-4 bg-beige/20 border-t border-beige flex items-center justify-end gap-3 print:hidden">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="w-3.5 h-3.5 text-champagne" />
            <span>Print 4×6″ Label</span>
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
