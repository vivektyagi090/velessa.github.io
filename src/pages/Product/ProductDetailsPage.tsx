import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShieldCheck, Truck, RefreshCw, Sparkles, ChevronDown, Check, Star, MessageSquarePlus } from 'lucide-react';
import { Product, ProductReview } from '../../types/product';
import { productService } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice, calculateDiscount } from '../../utils/formatters';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { RatingStars } from '../../components/common/RatingStars';
import { Button } from '../../components/common/Button';
import { ProductGallery } from '../../components/product/ProductGallery';
import { ProductGrid } from '../../components/product/ProductGrid';
import { QuickViewModal } from '../../components/product/QuickViewModal';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const ProductDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'shipping' | 'specs'>('details');
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<Product | null>(null);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewsList, setReviewsList] = useState<ProductReview[]>([]);

  useEffect(() => {
    let isMounted = true;
    const loadProduct = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const item = await productService.getProductBySlug(slug);
        if (isMounted) {
          setProduct(item);
          if (item) {
            setSelectedSize(item.sizes && item.sizes.length > 0 ? item.sizes[0] : 'Standard');
            setReviewsList(item.reviews || []);
            const related = await productService.getRelatedProducts(item.id, 4);
            if (isMounted) setRelatedProducts(related);
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center py-32">
        <div className="text-center font-sans tracking-widest text-charcoal uppercase text-sm animate-pulse">
          Loading Atelier Creation...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-ivory flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal mb-4">
          Creation Not Found
        </h1>
        <p className="text-sm text-charcoal-muted font-sans mb-8">
          The fine jewellery piece you are seeking is either archived or unavailable.
        </p>
        <Link to="/shop">
          <Button variant="primary" size="md">
            Return to Catalogue
          </Button>
        </Link>
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);
  const discount = calculateDiscount(product.originalPrice, product.price);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize);
  };

  const handleBuyNow = () => {
    addItem(product, quantity, selectedSize);
    navigate('/checkout');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewComment) {
      showToast('Please provide your name and review impressions.', 'error');
      return;
    }

    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      author: reviewAuthor,
      rating: reviewRating,
      date: 'Just now',
      title: reviewTitle || 'Exceptional craftsmanship',
      comment: reviewComment,
      verified: true,
      productVariant: `${product.material} / ${selectedSize}`,
    };

    setReviewsList((prev) => [newRev, ...prev]);
    setIsReviewModalOpen(false);
    setReviewAuthor('');
    setReviewTitle('');
    setReviewComment('');
    showToast('Your review has been submitted for salon verification.', 'success', 'Review Recorded');
  };

  return (
    <div className="min-h-screen bg-ivory pb-36 lg:pb-24">
      {/* Breadcrumb container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumb
          items={[
            { label: 'Shop', path: '/shop' },
            { label: product.category, path: `/shop?category=${product.category}` },
            { label: product.name },
          ]}
        />
      </div>

      {/* Main Showcase Layout: Left Gallery / Right Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Product Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {/* Category & Collection */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.25em] text-champagne font-sans font-semibold">
                  {product.category} • {product.collection}
                </span>
                {product.inStock ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-sans font-medium uppercase tracking-wider">
                    <Check className="w-3.5 h-3.5" /> In Atelier Vault
                  </span>
                ) : (
                  <span className="text-[11px] text-amber-700 font-sans font-medium uppercase tracking-wider">
                    Bespoke Order
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-light leading-tight mt-2">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="mt-3 flex items-center gap-3">
                <RatingStars rating={product.rating} reviewCount={reviewsList.length} size="md" />
                <span className="text-xs text-charcoal-muted">•</span>
                <span className="text-xs text-charcoal-muted font-sans">
                  Item SKU: {product.id.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="py-4 border-y border-beige flex items-baseline gap-4">
              <span className="font-sans text-2xl sm:text-3xl font-semibold text-charcoal">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="font-sans text-base text-charcoal-muted line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-white bg-amber-700 px-2.5 py-0.5 rounded-xs">
                  Privé Privilege -{discount}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-charcoal-muted font-sans font-light leading-relaxed">
              {product.description}
            </p>

            {/* Material & Gemstone Badges */}
            <div className="p-4 bg-white/60 border border-beige rounded-sm space-y-1.5 text-xs font-sans">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Precious Metal:</span>
                <span className="font-medium text-charcoal">{product.material}</span>
              </div>
              {product.gemstone && (
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Gemstone:</span>
                  <span className="font-medium text-charcoal">{product.gemstone}</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Dimensions:</span>
                  <span className="font-medium text-charcoal">{product.dimensions}</span>
                </div>
              )}
            </div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs font-sans">
                  <span className="text-charcoal uppercase tracking-wider font-medium">
                    Select Size
                  </span>
                  <Link
                    to="/contact"
                    className="text-champagne hover:underline text-[11px] uppercase tracking-wider"
                  >
                    Atelier Sizing Guide
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2.5 text-xs font-sans border transition-all rounded-xs ${
                        selectedSize === size
                          ? 'border-charcoal bg-charcoal text-ivory shadow-xs'
                          : 'border-beige-dark/60 bg-white text-charcoal hover:border-champagne'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector + Add to Bag + Buy Now */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="inline-flex items-center border border-charcoal/20 bg-white h-12">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-2 text-charcoal hover:bg-beige/40 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-sans font-medium text-charcoal select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3.5 py-2 text-charcoal hover:bg-beige/40 transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag CTA */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleAddToCart}
                  className="h-12 text-xs"
                >
                  Add to Bag
                </Button>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className="w-12 h-12 border border-charcoal/30 flex items-center justify-center text-charcoal hover:text-champagne hover:border-champagne transition-colors shrink-0 bg-white"
                  aria-label="Save to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-champagne text-champagne' : ''}`} />
                </button>
              </div>

              {/* Buy Now Button */}
              <Button
                variant="gold"
                size="lg"
                fullWidth
                onClick={handleBuyNow}
                className="h-12 shadow-gold-glow"
              >
                Instant White-Glove Checkout
              </Button>
            </div>

            {/* Luxury Assurance Perks */}
            <div className="pt-4 border-t border-beige grid grid-cols-3 gap-3 text-center text-charcoal-muted font-sans">
              <div className="flex flex-col items-center">
                <Truck className="w-4 h-4 text-champagne mb-1" />
                <span className="text-[10px] uppercase tracking-wider">Complimentary Insured Courier</span>
              </div>
              <div className="flex flex-col items-center">
                <RefreshCw className="w-4 h-4 text-champagne mb-1" />
                <span className="text-[10px] uppercase tracking-wider">30-Day Privilege Returns</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-champagne mb-1" />
                <span className="text-[10px] uppercase tracking-wider">Certificate of Authenticity</span>
              </div>
            </div>

            {/* Accordion / Tabs for Specifications, Care, Details */}
            <div className="pt-6 border-t border-beige space-y-3 font-sans">
              <div className="flex border-b border-beige text-xs uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-3 pr-4 sm:pr-6 border-b-2 font-medium transition-colors ${
                    activeTab === 'details'
                      ? 'border-charcoal text-charcoal'
                      : 'border-transparent text-charcoal-muted hover:text-charcoal'
                  }`}
                >
                  Craft Details
                </button>
                <button
                  onClick={() => setActiveTab('care')}
                  className={`pb-3 px-4 sm:px-6 border-b-2 font-medium transition-colors ${
                    activeTab === 'care'
                      ? 'border-charcoal text-charcoal'
                      : 'border-transparent text-charcoal-muted hover:text-charcoal'
                  }`}
                >
                  Care Guide
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-3 px-4 sm:px-6 border-b-2 font-medium transition-colors ${
                    activeTab === 'specs'
                      ? 'border-charcoal text-charcoal'
                      : 'border-transparent text-charcoal-muted hover:text-charcoal'
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-3 pl-4 sm:pl-6 border-b-2 font-medium transition-colors ${
                    activeTab === 'shipping'
                      ? 'border-charcoal text-charcoal'
                      : 'border-transparent text-charcoal-muted hover:text-charcoal'
                  }`}
                >
                  Delivery
                </button>
              </div>

              {/* Tab Contents */}
              <div className="pt-2 text-xs text-charcoal-muted leading-relaxed">
                {activeTab === 'details' && (
                  <ul className="list-disc list-inside space-y-1.5 pl-1">
                    {product.details ? (
                      product.details.map((d, i) => <li key={i}>{d}</li>)
                    ) : (
                      <>
                        <li>Handcrafted in recycled 18k solid gold</li>
                        <li>Certified conflict-free stones</li>
                        <li>Individually hallmarked with Velessa atelier insignia</li>
                      </>
                    )}
                  </ul>
                )}

                {activeTab === 'care' && (
                  <ul className="list-disc list-inside space-y-1.5 pl-1">
                    {product.careInstructions ? (
                      product.careInstructions.map((c, i) => <li key={i}>{c}</li>)
                    ) : (
                      <>
                        <li>Store individually in the provided velvet Velessa pouch</li>
                        <li>Avoid abrasive chemicals, bleach, perfumes, and saltwater</li>
                        <li>Polish gently with the supplied microfiber flannel cloth</li>
                      </>
                    )}
                  </ul>
                )}

                {activeTab === 'specs' && (
                  <div className="space-y-2">
                    {product.specifications ? (
                      Object.entries(product.specifications).map(([key, val]) => (
                        <div key={key} className="flex justify-between py-1 border-b border-beige/60">
                          <span className="text-charcoal-muted font-sans">{key}</span>
                          <span className="text-charcoal font-medium font-sans">{val}</span>
                        </div>
                      ))
                    ) : (
                      <p>Standard fine jewellery specifications apply.</p>
                    )}
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-2">
                    <p>
                      Every Velessa piece is dispatched via armored insured express courier in discreet luxury packaging.
                    </p>
                    <p>
                      <strong>Domestic:</strong> 2-3 business days. Complimentary on orders over ₹15,000.
                    </p>
                    <p>
                      <strong>International:</strong> 3-5 business days with all customs duties pre-cleared.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-16 border-t border-beige">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-beige gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-champagne font-sans font-semibold">
              Collector Insights
            </span>
            <h2 className="font-serif text-3xl text-charcoal font-light mt-1">
              Customer Impressions ({reviewsList.length})
            </h2>
          </div>

          <Button
            variant="outline"
            size="md"
            onClick={() => setIsReviewModalOpen(true)}
            className="flex items-center gap-2"
          >
            <MessageSquarePlus className="w-4 h-4 text-champagne" />
            <span>Write an Atelier Review</span>
          </Button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {reviewsList.map((rev) => (
            <div
              key={rev.id}
              className="p-6 bg-white border border-beige rounded-sm shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <RatingStars rating={rev.rating} size="sm" showNumeric={false} />
                <span className="text-[11px] text-charcoal-muted font-sans">{rev.date}</span>
              </div>
              <h4 className="font-serif text-lg text-charcoal font-medium">
                {rev.title}
              </h4>
              <p className="text-xs text-charcoal-muted font-sans leading-relaxed">
                “{rev.comment}”
              </p>
              <div className="pt-2 border-t border-beige/60 flex items-center justify-between text-[11px] text-charcoal-muted font-sans">
                <span className="font-medium text-charcoal">{rev.author}</span>
                {rev.verified && (
                  <span className="text-champagne font-medium uppercase tracking-wider">
                    Verified Purchase
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related Products / You May Also Like */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-16 border-t border-beige">
          <div className="text-center mb-12">
            <span className="text-[11px] uppercase tracking-[0.3em] text-champagne font-sans font-medium mb-2 block">
              Curated Harmonies
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-light">
              You May Also Admire
            </h2>
          </div>

          <ProductGrid
            products={relatedProducts}
            onQuickView={(p) => setSelectedQuickViewProduct(p)}
            columns={4}
          />
        </section>
      )}

      {/* Write a Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Share Your Impression"
      >
        <form onSubmit={handleAddReview} className="space-y-4 font-sans text-xs">
          <div>
            <label className="block uppercase tracking-wider text-charcoal font-medium mb-1">
              Your Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="p-1 text-champagne"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= reviewRating ? 'fill-champagne text-champagne' : 'text-beige-dark'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-wider text-charcoal font-medium mb-1">
              Your Name
            </label>
            <input
              type="text"
              required
              value={reviewAuthor}
              onChange={(e) => setReviewAuthor(e.target.value)}
              placeholder="e.g. Eleanor Vance"
              className="w-full p-2.5 bg-white border border-beige focus:border-champagne outline-none rounded-xs"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-charcoal font-medium mb-1">
              Headline
            </label>
            <input
              type="text"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              placeholder="e.g. Transcendent beauty and quality"
              className="w-full p-2.5 bg-white border border-beige focus:border-champagne outline-none rounded-xs"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-charcoal font-medium mb-1">
              Your Review
            </label>
            <textarea
              required
              rows={4}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Describe the luster, feel on the skin, and your salon experience..."
              className="w-full p-2.5 bg-white border border-beige focus:border-champagne outline-none rounded-xs resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setIsReviewModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedQuickViewProduct}
        isOpen={!!selectedQuickViewProduct}
        onClose={() => setSelectedQuickViewProduct(null)}
      />

      {/* Mobile App Sticky Buy/Action Bar */}
      <aside
        aria-label="Quick acquisition bar"
        className="fixed bottom-16 inset-x-0 z-30 lg:hidden bg-ivory/95 backdrop-blur-xl border-t border-champagne/30 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-2.5 transition-all"
      >
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-10 h-10 object-cover rounded-xs border border-beige shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-serif font-light text-charcoal truncate">
                {product.name}
              </p>
              <p className="text-xs font-semibold text-charcoal">
                {formatPrice(product.price)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleWishlist(product)}
              className="p-2 border border-charcoal/20 bg-white rounded-xs text-charcoal hover:text-champagne transition-colors"
              aria-label="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-champagne text-champagne' : ''}`} />
            </button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddToCart}
              className="text-xs px-4 py-2 shadow-xs whitespace-nowrap active:scale-95"
            >
              Add to Bag
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
};
