import { renderHook, act, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useSubscriptions, SubscriptionProvider } from './useSubscriptions';

const STORAGE_KEY = 'gym_subscriptions';

function setLocalStorage(data: unknown) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function renderSubscriptionHook() {
  return renderHook(() => useSubscriptions(), {
    wrapper: ({ children }: { children: ReactNode }) =>
      createElement(SubscriptionProvider, null, children),
  });
}

describe('useSubscriptions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('initialization', () => {
    it('starts with empty array', () => {
      const { result } = renderSubscriptionHook();
      expect(result.current.subscriptions).toEqual([]);
    });

    it('loads subscriptions from IndexedDB after migration', async () => {
      const sub = {
        id: 'test-1',
        name: 'Test Sub',
        totalSessions: 8,
        startDate: '2026-01-01',
        visits: [{ id: 'v1', date: '2026-01-02T10:00:00.000Z' }],
      };
      setLocalStorage([sub]);

      const { result } = renderSubscriptionHook();

      await waitFor(() => {
        expect(result.current.subscriptions).toHaveLength(1);
      });
      expect(result.current.subscriptions[0].name).toBe('Test Sub');
    });
  });

  describe('CRUD operations', () => {
    it('adds a new subscription with generated id', () => {
      const { result } = renderSubscriptionHook();

      act(() => {
        result.current.addSubscription('Gym Pass', 12, '2026-06-01');
      });

      expect(result.current.subscriptions).toHaveLength(1);
      expect(result.current.subscriptions[0].name).toBe('Gym Pass');
      expect(result.current.subscriptions[0].totalSessions).toBe(12);
      expect(result.current.subscriptions[0].startDate).toBe('2026-06-01');
      expect(result.current.subscriptions[0].visits).toEqual([]);
      expect(result.current.subscriptions[0].id).toBeTruthy();
    });

    it('uses default name when name is empty', () => {
      const { result } = renderSubscriptionHook();

      act(() => {
        result.current.addSubscription('', 8, '2026-06-01');
      });

      expect(result.current.subscriptions[0].name).toBeTruthy();
      expect(result.current.subscriptions[0].totalSessions).toBe(8);
    });

    it('deletes a subscription by id', () => {
      const { result } = renderSubscriptionHook();

      act(() => {
        result.current.addSubscription('A', 8, '2026-01-01');
      });
      const id = result.current.subscriptions[0].id;

      act(() => {
        result.current.deleteSubscription(id);
      });

      expect(result.current.subscriptions).toHaveLength(0);
    });

    it('adds a visit to a subscription', () => {
      const { result } = renderSubscriptionHook();

      act(() => {
        result.current.addSubscription('Test', 8, '2026-01-01');
      });
      const id = result.current.subscriptions[0].id;

      act(() => {
        result.current.addVisit(id);
      });

      expect(result.current.subscriptions[0].visits).toHaveLength(1);
      expect(result.current.subscriptions[0].visits[0].id).toBeTruthy();
      expect(result.current.subscriptions[0].visits[0].date).toBeTruthy();
    });

    it('does not add visit when totalSessions reached', () => {
      const { result } = renderSubscriptionHook();

      act(() => {
        result.current.addSubscription('Test', 1, '2026-01-01');
      });
      const id = result.current.subscriptions[0].id;

      act(() => {
        result.current.addVisit(id);
      });
      expect(result.current.subscriptions[0].visits).toHaveLength(1);

      act(() => {
        result.current.addVisit(id);
      });
      expect(result.current.subscriptions[0].visits).toHaveLength(1);
    });

    it('removes a visit by id', () => {
      const { result } = renderSubscriptionHook();

      act(() => {
        result.current.addSubscription('Test', 8, '2026-01-01');
      });
      const subId = result.current.subscriptions[0].id;

      act(() => {
        result.current.addVisit(subId);
      });
      const visitId = result.current.subscriptions[0].visits[0].id;

      act(() => {
        result.current.removeVisit(subId, visitId);
      });

      expect(result.current.subscriptions[0].visits).toHaveLength(0);
    });

    it('edits visit date preserving time', () => {
      const { result } = renderSubscriptionHook();

      act(() => {
        result.current.addSubscription('Test', 8, '2026-01-01');
      });
      const subId = result.current.subscriptions[0].id;

      act(() => {
        result.current.addVisit(subId);
      });
      const visitId = result.current.subscriptions[0].visits[0].id;
      const visitDate = result.current.subscriptions[0].visits[0].date;
      const originalTime = new Date(visitDate).toISOString().substring(11, 19);

      act(() => {
        result.current.editVisit(subId, visitId, '2026-06-15');
      });

      const updatedDate = result.current.subscriptions[0].visits[0].date;
      const updated = new Date(updatedDate);
      expect(updated.getFullYear()).toBe(2026);
      expect(updated.getMonth()).toBe(5);
      expect(updated.getDate()).toBe(15);

      const newTime = new Date(updatedDate).toISOString().substring(11, 19);
      expect(newTime).toBe(originalTime);
    });

    it('editVisit does not affect other subscriptions', () => {
      const { result } = renderSubscriptionHook();

      act(() => {
        result.current.addSubscription('A', 8, '2026-01-01');
        result.current.addSubscription('B', 8, '2026-02-01');
      });
      const subAId = result.current.subscriptions[0].id;
      const subBId = result.current.subscriptions[1].id;

      act(() => {
        result.current.addVisit(subAId);
      });
      const visitId = result.current.subscriptions[0].visits[0].id;

      act(() => {
        result.current.editVisit(subBId, visitId, '2026-12-25');
      });

      const subADate = new Date(result.current.subscriptions[0].visits[0].date);
      expect(subADate.getMonth()).not.toBe(11);
    });

    it('editVisit preserves other visits unchanged', () => {
      const { result } = renderSubscriptionHook();

      act(() => {
        result.current.addSubscription('Test', 8, '2026-01-01');
      });
      const subId = result.current.subscriptions[0].id;

      act(() => {
        result.current.addVisit(subId);
        result.current.addVisit(subId);
      });

      const firstVisitId = result.current.subscriptions[0].visits[0].id;
      const originalSecondDate = result.current.subscriptions[0].visits[1].date;

      act(() => {
        result.current.editVisit(subId, firstVisitId, '2026-06-15');
      });

      const secondDateAfter = result.current.subscriptions[0].visits[1].date;
      expect(secondDateAfter).toBe(originalSecondDate);
    });

    it('getSubscription returns subscription by id', () => {
      const { result } = renderSubscriptionHook();

      act(() => {
        result.current.addSubscription('Test', 8, '2026-01-01');
      });
      const id = result.current.subscriptions[0].id;

      const sub = result.current.getSubscription(id);
      expect(sub?.name).toBe('Test');
    });

    it('getSubscription returns undefined for unknown id', () => {
      const { result } = renderSubscriptionHook();
      expect(result.current.getSubscription('nonexistent')).toBeUndefined();
    });
  });

  describe('updateSubscription', () => {
    it('updates subscription name', () => {
      const { result } = renderSubscriptionHook();

      act(() => {
        result.current.addSubscription('Old Name', 8, '2026-01-01');
      });
      const id = result.current.subscriptions[0].id;

      act(() => {
        result.current.updateSubscription(id, { name: 'New Name' });
      });

      expect(result.current.subscriptions[0].name).toBe('New Name');
    });

    it('preserves other fields on name update', () => {
      const { result } = renderSubscriptionHook();

      act(() => {
        result.current.addSubscription('Test', 8, '2026-01-01');
      });
      const id = result.current.subscriptions[0].id;
      const original = result.current.subscriptions[0];

      act(() => {
        result.current.updateSubscription(id, { name: 'Updated' });
      });

      const updated = result.current.subscriptions[0];
      expect(updated.name).toBe('Updated');
      expect(updated.totalSessions).toBe(original.totalSessions);
      expect(updated.startDate).toBe(original.startDate);
      expect(updated.visits).toEqual(original.visits);
    });

    it('does nothing when id does not exist', () => {
      const { result } = renderSubscriptionHook();

      act(() => {
        result.current.addSubscription('Test', 8, '2026-01-01');
      });

      act(() => {
        result.current.updateSubscription('nonexistent', { name: 'New' });
      });

      expect(result.current.subscriptions).toHaveLength(1);
      expect(result.current.subscriptions[0].name).toBe('Test');
    });

    it('restores default name when empty string is passed', () => {
      const { result } = renderSubscriptionHook();

      act(() => {
        result.current.addSubscription('Original', 8, '2026-01-01');
      });
      const id = result.current.subscriptions[0].id;

      act(() => {
        result.current.updateSubscription(id, { name: '' });
      });

      expect(result.current.subscriptions[0].name).toBeTruthy();
      expect(result.current.subscriptions[0].name).not.toBe('');
    });

    it('does not affect other subscriptions', () => {
      const { result } = renderSubscriptionHook();

      act(() => {
        result.current.addSubscription('A', 8, '2026-01-01');
        result.current.addSubscription('B', 8, '2026-02-01');
      });
      const idA = result.current.subscriptions[0].id;

      act(() => {
        result.current.updateSubscription(idA, { name: 'Updated A' });
      });

      expect(result.current.subscriptions[0].name).toBe('Updated A');
      expect(result.current.subscriptions[1].name).toBe('B');
    });
  });
});
