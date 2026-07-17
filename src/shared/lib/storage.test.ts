import { openDB } from 'idb';
import { describe, it, expect, beforeEach } from 'vitest';
import type { Subscription } from '@/entities/subscription';
import {
  getSubscriptions,
  saveSubscription,
  deleteSubscription,
  migrateFromLocalStorage,
} from './storage';

function makeSub(overrides?: Partial<Subscription>): Subscription {
  return {
    id: 'test-1',
    name: 'Test Sub',
    totalSessions: 12,
    startDate: '2026-01-01',
    visits: [],
    ...overrides,
  };
}

describe('storage', () => {
  beforeEach(async () => {
    localStorage.clear();
    const subs = await getSubscriptions();
    for (const sub of subs) {
      await deleteSubscription(sub.id);
    }
  });

  describe('CRUD', () => {
    it('returns empty array when no data', async () => {
      const result = await getSubscriptions();
      expect(result).toEqual([]);
    });

    it('saves and retrieves a subscription', async () => {
      const sub = makeSub();
      await saveSubscription(sub);

      const result = await getSubscriptions();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('test-1');
      expect(result[0].name).toBe('Test Sub');
    });

    it('updates an existing subscription', async () => {
      const sub = makeSub();
      await saveSubscription(sub);

      const updated = { ...sub, name: 'Updated' };
      await saveSubscription(updated);

      const result = await getSubscriptions();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Updated');
    });

    it('deletes a subscription', async () => {
      const sub = makeSub();
      await saveSubscription(sub);
      await deleteSubscription(sub.id);

      const result = await getSubscriptions();
      expect(result).toEqual([]);
    });

    it('saves multiple subscriptions', async () => {
      const sub1 = makeSub({ id: 'a', name: 'A' });
      const sub2 = makeSub({ id: 'b', name: 'B' });

      await saveSubscription(sub1);
      await saveSubscription(sub2);

      const result = await getSubscriptions();
      expect(result).toHaveLength(2);
    });
  });

  describe('migration', () => {
    beforeEach(async () => {
      const subs = await getSubscriptions();
      for (const sub of subs) {
        await deleteSubscription(sub.id);
      }
      const db = await openDB('gym-tracker', 2);
      await db.delete('meta', 'migrated');
    });

    it('migrates data from localStorage to IndexedDB', async () => {
      const data = [makeSub()];
      localStorage.setItem('gym_subscriptions', JSON.stringify(data));

      const migrated = await migrateFromLocalStorage();
      expect(migrated).toBe(true);

      const subs = await getSubscriptions();
      expect(subs).toHaveLength(1);
      expect(subs[0].name).toBe('Test Sub');
      expect(localStorage.getItem('gym_subscriptions')).toBeNull();
    });

    it('skips migration if already done', async () => {
      localStorage.setItem('gym_subscriptions', JSON.stringify([makeSub()]));
      await migrateFromLocalStorage();
      const result = await migrateFromLocalStorage();
      expect(result).toBe(false);
    });

    it('handles empty localStorage', async () => {
      const result = await migrateFromLocalStorage();
      expect(result).toBe(false);
    });

    it('handles invalid JSON in localStorage', async () => {
      localStorage.setItem('gym_subscriptions', 'invalid');
      const result = await migrateFromLocalStorage();
      expect(result).toBe(false);
    });

    it('migrates schema-versioned data format', async () => {
      const data = {
        _schemaVersion: 1,
        data: [makeSub()],
      };
      localStorage.setItem('gym_subscriptions', JSON.stringify(data));

      const migrated = await migrateFromLocalStorage();
      expect(migrated).toBe(true);

      const subs = await getSubscriptions();
      expect(subs).toHaveLength(1);
      expect(subs[0].name).toBe('Test Sub');
    });
  });
});
