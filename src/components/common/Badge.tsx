import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'charcoal' | 'ivory' | 'sale' | 'subtle';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gold',
  className = ''
}) => {
  const base = 'inline-flex items-center text-[10px] uppercase font-sans tracking-[0.2em] px-2.5 py-1 font-medium select-none';

  const variants = {
    gold: 'bg-champagne/15 text-champagne-dark border border-champagne/30',
    charcoal: 'bg-charcoal text-ivory',
    ivory: 'bg-ivory text-charcoal border border-beige-dark',
    sale: 'bg-[#B45309] text-white',
    subtle: 'bg-beige/40 text-charcoal-muted border border-beige',
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
