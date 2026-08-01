import React from 'react';
import type { DefaultLoadingProps } from '../../types';

export const DefaultLoading = React.memo<DefaultLoadingProps>(function DefaultLoading({
  className,
}) {
  return (
    <div
      className={['smart-state smart-state--loading', className].filter(Boolean).join(' ')}
      aria-busy="true"
      aria-label="Loading"
      role="status"
    >
      <div className="smart-state__card">
        <div className="smart-state__spinner" aria-hidden="true" />
        <p className="smart-state__loading-text">Loading…</p>
      </div>
    </div>
  );
});
