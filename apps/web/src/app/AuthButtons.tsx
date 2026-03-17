'use client';

import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function AuthButtons() {
  const { userId } = useAuth();
  const router = useRouter();

  if (userId) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <UserButton afterSignOutUrl="/" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <SignInButton mode="modal">
        <button style={{ padding: '0.5rem 1rem', cursor: 'pointer', border: '1px solid #ddd', borderRadius: '6px', background: 'white' }}>
          Sign In
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button style={{ padding: '0.5rem 1rem', cursor: 'pointer', border: '1px solid #333', borderRadius: '6px', background: '#333', color: 'white' }}>
          Sign Up
        </button>
      </SignUpButton>
    </div>
  );
}
