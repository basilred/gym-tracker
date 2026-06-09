import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SubscriptionDetail from './SubscriptionDetail';

const mockUseSubscriptions = vi.fn();
vi.mock('@/entities/subscription', () => ({
  useSubscriptions: (...args: unknown[]) => mockUseSubscriptions(...args),
  calcProgress: (visits: number, total: number) => (visits / Math.max(total, 1)) * 100,
}));

const mockSub = {
  id: 'sub-1',
  name: 'Test Gym',
  totalSessions: 8,
  startDate: '2026-01-15',
  visits: [
    { id: 'v1', date: '2026-01-16T10:00:00.000Z' },
  ],
};

function renderDetail() {
  return render(<SubscriptionDetail subId="sub-1" />);
}

describe('SubscriptionDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSubscriptions.mockReturnValue({
      getSubscription: vi.fn(() => mockSub),
      addVisit: vi.fn(),
      removeVisit: vi.fn(),
      editVisit: vi.fn(),
      updateSubscription: vi.fn(),
    });
  });

  it('renders subscription name', () => {
    renderDetail();
    expect(screen.getByText('Test Gym')).toBeInTheDocument();
  });

  it('renders start date', () => {
    renderDetail();
    expect(screen.getByText(/Начало:/)).toBeInTheDocument();
  });

  it('renders remaining sessions', () => {
    renderDetail();
    expect(screen.getByText(/Осталось 7 из 8 занятий/)).toBeInTheDocument();
  });

  it('calls addVisit when button is clicked', async () => {
    const addVisit = vi.fn();
    mockUseSubscriptions.mockReturnValue({
      getSubscription: vi.fn(() => mockSub),
      addVisit,
      removeVisit: vi.fn(),
      editVisit: vi.fn(),
      updateSubscription: vi.fn(),
    });
    renderDetail();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Отметить занятие' }));

    expect(addVisit).toHaveBeenCalledWith('sub-1');
  });

  it('disables button when no sessions remaining', () => {
    const fullSub = {
      ...mockSub,
      visits: Array.from({ length: 8 }, (_, i) => ({
        id: `v${i}`,
        date: `2026-01-${String(i + 1).padStart(2, '0')}T10:00:00.000Z`,
      })),
    };
    mockUseSubscriptions.mockReturnValue({
      getSubscription: vi.fn(() => fullSub),
      addVisit: vi.fn(),
      removeVisit: vi.fn(),
      editVisit: vi.fn(),
      updateSubscription: vi.fn(),
    });
    renderDetail();

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
    mockUseSubscriptions.mockReturnValue({
      getSubscription: vi.fn(() => ({ ...mockSub, totalSessions: 0, visits: [] })),
      addVisit: vi.fn(),
      removeVisit: vi.fn(),
      editVisit: vi.fn(),
      updateSubscription: vi.fn(),
    });
    renderDetail();

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

    it('saves on Enter and calls updateSubscription', async () => {
      const updateSubscription = vi.fn();
      mockUseSubscriptions.mockReturnValue({
        getSubscription: vi.fn(() => mockSub),
        addVisit: vi.fn(),
        removeVisit: vi.fn(),
        editVisit: vi.fn(),
        updateSubscription,
      });

      const user = userEvent.setup();
      render(<SubscriptionDetail subId="sub-1" />);

      await user.click(screen.getByText('Test Gym'));
      const textbox = screen.getByRole('textbox');
      await user.clear(textbox);
      await user.type(textbox, 'Updated Name{Enter}');

      expect(updateSubscription).toHaveBeenCalledWith('sub-1', { name: 'Updated Name' });
    });

    it('cancels on Escape and reverts to original name', async () => {
      const updateSubscription = vi.fn();
      mockUseSubscriptions.mockReturnValue({
        getSubscription: vi.fn(() => mockSub),
        addVisit: vi.fn(),
        removeVisit: vi.fn(),
        editVisit: vi.fn(),
        updateSubscription,
      });

      const user = userEvent.setup();
      render(<SubscriptionDetail subId="sub-1" />);

      await user.click(screen.getByText('Test Gym'));
      const textbox = screen.getByRole('textbox');
      await user.clear(textbox);
      await user.type(textbox, 'Changed{Escape}');

      expect(updateSubscription).not.toHaveBeenCalled();
      expect(screen.getByText('Test Gym')).toBeInTheDocument();
    });

    it('saves on blur', async () => {
      const updateSubscription = vi.fn();
      mockUseSubscriptions.mockReturnValue({
        getSubscription: vi.fn(() => mockSub),
        addVisit: vi.fn(),
        removeVisit: vi.fn(),
        editVisit: vi.fn(),
        updateSubscription,
      });

      const user = userEvent.setup();
      render(<SubscriptionDetail subId="sub-1" />);

      await user.click(screen.getByText('Test Gym'));
      const textbox = screen.getByRole('textbox');
      await user.clear(textbox);
      await user.type(textbox, 'Blur Save');
      await user.click(document.body);

      expect(updateSubscription).toHaveBeenCalledWith('sub-1', { name: 'Blur Save' });
    });

    it('does not call updateSubscription when name is unchanged', async () => {
      const updateSubscription = vi.fn();
      mockUseSubscriptions.mockReturnValue({
        getSubscription: vi.fn(() => mockSub),
        addVisit: vi.fn(),
        removeVisit: vi.fn(),
        editVisit: vi.fn(),
        updateSubscription,
      });

      const user = userEvent.setup();
      render(<SubscriptionDetail subId="sub-1" />);

      await user.click(screen.getByText('Test Gym'));
      await user.type(screen.getByRole('textbox'), '{Enter}');

      expect(updateSubscription).not.toHaveBeenCalled();
    });
  });
});
