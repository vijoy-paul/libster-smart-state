import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SmartState } from '../components/SmartState';

const children = <div data-testid="children">Content</div>;

describe('SmartState', () => {
  // ── Loading ──────────────────────────────────────────────────────────────

  describe('loading state', () => {
    it('renders DefaultLoading when loading=true', () => {
      render(
        <SmartState loading={true} data={[1, 2]}>
          {children}
        </SmartState>
      );
      expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
      expect(screen.queryByTestId('children')).not.toBeInTheDocument();
    });

    it('has aria-busy=true on loading state', () => {
      render(<SmartState loading={true}>{children}</SmartState>);
      expect(screen.getByRole('status', { name: 'Loading' })).toHaveAttribute('aria-busy', 'true');
    });

    it('renders custom loadingComponent', () => {
      render(
        <SmartState loading={true} loadingComponent={<div data-testid="custom-loading">…</div>}>
          {children}
        </SmartState>
      );
      expect(screen.getByTestId('custom-loading')).toBeInTheDocument();
    });

    it('renders custom loading ComponentType', () => {
      const CustomLoader = () => <div data-testid="custom-loader-component">loading</div>;
      render(
        <SmartState loading={true} loadingComponent={CustomLoader}>
          {children}
        </SmartState>
      );
      expect(screen.getByTestId('custom-loader-component')).toBeInTheDocument();
    });
  });

  // ── Error ─────────────────────────────────────────────────────────────────

  describe('error state', () => {
    it('renders DefaultError when error is an Error object', () => {
      render(<SmartState error={new Error('boom')}>{children}</SmartState>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('boom')).toBeInTheDocument();
    });

    it('renders DefaultError when error is a string', () => {
      render(<SmartState error="network failed">{children}</SmartState>);
      expect(screen.getByText('network failed')).toBeInTheDocument();
    });

    it('renders DefaultError when error=true', () => {
      render(<SmartState error={true}>{children}</SmartState>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('renders custom errorComponent', () => {
      render(
        <SmartState error={new Error('x')} errorComponent={<div data-testid="custom-err">err</div>}>
          {children}
        </SmartState>
      );
      expect(screen.getByTestId('custom-err')).toBeInTheDocument();
    });

    it('has role=alert on error state', () => {
      render(<SmartState error={new Error('e')}>{children}</SmartState>);
      const el = screen.getByRole('alert');
      expect(el).toBeInTheDocument();
    });
  });

  // ── Empty ─────────────────────────────────────────────────────────────────

  describe('empty state', () => {
    it('renders DefaultEmpty when data is empty array', () => {
      render(<SmartState data={[]}>{children}</SmartState>);
      expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
      expect(screen.queryByTestId('children')).not.toBeInTheDocument();
    });

    it('renders DefaultEmpty when data is null', () => {
      render(<SmartState data={null}>{children}</SmartState>);
      expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
    });

    it('renders DefaultEmpty when data is empty object', () => {
      render(<SmartState data={{}}>{children}</SmartState>);
      expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
    });

    it('renders DefaultEmpty when data is empty string', () => {
      render(<SmartState data="">{children}</SmartState>);
      expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
    });

    it('renders custom emptyComponent', () => {
      render(
        <SmartState data={[]} emptyComponent={<div data-testid="custom-empty">empty</div>}>
          {children}
        </SmartState>
      );
      expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
    });

    it('uses custom isEmpty function', () => {
      const items = [1, 2, 3];
      render(
        <SmartState data={items} isEmpty={(d) => (d as number[]).length > 10}>
          {children}
        </SmartState>
      );
      // length 3, not > 10, so success
      expect(screen.getByTestId('children')).toBeInTheDocument();
    });

    it('custom isEmpty triggers empty state when true', () => {
      const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      render(
        <SmartState data={items} isEmpty={(d) => (d as number[]).length > 10}>
          {children}
        </SmartState>
      );
      expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
    });
  });

  // ── Success ────────────────────────────────────────────────────────────────

  describe('success state', () => {
    it('renders children when data is non-empty', () => {
      render(<SmartState data={[1, 2, 3]}>{children}</SmartState>);
      expect(screen.getByTestId('children')).toBeInTheDocument();
    });

    it('renders children when no state flags are set', () => {
      render(<SmartState>{children}</SmartState>);
      expect(screen.getByTestId('children')).toBeInTheDocument();
    });

    it('passes className and style to wrapper', () => {
      render(
        <SmartState className="my-class" style={{ color: 'red' }}>
          {children}
        </SmartState>
      );
      const wrapper = screen.getByTestId('children').parentElement;
      expect(wrapper).toHaveClass('my-class');
      expect(wrapper).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    });
  });

  // ── Offline ───────────────────────────────────────────────────────────────

  describe('offline state', () => {
    it('renders DefaultOffline when offline=true', () => {
      render(<SmartState offline={true}>{children}</SmartState>);
      expect(screen.getByText("You're offline")).toBeInTheDocument();
    });

    it('has aria-live=polite on offline state', () => {
      render(<SmartState offline={true}>{children}</SmartState>);
      expect(screen.getByRole('status', { name: 'You are offline' })).toHaveAttribute(
        'aria-live',
        'polite'
      );
    });

    it('renders custom offlineComponent', () => {
      render(
        <SmartState
          offline={true}
          offlineComponent={<div data-testid="custom-offline">offline</div>}
        >
          {children}
        </SmartState>
      );
      expect(screen.getByTestId('custom-offline')).toBeInTheDocument();
    });
  });

  // ── Unauthorized ──────────────────────────────────────────────────────────

  describe('unauthorized state', () => {
    it('renders DefaultUnauthorized when unauthorized=true', () => {
      render(<SmartState unauthorized={true}>{children}</SmartState>);
      expect(screen.getByText('Sign in required')).toBeInTheDocument();
    });

    it('renders custom unauthorizedComponent', () => {
      render(
        <SmartState
          unauthorized={true}
          unauthorizedComponent={<div data-testid="custom-unauth">401</div>}
        >
          {children}
        </SmartState>
      );
      expect(screen.getByTestId('custom-unauth')).toBeInTheDocument();
    });
  });

  // ── Forbidden ─────────────────────────────────────────────────────────────

  describe('forbidden state', () => {
    it('renders DefaultForbidden when forbidden=true', () => {
      render(<SmartState forbidden={true}>{children}</SmartState>);
      expect(screen.getByText('Access denied')).toBeInTheDocument();
    });

    it('renders custom forbiddenComponent', () => {
      render(
        <SmartState
          forbidden={true}
          forbiddenComponent={<div data-testid="custom-forbidden">403</div>}
        >
          {children}
        </SmartState>
      );
      expect(screen.getByTestId('custom-forbidden')).toBeInTheDocument();
    });
  });

  // ── Not Found ─────────────────────────────────────────────────────────────

  describe('notFound state', () => {
    it('renders DefaultNotFound when notFound=true', () => {
      render(<SmartState notFound={true}>{children}</SmartState>);
      expect(screen.getByText('Not found')).toBeInTheDocument();
    });

    it('renders custom notFoundComponent', () => {
      render(
        <SmartState
          notFound={true}
          notFoundComponent={<div data-testid="custom-notfound">404</div>}
        >
          {children}
        </SmartState>
      );
      expect(screen.getByTestId('custom-notfound')).toBeInTheDocument();
    });
  });

  // ── Maintenance ───────────────────────────────────────────────────────────

  describe('maintenance state', () => {
    it('renders DefaultMaintenance when maintenance=true', () => {
      render(<SmartState maintenance={true}>{children}</SmartState>);
      expect(screen.getByText('Under maintenance')).toBeInTheDocument();
    });

    it('renders custom maintenanceComponent', () => {
      render(
        <SmartState
          maintenance={true}
          maintenanceComponent={<div data-testid="custom-maintenance">maint</div>}
        >
          {children}
        </SmartState>
      );
      expect(screen.getByTestId('custom-maintenance')).toBeInTheDocument();
    });
  });

  // ── Priority order ────────────────────────────────────────────────────────

  describe('priority order', () => {
    it('maintenance beats offline', () => {
      render(
        <SmartState maintenance={true} offline={true}>
          {children}
        </SmartState>
      );
      expect(screen.getByText('Under maintenance')).toBeInTheDocument();
      expect(screen.queryByText("You're offline")).not.toBeInTheDocument();
    });

    it('offline beats unauthorized', () => {
      render(
        <SmartState offline={true} unauthorized={true}>
          {children}
        </SmartState>
      );
      expect(screen.getByText("You're offline")).toBeInTheDocument();
    });

    it('loading beats error', () => {
      render(
        <SmartState loading={true} error={new Error('e')}>
          {children}
        </SmartState>
      );
      expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('error beats empty', () => {
      render(
        <SmartState error={new Error('e')} data={[]}>
          {children}
        </SmartState>
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.queryByText('Nothing here yet')).not.toBeInTheDocument();
    });
  });

  // ── Custom state ──────────────────────────────────────────────────────────

  describe('custom state', () => {
    it('renders customComponent when provided in success state', () => {
      render(
        <SmartState customComponent={<div data-testid="custom-state">custom</div>}>
          {children}
        </SmartState>
      );
      expect(screen.getByTestId('custom-state')).toBeInTheDocument();
      expect(screen.queryByTestId('children')).not.toBeInTheDocument();
    });
  });

  // ── Type safety ───────────────────────────────────────────────────────────

  describe('type safety', () => {
    it('accepts generic data type', () => {
      interface User {
        id: number;
        name: string;
      }
      const users: User[] = [{ id: 1, name: 'Alice' }];
      render(
        <SmartState<User[]> data={users} isEmpty={(d) => d.length === 0}>
          {children}
        </SmartState>
      );
      expect(screen.getByTestId('children')).toBeInTheDocument();
    });
  });
});
