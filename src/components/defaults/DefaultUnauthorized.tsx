import React from 'react';
import type { DefaultUnauthorizedProps } from '../../types';

export const DefaultUnauthorized = React.memo<DefaultUnauthorizedProps>(
  function DefaultUnauthorized({ className }) {
    return (
      <div
        className={['smart-state smart-state--unauthorized', className].filter(Boolean).join(' ')}
        role="alert"
        aria-label="Unauthorized access"
      >
        <div className="smart-state__card">
          <span className="smart-state__icon" aria-hidden="true">
            🔐
          </span>
          <h3 className="smart-state__title">Sign in required</h3>
          <p className="smart-state__description">
            You need to be logged in to view this content.
          </p>
        </div>
      </div>
    );
  }
);
