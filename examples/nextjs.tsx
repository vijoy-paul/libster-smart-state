/**
 * Next.js Example
 *
 * Demonstrates SmartState in the Next.js App Router (client component)
 * and shows patterns for the Pages Router as comments.
 *
 * @libster/smart-state ships "use client" in the bundle, so importing it
 * inside a Server Component is safe — it will be rendered client-side.
 */

'use client';

import { useState, useEffect } from 'react';
import { SmartState } from '@libster/smart-state';
import '@libster/smart-state/styles';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
      }}
    >
      {products.map((p) => (
        <div
          key={p.id}
          style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
        >
          <h3 style={{ margin: '0 0 0.5rem' }}>{p.name}</h3>
          <p style={{ margin: 0, color: '#6b7280' }}>${p.price.toFixed(2)}</p>
          <p
            style={{
              margin: '0.25rem 0 0',
              fontSize: '0.75rem',
              color: p.stock > 0 ? '#16a34a' : '#dc2626',
            }}
          >
            {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── App Router — Client Component ─────────────────────────────────────────────

/**
 * Place in: app/products/page.tsx
 * Add 'use client' at the top of that file.
 */
export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => { setOffline(false); void loadProducts(); };
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  const loadProducts = () => {
    setLoading(true);
    return fetch('/api/products')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Product[]>;
      })
      .then(setProducts)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err : new Error('Failed to load'))
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Products</h1>
      <SmartState<Product[]> loading={loading} error={error} offline={offline} data={products}>
        <ProductGrid products={products} />
      </SmartState>
    </main>
  );
}

/**
 * App Router — Server Component + Client Component pattern:
 *
 * // app/dashboard/page.tsx  (Server Component, no 'use client')
 * import { DashboardClient } from './DashboardClient';
 * export default async function DashboardPage() {
 *   const stats = await fetchStats();   // runs on server
 *   return <DashboardClient stats={stats} />;
 * }
 *
 * // app/dashboard/DashboardClient.tsx  ('use client')
 * export function DashboardClient({ stats }) {
 *   return (
 *     <SmartState data={stats}>
 *       <StatsGrid stats={stats} />
 *     </SmartState>
 *   );
 * }
 */

/**
 * Pages Router — getServerSideProps:
 *
 * export const getServerSideProps: GetServerSideProps = async () => {
 *   const products = await fetchProducts();
 *   return { props: { products } };
 * };
 *
 * export default function ProductsPage({ products }: { products: Product[] }) {
 *   return (
 *     <SmartState data={products}>
 *       <ProductGrid products={products} />
 *     </SmartState>
 *   );
 * }
 */
