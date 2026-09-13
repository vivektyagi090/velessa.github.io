import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, RefreshCw, Upload, Check, Eye, Package, Plus, Trash2, Star, 
  Ruler, ShieldCheck, Sparkles 
} from 'lucide-react';
import { Product } from '../../types/product';
import { productService, CreateProductInput } from '../../services/productService';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/formatters';
import { Button } from '../common/Button';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (product: Product) => void;
  editProduct?: Product | null;
}

const DEFAULT_CATEGORIES: string[] = [
  '1 Gram Gold Forming',
  'Necklaces',
  'Earrings',
  'Bangles',
  'Mangalsutras',
  'Rings',
  'Bracelets',
  'Pendants',
];

const DEFAULT_METALS: string[] = [
  '1-Gram Gold Forming (High Lustre)',
  '24K Micro Gold Plated',
  'Antique Matte Temple Finish',
  'American Diamond (AD / CZ)',
  'Kundan & Meenakari',
  '925 Sterling Silver Finish',
  'Rose Gold Polish',
  'Dual-Tone Gold & Rhodium',
];

const PRESET_IMAGES = [
  {
    label: 'Kundan Choker',
    url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Gold Jhumkas',
    url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Solitaire Ring',
    url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Bridal Haar Set',
    url: 'https://images.unsplash.com/photo-1611591475819-79b8b730ab8c?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Royal Bangles',
    url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80',
  },
];

export const RING_SIZES = [
  '10 (Indian)',
  '12 (Indian)',
  '14 (Indian)',
  '16 (Indian)',
  '18 (Indian)',
  '20 (Indian)',
  'Adjustable Free Size',
];

export const BANGLE_SIZES = [
  '2.4 (Small)',
  '2.6 (Medium)',
  '2.8 (Large)',
  '2.10 (Extra Large)',
  'Openable Free Size',
];

export const NECKLACE_SIZES = [
  '16 inches (Choker)',
  '18 inches (Princess)',
  '24 inches (Matinee)',
  '30 inches (Long Haar)',
  'Adjustable Dori',
];

export const GENERAL_SIZES = [
  'Adjustable Free Size',
  'Free Size',
  'Standard Size',
];

const getSmartSizesForCategory = (cat: string): string[] => {
  const c = cat.toLowerCase();
  if (c.includes('ring')) {
    return [
      '10 (Indian)',
      '12 (Indian)',
      '14 (Indian)',
      '16 (Indian)',
      '18 (Indian)',
      '20 (Indian)',
      'Adjustable Free Size',
    ];
  }
  if (c.includes('bangle') || c.includes('bracelet')) {
    return [
      '2.4 (Small)',
      '2.6 (Medium)',
      '2.8 (Large)',
      '2.10 (Extra Large)',
      'Openable Free Size',
    ];
  }
  if (c.includes('necklace') || c.includes('haar') || c.includes('mangalsutra') || c.includes('chain')) {
    return [
      '16 inches (Choker)',
      '18 inches (Princess)',
      '24 inches (Matinee)',
      '30 inches (Long Haar)',
      'Adjustable Dori',
    ];
  }
  return [
    '12 (Indian)',
    '14 (Indian)',
    '16 (Indian)',
    '18 (Indian)',
    'Adjustable Free Size',
  ];
};

