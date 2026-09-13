import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, Package, Sparkles, CheckSquare, ShieldCheck, UserCheck } from 'lucide-react';
import { Order } from '../../types/order';
import { Button } from '../common/Button';

interface PackingSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const PackingSlipModal: React.FC<PackingSlipModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('has-slip-portal');
      return () => {
        document.body.classList.remove('has-slip-portal');
      };
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return createPortal(
    <div className="slip-modal-portal fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-charcoal/70 backdrop-blur-xs animate-fade-in font-sans print:p-0 print:m-0 print:bg-white print:static print:block print:overflow-visible">
      <div className="fixed inset-0 print:hidden" onClick={onClose} aria-hidden="true" />

      <div className="slip-modal-card relative w-full max-w-3xl bg-white border border-beige shadow-2xl rounded-sm z-10 my-8 overflow-hidden print:m-0 print:border-none print:shadow-none print:max-w-none print:w-full print:static">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-charcoal text-ivory border-b border-champagne/30 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-champagne text-charcoal flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg tracking-wide text-ivory">
                Order Packaging Slip &amp; Quality Checklist
              </h2>
              <p className="text-[11px] text-ivory/70">
                Store Pick-List &amp; Pre-Dispatch Verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-champagne hover:bg-champagne/90 text-charcoal text-xs font-semibold rounded-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
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

        {/* Printable Document Body */}
        <div className="p-6 sm:p-10 text-xs text-charcoal space-y-6 bg-white max-h-[75vh] overflow-y-auto print:max-h-none print:overflow-visible">
          {/* Slip Top Header */}
          <div className="flex justify-between items-start border-b-2 border-charcoal/20 pb-4">
            <div>
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.2em] font-light text-charcoal block">
                VELESSA
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-champagne font-bold block">
                LUXURY ATELIER • DISPATCH FULFILLMENT SLIP
              </span>
              <p className="text-[11px] text-charcoal-muted mt-1">
                Store Location: 104, Zaveri Bazaar, Mumbai • Tel: +91 (022) 4890 2800
              </p>
            </div>

            <div className="text-right bg-beige/20 p-3 rounded-sm border border-beige">
              <span className="text-[10px] uppercase tracking-wider font-bold text-charcoal block">
                ORDER #{order.orderNumber}
              </span>
              <div className="text-[11px] text-charcoal-muted mt-0.5">{formattedDate}</div>
              <div className="text-[10px] font-mono text-emerald-800 font-semibold mt-1 uppercase">
                Payment: COD / Verified
              </div>
            </div>
          </div>

          {/* Patron & Destination Box */}
          <div className="grid grid-cols-2 gap-4 p-3.5 bg-beige/10 border border-beige rounded-sm">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted block mb-1">
                Patron Details
              </span>
              <p className="font-serif text-sm font-semibold text-charcoal">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p className="text-charcoal-muted font-mono">{order.shippingAddress.phone}</p>
              <p className="text-charcoal-muted">{order.shippingAddress.email}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted block mb-1">
                Shipping Destination
              </span>
              <p className="font-medium text-charcoal">{order.shippingAddress.addressLine1}</p>
              <p className="text-charcoal-muted">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
              </p>
              <p className="text-emerald-700 font-semibold text-[11px]">
                Courier: BlueDart Express Gold Air Priority
              </p>
            </div>
          </div>

          {/* Pick & Pack Itemized Table */}
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-charcoal block mb-2">
              Items to Pick from Store Shelf:
            </span>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-charcoal/20 text-[10px] uppercase tracking-wider text-charcoal font-semibold bg-beige/20">
                  <th className="py-2 px-3">Location / Bin</th>
                  <th className="py-2 px-3">Jewellery Description</th>
                  <th className="py-2 px-3">SKU / Code</th>
                  <th className="py-2 px-3 text-center">Qty to Pack</th>
                  <th className="py-2 px-3 text-center">Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-beige/10 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-champagne text-xs">
                      SHELF-A0{idx + 1} / BIN-B
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-serif text-sm font-medium text-charcoal">
                        {item.product.name}
                      </div>
                      <div className="text-[10px] text-charcoal-muted">
                        Category: {item.product.category} {item.selectedSize ? `| Size: ${item.selectedSize}` : ''}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-charcoal">
                      {item.product.sku || `VLSA-ITEM-${idx + 1}`}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-sm">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="w-5 h-5 border-2 border-charcoal/40 rounded-2xs mx-auto flex items-center justify-center font-bold text-xs">
                        ✓
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 5-Point Quality Checklist */}
          <div className="p-4 bg-beige/15 border-2 border-dashed border-charcoal/30 rounded-sm space-y-2.5">
            <span className="text-[11px] uppercase tracking-widest font-bold text-charcoal flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-champagne" />
              <span>Mandatory Pre-Dispatch Quality Checklist:</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-charcoal" />
                <span>1-Gram gold forming plating lustre &amp; finish inspected</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-charcoal" />
                <span>Stone prongs tightened &amp; clasp security verified</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-charcoal" />
                <span>Velvet keepsake jewellery box &amp; micro-fiber cloth enclosed</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-charcoal" />
                <span>Authenticity &amp; Hallmark warranty card enclosed</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-charcoal" />
                <span>Tamper-evident holographic security seal affixed to outer carton</span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-6 border-t border-beige flex justify-between items-end">
            <div>
              <div className="text-[10px] text-charcoal-muted uppercase">Packed By (Jewellery Artisan):</div>
              <div className="font-serif text-sm text-charcoal font-medium mt-1">Ramesh Soni (Store Supervisor)</div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-charcoal-muted uppercase">Dispatch Inspection Sign:</div>
              <div className="border-b border-charcoal w-36 mt-4" />
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
            <span>Print Packing Slip</span>
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
