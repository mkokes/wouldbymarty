const API_BASE = '/api';

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

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const response = await fetch(`${API_BASE}/products/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch product');
  }
  return response.json();
}
