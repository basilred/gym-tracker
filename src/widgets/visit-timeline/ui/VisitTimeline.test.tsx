import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import VisitTimeline from './VisitTimeline';

const mockVisits = [
  { id: 'v1', date: '2026-01-16T10:00:00.000Z' },
  { id: 'v2', date: '2026-01-18T14:30:00.000Z' },
];

function renderTimeline(
  visits = mockVisits,
  onDeleteVisit = vi.fn(),
  onEditVisit = vi.fn(),
  startDate = '2026-01-15'
) {
  return render(
    <VisitTimeline
      visits={visits}
      onDeleteVisit={onDeleteVisit}
      onEditVisit={onEditVisit}
      startDate={startDate}
    />
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

  describe('date editing', () => {
    it('enters edit mode when date is clicked', async () => {
      renderTimeline();
      const user = userEvent.setup();

      const dateElements = screen.getAllByText(/1\/18\/2026/);
      await user.click(dateElements[0]);

      const dateInput = screen.getByDisplayValue('2026-01-18');
      expect(dateInput).toBeInTheDocument();
      expect(dateInput.tagName).toBe('INPUT');
    });

    it('calls onEditVisit with visit id and new date on change', async () => {
      const onEditVisit = vi.fn();
      renderTimeline(mockVisits, vi.fn(), onEditVisit);
      const user = userEvent.setup();

      const dateElements = screen.getAllByText(/1\/18\/2026/);
      await user.click(dateElements[0]);

      const dateInput = screen.getByDisplayValue('2026-01-18');
      fireEvent.change(dateInput, { target: { value: '2026-01-20' } });

      expect(onEditVisit).toHaveBeenCalledWith(expect.any(String), '2026-01-20');
    });

    it('exits edit mode on blur', async () => {
      renderTimeline();
      const user = userEvent.setup();

      const dateElements = screen.getAllByText(/1\/18\/2026/);
      await user.click(dateElements[0]);

      expect(screen.getByDisplayValue('2026-01-18')).toBeInTheDocument();
      await user.click(document.body);

      expect(screen.queryByDisplayValue('2026-01-18')).not.toBeInTheDocument();
    });

    it('respects min and max date bounds', async () => {
      renderTimeline();
      const user = userEvent.setup();

      const dateElements = screen.getAllByText(/1\/16\/2026/);
      await user.click(dateElements[0]);

      const dateInput = screen.getByDisplayValue('2026-01-16');
      expect(dateInput).toHaveAttribute('min', '2026-01-15');
      expect(dateInput).toHaveAttribute('max', '2026-01-18');
    });
  });
});
