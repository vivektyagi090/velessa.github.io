import { Product } from '../types/product';

export const PRODUCTS: Product[] = [
  {
    id: 'vel-001',
    name: 'Aurelia 18k Champagne Diamond Solitaire',
    slug: 'aurelia-champagne-diamond-solitaire',
    price: 1450,
    originalPrice: 1680,
    category: 'Rings',
    collection: 'Signature Collection',
    material: '18k Yellow Gold',
    description: 'An ode to classical romanticism, the Aurelia features a hand-selected 1.5-carat brilliant lab-grown diamond elevated upon our signature low-profile knife-edge band. Hand-polished to a silken mirror finish in 18k solid champagne gold.',
    shortDescription: '1.5ct brilliant solitaire set in handcrafted 18k solid champagne gold.',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1543290954-518482ff7698?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['US 5', 'US 6', 'US 7', 'US 8', 'US 9'],
    rating: 4.9,
    reviewCount: 42,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
    gemstone: 'VS1 Lab-Grown Diamond (1.50 ct, Color E)',
    karat: '18k Solid Gold',
    dimensions: 'Band width: 1.8mm | Setting height: 5.4mm',
    details: [
      'Handcrafted in recycled 18k solid champagne gold',
      '1.50 Carat Round Brilliant Diamond (Ideal Cut, E Color, VS1 Clarity)',
      'Subtle ergonomic comfort-fit interior shank',
      'Accompanied by IGI Diamond Certificate & Velessa Atelier Vault Box'
    ],
    careInstructions: [
      'Store individually in your velvet Velessa travel pouch',
      'Clean gently using warm water, mild fragrance-free soap, and an ultra-soft bristle brush',
      'Avoid contact with chlorine, perfumes, hand sanitizers, and abrasive surfaces'
    ],
    specifications: {
      'Metal': '18k Solid Champagne Gold (750 hallmark)',
      'Center Stone': 'Round Brilliant Diamond',
      'Stone Weight': '1.50 Carats',
      'Color Grade': 'E (Colorless)',
      'Clarity': 'VS1 (Very Slightly Included)',
      'Band Width': '1.8 mm',
      'Origin': 'Handcrafted in Milan Atelier'
    },
    reviews: [
      {
        id: 'rev-01',
        author: 'Sarah M.',
        rating: 5,
        date: 'February 14, 2026',
        title: 'Breathtaking light refraction',
        comment: 'Photos cannot capture the intense fire this ring produces in natural sunlight. Sizing was true to chart and customer concierge was extraordinary.',
        verified: true,
        productVariant: '18k Yellow Gold / US 6'
      },
      {
        id: 'rev-02',
        author: 'Christian D.',
        rating: 5,
        date: 'January 28, 2026',
        title: 'The perfect proposal ring',
        comment: 'My fiancée was brought to tears. The packaging alone is high art. Exquisite craftsmanship in every detail.',
        verified: true,
        productVariant: '18k Yellow Gold / US 7'
      }
    ]
  },
  {
    id: 'vel-002',
    name: 'Lumina Fluid Herringbone Choker',
    slug: 'lumina-fluid-herringbone-choker',
    price: 890,
    originalPrice: 980,
    category: 'Necklaces',
    collection: 'Everyday Elegance',
    material: '18k Yellow Gold',
    description: 'Silken, liquid-like gold that cascades flush against the collarbone. The Lumina Choker is engineered from interlocking chevron plates that capture ambient light with every subtle movement.',
    shortDescription: 'Liquid 18k gold herringbone chain engineered to drape flush against the neck.',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['14 inch + 2" extender', '16 inch + 2" extender', '18 inch'],
    rating: 4.8,
    reviewCount: 38,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
    karat: '18k Solid Gold',
    dimensions: 'Chain width: 4.2mm | Thickness: 0.9mm',
    details: [
      'Flexible chevron link articulation prevents kinks and twists',
      'Custom Velessa oval lobster clasp with security latch',
      'Subtle satin-brushed underside for sensory skin comfort'
    ],
    careInstructions: [
      'Lay flat when stored to maintain fluid alignment',
      'Polish with supplied microfiber flannel cloth'
    ],
    specifications: {
      'Metal': '18k Solid Yellow Gold',
      'Finish': 'Mirror Polish Front / Satin Underside',
      'Clasp': 'Handmade Lobster Clasp',
      'Chain Width': '4.2 mm',
      'Weight': '14.8 grams'
    }
  },
  {
    id: 'vel-003',
    name: 'Seraphina South Sea Pearl Drops',
    slug: 'seraphina-south-sea-pearl-drops',
    price: 760,
    originalPrice: undefined,
    category: 'Earrings',
    collection: 'Bridal Collection',
    material: '18k Yellow Gold',
    description: 'Lustrous, AAA-grade baroque Australian South Sea pearls suspended from pavé diamond-encrusted organic golden branches. Each pearl is organic and completely unique in natural contours.',
    shortDescription: 'Luminous baroque South Sea pearls dancing beneath 0.25ct diamond pavé branches.',
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['Standard Drop (32mm)'],
    rating: 5.0,
    reviewCount: 29,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    inStock: true,
    gemstone: 'Natural South Sea Baroque Pearls (11-12mm)',
    karat: '18k Solid Gold',
    dimensions: 'Drop length: 32mm | Pearl diameter: approx 11.5mm',
    details: [
      'Hand-matched pair for harmonious luster and overtone reflection',
      '0.28 Carats total weight round brilliant natural accent diamonds',
      'Secure push-back posts with silicone-lined luxury clutches'
    ],
    careInstructions: [
      'Pearls are organic gems: put on after applying perfume and hairspray',
      'Wipe with a damp cloth after each wear'
    ],
    specifications: {
      'Pearl Type': 'Cultured South Sea Pearl (Australian origin)',
      'Metal': '18k Yellow Gold',
      'Accent Diamonds': '0.28 ctw (F-G, VS)',
      'Backing': 'Friction Post with Comfort Clutch'
    }
  },
  {
    id: 'vel-004',
    name: 'Valeria Bezel Diamond Tennis Bracelet',
    slug: 'valeria-bezel-diamond-tennis-bracelet',
    price: 2150,
    originalPrice: 2450,
    category: 'Bracelets',
    collection: 'Signature Collection',
    material: '18k White Gold',
    description: 'A modern reinvention of the classic tennis silhouette. Individually bezel-set round brilliant diamonds create an unbroken river of diamond brilliance, eliminating snagging prongs for continuous wear.',
    shortDescription: 'Modern bezel-set 3.0ct diamond tennis bracelet in 18k white gold.',
    images: [
      'https://images.unsplash.com/photo-1611591475825-9276c1f76d45?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['6.5 inches', '7.0 inches', '7.5 inches'],
    rating: 4.9,
    reviewCount: 54,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
    gemstone: '3.00 ctw Lab-Grown Diamonds (Color F, Clarity VS)',
    karat: '18k Solid White Gold',
    dimensions: 'Width: 3.2mm | Thickness: 2.4mm',
    details: [
      '3.00 total carats of high-precision cut diamonds',
      'Architectural bezel setting eliminates snagging on knitwear and silks',
      'Double-safety invisible tongue and groove clasp mechanism'
    ],
    careInstructions: [
      'Submerge in warm soapy water and clean with soft brush periodically',
      'Check safety clasp snap annually at an authorized jeweller'
    ],
    specifications: {
      'Total Carat Weight': '3.00 ctw',
      'Metal': '18k Solid White Gold (Rhodium plated)',
      'Closure': 'Concealed Box Clasp with Dual Figure-8 Safeties',
      'Stone Count': '48 stones (based on 7-inch length)'
    }
  },
  {
    id: 'vel-005',
    name: 'Velessa Royal Torque Bangle',
    slug: 'velessa-royal-torque-bangle',
    price: 1320,
    originalPrice: undefined,
    category: 'Bangles',
    collection: 'Statement Jewellery',
    material: '18k Yellow Gold',
    description: 'Sculpted with commanding elegance. This open torque bangle terminates in tapered golden cabochons set with inverted micro-diamonds. Weighted with substantial gold heft for an unmistakably opulent wrist feel.',
    shortDescription: 'Heavyweight sculpted 18k gold open torque cuff with diamond terminals.',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['Small (fits wrists up to 6.0")', 'Medium (fits wrists 6.0" - 6.75")', 'Large (fits wrists 6.75" - 7.5")'],
    rating: 4.9,
    reviewCount: 22,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    inStock: true,
    karat: '18k Solid Gold',
    dimensions: 'Thickness: 5.5mm tapering to 8mm terminals',
    details: [
      'Substantial 26.5 gram net gold weight',
      'Inner flex-memory core allows gentle slip-on without metal deformation',
      'Hand-engraved Velessa atelier hallmark inside shank'
    ],
    careInstructions: [
      'Gently wipe clean with chamois leather',
      'Avoid forcing wide flex angles'
    ],
    specifications: {
      'Metal': '18k Solid Yellow Gold',
      'Weight': 'Approx 26.5 grams',
      'Origin': 'Arezzo, Italy'
    }
  },
  {
    id: 'vel-006',
    name: 'Verdant Colombian Emerald Talisman',
    slug: 'verdant-colombian-emerald-talisman',
    price: 1850,
    originalPrice: 2100,
    category: 'Pendants',
    collection: 'Signature Collection',
    material: '18k Yellow Gold',
    description: 'Featuring a vivid 2.2-carat octagonal step-cut Colombian emerald of striking clarity and deep rainforest green. Embraced within an eight-prong yellow gold celestial frame and suspended on an adjustable wheat chain.',
    shortDescription: 'Vivid 2.2ct step-cut Colombian emerald framed in celestial gold prongs.',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['18" adjustable chain (can be worn at 16", 17", 18")'],
    rating: 5.0,
    reviewCount: 16,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
    gemstone: 'Natural Colombian Emerald (2.20 ct)',
    karat: '18k Solid Gold',
    dimensions: 'Pendant size: 14mm x 11mm | Chain thickness: 1.2mm',
    details: [
      'Ethically sourced Colombian emerald with minor cedarwood oil treatment',
      'Surrounded by 12 brilliant pavé diamonds (0.16 ctw)',
      'Includes custom 18k diamond-cut wheat link chain'
    ],
    careInstructions: [
      'Never subject emeralds to ultrasonic or steam cleaners',
      'Clean exclusively with mild soapy lukewarm water and a lint-free cloth'
    ],
    specifications: {
      'Center Gemstone': 'Natural Octagon Step-Cut Emerald',
      'Carat Weight': '2.20 Carats',
      'Accents': '0.16 ctw VS/G Diamonds',
      'Metal': '18k Solid Gold'
    }
  },
  {
    id: 'vel-007',
    name: 'Celeste Diamond Eternity Band',
    slug: 'celeste-diamond-eternity-band',
    price: 980,
    originalPrice: undefined,
    category: 'Rings',
    collection: 'Bridal Collection',
    material: 'Platinum 950',
    description: 'A continuous loop of perfection. Each round brilliant diamond is cradled in shared micro-prongs for maximized light entry and an uninterrupted ribbon of fire along your finger.',
    shortDescription: 'Unbroken eternity ring set with 1.20ctw scintillating brilliant diamonds.',
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['US 5', 'US 6', 'US 7', 'US 8'],
    rating: 4.9,
    reviewCount: 67,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
    gemstone: '1.20 ctw Round Brilliant Diamonds (DEF, VVS-VS)',
    karat: 'Platinum 950',
    dimensions: 'Band width: 2.2mm | Band height: 1.9mm',
    details: [
      'Crafted in hypoallergenic high-density 950 Platinum',
      'Low profile setting engineered to pair seamlessly beside engagement solitaires',
      'Comfort-fit curved interior edge'
    ],
    careInstructions: [
      'Safe for regular ultrasonic cleaning',
      'Rinse thoroughly and pat dry with chamois'
    ],
    specifications: {
      'Metal': 'Platinum 950 (95% pure platinum)',
      'Diamond Weight': '1.20 ctw',
      'Setting': 'Shared Micro-Prong',
      'Profile': 'Low Stacking Profile'
    }
  },
  {
    id: 'vel-008',
    name: 'Astrid Diamond Tennis Collarette',
    slug: 'astrid-diamond-tennis-collarette',
    price: 3850,
    originalPrice: 4200,
    category: 'Necklaces',
    collection: 'Statement Jewellery',
    material: '18k White Gold',
    description: 'The pinnacle of high jewellery drama. 6.5 carats of calibrated graduated diamonds that rest effortlessly around the collarbone, graduating gracefully toward a commanding center stone.',
    shortDescription: 'Graduated 6.5ctw diamond necklace resting gracefully along the clavicle.',
    images: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['16 inches', '17.5 inches'],
    rating: 5.0,
    reviewCount: 11,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    inStock: true,
    gemstone: '6.50 ctw Ideal Cut Diamonds (Color E-F, Clarity VVS)',
    karat: '18k Solid White Gold',
    dimensions: 'Necklace length: 16" | Center diameter: 5.2mm',
    details: [
      'Precision calibrated graduation for flawless silhouette posture',
      'Hand-cast 18k articulated basket mounts that never flip',
      'Concealed tension-lock clasp with dual safety catches'
    ],
    careInstructions: [
      'Store flat in custom wooden presentation chest',
      'Annual inspection included with Velessa Concierge Service'
    ],
    specifications: {
      'Carat Weight': '6.50 ctw',
      'Metal': '18k White Gold',
      'Stone Count': '112 Diamonds',
      'Certificate': 'IGI Certified Suite'
    }
  },
  {
    id: 'vel-009',
    name: 'Nova Diamond Micro-Pavé Huggies',
    slug: 'nova-diamond-micro-pave-huggies',
    price: 420,
    originalPrice: 490,
    category: 'Earrings',
    collection: 'Minimal Collection',
    material: '18k Rose Gold',
    description: 'The definitive daily luxury. Delicate hoops blanketed inside and out with triple rows of microscopic diamonds that sparkle from every perspective.',
    shortDescription: 'Everyday 18k rose gold huggies blanketed inside and out with sparkling diamonds.',
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['11mm Outer Diameter', '14mm Outer Diameter'],
    rating: 4.8,
    reviewCount: 89,
    isNew: false,
    isBestSeller: true,
    isFeatured: false,
    inStock: true,
    gemstone: '0.35 ctw Round Diamonds',
    karat: '18k Rose Gold',
    dimensions: 'Outer diameter: 12mm | Width: 2.1mm',
    details: [
      'Inside-out diamond arrangement for continuous radiance',
      'Crisp snap-closure mechanism with audible click',
      'Ultra-comfortable for sleep or active lifestyles'
    ],
    careInstructions: [
      'Ultrasonic safe',
      'Wipe with flannel jewellery cloth'
    ],
    specifications: {
      'Metal': '18k Solid Rose Gold',
      'Diamonds': '0.35 ctw (F-G, VS)',
      'Hinge': 'Swiss Click Hinge'
    }
  },
  {
    id: 'vel-010',
    name: 'Siren Sculptural Signet Ring',
    slug: 'siren-sculptural-signet-ring',
    price: 680,
    originalPrice: undefined,
    category: 'Rings',
    collection: 'Statement Jewellery',
    material: '18k Yellow Gold',
    description: 'An architectural reinterpretation of vintage heirloom crests. Features an undulating asymmetrical crown with satin-brushed face and high-gloss mirror beveled edges.',
    shortDescription: 'Fluid organic signet ring hand-carved in substantial 18k solid gold.',
    images: [
      'https://images.unsplash.com/photo-1543290954-518482ff7698?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['US 5', 'US 6', 'US 7', 'US 8', 'US 9', 'US 10'],
    rating: 4.7,
    reviewCount: 19,
    isNew: true,
    isBestSeller: false,
    isFeatured: false,
    inStock: true,
    karat: '18k Solid Gold',
    dimensions: 'Face width: 13mm | Shank base: 3.5mm',
    details: [
      'Comfort-fit solid back (not hollowed)',
      'Suitable for custom laser monogram engraving upon request',
      'Weighted luxury feel (approx. 9.2g)'
    ],
    careInstructions: [
      'Polish with dry microfiber cloth',
      'Avoid harsh impacts against stone or metal counters'
    ],
    specifications: {
      'Metal': '18k Yellow Gold',
      'Finish': 'Satin Top Face, High Polish Edges',
      'Weight': '9.2 grams'
    }
  },
  {
    id: 'vel-011',
    name: 'Ondine Twisted Cable Chain Bracelet',
    slug: 'ondine-twisted-cable-chain-bracelet',
    price: 540,
    originalPrice: 620,
    category: 'Bracelets',
    collection: 'Everyday Elegance',
    material: '18k Yellow Gold',
    description: 'A tactile masterpiece of interwoven helix links. Catches daylight with shimmering golden highlights and adds essential texture to any wrist stack.',
    shortDescription: 'Sculpted helix gold links providing rich tactile texture and shine.',
    images: [
      'https://images.unsplash.com/photo-1611591475825-9276c1f76d45?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['6.5 inches', '7.0 inches', '7.5 inches'],
    rating: 4.9,
    reviewCount: 31,
    isNew: false,
    isBestSeller: false,
    isFeatured: true,
    inStock: true,
    karat: '18k Solid Gold',
    dimensions: 'Chain thickness: 3.8mm',
    details: [
      'Solid link construction ensures everlasting tensile strength',
      'Ergonomic swivel clasp prevents bracelet entanglement',
      'Handcrafted in Tuscany'
    ],
    careInstructions: [
      'Rinse with warm mild soapy water',
      'Store flat in velvet case'
    ],
    specifications: {
      'Metal': '18k Solid Gold',
      'Closure': 'Custom Oval Swivel Clasp',
      'Weight': '8.5 grams'
    }
  },
  {
    id: 'vel-012',
    name: 'Aegis Diamond Pavé Hinged Bangle',
    slug: 'aegis-diamond-pave-hinged-bangle',
    price: 1780,
    originalPrice: 1950,
    category: 'Bangles',
    collection: 'Signature Collection',
    material: '18k Rose Gold',
    description: 'A sleek, oval-profile bangle crafted to mimic the natural contour of the wrist. One hemisphere features channel-set pavé diamonds while the other showcases mirror-finished rose gold.',
    shortDescription: 'Contoured oval hinged bangle with 1.05ctw channel pavé diamonds.',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1611591475825-9276c1f76d45?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['Small (16cm circumference)', 'Medium (17.5cm circumference)', 'Large (19cm circumference)'],
    rating: 5.0,
    reviewCount: 27,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
    gemstone: '1.05 ctw Round Brilliant Diamonds (F-G, VS)',
    karat: '18k Rose Gold',
    dimensions: 'Width: 4.0mm | Profile height: 2.6mm',
    details: [
      'Ergonomic oval silhouette keeps diamonds facing upright',
      'Precision internal hinge and concealed double push-button release',
      'Hand-set micro pavé under 40x microscope'
    ],
    careInstructions: [
      'Clean periodically with soft camel-hair brush and mild suds',
      'Dry with lint-free cloth'
    ],
    specifications: {
      'Metal': '18k Rose Gold',
      'Diamonds': '1.05 ctw',
      'Mechanism': 'Push-button Concealed Box Clasp'
    }
  },
  {
    id: 'vel-013',
    name: 'Medallion of Solstice 18k Pendant',
    slug: 'medallion-of-solstice-18k-pendant',
    price: 620,
    originalPrice: undefined,
    category: 'Pendants',
    collection: 'Minimal Collection',
    material: '18k Yellow Gold',
    description: 'Inspired by ancient Hellenic astronomical instruments. A hand-hammered concave golden disk centered with an eight-pointed star and a sparkling gypsy-set star diamond.',
    shortDescription: 'Hand-hammered celestial disk centered with an 8-point diamond star.',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['18" adjustable box chain (adjusts to 16", 17", 18")'],
    rating: 4.8,
    reviewCount: 41,
    isNew: true,
    isBestSeller: false,
    isFeatured: false,
    inStock: true,
    gemstone: '0.08 ct Star Diamond',
    karat: '18k Solid Gold',
    dimensions: 'Disk diameter: 18mm | Thickness: 1.6mm',
    details: [
      'Hand-hammered organic rim with artisanal variance on every piece',
      'Reverse side mirror-polished and hallmarked',
      'Includes delicate 18k gold adjustable box chain'
    ],
    careInstructions: [
      'Wipe with clean jewellery cloth',
      'Store separate from harder gemstones'
    ],
    specifications: {
      'Metal': '18k Yellow Gold',
      'Diamond': '0.08 ct Natural Diamond',
      'Chain Type': 'Adjustable Box Chain'
    }
  },
  {
    id: 'vel-014',
    name: 'Atelier Sculptural Ribbed Hoops',
    slug: 'atelier-sculptural-ribbed-hoops',
    price: 520,
    originalPrice: 580,
    category: 'Earrings',
    collection: 'Everyday Elegance',
    material: '18k Yellow Gold',
    description: 'Chic, voluminous architectural hoops featuring accordion fluted ribs that play with shadow and sunshine. Hollow-cast using advanced electroforming for weightless comfort on the lobe.',
    shortDescription: 'Voluminous fluted accordion hoops designed for featherlight all-day wear.',
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['Medium (22mm)', 'Large (28mm)'],
    rating: 4.9,
    reviewCount: 35,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
    karat: '18k Solid Gold',
    dimensions: 'Diameter: 24mm | Width: 7.5mm',
    details: [
      'Advanced electroforming creates grand volume without ear pull',
      'Hypoallergenic solid 18k click-top posts',
      'Lustrous mirror and satin dual finish'
    ],
    careInstructions: [
      'Keep away from strong crushing force',
      'Clean with warm water and dry softly'
    ],
    specifications: {
      'Metal': '18k Solid Yellow Gold',
      'Hoop Style': 'Chunky Ribbed Hoop',
      'Weight': 'Featherlight 4.1 grams per pair'
    }
  },
  {
    id: 'vel-015',
    name: 'Helios Sunburst Pavé Ring',
    slug: 'helios-sunburst-pave-ring',
    price: 840,
    originalPrice: 940,
    category: 'Rings',
    collection: 'Festive Collection',
    material: '18k Yellow Gold',
    description: 'An explosive constellation of micro diamonds radiating from a central bezel. Designed as a radiant crown that nests beautifully over solitaire rings or stands alone as an opulent statement.',
    shortDescription: 'Radiant curved sunburst ring set with 0.45ctw tapered diamonds.',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['US 5', 'US 6', 'US 7', 'US 8'],
    rating: 4.8,
    reviewCount: 23,
    isNew: true,
    isBestSeller: false,
    isFeatured: false,
    inStock: true,
    gemstone: '0.45 ctw Baguette & Round Diamonds',
    karat: '18k Solid Gold',
    dimensions: 'Crown height: 6mm | Band width: 1.6mm',
    details: [
      'Alternating baguette and round brilliant diamonds',
      'Curved contour designed for effortless ring stacking',
      'Hand-set micro milgrain detailing along bezel rim'
    ],
    careInstructions: [
      'Clean with gentle soap and water',
      'Do not wear while weight lifting or gardening'
    ],
    specifications: {
      'Metal': '18k Yellow Gold',
      'Diamonds': '0.45 ctw (VS/G)',
      'Style': 'Contoured Crown Band'
    }
  },
  {
    id: 'vel-016',
    name: 'Isolde Baroque Pearl Pendant Necklace',
    slug: 'isolde-baroque-pearl-pendant-necklace',
    price: 690,
    originalPrice: undefined,
    category: 'Necklaces',
    collection: 'Festive Collection',
    material: '18k Yellow Gold',
    description: 'An awe-inspiring freeform baroque flame pearl crowned with a solid gold cap studded with champagne diamonds. Suspended on a diamond-cut cable chain that shimmers like sunlight on water.',
    shortDescription: 'Luminescent baroque flame pearl capped with diamond-studded gold.',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
    ],
    sizes: ['18" Chain with 2" Extender'],
    rating: 5.0,
    reviewCount: 18,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    inStock: true,
    gemstone: 'Natural Australian Baroque Pearl (approx 16-18mm)',
    karat: '18k Solid Gold',
    dimensions: 'Pearl pendant height: approx 22mm',
    details: [
      'One-of-a-kind organic silhouette for every wearer',
      '0.12 ctw Champagne accent diamonds on cap',
      'Heavy gold bail accommodating various chain styles'
    ],
    careInstructions: [
      'Keep isolated from acidic liquids and cosmetics',
      'Wipe with damp silk cloth after wear'
    ],
    specifications: {
      'Pearl': 'Natural Freshwater Flame Pearl',
      'Metal': '18k Solid Gold',
      'Chain': '1.4mm Diamond-cut Cable Chain'
    }
  }
];
