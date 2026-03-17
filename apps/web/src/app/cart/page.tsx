export default function CartPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Shopping Cart</h1>
      
      <div style={{ padding: '2rem', background: '#f9f9f9', borderRadius: '12px', textAlign: 'center' }}>
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          Your cart is empty
        </p>
        <p style={{ color: '#888' }}>
          Products will be loaded from Convex database. Run `npx convex dev` to set up your backend.
        </p>
      </div>
    </main>
  );
}
