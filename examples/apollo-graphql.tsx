/**
 * Apollo GraphQL Example
 *
 * Demonstrates SmartState with Apollo Client's useQuery hook.
 * Apollo's loading/error/data props map directly to SmartState.
 *
 * Setup:
 *   npm install @apollo/client graphql
 *
 * Provider setup:
 *   import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
 *   const client = new ApolloClient({ uri: '/graphql', cache: new InMemoryCache() });
 *   <ApolloProvider client={client}><App /></ApolloProvider>
 */

import { useQuery, gql } from '@apollo/client';
import { SmartState } from '@libster/smart-state';
import '@libster/smart-state/styles';

// ── GraphQL operations ────────────────────────────────────────────────────────

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

// ── Types ─────────────────────────────────────────────────────────────────────

interface User {
  id: string;
  name: string;
  email: string;
}

interface GetUsersData {
  users: User[];
}

// ── Sub-components ────────────────────────────────────────────────────────────

function UserCard({ user }: { user: User }) {
  return (
    <div
      style={{
        padding: '0.75rem 1rem',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
      }}
    >
      <p style={{ margin: 0, fontWeight: 600 }}>{user.name}</p>
      <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>{user.email}</p>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function UserDirectory() {
  const { data, loading, error } = useQuery<GetUsersData>(GET_USERS);

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>User Directory</h1>

      {/*
       * Apollo notes:
       * - `data?.users` is undefined until the query resolves; SmartState
       *   shows loading until data arrives without extra guards.
       * - Apollo's `error` is an ApolloError (extends Error), compatible
       *   with SmartState's error prop out of the box.
       */}
      <SmartState<User[]> loading={loading} error={error} data={data?.users}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {(data?.users ?? []).map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </SmartState>
    </div>
  );
}
