'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CartItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
}

interface ShippingAddress {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
}

type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'confirmation';

export default function CheckoutPage() {
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
  });
  const [loading, setLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const items = JSON.parse(storedCart);
      const itemsWithNames = items.map((item: CartItem) => ({
        ...item,
        name: getProductName(item.productId),
        price: getProductPrice(item.productId),
      }));
      setCartItems(itemsWithNames);
    }
    setLoading(false);

    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setStep('confirmation');
      localStorage.removeItem('cart');
    } else if (params.get('canceled') === 'true') {
      setStep('payment');
    }
  }, []);

  function getProductName(productId: string): string {
    const products: Record<string, string> = {
      '1': 'Walnut Cutting Board',
      '2': 'Oak Floating Shelves',
      '3': 'Maple Dining Table',
      '4': 'Cherry Wood Wall Art',
      '5': 'Custom Butcher Block',
      '6': 'Walnut Coffee Table',
    };
    return products[productId] || 'Unknown Product';
  }

  function getProductPrice(productId: string): number {
    const prices: Record<string, number> = {
      '1': 8500,
      '2': 15000,
      '3': 250000,
      '4': 12000,
      '5': 9500,
      '6': 18500,
    };
    return prices[productId] || 0;
  }

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 2500 : 0;
  const total = subtotal + shipping;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          shippingAddress,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        alert('Payment failed: ' + data.error);
        setIsProcessingPayment(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to process payment');
      setIsProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <p>Loading...</p>
      </main>
    );
  }

  if (cartItems.length === 0 && step === 'cart') {
    return (
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem', fontFamily: 'var(--font-heading)' }}>Checkout</h1>
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          backgroundColor: 'var(--color-bg-secondary)',
          borderRadius: '12px',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
          <h2 style={{ marginBottom: '1rem' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
            Add some items to your cart before checking out.
          </p>
          <Link href="/products" className="btn btn-primary">
            Browse Products
          </Link>
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
        Checkout
      </h1>

      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: 'var(--color-bg-secondary)',
        borderRadius: '8px',
      }}>
        {['cart', 'shipping', 'payment', 'confirmation'].map((s, idx) => {
          const isActive = step === s;
          const isPast = ['cart', 'shipping', 'payment', 'confirmation'].indexOf(step) > idx;
          return (
            <div
              key={s}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '0.5rem',
                borderRadius: '4px',
                backgroundColor: isActive ? 'var(--color-accent)' : isPast ? 'var(--color-surface)' : 'transparent',
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 400,
                textTransform: 'capitalize',
              }}
            >
              {idx + 1}. {s}
            </div>
          );
        })}
      </div>

      {step === 'cart' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
          <div>
            <h2 style={{ marginBottom: '1rem' }}>Review Your Cart</h2>
            {cartItems.map((item) => (
              <div 
                key={item.productId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderBottom: '1px solid var(--color-border)',
                  alignItems: 'center',
                }}
              >
                <div>
                  <p style={{ fontWeight: 500 }}>{item.name}</p>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    Quantity: {item.quantity}
                  </p>
                </div>
                <span style={{ fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ marginBottom: '1rem' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span>Shipping</span>
              <span>{formatPrice(shipping)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
              <span style={{ fontWeight: 600 }}>Total</span>
              <span style={{ fontWeight: 600, fontSize: '1.25rem', color: 'var(--color-accent)' }}>
                {formatPrice(total)}
              </span>
            </div>
            <button 
              onClick={() => setStep('shipping')}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Continue to Shipping
            </button>
          </div>
        </div>
      )}

      {step === 'shipping' && (
        <form onSubmit={handleShippingSubmit} style={{ maxWidth: '600px' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Shipping Address</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                Address Line 1 *
              </label>
              <input
                type="text"
                required
                value={shippingAddress.line1}
                onChange={(e) => setShippingAddress({ ...shippingAddress, line1: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                Address Line 2
              </label>
              <input
                type="text"
                value={shippingAddress.line2}
                onChange={(e) => setShippingAddress({ ...shippingAddress, line2: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                ZIP Code *
              </label>
              <input
                type="text"
                required
                value={shippingAddress.postal_code}
                onChange={(e) => setShippingAddress({ ...shippingAddress, postal_code: e.target.value })}
                style={{
                  width: '200px',
                  padding: '0.75rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" onClick={() => setStep('cart')} className="btn btn-secondary">
              Back
            </button>
            <button type="submit" className="btn btn-primary">
              Continue to Payment
            </button>
          </div>
        </form>
      )}

      {step === 'payment' && (
        <form onSubmit={handlePaymentSubmit} style={{ maxWidth: '600px' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Payment</h2>
          
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Order Total</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-accent)' }}>
                {formatPrice(total)}
              </p>
            </div>
            
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--color-bg-secondary)', 
              borderRadius: '8px',
              marginBottom: '1rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                <span style={{ fontWeight: 500 }}>Credit Card</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Secure payment via Stripe. Accepts Visa, Mastercard, Amex, and more.
              </p>
            </div>

            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--color-bg-secondary)', 
              borderRadius: '8px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>💵</span>
                <span style={{ fontWeight: 500 }}>Venmo</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Pay with Venmo - available as payment option on next page
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              type="button" 
              onClick={() => setStep('shipping')} 
              className="btn btn-secondary"
              disabled={isProcessingPayment}
            >
              Back
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isProcessingPayment}
              style={{ flex: 1 }}
            >
              {isProcessingPayment ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </form>
      )}

      {step === 'confirmation' && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ marginBottom: '1rem' }}>Order Confirmed!</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
            Thank you for your order. You will receive an email confirmation shortly.
          </p>
          <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Order Total</p>
            <p style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--color-accent)' }}>
              {formatPrice(total)}
            </p>
          </div>
          <Link href="/orders" className="btn btn-primary">
            View My Orders
          </Link>
        </div>
      )}
    </main>
  );
}