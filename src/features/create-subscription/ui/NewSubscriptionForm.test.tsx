import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import { SubscriptionProvider } from '@/entities/subscription';
import NewSubscriptionForm from './NewSubscriptionForm';

describe('NewSubscriptionForm', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders form elements', () => {
    render(
      <MemoryRouter>
        <SubscriptionProvider>
          <NewSubscriptionForm />
        </SubscriptionProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Новый абонемент')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Название (опционально)')).toBeInTheDocument();
    expect(screen.getByText('Количество занятий')).toBeInTheDocument();
    expect(screen.getByText('Дата начала')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Добавить' })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <SubscriptionProvider>
          <NewSubscriptionForm />
        </SubscriptionProvider>
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it('has label associated with the name input', () => {
    render(
      <MemoryRouter>
        <SubscriptionProvider>
          <NewSubscriptionForm />
        </SubscriptionProvider>
      </MemoryRouter>
    );
    const input = screen.getByLabelText('Название абонемента');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'subscription-name');
  });

  it('creates a subscription on submit', async () => {
    render(
      <MemoryRouter>
        <SubscriptionProvider>
          <NewSubscriptionForm />
        </SubscriptionProvider>
      </MemoryRouter>
    );

    const user = userEvent.setup();
    const nameInput = screen.getByPlaceholderText('Название (опционально)');
    await user.clear(nameInput);
    await user.type(nameInput, 'My Gym');

    await user.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(nameInput).toHaveValue('');
  });

  it('clears name input after submit', async () => {
    render(
      <MemoryRouter>
        <SubscriptionProvider>
          <NewSubscriptionForm />
        </SubscriptionProvider>
      </MemoryRouter>
    );

    const user = userEvent.setup();
    const nameInput = screen.getByPlaceholderText('Название (опционально)');
    await user.type(nameInput, 'Test');

    await user.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(nameInput).toHaveValue('');
  });

  it('defaults total sessions to 12', () => {
    render(
      <MemoryRouter>
        <SubscriptionProvider>
          <NewSubscriptionForm />
        </SubscriptionProvider>
      </MemoryRouter>
    );
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('12');
  });
});
