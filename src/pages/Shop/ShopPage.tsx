import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import { Product, ProductCategory, ProductCollection, MetalType } from '../../types/product';
import { FilterState } from '../../types/filter';
import { productService } from '../../services/productService';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { ProductGrid } from '../../components/product/ProductGrid';
import { ProductFilters } from '../../components/product/ProductFilters';
import { QuickViewModal } from '../../components/product/QuickViewModal';
import { Button } from '../../components/common/Button';

const INITIAL_FILTERS: FilterState = {
  category: 'All',
  collection: 'All',
  material: 'All',
  priceRange: [400, 5000],
  inStockOnly: false,
  sortBy: 'featured',
  searchQuery: '',
};

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<Product | null>(null);

  // Sync filters from URL search params on mount or param changes
  useEffect(() => {
    const categoryParam = searchParams.get('category') as ProductCategory | null;
    const collectionParam = searchParams.get('collection') as ProductCollection | null;
    const qParam = searchParams.get('q');
    const filterParam = searchParams.get('filter');

    setFilters((prev) => ({
      ...prev,
      category: categoryParam || 'All',
      collection: collectionParam || 'All',
      searchQuery: qParam || '',
      sortBy: filterParam === 'new' ? 'newest' : prev.sortBy,
    }));
  }, [searchParams]);

  // Fetch filtered products whenever filter state changes
  useEffect(() => {
    let isMounted = true;
    const fetchFiltered = async () => {
      setIsLoading(true);
      try {
        const results = await productService.filterProducts(filters);
        if (isMounted) setProducts(results);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchFiltered();
    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSearchParams({});
  };

  const activeFilterTags = [
    filters.category !== 'All' && { key: 'category', label: `Category: ${filters.category}` },
    filters.collection !== 'All' && { key: 'collection', label: `Collection: ${filters.collection}` },
    filters.material !== 'All' && { key: 'material', label: `Plating: ${filters.material}` },
    filters.priceRange[1] < 5000 && { key: 'price', label: `Under ₹${filters.priceRange[1].toLocaleString('en-IN')}` },
    filters.inStockOnly && { key: 'stock', label: 'In Stock Only' },
    filters.searchQuery && { key: 'search', label: `Search: "${filters.searchQuery}"` },
  ].filter(Boolean) as { key: string; label: string }[];

  const removeTag = (key: string) => {
    if (key === 'category') setFilters({ ...filters, category: 'All' });
    if (key === 'collection') setFilters({ ...filters, collection: 'All' });
    if (key === 'material') setFilters({ ...filters, material: 'All' });
    if (key === 'price') setFilters({ ...filters, priceRange: [400, 5000] });
    if (key === 'stock') setFilters({ ...filters, inStockOnly: false });
    if (key === 'search') setFilters({ ...filters, searchQuery: '' });
  };

  return (
    <div className="min-h-screen bg-ivory pb-24">
      {/* Header Banner */}
      <div className="bg-beige/30 border-b border-beige py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[11px] uppercase tracking-[0.3em] text-champagne font-sans font-medium mb-2 block">
            1 Gram Gold & Imitation Jewellery Catalogue
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-charcoal tracking-tight">
            {filters.category !== 'All'
              ? filters.category
              : filters.collection !== 'All'
              ? filters.collection
              : 'All Jewellery Creations'}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted font-sans max-w-xl mx-auto mt-3">
            Handcrafted 1 Gram Gold Forming, Kundan, and American Diamond jewellery with 100% real gold shine and anti-tarnish guarantee.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Breadcrumb & Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-beige pb-4 gap-4">
          <Breadcrumb
            items={[
              { label: 'Shop', path: '/shop' },
              ...(filters.category !== 'All' ? [{ label: filters.category }] : []),
            ]}
          />

          <div className="flex items-center justify-between sm:justify-end gap-4">
            {/* Mobile Filter Drawer Trigger */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 py-2 px-3 bg-white border border-beige text-xs uppercase tracking-wider font-sans text-charcoal hover:border-champagne transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-champagne" />
              <span>Filters ({activeFilterTags.length})</span>
            </button>

            {/* Product count */}
            <span className="text-xs font-sans text-charcoal-muted hidden md:inline">
              Showing <strong className="text-charcoal font-medium">{products.length}</strong> creations
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-charcoal-muted font-sans hidden sm:inline">
                Sort:
              </span>
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
                  className="bg-white border border-beige py-2 pl-3 pr-8 text-xs font-sans text-charcoal focus:border-champagne outline-none cursor-pointer appearance-none uppercase tracking-wider"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">New Editions</option>
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-charcoal-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Tags */}
        {activeFilterTags.length > 0 && (
          <div className="flex items-center flex-wrap gap-2 py-4">
            <span className="text-xs uppercase tracking-wider text-charcoal-muted font-sans mr-2">
              Active:
            </span>
            {activeFilterTags.map((tag) => (
              <span
                key={tag.key}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-champagne/40 rounded-full text-xs font-sans text-charcoal shadow-2xs"
              >
                <span>{tag.label}</span>
                <button
                  onClick={() => removeTag(tag.key)}
                  className="text-charcoal-muted hover:text-charcoal p-0.5"
                  aria-label="Remove filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              onClick={handleResetFilters}
              className="text-xs font-sans text-champagne hover:underline ml-2 uppercase tracking-wider"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Catalogue Body: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-6">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28 bg-white border border-beige p-6 rounded-sm shadow-sm">
              <ProductFilters
                filters={filters}
                onChange={setFilters}
                onReset={handleResetFilters}
              />
            </div>
          </aside>

          {/* Main Product Grid */}
          <main className="lg:col-span-9">
            <ProductGrid
              products={products}
              isLoading={isLoading}
              onQuickView={(p) => setSelectedQuickViewProduct(p)}
              columns={3}
            />
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-charcoal/70 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-4/5 max-w-sm bg-ivory h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto p-6 animate-fade-in border-l border-beige">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-beige mb-6">
                <span className="font-serif text-2xl text-charcoal">Filter Catalogue</span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-charcoal-muted hover:text-charcoal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <ProductFilters
                filters={filters}
                onChange={setFilters}
                onReset={handleResetFilters}
                isMobileDrawer
              />
            </div>

            <div className="pt-6 border-t border-beige mt-8">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => setIsMobileFilterOpen(false)}
              >
                Apply Filters ({products.length} Items)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedQuickViewProduct}
        isOpen={!!selectedQuickViewProduct}
        onClose={() => setSelectedQuickViewProduct(null)}
      />
    </div>
  );
};
