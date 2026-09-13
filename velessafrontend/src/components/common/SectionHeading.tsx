import React from 'react';

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  kicker,
  title,
  description,
  align = 'center',
  className = ''
}) => {
  const alignStyles = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div className={`flex flex-col mb-12 md:mb-16 ${alignStyles[align]} ${className}`}>
      {kicker && (
        <span className="text-[11px] uppercase tracking-[0.3em] text-champagne font-sans font-medium mb-3">
          {kicker}
        </span>
      )}
      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-charcoal tracking-tight leading-tight">
        {title}
      </h2>
      <div className="w-12 h-[1px] bg-champagne mt-4 mb-4" />
      {description && (
        <p className="max-w-2xl text-charcoal-muted text-sm sm:text-base font-light leading-relaxed font-sans">
          {description}
        </p>
      )}
    </div>
  );
};
