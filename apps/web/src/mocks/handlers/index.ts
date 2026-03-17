import { http, HttpResponse } from 'msw';

const products = [
  {
    _id: '1',
    name: 'Walnut Cutting Board',
    description: 'Handcrafted from solid walnut, perfect for kitchen use. Each board is unique with natural grain patterns.',
    price: 8500,
    images: [],
    category: 'Kitchen',
    inventory: 5,
    woodType: 'Walnut',
    finish: 'Natural Oil',
    dimensions: '18" x 12" x 1.5"',
    createdAt: Date.now(),
  },
  {
    _id: '2',
    name: 'Oak Floating Shelves',
    description: 'Set of 3 rustic floating shelves made from reclaimed oak. Perfect for displaying collectibles or books.',
    price: 15000,
    images: [],
    category: 'Decor',
    inventory: 3,
    woodType: 'Oak',
    finish: 'Matte',
    dimensions: '36" x 6" x 1"',
    createdAt: Date.now(),
  },
  {
    _id: '3',
    name: 'Maple Dining Table',
    description: 'Beautiful solid maple dining table seats 6. Hand-finished with a warm natural tone.',
    price: 250000,
    images: [],
    category: 'Furniture',
    inventory: 1,
    woodType: 'Maple',
    finish: 'Glossy',
    dimensions: '72" x 36" x 30"',
    createdAt: Date.now(),
  },
  {
    _id: '4',
    name: 'Cherry Wood Wall Art',
    description: 'Abstract geometric wall art carved from cherry wood. Adds warmth to any room.',
    price: 12000,
    images: [],
    category: 'Wall Art',
    inventory: 4,
    woodType: 'Cherry',
    finish: 'Natural Oil',
    dimensions: '24" x 24" x 0.5"',
    createdAt: Date.now(),
  },
  {
    _id: '5',
    name: 'Custom Butcher Block',
    description: 'Personalized butcher block cutting board with your name or design. Great gift idea.',
    price: 9500,
    images: [],
    category: 'Custom',
    inventory: 10,
    woodType: 'Maple',
    finish: 'Natural Oil',
    dimensions: '20" x 14" x 2"',
    createdAt: Date.now(),
  },
  {
    _id: '6',
    name: 'Walnut Coffee Table',
    description: 'Mid-century modern coffee table in solid walnut. Hairpin legs included.',
    price: 18500,
    images: [],
    category: 'Furniture',
    inventory: 2,
    woodType: 'Walnut',
    finish: 'Matte',
    dimensions: '48" x 24" x 16"',
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
