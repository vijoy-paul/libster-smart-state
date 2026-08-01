/**
 * Dashboard Example
 * Demonstrates SmartState with multiple concurrent flags
 * (offline, maintenance, loading, error, empty).
 */
import React, { useState } from 'react';
import { SmartState } from '@libster/smart-state';
import '@libster/smart-state/styles';

interface Stat {
  label: string;
  value: number;
}

function DashboardGrid({ stats }: { stats: Stat[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{s.value}</div>
          <div style={{ color: '#6b7280', marginTop: '0.25rem' }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

const DEMO_STATS: Stat[] = [
  { label: 'Users', value: 1240 },
  { label: 'Orders', value: 342 },
  { label: 'Revenue', value: 98500 },
];

export default function DashboardExample() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [offline, setOffline] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [stats, setStats] = useState<Stat[]>(DEMO_STATS);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Dashboard</h1>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button onClick={() => setLoading((v) => !v)}>Toggle Loading</button>
        <button onClick={() => setError((e) => (e ? null : new Error('Server error 500')))}>
          Toggle Error
        </button>
        <button onClick={() => setOffline((v) => !v)}>Toggle Offline</button>
        <button onClick={() => setMaintenance((v) => !v)}>Toggle Maintenance</button>
        <button onClick={() => setStats([])}>Empty Data</button>
        <button onClick={() => setStats(DEMO_STATS)}>Restore Data</button>
      </div>

      <SmartState
        loading={loading}
        error={error}
        offline={offline}
        maintenance={maintenance}
        data={stats}
      >
        <DashboardGrid stats={stats} />
      </SmartState>
    </div>
  );
}
