/**
 * React Router Example
 *
 * Demonstrates SmartState with React Router v6+ data APIs:
 * - useLoaderData for server/client loader results
 * - useNavigation for in-flight loading state
 * - errorElement / useRouteError for error boundaries
 *
 * Setup:
 *   npm install react-router-dom
 */

import {
  useLoaderData,
  useNavigation,
  useRouteError,
  isRouteErrorResponse,
  Link,
} from 'react-router-dom';
import { SmartState } from '@libster/smart-state';
import '@libster/smart-state/styles';

interface Post {
  id: number;
  title: string;
  body: string;
}

// ── Loader ────────────────────────────────────────────────────────────────────

/**
 * React Router loader (attach to the route definition):
 *
 * export async function postsLoader() {
 *   const res = await fetch('/api/posts');
 *   if (!res.ok) throw new Response('Not Found', { status: 404 });
 *   return res.json() as Promise<Post[]>;
 * }
 *
 * Route setup:
 * createBrowserRouter([
 *   {
 *     path: '/posts',
 *     element: <PostsPage />,
 *     loader: postsLoader,
 *     errorElement: <PostsError />,
 *   },
 * ]);
 */

// ── Sub-components ────────────────────────────────────────────────────────────

function PostList({ posts }: { posts: Post[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {posts.map((post) => (
        <Link
          key={post.id}
          to={`/posts/${post.id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <article
            style={{
              padding: '1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
            }}
          >
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>{post.title}</h2>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
              {post.body.slice(0, 80)}…
            </p>
          </article>
        </Link>
      ))}
    </div>
  );
}

// ── Route Component ───────────────────────────────────────────────────────────

export function PostsPage() {
  const posts = useLoaderData() as Post[];
  const navigation = useNavigation();

  // navigation.state is 'loading' while the next route's loader is running
  const loading = navigation.state === 'loading';

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1>Posts</h1>
      <SmartState<Post[]> loading={loading} data={posts}>
        <PostList posts={posts} />
      </SmartState>
    </div>
  );
}

// ── Error Element ─────────────────────────────────────────────────────────────

/**
 * Attach as `errorElement` on the route.
 * React Router passes thrown Responses and Error objects to useRouteError.
 */
export function PostsError() {
  const error = useRouteError();

  const is404 =
    isRouteErrorResponse(error) && error.status === 404;

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
    ? error.message
    : 'Something went wrong.';

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <SmartState notFound={is404} error={is404 ? undefined : message}>
        <span />
      </SmartState>
    </div>
  );
}
