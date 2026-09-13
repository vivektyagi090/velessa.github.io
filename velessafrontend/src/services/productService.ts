import { Product, CategoryInfo, CollectionInfo } from '../types/product';
import { FilterState } from '../types/filter';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { COLLECTIONS } from '../data/collections';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5286/api';

export interface CreateProductInput {
  name: string;
  sku: string;
  shortDescription?: string;
  description: string;
  basePrice: number;
  discountPrice?: number;
  categoryId: number;
  categoryName?: string;
  metalType?: number;
  material?: string;
  purity?: string;
  grossWeightGrams?: number;
  netWeightGrams?: number;
  gemstone?: string;
  dimensions?: string;
  sizes?: string[];
  inStock?: boolean;
  stockQuantity: number;
  isFeatured?: boolean;
  imageUrls: string[];
}

export interface UpdateProductInput extends CreateProductInput {}

const saveProductSizes = (id: string | number, sku: string, sizes: string[]) => {
  try {
    const raw = localStorage.getItem('velessa_product_sizes') || '{}';
    const dict = JSON.parse(raw);
    dict[String(id)] = sizes;
    dict[String(id).replace('db_', '')] = sizes;
    if (sku) dict[sku] = sizes;
    localStorage.setItem('velessa_product_sizes', JSON.stringify(dict));
  } catch {}
};

const getProductSizes = (id: string | number, sku?: string): string[] | null => {
  try {
    const raw = localStorage.getItem('velessa_product_sizes');
    if (raw) {
      const dict = JSON.parse(raw);
      if (dict[String(id)]) return dict[String(id)];
      if (dict[String(id).replace('db_', '')]) return dict[String(id).replace('db_', '')];
      if (sku && dict[sku]) return dict[sku];
    }
  } catch {}
  return null;
};

const mapBackendProductToProduct = (dto: any): Product => {
  const images = dto.images && dto.images.length > 0
    ? dto.images.map((img: any) => img.imageUrl)
    : [dto.primaryImageUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'];

  const savedSizes = getProductSizes(dto.id, dto.sku);

  return {
    id: `db_${dto.id}`,
    name: dto.name,
    slug: dto.slug || dto.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    price: dto.discountPrice || dto.basePrice,
    originalPrice: dto.discountPrice ? dto.basePrice : undefined,
    category: (dto.categoryName || '1 Gram Gold Forming') as any,
    collection: dto.isFeatured ? 'Signature Collection' : 'New Arrivals',
    material: dto.material || dto.purity || '1 Gram Gold Forming',
    description: dto.description || dto.shortDescription || 'Crafted with royal 1-Gram gold forming technology.',
    shortDescription: dto.shortDescription,
    images: images,
    sku: dto.sku || `VLSA-${dto.id}`,
    inStock: dto.inStock !== false && (dto.stockQuantity === undefined || dto.stockQuantity > 0),
    stockQuantity: dto.stockQuantity ?? 10,
    grossWeightGrams: dto.grossWeightGrams ?? 18.5,
    netWeightGrams: dto.netWeightGrams ?? 16.0,
    purity: dto.purity || '24K Micro Gold Plated',
    gemstone: dto.gemstone || (dto.description && dto.description.toLowerCase().includes('diamond') ? 'American Diamond (CZ)' : undefined),
    dimensions: dto.dimensions,
    isActive: true,
    rating: 4.9,
    reviewCount: 18,
    isFeatured: dto.isFeatured || false,
    isNew: true,
    sizes: (dto.sizes && dto.sizes.length > 0) ? dto.sizes : (savedSizes && savedSizes.length > 0 ? savedSizes : ['Free Size', 'Adjustable']),
  };
};

let _productsCache: Product[] | null = null;
let _cacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL
let _inFlightPromise: Promise<Product[]> | null = null;

let _categoriesCache: CategoryInfo[] | null = null;
let _categoriesCacheTimestamp = 0;

const getDeletedProductIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem('velessa_deleted_product_ids');
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
};

const filterDeletedProducts = (items: Product[]): Product[] => {
  const deletedSet = getDeletedProductIds();
  if (deletedSet.size === 0) return items;
  return items.filter((p) => {
    const cleanId = String(p.id).replace('db_', '');
    return !deletedSet.has(String(p.id)) && !deletedSet.has(cleanId) && (!p.sku || !deletedSet.has(p.sku));
  });
};

