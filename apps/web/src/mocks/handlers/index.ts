import { http, HttpResponse } from 'msw';

export interface ProductVariant {
  id: string;
  woodType: string;
  finish: string;
  priceAdjustment: number;
  inventory: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  inventory: number;
  woodType?: string;
  finish?: string;
  dimensions?: string;
  variants?: ProductVariant[];
  createdAt: number;
}

const getSampleImages = (id: string): string[] => {
  const images: Record<string, string[]> = {
    '1': [
      'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop',
    ],
    '2': [
      'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&h=600&fit=crop',
    ],
    '3': [
      'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop',
    ],
    '4': [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&h=600&fit=crop',
    ],
    '5': [
      'https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?w=600&h=600&fit=crop',
    ],
    '6': [
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&h=600&fit=crop',
    ],
  };
  return images[id] || [];
};

export const products: Product[] = [
  {
    _id: '1',
    name: 'Walnut Cutting Board',
    description: 'Handcrafted from solid walnut, perfect for kitchen use. Each board is unique with natural grain patterns. Food-safe natural oil finish. Available in multiple wood types and finishes.',
    price: 8500,
    images: getSampleImages('1'),
    category: 'Kitchen',
    inventory: 5,
    woodType: 'Walnut',
    finish: 'Natural Oil',
    dimensions: '18" x 12" x 1.5"',
    variants: [
      { id: '1-walnut-matte', woodType: 'Walnut', finish: 'Matte', priceAdjustment: 0, inventory: 3 },
      { id: '1-walnut-glossy', woodType: 'Walnut', finish: 'Glossy', priceAdjustment: 1500, inventory: 2 },
      { id: '1-maple-matte', woodType: 'Maple', finish: 'Matte', priceAdjustment: -1000, inventory: 5 },
      { id: '1-cherry-natural', woodType: 'Cherry', finish: 'Natural Oil', priceAdjustment: 500, inventory: 4 },
    ],
    createdAt: Date.now(),
  },
  {
    _id: '2',
    name: 'Oak Floating Shelves',
    description: 'Set of 3 rustic floating shelves made from reclaimed oak. Perfect for displaying collectibles or books. Hidden mounting hardware included.',
    price: 15000,
    images: getSampleImages('2'),
    category: 'Decor',
    inventory: 3,
    woodType: 'Oak',
    finish: 'Matte',
    dimensions: '36" x 6" x 1"',
    variants: [
      { id: '2-oak-matte', woodType: 'Oak', finish: 'Matte', priceAdjustment: 0, inventory: 3 },
      { id: '2-oak-glossy', woodType: 'Oak', finish: 'Glossy', priceAdjustment: 2000, inventory: 2 },
      { id: '2-walnut-matte', woodType: 'Walnut', finish: 'Matte', priceAdjustment: 3000, inventory: 2 },
    ],
    createdAt: Date.now(),
  },
  {
    _id: '3',
    name: 'Maple Dining Table',
    description: 'Beautiful solid maple dining table seats 6. Hand-finished with a warm natural tone. Perfect for family gatherings. Custom sizes available.',
    price: 250000,
    images: getSampleImages('3'),
    category: 'Furniture',
    inventory: 1,
    woodType: 'Maple',
    finish: 'Glossy',
    dimensions: '72" x 36" x 30"',
    variants: [
      { id: '3-maple-glossy', woodType: 'Maple', finish: 'Glossy', priceAdjustment: 0, inventory: 1 },
      { id: '3-maple-matte', woodType: 'Maple', finish: 'Matte', priceAdjustment: -5000, inventory: 1 },
      { id: '3-cherry-glossy', woodType: 'Cherry', finish: 'Glossy', priceAdjustment: 15000, inventory: 1 },
      { id: '3-oak-glossy', woodType: 'Oak', finish: 'Glossy', priceAdjustment: 10000, inventory: 1 },
    ],
    createdAt: Date.now(),
  },
  {
    _id: '4',
    name: 'Cherry Wood Wall Art',
    description: 'Abstract geometric wall art carved from cherry wood. Adds warmth to any room. Each piece is one-of-a-kind.',
    price: 12000,
    images: getSampleImages('4'),
    category: 'Wall Art',
    inventory: 4,
    woodType: 'Cherry',
    finish: 'Natural Oil',
    dimensions: '24" x 24" x 0.5"',
    variants: [
      { id: '4-cherry-natural', woodType: 'Cherry', finish: 'Natural Oil', priceAdjustment: 0, inventory: 4 },
      { id: '4-cherry-matte', woodType: 'Cherry', finish: 'Matte', priceAdjustment: 0, inventory: 3 },
      { id: '4-walnut-natural', woodType: 'Walnut', finish: 'Natural Oil', priceAdjustment: 2000, inventory: 2 },
    ],
    createdAt: Date.now(),
  },
  {
    _id: '5',
    name: 'Custom Butcher Block',
    description: 'Personalized butcher block cutting board with your name or design. Great gift idea. Made from sustainably sourced maple.',
    price: 9500,
    images: getSampleImages('5'),
    category: 'Custom',
    inventory: 10,
    woodType: 'Maple',
    finish: 'Natural Oil',
    dimensions: '20" x 14" x 2"',
    variants: [
      { id: '5-maple-natural', woodType: 'Maple', finish: 'Natural Oil', priceAdjustment: 0, inventory: 10 },
      { id: '5-maple-glossy', woodType: 'Maple', finish: 'Glossy', priceAdjustment: 1500, inventory: 5 },
      { id: '5-walnut-natural', woodType: 'Walnut', finish: 'Natural Oil', priceAdjustment: 3000, inventory: 3 },
    ],
    createdAt: Date.now(),
  },
  {
    _id: '6',
    name: 'Walnut Coffee Table',
    description: 'Mid-century modern coffee table in solid walnut. Hairpin legs included. A statement piece for any living room.',
    price: 18500,
    images: getSampleImages('6'),
    category: 'Furniture',
    inventory: 2,
    woodType: 'Walnut',
    finish: 'Matte',
    dimensions: '48" x 24" x 16"',
    variants: [
      { id: '6-walnut-matte', woodType: 'Walnut', finish: 'Matte', priceAdjustment: 0, inventory: 2 },
      { id: '6-walnut-glossy', woodType: 'Walnut', finish: 'Glossy', priceAdjustment: 2500, inventory: 1 },
      { id: '6-oak-matte', woodType: 'Oak', finish: 'Matte', priceAdjustment: -2000, inventory: 2 },
    ],
    createdAt: Date.now(),
  },
];

export const handlers = [
  http.get('/api/products', () => {
    return HttpResponse.json(products);
  }),
  
  http.get('/api/products/:id', ({ params }) => {
    const product = products.find(p => p._id === params.id);
    if (!product) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(product);
  }),
];