export const NewProductModal: React.FC<NewProductModalProps> = ({
  isOpen,
  onClose,
  onCreated,
  editProduct,
}) => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Categories list
  const [categoriesList, setCategoriesList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('velessa_custom_categories');
      if (saved) {
        const custom = JSON.parse(saved);
        return Array.from(new Set([...DEFAULT_CATEGORIES, ...custom]));
      }
    } catch {
      // fallback
    }
    return DEFAULT_CATEGORIES;
  });
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Dynamic Metal / Plating list
  const [metalsList, setMetalsList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('velessa_custom_metals');
      if (saved) {
        const custom = JSON.parse(saved);
        return Array.from(new Set([...DEFAULT_METALS, ...custom]));
      }
    } catch {
      // fallback
    }
    return DEFAULT_METALS;
  });
  const [isAddingMetal, setIsAddingMetal] = useState(false);
  const [newMetalName, setNewMetalName] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<string>('1 Gram Gold Forming');
  const [metalType, setMetalType] = useState('1-Gram Gold Forming (High Lustre)');
  const [purity, setPurity] = useState('24K Micro Gold Plated');
  const [grossWeight, setGrossWeight] = useState<number>(18.5);
  const [netWeight, setNetWeight] = useState<number>(16.0);
  const [gemstone, setGemstone] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [basePrice, setBasePrice] = useState<number>(2499);
  const [discountPrice, setDiscountPrice] = useState<number>(1899);
  const [stockQuantity, setStockQuantity] = useState<number>(12);
  const [isFeatured, setIsFeatured] = useState(false);

  // Available Sizes State & Category Tab
  const [selectedSizes, setSelectedSizes] = useState<string[]>(() => [
    '12 (Indian)',
    '14 (Indian)',
    '16 (Indian)',
    '18 (Indian)',
    'Adjustable Free Size',
  ]);
  const [activeSizeTab, setActiveSizeTab] = useState<'ring' | 'bangle' | 'necklace' | 'general' | 'all'>('ring');
  const [customSizeInput, setCustomSizeInput] = useState('');

  // Multiple Images State
  const [images, setImages] = useState<string[]>([PRESET_IMAGES[0].url]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [description, setDescription] = useState(
    'Heirloom handcrafted design with authentic 1-Gram gold forming technology, high-density micro plating, and lifetime polish protection.'
  );

  useEffect(() => {
    if (editProduct) {
      setName(editProduct.name);
      setSku(editProduct.sku || `VLSA-${Math.floor(1000 + Math.random() * 9000)}`);
      setCategory(editProduct.category);
      setMetalType(String(editProduct.material || '1-Gram Gold Forming (High Lustre)'));
      setPurity(editProduct.purity || '24K Micro Gold Plated');
      setGrossWeight(editProduct.grossWeightGrams || 18.5);
      setNetWeight(editProduct.netWeightGrams || 16.0);
      setGemstone(editProduct.gemstone || '');
      setDimensions(editProduct.dimensions || '');
      const hasDiscount = Boolean(editProduct.originalPrice && editProduct.originalPrice > editProduct.price);
      setBasePrice(editProduct.originalPrice || editProduct.price);
      setDiscountPrice(hasDiscount ? editProduct.price : 0);
      setStockQuantity(editProduct.stockQuantity ?? 10);
      setIsFeatured(editProduct.isFeatured || false);
      setImages(editProduct.images && editProduct.images.length > 0 ? editProduct.images : [PRESET_IMAGES[0].url]);
      setDescription(editProduct.description);
      setSelectedSizes(editProduct.sizes && editProduct.sizes.length > 0 ? editProduct.sizes : getSmartSizesForCategory(editProduct.category));
    } else {
      generateNewSku('1 Gram Gold Forming');
      setSelectedSizes(getSmartSizesForCategory('1 Gram Gold Forming'));
    }
  }, [editProduct, isOpen]);

  const generateNewSku = (cat: string) => {
    const cleanCat = cat.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const prefix = (cleanCat.length >= 3 ? cleanCat.substring(0, 3) : 'JWL');
    const random = Math.floor(100 + Math.random() * 900);
    setSku(`VLSA-${prefix}-${random}`);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__ADD_NEW__') {
      setIsAddingCategory(true);
      return;
    }
    setCategory(val);
    if (!editProduct) {
      generateNewSku(val);
      const lower = val.toLowerCase();
      if (lower.includes('ring')) {
        setActiveSizeTab('ring');
        setSelectedSizes(getSmartSizesForCategory(val));
      } else if (lower.includes('bangle') || lower.includes('bracelet')) {
        setActiveSizeTab('bangle');
        setSelectedSizes(getSmartSizesForCategory(val));
      } else if (lower.includes('necklace') || lower.includes('chain') || lower.includes('haar') || lower.includes('mangalsutra')) {
        setActiveSizeTab('necklace');
        setSelectedSizes(getSmartSizesForCategory(val));
      }
    }
  };

  const handleCreateNewCategory = async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    
    if (!categoriesList.includes(trimmed)) {
      const updated = [...categoriesList, trimmed];
      setCategoriesList(updated);
      try {
        localStorage.setItem('velessa_custom_categories', JSON.stringify(updated));
        await productService.createCategory(trimmed);
      } catch {
        // ignore
      }
    }
    setCategory(trimmed);
    generateNewSku(trimmed);
    setSelectedSizes(getSmartSizesForCategory(trimmed));
    setNewCategoryName('');
    setIsAddingCategory(false);
    showToast(`New category "${trimmed}" added and selected!`, 'success', 'Category Created');
  };

  const handleCreateNewMetal = () => {
    const trimmed = newMetalName.trim();
    if (!trimmed) return;
    if (!metalsList.includes(trimmed)) {
      const updated = [...metalsList, trimmed];
      setMetalsList(updated);
      try {
        localStorage.setItem('velessa_custom_metals', JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
    setMetalType(trimmed);
    setNewMetalName('');
    setIsAddingMetal(false);
    showToast(`Custom metal "${trimmed}" added!`, 'success', 'Metal Option Added');
  };

  // Size Handlers
  const toggleSize = (sz: string) => {
    setSelectedSizes((prev) => {
      if (prev.includes(sz)) {
        if (prev.length === 1) {
          showToast('Product must have at least one size option for customers.', 'error');
          return prev;
        }
        return prev.filter((s) => s !== sz);
      } else {
        return [...prev, sz];
      }
    });
  };

  const handleAddCustomSize = () => {
    const trimmed = customSizeInput.trim();
    if (!trimmed) return;
    if (selectedSizes.includes(trimmed)) {
      showToast('This size is already selected.', 'error');
      return;
    }
    setSelectedSizes((prev) => [...prev, trimmed]);
    setCustomSizeInput('');
    showToast(`Size "${trimmed}" added!`, 'success');
  };

  // Image Upload Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const readFiles: Promise<string>[] = Array.from(files).map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readFiles).then((newUrls) => {
      setImages((prev) => {
        const isOnlyPlaceholder = prev.length === 1 && prev[0] === PRESET_IMAGES[0].url;
        return isOnlyPlaceholder ? newUrls : [...prev, ...newUrls];
      });
      showToast(`${newUrls.length} image(s) uploaded from your device!`, 'success', 'Images Uploaded');
    });

    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:')) {
      showToast('Please enter a valid image URL (https://...)', 'error');
      return;
    }
    setImages((prev) => {
      const isOnlyPlaceholder = prev.length === 1 && prev[0] === PRESET_IMAGES[0].url;
      return isOnlyPlaceholder ? [trimmed] : [...prev, trimmed];
    });
    setNewImageUrl('');
    showToast('Image URL added to gallery!', 'success');
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const updated = [...prev];
      const [chosen] = updated.splice(index, 1);
      updated.unshift(chosen);
      return updated;
    });
    showToast('Cover photo updated! Customers see this first.', 'success');
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    showToast('Photo removed', 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter the jewellery piece name.', 'error');
      return;
    }
    if (!sku.trim()) {
      showToast('Please enter or generate an SKU.', 'error');
      return;
    }
    if (basePrice <= 0) {
      showToast('Price must be greater than zero.', 'error');
      return;
    }
    if (images.length === 0) {
      showToast('Please provide at least one product photo.', 'error');
      return;
    }
    if (selectedSizes.length === 0) {
      showToast('Please select at least one available size for customers.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: CreateProductInput = {
        name: name.trim(),
        sku: sku.trim().toUpperCase(),
        description: description.trim(),
        shortDescription: `${purity} | Gross Wt: ${grossWeight}g`,
        basePrice: Number(basePrice),
        discountPrice: Number(discountPrice) > 0 && Number(discountPrice) < Number(basePrice) ? Number(discountPrice) : undefined,
        categoryId: 0,
        categoryName: category.trim(),
        material: metalType,
        purity: purity.trim(),
        grossWeightGrams: Number(grossWeight),
        netWeightGrams: Number(netWeight),
        gemstone: gemstone.trim() || undefined,
        dimensions: dimensions.trim() || undefined,
        sizes: selectedSizes,
        inStock: Number(stockQuantity) > 0,
        stockQuantity: Number(stockQuantity),
        isFeatured: isFeatured,
        imageUrls: images,
      };

      let result: Product;
      if (editProduct) {
        result = await productService.updateProduct(editProduct.id, payload);
        showToast(`"${result.name}" updated successfully with ${selectedSizes.length} sizes!`, 'success', 'Jewellery Updated');
      } else {
        result = await productService.createProduct(payload);
        showToast(`"${result.name}" published live with ${selectedSizes.length} sizes!`, 'success', 'Inventory Added');
      }

      onCreated(result);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save product';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Compute preset pills to offer based on current active tab
  const getCurrentTabSizes = (): string[] => {
    switch (activeSizeTab) {
      case 'ring':
        return RING_SIZES;
      case 'bangle':
        return BANGLE_SIZES;
      case 'necklace':
        return NECKLACE_SIZES;
      case 'general':
        return GENERAL_SIZES;
      case 'all':
      default:
        return Array.from(new Set([...RING_SIZES, ...BANGLE_SIZES, ...NECKLACE_SIZES, ...GENERAL_SIZES, ...selectedSizes]));
    }
  };
  const activeTabSizes = getCurrentTabSizes();

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-charcoal/70 backdrop-blur-xs animate-fade-in font-sans">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-4xl bg-white border border-beige shadow-2xl rounded-sm z-10 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-charcoal text-ivory border-b border-champagne/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-champagne text-charcoal flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg tracking-wide text-ivory">
                {editProduct ? 'Edit Jewellery Piece' : 'Add New Jewellery Inventory'}
              </h2>
              <p className="text-[11px] text-ivory/70">
                Catalog Entry • Multi-Photo Gallery &amp; Size Options Sync
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-ivory/70 hover:text-ivory transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Grid */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[78vh] overflow-y-auto space-y-6 text-xs text-charcoal">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 cols: Form inputs */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* 1. Product Basics & Category */}
              <div className="p-4 bg-beige/10 rounded-sm border border-beige space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-champagne block">
                  1. Identification &amp; Category
                </span>

                <div>
                  <label className="block font-medium text-charcoal-muted mb-1">
                    Jewellery Piece Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Royal Meenakari Kundan Haar Set"
                    className="w-full p-2.5 bg-white border border-beige rounded-xs text-xs font-serif text-base text-charcoal outline-none focus:border-champagne"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Category Field with "+ New Category" */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block font-medium text-charcoal-muted">Category *</label>
                      <button
                        type="button"
                        onClick={() => setIsAddingCategory((v) => !v)}
                        className="text-[10px] text-champagne hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>{isAddingCategory ? 'Cancel' : '+ New Category'}</span>
                      </button>
                    </div>

                    {!isAddingCategory ? (
                      <select
                        value={category}
                        onChange={handleCategoryChange}
                        className="w-full p-2 bg-white border border-beige rounded-xs text-xs outline-none focus:border-champagne"
                      >
                        {categoriesList.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                        <option value="__ADD_NEW__">+ Add Custom Category...</option>
                      </select>
                    ) : (
                      <div className="flex gap-1.5 animate-fade-in">
                        <input
                          type="text"
                          autoFocus
                          placeholder="e.g. Anklets, Mathapatti"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleCreateNewCategory();
                            }
                          }}
                          className="flex-1 p-1.5 bg-white border border-champagne rounded-xs text-xs outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleCreateNewCategory}
                          className="px-2.5 py-1 bg-champagne text-charcoal font-semibold rounded-xs text-[10px] cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>

                  {/* SKU Code with clear Auto-Generate explanation */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block font-medium text-charcoal-muted">SKU Code *</label>
                      <button
                        type="button"
                        onClick={() => generateNewSku(category)}
                        className="text-[10px] text-champagne hover:underline flex items-center gap-1 cursor-pointer font-medium"
                        title="Auto-generates a unique barcode and inventory SKU code for this item"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        <span>Auto-Generate SKU</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={sku}
                      onChange={(e) => setSku(e.target.value.toUpperCase())}
                      className="w-full p-2 bg-white border border-beige rounded-xs font-mono uppercase text-xs outline-none focus:border-champagne"
                    />
                    <span className="text-[9px] text-charcoal-muted mt-0.5 block">
                      Auto-generated unique inventory &amp; barcode code
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Technical Specifications (Visible to Client) */}
              <div className="p-4 bg-beige/10 rounded-sm border border-beige space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-champagne block">
                    2. Purity, Metal &amp; Weight Specifications
                  </span>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Visible to Customer</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Metal / Plating with "+ Custom Metal" */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block font-medium text-charcoal-muted">Metal / Plating Type</label>
                      <button
                        type="button"
                        onClick={() => setIsAddingMetal((v) => !v)}
                        className="text-[10px] text-champagne hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>{isAddingMetal ? 'Cancel' : '+ Custom Metal'}</span>
                      </button>
                    </div>

                    {!isAddingMetal ? (
                      <select
                        value={metalType}
                        onChange={(e) => {
                          if (e.target.value === '__ADD_NEW__') {
                            setIsAddingMetal(true);
                          } else {
                            setMetalType(e.target.value);
                          }
                        }}
                        className="w-full p-2 bg-white border border-beige rounded-xs text-xs outline-none focus:border-champagne"
                      >
                        {metalsList.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                        <option value="__ADD_NEW__">+ Add Custom Metal...</option>
                      </select>
                    ) : (
                      <div className="flex gap-1.5 animate-fade-in">
                        <input
                          type="text"
                          autoFocus
                          placeholder="e.g. 22K Yellow Micron, Copper Antique"
                          value={newMetalName}
                          onChange={(e) => setNewMetalName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleCreateNewMetal();
                            }
                          }}
                          className="flex-1 p-1.5 bg-white border border-champagne rounded-xs text-xs outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleCreateNewMetal}
                          className="px-2.5 py-1 bg-champagne text-charcoal font-semibold rounded-xs text-[10px] cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-medium text-charcoal-muted mb-1">Purity / Polish Label</label>
                    <input
                      type="text"
                      value={purity}
                      onChange={(e) => setPurity(e.target.value)}
                      placeholder="e.g. 24K Micro Gold Plated"
                      className="w-full p-2 bg-white border border-beige rounded-xs text-xs outline-none focus:border-champagne"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-charcoal-muted mb-1">Gross Weight (Grams)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={grossWeight}
                      onChange={(e) => setGrossWeight(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 bg-white border border-beige rounded-xs text-xs font-mono outline-none focus:border-champagne"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-charcoal-muted mb-1">Net Weight (Metal) (Grams)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={netWeight}
                      onChange={(e) => setNetWeight(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 bg-white border border-beige rounded-xs text-xs font-mono outline-none focus:border-champagne"
                    />
                  </div>
                </div>

                {/* Additional Client-Visible Specs (Gemstone & Dimensions) */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-medium text-charcoal-muted mb-1">
                      Gemstone / Stones (Optional)
                    </label>
                    <input
                      type="text"
                      value={gemstone}
                      onChange={(e) => setGemstone(e.target.value)}
                      placeholder="e.g. AAA+ American Diamond, Kundan Polki"
                      className="w-full p-2 bg-white border border-beige rounded-xs text-xs outline-none focus:border-champagne"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-charcoal-muted mb-1">
                      Dimensions / Length (Optional)
                    </label>
                    <input
                      type="text"
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                      placeholder="e.g. 18 inches, Free Size Adjustable"
                      className="w-full p-2 bg-white border border-beige rounded-xs text-xs outline-none focus:border-champagne"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Available Sizes (Visible to Client) */}
              <div className="p-4 bg-beige/10 rounded-sm border border-beige space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Ruler className="w-3.5 h-3.5 text-champagne" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-champagne block">
                      3. Available Sizes ({selectedSizes.length} Selected)
                    </span>
                  </div>

                  {/* Quick Select/Reset Actions */}
                  <div className="flex items-center gap-2.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSizes(activeTabSizes);
                        showToast('Selected all sizes in this category', 'info');
                      }}
                      className="text-charcoal hover:text-champagne-dark underline cursor-pointer font-medium"
                    >
                      Select All
                    </button>
                    <span className="text-beige-dark">|</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSizes(['Adjustable Free Size']);
                        showToast('Reset to Adjustable Free Size', 'info');
                      }}
                      className="text-charcoal-muted hover:text-rose-600 underline cursor-pointer"
                    >
                      Free Size Only
                    </button>
                  </div>
                </div>

                {/* Sizing Category Selector */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs">
                  <span className="text-[10px] text-charcoal-muted font-medium shrink-0">Sizing Type:</span>
                  {[
                    { id: 'ring', label: '💍 Rings' },
                    { id: 'bangle', label: '⭕ Bangles' },
                    { id: 'necklace', label: '📿 Necklaces' },
                    { id: 'general', label: '✨ Free Size' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveSizeTab(tab.id as any);
                        if (tab.id === 'ring') setSelectedSizes(['12 (Indian)', '14 (Indian)', '16 (Indian)', '18 (Indian)', 'Adjustable Free Size']);
                        else if (tab.id === 'bangle') setSelectedSizes(['2.4 (Small)', '2.6 (Medium)', '2.8 (Large)', '2.10 (Extra Large)']);
                        else if (tab.id === 'necklace') setSelectedSizes(['16 inches (Choker)', '18 inches (Princess)', '24 inches (Matinee)', 'Adjustable Dori']);
                        else setSelectedSizes(['Adjustable Free Size']);
                      }}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                        activeSizeTab === tab.id
                          ? 'bg-charcoal text-ivory shadow-xs font-semibold'
                          : 'bg-white text-charcoal-muted border border-beige hover:border-champagne hover:text-charcoal'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Clean Size Toggle Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeTabSizes.map((size) => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-3 py-1.5 rounded-xs text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-charcoal text-ivory border-charcoal shadow-2xs font-semibold'
                            : 'bg-white text-charcoal-muted border-beige hover:border-champagne hover:text-charcoal'
                        }`}
                        title={isSelected ? 'Click to remove size' : 'Click to enable size for customers'}
                      >
                        {isSelected ? (
                          <Check className="w-3 h-3 text-champagne shrink-0" />
                        ) : (
                          <Plus className="w-3 h-3 opacity-40 shrink-0" />
                        )}
                        <span>{size}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Size Addition */}
                <div className="flex gap-1.5 pt-1">
                  <input
                    type="text"
                    placeholder="Add custom size (e.g. 15 Indian, 2.5 Anna, 22 Inches)..."
                    value={customSizeInput}
                    onChange={(e) => setCustomSizeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomSize();
                      }
                    }}
                    className="flex-1 p-2 bg-white border border-beige rounded-xs text-xs outline-none focus:border-champagne"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSize}
                    className="px-3 py-2 bg-champagne text-charcoal text-xs font-semibold rounded-xs hover:bg-champagne/90 transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Size</span>
                  </button>
                </div>
              </div>

              {/* 4. Pricing & Stock */}
              <div className="p-4 bg-beige/10 rounded-sm border border-beige space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-champagne block">
                  4. Pricing, GST &amp; Stock Quantity
                </span>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-charcoal-muted mb-1">MRP Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={basePrice}
                      onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 bg-white border border-beige rounded-xs text-xs font-mono font-bold outline-none focus:border-champagne"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-charcoal-muted mb-1">Offer Price (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 bg-white border border-beige rounded-xs text-xs font-mono text-emerald-800 font-bold outline-none focus:border-champagne"
                      placeholder="Optional discount"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-charcoal-muted mb-1">Available Stock (Qty) *</label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={stockQuantity}
                      onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                      className="w-full p-2 bg-white border border-beige rounded-xs text-xs font-mono font-bold outline-none focus:border-champagne"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 text-champagne accent-champagne"
                    />
                    <span className="font-medium text-charcoal">Feature on Homepage / Signature Showcase</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-medium text-charcoal-muted mb-1">Description &amp; Story</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-beige/10 border border-beige rounded-xs text-xs outline-none focus:border-champagne"
                />
              </div>
            </div>

            {/* Right 5 cols: Multi-Image Uploader & Customer Preview */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* 5. Multiple Photos & File Upload Section */}
              <div className="p-4 bg-beige/10 rounded-sm border border-beige space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-champagne block">
                    5. Photos &amp; Product Gallery ({images.length})
                  </span>
                  <span className="text-[10px] text-charcoal-muted">First photo is Cover</span>
                </div>

                {/* Upload from Computer / Phone Button */}
                <div className="border-2 border-dashed border-champagne/50 hover:border-champagne rounded-sm p-3 text-center bg-white/60 transition-colors group cursor-pointer relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    title="Choose jewellery images from computer or phone"
                  />
                  <div className="flex flex-col items-center justify-center gap-1 pointer-events-none">
                    <Upload className="w-5 h-5 text-champagne group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-charcoal text-xs">
                      Click to Upload Images from Device
                    </span>
                    <span className="text-[10px] text-charcoal-muted">
                      Select multiple photos (.jpg, .png, .webp)
                    </span>
                  </div>
                </div>

                {/* Image Guidelines & Dimensions Box */}
                <div className="p-2.5 bg-champagne/10 border border-champagne/30 rounded-xs text-[11px] text-charcoal space-y-1">
                  <div className="flex items-center justify-between font-semibold text-charcoal">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-champagne-dark" />
                      Recommended Photo Dimensions:
                    </span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-2xs border border-emerald-200">
                      Square 1:1 Aspect Ratio
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] text-charcoal-muted">
                    <div>• <strong className="text-charcoal">Width &amp; Height:</strong> 1000 × 1000 px (or 1200 × 1200 px)</div>
                    <div>• <strong className="text-charcoal">Portrait Option:</strong> 800 × 1000 px (4:5)</div>
                    <div>• <strong className="text-charcoal">Formats:</strong> JPG, PNG, or WebP</div>
                    <div>• <strong className="text-charcoal">Max File Size:</strong> Under 2 MB per image</div>
                  </div>
                </div>

                {/* Add by URL */}
                <div className="flex gap-1.5">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Or paste image URL (https://...)"
                    className="flex-1 p-2 bg-white border border-beige rounded-xs text-xs font-mono outline-none focus:border-champagne truncate"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddImageUrl();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-2 bg-charcoal text-ivory text-xs rounded-xs hover:bg-black transition-colors cursor-pointer shrink-0 font-medium"
                  >
                    + Add URL
                  </button>
                </div>

                {/* Presets */}
                <div>
                  <span className="text-[10px] text-charcoal-muted block mb-1 font-medium">
                    Quick Sample Presets:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (!images.includes(preset.url)) {
                            setImages((prev) => [...prev, preset.url]);
                            showToast(`Added ${preset.label} photo`, 'success');
                          }
                        }}
                        className="text-[10px] px-2 py-0.5 rounded-xs border border-beige bg-white hover:bg-beige/40 text-charcoal cursor-pointer"
                      >
                        + {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Uploaded Photos Thumbnails Grid */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-charcoal-muted font-bold block">
                      Active Gallery Photos ({images.length}):
                    </span>
                    {images.length === 0 && (
                      <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                        Cover photo removed • Upload your photo
                      </span>
                    )}
                  </div>
                  {images.length === 0 ? (
                    <div className="p-4 text-center border-2 border-dashed border-champagne/40 rounded-xs bg-white text-charcoal-muted text-xs space-y-1">
                      <Upload className="w-5 h-5 mx-auto text-champagne" />
                      <span className="block font-medium text-charcoal">No photos currently selected</span>
                      <span className="text-[10px] text-charcoal-muted block">
                        Upload photos from your device above or pick a sample preset
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1 bg-white border border-beige rounded-xs">
                      {images.map((img, idx) => (
                        <div
                          key={idx}
                          className={`relative group aspect-square rounded-xs overflow-hidden border ${
                            idx === 0 ? 'border-champagne ring-2 ring-champagne/40' : 'border-beige'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Uploaded photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {/* Primary Badge */}
                          {idx === 0 ? (
                            <div className="absolute top-1 left-1 bg-charcoal/90 text-champagne text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-2xs flex items-center gap-0.5">
                              <Star className="w-2 h-2 fill-champagne" />
                              <span>Cover</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 bg-charcoal/80 hover:bg-charcoal text-ivory text-[8px] px-1 py-0.5 rounded-2xs transition-opacity cursor-pointer"
                              title="Set as Cover Photo"
                            >
                              Set Cover
                            </button>
                          )}

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-2xs transition-opacity cursor-pointer"
                            title="Remove this photo"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Live Customer Storefront Preview Card */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-charcoal-muted font-bold flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-champagne" />
                    Customer Storefront Preview
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                    {stockQuantity > 0 ? `${stockQuantity} in Stock` : 'Out of Stock'}
                  </span>
                </div>

                <div className="bg-white border border-champagne/40 rounded-sm overflow-hidden shadow-luxury p-3 space-y-2">
                  <div className="relative aspect-[4/3] bg-beige/20 rounded-xs overflow-hidden">
                    {images[0] ? (
                      <img
                        src={images[0]}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = PRESET_IMAGES[0].url;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-beige/20 text-charcoal-muted text-xs p-4 text-center space-y-1">
                        <Package className="w-7 h-7 text-champagne/70" />
                        <span className="font-serif text-charcoal text-xs">No Cover Photo</span>
                        <span className="text-[10px] text-charcoal-muted">Upload a photo to see preview</span>
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-charcoal text-champagne text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full">
                      {category}
                    </div>
                    {images.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] font-mono px-2 py-0.5 rounded-full">
                        {images.length} Photos
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Row if Multiple Images */}
                  {images.length > 1 && (
                    <div className="flex gap-1 overflow-x-auto pb-1">
                      {images.map((img, i) => (
                        <div
                          key={i}
                          className={`w-9 h-9 shrink-0 rounded-2xs overflow-hidden border ${
                            i === 0 ? 'border-champagne ring-1 ring-champagne' : 'border-beige opacity-70'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] text-charcoal-muted font-mono">
                      <span>{sku || 'VLSA-SKU-00'}</span>
                      <span>GW: {grossWeight}g {netWeight ? `| NW: ${netWeight}g` : ''}</span>
                    </div>

                    <h4 className="font-serif text-sm font-medium text-charcoal truncate">
                      {name || 'Jewellery Piece Title'}
                    </h4>

                    <div className="text-[10px] text-charcoal-muted truncate">
                      {metalType} {gemstone ? `• ${gemstone}` : ''}
                    </div>

                    {/* Customer Size Selector Preview */}
                    {selectedSizes.length > 0 && (
                      <div className="pt-2 border-t border-beige/60 space-y-1.5">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-charcoal uppercase tracking-wider font-bold text-[9px]">
                            SELECT SIZE
                          </span>
                          <span className="text-champagne font-medium text-[8px] flex items-center gap-0.5">
                            <Ruler className="w-2.5 h-2.5" />
                            SIZE GUIDE
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {selectedSizes.map((sz, i) => (
                            <span
                              key={sz}
                              className={`px-2.5 py-1 rounded-2xs text-[9px] font-sans border transition-all ${
                                i === 0
                                  ? 'bg-charcoal text-ivory border-charcoal font-semibold shadow-xs'
                                  : 'bg-white text-charcoal border-beige hover:border-champagne'
                              }`}
                            >
                              {sz}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-baseline gap-2 font-mono pt-1">
                      <span className="font-bold text-sm text-charcoal">
                        {formatPrice(discountPrice && discountPrice > 0 ? discountPrice : basePrice)}
                      </span>
                      {discountPrice > 0 && discountPrice < basePrice && (
                        <span className="text-xs text-charcoal-muted line-through font-normal">
                          {formatPrice(basePrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-beige flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting} className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-champagne" />
              <span>{editProduct ? 'Save Changes' : 'Publish & Sync Live'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
