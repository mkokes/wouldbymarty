'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/api';

interface CartItem {
  productId: string;
  quantity: number;
}

interface ShippingAddress {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
}

export type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'confirmation';

interface CheckoutFormProps {
  initialStep?: CheckoutStep;
}

export function CheckoutForm({ initialStep = 'cart' }: CheckoutFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<CheckoutStep>(initialStep);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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

  const subtotal = cartItemsWithProducts.reduce(
    (sum, item) => sum + (item.product.price * item.quantity), 
    0
  );
  const shipping = subtotal > 0 ? 2500 : 0;
  const total = subtotal + shipping;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('confirmation');
  };

  const steps: CheckoutStep[] = ['cart', 'shipping', 'payment', 'confirmation'];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (cartItems.length === 0 && step === 'cart') {
    return (
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
    );
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: 'var(--color-bg-secondary)',
        borderRadius: '8px',
      }}>
        {steps.map((s, idx) => {
          const isActive = step === s;
          const currentIdx = steps.indexOf(step);
          const isPast = currentIdx > idx;
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
            {cartItemsWithProducts.map((item) => (
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
                  <p style={{ fontWeight: 500 }}>{item.product.name}</p>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    Quantity: {item.quantity}
                  </p>
                </div>
                <span style={{ fontWeight: 600 }}>{formatPrice(item.product.price * item.quantity)}</span>
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
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
              Payment integration coming soon. This is a demo checkout.
            </p>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--color-bg-secondary)', 
              borderRadius: '8px',
              textAlign: 'center',
            }}>
              <p style={{ fontWeight: 500 }}>Demo Mode</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Click "Place Order" to simulate a successful order
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" onClick={() => setStep('shipping')} className="btn btn-secondary">
              Back
            </button>
            <button type="submit" className="btn btn-primary">
              Place Order
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
    </div>
  );
}
