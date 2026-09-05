import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside aria-label="Announcement" className="bg-charcoal text-ivory text-[11px] sm:text-xs py-2 px-4 border-b border-champagne/20 relative z-40 transition-all font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="w-6 hidden sm:block" /> {/* Spacer */}
        <div className="flex items-center justify-center gap-2 mx-auto tracking-[0.16em] uppercase font-light text-center">
          <span className="text-sm">🌺</span>
          <span>Ganpati Utsav Celebration: Extra 15% OFF on 1 Gram Gold Forming</span>
          <span className="text-champagne hidden md:inline">|</span>
          <span className="hidden md:inline text-champagne">
            Use Code <strong className="font-semibold text-ivory underline decoration-champagne">GANPATI15</strong> • New Arrivals
          </span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-ivory/60 hover:text-champagne transition-colors p-1"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
