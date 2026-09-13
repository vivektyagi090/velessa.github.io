import { ProductCategory, ProductCollection, MetalType } from './product';

export interface FilterState {
  category: ProductCategory | 'All';
  collection: ProductCollection | 'All';
  material: MetalType | 'All';
  priceRange: [number, number];
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  searchQuery: string;
}
