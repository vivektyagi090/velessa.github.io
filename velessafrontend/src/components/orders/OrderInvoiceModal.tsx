import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, Sparkles, ShieldCheck, CheckCircle2, Download } from 'lucide-react';
import { Order } from '../../types/order';
import { formatPrice } from '../../utils/formatters';
import { Button } from '../common/Button';

interface OrderInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('has-invoice-portal');
      return () => {
        document.body.classList.remove('has-invoice-portal');
      };
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    document.body.classList.add('has-invoice-portal');
    window.print();
  };

  const invoiceNumber = `INV-${order.orderNumber.replace(/[^0-9]/g, '') || '84920'}`;
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Calculate GST breakdown (3% jewellery standard: 1.5% CGST + 1.5% SGST)
  const totalAmount = order.summary.total;
  const taxableSubtotal = Math.round((totalAmount / 1.03) * 100) / 100;
  const gstAmount = Math.round((totalAmount - taxableSubtotal) * 100) / 100;
  const halfGst = Math.round((gstAmount / 2) * 100) / 100;

  return createPortal(
    <div className="invoice-modal-portal fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-charcoal/70 backdrop-blur-xs print:p-0 print:m-0 print:bg-white print:static print:block print:overflow-visible">
      <div
        className="fixed inset-0 print:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="invoice-paper-card relative w-full max-w-3xl bg-white border border-beige shadow-2xl rounded-sm z-10 my-8 overflow-hidden animate-fade-in print:m-0 print:border-none print:shadow-none print:max-w-none print:w-full print:static">
        {/* Modal Action Header (Hidden on Print) */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 bg-beige/20 border-b border-beige print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-sans uppercase tracking-widest text-champagne font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Tax Invoice &amp; Cash Bill
            </span>
            <span className="text-xs text-charcoal-muted">•</span>
            <span className="text-xs font-mono font-bold text-charcoal">{order.orderNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-charcoal hover:bg-black text-ivory text-xs font-sans rounded-xs transition-colors cursor-pointer"
              title="Print Tax Invoice"
            >
              <Printer className="w-3.5 h-3.5 text-champagne" />
              <span>Print Bill</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-charcoal-muted hover:text-charcoal transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document Body */}
        <div ref={printRef} className="p-6 sm:p-10 font-sans text-xs text-charcoal space-y-6 bg-white">
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b-2 border-charcoal/20 gap-4">
            <div>
              <span className="font-serif text-3xl sm:text-4xl tracking-[0.24em] font-light text-charcoal block">
                VELESSA
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-champagne font-sans font-semibold block mt-0.5">
                1 Gram Gold &amp; Premium Imitation Jewellery
              </span>
              <p className="text-[11px] text-charcoal-muted mt-2 leading-relaxed">
                Registered Atelier: 104, Zaveri Bazaar, Kalbadevi, Mumbai, MH 400002<br />
                GSTIN: <strong>27AABCV8910F1Z8</strong> | PAN: AABCV8910F | BIS Lic: HM-98721
              </p>
            </div>

            <div className="text-left sm:text-right bg-beige/20 p-3.5 rounded-sm border border-beige shrink-0">
              <span className="text-[10px] uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                TAX INVOICE
              </span>
              <div className="font-mono font-bold text-sm text-charcoal mt-1.5">{invoiceNumber}</div>
              <div className="text-[11px] text-charcoal-muted mt-0.5">Date: {formattedDate}</div>
              <div className="text-[11px] text-charcoal-muted">Place of Supply: {order.shippingAddress.state}, India</div>
            </div>
          </div>

          {/* Billing & Shipping Two-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-beige">
            <div className="p-3.5 bg-beige/10 rounded-sm border border-beige/60 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted block mb-1">
                Billed To (Patron)
              </span>
              <p className="font-serif text-sm font-semibold text-charcoal">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p className="text-charcoal-muted">{order.shippingAddress.phone}</p>
              <p className="text-charcoal-muted">{order.shippingAddress.email}</p>
            </div>

            <div className="p-3.5 bg-beige/10 rounded-sm border border-beige/60 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted block mb-1">
                Shipping Destination
              </span>
              <p className="font-medium text-charcoal">
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
              </p>
              <p className="text-charcoal-muted">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
              </p>
              <p className="text-charcoal-muted">
                Delivery: Standard Insured Express
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-charcoal/20 text-[10px] uppercase tracking-wider text-charcoal font-semibold bg-beige/20">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3">HSN Code</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige/70">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-beige/10 transition-colors">
                    <td className="py-3 px-3 text-charcoal-muted font-mono">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="font-serif text-xs font-medium text-charcoal">
                        {item.product.name}
                      </div>
                      <div className="text-[10px] text-charcoal-muted">
                        Category: {item.product.category} {item.selectedSize ? `| Size: ${item.selectedSize}` : ''}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-charcoal-muted font-mono text-[11px]">7117 90 90</td>
                    <td className="py-3 px-3 text-center font-medium">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-mono">{formatPrice(item.product.price)}</td>
                    <td className="py-3 px-3 text-right font-mono font-semibold">
                      {formatPrice(item.product.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary & Tax Calculation Box */}
          <div className="flex flex-col sm:flex-row justify-between items-start pt-4 border-t-2 border-charcoal/20 gap-6">
            <div className="sm:max-w-xs space-y-2 text-[11px] text-charcoal-muted">
              <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Certified 1 Gram Micro-Forming Gold</span>
              </div>
              <p className="leading-relaxed">
                Thank you for patronizing Velessa Atelier. All jewellery creations are sealed with protective micro-coating and carry our hallmark of excellence.
              </p>
              <div className="p-2 bg-emerald-50/80 border border-emerald-200/80 rounded-xs text-[10px] text-emerald-900 font-mono">
                Payment: <strong>Cash on Delivery (COD) / Verified</strong>
              </div>
            </div>

            <div className="w-full sm:w-72 bg-beige/20 p-4 rounded-sm border border-beige space-y-2 font-mono text-xs">
              <div className="flex justify-between text-charcoal-muted">
                <span>Taxable Amount:</span>
                <span>{formatPrice(taxableSubtotal)}</span>
              </div>
              <div className="flex justify-between text-charcoal-muted">
                <span>CGST (1.5%):</span>
                <span>{formatPrice(halfGst)}</span>
              </div>
              <div className="flex justify-between text-charcoal-muted">
                <span>SGST (1.5%):</span>
                <span>{formatPrice(halfGst)}</span>
              </div>
              <div className="flex justify-between text-charcoal-muted">
                <span>Insured Shipping:</span>
                <span className="text-emerald-700 font-sans font-medium uppercase text-[10px]">
                  {order.summary.shipping === 0 ? 'Complimentary' : formatPrice(order.summary.shipping)}
                </span>
              </div>
              <div className="pt-2 border-t-2 border-charcoal/30 flex justify-between items-baseline font-bold text-sm text-charcoal">
                <span className="font-sans uppercase tracking-wider text-xs">Grand Total:</span>
                <span className="font-serif text-base text-charcoal">{formatPrice(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Legal Sign-off / Digital Stamp */}
          <div className="pt-6 border-t border-beige flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <div className="text-[10px] text-charcoal-muted space-y-0.5">
              <p>Computer-generated legal tax invoice. No signature required under Section 31 of CGST Act, 2017.</p>
              <p>For exchange, certification, or warranty queries, contact <strong>concierge@velessa.com</strong>.</p>
            </div>

            <div className="border border-champagne/40 bg-champagne/10 px-3 py-1.5 rounded-sm text-center">
              <div className="text-[9px] uppercase tracking-widest text-champagne font-bold">
                VELESSA ATELIER VERIFIED
              </div>
              <div className="text-[10px] font-serif text-charcoal font-medium">
                Official Digital Seal
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls (Hidden on Print) */}
        <div className="p-4 bg-beige/20 border-t border-beige flex items-center justify-end gap-3 print:hidden">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="w-3.5 h-3.5 text-champagne" />
            <span>Print Invoice</span>
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
