'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/api';

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, mounted]);

  const cartItemsWithProducts = cartItems
    .map(item => ({
      ...item,
      product: products.find(p => p._id === item.productId),
    }))
    .filter(item => item.product) as (CartItem & { product: Product })[];

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(items => items.filter(item => item.productId !== productId));
    } else {
      setCartItems(items => 
        items.map(item => 
          item.productId === productId 
            ? { ...item, quantity } 
            : item
        )
      );
    }
  };

  const removeItem = (productId: string) => {
    setCartItems(items => items.filter(item => item.productId !== productId));
  };

  const subtotal = cartItemsWithProducts.reduce(
    (sum, item) => sum + (item.product.price * item.quantity), 
    0
  );

  if (!isOpen) return null;

  return (
    <>
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 999,
        }}
      />
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '420px',
        backgroundColor: 'var(--color-surface)',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideIn 0.3s ease',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontFamily: 'var(--font-heading)',
            margin: 0,
          }}>
            Your Cart ({cartItems.length})
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {cartItemsWithProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                Your cart is empty
              </p>
              <Link 
                href="/products" 
                onClick={onClose}
                className="btn btn-primary"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cartItemsWithProducts.map((item) => (
                <div
                  key={item.productId}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem',
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}>
                    {item.product.images?.[0] ? (
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        opacity: 0.3,
                      }}>
                        🪵
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Link 
                      href={`/products/${item.productId}`}
                      onClick={onClose}
                      style={{
                        fontWeight: '500',
                        color: 'var(--color-text-primary)',
                        fontSize: '0.95rem',
                      }}
                    >
                      {item.product.name}
                    </Link>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--color-accent)',
                      fontWeight: '500',
                      marginTop: '0.25rem',
                    }}>
                      {formatPrice(item.product.price)}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        style={{
                          width: '28px',
                          height: '28px',
                          border: '1px solid var(--color-border)',
                          borderRadius: '4px',
                          background: 'var(--color-surface)',
                          cursor: 'pointer',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        -
                      </button>
                      <span style={{ width: '30px', textAlign: 'center', fontWeight: '500' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        style={{
                          width: '28px',
                          height: '28px',
                          border: '1px solid var(--color-border)',
                          borderRadius: '4px',
                          background: 'var(--color-surface)',
                          cursor: 'pointer',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.productId)}
                        style={{
                          marginLeft: 'auto',
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-text-secondary)',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItemsWithProducts.length > 0 && (
          <div style={{
            padding: '1.5rem',
            borderTop: '1px solid var(--color-border)',
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
              <span style={{ fontWeight: '600' }}>{formatPrice(subtotal)}</span>
            </div>
            <Link 
              href="/cart" 
              onClick={onClose}
              className="btn btn-primary" 
              style={{ width: '100%', textAlign: 'center', display: 'block' }}
            >
              View Cart & Checkout
            </Link>
          </div>
        )}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
