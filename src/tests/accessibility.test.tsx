import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SmartState } from '../components/SmartState';
import { DefaultLoading } from '../components/defaults/DefaultLoading';
import { DefaultError } from '../components/defaults/DefaultError';
import { DefaultOffline } from '../components/defaults/DefaultOffline';

const children = <div>content</div>;

describe('Accessibility', () => {
  describe('DefaultLoading', () => {
    it('has role=status', () => {
      render(<DefaultLoading />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('has aria-busy=true', () => {
      render(<DefaultLoading />);
      expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
    });

    it('has aria-label', () => {
      render(<DefaultLoading />);
      expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
    });
  });

  describe('DefaultError', () => {
    it('has role=alert', () => {
      render(<DefaultError error="test error" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('has aria-live=assertive', () => {
      render(<DefaultError error="test error" />);
      expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
    });
  });

  describe('DefaultOffline', () => {
    it('has aria-live=polite', () => {
      render(<DefaultOffline />);
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('SmartState accessibility', () => {
    it('loading state is accessible', () => {
      render(<SmartState loading={true}>{children}</SmartState>);
      const loadingEl = screen.getByRole('status', { name: 'Loading' });
      expect(loadingEl).toHaveAttribute('aria-busy', 'true');
    });

    it('error state is accessible', () => {
      render(<SmartState error={new Error('test')}>{children}</SmartState>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('offline state has aria-live=polite', () => {
      render(<SmartState offline={true}>{children}</SmartState>);
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    });

    it('icons have aria-hidden=true', () => {
      render(<SmartState error={new Error('e')}>{children}</SmartState>);
      const icon = screen.getByRole('alert').querySelector('[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
    });
  });
});
