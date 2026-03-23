'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchProducts, Product } from '@/lib/api';

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartItemWithProduct extends CartItem {
  product: Product;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    
    fetchProducts().then(setProducts).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, mounted]);

  const cartItemsWithProducts: CartItemWithProduct[] = cartItems
    .map(item => ({
      ...item,
      product: products.find(p => p._id === item.productId),
    }))
    .filter(item => item.product) as CartItemWithProduct[];

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

  const shipping = subtotal > 0 ? 2500 : 0;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <p>Loading cart...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ 
        marginBottom: '2rem',
        fontFamily: 'var(--font-heading)',
        fontSize: '2.5rem',
        color: 'var(--color-text-primary)',
      }}>
        Shopping Cart
      </h1>

      {cartItemsWithProducts.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          backgroundColor: 'var(--color-bg-secondary)',
          borderRadius: '12px',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
          <h2 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
            Your cart is empty
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
            Looks like you haven't added any items yet.
          </p>
          <Link href="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 380px', 
          gap: '3rem',
          alignItems: 'start',
        }}>
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--color-border)',
              marginBottom: '1rem',
              color: 'var(--color-text-secondary)',
              fontSize: '0.875rem',
            }}>
              <span>Product</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>

            {cartItemsWithProducts.map((item) => (
              <div
                key={item.productId}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto',
                  gap: '1.5rem',
                  padding: '1.5rem 0',
                  borderBottom: '1px solid var(--color-border)',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {item.product.images?.[0] ? (
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    ) : (
                      <span style={{ fontSize: '2rem', opacity: 0.3 }}>🪵</span>
                    )}
                  </div>
                  <div>
                    <Link 
                      href={`/products/${item.productId}`}
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.1rem',
                        fontWeight: '500',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {item.product.name}
                    </Link>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--color-text-secondary)',
                      marginTop: '0.25rem',
                    }}>
                      {item.product.woodType && `${item.product.woodType} • `}
                      {item.product.finish}
                    </p>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--color-text-secondary)',
                    }}>
                      {formatPrice(item.product.price)}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    style={{
                      width: '32px',
                      height: '32px',
                      border: '1px solid var(--color-border)',
                      borderRadius: '6px',
                      background: 'var(--color-surface)',
                      cursor: 'pointer',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    -
                  </button>
                  <span style={{ 
                    width: '40px', 
                    textAlign: 'center',
                    fontWeight: '500',
                  }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.product.inventory}
                    style={{
                      width: '32px',
                      height: '32px',
                      border: '1px solid var(--color-border)',
                      borderRadius: '6px',
                      background: 'var(--color-surface)',
                      cursor: 'pointer',
                      color: 'var(--color-text-primary)',
                      opacity: item.quantity >= item.product.inventory ? 0.5 : 1,
                    }}
                  >
                    +
                  </button>
                </div>

                <div style={{ textAlign: 'right', minWidth: '100px' }}>
                  <div style={{ 
                    fontWeight: '600',
                    color: 'var(--color-text-primary)',
                    marginBottom: '0.5rem',
                  }}>
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-text-secondary)',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div style={{ marginTop: '1rem' }}>
              <Link 
                href="/products"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--color-accent)',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>

          <div className="card" style={{ position: 'sticky', top: '100px' }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              marginBottom: '1.5rem',
              fontFamily: 'var(--font-heading)',
            }}>
              Order Summary
            </h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
                color: 'var(--color-text-secondary)',
              }}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
                color: 'var(--color-text-secondary)',
              }}>
                <span>Shipping</span>
                <span>{formatPrice(shipping)}</span>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '1rem 0',
              borderTop: '1px solid var(--color-border)',
              borderBottom: '1px solid var(--color-border)',
              marginBottom: '1.5rem',
            }}>
              <span style={{ fontWeight: '600' }}>Total</span>
              <span style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600',
                color: 'var(--color-accent)',
              }}>
                {formatPrice(total)}
              </span>
            </div>

            <Link href="/checkout" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
              Proceed to Checkout
            </Link>

            <p style={{ 
              fontSize: '0.75rem', 
              color: 'var(--color-text-secondary)',
              textAlign: 'center',
              marginTop: '1rem',
            }}>
              Shipping calculated at checkout
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
