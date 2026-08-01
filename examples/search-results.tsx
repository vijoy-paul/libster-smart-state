/**
 * Search Results Example
 * Demonstrates SmartState with a custom emptyComponent that shows the query.
 */
import React, { useState } from 'react';
import { SmartState } from '@libster/smart-state';
import '@libster/smart-state/styles';

interface Result {
  id: number;
  title: string;
}

const ALL_RESULTS: Result[] = [
  { id: 1, title: 'React Hooks Deep Dive' },
  { id: 2, title: 'TypeScript Best Practices' },
  { id: 3, title: 'Vite vs Webpack' },
  { id: 4, title: 'Testing with Vitest' },
];

export default function SearchResultsExample() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[] | null>(null);

  const handleSearch = () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults(null);

    // Simulate async search
    setTimeout(() => {
      const filtered = ALL_RESULTS.filter((r) =>
        r.title.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px' }}>
      <h1>Search</h1>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input
          type="search"
          placeholder="Search articles…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          style={{ flex: 1, padding: '0.5rem', fontSize: '1rem' }}
        />
        <button onClick={handleSearch} style={{ padding: '0.5rem 1rem' }}>
          Search
        </button>
      </div>

      {results !== null && (
        <SmartState
          loading={loading}
          data={results}
          emptyComponent={
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              No results for &ldquo;<strong>{query}</strong>&rdquo;. Try another term.
            </div>
          }
        >
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r) => (
              <li
                key={r.id}
                style={{ padding: '0.75rem', borderBottom: '1px solid #f3f4f6' }}
              >
                {r.title}
              </li>
            ))}
          </ul>
        </SmartState>
      )}
    </div>
  );
}
