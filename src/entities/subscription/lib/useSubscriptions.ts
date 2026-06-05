import { useState, useEffect } from 'react';
import type { Subscription } from '../types';

const STORAGE_KEY = 'gym_subscriptions';
const SCHEMA_VERSION = 1;

interface StoredData {
  _schemaVersion: number;
  data: Subscription[];
}

function isValidSubscriptionArray(data: unknown): data is Subscription[] {
  if (!Array.isArray(data)) return false;
  return data.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as Subscription).id === 'string' &&
      typeof (item as Subscription).name === 'string' &&
      typeof (item as Subscription).totalSessions === 'number' &&
      typeof (item as Subscription).startDate === 'string' &&
      Array.isArray((item as Subscription).visits)
  );
}

function loadFromStorage(): Subscription[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      '_schemaVersion' in parsed &&
      (parsed as StoredData)._schemaVersion === SCHEMA_VERSION &&
      'data' in parsed
    ) {
      const data = (parsed as StoredData).data;
      if (isValidSubscriptionArray(data)) {
        return data;
      }
    }

    if (isValidSubscriptionArray(parsed)) {
      return parsed;
    }

    console.warn('Невалидная структура данных в localStorage, сброс');
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function saveToStorage(subscriptions: Subscription[]): void {
  try {
    const payload: StoredData = {
      _schemaVersion: SCHEMA_VERSION,
      data: subscriptions,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    console.warn('Не удалось сохранить данные в localStorage');
  }
}

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(loadFromStorage);

  useEffect(() => {
    saveToStorage(subscriptions);
  }, [subscriptions]);

  const addSubscription = (name: string, totalSessions: number, startDate: string): void => {
    const newSub: Subscription = {
      id: crypto.randomUUID(),
      name: name || `Абонемент ${new Date().toLocaleDateString()}`,
      startDate,
      totalSessions,
      visits: [],
    };
    setSubscriptions((prev) => [...prev, newSub]);
  };

  const deleteSubscription = (id: string): void => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  };

  const addVisit = (id: string): void => {
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === id && s.visits.length < s.totalSessions
          ? {
              ...s,
              visits: [
                ...s.visits,
                { id: crypto.randomUUID(), date: new Date().toISOString() },
              ],
            }
          : s
      )
    );
  };

  const removeVisit = (subId: string, visitId: string): void => {
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === subId
          ? { ...s, visits: s.visits.filter((v) => v.id !== visitId) }
          : s
      )
    );
  };

  const editVisit = (subId: string, visitId: string, newDate: string): void => {
    setSubscriptions((prev) =>
      prev.map((s) => {
        if (s.id !== subId) return s;
        return {
          ...s,
          visits: s.visits.map((v) => {
            if (v.id !== visitId) return v;
            const originalDate = new Date(v.date);
            const [year, month, day] = newDate.split('-').map(Number);
            originalDate.setFullYear(year, month - 1, day);
            return { ...v, date: originalDate.toISOString() };
          }),
        };
      })
    );
  };

  const updateSubscription = (id: string, updates: Partial<Pick<Subscription, 'name'>>): void => {
    setSubscriptions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        let name = updates.name;
        if (!name) {
          name = `Абонемент ${new Date().toLocaleDateString()}`;
        }
        return { ...s, ...updates, name };
      })
    );
  };

  const getSubscription = (id: string): Subscription | undefined =>
    subscriptions.find((s) => s.id === id);

  return {
    subscriptions,
    addSubscription,
    deleteSubscription,
    updateSubscription,
    addVisit,
    removeVisit,
    editVisit,
    getSubscription,
  };
}
