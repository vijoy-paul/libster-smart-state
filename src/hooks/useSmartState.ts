import { useMemo } from 'react';
import { resolveState } from '../utils';
import type { UseSmartStateOptions, UseSmartStateResult } from '../types';

/**
 * `useSmartState` — derive the current application state from a set of flags.
 *
 * Returns the resolved state name plus convenient boolean helpers.
 *
 * Priority order:
 * maintenance → offline → unauthorized → forbidden → notFound →
 * loading → error → empty → success
 *
 * @example
 * const { state, isLoading, isEmpty } = useSmartState({ loading, error, data: users });
 */
export function useSmartState<TData = unknown>(
  options: UseSmartStateOptions<TData>
): UseSmartStateResult {
  const {
    loading,
    error,
    data,
    offline,
    unauthorized,
    forbidden,
    notFound,
    maintenance,
    isEmpty,
  } = options;

  const hasData = 'data' in options;

  const state = useMemo(
    () => resolveState(options, hasData),
    // Individual primitives are listed instead of `options` to avoid
    // re-running on every render when the caller passes a new inline object.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loading, error, data, offline, unauthorized, forbidden, notFound, maintenance, isEmpty, hasData]
  );

  return useMemo(
    () => ({
      state,
      isLoading: state === 'loading',
      isError: state === 'error',
      isEmpty: state === 'empty',
      isSuccess: state === 'success',
      isOffline: state === 'offline',
      isUnauthorized: state === 'unauthorized',
      isForbidden: state === 'forbidden',
      isNotFound: state === 'notFound',
      isMaintenance: state === 'maintenance',
    }),
    [state]
  );
}
