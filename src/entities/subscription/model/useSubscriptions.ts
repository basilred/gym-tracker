import { useState, useEffect, createContext, useContext, createElement, type ReactNode } from 'react';
import { getSubscriptions, replaceAllSubscriptions, migrateFromLocalStorage } from '@/shared/lib/storage';
import type { Subscription } from './types';

function useSubscriptionsInternal() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    migrateFromLocalStorage()
      .then(() => getSubscriptions())
      .then((data) => {
        setSubscriptions(data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    replaceAllSubscriptions(subscriptions).catch(() => {});
  }, [subscriptions, loaded]);

  const addSubscription = (name: string, totalSessions: number, startDate: string): void => {
    const newSub: Subscription = {
      id: crypto.randomUUID(),
      name: name || `Абонемент ${new Date().toLocaleDateString()}`,
      startDate,
      totalSessions,
      visits: [],
    };
    setSubscriptions((prev) => [...prev, newSub]);
    setAnnouncement('Абонемент создан');
  };

  const handleDelete = (id: string): void => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    setAnnouncement('Абонемент удалён');
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
    setAnnouncement('Посещение отмечено');
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
    loaded,
    announcement,
    addSubscription,
    deleteSubscription: handleDelete,
    updateSubscription,
    addVisit,
    removeVisit,
    editVisit,
    getSubscription,
  };
}

type SubscriptionContextType = ReturnType<typeof useSubscriptionsInternal>;

const SubscriptionCtx = createContext<SubscriptionContextType | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const value = useSubscriptionsInternal();
  return createElement(SubscriptionCtx.Provider, { value }, children);
}

export function useSubscriptions(): SubscriptionContextType {
  const ctx = useContext(SubscriptionCtx);
  if (!ctx) throw new Error('useSubscriptions must be used within SubscriptionProvider');
  return ctx;
}
