import { Product } from '../types/product';

export const PRODUCTS: Product[] = [
  {
    id: 'vel-001',
    name: '1 Gram Gold Forming Solitaire American Diamond Ring',
    slug: '1-gram-gold-forming-solitaire-ad-ring',
    price: 699,
    originalPrice: 1299,
    category: 'Rings',
    collection: 'Signature Collection',
    material: '1 Gram Gold Forming',
    description: 'Expertly forged using our premium 1 Gram Gold Forming technique over a skin-friendly brass core. Embellished with a brilliant AAA+ heart-and-arrows American Diamond that sparkles indistinguishably from a real mined solitaire.',
    shortDescription: '1 Gram Micro Gold Forming ring with AAA+ Swiss American Diamond.',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1543290954-518482ff7698?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['12 (Indian)', '14 (Indian)', '16 (Indian)', '18 (Indian)', 'Adjustable Free Size'],
    rating: 4.9,
    reviewCount: 48,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
    gemstone: 'AAA+ Swiss Cut American Diamond',
    karat: '1 Gram 24K Gold Forming',
    dimensions: 'Band width: 2.2mm | Crown: 7mm',
    details: [
      'Authentic 1 Gram Real Gold Forming plating technology',
      'Mirror 22K yellow gold shade that matches pure hallmarked gold',
      'Hypoallergenic brass & copper core (100% lead & nickel free)',
      'Anti-tarnish protective lacquer coat for daily & festive durability'
    ],
    careInstructions: [
      'Keep away from direct perfume sprays, hair lacquers, and harsh detergents',
      'Wipe with a soft dry cloth after wearing and store in an airtight ziplock or velvet box',
      'Remove before taking showers, swimming, or vigorous workouts'
    ],
    specifications: {
      'Plating': '1 Gram 24K Gold Forming (Micro-Plated)',
      'Base Metal': 'Skin-Friendly Pure Brass & Copper Alloy',
      'Stone Type': 'AAA+ Grade Cubic Zirconia / AD',
      'Finish': '22K Traditional Yellow Gold Mirror Gloss',
      'Warranty': '6-Month Color & Polish Guarantee',
      'Packaging': 'Velessa Signature Luxury Red-Velvet Gift Box'
    },
    reviews: [
      {
        id: 'rev-01',
        author: 'Pooja Sharma',
        rating: 5,
        date: 'February 18, 2026',
        title: 'Looks exactly like real 22k gold!',
        comment: 'I wore this to my cousin’s wedding and everyone thought it was pure gold from Tanishq. The shine and finish are simply stunning for the price.',
        verified: true,
        productVariant: '14 (Indian)'
      },
      {
        id: 'rev-02',
        author: 'Ananya Verma',
        rating: 5,
        date: 'January 25, 2026',
        title: 'Anti-tarnish quality is top notch',
        comment: 'Have been wearing this regularly for 3 weeks now, no color fading or irritation on my sensitive skin. Highly satisfied with Velessa.',
        verified: true,
        productVariant: 'Adjustable Free Size'
      }
    ]
  },
  {
    id: 'vel-002',
    name: 'Rajwadi Antique 1 Gram Gold Forming Temple Choker Set',
    slug: 'rajwadi-antique-temple-choker-set',
    price: 2499,
    originalPrice: 4299,
    category: 'Necklaces',
    collection: 'Bridal Collection',
    material: 'Antique Matte Gold',
    description: 'A regal royal bridal choker set inspired by South Indian temple jewellery. Features intricate Goddess Lakshmi hand-carvings surrounded by semi-precious Kemp rubies, emeralds, and dangling South Sea shell pearls.',
    shortDescription: 'Heritage temple choker with matching jhumkas in antique 1g gold finish.',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['Adjustable Dori / Thread (One Size Fits All)'],
    rating: 4.9,
    reviewCount: 36,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    festiveTag: 'Ganpati Special',
    inStock: true,
    gemstone: 'Hydro Kemp Rubies, Emeralds & Cultured Shell Pearls',
    karat: '1 Gram Matte Gold Forming',
    dimensions: 'Choker width: 4.2cm | Earrings length: 5.5cm',
    details: [
      'Includes 1 Choker Necklace and 1 Pair of matching Temple Jhumkas',
      'Premium 1 Gram Antique Gold Forming with rich matte finish',
      'Adjustable golden zari dori for customized neck fit',
      'Ideal for Weddings, Bridal Trousseau, and Grand Festivals'
    ],
    careInstructions: [
      'Store in an airtight container or original Velessa box away from moisture',
      'Always apply perfume and cosmetics before putting on the jewellery'
    ],
    specifications: {
      'Style': 'Temple Nakshi & Kemp Heritage',
      'Plating': '1 Gram Antique Gold Forming with Matte Coat',
      'Base Material': 'Brass and Copper Alloy',
      'Stones': 'High-Grade Synthetic Kemp Stones & Shell Pearls',
      'Closure': 'Adjustable Golden Thread Rope (Dori)'
    },
    reviews: [
      {
        id: 'rev-03',
        author: 'Deepika R.',
        rating: 5,
        date: 'February 10, 2026',
        title: 'Royal bridal look without spending lakhs',
        comment: 'The detailing on the Lakshmi motif and the jhumkas is mesmerizing. It feels heavy and looks like real heirloom gold temple jewellery.',
        verified: true
      }
    ]
  },
  {
    id: 'vel-003',
    name: 'Traditional 1 Gram Gold Daily Wear Mangalsutra (30 inch)',
    slug: 'traditional-1-gram-gold-daily-wear-mangalsutra',
    price: 999,
    originalPrice: 1899,
    category: 'Mangalsutras',
    collection: 'Everyday Elegance',
    material: '1 Gram Gold Forming',
    description: 'An auspicious double-line black bead and 1 gram gold forming chain featuring a handcrafted wati pendant with delicate filigree detailing. Designed for effortless daily wear with anti-tarnish sweat-proof protection.',
    shortDescription: '30-inch double-line sacred mangalsutra with 1g gold forming wati pendant.',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['24 Inches', '30 Inches', '36 Inches'],
    rating: 4.8,
    reviewCount: 64,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
    gemstone: 'Natural Black Crystal Beads & Micro CZs',
    karat: '1 Gram 24K Gold Forming',
    dimensions: 'Chain length: 30 inches | Pendant: 2.5cm',
    details: [
      '1 Gram Real Gold micro-plating with protective sweat-resistant polish',
      'Double strand reinforced black glass beads for long-lasting strength',
      'Traditional Maharashtrian Wati / North Indian Auspicious design',
      'Comfortable S-hook closure in sturdy brass core'
    ],
    careInstructions: [
      'Clean periodically with a dry cotton cloth',
      'Do not soak in hot soapy water or chemical cleaners'
    ],
    specifications: {
      'Category': 'Sacred Daily Wear Mangalsutra',
      'Plating': '1 Gram 24K Yellow Gold Forming',
      'Base Metal': 'Skin-Safe Brass',
      'Chain Type': 'Double Layer Black Crystal Bead',
      'Length': '30 Inches'
    },
    reviews: [
      {
        id: 'rev-04',
        author: 'Meenakshi Iyer',
        rating: 5,
        date: 'January 12, 2026',
        title: 'Perfect for daily office and home wear',
        comment: 'Very lightweight, does not pull on hair or clothes, and the gold color is authentic 22k yellow gold. Looks just like my original wedding mangalsutra!',
        verified: true,
        productVariant: '30 Inches'
      }
    ]
  },
  {
    id: 'vel-004',
    name: 'Kundan & Pearl Heritage Chandbali Earrings',
    slug: 'kundan-pearl-heritage-chandbali-earrings',
    price: 899,
    originalPrice: 1599,
    category: 'Earrings',
    collection: 'Festive Collection',
    material: 'Kundan & Meenakari',
    description: 'Splendid crescent-moon Chandbali earrings embedded with sparkling uncut Kundan stones, delicate hand-painted Meenakari reverse work, and cascading pearl clusters. Lightweight and designed for all-day festive comfort.',
    shortDescription: 'Handcrafted Kundan Chandbalis with pearl droplets and Meenakari backing.',
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['One Size (Push Back with Safety Clip)'],
    rating: 4.8,
    reviewCount: 29,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    festiveTag: 'Festive Offer',
    inStock: true,
    gemstone: 'Glass Kundan & Shell Pearls',
    karat: '1 Gram Gold Forming',
    dimensions: 'Length: 7.5cm | Width: 4.5cm',
    details: [
      'Handcrafted uncut glass Kundan with foiled gold settings',
      'Intricate traditional Meenakari (enameling) on reverse side',
      'Secured with sturdy push-back and comfort silicone support'
    ],
    careInstructions: [
      'Avoid contact with perfumes and moisture; store wrapped in cotton'
    ],
    specifications: {
      'Design': 'Mughal & Rajputana Chandbali',
      'Finish': '1 Gram Gold Polish with Meenakari',
      'Base': 'Jewellery Grade Brass',
      'Weight': '26 grams (Pair - lightweight)'
    },
    reviews: [
      {
        id: 'rev-05',
        author: 'Rhea Kapoor',
        rating: 5,
        date: 'February 02, 2026',
        title: 'Extremely lightweight and gorgeous',
        comment: 'Usually big Chandbalis hurt my earlobes, but these are so comfortable! Got tons of compliments on Sangeet night.',
        verified: true
      }
    ]
  },
  {
    id: 'vel-005',
    name: 'Royal 1 Gram Gold Forming Micro-Plated Bangles (Set of 2)',
    slug: 'royal-1-gram-gold-forming-bangles-pair',
    price: 1399,
    originalPrice: 2499,
    category: 'Bangles',
    collection: 'Signature Collection',
    material: '1 Gram Gold Forming',
    description: 'An authentic pair of 1 Gram Gold Forming daily wear bangles adorned with delicate floral diamond-cut laser engravings. Crafted with a solid brass foundation for the reassuring weight and gleam of real 22K gold.',
    shortDescription: 'Pair of 2 diamond-cut laser finished 1g gold forming bangles.',
    images: [
      'https://images.unsplash.com/photo-1611591475825-9276c1f76d45?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['2.4 (Small)', '2.6 (Medium)', '2.8 (Large)', '2.10 (Extra Large)'],
    rating: 4.9,
    reviewCount: 52,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    festiveTag: 'Ganpati Special',
    inStock: true,
    gemstone: 'None (Pure Gold Look)',
    karat: '1 Gram 24K Gold Forming',
    dimensions: 'Width: 8mm each | Set of 2 Bangles',
    details: [
      'Precision diamond-cut faceting that catches light brilliantly',
      'Micro 1 Gram 24K Gold coating guaranteed for daily durability',
      'Smooth, comfort-edge inner wall to prevent skin pinching',
      'Pair of two pieces included'
    ],
    careInstructions: [
      'Wipe with a soft cotton cloth after daily wear; keep in pouch'
    ],
    specifications: {
      'Quantity': 'Set of 2 Bangles',
      'Plating': '1 Gram Real Gold Forming',
      'Base Metal': 'Heavy Brass Core',
      'Width': '8 mm',
      'Color': '22K Authentic Indian Gold'
    },
    reviews: [
      {
        id: 'rev-06',
        author: 'Sunita Patel',
        rating: 5,
        date: 'January 19, 2026',
        title: 'Substantial weight and real gold feel',
        comment: 'They don’t feel cheap or hollow like ordinary imitation bangles. The weight and shine match my original gold bangles perfectly.',
        verified: true,
        productVariant: '2.6 (Medium)'
      }
    ]
  },
  {
    id: 'vel-006',
    name: 'Bridal Polki & Jadau Choker Necklace with Earrings',
    slug: 'bridal-polki-jadau-choker-set',
    price: 3299,
    originalPrice: 5999,
    category: 'Necklaces',
    collection: 'Bridal Collection',
    material: 'Kundan & Meenakari',
    description: 'A showstopping royal bridal choker ensemble featuring open-set Polki stones, vibrant emerald-green hydro bead drops, and matching statement earrings. Perfect for brides, bridesmaids, and grand Indian receptions.',
    shortDescription: 'Grand bridal Polki Kundan choker with green drops and matching jhumkas.',
    images: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['Adjustable Golden Dori'],
    rating: 5.0,
    reviewCount: 22,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    inStock: true,
    gemstone: 'Polki Glass Stones, Hydro Emerald Drops & Pearl Tassels',
    karat: '1 Gram Gold Forming',
    dimensions: 'Choker height: 5.8cm | Earrings length: 6.5cm',
    details: [
      'Includes 1 Grand Choker and 1 Pair of Matching Earrings',
      'Multi-tiered emerald bead drops with delicate cluster work',
      'Micro-lacquer coating prevents gold fading or tarnish'
    ],
    careInstructions: [
      'Store flat in a velvet box; avoid folding or compression'
    ],
    specifications: {
      'Craft': 'Heritage Bikaneri Jadau & Polki',
      'Plating': '1 Gram Gold Forming High Gloss',
      'Stones': 'AAA Polki Kundan & Emerald Hydro Beads'
    },
    reviews: [
      {
        id: 'rev-07',
        author: 'Kavita Joshi',
        rating: 5,
        date: 'February 21, 2026',
        title: 'Breathtaking bridal necklace',
        comment: 'Looked magnificent with my red Sabyasachi-style lehenga. Everyone asked where I bought this real looking set from!',
        verified: true
      }
    ]
  },
  {
    id: 'vel-007',
    name: '1 Gram Gold Forming Mens Royal Bahubali Kada',
    slug: '1-gram-gold-forming-mens-bahubali-kada',
    price: 1199,
    originalPrice: 2199,
    category: 'Bracelets',
    collection: 'Signature Collection',
    material: '1 Gram Gold Forming',
    description: 'A commanding 1 Gram Gold Forming royal Kada designed for men. Features solid lion-head / textured rope architecture with a spring-hinged lock for effortless wearing on any wrist size.',
    shortDescription: 'Heavyweight royal kada for men in 1g micro gold forming.',
    images: [
      'https://images.unsplash.com/photo-1543290954-518482ff7698?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1611591475825-9276c1f76d45?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['Free Size (Spring Hinged Flexible Open)'],
    rating: 4.8,
    reviewCount: 38,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
    gemstone: 'None (Solid Gold Look)',
    karat: '1 Gram 24K Gold Forming',
    dimensions: 'Thickness: 9mm | Weight: 42g',
    details: [
      'Rugged brass core with micro 1 gram 24K gold forming polish',
      'Hinged clasp mechanism with secure click lock',
      'Waterproof and sweat-resistant daily wear durability'
    ],
    careInstructions: [
      'Wipe with dry cloth after daily use'
    ],
    specifications: {
      'Audience': 'Men / Unisex Heritage',
      'Plating': '1 Gram 24K Micro Gold Forming',
      'Base': 'Pure Solid Brass Alloy',
      'Weight': '42 Grams'
    },
    reviews: [
      {
        id: 'rev-08',
        author: 'Rohit Singhania',
        rating: 5,
        date: 'February 05, 2026',
        title: 'Very solid and masculine',
        comment: 'The weight is incredible and the gold tone matches my 22k gold chain exactly. Top quality product.',
        verified: true
      }
    ]
  },
  {
    id: 'vel-008',
    name: 'Sparkling American Diamond (AD) Tennis Bracelet',
    slug: 'sparkling-ad-tennis-bracelet',
    price: 999,
    originalPrice: 1799,
    category: 'Bracelets',
    collection: 'Everyday Elegance',
    material: 'American Diamond (AD)',
    description: 'A timeless continuous line of prong-set brilliant round American Diamonds (CZ) that glimmers with unmatched scintillation. Equipped with a dual safety clasp in rose gold or yellow gold finish.',
    shortDescription: 'Prong-set American Diamond tennis bracelet with dual safety lock.',
    images: [
      'https://images.unsplash.com/photo-1611591475825-9276c1f76d45?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1543290954-518482ff7698?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['6.5 Inches', '7.0 Inches', '7.5 Inches'],
    rating: 4.9,
    reviewCount: 45,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
    gemstone: 'Round Cut AAA+ American Diamonds',
    karat: '1 Gram Rose Gold / Yellow Gold Polish',
    dimensions: 'Width: 3.5mm',
    details: [
      'Individually prong-set cubic zirconia stones that never fall out',
      'Box clasp with dual fold-over safety latches',
      'Ultra-flexible link design that drapes comfortably around wrist'
    ],
    careInstructions: [
      'Avoid contact with creams and perfumes to maintain diamond clarity'
    ],
    specifications: {
      'Stone Type': 'AAA+ Cubic Zirconia / AD',
      'Plating': '1 Gram Gold / Rhodium / Rose Gold',
      'Base': 'Skin-Safe Hypoallergenic Brass'
    },
    reviews: [
      {
        id: 'rev-09',
        author: 'Tanya Malhotra',
        rating: 5,
        date: 'January 28, 2026',
        title: 'Pure diamond shine',
        comment: 'Wore it for an anniversary dinner and was showered with compliments. It looks like a ₹2 lakh real diamond bracelet!',
        verified: true,
        productVariant: '7.0 Inches'
      }
    ]
  },
  {
    id: 'vel-009',
    name: 'Antique Matte Gold Lakshmi Temple Haram (Long Necklace)',
    slug: 'antique-matte-gold-lakshmi-temple-haram',
    price: 2899,
    originalPrice: 4899,
    category: '1 Gram Gold Forming',
    collection: 'Bridal Collection',
    material: 'Antique Matte Gold',
    description: 'A traditional South Indian long necklace (Haram) crafted in authentic 1 Gram Matte Gold Forming. Features elaborate Kasu coin motifs and a magnificent Goddess Lakshmi pendant accented with ruby-pink stones.',
    shortDescription: 'Grand 1g gold forming temple long necklace with Kasu motifs.',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['26 Inches Long + Adjustable Dori'],
    rating: 4.9,
    reviewCount: 31,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
    gemstone: 'Synthetic Kemp Rubies & Emerald Accents',
    karat: '1 Gram Matte Gold Forming',
    dimensions: 'Length: 26 inches | Pendant: 6.5cm x 5cm',
    details: [
      'Traditional South Indian Kasu Mala coin design with Lakshmi motifs',
      'Rich antique matte gold polish mimicking heritage South Indian temple jewellery',
      'Includes matching temple stud earrings'
    ],
    careInstructions: [
      'Store in a plastic container with silica gel to prevent atmospheric oxidation'
    ],
    specifications: {
      'Category': 'Temple Haram Long Chain',
      'Plating': '1 Gram Matte Gold Forming',
      'Stones': 'High-Grade Kemp Stones'
    },
    reviews: [
      {
        id: 'rev-10',
        author: 'Lakshmi Narayanan',
        rating: 5,
        date: 'February 12, 2026',
        title: 'Authentic South Indian temple finish',
        comment: 'Wore it with my Kanjivaram saree for Varalakshmi pooja. Perfect matte antique finish, totally indistinguishable from real gold.',
        verified: true
      }
    ]
  },
  {
    id: 'vel-010',
    name: '1 Gram Gold Daily Wear Rope Chain (24 inch)',
    slug: '1-gram-gold-daily-wear-rope-chain',
    price: 799,
    originalPrice: 1499,
    category: '1 Gram Gold Forming',
    collection: 'Everyday Elegance',
    material: '1 Gram Gold Forming',
    description: 'A classic 24-inch twisted rope chain micro-plated in 1 Gram 24K real gold forming. Features anti-tarnish and water-resistant coating, perfect for daily wear with or without pendants.',
    shortDescription: '24-inch 1g micro gold forming twisted rope chain for daily wear.',
    images: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['20 Inches', '24 Inches', '28 Inches'],
    rating: 4.8,
    reviewCount: 77,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
    gemstone: 'None (Solid Chain)',
    karat: '1 Gram 24K Gold Forming',
    dimensions: 'Thickness: 3mm | Length: 24 inches',
    details: [
      'Precision machine-twisted links for maximum tensile strength',
      'Micro 1 Gram 24K Gold plating with sweat-proof anti-tarnish coating',
      'Sturdy lobster claw clasp that won’t accidentally open'
    ],
    careInstructions: [
      'Suitable for daily wear; wipe dry after coming in contact with water'
    ],
    specifications: {
      'Pattern': 'Twisted Rope Chain',
      'Plating': '1 Gram 24K Gold Forming',
      'Clasp': 'Heavy-Duty Lobster Clasp',
      'Length': '24 Inches'
    },
    reviews: [
      {
        id: 'rev-11',
        author: 'Arun Kumar',
        rating: 5,
        date: 'January 08, 2026',
        title: 'Daily wear chain for over 2 months, zero fading',
        comment: 'I wear this every day to the gym and work. Color is completely intact and it has a very rich 22k shine.',
        verified: true,
        productVariant: '24 Inches'
      }
    ]
  },
  {
    id: 'vel-011',
    name: 'Ruby & Emerald Studded 1 Gram Gold Jhumkas',
    slug: 'ruby-emerald-1-gram-gold-jhumkas',
    price: 749,
    originalPrice: 1399,
    category: 'Earrings',
    collection: 'Signature Collection',
    material: '1 Gram Gold Forming',
    description: 'Classic bell-shaped Jhumka earrings crafted in 1 Gram Gold Forming with floral ear studs and dangling golden ghungroo beads. Accented with vibrant synthetic ruby and emerald stones.',
    shortDescription: 'Traditional bell jhumkas with ruby-emerald stones and gold ghungroos.',
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['One Size (Push Back)'],
    rating: 4.9,
    reviewCount: 41,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
    gemstone: 'Synthetic Rubies & Emeralds',
    karat: '1 Gram 24K Gold Forming',
    dimensions: 'Length: 4.8cm | Width: 2.2cm',
    details: [
      '1 Gram Gold forming with authentic 22K yellow finish',
      'Delicate acoustic chime ghungroo beads at the base',
      'Comfortable push-back post with silicone support pad'
    ],
    careInstructions: [
      'Store in dry place away from sprays and moisture'
    ],
    specifications: {
      'Style': 'Traditional Indian Jhumki',
      'Plating': '1 Gram Gold Forming',
      'Base': 'Pure Brass Core'
    },
    reviews: [
      {
        id: 'rev-12',
        author: 'Shalini Gupta',
        rating: 5,
        date: 'February 15, 2026',
        title: 'Must have for Diwali and family functions',
        comment: 'Beautiful sound from the ghungroos and the gold polish is exceptional. Better quality than local market imitation.',
        verified: true
      }
    ]
  },
  {
    id: 'vel-012',
    name: 'Rose Gold Plated CZ Butterfly Pendant with Chain',
    slug: 'rose-gold-cz-butterfly-pendant-set',
    price: 599,
    originalPrice: 1199,
    category: 'Pendants',
    collection: 'Minimal Collection',
    material: 'Rose Gold Polish',
    description: 'A whimsical and contemporary butterfly talisman paved with micro-faceted CZ crystals in a blushing rose gold polish. Comes with an 18-inch delicate box chain with a 2-inch extender.',
    shortDescription: 'Delicate butterfly pendant paved with CZ crystals on rose gold chain.',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['18 Inch Chain + 2 Inch Extender'],
    rating: 4.8,
    reviewCount: 34,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    inStock: true,
    gemstone: 'Micro-Pavé AAA Cubic Zirconia',
    karat: 'Rose Gold Micro Plating',
    dimensions: 'Pendant: 1.5cm x 1.4cm',
    details: [
      'High-grade anti-tarnish rose gold plating',
      'Micro-pavé setting for maximum diamond-like glitter',
      'Includes matching 18k rose gold plated box chain'
    ],
    careInstructions: [
      'Wipe with a clean micro-fiber cloth'
    ],
    specifications: {
      'Stone': 'Micro Pavé CZ',
      'Plating': 'Rose Gold Anti-Tarnish',
      'Base': 'Skin-Safe Copper Alloy'
    },
    reviews: [
      {
        id: 'rev-13',
        author: 'Sneha Roy',
        rating: 5,
        date: 'February 19, 2026',
        title: 'Super cute for western wear and gifting',
        comment: 'The rose gold color is so delicate and modern. Pairs beautifully with dresses and casual shirts.',
        verified: true
      }
    ]
  },
  {
    id: 'vel-013',
    name: 'Meenakari Handcrafted Floral Adjustable Ring',
    slug: 'meenakari-handcrafted-floral-adjustable-ring',
    price: 499,
    originalPrice: 899,
    category: 'Rings',
    collection: 'Festive Collection',
    material: 'Kundan & Meenakari',
    description: 'An artistic blooming lotus cocktail ring painted by master artisans using centuries-old Jaipur Meenakari enameling. Features a central Kundan crystal and an adjustable shank fitting all finger sizes comfortably.',
    shortDescription: 'Jaipur Meenakari enamelled cocktail ring with central Kundan stone.',
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['Adjustable (Fits Sizes 10 to 20)'],
    rating: 4.7,
    reviewCount: 28,
    isNew: false,
    isBestSeller: false,
    isFeatured: true,
    inStock: true,
    gemstone: 'Faceted Glass Kundan',
    karat: '1 Gram Gold Forming',
    dimensions: 'Diameter: 2.8cm',
    details: [
      'Vibrant hand-painted enameling in royal pink and green',
      'Adjustable band allows wearing on index, middle, or ring finger',
      '1 Gram Gold Forming rim with beaded pearl borders'
    ],
    careInstructions: [
      'Keep away from sanitizers and water to preserve enamel luster'
    ],
    specifications: {
      'Style': 'Jaipuri Meenakari Cocktail Ring',
      'Plating': '1 Gram Gold Forming',
      'Fit': 'Universal Adjustable'
    },
    reviews: [
      {
        id: 'rev-14',
        author: 'Geeta M.',
        rating: 5,
        date: 'January 30, 2026',
        title: 'Stunning colors and craftsmanship',
        comment: 'Looks like high-end designer jewellery from FabIndia or Amrapali but at a fraction of the cost.',
        verified: true
      }
    ]
  },
  {
    id: 'vel-014',
    name: 'South Indian Matte 1 Gram Gold Forming Vanki / Bajuband',
    slug: 'south-indian-matte-1-gram-gold-vanki',
    price: 1299,
    originalPrice: 2299,
    category: '1 Gram Gold Forming',
    collection: 'Bridal Collection',
    material: 'Antique Matte Gold',
    description: 'A traditional V-shaped armlet (Vanki/Bajuband) worn by South Indian brides. Engraved with peacock motifs in 1 Gram Matte Gold Forming, with adjustable chain extension for secure upper-arm placement.',
    shortDescription: 'Bridal peacock Vanki armlet in 1g antique matte gold forming.',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['Adjustable Armlet with Extension Chain'],
    rating: 4.9,
    reviewCount: 19,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    inStock: true,
    gemstone: 'Hydro Ruby & Emerald Accents',
    karat: '1 Gram Matte Gold Forming',
    dimensions: 'Crown height: 4.2cm | Adjustable band',
    details: [
      'Classic inverted V-shape for comfortable upper arm grip',
      'Intricate peacock carvings with ruby eyes and floral scrollwork',
      'Antique South Indian matte finish matching traditional Kanjivaram silk'
    ],
    careInstructions: [
      'Store wrapped in soft muslin cloth'
    ],
    specifications: {
      'Type': 'Bridal Vanki / Armlet (Bajuband)',
      'Plating': '1 Gram Matte Gold Forming',
      'Base Metal': 'Brass Alloy'
    },
    reviews: [
      {
        id: 'rev-15',
        author: 'Swathi Reddy',
        rating: 5,
        date: 'February 03, 2026',
        title: 'Perfect bridal armlet',
        comment: 'Fits comfortably on the arm without slipping. The matte antique finish looked rich and grand in wedding photos.',
        verified: true
      }
    ]
  },
  {
    id: 'vel-015',
    name: 'Festive Peacock Kundan Matha Patti / Maang Tikka',
    slug: 'peacock-kundan-matha-patti-maang-tikka',
    price: 849,
    originalPrice: 1599,
    category: '1 Gram Gold Forming',
    collection: 'Festive Collection',
    material: 'Kundan & Meenakari',
    description: 'An imperial headpiece featuring a central peacock Kundan pendant with side hair chains adorned with pearl drops. Designed with secure hair hooks for easy placement on bridal hairstyles.',
    shortDescription: 'Peacock Kundan Maang Tikka with pearl side chains for weddings.',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['Free Size (Hair Hook Fastening)'],
    rating: 4.8,
    reviewCount: 26,
    isNew: false,
    isBestSeller: false,
    isFeatured: true,
    inStock: true,
    gemstone: 'Kundan Stones & Seed Pearls',
    karat: '1 Gram Gold Forming',
    dimensions: 'Center Tikka: 4cm | Side chains: 14cm each',
    details: [
      'Lightweight construction prevents pulling on bridal hairstyle',
      'Gold forming finish with hand-set Kundan crystals and pearl tassels'
    ],
    careInstructions: [
      'Keep away from hairspray and cosmetics'
    ],
    specifications: {
      'Item': 'Bridal Matha Patti / Maang Tikka',
      'Plating': '1 Gram Gold Forming',
      'Stones': 'Polki Kundan & Seed Pearls'
    },
    reviews: [
      {
        id: 'rev-16',
        author: 'Harpreet Kaur',
        rating: 5,
        date: 'January 15, 2026',
        title: 'Looked gorgeous on my Anand Karaj day',
        comment: 'Very easy to hook into hair and stayed secure throughout the ceremony. The finish is royal.',
        verified: true
      }
    ]
  },
  {
    id: 'vel-016',
    name: '1 Gram Gold Forming Daily Wear Stud Earrings',
    slug: '1-gram-gold-forming-daily-wear-studs',
    price: 449,
    originalPrice: 799,
    category: 'Earrings',
    collection: 'Everyday Elegance',
    material: '1 Gram Gold Forming',
    description: 'Minimalist floral button stud earrings forged in 1 Gram Gold Forming with a solitary sparkling CZ center. Designed for sensitive ears with hypoallergenic surgical post backs.',
    shortDescription: 'Petite 1g gold forming floral studs with center CZ crystal.',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['Standard Pierced (Bombat Screw Back)'],
    rating: 4.9,
    reviewCount: 68,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
    gemstone: 'Prong-set American Diamond (CZ)',
    karat: '1 Gram 24K Gold Forming',
    dimensions: 'Diameter: 8mm',
    details: [
      'Authentic traditional South Indian bombat screw back for secure fit',
      'Skin-safe pure brass base with 1 Gram 24K Gold Forming',
      'Waterproof and anti-tarnish for non-stop everyday wear'
    ],
    careInstructions: [
      'Wipe with dry cloth periodically'
    ],
    specifications: {
      'Backing': 'Traditional South Indian Bombat Screw',
      'Plating': '1 Gram 24K Gold Forming',
      'Diameter': '8 mm',
      'Allergy Free': '100% Lead, Nickel & Cadmium Free'
    },
    reviews: [
      {
        id: 'rev-17',
        author: 'Bhavna Dave',
        rating: 5,
        date: 'February 22, 2026',
        title: 'No itching, pure gold look',
        comment: 'My ears normally react to cheap imitation metals within hours, but these 1 gram gold studs caused zero allergy. Very happy!',
        verified: true
      }
    ]
  }
];
