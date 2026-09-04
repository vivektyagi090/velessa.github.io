import React from 'react';
import { Product } from '../../types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
  isLoading?: boolean;
  columns?: 2 | 3 | 4;
  className?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onQuickView,
  isLoading = false,
  columns = 4,
  className = ''
}) => {
  const colStyles = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4',
  };

  if (isLoading) {
    return (
      <div className={`grid ${colStyles[columns]} gap-6 sm:gap-8 ${className}`}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex flex-col animate-pulse">
            <div className="w-full aspect-[4/5] bg-beige/40 rounded-sm mb-4" />
            <div className="w-1/3 h-3 bg-beige/40 rounded mb-2" />
            <div className="w-4/5 h-4 bg-beige/40 rounded mb-2" />
            <div className="w-1/4 h-3 bg-beige/40 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <h3 className="font-serif text-2xl text-charcoal mb-2 font-light">
          No Creations Match Your Criteria
        </h3>
        <p className="text-xs sm:text-sm text-charcoal-muted font-sans max-w-md mx-auto leading-relaxed">
          Please adjust your selected filters, material, or price ranges to view additional jewellery selections.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid ${colStyles[columns]} gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12 ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
};
