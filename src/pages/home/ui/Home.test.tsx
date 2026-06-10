import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SubscriptionProvider } from '@/entities/subscription';
import Home from './Home';

describe('Home', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  function renderHome() {
    return render(
      <MemoryRouter>
        <SubscriptionProvider>
          <Home />
        </SubscriptionProvider>
      </MemoryRouter>
    );
  }

  it('has no accessibility violations', async () => {
    const { container } = renderHome();
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it('renders the page title', () => {
    renderHome();
    expect(screen.getByText('Мои абонементы')).toBeInTheDocument();
  });

  it('renders the subscription form', () => {
    renderHome();
    expect(screen.getByText('Новый абонемент')).toBeInTheDocument();
  });

  it('shows empty state when no subscriptions', () => {
    renderHome();
    expect(screen.getByText(/Пока нет абонементов/)).toBeInTheDocument();
  });

  it('creates a subscription and shows it in the list', async () => {
    renderHome();

    const user = userEvent.setup();
    const nameInput = screen.getByPlaceholderText('Название (опционально)');
    await user.type(nameInput, 'Test Gym');

    await user.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(screen.getByText('Test Gym')).toBeInTheDocument();
  });

  it('can edit a subscription name inline', async () => {
    renderHome();

    const user = userEvent.setup();
    const nameInput = screen.getByPlaceholderText('Название (опционально)');
    await user.type(nameInput, 'Editable Gym');
    await user.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(screen.getByText('Editable Gym')).toBeInTheDocument();

    await user.click(screen.getByText('Editable Gym'));
    const textboxes = screen.getAllByRole('textbox');
    const cardTextarea = textboxes[0];
    await user.clear(cardTextarea);
    await user.type(cardTextarea, 'Renamed Gym{Enter}');

    expect(screen.getByText('Renamed Gym')).toBeInTheDocument();
    expect(screen.queryByText('Editable Gym')).not.toBeInTheDocument();
  });

  it('can create and delete a subscription', async () => {
    window.confirm = vi.fn(() => true);
    renderHome();

    const user = userEvent.setup();
    const nameInput = screen.getByPlaceholderText('Название (опционально)');
    await user.type(nameInput, 'Delete Me');

    await user.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(screen.getByText('Delete Me')).toBeInTheDocument();

    const menuButton = screen.getByRole('button', { name: 'Меню' });
    await user.click(menuButton);

    const deleteButton = screen.getByRole('button', { name: 'Удалить абонемент' });
    await user.click(deleteButton);

    expect(screen.queryByText('Delete Me')).not.toBeInTheDocument();
  });
});
