import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

describe('Home', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  function renderHome() {
    return render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
  }

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

  it('can create and delete a subscription', async () => {
    window.confirm = vi.fn(() => true);
    renderHome();

    const user = userEvent.setup();
    const nameInput = screen.getByPlaceholderText('Название (опционально)');
    await user.type(nameInput, 'Delete Me');

    await user.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(screen.getByText('Delete Me')).toBeInTheDocument();

    const menuButton = screen.getByRole('button', { name: 'Options' });
    await user.click(menuButton);

    const deleteButton = screen.getByRole('button', { name: 'Удалить абонемент' });
    await user.click(deleteButton);

    expect(screen.queryByText('Delete Me')).not.toBeInTheDocument();
  });
});
