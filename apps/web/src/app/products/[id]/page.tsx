'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchProductById, Product } from '@/lib/api';

interface CartItem {
  productId: string;
  quantity: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function loadProduct() {
      if (!params.id) return;
      try {
        setLoading(true);
        const data = await fetchProductById(params.id as string);
        if (!data) {
          setError('Product not found');
        } else {
          setProduct(data);
        }
      } catch (err) {
        setError('Failed to load product');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [params.id]);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const existingCart = localStorage.getItem('cart');
    let cartItems: CartItem[] = existingCart ? JSON.parse(existingCart) : [];
    
    const existingIndex = cartItems.findIndex(
      (item) => item.productId === product._id
    );
    
    if (existingIndex >= 0) {
      cartItems[existingIndex].quantity += quantity;
    } else {
      cartItems.push({ productId: product._id, quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cartItems));
    alert(`Added ${quantity} item(s) to cart!`);
  };

  if (loading) {
    return (
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🪵</div>
          <p>Loading product...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          backgroundColor: 'var(--color-bg-secondary)',
          borderRadius: '12px',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>😕</div>
          <p style={{ marginBottom: '1rem' }}>{error || 'Product not found'}</p>
          <Link 
            href="/products" 
            style={{ 
              color: 'var(--color-accent)', 
              textDecoration: 'underline' 
            }}
          >
            Back to products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <nav style={{ marginBottom: '2rem' }}>
        <Link 
          href="/products" 
          style={{ 
            color: 'var(--color-text-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Products
        </Link>
      </nav>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '3rem',
      }}>
        <div>
          <div style={{ 
            aspectRatio: '1',
            backgroundColor: 'var(--color-bg-secondary)',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '1rem',
          }}>
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '8rem',
                opacity: 0.3,
              }}>
                🪵
              </div>
            )}
          </div>
          
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: `2px solid ${selectedImage === idx ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    padding: 0,
                    cursor: 'pointer',
                  }}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span style={{ 
            fontSize: '0.875rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            color: 'var(--color-accent)',
            fontWeight: '600',
          }}>
            {product.category}
          </span>
          
          <h1 style={{ 
            fontSize: '2.5rem', 
            marginTop: '0.5rem',
            marginBottom: '1rem',
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text-primary)',
            lineHeight: 1.2,
          }}>
            {product.name}
          </h1>

          <div style={{ 
            fontSize: '2rem', 
            fontWeight: '600',
            color: 'var(--color-accent)',
            marginBottom: '1.5rem',
          }}>
            {formatPrice(product.price)}
          </div>

          <p style={{ 
            color: 'var(--color-text-secondary)',
            lineHeight: 1.7,
            marginBottom: '2rem',
          }}>
            {product.description}
          </p>

          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            flexWrap: 'wrap',
            marginBottom: '2rem',
          }}>
            {product.woodType && (
              <div className="card" style={{ padding: '0.75rem 1rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Wood Type</span>
                <div style={{ fontWeight: '500' }}>{product.woodType}</div>
              </div>
            )}
            {product.finish && (
              <div className="card" style={{ padding: '0.75rem 1rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Finish</span>
                <div style={{ fontWeight: '500' }}>{product.finish}</div>
              </div>
            )}
            {product.dimensions && (
              <div className="card" style={{ padding: '0.75rem 1rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Dimensions</span>
                <div style={{ fontWeight: '500' }}>{product.dimensions}</div>
              </div>
            )}
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            marginBottom: '2rem',
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              overflow: 'hidden',
            }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  width: '44px',
                  height: '44px',
                  border: 'none',
                  background: 'var(--color-surface)',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  color: 'var(--color-text-primary)',
                }}
              >
                -
              </button>
              <span style={{ 
                width: '50px', 
                textAlign: 'center',
                fontWeight: '500',
              }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                style={{
                  width: '44px',
                  height: '44px',
                  border: 'none',
                  background: 'var(--color-surface)',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  color: 'var(--color-text-primary)',
                }}
              >
                +
              </button>
            </div>

            <div style={{ 
              fontSize: '0.875rem',
              color: product.inventory > 0 ? 'var(--color-text-secondary)' : '#AE2012',
            }}>
              {product.inventory > 0 
                ? `${product.inventory} available in stock`
                : 'Out of stock'
              }
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.inventory === 0}
            className="btn btn-primary"
            style={{ 
              width: '100%', 
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              opacity: product.inventory === 0 ? 0.5 : 1,
              cursor: product.inventory === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            {product.inventory > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>

          <div style={{ 
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: 'var(--color-bg-secondary)',
            borderRadius: '8px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span style={{ fontWeight: '500' }}>Handcrafted with Care</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              Each piece is made to order with attention to detail. Expected delivery: 2-3 weeks.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
