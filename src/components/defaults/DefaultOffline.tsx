import React from 'react';
import type { DefaultOfflineProps } from '../../types';

export const DefaultOffline = React.memo<DefaultOfflineProps>(function DefaultOffline({
  className,
}) {
  return (
    <div
      className={['smart-state smart-state--offline', className].filter(Boolean).join(' ')}
      role="status"
      aria-live="polite"
      aria-label="You are offline"
    >
      <div className="smart-state__card">
        <span className="smart-state__icon" aria-hidden="true">
          📡
        </span>
        <h3 className="smart-state__title">You&apos;re offline</h3>
        <p className="smart-state__description">
          Please check your internet connection and try again.
        </p>
      </div>
    </div>
  );
});
