/**
 * Custom State Example
 * Demonstrates createSmartState for app-wide defaults,
 * plus unauthorized/forbidden/notFound/maintenance state simulation.
 */
import React, { useState } from 'react';
import { SmartState, createSmartState } from '@libster/smart-state';
import '@libster/smart-state/styles';

// ── App-wide SmartState with custom defaults ──────────────────────────────────

function AppSpinner() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div
        style={{
          display: 'inline-block',
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '3px solid #e5e7eb',
          borderTopColor: '#6366f1',
          animation: 'spin 0.6s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>Loading…</p>
    </div>
  );
}

const AppSmartState = createSmartState(SmartState, {
  loadingComponent: <AppSpinner />,
});

// ── Demo ──────────────────────────────────────────────────────────────────────

type DemoState = 'idle' | 'loading' | 'error' | 'unauthorized' | 'forbidden' | 'maintenance';

export default function CustomStateExample() {
  const [mode, setMode] = useState<DemoState>('idle');

  const modes: DemoState[] = [
    'idle',
    'loading',
    'error',
    'unauthorized',
    'forbidden',
    'maintenance',
  ];

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Custom State Demo</h1>
      <p>Uses app-wide custom loading spinner via <code>createSmartState</code>.</p>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {modes.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '0.4rem 0.8rem',
              background: mode === m ? '#6366f1' : '#f3f4f6',
              color: mode === m ? '#fff' : '#111',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {m}
          </button>
        ))}
      </div>

      <AppSmartState
        loading={mode === 'loading'}
        error={mode === 'error' ? new Error('Something went wrong') : null}
        unauthorized={mode === 'unauthorized'}
        forbidden={mode === 'forbidden'}
        maintenance={mode === 'maintenance'}
        data={mode === 'idle' ? [1, 2, 3] : undefined}
      >
        <div
          style={{
            padding: '1.5rem',
            background: '#f0fdf4',
            borderRadius: '8px',
            color: '#166534',
          }}
        >
          ✅ Success — your content renders here.
        </div>
      </AppSmartState>
    </div>
  );
}
