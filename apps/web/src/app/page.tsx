import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
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
