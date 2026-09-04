import { ProductReview } from '../types/product';

export interface CustomerTestimonial {
  id: string;
  customerName: string;
  location: string;
  rating: number;
  review: string;
  purchasedProduct: string;
  image?: string;
  date: string;
}

export const TESTIMONIALS: CustomerTestimonial[] = [
  {
    id: 't-1',
    customerName: 'Victoria Sterling',
    location: 'London & Geneva',
    rating: 5,
    review: 'The Aurelia Solitaire exceeded every expectation. The 18k champagne gold has a subtle, buttery warmth that cannot be captured in photographs alone. The packaging arrived sealed like a treasure box from Place Vendôme.',
    purchasedProduct: 'Aurelia 18k Champagne Diamond Solitaire',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    date: 'February 2026'
  },
  {
    id: 't-2',
    customerName: 'Elena Rostova',
    location: 'Paris, France',
    rating: 5,
    review: 'I wear the Lumina Herringbone Choker daily. It sits effortlessly flush against the collarbone without twisting. Velessa understands true quiet luxury—exquisite craftsmanship without gaudy logos.',
    purchasedProduct: 'Lumina Fluid Herringbone Choker',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    date: 'January 2026'
  },
  {
    id: 't-3',
    customerName: 'Claire Beauchamp',
    location: 'New York, USA',
    rating: 5,
    review: 'Our bridal set from Velessa drew gasps across the ceremony. The ethical lab-grown diamonds possess intense clarity, and the bespoke engraving inside was executed with surgical precision.',
    purchasedProduct: 'Celeste Pavé Crown Band',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    date: 'January 2026'
  },
  {
    id: 't-4',
    customerName: 'Aria Chen',
    location: 'Singapore',
    rating: 5,
    review: 'The concierge customer service was exceptional. They assisted me with sizing, dispatched express insured delivery, and followed up to ensure the fit was pristine. Truly a world-class luxury house.',
    purchasedProduct: 'Seraphina Baroque Pearl Drops',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    date: 'December 2025'
  }
];
