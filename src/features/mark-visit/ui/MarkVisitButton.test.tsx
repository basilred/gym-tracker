import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createElement, type ReactNode } from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useSubscriptions, SubscriptionProvider } from '@/entities/subscription';
import { replaceAllSubscriptions, setMeta } from '@/shared/lib/storage';
import MarkVisitButton from './MarkVisitButton';

function makeSub(visitsCount = 0) {
  const visits = Array.from({ length: visitsCount }, (_, i) => ({
    id: `v-${i}`,
    date: new Date().toISOString(),
  }));
  return {
    id: 'sub-1',
    name: 'Test Gym',
    totalSessions: 8,
    startDate: '2026-01-15',
    visits,
  };
}

function TestWrapper({ children }: { children: ReactNode }) {
  return createElement(SubscriptionProvider, null,
    createElement(TestAnnouncer, null, children)
  );
}

function TestAnnouncer({ children }: { children: ReactNode }) {
  const { announcement } = useSubscriptions();
  return createElement('div', null,
    createElement('div', { 'aria-live': 'polite', role: 'status' }, announcement),
    children
  );
}

describe('MarkVisitButton', () => {
  beforeEach(async () => {
    localStorage.clear();
    await setMeta('migrated', true);
    await replaceAllSubscriptions([makeSub(0)]);
  });

  it('renders the button enabled when visits remain', async () => {
    render(<TestWrapper><MarkVisitButton subId="sub-1" /></TestWrapper>);

    await waitFor(() => {
      expect(screen.getByText('Отметить занятие')).not.toBeDisabled();
    });
  });

  it('disables button when all sessions used', async () => {
    await setMeta('migrated', true);
    await replaceAllSubscriptions([makeSub(8)]);

    render(<TestWrapper><MarkVisitButton subId="sub-1" /></TestWrapper>);

    await waitFor(() => {
      expect(screen.getByText('Отметить занятие')).toBeDisabled();
    });
  });

  it('adds a visit on click', async () => {
    render(<TestWrapper><MarkVisitButton subId="sub-1" /></TestWrapper>);

    await waitFor(() => {
      expect(screen.getByText('Отметить занятие')).not.toBeDisabled();
    });

    const user = userEvent.setup();
    await user.click(screen.getByText('Отметить занятие'));

    await waitFor(() => {
      expect(screen.getByText('Посещение отмечено')).toBeInTheDocument();
    });
  });
});
