import { Product, CategoryInfo, CollectionInfo } from '../types/product';
import { FilterState } from '../types/filter';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { COLLECTIONS } from '../data/collections';

// Simulated network latency for backend realism
const delay = (ms: number = 100) => new Promise((resolve) => setTimeout(resolve, ms));

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    await delay(120);
    return [...PRODUCTS];
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    await delay(100);
    const product = PRODUCTS.find((p) => p.slug === slug);
    return product || null;
  },

  async getProductById(id: string): Promise<Product | null> {
    await delay(80);
    const product = PRODUCTS.find((p) => p.id === id);
    return product || null;
  },

  async getFeaturedProducts(limit: number = 4): Promise<Product[]> {
    await delay(100);
    return PRODUCTS.filter((p) => p.isFeatured).slice(0, limit);
  },

  async getNewArrivals(limit: number = 4): Promise<Product[]> {
    await delay(100);
    return PRODUCTS.filter((p) => p.isNew || p.collection === 'Festive Collection').slice(0, limit);
  },

  async getBestSellers(limit: number = 4): Promise<Product[]> {
    await delay(100);
    return PRODUCTS.filter((p) => p.isBestSeller).slice(0, limit);
  },

  async getRelatedProducts(currentProductId: string, limit: number = 4): Promise<Product[]> {
    await delay(120);
    const current = PRODUCTS.find((p) => p.id === currentProductId);
    if (!current) return PRODUCTS.slice(0, limit);

    return PRODUCTS
      .filter((p) => p.id !== currentProductId && (p.category === current.category || p.collection === current.collection))
      .slice(0, limit);
  },

  async filterProducts(filter: Partial<FilterState>): Promise<Product[]> {
    await delay(150);
    let results = [...PRODUCTS];

    if (filter.category && filter.category !== 'All') {
      results = results.filter((p) => p.category.toLowerCase() === filter.category?.toLowerCase());
    }

    if (filter.collection && filter.collection !== 'All') {
      if (filter.collection === 'New Arrivals') {
        results = results.filter((p) => p.isNew || p.collection === 'New Arrivals');
      } else if (filter.collection === 'Festive Collection') {
        results = results.filter((p) => p.collection === 'Festive Collection' || Boolean(p.festiveTag));
      } else {
        results = results.filter((p) => p.collection.toLowerCase() === filter.collection?.toLowerCase());
      }
    }

    if (filter.material && filter.material !== 'All') {
      results = results.filter((p) => p.material.toLowerCase().includes((filter.material || '').toLowerCase()));
    }

    if (filter.inStockOnly) {
      results = results.filter((p) => p.inStock);
    }

    if (filter.priceRange) {
      const [min, max] = filter.priceRange;
      results = results.filter((p) => p.price >= min && p.price <= max);
    }

    if (filter.searchQuery && filter.searchQuery.trim() !== '') {
      const q = filter.searchQuery.toLowerCase().trim();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    if (filter.sortBy) {
      switch (filter.sortBy) {
        case 'price-asc':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          results.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          results.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        case 'featured':
        default:
          results.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
          break;
      }
    }

    return results;
  },

  async searchProducts(query: string): Promise<Product[]> {
    if (!query.trim()) return [];
    await delay(80);
    const q = query.toLowerCase().trim();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q)
    );
  },

  async getCategories(): Promise<CategoryInfo[]> {
    await delay(80);
    return [...CATEGORIES];
  },

  async getCollections(): Promise<CollectionInfo[]> {
    await delay(80);
    return [...COLLECTIONS];
  }
};
