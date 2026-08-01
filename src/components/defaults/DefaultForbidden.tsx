import React from 'react';
import type { DefaultForbiddenProps } from '../../types';

export const DefaultForbidden = React.memo<DefaultForbiddenProps>(function DefaultForbidden({
  className,
}) {
  return (
    <div
      className={['smart-state smart-state--forbidden', className].filter(Boolean).join(' ')}
      role="alert"
      aria-label="Access forbidden"
    >
      <div className="smart-state__card">
        <span className="smart-state__icon" aria-hidden="true">
          🚫
        </span>
        <h3 className="smart-state__title">Access denied</h3>
        <p className="smart-state__description">
          You don&rsquo;t have permission to view this content.
        </p>
      </div>
    </div>
  );
});
