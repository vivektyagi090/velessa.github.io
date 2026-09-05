export type ProductCategory = 
  | '1 Gram Gold Forming'
  | 'Necklaces' 
  | 'Earrings' 
  | 'Bangles' 
  | 'Mangalsutras'
  | 'Rings' 
  | 'Bracelets' 
  | 'Pendants';

export type ProductCollection = 
  | 'Signature Collection' 
  | 'Bridal Collection' 
  | 'Everyday Elegance' 
  | 'Statement Jewellery' 
  | 'Minimal Collection' 
  | 'Festive Collection'
  | 'New Arrivals';

export type MetalType = 
  | '1 Gram Gold Forming' 
  | '24k Micro Gold Plated'
  | 'Antique Matte Gold'
  | 'American Diamond (AD)'
  | 'Kundan & Meenakari'
  | 'Rose Gold Polish'
  | 'Rhodium & Silver Polish'
  | 'Brass & Copper Alloy Base'
  | '18k Yellow Gold' 
  | '18k Rose Gold' 
  | '18k White Gold' 
  | 'Platinum 950' 
  | 'Sterling Silver 925' 
  | 'Vermeil Gold';

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  userImage?: string;
  productVariant?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  collection: ProductCollection;
  material: MetalType | string;
  description: string;
  shortDescription?: string;
  images: string[];
  sizes?: string[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  inStock: boolean;
  gemstone?: string;
  karat?: string;
  dimensions?: string;
  details?: string[];
  careInstructions?: string[];
  specifications?: Record<string, string>;
  reviews?: ProductReview[];
}

export interface CategoryInfo {
  id: string;
  name: ProductCategory;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
  startingPrice: number;
}

export interface CollectionInfo {
  id: string;
  name: ProductCollection;
  slug: string;
  tagline: string;
  description: string;
  heroImage: string;
  cardImage: string;
  accentQuote?: string;
}
