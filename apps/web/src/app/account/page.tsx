'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function AccountPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <p>Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          marginBottom: '2rem', 
          fontFamily: 'var(--font-heading)',
          fontSize: '2.5rem',
          color: 'var(--color-text-primary)',
        }}>
          My Account
        </h1>
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          backgroundColor: 'var(--color-bg-secondary)',
          borderRadius: '12px',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔐</div>
          <h2 style={{ marginBottom: '1rem' }}>Sign in to view your account</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
            You need to be signed in to access your account settings and order history.
          </p>
          <Link href="/products" className="btn btn-primary">
            Continue Shopping
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
        My Account
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              color: 'var(--color-text-primary)',
            }}>
              {user.firstName?.[0] || user.username?.[0] || '?'}
            </div>
            <div>
              <h3 style={{ margin: 0 }}>{user.fullName || user.username}</h3>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>

        <Link href="/orders" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ padding: '1.5rem', cursor: 'pointer', transition: 'all 0.2s' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>📦 Orders</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', margin: 0 }}>
              View your order history and track shipments
            </p>
          </div>
        </Link>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>📍 Addresses</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            Manage your shipping addresses
          </p>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>💳 Payment Methods</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            Add or remove payment methods
          </p>
        </div>
      </div>

      <section style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Account Settings</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Profile Information</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', margin: 0 }}>
              Update your name, email, and profile picture
            </p>
          </div>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Security</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', margin: 0 }}>
              Change your password and manage security settings
            </p>
          </div>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Notifications</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', margin: 0 }}>
              Configure email notifications and preferences
            </p>
          </div>
        </div>
      </section>

      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <button
          onClick={() => {
            const url = `https://internal-59.clerk.accounts.dev/user`;
            window.open(url, '_blank');
          }}
          className="btn btn-secondary"
        >
          Manage Account in Clerk
        </button>
      </div>
    </main>
  );
}