'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { fetchProducts, Product } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';

const CATEGORIES = ['All', 'Furniture', 'Decor', 'Kitchen', 'Wall Art', 'Custom'];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '0.5rem',
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-text-primary)',
        }}>
          Our Products
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Handcrafted with care, made to order
        </p>
      </header>
      
      <section style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '0.6rem 1.25rem',
                  border: `1px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  borderRadius: '24px',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? '600' : '400',
                  backgroundColor: isActive ? 'var(--color-accent)' : 'transparent',
                  color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
              >
                {category}
              </button>
            );
          })}
        </div>
      </section>

      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          color: 'var(--color-text-secondary)',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🪵</div>
          <p>Loading products...</p>
        </div>
      ) : error ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          color: 'var(--color-text-secondary)',
          backgroundColor: 'var(--color-bg-secondary)',
          borderRadius: '12px',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
          <p>{error}</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1.5rem',
        }}>
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          color: 'var(--color-text-secondary)',
          backgroundColor: 'var(--color-bg-secondary)',
          borderRadius: '12px',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
          <p style={{ marginBottom: '0.5rem' }}>No products found in this category</p>
          <button 
            onClick={() => setSelectedCategory('All')}
            style={{ 
              color: 'var(--color-accent)', 
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 'inherit',
            }}
          >
            View all products
          </button>
        </div>
      )}
    </main>
  );
}
