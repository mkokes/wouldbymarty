'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Order {
  _id: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  status: string;
  total: number;
  createdAt: number;
  shippingAddress: {
    line1: string;
    city: string;
    state: string;
    postal_code: string;
  };
}

const MOCK_ORDERS: Order[] = [
  {
    _id: 'ORD-001',
    items: [
      { name: 'Walnut Cutting Board', quantity: 1, price: 8500 },
      { name: 'Oak Floating Shelves (set of 3)', quantity: 1, price: 15000 },
    ],
    status: 'delivered',
    total: 23500,
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    shippingAddress: {
      line1: '123 Main St',
      city: 'Portland',
      state: 'OR',
      postal_code: '97201',
    },
  },
  {
    _id: 'ORD-002',
    items: [
      { name: 'Maple Dining Table', quantity: 1, price: 250000 },
    ],
    status: 'shipped',
    total: 252500,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    shippingAddress: {
      line1: '123 Main St',
      city: 'Portland',
      state: 'OR',
      postal_code: '97201',
    },
  },
  {
    _id: 'ORD-003',
    items: [
      { name: 'Cherry Wood Wall Art', quantity: 2, price: 24000 },
    ],
    status: 'paid',
    total: 24000,
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    shippingAddress: {
      line1: '123 Main St',
      city: 'Portland',
      state: 'OR',
      postal_code: '97201',
    },
  },
];

function getStatusColor(status: string): { bg: string; text: string } {
  switch (status) {
    case 'paid':
      return { bg: 'var(--color-accent)', text: 'var(--color-text-primary)' };
    case 'shipped':
      return { bg: '#005F73', text: '#fff' };
    case 'delivered':
      return { bg: '#2D6A4F', text: '#fff' };
    case 'cancelled':
      return { bg: '#AE2012', text: '#fff' };
    default:
      return { bg: 'var(--color-bg-secondary)', text: 'var(--color-text-secondary)' };
  }
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setOrders(MOCK_ORDERS);
      setLoading(false);
    }, 500);
  }, []);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ 
        marginBottom: '2rem',
        fontFamily: 'var(--font-heading)',
        fontSize: '2.5rem',
        color: 'var(--color-text-primary)',
      }}>
        My Orders
      </h1>

      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          color: 'var(--color-text-secondary)',
        }}>
          <p>Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          backgroundColor: 'var(--color-bg-secondary)',
          borderRadius: '12px',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
          <h2 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
            No orders yet
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
            Once you place an order, it will appear here.
          </p>
          <Link href="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => {
            const statusStyle = getStatusColor(order.status);
            return (
              <article 
                key={order._id}
                className="card"
                style={{ padding: '1.5rem' }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}>
                  <div>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--color-text-secondary)',
                    }}>
                      Order #{order._id}
                    </span>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--color-text-secondary)',
                      marginTop: '0.25rem',
                    }}>
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    backgroundColor: statusStyle.bg,
                    color: statusStyle.text,
                  }}>
                    {order.status}
                  </span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  {order.items.map((item, idx) => (
                    <div 
                      key={idx}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        padding: '0.5rem 0',
                        borderBottom: idx < order.items.length - 1 ? '1px solid var(--color-border)' : 'none',
                      }}
                    >
                      <span style={{ color: 'var(--color-text-primary)' }}>
                        {item.name} × {item.quantity}
                      </span>
                      <span style={{ color: 'var(--color-text-secondary)' }}>
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--color-border)',
                }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      Ship to
                    </span>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--color-text-primary)',
                      marginTop: '0.25rem',
                    }}>
                      {order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postal_code}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      Total
                    </span>
                    <p style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: 600,
                      color: 'var(--color-accent)',
                      marginTop: '0.25rem',
                    }}>
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}