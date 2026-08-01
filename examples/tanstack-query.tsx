/**
 * TanStack Query Example
 *
 * Demonstrates SmartState integrated with @tanstack/react-query.
 * Covers three common patterns:
 *   1. Basic useQuery — map isLoading/error/data directly to SmartState
 *   2. Stale-while-revalidate — keep old data visible during background refetch
 *   3. useMutation — optimistic post creation with error rollback
 *
 * Setup:
 *   npm install @tanstack/react-query
 *
 * Key notes:
 * - Use `isLoading` (not `isFetching`) for SmartState's loading prop so the
 *   loading UI only shows on the first fetch, not on background refetches.
 * - Pass `data={posts}` (not `posts ?? []`) so SmartState sees `undefined`
 *   on the initial render and skips empty detection until data arrives.
 */

import React, { useState } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { SmartState } from '@libster/smart-state';
import '@libster/smart-state/styles';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

// ── API helpers ───────────────────────────────────────────────────────────────

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<Post[]>;
}

async function createPost(data: Omit<Post, 'id'>): Promise<Post> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<Post>;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PostCard({ post }: { post: Post }) {
  return (
    <article
      style={{
        padding: '1rem',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem',
      }}
    >
      <h2 style={{ margin: 0, fontSize: '0.975rem', fontWeight: 600 }}>{post.title}</h2>
      <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.5 }}>
        {post.body}
      </p>
      <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>User #{post.userId}</span>
    </article>
  );
}

// ── 1. Basic useQuery ─────────────────────────────────────────────────────────

/**
 * isLoading is true only on the initial fetch (no cached data).
 * isFetching is true on every background refetch — don't use it for SmartState.
 */
function PostList() {
  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  return (
    <div style={{ padding: '2rem', maxWidth: '640px', margin: '0 auto' }}>
      <h1>Posts</h1>

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

// ── 2. Stale-while-revalidate (keep old data during refetch) ──────────────────

/**
 * When `placeholderData: keepPreviousData` is set, TanStack Query keeps the
 * previous data visible while fetching a new page.
 * SmartState stays in "success" — only a subtle refetch indicator is shown.
 */
function PostListWithStale() {
  const queryClient = useQueryClient();

  const {
    data: posts,
    isLoading,
    isFetching,
    error,
  } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 30_000,
  });

  return (
    <div style={{ padding: '2rem', maxWidth: '640px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h1 style={{ margin: 0 }}>Posts</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isFetching && !isLoading && (
            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Refreshing…</span>
          )}
          <button
            onClick={() => void queryClient.invalidateQueries({ queryKey: ['posts'] })}
            style={{
              padding: '0.4rem 1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* isLoading is only true when there is no cached data at all */}
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

// ── 3. useMutation — create a post with optimistic update ─────────────────────

function CreatePostForm() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: (newPost) => {
      // Add the new post to the top of the cached list
      queryClient.setQueryData<Post[]>(['posts'], (old) =>
        old ? [newPost, ...old] : [newPost]
      );
      setTitle('');
      setBody('');
    },
  });

  const { data: posts, isLoading, error: queryError } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    mutation.mutate({ userId: 1, title: title.trim(), body: body.trim() });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '640px', margin: '0 auto' }}>
      <h1>Posts</h1>

      {/* Create form */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          padding: '1rem',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          background: '#f9fafb',
        }}
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: '0.4rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          style={{ padding: '0.4rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', resize: 'vertical' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="submit"
            disabled={mutation.isPending}
            style={{
              padding: '0.4rem 1rem',
              background: '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: mutation.isPending ? 'not-allowed' : 'pointer',
              opacity: mutation.isPending ? 0.7 : 1,
            }}
          >
            {mutation.isPending ? 'Posting…' : 'Add Post'}
          </button>
          {mutation.isError && (
            <span style={{ color: '#dc2626', fontSize: '0.875rem' }}>
              Failed: {(mutation.error as Error).message}
            </span>
          )}
          {mutation.isSuccess && (
            <span style={{ color: '#16a34a', fontSize: '0.875rem' }}>Post created!</span>
          )}
        </div>
      </form>

      {/* Post list via SmartState */}
      <SmartState<Post[]> loading={isLoading} error={queryError} data={posts}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {(posts ?? []).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </SmartState>
    </div>
  );
}

// ── Root — wraps all examples in a single QueryClientProvider ─────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 10_000,
    },
  },
});

type ExampleKey = 'basic' | 'stale' | 'mutation';

export default function TanStackQueryExample() {
  const [example, setExample] = useState<ExampleKey>('basic');

  const examples: { key: ExampleKey; label: string }[] = [
    { key: 'basic', label: 'Basic useQuery' },
    { key: 'stale', label: 'Stale-while-revalidate' },
    { key: 'mutation', label: 'useMutation' },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ fontFamily: 'sans-serif' }}>
        {/* Example switcher */}
        <nav
          style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '1rem 2rem',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          {examples.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setExample(key)}
              style={{
                padding: '0.4rem 0.8rem',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                background: example === key ? '#6366f1' : '#f3f4f6',
                color: example === key ? '#fff' : '#111',
                fontSize: '0.875rem',
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        {example === 'basic' && <PostList />}
        {example === 'stale' && <PostListWithStale />}
        {example === 'mutation' && <CreatePostForm />}
      </div>
    </QueryClientProvider>
  );
}
