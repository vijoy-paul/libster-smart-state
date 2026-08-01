import React from 'react';
import type { DefaultMaintenanceProps } from '../../types';

export const DefaultMaintenance = React.memo<DefaultMaintenanceProps>(
  function DefaultMaintenance({ className }) {
    return (
      <div
        className={['smart-state smart-state--maintenance', className].filter(Boolean).join(' ')}
        role="status"
        aria-live="polite"
        aria-label="Under maintenance"
      >
        <div className="smart-state__card">
          <span className="smart-state__icon" aria-hidden="true">
            🛠️
          </span>
          <h3 className="smart-state__title">Under maintenance</h3>
          <p className="smart-state__description">
            We&rsquo;re working on improvements. Please check back soon.
          </p>
        </div>
      </div>
    );
  }
);
