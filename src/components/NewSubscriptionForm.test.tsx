import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import NewSubscriptionForm from './NewSubscriptionForm';

function renderForm(onAdd = vi.fn()) {
  return render(
    <MemoryRouter>
      <NewSubscriptionForm onAdd={onAdd} />
    </MemoryRouter>
  );
}

describe('NewSubscriptionForm', () => {
  it('renders form elements', () => {
    renderForm();
    expect(screen.getByText('Новый абонемент')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Название (опционально)')).toBeInTheDocument();
    expect(screen.getByText('Количество занятий')).toBeInTheDocument();
    expect(screen.getByText('Дата начала')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Добавить' })).toBeInTheDocument();
  });

  it('calls onAdd with form data on submit', async () => {
    const onAdd = vi.fn();
    renderForm(onAdd);

    const user = userEvent.setup();
    const nameInput = screen.getByPlaceholderText('Название (опционально)');
    await user.clear(nameInput);
    await user.type(nameInput, 'My Gym');

    await user.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(onAdd).toHaveBeenCalledWith('My Gym', 12, expect.any(String));
  });

  it('clears name input after submit', async () => {
    const onAdd = vi.fn();
    renderForm(onAdd);

    const user = userEvent.setup();
    const nameInput = screen.getByPlaceholderText('Название (опционально)');
    await user.type(nameInput, 'Test');

    await user.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(nameInput).toHaveValue('');
  });

  it('defaults total sessions to 12', () => {
    renderForm();
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('12');
  });

  it('submits with empty name', async () => {
    const onAdd = vi.fn();
    renderForm(onAdd);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(onAdd).toHaveBeenCalledWith('', 12, expect.any(String));
  });
});
