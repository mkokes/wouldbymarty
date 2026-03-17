'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { fetchProducts, Product } from '@/lib/api';

const CATEGORIES = ['All', 'Furniture', 'Decor', 'Kitchen', 'Wall Art', 'Custom'];

function ProductCard({ product }: { product: Product }) {
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  return (
    <Link href={`/products/${product._id}`} style={{ display: 'block' }}>
      <article className="card" style={{ padding: 0, overflow: 'hidden', height: '100%' }}>
        <div style={{ 
          aspectRatio: '1', 
          backgroundColor: 'var(--color-bg-secondary)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.name}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
              }}
            />
          ) : (
            <div style={{ 
              fontSize: '4rem',
              opacity: 0.5,
            }}>
              🪵
            </div>
          )}
        </div>
        <div style={{ padding: '1rem' }}>
          <span style={{ 
            fontSize: '0.75rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            color: 'var(--color-text-secondary)',
          }}>
            {product.category}
          </span>
          <h3 style={{ 
            fontSize: '1.1rem', 
            margin: '0.5rem 0',
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text-primary)',
          }}>
            {product.name}
          </h3>
          <p style={{ 
            fontSize: '0.9rem', 
            color: 'var(--color-text-secondary)',
            marginBottom: '0.75rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5,
          }}>
            {product.description}
          </p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
          }}>
            <span style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600',
              color: 'var(--color-accent)',
            }}>
              {formatPrice(product.price)}
            </span>
            {product.inventory > 0 ? (
              <span style={{ 
                fontSize: '0.75rem', 
                color: 'var(--color-text-secondary)',
              }}>
                {product.inventory} in stock
              </span>
            ) : (
              <span style={{ 
                fontSize: '0.75rem', 
                color: '#AE2012',
                fontWeight: '500',
              }}>
                Out of stock
              </span>
            )}
          </div>
          {(product.woodType || product.finish) && (
            <div style={{ 
              marginTop: '0.75rem',
              display: 'flex', 
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}>
              {product.woodType && (
                <span style={{ 
                  fontSize: '0.7rem',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderRadius: '4px',
                  color: 'var(--color-text-secondary)',
                }}>
                  {product.woodType}
                </span>
              )}
              {product.finish && (
                <span style={{ 
                  fontSize: '0.7rem',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderRadius: '4px',
                  color: 'var(--color-text-secondary)',
                }}>
                  {product.finish}
                </span>
              )}
              {product.dimensions && (
                <span style={{ 
                  fontSize: '0.7rem',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderRadius: '4px',
                  color: 'var(--color-text-secondary)',
                }}>
                  {product.dimensions}
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

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
