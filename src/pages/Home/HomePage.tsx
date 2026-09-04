import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product } from '../../types/product';
import { productService } from '../../services/productService';
import { HeroSection } from '../../components/home/HeroSection';
import { FeaturedCategories } from '../../components/home/FeaturedCategories';
import { BrandStorySection } from '../../components/home/BrandStorySection';
import { EditorialBanner } from '../../components/home/EditorialBanner';
import { WhyVelessa } from '../../components/home/WhyVelessa';
import { TestimonialsCarousel } from '../../components/home/TestimonialsCarousel';
import { InstagramGallery } from '../../components/home/InstagramGallery';
import { NewsletterSection } from '../../components/home/NewsletterSection';
import { ProductGrid } from '../../components/product/ProductGrid';
import { QuickViewModal } from '../../components/product/QuickViewModal';
import { SectionHeading } from '../../components/common/SectionHeading';
import { Button } from '../../components/common/Button';

export const HomePage: React.FC = () => {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHomeProducts = async () => {
      try {
        const [arrivals, best] = await Promise.all([
          productService.getNewArrivals(4),
          productService.getBestSellers(4),
        ]);
        setNewArrivals(arrivals);
        setBestSellers(best);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeProducts();
  }, []);

  return (
    <div className="min-h-screen bg-ivory">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Featured Categories */}
      <FeaturedCategories />

      {/* 3. New Arrivals */}
      <section className="py-20 sm:py-28 bg-beige/20 border-t border-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            kicker="New Editions"
            title="Fresh Atelier Arrivals"
            description="Explore our latest high jewellery additions, featuring modern sculptural solitaires, baroque flame pearls, and liquid 18k gold."
          />

          <ProductGrid
            products={newArrivals}
            isLoading={isLoading}
            onQuickView={(p) => setSelectedQuickViewProduct(p)}
            columns={4}
          />

          <div className="text-center mt-12 sm:mt-16">
            <Link to="/shop?filter=new">
              <Button variant="outline" size="md" className="group">
                <span className="flex items-center gap-2">
                  View All New Arrivals
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Brand Story Section */}
      <BrandStorySection />

      {/* 5. Best Sellers */}
      <section className="py-20 sm:py-28 bg-ivory border-t border-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            kicker="Signature Icons"
            title="Most Coveted Creations"
            description="Timeless pieces adored by our patrons worldwide, renowned for exceptional brilliance and enduring form."
          />

          <ProductGrid
            products={bestSellers}
            isLoading={isLoading}
            onQuickView={(p) => setSelectedQuickViewProduct(p)}
            columns={4}
          />

          <div className="text-center mt-12 sm:mt-16">
            <Link to="/shop">
              <Button variant="outline" size="md" className="group">
                <span className="flex items-center gap-2">
                  Shop All Icons
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Editorial Collection Banner */}
      <EditorialBanner />

      {/* 7. Why Velessa (Pillars) */}
      <WhyVelessa />

      {/* 8. Customer Testimonials */}
      <TestimonialsCarousel />

      {/* 9. Instagram Lookbook Gallery */}
      <InstagramGallery />

      {/* 10. Newsletter */}
      <NewsletterSection />

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedQuickViewProduct}
        isOpen={!!selectedQuickViewProduct}
        onClose={() => setSelectedQuickViewProduct(null)}
      />
    </div>
  );
};
