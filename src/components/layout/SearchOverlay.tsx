import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../../types/product';
import { productService } from '../../services/productService';
import { formatPrice } from '../../utils/formatters';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  'Solitaire Ring',
  'South Sea Pearl',
  'Tennis Bracelet',
  'Herringbone Choker',
  'Colombian Emerald',
  '18k Gold'
];

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      const res = await productService.searchProducts(query);
      setResults(res);
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectProduct = (slug: string) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  const handleViewAllResults = () => {
    onClose();
    navigate(`/shop?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-charcoal/80 backdrop-blur-md animate-fade-in">
      {/* Search Container */}
      <div className="bg-ivory border-b border-champagne/30 shadow-2xl pt-6 pb-8 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Top Bar with Close Button */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] uppercase tracking-[0.25em] text-champagne font-sans font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Catalogue Search
            </span>
            <button
              onClick={onClose}
              className="text-charcoal-muted hover:text-champagne transition-colors p-1"
              aria-label="Close search"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search Input Box */}
          <div className="relative flex items-center border-b-2 border-charcoal focus-within:border-champagne transition-colors pb-3">
            <Search className="w-6 h-6 text-charcoal-muted mr-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by gemstone, collection, ring, necklace, or metal..."
              className="w-full bg-transparent text-charcoal font-serif text-xl sm:text-2xl outline-none placeholder:text-charcoal-muted/40 placeholder:font-sans placeholder:text-base sm:placeholder:text-lg"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-charcoal-muted hover:text-charcoal text-xs uppercase tracking-wider font-sans ml-2"
              >
                Clear
              </button>
            )}
          </div>

          {/* Trending Searches Tags */}
          <div className="mt-4 flex items-center flex-wrap gap-2">
            <span className="text-xs uppercase tracking-wider text-charcoal-muted font-sans mr-2">
              Trending:
            </span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="text-xs font-sans px-3 py-1 bg-beige/40 hover:bg-champagne/20 text-charcoal border border-beige hover:border-champagne transition-colors rounded-full"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="max-w-4xl mx-auto bg-ivory/95 rounded-sm p-6 shadow-xl border border-beige-dark/20 backdrop-blur-sm">
          {isLoading && (
            <div className="py-12 text-center text-charcoal-muted font-sans text-sm tracking-widest uppercase">
              Searching Velessa collection...
            </div>
          )}

          {!isLoading && query && results.length === 0 && (
            <div className="py-12 text-center">
              <p className="font-serif text-2xl text-charcoal mb-2">No creations found</p>
              <p className="text-sm text-charcoal-muted font-sans">
                We could not find items matching "{query}". Try searching for diamonds, emeralds, 18k gold, or hoops.
              </p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-beige mb-4">
                <span className="text-xs uppercase tracking-[0.2em] text-charcoal-muted font-sans">
                  {results.length} Creations Found
                </span>
                <button
                  onClick={handleViewAllResults}
                  className="inline-flex items-center gap-1 text-xs uppercase tracking-wider font-sans text-champagne hover:underline"
                >
                  <span>View in shop</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {results.slice(0, 6).map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product.slug)}
                    className="group cursor-pointer flex gap-4 p-2 rounded hover:bg-beige/30 transition-colors border border-transparent hover:border-champagne/30"
                  >
                    <div className="w-20 h-20 shrink-0 bg-beige/20 overflow-hidden relative">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-[10px] uppercase tracking-wider text-champagne font-sans">
                        {product.category}
                      </span>
                      <h4 className="font-serif text-sm font-normal text-charcoal group-hover:text-champagne transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-sans font-medium text-charcoal">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[11px] line-through text-charcoal-muted font-sans">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {results.length > 6 && (
                <div className="text-center mt-6 pt-4 border-t border-beige">
                  <button
                    onClick={handleViewAllResults}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-charcoal hover:text-champagne font-sans font-medium transition-colors"
                  >
                    <span>View all {results.length} products</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {!query && (
            <div className="py-8 text-center">
              <p className="font-serif text-lg text-charcoal italic">
                “Search through handcrafted fine jewellery, diamond solitaires, and bespoke suites.”
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
