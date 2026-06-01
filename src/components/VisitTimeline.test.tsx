import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VisitTimeline from './VisitTimeline';

const mockVisits = [
  { id: 'v1', date: '2026-01-16T10:00:00.000Z' },
  { id: 'v2', date: '2026-01-18T14:30:00.000Z' },
];

function renderTimeline(visits = mockVisits, onDeleteVisit = vi.fn()) {
  return render(
    <VisitTimeline visits={visits} onDeleteVisit={onDeleteVisit} />
  );
}

describe('VisitTimeline', () => {
  it('renders empty state when no visits', () => {
    renderTimeline([]);
    expect(screen.getByText('Пока нет посещений')).toBeInTheDocument();
  });

  it('renders visit dates', () => {
    renderTimeline();
    expect(screen.getByText(/1\/18\/2026/)).toBeInTheDocument();
    expect(screen.getByText(/1\/16\/2026/)).toBeInTheDocument();
  });

  it('renders delete buttons for each visit', () => {
    renderTimeline();
    const deleteButtons = screen.getAllByRole('button', { name: 'Удалить посещение' });
    expect(deleteButtons).toHaveLength(2);
  });

  it('calls onDeleteVisit with visit id when delete button is clicked', async () => {
    const onDeleteVisit = vi.fn();
    window.confirm = vi.fn(() => true);
    renderTimeline(mockVisits, onDeleteVisit);

    const user = userEvent.setup();
    const deleteButtons = screen.getAllByRole('button', { name: 'Удалить посещение' });
    await user.click(deleteButtons[0]);

    expect(onDeleteVisit).toHaveBeenCalledWith(expect.any(String));
  });

  it('does not call onDeleteVisit when confirm is cancelled', async () => {
    const onDeleteVisit = vi.fn();
    window.confirm = vi.fn(() => false);
    renderTimeline(mockVisits, onDeleteVisit);

    const user = userEvent.setup();
    const deleteButtons = screen.getAllByRole('button', { name: 'Удалить посещение' });
    await user.click(deleteButtons[0]);

    expect(onDeleteVisit).not.toHaveBeenCalled();
  });
});
