/**
 * useSmartState Hook Example
 * Demonstrates using the hook directly for custom rendering logic.
 */
import React, { useState } from 'react';
import { useSmartState } from '@libster/smart-state';

interface Item {
  id: number;
  name: string;
}

const ITEMS: Item[] = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' },
];

function StatusBar({ state }: { state: string }) {
  const colors: Record<string, string> = {
    loading: '#fef3c7',
    error: '#fee2e2',
    empty: '#f3f4f6',
    success: '#dcfce7',
    offline: '#fef9c3',
    unauthorized: '#ede9fe',
    forbidden: '#fef2f2',
    notFound: '#f9fafb',
    maintenance: '#fff7ed',
    custom: '#f0f9ff',
  };

  return (
    <div
      style={{
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        background: colors[state] ?? '#f3f4f6',
        fontFamily: 'monospace',
        marginBottom: '1rem',
      }}
    >
      Current state: <strong>{state}</strong>
    </div>
  );
}

export default function UseSmartStateHookExample() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [items, setItems] = useState<Item[]>(ITEMS);

  const { state, isLoading, isError, isEmpty, isSuccess } = useSmartState({
    loading,
    error,
    data: items,
  });

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '500px' }}>
      <h1>useSmartState Hook</h1>
      <StatusBar state={state} />

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button onClick={() => setLoading((v) => !v)}>Toggle Loading</button>
        <button onClick={() => setError((e) => (e ? null : new Error('Oops!')))}>
          Toggle Error
        </button>
        <button onClick={() => setItems([])}>Clear Items</button>
        <button onClick={() => setItems(ITEMS)}>Restore Items</button>
      </div>

      {isLoading && <p>⏳ Loading…</p>}
      {isError && <p style={{ color: 'red' }}>❌ Error: {error?.message}</p>}
      {isEmpty && <p style={{ color: '#6b7280' }}>📭 No items found.</p>}
      {isSuccess && (
        <ul>
          {items.map((i) => (
            <li key={i.id}>{i.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
