import Link from 'next/link';

export default function ProductsPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Our Products</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Categories</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['All', 'Furniture', 'Decor', 'Kitchen', 'Wall Art', 'Custom'].map((category) => (
            <Link
              key={category}
              href={category === 'All' ? '/products' : `/products?category=${category.toLowerCase()}`}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #ddd',
                borderRadius: '20px',
                fontSize: '0.9rem',
              }}
            >
              {category}
            </Link>
          ))}
        </div>
      </div>

      <p style={{ color: '#666' }}>
        Products will be loaded from Convex database. Run `npx convex dev` to set up your backend.
      </p>
    </main>
  );
}
