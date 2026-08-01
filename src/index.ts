// ─── Main Component ───────────────────────────────────────────────────────────
export { SmartState } from './components/SmartState';

// ─── Hook ─────────────────────────────────────────────────────────────────────
export { useSmartState } from './hooks/useSmartState';

// ─── Default State Components ─────────────────────────────────────────────────
export {
  DefaultLoading,
  DefaultError,
  DefaultEmpty,
  DefaultOffline,
  DefaultUnauthorized,
  DefaultForbidden,
  DefaultNotFound,
  DefaultMaintenance,
} from './components/defaults';

// ─── Utilities ────────────────────────────────────────────────────────────────
export { isEmptyValue, resolveState, mergeStates, getErrorMessage, createSmartState } from './utils';

// ─── Types ────────────────────────────────────────────────────────────────────
export type {
  SmartStateProps,
  SmartStateName,
  UseSmartStateOptions,
  UseSmartStateResult,
  IsEmptyFn,
  StateComponent,
  DefaultLoadingProps,
  DefaultErrorProps,
  DefaultEmptyProps,
  DefaultOfflineProps,
  DefaultUnauthorizedProps,
  DefaultForbiddenProps,
  DefaultNotFoundProps,
  DefaultMaintenanceProps,
  EmptyValue,
  CreateSmartStateOptions,
} from './types';
