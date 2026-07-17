import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createElement, type ReactNode } from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SubscriptionProvider } from '@/entities/subscription';
import type { Subscription } from '@/entities/subscription';
import { replaceAllSubscriptions, setMeta, resetDb } from '@/shared/lib/storage';
import { DEFAULT_NOTIFICATION_SETTINGS } from '../model/types';
import NotificationSettings from './NotificationSettings';

let notificationCalls: Array<{ title: string }> = [];

beforeEach(() => {
  notificationCalls = [];

  Object.defineProperty(globalThis, 'Notification', {
    writable: true,
    configurable: true,
    value: class MockNotification {
      static permission: NotificationPermission = 'granted';
      static requestPermission(): Promise<NotificationPermission> {
        return Promise.resolve('granted');
      }
      constructor(public title: string) {
        notificationCalls.push({ title });
      }
      close() {}
    },
  });
});

afterEach(() => {
  delete (globalThis as Record<string, unknown>).Notification;
});

function makeSub(): Subscription {
  return { id: 's1', name: 'Test Gym', totalSessions: 12, startDate: '2026-01-15', visits: [] };
}

function Wrapper({ children }: { children: ReactNode }) {
  return createElement(SubscriptionProvider, null, children);
}

function renderWithWrapper(ui: ReactNode) {
  return render(createElement(Wrapper, null, ui));
}

describe('NotificationSettings', () => {
  beforeEach(async () => {
    await resetDb();
    await setMeta('notificationSettings', DEFAULT_NOTIFICATION_SETTINGS);
    await replaceAllSubscriptions([makeSub()]);
  });

  it('renders settings modal with all toggles', async () => {
    const onClose = () => {};

    renderWithWrapper(createElement(NotificationSettings, { onClose }));

    expect(screen.getByText('Настройки уведомлений')).toBeInTheDocument();
    expect(screen.getByText('Уведомления')).toBeInTheDocument();
    expect(screen.getByText('Порог дней (старость)')).toBeInTheDocument();
    expect(screen.getByText('Заброшен')).toBeInTheDocument();
    expect(screen.getByText('Закончен')).toBeInTheDocument();
    expect(screen.getByText('Скоро закончится')).toBeInTheDocument();
    expect(screen.getByText('Достижения')).toBeInTheDocument();
  });

  it('calls onClose when clicking save', async () => {
    const onClose = () => {};

    renderWithWrapper(createElement(NotificationSettings, { onClose }));

    const user = userEvent.setup();
    await user.click(screen.getByText('Сохранить'));
  });

  it('calls onClose when clicking cancel', async () => {
    const onClose = () => {};

    renderWithWrapper(createElement(NotificationSettings, { onClose }));

    const user = userEvent.setup();
    await user.click(screen.getByText('Отмена'));
  });

  it('changes stale threshold on input', async () => {
    const onClose = () => {};

    renderWithWrapper(createElement(NotificationSettings, { onClose }));

    const input = screen.getByLabelText('Порог дней для определения заброшенного абонемента') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '14' } });

    expect(input.value).toBe('14');
  });
});
