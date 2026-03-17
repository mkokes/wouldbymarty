import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          WouldByMarty
        </h1>
        <p style={{ color: '#666', fontSize: '1.2rem' }}>
          Custom Woodworking Crafts
        </p>
      </header>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Welcome to Our Shop</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
          We specialize in handcrafted woodworking products made with care and precision.
          From custom furniture to unique decor pieces, each item is made to order.
        </p>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Categories</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {['Furniture', 'Decor', 'Kitchen', 'Wall Art', 'Custom'].map((category) => (
            <Link
              key={category}
              href={`/products?category=${category.toLowerCase()}`}
              style={{
                display: 'block',
                padding: '1.5rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                textAlign: 'center',
                transition: 'transform 0.2s',
              }}
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section style={{ textAlign: 'center', padding: '2rem', background: '#f9f9f9', borderRadius: '12px' }}>
        <h2 style={{ marginBottom: '1rem' }}>Ready to Shop?</h2>
        <p style={{ marginBottom: '1.5rem', color: '#666' }}>
          Browse our collection and find the perfect piece for your home.
        </p>
        <Link
          href="/products"
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            background: '#333',
            color: '#fff',
            borderRadius: '8px',
            fontWeight: 'bold',
          }}
        >
          View All Products
        </Link>
      </section>
    </main>
  );
}
