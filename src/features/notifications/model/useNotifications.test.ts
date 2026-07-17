import { renderHook, act } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SubscriptionProvider, useSubscriptions } from '@/entities/subscription';
import type { Subscription } from '@/entities/subscription';
import { replaceAllSubscriptions, setMeta, resetDb } from '@/shared/lib/storage';
import { DEFAULT_NOTIFICATION_SETTINGS } from './types';
import { useNotifications } from './useNotifications';

let requestPermissionResult: NotificationPermission = 'granted';
let notificationCalls: Array<{ title: string; options: NotificationOptions }> = [];

beforeEach(() => {
  requestPermissionResult = 'granted';
  notificationCalls = [];

  Object.defineProperty(globalThis, 'Notification', {
    writable: true,
    configurable: true,
    value: class MockNotification {
      static permission: NotificationPermission = 'default';
      static requestPermission(): Promise<NotificationPermission> {
        (Notification as { permission: NotificationPermission }).permission = requestPermissionResult;
        return Promise.resolve(requestPermissionResult);
      }
      constructor(public title: string, public options: NotificationOptions) {
        notificationCalls.push({ title, options });
      }
      close() {}
    },
  });
});

afterEach(() => {
  delete (globalThis as Record<string, unknown>).Notification;
});

function makeSub(overrides?: Partial<Subscription>): Subscription {
  return {
    id: 's1',
    name: 'Test Gym',
    totalSessions: 12,
    startDate: '2026-01-15',
    visits: [],
    ...overrides,
  };
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function Wrapper({ children }: { children: ReactNode }) {
  return createElement(SubscriptionProvider, null, children);
}

function seedSubscriptions(subs: Subscription[]) {
  return replaceAllSubscriptions(subs);
}

describe('useNotifications', () => {
  beforeEach(async () => {
    await resetDb();
    await setMeta('notificationSettings', DEFAULT_NOTIFICATION_SETTINGS);
  });

  it('loads default settings when nothing is saved', async () => {
    const sub = makeSub();
    await seedSubscriptions([sub]);

    const { result } = renderHook(
      () => ({ subs: useSubscriptions(), notif: useNotifications() }),
      { wrapper: Wrapper }
    );

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(result.current.notif.settings).toEqual(DEFAULT_NOTIFICATION_SETTINGS);
  });

  it('shows notification for stale subscription', async () => {
    const sub = makeSub({
      visits: [{ id: 'v1', date: daysAgo(10) }],
    });
    await seedSubscriptions([sub]);

    renderHook(
      () => ({ subs: useSubscriptions(), notif: useNotifications() }),
      { wrapper: Wrapper }
    );

    await act(async () => {
      await new Promise((r) => setTimeout(r, 100));
    });

    expect(notificationCalls.length).toBeGreaterThanOrEqual(1);
    expect(notificationCalls[0].title).toContain('Test Gym');
    expect(notificationCalls[0].title).toBe('Давно не были в "Test Gym"!');
  });

  it('shows notification for expired subscription', async () => {
    const sub = makeSub({
      totalSessions: 12,
      visits: Array.from({ length: 12 }, (_, i) => ({
        id: `v${i}`,
        date: daysAgo(1),
      })),
    });
    await seedSubscriptions([sub]);

    renderHook(
      () => ({ subs: useSubscriptions(), notif: useNotifications() }),
      { wrapper: Wrapper }
    );

    await act(async () => {
      await new Promise((r) => setTimeout(r, 100));
    });

    expect(notificationCalls.length).toBeGreaterThanOrEqual(1);
    expect(notificationCalls[0].title).toContain('закончен');
  });

  it('shows notification for almost-finished subscription', async () => {
    const sub = makeSub({
      totalSessions: 12,
      visits: Array.from({ length: 10 }, (_, i) => ({
        id: `v${i}`,
        date: daysAgo(1),
      })),
    });
    await seedSubscriptions([sub]);

    renderHook(
      () => ({ subs: useSubscriptions(), notif: useNotifications() }),
      { wrapper: Wrapper }
    );

    await act(async () => {
      await new Promise((r) => setTimeout(r, 100));
    });

    expect(notificationCalls.length).toBeGreaterThanOrEqual(1);
    expect(notificationCalls[0].title).toContain('скоро закончится');
  });

  it('shows notification for milestone', async () => {
    const sub = makeSub({
      totalSessions: 12,
      visits: Array.from({ length: 6 }, (_, i) => ({
        id: `v${i}`,
        date: daysAgo(1),
      })),
    });
    await seedSubscriptions([sub]);

    renderHook(
      () => ({ subs: useSubscriptions(), notif: useNotifications() }),
      { wrapper: Wrapper }
    );

    await act(async () => {
      await new Promise((r) => setTimeout(r, 100));
    });

    expect(notificationCalls.length).toBeGreaterThanOrEqual(1);
    expect(notificationCalls[0].title).toContain('50%');
  });

  it('does not show notification when permission is denied', async () => {
    requestPermissionResult = 'denied';

    const sub = makeSub({
      visits: [{ id: 'v1', date: daysAgo(10) }],
    });
    await seedSubscriptions([sub]);

    renderHook(
      () => ({ subs: useSubscriptions(), notif: useNotifications() }),
      { wrapper: Wrapper }
    );

    await act(async () => {
      await new Promise((r) => setTimeout(r, 100));
    });

    expect(notificationCalls).toHaveLength(0);
  });

  it('does not show duplicate notification within cooldown', async () => {
    await setMeta('shownNotifications', [
      { subId: 's1', type: 'stale', shownAt: new Date().toISOString() },
    ]);

    const sub = makeSub({
      visits: [{ id: 'v1', date: daysAgo(10) }],
    });
    await seedSubscriptions([sub]);

    renderHook(
      () => ({ subs: useSubscriptions(), notif: useNotifications() }),
      { wrapper: Wrapper }
    );

    await act(async () => {
      await new Promise((r) => setTimeout(r, 100));
    });

    expect(notificationCalls).toHaveLength(0);
  });

  it('updateSettings persists to IDB', async () => {
    await seedSubscriptions([makeSub()]);

    const { result } = renderHook(
      () => ({ subs: useSubscriptions(), notif: useNotifications() }),
      { wrapper: Wrapper }
    );

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    const newSettings = { ...DEFAULT_NOTIFICATION_SETTINGS, staleThresholdDays: 14 };
    await act(async () => {
      await result.current.notif.updateSettings(newSettings);
    });

    expect(result.current.notif.settings.staleThresholdDays).toBe(14);
  });
});
