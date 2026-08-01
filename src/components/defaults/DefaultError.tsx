import React from 'react';
import type { DefaultErrorProps } from '../../types';
import { getErrorMessage } from '../../utils';

export const DefaultError = React.memo<DefaultErrorProps>(function DefaultError({
  error,
  className,
}) {
  const message = getErrorMessage(error);

  return (
    <div
      className={['smart-state smart-state--error', className].filter(Boolean).join(' ')}
      role="alert"
      aria-live="assertive"
    >
      <div className="smart-state__card">
        <span className="smart-state__icon" aria-hidden="true">
          ⚠️
        </span>
        <h3 className="smart-state__title">Something went wrong</h3>
        <p className="smart-state__description">{message}</p>
      </div>
    </div>
  );
});
