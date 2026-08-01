import type { ReactNode, ComponentType } from 'react';

// ─── State Names ────────────────────────────────────────────────────────────

export type SmartStateName =
  | 'loading'
  | 'error'
  | 'empty'
  | 'success'
  | 'offline'
  | 'unauthorized'
  | 'forbidden'
  | 'notFound'
  | 'maintenance';

// ─── Empty Detection ─────────────────────────────────────────────────────────

export type IsEmptyFn<TData> = (data: TData) => boolean;

// ─── Component Overrides ─────────────────────────────────────────────────────

export type StateComponent = ReactNode | ComponentType;

// ─── Core Props ──────────────────────────────────────────────────────────────

export interface SmartStateProps<TData = unknown> {
  /** Child content rendered when state is "success" */
  children: ReactNode;

  /** Trigger loading state */
  loading?: boolean;

  /** Trigger error state. Pass an Error object or true */
  error?: Error | string | boolean | null;

  /** The data to evaluate for emptiness */
  data?: TData;

  /** Trigger offline state */
  offline?: boolean;

  /** Trigger unauthorized (401) state */
  unauthorized?: boolean;

  /** Trigger forbidden (403) state */
  forbidden?: boolean;

  /** Trigger not-found (404) state */
  notFound?: boolean;

  /** Trigger maintenance state */
  maintenance?: boolean;

  /**
   * Custom empty detection function.
   * Receives `data` and returns true if empty.
   * Falls back to built-in detection if omitted.
   */
  isEmpty?: IsEmptyFn<TData>;

  // ── Custom state components ───────────────────────────────────────────────

  /** Override the loading component */
  loadingComponent?: StateComponent;

  /** Override the error component */
  errorComponent?: StateComponent;

  /** Override the empty component */
  emptyComponent?: StateComponent;

  /** Override the offline component */
  offlineComponent?: StateComponent;

  /** Override the unauthorized component */
  unauthorizedComponent?: StateComponent;

  /** Override the forbidden component */
  forbiddenComponent?: StateComponent;

  /** Override the not-found component */
  notFoundComponent?: StateComponent;

  /** Override the maintenance component */
  maintenanceComponent?: StateComponent;

  /**
   * A custom state to display instead of children.
   * Rendered after all built-in states are checked.
   */
  customComponent?: StateComponent;

  /** Additional CSS class on the wrapper */
  className?: string;

  /** Inline styles on the wrapper */
  style?: React.CSSProperties;
}

// ─── Hook Types ───────────────────────────────────────────────────────────────

export interface UseSmartStateOptions<TData = unknown> {
  loading?: boolean;
  error?: Error | string | boolean | null;
  data?: TData;
  offline?: boolean;
  unauthorized?: boolean;
  forbidden?: boolean;
  notFound?: boolean;
  maintenance?: boolean;
  isEmpty?: IsEmptyFn<TData>;
}

export interface UseSmartStateResult {
  /** The resolved state name based on priority order */
  state: SmartStateName;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  isSuccess: boolean;
  isOffline: boolean;
  isUnauthorized: boolean;
  isForbidden: boolean;
  isNotFound: boolean;
  isMaintenance: boolean;
}

// ─── Default Component Props ──────────────────────────────────────────────────

export interface DefaultLoadingProps {
  className?: string;
}

export interface DefaultErrorProps {
  error?: Error | string | boolean | null;
  className?: string;
}

export interface DefaultEmptyProps {
  className?: string;
}

export interface DefaultOfflineProps {
  className?: string;
}

export interface DefaultUnauthorizedProps {
  className?: string;
}

export interface DefaultForbiddenProps {
  className?: string;
}

export interface DefaultNotFoundProps {
  className?: string;
}

export interface DefaultMaintenanceProps {
  className?: string;
}

// ─── Utility Types ────────────────────────────────────────────────────────────

export type EmptyValue =
  | null
  | undefined
  | never[]
  | Record<string, never>
  | Map<never, never>
  | Set<never>
  | '';

export interface CreateSmartStateOptions<TData = unknown> {
  /** Default props to merge into every SmartState instance */
  defaults: Partial<SmartStateProps<TData>>;
}
