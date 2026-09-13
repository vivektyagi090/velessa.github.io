import React from 'react';
import { Sparkles } from 'lucide-react';

const INSTAGRAM_POSTS = [
  {
    id: 'ig-1',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    title: 'The Aurelia Solitaire in dawn light',
    tag: '#VelessaSolitaire'
  },
  {
    id: 'ig-2',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    title: 'Lumina Fluid Choker layered with silk',
    tag: '#LiquidGold'
  },
  {
    id: 'ig-3',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
    title: 'South Sea baroque pearls captured backstage',
    tag: '#HauteJoaillerie'
  },
  {
    id: 'ig-4',
    image: 'https://images.unsplash.com/photo-1611591475825-9276c1f76d45?auto=format&fit=crop&w=800&q=80',
    title: 'Valeria Diamond Tennis Bracelet stack',
    tag: '#VelessaStack'
  },
  {
    id: 'ig-5',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    title: 'Solid 18k gold torque bangle craftsmanship',
    tag: '#MilanAtelier'
  },
  {
    id: 'ig-6',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    title: 'Colombian Emerald Talisman framed in gold',
    tag: '#VelessaFineJewellery'
  },
];

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={`${className} fill-current`} viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export const InstagramGallery: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-[11px] uppercase tracking-[0.3em] text-champagne font-sans font-medium mb-2 flex items-center gap-1.5">
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>Editorial Lookbook</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-charcoal tracking-tight">
            Follow @Velessa.Official
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted font-sans mt-3 max-w-lg">
            Immerse yourself in our visual journal. Share your cherished moments tagged with <strong className="text-charcoal font-semibold">#VelessaMoments</strong> for a chance to be featured.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {INSTAGRAM_POSTS.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square bg-charcoal overflow-hidden rounded-sm block"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-95 group-hover:brightness-75"
                loading="lazy"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center text-ivory">
                <InstagramIcon className="w-6 h-6 text-champagne mb-2 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300" />
                <span className="text-[10px] uppercase font-sans tracking-widest text-champagne font-medium">
                  {post.tag}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
