import React from 'react';
import type { IsEmptyFn, SmartStateName, SmartStateProps, UseSmartStateOptions } from '../types';

// ─── Empty Detection ─────────────────────────────────────────────────────────

/**
 * Determines whether a given value is considered "empty".
 *
 * Handles: null, undefined, empty string, empty array,
 * empty plain object, empty Map, and empty Set.
 */
export function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (value instanceof Map) return value.size === 0;
  if (value instanceof Set) return value.size === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

// ─── State Resolution ─────────────────────────────────────────────────────────

/**
 * Resolves the current SmartState name based on props and priority order:
 * maintenance → offline → unauthorized → forbidden → notFound →
 * loading → error → empty → success
 */
export function resolveState<TData>(
  options: UseSmartStateOptions<TData>,
  hasData: boolean
): SmartStateName {
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

  if (maintenance) return 'maintenance';
  if (offline) return 'offline';
  if (unauthorized) return 'unauthorized';
  if (forbidden) return 'forbidden';
  if (notFound) return 'notFound';
  if (loading) return 'loading';
  if (error) return 'error';

  if (hasData) {
    const emptyCheck: IsEmptyFn<TData | undefined> = isEmpty
      ? (d) => isEmpty(d as TData)
      : isEmptyValue;
    if (emptyCheck(data)) return 'empty';
  }

  return 'success';
}

// ─── Merge States ─────────────────────────────────────────────────────────────

/**
 * Merges multiple UseSmartStateOptions objects.
 * Later entries take precedence over earlier ones.
 */
export function mergeStates<TData>(
  ...states: Partial<UseSmartStateOptions<TData>>[]
): UseSmartStateOptions<TData> {
  return Object.assign({}, ...states) as UseSmartStateOptions<TData>;
}

// ─── Error Message ────────────────────────────────────────────────────────────

/**
 * Extracts a human-readable error message from various error shapes.
 */
export function getErrorMessage(error: Error | string | boolean | null | undefined): string {
  if (!error) return 'An unexpected error occurred.';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred.';
}

// ─── createSmartState factory ─────────────────────────────────────────────────

/**
 * Creates a pre-configured SmartState component with default props merged in.
 * Pass a SmartState component reference to avoid circular imports.
 *
 * @example
 * import { SmartState, createSmartState } from '@libster/smart-state';
 * const AppState = createSmartState(SmartState, { loadingComponent: <MySpinner /> });
 */
export function createSmartState<TData = unknown>(
  SmartStateComponent: React.ComponentType<SmartStateProps<TData>>,
  defaults: Partial<SmartStateProps<TData>>
): React.ComponentType<SmartStateProps<TData>> {
  const ConfiguredSmartState = (props: SmartStateProps<TData>) => {
    const mergedProps: SmartStateProps<TData> = { ...defaults, ...props };
    return React.createElement(SmartStateComponent, mergedProps);
  };

  ConfiguredSmartState.displayName = 'ConfiguredSmartState';
  return ConfiguredSmartState;
}
