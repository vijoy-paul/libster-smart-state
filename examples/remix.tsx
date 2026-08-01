/**
 * Remix Example
 *
 * Demonstrates SmartState with Remix's useLoaderData and useNavigation hooks.
 * Remix fetches data on the server via loader functions; SmartState handles
 * the in-navigation loading state and any thrown errors on the client.
 *
 * Setup:
 *   npm install @remix-run/react @remix-run/node
 */

import { useLoaderData, useNavigation, isRouteErrorResponse, useRouteError } from '@remix-run/react';
import { SmartState } from '@libster/smart-state';
import '@libster/smart-state/styles';

interface User {
  id: number;
  name: string;
  email: string;
}

interface LoaderData {
  users: User[];
}

// ── Loader (runs on the server) ───────────────────────────────────────────────

/**
 * export async function loader() {
 *   const users = await db.user.findMany();
 *   return json<LoaderData>({ users });
 * }
 */

// ── Sub-components ────────────────────────────────────────────────────────────

function UserList({ users }: { users: User[] }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {users.map((user) => (
        <li
          key={user.id}
          style={{
            padding: '0.75rem 1rem',
            borderBottom: '1px solid #f3f4f6',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem',
          }}
        >
          <span style={{ fontWeight: 600 }}>{user.name}</span>
          <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>{user.email}</span>
        </li>
      ))}
    </ul>
  );
}

// ── Route Component ───────────────────────────────────────────────────────────

export default function UsersRoute() {
  const { users } = useLoaderData<LoaderData>();
  const navigation = useNavigation();

  // Remix sets navigation.state to 'loading' while navigating to this route
  // or when a fetcher is in flight.
  const loading = navigation.state === 'loading';

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Users</h1>
      <SmartState<User[]> loading={loading} data={users}>
        <UserList users={users} />
      </SmartState>
    </div>
  );
}

// ── Error Boundary ────────────────────────────────────────────────────────────

/**
 * Remix's ErrorBoundary catches thrown responses (e.g. throw json({}, 404))
 * and JavaScript errors. Use SmartState here for a consistent error UI.
 */
export function ErrorBoundary() {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? `${error.status} — ${error.statusText}`
    : error instanceof Error
    ? error.message
    : 'An unexpected error occurred.';

  const notFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div style={{ padding: '2rem' }}>
      <SmartState error={notFound ? undefined : message} notFound={notFound}>
        <span />
      </SmartState>
    </div>
  );
}
