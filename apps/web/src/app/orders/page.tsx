import { auth } from '@clerk/nextjs/server';

export default async function OrdersPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem' }}>My Orders</h1>
        <p>Please sign in to view your orders.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>My Orders</h1>
      
      <div style={{ padding: '2rem', background: '#f9f9f9', borderRadius: '12px', textAlign: 'center' }}>
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          No orders yet
        </p>
        <p style={{ color: '#888' }}>
          Orders will be loaded from Convex database. Run `npx convex dev` to set up your backend.
        </p>
      </div>
    </main>
  );
}
