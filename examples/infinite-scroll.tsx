/**
 * Infinite Scroll Example
 * Demonstrates SmartState with a custom isEmpty function
 * and paginated data loading simulation.
 */
import React, { useState, useCallback } from 'react';
import { SmartState } from '@libster/smart-state';
import '@libster/smart-state/styles';

interface FeedItem {
  id: number;
  text: string;
}

const ALL_FEED: FeedItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  text: `Feed item #${i + 1} — ${new Date().toLocaleTimeString()}`,
}));

export default function InfiniteScrollExample() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);

    setTimeout(() => {
      const next = ALL_FEED.slice(page * 5, (page + 1) * 5);
      setItems((prev) => [...prev, ...next]);
      setPage((p) => p + 1);
      setHasMore((page + 1) * 5 < ALL_FEED.length);
      setLoading(false);
    }, 700);
  }, [loading, hasMore, page]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '500px' }}>
      <h1>Infinite Scroll</h1>

      <SmartState
        loading={loading && items.length === 0}
        data={items}
        isEmpty={(d) => d.length === 0 && !loading}
        emptyComponent={
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            <p>📭 No posts yet.</p>
            <button onClick={loadMore}>Load first posts</button>
          </div>
        }
      >
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                padding: '0.75rem',
                marginBottom: '0.5rem',
                background: '#f9fafb',
                borderRadius: '6px',
              }}
            >
              {item.text}
            </li>
          ))}
        </ul>

        {loading && items.length > 0 && (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>Loading more…</p>
        )}

        {hasMore && !loading && items.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button onClick={loadMore} style={{ padding: '0.5rem 1.5rem' }}>
              Load more
            </button>
          </div>
        )}

        {!hasMore && (
          <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: '1rem' }}>
            ✓ All items loaded
          </p>
        )}
      </SmartState>

      {items.length === 0 && !loading && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button onClick={loadMore} style={{ padding: '0.5rem 1.5rem' }}>
            Load feed
          </button>
        </div>
      )}
    </div>
  );
}
