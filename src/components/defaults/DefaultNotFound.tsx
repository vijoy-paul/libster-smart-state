import React from 'react';
import type { DefaultNotFoundProps } from '../../types';

export const DefaultNotFound = React.memo<DefaultNotFoundProps>(function DefaultNotFound({
  className,
}) {
  return (
    <div
      className={['smart-state smart-state--not-found', className].filter(Boolean).join(' ')}
      role="status"
      aria-label="Page not found"
    >
      <div className="smart-state__card">
        <span className="smart-state__icon" aria-hidden="true">
          🔍
        </span>
        <h3 className="smart-state__title">Not found</h3>
        <p className="smart-state__description">
          The resource you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
        </p>
      </div>
    </div>
  );
});
