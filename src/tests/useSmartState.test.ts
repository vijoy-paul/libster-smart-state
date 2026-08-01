import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSmartState } from '../hooks/useSmartState';

describe('useSmartState', () => {
  it('returns isLoading=true when loading=true', () => {
    const { result } = renderHook(() => useSmartState({ loading: true }));
    expect(result.current.isLoading).toBe(true);
    expect(result.current.state).toBe('loading');
  });

  it('returns isError=true when error is set', () => {
    const { result } = renderHook(() => useSmartState({ error: new Error('oops') }));
    expect(result.current.isError).toBe(true);
    expect(result.current.state).toBe('error');
  });

  it('returns isEmpty=true when data is empty array', () => {
    const { result } = renderHook(() => useSmartState({ data: [] }));
    expect(result.current.isEmpty).toBe(true);
    expect(result.current.state).toBe('empty');
  });

  it('returns isSuccess=true when data is non-empty', () => {
    const { result } = renderHook(() => useSmartState({ data: [1, 2, 3] }));
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.state).toBe('success');
  });

  it('returns isSuccess=true when no flags are set', () => {
    const { result } = renderHook(() => useSmartState({}));
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.state).toBe('success');
  });

  it('returns isOffline=true when offline=true', () => {
    const { result } = renderHook(() => useSmartState({ offline: true }));
    expect(result.current.isOffline).toBe(true);
    expect(result.current.state).toBe('offline');
  });

  it('returns isUnauthorized=true when unauthorized=true', () => {
    const { result } = renderHook(() => useSmartState({ unauthorized: true }));
    expect(result.current.isUnauthorized).toBe(true);
    expect(result.current.state).toBe('unauthorized');
  });

  it('returns isForbidden=true when forbidden=true', () => {
    const { result } = renderHook(() => useSmartState({ forbidden: true }));
    expect(result.current.isForbidden).toBe(true);
    expect(result.current.state).toBe('forbidden');
  });

  it('returns isNotFound=true when notFound=true', () => {
    const { result } = renderHook(() => useSmartState({ notFound: true }));
    expect(result.current.isNotFound).toBe(true);
    expect(result.current.state).toBe('notFound');
  });

  it('returns isMaintenance=true when maintenance=true', () => {
    const { result } = renderHook(() => useSmartState({ maintenance: true }));
    expect(result.current.isMaintenance).toBe(true);
    expect(result.current.state).toBe('maintenance');
  });

  it('maintenance overrides all other flags', () => {
    const { result } = renderHook(() =>
      useSmartState({
        maintenance: true,
        loading: true,
        error: new Error('e'),
        offline: true,
      })
    );
    expect(result.current.state).toBe('maintenance');
    expect(result.current.isMaintenance).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('returns isEmpty=true with custom isEmpty function', () => {
    const { result } = renderHook(() =>
      useSmartState({ data: [1, 2, 3], isEmpty: (d) => (d as number[]).length > 2 })
    );
    expect(result.current.isEmpty).toBe(true);
  });

  it('mutually exclusive: only one flag is true at a time', () => {
    const { result } = renderHook(() => useSmartState({ loading: true }));
    const r = result.current;
    const trueCount = [
      r.isLoading,
      r.isError,
      r.isEmpty,
      r.isSuccess,
      r.isOffline,
      r.isUnauthorized,
      r.isForbidden,
      r.isNotFound,
      r.isMaintenance,
    ].filter(Boolean).length;
    expect(trueCount).toBe(1);
  });
});
