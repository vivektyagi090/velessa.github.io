import React from 'react';
import {
  X,
  UserCheck,
  ShieldCheck,
  Building,
  MapPin,
  Mail,
  Phone,
  Clock,
  Key,
  Lock,
  LogOut,
  Sparkles,
  FileText,
  BadgeCheck,
  Store,
  Calendar,
  Laptop
} from 'lucide-react';
import { ShopkeeperSession } from '../../pages/Shopkeeper/ShopkeeperPortal';

interface ShopkeeperProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: ShopkeeperSession | null;
  onLogout: () => void;
}

export const ShopkeeperProfileModal: React.FC<ShopkeeperProfileModalProps> = ({
  isOpen,
  onClose,
  session,
  onLogout,
}) => {
  if (!isOpen || !session) return null;

  // Extract initials
  const initials = session.name
    ? session.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : 'SK';

  const formattedDate = session.authenticatedAt
    ? new Date(session.authenticatedAt).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleString('en-IN');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-charcoal text-ivory border border-champagne/40 rounded-xs shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-up relative">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-stone-900 via-charcoal to-stone-900 border-b border-champagne/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-champagne/20 border border-champagne/40 flex items-center justify-center text-champagne">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-champagne font-mono font-semibold">
                Velessa Jewellery Store Profile
              </div>
              <h3 className="font-serif text-lg text-ivory font-normal">
                Shopkeeper &amp; Staff Details
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-ivory/60 hover:text-ivory hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
            aria-label="Close Profile"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Profile Hero Card */}
          <div className="p-5 rounded-xs bg-gradient-to-br from-black/60 to-stone-900/60 border border-champagne/30 flex flex-col sm:flex-row items-center sm:items-start gap-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-champagne/5 rounded-full blur-2xl pointer-events-none" />
            
            {/* Staff Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-700 via-champagne to-amber-200 p-0.5 shadow-luxury">
                <div className="w-full h-full rounded-full bg-charcoal flex items-center justify-center text-champagne font-serif text-2xl font-bold">
                  {initials}
                </div>
              </div>
              <div
                className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-charcoal flex items-center justify-center"
                title="Active Session"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            {/* Identity Text */}
            <div className="flex-1 text-center sm:text-left space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="font-serif text-2xl text-ivory font-medium tracking-wide">
                  {session.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-champagne/20 border border-champagne/40 text-champagne text-[11px] font-semibold tracking-wider uppercase">
                  {session.role || 'Shopkeeper'}
                </span>
              </div>

              <div className="text-xs text-ivory/70 flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1">
                <span className="flex items-center gap-1 font-mono text-champagne/90">
                  <BadgeCheck className="w-3.5 h-3.5 text-champagne" />
                  <span>ID: {session.staffId || 'STF-2026-0042'}</span>
                </span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>
                    {session.clearanceLevel && !session.clearanceLevel.includes('Vault')
                      ? session.clearanceLevel
                      : 'Authorized Store Manager'}
                  </span>
                </span>
              </div>

              <p className="text-xs text-ivory/60 italic pt-0.5">
                Authorized to manage stock, print barcode price tags, and process customer orders.
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Contact & Merchant Info */}
            <div className="p-4 bg-black/40 border border-champagne/20 rounded-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-champagne font-serif font-medium text-sm">
                <Mail className="w-4 h-4" />
                <span>Contact &amp; Account Details</span>
              </div>

              <div className="space-y-2 text-ivory/80">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-ivory/50">Merchant Email:</span>
                  <span className="font-mono text-ivory font-medium text-right break-all">
                    {session.email}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-ivory/50">Registered Phone:</span>
                  <span className="font-mono text-ivory font-medium">
                    {session.phone || '+91 98200 98200'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-ivory/50">Security Clearance:</span>
                  <span className="text-champagne font-semibold">Tier-1 Full Access</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-ivory/50">Identity Verification:</span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Staff
                  </span>
                </div>
              </div>
            </div>

            {/* Store & Branch Information */}
            <div className="p-4 bg-black/40 border border-champagne/20 rounded-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-champagne font-serif font-medium text-sm">
                <Store className="w-4 h-4" />
                <span>Assigned Atelier Branch</span>
              </div>

              <div className="space-y-2 text-ivory/80">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-ivory/50">Boutique Firm:</span>
                  <span className="font-medium text-ivory text-right">
                    {session.storeName || 'Velessa Jewellery Flagship Atelier'}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-ivory/50">Location:</span>
                  <span className="text-ivory font-medium text-right">
                    {session.store || 'Zaveri Bazaar Flagship Atelier, Mumbai'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-ivory/50">GSTIN / Tax ID:</span>
                  <span className="font-mono text-champagne font-semibold">
                    {session.gstin || '27AAACV4891M1Z6'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-ivory/50">POS Terminal Node:</span>
                  <span className="font-mono text-ivory/80">TERM-MUM-ZV01</span>
                </div>
              </div>
            </div>

            {/* Session Security Card */}
            <div className="p-4 bg-black/40 border border-champagne/20 rounded-xs space-y-3 md:col-span-2">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-champagne font-serif font-medium text-sm">
                <Laptop className="w-4 h-4" />
                <span>Current Login Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-2.5 bg-white/5 rounded-xs space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-ivory/50 block">
                    Logged In At
                  </span>
                  <span className="font-medium text-ivory text-xs block">
                    {formattedDate}
                  </span>
                </div>
                <div className="p-2.5 bg-white/5 rounded-xs space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-ivory/50 block">
                    Security Connection
                  </span>
                  <span className="font-mono text-emerald-400 text-xs block">
                    TLS 1.3 • Encrypted &amp; Secure
                  </span>
                </div>
                <div className="p-2.5 bg-white/5 rounded-xs space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-ivory/50 block">
                    Access Status
                  </span>
                  <span className="text-champagne font-semibold text-xs block">
                    Full Store Access
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer / Actions */}
        <div className="bg-black/60 border-t border-champagne/20 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs uppercase tracking-wider text-ivory/70 hover:text-ivory border border-white/20 hover:border-white/40 rounded-xs transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600/90 hover:bg-rose-600 text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-all shadow-md cursor-pointer hover:brightness-110"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
