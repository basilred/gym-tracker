import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the home page by default', () => {
    render(<App />);
    expect(screen.getByText('Мои абонементы')).toBeInTheDocument();
  });

  it('shows 404 page for unknown routes', () => {
    window.history.pushState({}, '', '/unknown-route');
    render(<App />);
    expect(screen.getByText('Страница не найдена')).toBeInTheDocument();
  });
});
