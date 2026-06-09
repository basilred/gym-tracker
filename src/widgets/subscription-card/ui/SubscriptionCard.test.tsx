import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SubscriptionCard from './SubscriptionCard';

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
    { id: 'v2', date: '2026-01-18T14:30:00.000Z' },
  ],
};

function renderCard(sub = mockSub) {
  mockUseSubscriptions.mockReturnValue({
    deleteSubscription: vi.fn(),
    updateSubscription: vi.fn(),
    getSubscription: vi.fn(() => sub),
  });
  return render(
    <MemoryRouter>
      <SubscriptionCard sub={sub} />
    </MemoryRouter>
  );
}

describe('SubscriptionCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders subscription name', () => {
    renderCard();
    expect(screen.getByText('Test Gym')).toBeInTheDocument();
  });

  it('renders remaining sessions count', () => {
    renderCard();
    expect(screen.getByText(/Осталось 6 из 8 занятий/)).toBeInTheDocument();
  });

  it('renders start date', () => {
    renderCard();
    expect(screen.getByText(/С /)).toBeInTheDocument();
  });

  it('links to subscription detail page', () => {
    renderCard();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/subscription/sub-1');
  });

  it('toggles menu on button click', async () => {
    const user = userEvent.setup();
    renderCard();

    const menuButton = screen.getByRole('button', { name: 'Options' });
    await user.click(menuButton);

    expect(screen.getByText('Удалить')).toBeInTheDocument();
  });

  it('renders progress bar with correct width', () => {
    renderCard();
    const fill = document.querySelector('.SubscriptionCard-ProgressFill') as HTMLElement;
    expect(fill).toBeInTheDocument();
    expect(fill.style.getPropertyValue('--progress')).toBe('25%');
  });

  it('handles zero totalSessions gracefully', () => {
    const sub = { ...mockSub, totalSessions: 0, visits: [] };
    renderCard(sub);

    const fill = document.querySelector('.SubscriptionCard-ProgressFill') as HTMLElement;
    const progress = fill.style.getPropertyValue('--progress');
    expect(progress).not.toBe('Infinity%');
  });

  it('shows zero remaining when totalSessions is 0', () => {
    const sub = { ...mockSub, totalSessions: 0, visits: [] };
    renderCard(sub);
    expect(screen.getByText(/Осталось 0 из 0 занятий/)).toBeInTheDocument();
  });

  describe('inline editing', () => {
    it('shows textarea when clicking the name', async () => {
      const user = userEvent.setup();
      renderCard();

      await user.click(screen.getByText('Test Gym'));

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('saves on Enter and calls updateSubscription', async () => {
      const updateSubscription = vi.fn();
      mockUseSubscriptions.mockReturnValue({
        deleteSubscription: vi.fn(),
        updateSubscription,
        getSubscription: vi.fn(() => mockSub),
      });

      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <SubscriptionCard sub={mockSub} />
        </MemoryRouter>
      );

      await user.click(screen.getByText('Test Gym'));
      const textbox = screen.getByRole('textbox');
      await user.clear(textbox);
      await user.type(textbox, 'Updated Name{Enter}');

      expect(updateSubscription).toHaveBeenCalledWith('sub-1', { name: 'Updated Name' });
    });

    it('cancels on Escape and reverts to original name', async () => {
      const updateSubscription = vi.fn();
      mockUseSubscriptions.mockReturnValue({
        deleteSubscription: vi.fn(),
        updateSubscription,
        getSubscription: vi.fn(() => mockSub),
      });

      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <SubscriptionCard sub={mockSub} />
        </MemoryRouter>
      );

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
        deleteSubscription: vi.fn(),
        updateSubscription,
        getSubscription: vi.fn(() => mockSub),
      });

      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <SubscriptionCard sub={mockSub} />
        </MemoryRouter>
      );

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
        deleteSubscription: vi.fn(),
        updateSubscription,
        getSubscription: vi.fn(() => mockSub),
      });

      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <SubscriptionCard sub={mockSub} />
        </MemoryRouter>
      );

      await user.click(screen.getByText('Test Gym'));
      await user.type(screen.getByRole('textbox'), '{Enter}');

      expect(updateSubscription).not.toHaveBeenCalled();
    });
  });
});
