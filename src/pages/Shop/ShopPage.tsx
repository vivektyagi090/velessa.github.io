import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ArrowUpDown, Sparkles } from 'lucide-react';
import { Product, ProductCategory, ProductCollection, MetalType } from '../../types/product';
import { FilterState } from '../../types/filter';
import { productService } from '../../services/productService';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { ProductGrid } from '../../components/product/ProductGrid';
import { ProductFilters } from '../../components/product/ProductFilters';
import { QuickViewModal } from '../../components/product/QuickViewModal';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import ganpatiFestiveImg from '../../assets/images/ganpati_festive_jewellery.jpg';
import newArrivalImg from '../../assets/images/new_arrival_jewellery.jpg';

interface FestiveLabelChip {
  id: string;
  label: string;
  image: string;
  type: 'all' | 'festive' | 'new' | 'category';
  categoryName?: ProductCategory;
}

const FESTIVE_LABEL_CHIPS: FestiveLabelChip[] = [
  {
    id: 'all',
    label: 'All Jewellery',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=300&q=80',
    type: 'all',
  },
  {
    id: 'ganpati',
    label: '🌺 Ganpati Special (15% OFF)',
    image: ganpatiFestiveImg,
    type: 'festive',
  },
  {
    id: 'new-arrivals',
    label: '✨ New Arrivals',
    image: newArrivalImg,
    type: 'new',
  },
  {
    id: '1-gram-gold-forming',
    label: '1 Gram Gold Forming',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=300&q=80',
    type: 'category',
    categoryName: '1 Gram Gold Forming',
  },
  {
    id: 'necklaces',
    label: 'Kundan & Necklaces',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80',
    type: 'category',
    categoryName: 'Necklaces',
  },
  {
    id: 'earrings',
    label: 'Chandbalis & Jhumkas',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=300&q=80',
    type: 'category',
    categoryName: 'Earrings',
  },
  {
    id: 'bangles',
    label: 'Kadas & Bangles',
    image: 'https://images.unsplash.com/photo-1611591475825-9276c1f76d45?auto=format&fit=crop&w=300&q=80',
    type: 'category',
    categoryName: 'Bangles',
  },
  {
    id: 'mangalsutras',
    label: 'Sacred Mangalsutras',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=300&q=80',
    type: 'category',
    categoryName: 'Mangalsutras',
  },
  {
    id: 'rings',
    label: 'AD Solitaire Rings',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80',
    type: 'category',
    categoryName: 'Rings',
  },
];

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
  const { showToast } = useToast();

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

  const handleChipSelect = (chip: FestiveLabelChip) => {
    if (chip.type === 'all') {
      setFilters((prev) => ({ ...prev, category: 'All', collection: 'All' }));
    } else if (chip.type === 'festive') {
      setFilters((prev) => ({ ...prev, collection: 'Festive Collection', category: 'All' }));
      showToast('Viewing Ganpati & Festive Celebration Collection! Use code GANPATI15 for 15% off.', 'info');
    } else if (chip.type === 'new') {
      setFilters((prev) => ({ ...prev, collection: 'New Arrivals', category: 'All' }));
      showToast('Viewing New Festive Arrivals in 1 Gram Gold & Kundan!', 'info');
    } else if (chip.categoryName) {
      setFilters((prev) => ({ ...prev, category: chip.categoryName!, collection: 'All' }));
    }
  };

  const copyFestiveCode = () => {
    navigator.clipboard.writeText('GANPATI15');
    showToast('Promo code GANPATI15 copied to clipboard! (15% Off)', 'success');
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
      {/* Header Banner with Real Jewellery Image Backdrop ("back side" jewellery imagery) */}
      <div className="relative bg-charcoal text-ivory py-10 sm:py-14 overflow-hidden border-b border-champagne/30">
        {/* Background Jewellery Imagery ("back side" visual image) */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <img
            src={ganpatiFestiveImg}
            alt="Ganpati Festive 1 Gram Gold Jewellery"
            className="w-full h-full object-cover object-center scale-105 filter brightness-[0.32] contrast-[1.15] saturate-[1.15]"
          />
          {/* Editorial dark-to-translucent gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-black/80" />
          <div className="absolute inset-0 bg-radial-gradient from-champagne/25 via-transparent to-charcoal/90" />
        </div>

        {/* Floating Ghost Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-[1]" aria-hidden="true">
          <span className="font-serif text-7xl sm:text-9xl md:text-[11rem] tracking-[0.28em] uppercase text-ivory/[0.04] leading-none whitespace-nowrap">
            VELESSA
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Festive Ganpati Celebration & New Arrival Offer Badges */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2.5 mb-3.5">
            {/* Ganpati Celebration Offer Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-950/90 via-amber-900/90 to-rose-950/90 text-amber-200 border border-amber-400/60 text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.2em] shadow-gold-glow backdrop-blur-md">
              <span className="text-sm animate-pulse">🌺</span>
              <span className="font-semibold">Ganpati Utsav Celebration • Flat 15% OFF</span>
              <span className="text-amber-400/60 hidden sm:inline">•</span>
              <button
                type="button"
                onClick={copyFestiveCode}
                className="hidden sm:inline-flex items-center gap-1 font-mono font-bold bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 px-2.5 py-0.5 rounded border border-amber-400/50 text-[10px] transition-colors cursor-pointer"
                title="Click to copy promo code"
              >
                <span>CODE: GANPATI15</span>
              </button>
            </div>

            {/* New Arrival Badge */}
            <button
              type="button"
              onClick={() => handleChipSelect(FESTIVE_LABEL_CHIPS[2])}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-ivory/10 hover:bg-ivory/20 backdrop-blur-sm border border-champagne/40 text-champagne-light text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.2em] transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-champagne" />
              <span>New Festive Arrivals</span>
            </button>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-ivory tracking-tight leading-tight">
            {filters.category !== 'All'
              ? filters.category
              : filters.collection !== 'All'
              ? filters.collection
              : 'All Jewellery Creations'}
          </h1>
          <p className="text-xs sm:text-sm text-ivory/85 font-sans max-w-2xl mx-auto mt-3 font-light leading-relaxed">
            Handcrafted 1 Gram Gold Forming, royal Kundan chokers, and American Diamond jewellery with 100% real gold shine and anti-tarnish guarantee.
          </p>

          {/* Quick-Access Jewellery Image Label Chips ("label images of any jewellery") */}
          <div className="mt-7 pt-5 border-t border-ivory/15">
            <span className="text-[10px] uppercase tracking-[0.25em] text-champagne block mb-3 font-sans font-medium">
              Explore By Jewellery Collection &amp; Festive Offers
            </span>
            <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 scrollbar-none max-w-full px-1">
              {FESTIVE_LABEL_CHIPS.map((chip) => {
                const isActive =
                  chip.type === 'all'
                    ? filters.category === 'All' && filters.collection === 'All'
                    : chip.type === 'festive'
                    ? filters.collection === 'Festive Collection'
                    : chip.type === 'new'
                    ? filters.collection === 'New Arrivals'
                    : filters.category === chip.categoryName;

                return (
                  <button
                    key={chip.id}
                    onClick={() => handleChipSelect(chip)}
                    className={`flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full text-xs font-sans whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-champagne text-charcoal font-semibold ring-2 ring-champagne ring-offset-2 ring-offset-charcoal shadow-gold-glow scale-105'
                        : 'bg-white/10 hover:bg-white/20 text-ivory border border-white/15 backdrop-blur-sm hover:border-champagne/50'
                    }`}
                  >
                    <img
                      src={chip.image}
                      alt={chip.label}
                      className="w-6 h-6 rounded-full object-cover border border-champagne/50 shrink-0"
                    />
                    <span className="tracking-wider text-[10px] sm:text-xs">{chip.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
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

        {/* Festive Celebration Banner Card */}
        <div className="mt-4 mb-6 rounded-sm overflow-hidden border border-amber-400/40 shadow-luxury bg-gradient-to-r from-amber-950 via-charcoal to-amber-950 text-ivory p-5 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6 relative">
          <div className="space-y-2 z-10 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] uppercase tracking-widest font-sans font-medium">
              <span>🌺</span>
              <span>Ganesh Chaturthi Utsav Privilege</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-ivory font-light leading-snug">
              Auspicious 1 Gram Gold &amp; Kundan Blessings
            </h2>
            <p className="text-xs sm:text-sm text-ivory/80 font-sans font-light leading-relaxed">
              Adorn your festive season with 1 Gram Gold Forming temple harams, antique chokers, and royal kadas. Apply coupon <strong className="text-amber-300 font-mono underline decoration-amber-400">GANPATI15</strong> for an extra 15% discount on all orders.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 z-10 w-full sm:w-auto justify-center">
            <Button
              variant="gold"
              size="sm"
              onClick={copyFestiveCode}
              className="!px-6 !py-2.5 shadow-gold-glow flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
            >
              <span>Copy Code GANPATI15</span>
            </Button>
            <button
              onClick={() => handleChipSelect(FESTIVE_LABEL_CHIPS[1])}
              className="px-4 py-2 rounded-sm border border-champagne/40 bg-white/10 hover:bg-white/20 text-champagne text-xs uppercase tracking-wider font-sans transition-all w-full sm:w-auto text-center cursor-pointer"
            >
              View Festive Offer
            </button>
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
