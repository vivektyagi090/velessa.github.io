import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gold' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-sans uppercase tracking-widest transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-champagne disabled:opacity-50 disabled:cursor-not-allowed select-none text-center cursor-pointer';

  const sizeStyles = {
    sm: 'text-[10px] py-2 px-4 tracking-[0.2em]',
    md: 'text-xs py-3 px-6 tracking-[0.22em]',
    lg: 'text-xs md:text-sm py-4 px-8 tracking-[0.25em]',
  };

  const variantStyles = {
    primary: 'bg-charcoal text-ivory hover:bg-black active:scale-[0.99] border border-charcoal shadow-sm',
    secondary: 'bg-ivory text-charcoal hover:bg-beige-light border border-charcoal/30 active:scale-[0.99]',
    gold: 'bg-champagne text-charcoal hover:bg-champagne-hover active:scale-[0.99] font-medium shadow-sm',
    outline: 'bg-transparent text-charcoal border border-charcoal/40 hover:border-champagne hover:text-champagne active:scale-[0.99]',
    ghost: 'bg-transparent text-charcoal hover:text-champagne hover:bg-beige/20',
    link: 'bg-transparent text-charcoal hover:text-champagne underline underline-offset-4 !p-0 !tracking-normal capitalize font-serif',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
