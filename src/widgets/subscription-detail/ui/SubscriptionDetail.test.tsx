import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SubscriptionDetail from './SubscriptionDetail';

const mockSub = {
  id: 'sub-1',
  name: 'Test Gym',
  totalSessions: 8,
  startDate: '2026-01-15',
  visits: [
    { id: 'v1', date: '2026-01-16T10:00:00.000Z' },
  ],
};

function renderDetail(sub = mockSub, onAddVisit = vi.fn(), onDeleteVisit = vi.fn(), onEditVisit = vi.fn(), onUpdate = vi.fn()) {
  return render(
    <SubscriptionDetail
      sub={sub}
      onAddVisit={onAddVisit}
      onDeleteVisit={onDeleteVisit}
      onEditVisit={onEditVisit}
      onUpdate={onUpdate}
    />
  );
}

describe('SubscriptionDetail', () => {
  it('renders subscription name', () => {
    renderDetail();
    expect(screen.getByText('Test Gym')).toBeInTheDocument();
  });

  it('renders start date', () => {
    renderDetail();
    expect(screen.getByText(/Начало: 1\/15\/2026/)).toBeInTheDocument();
  });

  it('renders remaining sessions', () => {
    renderDetail();
    expect(screen.getByText(/Осталось 7 из 8 занятий/)).toBeInTheDocument();
  });

  it('calls onAddVisit when button is clicked', async () => {
    const onAddVisit = vi.fn();
    renderDetail(mockSub, onAddVisit);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Отметить занятие' }));

    expect(onAddVisit).toHaveBeenCalledWith('sub-1');
  });

  it('disables button when no sessions remaining', () => {
    const sub = {
      ...mockSub,
      visits: Array.from({ length: 8 }, (_, i) => ({
        id: `v${i}`,
        date: `2026-01-${String(i + 1).padStart(2, '0')}T10:00:00.000Z`,
      })),
    };
    renderDetail(sub);

    expect(screen.getByRole('button', { name: 'Отметить занятие' })).toBeDisabled();
  });

  it('renders progress bar', () => {
    renderDetail();
    const fill = document.querySelector('.SubscriptionDetail-ProgressFill') as HTMLElement;
    expect(fill).toBeInTheDocument();
    expect(fill.style.getPropertyValue('--progress')).toBe('12.5%');
  });

  it('renders VisitTimeline', () => {
    renderDetail();
    expect(screen.getByText(/1\/16\/2026/)).toBeInTheDocument();
  });

  it('handles zero totalSessions gracefully', () => {
    const sub = { ...mockSub, totalSessions: 0, visits: [] };
    renderDetail(sub);

    const fill = document.querySelector('.SubscriptionDetail-ProgressFill') as HTMLElement;
    const progress = fill.style.getPropertyValue('--progress');
    expect(progress).not.toBe('Infinity%');
  });

  describe('inline editing', () => {
    it('shows textarea when clicking the name', async () => {
      const user = userEvent.setup();
      renderDetail();

      await user.click(screen.getByText('Test Gym'));

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('saves on Enter and calls onUpdate', async () => {
      const onUpdate = vi.fn();
      const user = userEvent.setup();
      renderDetail(mockSub, vi.fn(), vi.fn(), vi.fn(), onUpdate);

      await user.click(screen.getByText('Test Gym'));
      const textbox = screen.getByRole('textbox');
      await user.clear(textbox);
      await user.type(textbox, 'Updated Name{Enter}');

      expect(onUpdate).toHaveBeenCalledWith('sub-1', { name: 'Updated Name' });
    });

    it('cancels on Escape and reverts to original name', async () => {
      const onUpdate = vi.fn();
      const user = userEvent.setup();
      renderDetail(mockSub, vi.fn(), vi.fn(), vi.fn(), onUpdate);

      await user.click(screen.getByText('Test Gym'));
      const textbox = screen.getByRole('textbox');
      await user.clear(textbox);
      await user.type(textbox, 'Changed{Escape}');

      expect(onUpdate).not.toHaveBeenCalled();
      expect(screen.getByText('Test Gym')).toBeInTheDocument();
    });

    it('saves on blur', async () => {
      const onUpdate = vi.fn();
      const user = userEvent.setup();
      renderDetail(mockSub, vi.fn(), vi.fn(), vi.fn(), onUpdate);

      await user.click(screen.getByText('Test Gym'));
      const textbox = screen.getByRole('textbox');
      await user.clear(textbox);
      await user.type(textbox, 'Blur Save');
      await user.click(document.body);

      expect(onUpdate).toHaveBeenCalledWith('sub-1', { name: 'Blur Save' });
    });

    it('does not call onUpdate when name is unchanged', async () => {
      const onUpdate = vi.fn();
      const user = userEvent.setup();
      renderDetail(mockSub, vi.fn(), vi.fn(), vi.fn(), onUpdate);

      await user.click(screen.getByText('Test Gym'));
      await user.type(screen.getByRole('textbox'), '{Enter}');

      expect(onUpdate).not.toHaveBeenCalled();
    });
  });
});
