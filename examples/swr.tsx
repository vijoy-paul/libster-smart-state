/**
 * SWR Example
 *
 * Demonstrates SmartState with SWR (stale-while-revalidate).
 * SWR's isLoading/error/data props map directly to SmartState.
 *
 * Setup:
 *   npm install swr
 *
 * Key note: Use `isLoading` (not `isValidating`) so SmartState only shows
 * the loading state on the initial fetch, not on background revalidations.
 */

import useSWR from 'swr';
import { SmartState } from '@libster/smart-state';
import '@libster/smart-state/styles';

interface Post {
  id: number;
  title: string;
  body: string;
}

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json() as Promise<Post[]>;
  });

function PostCard({ post }: { post: Post }) {
  return (
    <article
      style={{
        padding: '1rem',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
      }}
    >
      <h2 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>{post.title}</h2>
      <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>{post.body}</p>
    </article>
  );
}

export function PostList() {
  const { data: posts, error, isLoading } = useSWR<Post[]>('/api/posts', fetcher);

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Posts</h1>

      {/*
       * Pass `data={posts}` (not `posts ?? []`) so SmartState sees `undefined`
       * on the first render and skips empty detection until data actually loads.
       */}
      <SmartState<Post[]> loading={isLoading} error={error} data={posts}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {(posts ?? []).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </SmartState>
    </div>
  );
}

export function PostListWithRefresh() {
  const {
    data: posts,
    error,
    isLoading,
    mutate,
  } = useSWR<Post[]>('/api/posts', fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 5000,
  });

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}
      >
        <h1 style={{ margin: 0 }}>Posts</h1>
        <button
          onClick={() => void mutate()}
          style={{
            padding: '0.4rem 1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            cursor: 'pointer',
          }}
        >
          Refresh
        </button>
      </div>

      <SmartState<Post[]> loading={isLoading} error={error} data={posts}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {(posts ?? []).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </SmartState>
    </div>
  );
}
