import React from 'react';
import type { DefaultEmptyProps } from '../../types';

export const DefaultEmpty = React.memo<DefaultEmptyProps>(function DefaultEmpty({ className }) {
  return (
    <div
      className={['smart-state smart-state--empty', className].filter(Boolean).join(' ')}
      role="status"
      aria-label="No data available"
    >
      <div className="smart-state__card">
        <span className="smart-state__icon" aria-hidden="true">
          📭
        </span>
        <h3 className="smart-state__title">Nothing here yet</h3>
        <p className="smart-state__description">There&rsquo;s no data to display at the moment.</p>
      </div>
    </div>
  );
});
