import { useState, useEffect } from "react";

const STORAGE_KEY = "gym_subscriptions";

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
  }, [subscriptions]);

  const addSubscription = (name, totalSessions, startDate) => {
    const newSub = {
      id: crypto.randomUUID(),
      name: name || `Абонемент ${new Date().toLocaleDateString()}`,
      startDate,
      totalSessions,
      visits: [],
    };
    setSubscriptions((prev) => [...prev, newSub]);
  };

  const deleteSubscription = (id) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  };

  const addVisit = (id) => {
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

  const getSubscription = (id) => subscriptions.find((s) => s.id === id);

  return {
    subscriptions,
    addSubscription,
    deleteSubscription,
    addVisit,
    getSubscription,
  };
}
