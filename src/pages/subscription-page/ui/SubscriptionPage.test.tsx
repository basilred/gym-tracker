import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import { SubscriptionProvider } from '@/entities/subscription';
import SubscriptionPage from './SubscriptionPage';

const STORAGE_KEY = 'gym_subscriptions';

describe('SubscriptionPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  function seedSubscription() {
    const payload = {
      _schemaVersion: 1,
      data: [
        {
          id: 'sub-1',
          name: 'Test Gym',
          totalSessions: 8,
          startDate: '2026-01-15',
          visits: [],
        },
      ],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  function renderPage(route: string) {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <SubscriptionProvider>
          <Routes>
            <Route path="/subscription/:id" element={<SubscriptionPage />} />
            <Route path="/" element={<p>Home Page</p>} />
          </Routes>
        </SubscriptionProvider>
      </MemoryRouter>
    );
  }

  it('has no accessibility violations when subscription found', async () => {
    seedSubscription();
    const { container } = renderPage('/subscription/sub-1');
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it('shows not found message for missing subscription', () => {
    renderPage('/subscription/nonexistent');
    expect(screen.getByText('Абонемент не найден.')).toBeInTheDocument();
  });

  it('renders subscription details when found', async () => {
    seedSubscription();
    renderPage('/subscription/sub-1');

    await waitFor(() => {
      expect(screen.getByText('Test Gym')).toBeInTheDocument();
    });
  });

  it('renders back link', async () => {
    seedSubscription();
    renderPage('/subscription/sub-1');

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Вернуться на главную' })).toBeInTheDocument();
    });
  });

  it('can add a visit', async () => {
    seedSubscription();
    renderPage('/subscription/sub-1');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Отметить занятие' })).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Отметить занятие' }));

    expect(screen.getByText(/Осталось 7 из 8 занятий/)).toBeInTheDocument();
  });

  it('can edit subscription name inline', async () => {
    seedSubscription();
    renderPage('/subscription/sub-1');

    await waitFor(() => {
      expect(screen.getByText('Test Gym')).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.click(screen.getByText('Test Gym'));

    const textbox = screen.getByRole('textbox');
    await user.clear(textbox);
    await user.type(textbox, 'Renamed Gym{Enter}');

    expect(screen.getByText('Renamed Gym')).toBeInTheDocument();
    expect(screen.queryByText('Test Gym')).not.toBeInTheDocument();
  });
});
