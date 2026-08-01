/**
 * Basic Fetch Example
 * Demonstrates SmartState with a plain fetch + useState pattern.
 */
import React, { useState, useEffect } from 'react';
import { SmartState } from '@libster/smart-state';
import '@libster/smart-state/styles';

interface User {
  id: number;
  name: string;
  email: string;
}

function UserTable({ users }: { users: User[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td>{u.id}</td>
            <td>{u.name}</td>
            <td>{u.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function BasicFetchExample() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<User[]>;
      })
      .then(setUsers)
      .catch((e: unknown) => setError(e instanceof Error ? e : new Error(String(e))))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Users</h1>
      <SmartState loading={loading} error={error} data={users}>
        <UserTable users={users} />
      </SmartState>
    </div>
  );
}
