import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { ConvexClientProvider } from './ConvexClientProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
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
    <ClerkProvider>
      <ConvexClientProvider>
        <ThemeProvider>
            <html lang="en" suppressHydrationWarning>
              <body>
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
                    alignItems: 'flex-start',
                    textDecoration: 'none',
                  }}>
                    <span style={{ 
                      fontFamily: 'Chango, sans-serif',
                      fontSize: '2rem',
                      color: 'var(--color-text-primary)',
                      lineHeight: 1,
                    }}>
                      Would?
                    </span>
                    <span style={{ 
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: 'var(--color-text-secondary)',
                      border: '1px solid var(--color-text-secondary)',
                      borderRadius: '6px',
                      padding: '0.15rem 0.4rem',
                      marginTop: '0.25rem',
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
              </body>
            </html>
          </ThemeProvider>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
