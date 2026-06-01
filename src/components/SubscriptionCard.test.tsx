import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SubscriptionCard from './SubscriptionCard';

const mockSub = {
  id: 'sub-1',
  name: 'Test Gym',
  totalSessions: 8,
  startDate: '2026-01-15',
  visits: [
    { id: 'v1', date: '2026-01-16T10:00:00.000Z' },
    { id: 'v2', date: '2026-01-18T14:30:00.000Z' },
  ],
};

function renderCard(sub = mockSub, onDelete = vi.fn()) {
  return render(
    <MemoryRouter>
      <SubscriptionCard sub={sub} onDelete={onDelete} />
    </MemoryRouter>
  );
}

describe('SubscriptionCard', () => {
  it('renders subscription name', () => {
    renderCard();
    expect(screen.getByText('Test Gym')).toBeInTheDocument();
  });

  it('renders remaining sessions count', () => {
    renderCard();
    expect(screen.getByText(/Осталось 6 из 8 занятий/)).toBeInTheDocument();
  });

  it('renders start date', () => {
    renderCard();
    expect(screen.getByText(/С 1\/15\/2026/)).toBeInTheDocument();
  });

  it('links to subscription detail page', () => {
    renderCard();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/subscription/sub-1');
  });

  it('toggles menu on button click', async () => {
    const user = userEvent.setup();
    renderCard();

    const menuButton = screen.getByRole('button', { name: 'Options' });
    await user.click(menuButton);

    expect(screen.getByText('Удалить')).toBeInTheDocument();
  });

  it('renders progress bar with correct width', () => {
    renderCard();
    const fill = document.querySelector('.SubscriptionCard-ProgressFill') as HTMLElement;
    expect(fill).toBeInTheDocument();
    expect(fill.style.getPropertyValue('--progress')).toBe('25%');
  });

  it('handles zero totalSessions gracefully', () => {
    const sub = { ...mockSub, totalSessions: 0, visits: [] };
    renderCard(sub);

    const fill = document.querySelector('.SubscriptionCard-ProgressFill') as HTMLElement;
    const progress = fill.style.getPropertyValue('--progress');
    expect(progress).not.toBe('Infinity%');
  });

  it('shows zero remaining when totalSessions is 0', () => {
    const sub = { ...mockSub, totalSessions: 0, visits: [] };
    renderCard(sub);
    expect(screen.getByText(/Осталось 0 из 0 занятий/)).toBeInTheDocument();
  });
});
