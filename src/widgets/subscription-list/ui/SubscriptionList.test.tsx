import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import type { Subscription } from '@/entities/subscription';
import { SubscriptionProvider } from '@/entities/subscription';
import SubscriptionList from './SubscriptionList';

const mockSubs: Subscription[] = [
  {
    id: 'sub-1',
    name: 'Gym A',
    totalSessions: 8,
    startDate: '2026-01-01',
    visits: [],
  },
  {
    id: 'sub-2',
    name: 'Gym B',
    totalSessions: 12,
    startDate: '2026-02-01',
    visits: [],
  },
];

function renderList(subs = mockSubs) {
  return render(
    <MemoryRouter>
      <SubscriptionProvider>
        <SubscriptionList subscriptions={subs} />
      </SubscriptionProvider>
    </MemoryRouter>
  );
}

describe('SubscriptionList', () => {
  it('renders empty state when no subscriptions', () => {
    renderList([]);
    expect(screen.getByText(/Пока нет абонементов/)).toBeInTheDocument();
  });

  it('renders subscription cards for each subscription', () => {
    renderList();
    expect(screen.getByText('Gym A')).toBeInTheDocument();
    expect(screen.getByText('Gym B')).toBeInTheDocument();
  });

  it('renders correct number of cards', () => {
    renderList();
    const cards = document.querySelectorAll('.SubscriptionCard');
    expect(cards).toHaveLength(2);
  });
});
