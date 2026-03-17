import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-end',
          gap: '12px',
          marginBottom: '1rem',
        }}>
          <h1 style={{ 
            fontFamily: 'Chango, sans-serif',
            fontWeight: 400,
            fontSize: '4rem',
            lineHeight: 1,
            color: 'var(--color-text-primary)',
            letterSpacing: '-1px',
            margin: 0,
          }}>
            Would?
          </h1>
          <span style={{ 
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 500,
            fontSize: '1rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--color-text-primary)',
            borderTop: '2px solid var(--color-text-primary)',
            paddingTop: '8px',
          }}>
            By Marty
          </span>
        </div>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem' }}>
          Custom Woodworking Crafts
        </p>
      </header>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Welcome to Our Shop</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>
          We specialize in handcrafted woodworking products made with care and precision.
          From custom furniture to unique decor pieces, each item is made to order.
        </p>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Categories</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {['Furniture', 'Decor', 'Kitchen', 'Wall Art', 'Custom'].map((category) => (
            <Link
              key={category}
              href={`/products?category=${category.toLowerCase()}`}
              style={{
                display: 'block',
                padding: '1.5rem',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                textAlign: 'center',
                color: 'var(--color-text-primary)',
                transition: 'all 0.2s',
              }}
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section style={{ 
        textAlign: 'center', 
        padding: '2rem', 
        backgroundColor: 'var(--color-bg-secondary)', 
        borderRadius: '12px' 
      }}>
        <h2 style={{ marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Ready to Shop?</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-secondary)' }}>
          Browse our collection and find the perfect piece for your home.
        </p>
        <Link
          href="/products"
          className="btn btn-primary"
        >
          View All Products
        </Link>
      </section>
    </main>
  );
}
