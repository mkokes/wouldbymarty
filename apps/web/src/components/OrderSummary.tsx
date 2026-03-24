'use client';

import { ReactNode } from 'react';

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  children?: ReactNode;
}

export function OrderSummary({ subtotal, shipping, children }: OrderSummaryProps) {
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const total = subtotal + shipping;

  return (
    <div className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
      <h3 style={{ 
        marginBottom: '1.5rem',
        fontFamily: 'var(--font-heading)',
        fontSize: '1.25rem',
      }}>
        Order Summary
      </h3>
      
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

      {children}
    </div>
  );
}
