import React, { Suspense, isValidElement, memo } from 'react';
import type { ComponentType, ReactNode } from 'react';
import type { SmartStateProps } from '../types';
import { useSmartState } from '../hooks/useSmartState';
import {
  DefaultLoading,
  DefaultError,
  DefaultEmpty,
  DefaultOffline,
  DefaultUnauthorized,
  DefaultForbidden,
  DefaultNotFound,
  DefaultMaintenance,
} from './defaults';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Renders a StateComponent which may be a ReactNode or a ComponentType.
 */
function renderState(
  component: ReactNode | ComponentType | undefined,
  fallback: ReactNode
): ReactNode {
  if (component === undefined || component === null) return fallback;
  if (isValidElement(component)) return component;
  if (typeof component === 'function') {
    const Comp = component as ComponentType;
    return <Comp />;
  }
  return fallback;
}

// ─── SmartState ───────────────────────────────────────────────────────────────

function SmartStateInner<TData = unknown>(props: SmartStateProps<TData>): React.JSX.Element {
  const {
    children,
    loading,
    error,
    offline,
    unauthorized,
    forbidden,
    notFound,
    maintenance,
    isEmpty,
    loadingComponent,
    errorComponent,
    emptyComponent,
    offlineComponent,
    unauthorizedComponent,
    forbiddenComponent,
    notFoundComponent,
    maintenanceComponent,
    customComponent,
    className,
    style,
  } = props;

  // Only include `data` in the options object when the caller explicitly passed it.
  // This prevents empty-state from triggering when `data` was never provided.
  const hookOptions = 'data' in props
    ? {
        loading,
        error,
        data: props.data,
        offline,
        unauthorized,
        forbidden,
        notFound,
        maintenance,
        isEmpty,
      }
    : {
        loading,
        error,
        offline,
        unauthorized,
        forbidden,
        notFound,
        maintenance,
      };

  const { state } = useSmartState<TData>(hookOptions);

  switch (state) {
    case 'maintenance':
      return (
        <Suspense fallback={<DefaultMaintenance />}>
          {renderState(maintenanceComponent, <DefaultMaintenance />) as React.JSX.Element}
        </Suspense>
      );

    case 'offline':
      return (
        <Suspense fallback={<DefaultOffline />}>
          {renderState(offlineComponent, <DefaultOffline />) as React.JSX.Element}
        </Suspense>
      );

    case 'unauthorized':
      return (
        <Suspense fallback={<DefaultUnauthorized />}>
          {renderState(unauthorizedComponent, <DefaultUnauthorized />) as React.JSX.Element}
        </Suspense>
      );

    case 'forbidden':
      return (
        <Suspense fallback={<DefaultForbidden />}>
          {renderState(forbiddenComponent, <DefaultForbidden />) as React.JSX.Element}
        </Suspense>
      );

    case 'notFound':
      return (
        <Suspense fallback={<DefaultNotFound />}>
          {renderState(notFoundComponent, <DefaultNotFound />) as React.JSX.Element}
        </Suspense>
      );

    case 'loading':
      return (
        <Suspense fallback={<DefaultLoading />}>
          {renderState(loadingComponent, <DefaultLoading />) as React.JSX.Element}
        </Suspense>
      );

    case 'error':
      return (
        <Suspense fallback={<DefaultError error={error} />}>
          {renderState(errorComponent, <DefaultError error={error} />) as React.JSX.Element}
        </Suspense>
      );

    case 'empty':
      return (
        <Suspense fallback={<DefaultEmpty />}>
          {renderState(emptyComponent, <DefaultEmpty />) as React.JSX.Element}
        </Suspense>
      );

    case 'success':
    default: {
      if (customComponent !== undefined) {
        return (
          <Suspense fallback={null}>
            {renderState(customComponent, null) as React.JSX.Element}
          </Suspense>
        );
      }

      return (
        <div className={className} style={style}>
          {children}
        </div>
      );
    }
  }
}

/**
 * `SmartState` — automatically renders the correct UI based on application state.
 *
 * Supports: loading, error, empty, success, offline, unauthorized, forbidden,
 * notFound, maintenance, and custom states.
 *
 * Priority order:
 * maintenance → offline → unauthorized → forbidden → notFound →
 * loading → error → empty → success
 *
 * @example
 * <SmartState loading={loading} error={error} data={users}>
 *   <UserTable users={users} />
 * </SmartState>
 */
export const SmartState = memo(SmartStateInner) as <TData = unknown>(
  props: SmartStateProps<TData>
) => React.JSX.Element;

// Preserve display name after memo wrapping
(SmartState as { displayName?: string }).displayName = 'SmartState';
