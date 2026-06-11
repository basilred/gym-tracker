import { describe, it, expect } from 'vitest';
import type { Subscription } from '@/entities/subscription';
import { calcSubscriptionStats } from './calcSubscriptionStats';

function makeSub(overrides: Partial<Subscription> = {}): Subscription {
  return {
    id: 'test-1',
    name: 'Фитнес',
    totalSessions: 12,
    startDate: '2026-06-01',
    visits: [],
    ...overrides,
  };
}

describe('calcSubscriptionStats', () => {
  describe('frequency', () => {
    it('returns 0 when there are no visits', () => {
      const sub = makeSub({ visits: [] });
      const stats = calcSubscriptionStats(sub, new Date('2026-06-11T00:00:00Z'));
      expect(stats.frequency).toBe(0);
    });

    it('calculates visits per week', () => {
      const sub = makeSub({
        startDate: '2026-05-28',
        visits: [
          { id: 'v1', date: '2026-06-01T10:00:00.000Z' },
          { id: 'v2', date: '2026-06-04T10:00:00.000Z' },
          { id: 'v3', date: '2026-06-08T10:00:00.000Z' },
          { id: 'v4', date: '2026-06-11T10:00:00.000Z' },
        ],
      });
      const stats = calcSubscriptionStats(sub, new Date('2026-06-11T00:00:00Z'));
      expect(stats.frequency).toBeCloseTo(2.0, 1);
    });
  });

  describe('daysSinceLastVisit', () => {
    it('returns null when there are no visits', () => {
      const sub = makeSub({ visits: [] });
      const stats = calcSubscriptionStats(sub, new Date('2026-06-11T00:00:00Z'));
      expect(stats.daysSinceLastVisit).toBeNull();
    });

    it('returns days since the most recent visit', () => {
      const sub = makeSub({
        visits: [
          { id: 'v1', date: '2026-06-09T10:00:00.000Z' },
          { id: 'v2', date: '2026-06-01T10:00:00.000Z' },
        ],
      });
      const stats = calcSubscriptionStats(sub, new Date('2026-06-11T12:00:00Z'));
      expect(stats.daysSinceLastVisit).toBe(2);
    });
  });

  describe('predictedEndDate', () => {
    it('returns null when there are fewer than 2 visits', () => {
      const sub = makeSub({
        visits: [{ id: 'v1', date: '2026-06-01T10:00:00.000Z' }],
      });
      const stats = calcSubscriptionStats(sub, new Date('2026-06-11T00:00:00Z'));
      expect(stats.predictedEndDate).toBeNull();
    });

    it('returns predicted end date when sufficient data', () => {
      const sub = makeSub({
        totalSessions: 12,
        visits: [
          { id: 'v1', date: '2026-06-01T10:00:00.000Z' },
          { id: 'v2', date: '2026-06-04T10:00:00.000Z' },
          { id: 'v3', date: '2026-06-08T10:00:00.000Z' },
          { id: 'v4', date: '2026-06-11T10:00:00.000Z' },
        ],
      });
      const stats = calcSubscriptionStats(sub, new Date('2026-06-11T12:00:00Z'));
      expect(stats.predictedEndDate).not.toBeNull();
      const predicted = new Date(stats.predictedEndDate!);
      expect(predicted.getTime()).toBeGreaterThan(new Date('2026-06-11').getTime());
    });
  });

  describe('longestGapDays', () => {
    it('returns null when fewer than 2 visits', () => {
      const sub = makeSub({
        visits: [{ id: 'v1', date: '2026-06-01T10:00:00.000Z' }],
      });
      const stats = calcSubscriptionStats(sub, new Date('2026-06-11T00:00:00Z'));
      expect(stats.longestGapDays).toBeNull();
    });

    it('returns the longest gap between consecutive visits', () => {
      const sub = makeSub({
        visits: [
          { id: 'v1', date: '2026-06-01T10:00:00.000Z' },
          { id: 'v2', date: '2026-06-05T10:00:00.000Z' },
          { id: 'v3', date: '2026-06-20T10:00:00.000Z' },
        ],
      });
      const stats = calcSubscriptionStats(sub, new Date('2026-06-25T00:00:00Z'));
      expect(stats.longestGapDays).toBe(15);
    });
  });
});
