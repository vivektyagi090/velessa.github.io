# Velessa — Haute Joaillerie & Fine Jewellery

> A modern, premium, and responsive luxury jewellery e-commerce web application crafted for **Velessa**.

---

## Brand & Aesthetic

- **Color Palette**:
  - **Soft Ivory / Off-white**: `#F8F5F0`
  - **Champagne Gold**: `#C6A15B`
  - **Deep Charcoal / Obsidian**: `#1C1C1C`
  - **Warm Beige**: `#E8DED1`
  - **White**: `#FFFFFF`
- **Typography**:
  - **Headings & Accents**: *Cormorant Garamond* & *Playfair Display*
  - **UI & Navigation**: *Montserrat* & *Inter* with luxury wide letter-spacing (`tracking-[0.2em]`)
- **Visual Design**:
  - Dynamic sticky header transitioning from transparent hero to glassmorphism soft ivory on scroll
  - Micro-interactions, cursor magnifier zoom on product images, and fullscreen lightbox view
  - Dual-angle image hover cross-fades on product cards
  - Slide-out Cart Drawer and live debounced Search Overlay

---

## Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler / Dev Server**: Vite
- **Styling**: Tailwind CSS v3 with custom luxury tokens
- **Routing**: React Router v7
- **Icons**: Lucide React + custom SVG luxury brand marks
- **State Management**: React Context (`CartContext`, `WishlistContext`, `AuthContext`, `ToastContext`) with `localStorage` persistence

---

## Application Structure & Pages

1. **Home Page (`/`)**: Hero section with editorial typography, Featured Categories (Rings, Necklaces, Earrings, Bracelets, Bangles, Pendants), New Arrivals, Brand Story, Best Sellers, The Velessa Signature Banner, Why Velessa (Craftsmanship, Designs, Materials, Packaging), Client Testimonials, Instagram Lookbook, Newsletter, and Footer.
2. **Shop Catalogue (`/shop`)**: Multi-facet sidebar filters (category, metal, collection, price range, in-stock only), sorting dropdown, active filter dismissal, and mobile drawer.
3. **Product Details (`/product/:slug`)**: Multi-angle image gallery with interactive hover zoom magnifier and fullscreen lightbox, size selector, quantity picker, Add to Bag, Instant Checkout, tabbed atelier specifications, customer reviews list with "Write a Review" modal, and related products.
4. **Collections (`/collections`)**: Editorial spreads for Signature, Bridal, Everyday Elegance, Statement, Minimal, and Festive collections.
5. **Wishlist (`/wishlist`)**: Saved creations with persistence, quick move to bag, and luxury empty state.
6. **Shopping Bag (`/cart`) & Slide-Out Cart Drawer**: Quantity controls, line-item pricing, promo code validation engine (`VELESSA10`, `VIP15`, `DIAMOND20`), and free insured shipping threshold progress bar.
7. **Checkout Flow (`/checkout`)**: Multi-step checkout (Contact & Shipping Address, Delivery Method, Mock Payment gateway) with instant Order Confirmation receipt (`VEL-XXXXXX`).
8. **Live Search Overlay**: Instant search querying titles, categories, metals, and gemstones with autocomplete tags.
9. **About Velessa (`/about`)**: Atelier story, craftsmanship manifesto, sustainable ethical diamond sourcing, and maison promise.
10. **Concierge & Contact (`/contact`)**: Salon appointment bookings, customer service details, Milan & New York flagship addresses, and FAQ accordion.
11. **Authentication UI (`/login` & `/register`)**: Luxury patron onboarding and circle membership session state.

---

## Backend-Ready Architecture

All components consume data through a typed asynchronous service layer in `src/services/` (`productService`, `cartService`, `wishlistService`, `authService`, `orderService`). Swapping mock data for a real REST or GraphQL API requires zero changes to the UI layer.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
The optimized bundle will be generated in `dist/`.

---

© 2026 VELESSA HAUTE JOAILLERIE. All rights reserved.
