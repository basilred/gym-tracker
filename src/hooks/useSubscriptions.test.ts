import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSubscriptions } from './useSubscriptions';

const STORAGE_KEY = 'gym_subscriptions';

function setStorage(data: unknown) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getStorageData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [] as Record<string, unknown>[];
  const parsed = JSON.parse(raw);
  if (parsed && typeof parsed === 'object' && 'data' in parsed) {
    return (parsed as { data: Record<string, unknown>[] }).data;
  }
  return [] as Record<string, unknown>[];
}

describe('useSubscriptions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('initialization', () => {
    it('returns empty array when localStorage is empty', () => {
      const { result } = renderHook(() => useSubscriptions());
      expect(result.current.subscriptions).toEqual([]);
    });

    it('loads valid subscriptions from localStorage', () => {
      const sub = {
        id: 'test-1',
        name: 'Test Sub',
        totalSessions: 8,
        startDate: '2026-01-01',
        visits: [{ id: 'v1', date: '2026-01-02T10:00:00.000Z' }],
      };
      setStorage([sub]);

      const { result } = renderHook(() => useSubscriptions());
      expect(result.current.subscriptions).toHaveLength(1);
      expect(result.current.subscriptions[0].name).toBe('Test Sub');
    });

    it('returns empty array when JSON is invalid', () => {
      localStorage.setItem(STORAGE_KEY, 'not-valid-json{{{');

      const { result } = renderHook(() => useSubscriptions());
      expect(result.current.subscriptions).toEqual([]);
    });
  });

  describe('CRUD operations', () => {
    it('adds a new subscription with generated id', () => {
      const { result } = renderHook(() => useSubscriptions());

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
      const { result } = renderHook(() => useSubscriptions());

      act(() => {
        result.current.addSubscription('', 8, '2026-06-01');
      });

      expect(result.current.subscriptions[0].name).toBeTruthy();
      expect(result.current.subscriptions[0].totalSessions).toBe(8);
    });

    it('deletes a subscription by id', () => {
      const { result } = renderHook(() => useSubscriptions());

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
      const { result } = renderHook(() => useSubscriptions());

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
      const { result } = renderHook(() => useSubscriptions());

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
      const { result } = renderHook(() => useSubscriptions());

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
      const { result } = renderHook(() => useSubscriptions());

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
      expect(updated.getMonth()).toBe(5); // June is 5 (0-indexed)
      expect(updated.getDate()).toBe(15);

      const newTime = new Date(updatedDate).toISOString().substring(11, 19);
      expect(newTime).toBe(originalTime);
    });

    it('editVisit does not affect other subscriptions', () => {
      const { result } = renderHook(() => useSubscriptions());

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
      const { result } = renderHook(() => useSubscriptions());

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
      const { result } = renderHook(() => useSubscriptions());

      act(() => {
        result.current.addSubscription('Test', 8, '2026-01-01');
      });
      const id = result.current.subscriptions[0].id;

      const sub = result.current.getSubscription(id);
      expect(sub?.name).toBe('Test');
    });

    it('getSubscription returns undefined for unknown id', () => {
      const { result } = renderHook(() => useSubscriptions());
      expect(result.current.getSubscription('nonexistent')).toBeUndefined();
    });
  });

  describe('localStorage persistence', () => {
    it('persists subscriptions to localStorage on changes', () => {
      const { result } = renderHook(() => useSubscriptions());

      act(() => {
        result.current.addSubscription('Test', 8, '2026-01-01');
      });

      const stored = getStorageData();
      expect(stored).toHaveLength(1);
      expect(stored[0].name).toBe('Test');
    });

    it('removes deleted subscription from localStorage', () => {
      const { result } = renderHook(() => useSubscriptions());

      act(() => {
        result.current.addSubscription('Test', 8, '2026-01-01');
      });
      const id = result.current.subscriptions[0].id;

      act(() => {
        result.current.deleteSubscription(id);
      });

      const stored = getStorageData();
      expect(stored).toHaveLength(0);
    });
  });

  describe('storage error handling', () => {
    it('handles quota exceeded gracefully', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });

      const { result } = renderHook(() => useSubscriptions());

      act(() => {
        result.current.addSubscription('Test', 8, '2026-01-01');
      });

      expect(warnSpy).toHaveBeenCalledWith('Не удалось сохранить данные в localStorage');
      Storage.prototype.setItem = originalSetItem;
      warnSpy.mockRestore();
    });
  });
});
