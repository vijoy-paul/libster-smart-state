/**
 * Redux / RTK Query Example
 *
 * Demonstrates SmartState with Redux Toolkit Query.
 * RTK Query's isLoading/error/data map directly to SmartState props.
 *
 * Setup:
 *   npm install @reduxjs/toolkit react-redux
 */

/**
 * Example API slice (src/api/usersApi.ts):
 *
 * import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
 *
 * export interface User { id: number; name: string; email: string; }
 *
 * export const usersApi = createApi({
 *   reducerPath: 'usersApi',
 *   baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
 *   endpoints: (builder) => ({
 *     getUsers: builder.query<User[], void>({
 *       query: () => '/users',
 *     }),
 *   }),
 * });
 *
 * export const { useGetUsersQuery } = usersApi;
 *
 * Store setup (src/store.ts):
 *
 * import { configureStore } from '@reduxjs/toolkit';
 * import { usersApi } from './api/usersApi';
 *
 * export const store = configureStore({
 *   reducer: { [usersApi.reducerPath]: usersApi.reducer },
 *   middleware: (getDefault) => getDefault().concat(usersApi.middleware),
 * });
 *
 * App entry:
 * <Provider store={store}><App /></Provider>
 */

import { SmartState } from '@libster/smart-state';
import '@libster/smart-state/styles';

// Stub types matching a real RTK Query hook's return shape
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

function UserCard({ user }: { user: User }) {
  return (
    <div
      style={{
        padding: '1rem',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <p style={{ margin: 0, fontWeight: 600 }}>{user.name}</p>
        <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
          {user.email}
        </p>
      </div>
      <span
        style={{
          padding: '2px 10px',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          background: user.role === 'admin' ? '#ede9fe' : '#f3f4f6',
          color: user.role === 'admin' ? '#7c3aed' : '#374151',
        }}
      >
        {user.role}
      </span>
    </div>
  );
}

/**
 * Replace the stub values below with a real RTK Query hook:
 *   const { data: users = [], isLoading, error } = useGetUsersQuery();
 */
export function UserList() {
  // --- replace with: const { data: users = [], isLoading, error } = useGetUsersQuery();
  const users: User[] = [];
  const isLoading = false;
  const error = null;
  // ---

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Users</h1>
      <SmartState<User[]> loading={isLoading} error={error} data={users}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </SmartState>
    </div>
  );
}
