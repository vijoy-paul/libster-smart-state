import { describe, it, expect } from 'vitest';
import {
  isEmptyValue,
  resolveState,
  mergeStates,
  getErrorMessage,
} from '../utils';

// ─── isEmptyValue ─────────────────────────────────────────────────────────────

describe('isEmptyValue', () => {
  it('returns true for null', () => expect(isEmptyValue(null)).toBe(true));
  it('returns true for undefined', () => expect(isEmptyValue(undefined)).toBe(true));
  it('returns true for empty string', () => expect(isEmptyValue('')).toBe(true));
  it('returns true for whitespace-only string', () => expect(isEmptyValue('   ')).toBe(true));
  it('returns true for empty array', () => expect(isEmptyValue([])).toBe(true));
  it('returns true for empty object', () => expect(isEmptyValue({})).toBe(true));
  it('returns true for empty Map', () => expect(isEmptyValue(new Map())).toBe(true));
  it('returns true for empty Set', () => expect(isEmptyValue(new Set())).toBe(true));

  it('returns false for non-empty string', () => expect(isEmptyValue('hello')).toBe(false));
  it('returns false for non-empty array', () => expect(isEmptyValue([1, 2])).toBe(false));
  it('returns false for non-empty object', () => expect(isEmptyValue({ a: 1 })).toBe(false));
  it('returns false for non-empty Map', () =>
    expect(isEmptyValue(new Map([['k', 'v']]))).toBe(false));
  it('returns false for non-empty Set', () => expect(isEmptyValue(new Set([1]))).toBe(false));
  it('returns false for 0', () => expect(isEmptyValue(0)).toBe(false));
  it('returns false for false', () => expect(isEmptyValue(false)).toBe(false));
  it('returns false for true', () => expect(isEmptyValue(true)).toBe(false));
});

// ─── resolveState ─────────────────────────────────────────────────────────────

describe('resolveState', () => {
  const opts = (o: Parameters<typeof resolveState>[0]) => resolveState(o, 'data' in o);

  it('returns maintenance when maintenance=true (highest priority)', () => {
    expect(
      opts({ maintenance: true, loading: true, error: new Error('e'), offline: true })
    ).toBe('maintenance');
  });

  it('returns offline when offline=true', () => {
    expect(opts({ offline: true, loading: true })).toBe('offline');
  });

  it('returns unauthorized when unauthorized=true', () => {
    expect(opts({ unauthorized: true, loading: true })).toBe('unauthorized');
  });

  it('returns forbidden when forbidden=true', () => {
    expect(opts({ forbidden: true, notFound: true })).toBe('forbidden');
  });

  it('returns notFound when notFound=true', () => {
    expect(opts({ notFound: true, loading: true })).toBe('notFound');
  });

  it('returns loading when loading=true', () => {
    expect(opts({ loading: true })).toBe('loading');
  });

  it('returns error when error is an Error object', () => {
    expect(opts({ error: new Error('oops') })).toBe('error');
  });

  it('returns error when error is a string', () => {
    expect(opts({ error: 'oops' })).toBe('error');
  });

  it('returns error when error is true', () => {
    expect(opts({ error: true })).toBe('error');
  });

  it('returns empty when data is empty array', () => {
    expect(opts({ data: [] })).toBe('empty');
  });

  it('returns empty when data is null', () => {
    expect(opts({ data: null })).toBe('empty');
  });

  it('returns empty when data is undefined (but key present)', () => {
    const result = resolveState({ data: undefined }, true);
    expect(result).toBe('empty');
  });

  it('returns success when data is non-empty array', () => {
    expect(opts({ data: [1, 2, 3] })).toBe('success');
  });

  it('returns success when no flags set and no data key', () => {
    expect(opts({})).toBe('success');
  });

  it('respects custom isEmpty function', () => {
    expect(
      resolveState({ data: [1, 2, 3], isEmpty: (d) => (d as number[]).length > 2 }, true)
    ).toBe('empty');
  });

  it('success when custom isEmpty returns false', () => {
    expect(
      resolveState({ data: [1], isEmpty: (d) => (d as number[]).length > 2 }, true)
    ).toBe('success');
  });
});

// ─── mergeStates ─────────────────────────────────────────────────────────────

describe('mergeStates', () => {
  it('merges two objects, later taking precedence', () => {
    const a = { loading: true, offline: false };
    const b = { loading: false, error: new Error('e') };
    const result = mergeStates(a, b);
    expect(result.loading).toBe(false);
    expect(result.offline).toBe(false);
    expect(result.error).toBeInstanceOf(Error);
  });

  it('handles single argument', () => {
    const result = mergeStates({ loading: true });
    expect(result.loading).toBe(true);
  });

  it('handles empty arguments', () => {
    const result = mergeStates({}, {});
    expect(result).toEqual({});
  });
});

// ─── getErrorMessage ──────────────────────────────────────────────────────────

describe('getErrorMessage', () => {
  it('returns fallback for null', () =>
    expect(getErrorMessage(null)).toBe('An unexpected error occurred.'));
  it('returns fallback for undefined', () =>
    expect(getErrorMessage(undefined)).toBe('An unexpected error occurred.'));
  it('returns fallback for false', () =>
    expect(getErrorMessage(false)).toBe('An unexpected error occurred.'));
  it('returns string as-is', () =>
    expect(getErrorMessage('network error')).toBe('network error'));
  it('returns Error.message', () =>
    expect(getErrorMessage(new Error('bad request'))).toBe('bad request'));
  it('returns fallback for true', () =>
    expect(getErrorMessage(true)).toBe('An unexpected error occurred.'));
});
