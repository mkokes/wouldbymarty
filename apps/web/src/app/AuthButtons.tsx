'use client';

import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function AuthButtons() {
  const { userId } = useAuth();
  const router = useRouter();

  if (userId) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <UserButton />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <SignInButton mode="modal">
        <button style={{ 
          padding: '0.5rem 1rem', 
          cursor: 'pointer', 
          border: '1px solid var(--color-border)', 
          borderRadius: '6px', 
          background: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
        }}>
          Sign In
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button style={{ 
          padding: '0.5rem 1rem', 
          cursor: 'pointer', 
          border: '1px solid var(--color-text-primary)', 
          borderRadius: '6px', 
          background: 'var(--color-text-primary)', 
          color: 'var(--color-bg-primary)',
        }}>
          Sign Up
        </button>
      </SignUpButton>
    </div>
  );
}
