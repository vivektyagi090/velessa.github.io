import React from 'react';
import { RotateCcw } from 'lucide-react';
import { FilterState } from '../../types/filter';
import { ProductCategory, ProductCollection, MetalType } from '../../types/product';
import { CATEGORIES } from '../../data/categories';
import { COLLECTIONS } from '../../data/collections';

interface ProductFiltersProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  isMobileDrawer?: boolean;
}

const MATERIALS: MetalType[] = [
  '1 Gram Gold Forming',
  '24k Micro Gold Plated',
  'Antique Matte Gold',
  'American Diamond (AD)',
  'Kundan & Meenakari',
  'Rose Gold Polish',
  'Rhodium & Silver Polish'
];

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onChange,
  onReset,
  isMobileDrawer = false,
}) => {
  const handleCategoryChange = (cat: ProductCategory | 'All') => {
    onChange({ ...filters, category: cat });
  };

  const handleCollectionChange = (coll: ProductCollection | 'All') => {
    onChange({ ...filters, collection: coll });
  };

  const handleMaterialChange = (mat: MetalType | 'All') => {
    onChange({ ...filters, material: mat });
  };

  const handlePriceChange = (maxPrice: number) => {
    onChange({ ...filters, priceRange: [filters.priceRange[0], maxPrice] });
  };

  const handleInStockToggle = () => {
    onChange({ ...filters, inStockOnly: !filters.inStockOnly });
  };

  return (
    <div className={`space-y-8 font-sans ${isMobileDrawer ? 'p-2' : ''}`}>
      {/* Active filters counter & reset */}
      <div className="flex items-center justify-between pb-4 border-b border-beige">
        <span className="text-xs uppercase tracking-[0.2em] font-medium text-charcoal">
          Filters
        </span>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-charcoal-muted hover:text-champagne transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-[0.2em] text-champagne font-semibold">
          Category
        </h4>
        <div className="space-y-2 text-xs">
          <label className="flex items-center gap-2.5 cursor-pointer text-charcoal hover:text-champagne transition-colors">
            <input
              type="radio"
              name="category"
              checked={filters.category === 'All'}
              onChange={() => handleCategoryChange('All')}
              className="accent-champagne"
            />
            <span>All Categories</span>
          </label>
          {CATEGORIES.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center justify-between cursor-pointer text-charcoal hover:text-champagne transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === cat.name}
                  onChange={() => handleCategoryChange(cat.name)}
                  className="accent-champagne"
                />
                <span>{cat.name}</span>
              </span>
              <span className="text-[10px] text-charcoal-muted">({cat.itemCount})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3 pt-4 border-t border-beige">
        <div className="flex items-center justify-between text-xs">
          <h4 className="uppercase tracking-[0.2em] text-champagne font-semibold">
            Max Price
          </h4>
          <span className="font-semibold text-charcoal">
            ₹{filters.priceRange[1].toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="400"
          max="5000"
          step="100"
          value={filters.priceRange[1]}
          onChange={(e) => handlePriceChange(Number(e.target.value))}
          className="w-full accent-champagne h-1.5 bg-beige-dark rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-charcoal-muted">
          <span>₹400</span>
          <span>₹2,500</span>
          <span>₹5,000+</span>
        </div>
      </div>

      {/* Material / Polish Filter */}
      <div className="space-y-3 pt-4 border-t border-beige">
        <h4 className="text-xs uppercase tracking-[0.2em] text-champagne font-semibold">
          Plating & Polish
        </h4>
        <div className="space-y-2 text-xs">
          <label className="flex items-center gap-2.5 cursor-pointer text-charcoal hover:text-champagne transition-colors">
            <input
              type="radio"
              name="material"
              checked={filters.material === 'All'}
              onChange={() => handleMaterialChange('All')}
              className="accent-champagne"
            />
            <span>All Metals</span>
          </label>
          {MATERIALS.map((mat) => (
            <label
              key={mat}
              className="flex items-center gap-2.5 cursor-pointer text-charcoal hover:text-champagne transition-colors"
            >
              <input
                type="radio"
                name="material"
                checked={filters.material === mat}
                onChange={() => handleMaterialChange(mat)}
                className="accent-champagne"
              />
              <span>{mat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Collection Filter */}
      <div className="space-y-3 pt-4 border-t border-beige">
        <h4 className="text-xs uppercase tracking-[0.2em] text-champagne font-semibold">
          Collection
        </h4>
        <div className="space-y-2 text-xs">
          <label className="flex items-center gap-2.5 cursor-pointer text-charcoal hover:text-champagne transition-colors">
            <input
              type="radio"
              name="collection"
              checked={filters.collection === 'All'}
              onChange={() => handleCollectionChange('All')}
              className="accent-champagne"
            />
            <span>All Collections</span>
          </label>
          {COLLECTIONS.map((coll) => (
            <label
              key={coll.id}
              className="flex items-center gap-2.5 cursor-pointer text-charcoal hover:text-champagne transition-colors"
            >
              <input
                type="radio"
                name="collection"
                checked={filters.collection === coll.name}
                onChange={() => handleCollectionChange(coll.name)}
                className="accent-champagne"
              />
              <span className="truncate">{coll.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* In-Stock Toggle */}
      <div className="pt-4 border-t border-beige">
        <label className="flex items-center justify-between cursor-pointer text-xs">
          <span className="uppercase tracking-[0.18em] text-charcoal font-medium">
            Available In Stock Only
          </span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={handleInStockToggle}
            className="w-4 h-4 accent-champagne rounded cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
};
