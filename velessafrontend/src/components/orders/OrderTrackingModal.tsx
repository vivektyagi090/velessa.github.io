import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  PhoneCall,
  Calendar
} from 'lucide-react';
import { Order } from '../../types/order';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('has-tracking-portal');
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.classList.remove('has-tracking-portal');
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const orderNumClean = order.orderNumber.replace(/[^0-9]/g, '') || '913842';
  const trackingNumber = order.trackingNumber || `BD-${orderNumClean}88IN`;
  const courierPartner = 'BlueDart Express (Secure Gold Priority)';

  // Calculate estimated delivery: 3 business days from order placement
  const orderDate = new Date(order.createdAt);
  const estDate = new Date(orderDate);
  estDate.setDate(estDate.getDate() + 3);

  const formattedOrderDate = orderDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedEstDelivery = estDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(trackingNumber);
    setCopied(true);
    showToast(`Tracking ID ${trackingNumber} copied to clipboard!`, 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  // Determine stage states
  const stages = [
    {
      id: 1,
      title: 'Order Confirmed',
      subtitle: 'Order recorded & patron details verified',
      date: formattedOrderDate,
      status: 'completed' as const,
      icon: CheckCircle2,
      note: 'Order logged into Velessa SQL database with confirmed inventory allocation.',
    },
    {
      id: 2,
      title: 'Hallmark & Gemology Quality Inspection',
      subtitle: 'Micro-plating thickness & prong security check',
      date: `${orderDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, Quality Passed`,
      status: 'completed' as const,
      icon: ShieldCheck,
      note: 'Certified by Chief Gemologist at Zaveri Bazaar Atelier. 1 Gram gold forming verified.',
    },
    {
      id: 3,
      title: 'Luxury Gift Packaging & Security Seal',
      subtitle: 'Tamper-evident velvet keepsake case',
      date: 'In Progress at Mumbai Atelier',
      status: 'active' as const,
      icon: Package,
      note: 'Enclosed with luxury suede jewellery box, certificate card, and microfiber care cloth.',
    },
    {
      id: 4,
      title: 'Handed to Courier Partner',
      subtitle: `${courierPartner}`,
      date: 'Scheduled for Evening Dispatch',
      status: 'upcoming' as const,
      icon: Truck,
      note: `Air transit from Mumbai Logistics Hub to ${order.shippingAddress.city}.`,
    },
    {
      id: 5,
      title: 'Out for Doorstep Delivery',
      subtitle: `Estimated: ${formattedEstDelivery}`,
      date: 'Doorstep Handover with OTP',
      status: 'upcoming' as const,
      icon: MapPin,
      note: 'Delivery executive will verify mobile OTP before handing over sealed parcel.',
    },
  ];

  return createPortal(
    <div className="tracking-modal-portal fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-charcoal/70 backdrop-blur-xs animate-fade-in print:p-0 print:m-0 print:bg-white print:static print:block print:overflow-visible">
      <div
        className="fixed inset-0 print:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl bg-white border border-beige shadow-2xl rounded-sm z-10 my-8 overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-charcoal text-ivory">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-champagne text-charcoal flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg text-ivory tracking-wide">
                  Shipment Tracking
                </span>
                <span className="px-2 py-0.5 rounded-full bg-champagne/20 text-champagne text-[10px] uppercase font-sans font-bold tracking-wider">
                  Live Status
                </span>
              </div>
              <p className="text-[11px] text-ivory/70 font-sans">
                Order #{order.orderNumber}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-ivory/70 hover:text-ivory transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Courier & AWB Info Banner */}
        <div className="p-5 sm:p-6 bg-beige/20 border-b border-beige space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-3.5 rounded-sm border border-beige space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-charcoal-muted font-sans font-medium">
                Courier Partner
              </span>
              <div className="text-xs font-semibold text-charcoal flex items-center gap-1.5 font-sans">
                <Truck className="w-3.5 h-3.5 text-champagne shrink-0" />
                <span>{courierPartner}</span>
              </div>
              <div className="text-[11px] text-charcoal-muted font-sans">
                Air Express Insured Gold Delivery
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-sm border border-beige space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-charcoal-muted font-sans font-medium">
                Tracking Number (AWB)
              </span>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-xs sm:text-sm text-charcoal">
                  {trackingNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopyTracking}
                  className="flex items-center gap-1 px-2 py-1 bg-beige/30 hover:bg-beige/60 text-charcoal text-[11px] rounded-xs transition-colors cursor-pointer"
                  title="Copy Tracking ID"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-charcoal-muted" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 font-sans">
                <Calendar className="w-3 h-3" />
                <span>Est. Delivery: {formattedEstDelivery}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Stepper Module */}
        <div className="p-5 sm:p-8 space-y-6 max-h-[50vh] overflow-y-auto">
          <h3 className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-charcoal flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-champagne" />
            <span>Fulfillment &amp; Dispatch Milestones</span>
          </h3>

          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3.5 sm:before:left-4.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-beige">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isCompleted = stage.status === 'completed';
              const isActive = stage.status === 'active';

              return (
                <div key={stage.id} className="relative group">
                  {/* Indicator Dot */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                        : isActive
                        ? 'bg-champagne border-charcoal text-charcoal ring-4 ring-champagne/20 animate-pulse'
                        : 'bg-white border-beige text-charcoal-muted'
                    }`}
                  >
                    <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>

                  {/* Stage Content */}
                  <div className="space-y-1 font-sans">
                    <div className="flex flex-wrap items-baseline justify-between gap-1.5">
                      <h4
                        className={`text-xs sm:text-sm font-semibold ${
                          isActive
                            ? 'text-charcoal'
                            : isCompleted
                            ? 'text-charcoal font-medium'
                            : 'text-charcoal-muted'
                        }`}
                      >
                        {stage.title}
                      </h4>
                      <span
                        className={`text-[10px] font-mono ${
                          isActive
                            ? 'text-champagne font-bold uppercase tracking-wider bg-champagne/15 px-2 py-0.5 rounded-full'
                            : isCompleted
                            ? 'text-emerald-700'
                            : 'text-charcoal-muted'
                        }`}
                      >
                        {stage.date}
                      </span>
                    </div>

                    <p className="text-xs text-charcoal-muted">{stage.subtitle}</p>

                    <div className="p-2.5 bg-beige/10 rounded-xs border border-beige/60 text-[11px] text-charcoal leading-relaxed mt-1">
                      {stage.note}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shipping Destination Summary */}
        <div className="px-6 py-4 bg-beige/10 border-t border-beige font-sans text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="text-[10px] uppercase text-charcoal-muted font-semibold tracking-wider block">
              Delivery Destination
            </span>
            <p className="font-medium text-charcoal">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName} — {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`tel:+912248902800`}
              className="flex items-center gap-1.5 text-xs text-champagne hover:underline font-medium"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Concierge Helpline</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-beige/20 border-t border-beige flex items-center justify-end">
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
