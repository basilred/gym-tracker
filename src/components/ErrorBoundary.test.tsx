import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ErrorBoundary from './ErrorBoundary';

const ThrowError: React.FC = () => {
  throw new Error('Test error');
};

function renderWithBoundary(children: React.ReactNode) {
  return render(
    <ErrorBoundary>{children}</ErrorBoundary>
  );
}

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    renderWithBoundary(<p>Normal content</p>);
    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });

  it('shows fallback UI when child throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithBoundary(<ThrowError />);

    expect(screen.getByText(/Что-то пошло не так/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Попробовать снова/ })).toBeInTheDocument();

    spy.mockRestore();
  });

  it('recovers after clicking retry button', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { rerender } = render(
      <ErrorBoundary key="test-1"><ThrowError /></ErrorBoundary>
    );
    expect(screen.getByText(/Что-то пошло не так/)).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Попробовать снова/ }));

    rerender(
      <ErrorBoundary key="test-2"><p>Recovered</p></ErrorBoundary>
    );
    expect(screen.getByText('Recovered')).toBeInTheDocument();

    spy.mockRestore();
  });
});