export const productService = {
  invalidateCache(): void {
    _productsCache = null;
    _cacheTimestamp = 0;
    _inFlightPromise = null;
    try {
      localStorage.removeItem('velessa_cached_products');
    } catch {}
  },

  invalidateCategoriesCache(): void {
    _categoriesCache = null;
    _categoriesCacheTimestamp = 0;
  },

  /**
   * Synchronous hydration method - returns products immediately (0ms) on page load/refresh
   * from memory cache or localStorage, preventing any loading skeleton screens!
   */
  getInitialProductsSync(): Product[] {
    if (_productsCache && _productsCache.length > 0) {
      return filterDeletedProducts([..._productsCache]);
    }
    try {
      const saved = localStorage.getItem('velessa_cached_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          _productsCache = filterDeletedProducts(parsed);
          _cacheTimestamp = Date.now();
          return _productsCache;
        }
      }
    } catch {}
    return filterDeletedProducts([...PRODUCTS]);
  },

  async getAllProducts(forceRefresh: boolean = false): Promise<Product[]> {
    const isFresh = _productsCache !== null && Date.now() - _cacheTimestamp < CACHE_TTL_MS;
    if (!forceRefresh && isFresh) {
      return filterDeletedProducts([...(_productsCache as Product[])]);
    }

    if (!forceRefresh && _inFlightPromise) {
      return _inFlightPromise;
    }

    _inFlightPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (response.ok) {
          const backendProducts = await response.json();
          if (Array.isArray(backendProducts) && backendProducts.length > 0) {
            const mapped = backendProducts.map(mapBackendProductToProduct);
            // Merge: Put backend products first, then existing mock products that aren't duplicates
            const backendSkus = new Set(mapped.map((p) => p.sku));
            const nonDupLocal = PRODUCTS.filter((p) => !backendSkus.has(p.sku));
            const combined = filterDeletedProducts([...mapped, ...nonDupLocal]);
            _productsCache = combined;
            _cacheTimestamp = Date.now();
            try {
              localStorage.setItem('velessa_cached_products', JSON.stringify(combined));
            } catch {}
            return combined;
          }
        }
      } catch {
        // Offline / fallback to local products
      } finally {
        _inFlightPromise = null;
      }

      const fallback = filterDeletedProducts([...PRODUCTS]);
      _productsCache = fallback;
      _cacheTimestamp = Date.now();
      try {
        localStorage.setItem('velessa_cached_products', JSON.stringify(fallback));
      } catch {}
      return fallback;
    })();

    return _inFlightPromise;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const cachedList = this.getInitialProductsSync();
    const cachedItem = cachedList.find((p) => p.slug === slug);

    try {
      const response = await fetch(`${API_BASE_URL}/products/slug/${slug}`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          const mapped = mapBackendProductToProduct(data);
          if (_productsCache) {
            const idx = _productsCache.findIndex((p) => p.slug === slug || p.id === mapped.id);
            if (idx >= 0) {
              _productsCache[idx] = mapped;
            } else {
              _productsCache.unshift(mapped);
            }
          }
          return mapped;
        }
      }
    } catch {
      // fallback to cached
    }

    if (cachedItem) return cachedItem;

    const all = await this.getAllProducts();
    const product = all.find((p) => p.slug === slug);
    return product || null;
  },

  async getProductById(id: string): Promise<Product | null> {
    const cachedList = this.getInitialProductsSync();
    const cachedItem = cachedList.find((p) => p.id === id);

    if (id.startsWith('db_')) {
      const numericId = id.replace('db_', '');
      try {
        const response = await fetch(`${API_BASE_URL}/products/${numericId}`);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            const mapped = mapBackendProductToProduct(data);
            if (_productsCache) {
              const idx = _productsCache.findIndex((p) => p.id === id);
              if (idx >= 0) _productsCache[idx] = mapped;
            }
            return mapped;
          }
        }
      } catch {
        // fallback
      }
    }

    if (cachedItem) return cachedItem;

    const all = await this.getAllProducts();
    const product = all.find((p) => p.id === id);
    return product || null;
  },

  async createProduct(input: CreateProductInput): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Failed to create jewellery item' }));
      throw new Error(err.message || 'Failed to create product');
    }

    const created = await response.json();
    if (input.sizes && input.sizes.length > 0) {
      saveProductSizes(created.id, created.sku || input.sku, input.sizes);
    }

    const mapped = mapBackendProductToProduct(created);
    if (input.sizes && input.sizes.length > 0) mapped.sizes = input.sizes;
    if (input.categoryName) mapped.category = input.categoryName as any;
    if (input.material) mapped.material = input.material;
    if (input.gemstone) mapped.gemstone = input.gemstone;
    if (input.dimensions) mapped.dimensions = input.dimensions;

    this.invalidateCache();
    if (_productsCache) {
      _productsCache.unshift(mapped);
      try {
        localStorage.setItem('velessa_cached_products', JSON.stringify(_productsCache));
      } catch {}
    }

    return mapped;
  },

  async updateProduct(id: string | number, input: UpdateProductInput): Promise<Product> {
    const cleanId = String(id).replace('db_', '');
    const response = await fetch(`${API_BASE_URL}/products/${cleanId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Failed to update jewellery item' }));
      throw new Error(err.message || 'Failed to update product');
    }

    const updated = await response.json();
    if (input.sizes && input.sizes.length > 0) {
      saveProductSizes(cleanId, input.sku, input.sizes);
    }

    const mapped = mapBackendProductToProduct(updated);
    if (input.sizes && input.sizes.length > 0) mapped.sizes = input.sizes;
    if (input.categoryName) mapped.category = input.categoryName as any;
    if (input.material) mapped.material = input.material;
    if (input.gemstone) mapped.gemstone = input.gemstone;
    if (input.dimensions) mapped.dimensions = input.dimensions;

    this.invalidateCache();
    if (_productsCache) {
      const idx = _productsCache.findIndex((p) => p.id === `db_${cleanId}` || p.id === String(cleanId) || p.sku === input.sku);
      if (idx >= 0) {
        _productsCache[idx] = mapped;
      } else {
        _productsCache.unshift(mapped);
      }
      try {
        localStorage.setItem('velessa_cached_products', JSON.stringify(_productsCache));
      } catch {}
    }

    return mapped;
  },

  async updateStock(id: string | number, stockQuantity: number, inStock: boolean = true): Promise<void> {
    const cleanId = String(id).replace('db_', '');
    const response = await fetch(`${API_BASE_URL}/products/${cleanId}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stockQuantity, inStock }),
    });

    if (!response.ok) {
      throw new Error('Failed to update stock in database');
    }
    this.invalidateCache();
  },

  async deleteProduct(id: string | number, sku?: string): Promise<void> {
    const cleanId = String(id).replace('db_', '');
    const isNumeric = /^\d+$/.test(cleanId);

    if (isNumeric) {
      try {
        const response = await fetch(`${API_BASE_URL}/products/${cleanId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          console.warn('Backend delete returned status:', response.status);
        }
      } catch (err) {
        console.warn('Backend delete network error:', err);
      }
    }

    try {
      const raw = localStorage.getItem('velessa_deleted_product_ids') || '[]';
      const list: string[] = JSON.parse(raw);
      if (!list.includes(String(id))) list.push(String(id));
      if (!list.includes(cleanId)) list.push(cleanId);
      if (sku && !list.includes(sku)) list.push(sku);
      localStorage.setItem('velessa_deleted_product_ids', JSON.stringify(list));
    } catch {}

    if (_productsCache) {
      _productsCache = _productsCache.filter((p) => p.id !== id && p.id !== `db_${cleanId}` && p.id !== cleanId && (sku ? p.sku !== sku : true));
      try {
        localStorage.setItem('velessa_cached_products', JSON.stringify(_productsCache));
      } catch {}
    } else {
      this.invalidateCache();
    }
  },

  async getFeaturedProducts(limit: number = 4): Promise<Product[]> {
    const all = await this.getAllProducts();
    return all.filter((p) => p.isFeatured).slice(0, limit);
  },

  async getNewArrivals(limit: number = 4): Promise<Product[]> {
    const all = await this.getAllProducts();
    return all.filter((p) => p.isNew || p.collection === 'Festive Collection').slice(0, limit);
  },

  async getBestSellers(limit: number = 4): Promise<Product[]> {
    const all = await this.getAllProducts();
    return all.filter((p) => p.isBestSeller).slice(0, limit);
  },

  async getRelatedProducts(currentProductId: string, limit: number = 4): Promise<Product[]> {
    const all = await this.getAllProducts();
    const current = all.find((p) => p.id === currentProductId);
    if (!current) return all.slice(0, limit);

    return all
      .filter((p) => p.id !== currentProductId && (p.category === current.category || p.collection === current.collection))
      .slice(0, limit);
  },

  /**
   * Pure synchronous filter function - executes in < 0.1ms in memory!
   * No network requests, no skeleton flickering.
   */
  applyFilters(products: Product[], filter: Partial<FilterState>): Product[] {
    let results = [...products];

    if (filter.category && filter.category !== 'All') {
      const targetCat = filter.category.toLowerCase().trim();
      results = results.filter((p) => p.category && p.category.toLowerCase().trim() === targetCat);
    }

    if (filter.collection && filter.collection !== 'All') {
      if (filter.collection === 'New Arrivals') {
        results = results.filter((p) => p.isNew || p.collection === 'New Arrivals');
      } else {
        const targetCol = filter.collection.toLowerCase().trim();
        results = results.filter((p) => p.collection && p.collection.toLowerCase().trim() === targetCol);
      }
    }

    if (filter.material && filter.material !== 'All') {
      const targetMat = filter.material.toLowerCase().trim();
      results = results.filter((p) => p.material && p.material.toLowerCase().includes(targetMat));
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
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.material && p.material.toLowerCase().includes(q)) ||
          (p.collection && p.collection.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
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
          results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
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

  async filterProducts(filter: Partial<FilterState>): Promise<Product[]> {
    const all = await this.getAllProducts();
    return this.applyFilters(all, filter);
  },

  async searchProducts(query: string): Promise<Product[]> {
    if (!query.trim()) return [];
    const all = await this.getAllProducts();
    const q = query.toLowerCase().trim();
    return all.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q)
    );
  },

  async getCategories(forceRefresh: boolean = false): Promise<CategoryInfo[]> {
    const isFresh = _categoriesCache !== null && Date.now() - _categoriesCacheTimestamp < CACHE_TTL_MS;
    if (!forceRefresh && isFresh) {
      return [...(_categoriesCache as CategoryInfo[])];
    }

    let result: CategoryInfo[] = [];
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const backendCats: CategoryInfo[] = data.map((c: any) => ({
            id: String(c.id),
            name: c.name,
            slug: c.slug || c.name.toLowerCase().replace(/\s+/g, '-'),
            description: c.description || `Explore our ${c.name} collection.`,
            image: c.imageUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
            itemCount: c.productCount || 0,
            startingPrice: 999,
          }));

          // Merge with predefined categories
          const names = new Set(backendCats.map((c) => c.name.toLowerCase()));
          const extra = CATEGORIES.filter((c) => !names.has(c.name.toLowerCase()));
          result = [...backendCats, ...extra];
        }
      }
    } catch {
      // offline fallback
    }

    if (result.length === 0) {
      // Also include any locally saved custom categories
      try {
        const saved = localStorage.getItem('velessa_custom_categories');
        if (saved) {
          const customNames: string[] = JSON.parse(saved);
          const existingNames = new Set(CATEGORIES.map((c) => c.name.toLowerCase()));
          const customCats: CategoryInfo[] = customNames
            .filter((n) => !existingNames.has(n.toLowerCase()))
            .map((name, i) => ({
              id: `custom_${i}`,
              name: name as any,
              slug: name.toLowerCase().replace(/\s+/g, '-'),
              description: `Handcrafted ${name} by Velessa artisans`,
              image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
              itemCount: 1,
              startingPrice: 999,
            }));
          result = [...CATEGORIES, ...customCats];
        }
      } catch {
        // ignore
      }
    }

    if (result.length === 0) {
      result = [...CATEGORIES];
    }

    _categoriesCache = result;
    _categoriesCacheTimestamp = Date.now();
    return result;
  },

  async createCategory(name: string, description?: string, imageUrl?: string): Promise<CategoryInfo> {
    this.invalidateCategoriesCache();
    const trimmed = name.trim();
    // Save to local storage cache immediately
    try {
      const saved = localStorage.getItem('velessa_custom_categories');
      const list: string[] = saved ? JSON.parse(saved) : [];
      if (!list.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
        list.push(trimmed);
        localStorage.setItem('velessa_custom_categories', JSON.stringify(list));
      }
    } catch {
      // ignore
    }

    try {
      const res = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmed,
          description: description || `Velessa ${trimmed} Collection`,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
        }),
      });
      if (res.ok) {
        const cat = await res.json();
        return {
          id: String(cat.id),
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          image: cat.imageUrl,
          itemCount: 0,
          startingPrice: 999,
        };
      }
    } catch {
      // fallback
    }

    return {
      id: `cat_${Date.now()}`,
      name: trimmed as any,
      slug: trimmed.toLowerCase().replace(/\s+/g, '-'),
      description: `Velessa ${trimmed} Collection`,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      itemCount: 0,
      startingPrice: 999,
    };
  },

  async getCollections(): Promise<CollectionInfo[]> {
    return [...COLLECTIONS];
  }
};
