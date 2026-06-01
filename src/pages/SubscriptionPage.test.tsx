import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SubscriptionPage from '../pages/SubscriptionPage';

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
        <Routes>
          <Route path="/subscription/:id" element={<SubscriptionPage />} />
          <Route path="/" element={<p>Home Page</p>} />
        </Routes>
      </MemoryRouter>
    );
  }

  it('shows not found message for missing subscription', () => {
    renderPage('/subscription/nonexistent');
    expect(screen.getByText('Абонемент не найден.')).toBeInTheDocument();
  });

  it('renders subscription details when found', () => {
    seedSubscription();
    renderPage('/subscription/sub-1');
    expect(screen.getByText('Test Gym')).toBeInTheDocument();
  });

  it('renders back link', () => {
    seedSubscription();
    renderPage('/subscription/sub-1');
    expect(screen.getByRole('link', { name: 'Вернуться на главную' })).toBeInTheDocument();
  });

  it('can add a visit', async () => {
    seedSubscription();
    renderPage('/subscription/sub-1');

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Отметить занятие' }));

    expect(screen.getByText(/Осталось 7 из 8 занятий/)).toBeInTheDocument();
  });
});
