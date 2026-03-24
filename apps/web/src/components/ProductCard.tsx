'use client';

import Link from 'next/link';
import { Product } from '@/lib/api';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
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
