import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { SubscriptionProvider } from '@/entities/subscription';
import MarkVisitButton from './MarkVisitButton';

const STORAGE_KEY = 'gym_subscriptions';

function seedSubscription(visitsCount = 0) {
  const visits = Array.from({ length: visitsCount }, (_, i) => ({
    id: `v-${i}`,
    date: new Date().toISOString(),
  }));
  const payload = {
    _schemaVersion: 1,
    data: [
      {
        id: 'sub-1',
        name: 'Test Gym',
        totalSessions: 8,
        startDate: '2026-01-15',
        visits,
      },
    ],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

describe('MarkVisitButton', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the button enabled when visits remain', () => {
    seedSubscription(0);
    render(<SubscriptionProvider><MarkVisitButton subId="sub-1" /></SubscriptionProvider>);

    const btn = screen.getByText('Отметить занятие');
    expect(btn).not.toBeDisabled();
  });

  it('disables button when all sessions used', () => {
    seedSubscription(8);
    render(<SubscriptionProvider><MarkVisitButton subId="sub-1" /></SubscriptionProvider>);
    expect(screen.getByText('Отметить занятие')).toBeDisabled();
  });

  it('adds a visit on click', async () => {
    seedSubscription(0);
    render(<SubscriptionProvider><MarkVisitButton subId="sub-1" /></SubscriptionProvider>);

    const user = userEvent.setup();
    await user.click(screen.getByText('Отметить занятие'));

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored.data[0].visits).toHaveLength(1);
  });
});
