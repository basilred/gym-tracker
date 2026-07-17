import { describe, it, expect } from 'vitest';
import type { Subscription } from '@/entities/subscription';
import type { NotificationSettings, NotificationReason } from '../model/types';
import { checkNotifications } from './checkNotifications';

function makeSub(overrides: Partial<Subscription> & { id: string }): Subscription {
  return {
    name: 'Test Gym',
    totalSessions: 12,
    startDate: '2026-01-15',
    visits: [],
    ...overrides,
  };
}

const defaultSettings: NotificationSettings = {
  enabled: true,
  staleThresholdDays: 7,
  types: {
    stale: true,
    expired: true,
    'almost-finished': true,
    milestone: true,
  },
};

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

describe('checkNotifications', () => {
  it('returns empty for empty subscriptions', () => {
    expect(checkNotifications([], defaultSettings)).toEqual([]);
  });

  it('returns empty when notifications are disabled', () => {
    const sub = makeSub({ id: 's1' });
    expect(checkNotifications([sub], { ...defaultSettings, enabled: false })).toEqual([]);
  });

  describe('stale', () => {
    it('detects stale subscription with visits beyond threshold', () => {
      const sub = makeSub({
        id: 's1',
        visits: [
          { id: 'v1', date: daysAgo(10) },
        ],
      });
      const reasons = checkNotifications([sub], defaultSettings);
      expect(reasons).toHaveLength(1);
      expect(reasons[0]).toMatchObject({ subId: 's1', type: 'stale' });
    });

    it('does not detect stale with recent visit', () => {
      const sub = makeSub({
        id: 's1',
        visits: [{ id: 'v1', date: daysAgo(3) }],
      });
      expect(checkNotifications([sub], defaultSettings)).toEqual([]);
    });

    it('detects stale with no visits and startDate beyond threshold', () => {
      const sub = makeSub({ id: 's1', startDate: daysAgo(14), visits: [] });
      const reasons = checkNotifications([sub], defaultSettings);
      expect(reasons).toHaveLength(1);
      expect(reasons[0]).toMatchObject({ subId: 's1', type: 'stale' });
    });

    it('does not detect stale when visits equal totalSessions', () => {
      const sub = makeSub({
        id: 's1',
        totalSessions: 12,
        visits: Array.from({ length: 12 }, (_, i) => ({
          id: `v${i}`,
          date: daysAgo(10),
        })),
      });
      const reasons = checkNotifications([sub], defaultSettings);
      expect(reasons.find((r) => r.type === 'stale')).toBeUndefined();
      expect(reasons.find((r) => r.type === 'expired')).toBeDefined();
    });

    it('respects stale type toggle off', () => {
      const sub = makeSub({
        id: 's1',
        visits: [{ id: 'v1', date: daysAgo(10) }],
      });
      const reasons = checkNotifications([sub], {
        ...defaultSettings,
        types: { ...defaultSettings.types, stale: false },
      });
      expect(reasons.find((r) => r.type === 'stale')).toBeUndefined();
    });
  });

  describe('expired', () => {
    it('detects expired subscription', () => {
      const sub = makeSub({
        id: 's1',
        totalSessions: 12,
        visits: Array.from({ length: 12 }, (_, i) => ({
          id: `v${i}`,
          date: daysAgo(1),
        })),
      });
      const reasons = checkNotifications([sub], defaultSettings);
      expect(reasons).toContainEqual({ subId: 's1', type: 'expired' });
    });

    it('does not detect when sessions remain', () => {
      const sub = makeSub({
        id: 's1',
        visits: Array.from({ length: 8 }, (_, i) => ({
          id: `v${i}`,
          date: daysAgo(1),
        })),
      });
      expect(checkNotifications([sub], defaultSettings)).toEqual([]);
    });
  });

  describe('almost-finished', () => {
    it('detects with 2 remaining sessions', () => {
      const sub = makeSub({
        id: 's1',
        totalSessions: 12,
        visits: Array.from({ length: 10 }, (_, i) => ({
          id: `v${i}`,
          date: daysAgo(1),
        })),
      });
      const reasons = checkNotifications([sub], defaultSettings);
      expect(reasons).toContainEqual({ subId: 's1', type: 'almost-finished' });
    });

    it('detects with 1 remaining session', () => {
      const sub = makeSub({
        id: 's1',
        totalSessions: 12,
        visits: Array.from({ length: 11 }, (_, i) => ({
          id: `v${i}`,
          date: daysAgo(1),
        })),
      });
      const reasons = checkNotifications([sub], defaultSettings);
      expect(reasons).toContainEqual({ subId: 's1', type: 'almost-finished' });
    });

    it('does not detect when plenty sessions remain', () => {
      const sub = makeSub({
        id: 's1',
        totalSessions: 12,
        visits: Array.from({ length: 4 }, (_, i) => ({
          id: `v${i}`,
          date: daysAgo(1),
        })),
      });
      expect(checkNotifications([sub], defaultSettings)).toEqual([]);
    });

    it('does not detect when subscription is expired', () => {
      const sub = makeSub({
        id: 's1',
        totalSessions: 12,
        visits: Array.from({ length: 12 }, (_, i) => ({
          id: `v${i}`,
          date: daysAgo(1),
        })),
      });
      const reasons = checkNotifications([sub], defaultSettings);
      expect(reasons).toContainEqual({ subId: 's1', type: 'expired' });
      expect(reasons.find((r) => r.type === 'almost-finished')).toBeUndefined();
    });
  });

  describe('milestone', () => {
    it('detects 50% milestone at exactly half', () => {
      const sub = makeSub({
        id: 's1',
        totalSessions: 12,
        visits: Array.from({ length: 6 }, (_, i) => ({
          id: `v${i}`,
          date: daysAgo(1),
        })),
      });
      const reasons = checkNotifications([sub], defaultSettings);
      expect(reasons).toContainEqual({ subId: 's1', type: 'milestone', threshold: 50 });
    });

    it('detects 100% milestone', () => {
      const sub = makeSub({
        id: 's1',
        totalSessions: 12,
        visits: Array.from({ length: 12 }, (_, i) => ({
          id: `v${i}`,
          date: daysAgo(1),
        })),
      });
      const reasons = checkNotifications([sub], defaultSettings);
      expect(reasons).toContainEqual({ subId: 's1', type: 'milestone', threshold: 100 });
    });

    it('does not trigger 50% milestone for odd total sessions', () => {
      const sub = makeSub({
        id: 's1',
        totalSessions: 13,
        visits: Array.from({ length: 6 }, (_, i) => ({
          id: `v${i}`,
          date: daysAgo(1),
        })),
      });
      const reasons = checkNotifications([sub], defaultSettings);
      expect(reasons.find((r) => r.type === 'milestone')).toBeUndefined();
    });

    it('does not trigger milestone on subsequent visits after 50%', () => {
      const sub = makeSub({
        id: 's1',
        totalSessions: 12,
        visits: Array.from({ length: 7 }, (_, i) => ({
          id: `v${i}`,
          date: daysAgo(1),
        })),
      });
      const reasons = checkNotifications([sub], defaultSettings);
      expect(reasons.find((r) => r.type === 'milestone' && r.threshold === 50)).toBeUndefined();
    });
  });

  describe('multi-reason', () => {
    it('returns stale and milestone for active sub with many visits', () => {
      const sub = makeSub({
        id: 's1',
        totalSessions: 12,
        startDate: daysAgo(20),
        visits: Array.from({ length: 10 }, (_, i) => ({
          id: `v${i}`,
          date: daysAgo(10),
        })),
      });
      const reasons = checkNotifications([sub], defaultSettings);
      expect(reasons).toContainEqual({ subId: 's1', type: 'stale' });
      expect(reasons).toContainEqual({ subId: 's1', type: 'almost-finished' });
    });

    it('returns expired and milestone for full sub', () => {
      const sub = makeSub({
        id: 's1',
        totalSessions: 12,
        startDate: daysAgo(20),
        visits: Array.from({ length: 12 }, (_, i) => ({
          id: `v${i}`,
          date: daysAgo(1),
        })),
      });
      const reasons = checkNotifications([sub], defaultSettings);
      expect(reasons).toContainEqual({ subId: 's1', type: 'expired' });
      expect(reasons).toContainEqual({ subId: 's1', type: 'milestone', threshold: 100 });
    });
  });
});
