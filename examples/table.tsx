/**
 * Table Example
 *
 * Demonstrates SmartState wrapping a sortable data table,
 * handling loading, error, and empty states automatically.
 */

import { useState, useEffect } from 'react';
import { SmartState } from '@libster/smart-state';
import '@libster/smart-state/styles';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

type SortKey = keyof Omit<User, 'id'>;

function UserTable({ users }: { users: User[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [asc, setAsc] = useState(true);

  const sorted = [...users].sort((a, b) => {
    const cmp = a[sortKey].localeCompare(b[sortKey]);
    return asc ? cmp : -cmp;
  });

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setAsc((v) => !v);
    else { setSortKey(key); setAsc(true); }
  };

  const arrow = (key: SortKey) => sortKey === key ? (asc ? ' ▲' : ' ▼') : '';

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {(['name', 'email', 'role'] as SortKey[]).map((col) => (
            <th
              key={col}
              onClick={() => toggleSort(col)}
              style={{
                textAlign: 'left',
                padding: '8px 12px',
                borderBottom: '2px solid #e5e7eb',
                cursor: 'pointer',
                userSelect: 'none',
                textTransform: 'capitalize',
              }}
            >
              {col}{arrow(col)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.map((user) => (
          <tr key={user.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
            <td style={{ padding: '8px 12px' }}>{user.name}</td>
            <td style={{ padding: '8px 12px', color: '#6b7280' }}>{user.email}</td>
            <td style={{ padding: '8px 12px' }}>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  background: user.role === 'admin' ? '#ede9fe' : '#f3f4f6',
                  color: user.role === 'admin' ? '#7c3aed' : '#374151',
                }}
              >
                {user.role}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function UsersTablePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('/api/users')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<User[]>;
      })
      .then(setUsers)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err : new Error('Unknown error'))
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Users</h1>
      <SmartState<User[]>
        loading={loading}
        error={error}
        data={users}
        isEmpty={(d) => d.length === 0}
        emptyComponent={
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            <p style={{ marginBottom: '1rem' }}>No users found.</p>
            <button
              onClick={() => alert('Open invite dialog')}
              style={{
                padding: '0.5rem 1.25rem',
                background: '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
              }}
            >
              Invite a user
            </button>
          </div>
        }
      >
        <UserTable users={users} />
      </SmartState>
    </div>
  );
}
