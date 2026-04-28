import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { ConvexClientProvider } from './ConvexClientProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { MSWProvider } from '@/components/MSWProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThemeSelector } from '@/components/ThemeSelector';
import AuthButtons from './AuthButtons';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Would? By Marty - Custom Woodworking Crafts',
  description: 'Handcrafted woodworking products - furniture, decor, kitchen items, and custom pieces',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClerkProvider>
          <ConvexClientProvider>
            <ThemeProvider>
              <MSWProvider>
                <header style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 2rem',
                  borderBottom: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  position: 'sticky',
                  top: 0,
                  zIndex: 100,
                }}>
                  <Link href="/" style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '12px',
                    width: 'fit-content',
                    textDecoration: 'none',
                  }}>
                    <span style={{ 
                      fontFamily: 'Chango, sans-serif',
                      fontWeight: 400,
                      fontSize: '2.5rem',
                      lineHeight: 1,
                      color: 'var(--color-text-primary)',
                      letterSpacing: '-1px',
                      margin: 0,
                    }}>
                      Would?
                    </span>
                    <span style={{ 
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      color: 'var(--color-text-primary)',
                      borderTop: '2px solid var(--color-text-primary)',
                      paddingTop: '8px',
                    }}>
                      By Marty
                    </span>
                  </Link>
                  <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link href="/products" style={{ 
                      color: 'var(--color-text-secondary)',
                      fontWeight: 500,
                    }}>
                      Products
                    </Link>
                    <Link href="/cart" style={{ 
                      color: 'var(--color-text-secondary)',
                      fontWeight: 500,
                    }}>
                      Cart
                    </Link>
                    <Link href="/orders" style={{ 
                      color: 'var(--color-text-secondary)',
                      fontWeight: 500,
                    }}>
                      Orders
                    </Link>
                    <Link href="/account" style={{ 
                      color: 'var(--color-text-secondary)',
                      fontWeight: 500,
                    }}>
                      Account
                    </Link>
                    <div style={{ 
                      width: '1px', 
                      height: '24px', 
                      backgroundColor: 'var(--color-border)',
                      margin: '0 0.5rem',
                    }} />
                    <ThemeSelector />
                    <ThemeToggle />
                    <AuthButtons />
                  </nav>
                </header>
                <main>
                  {children}
                </main>
              </MSWProvider>
            </ThemeProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
