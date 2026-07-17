import { useState, useEffect, useCallback, useRef } from 'react';
import { useSubscriptions } from '@/entities/subscription';
import { getMeta, setMeta } from '@/shared/lib/storage';
import { checkNotifications } from '../lib/checkNotifications';
import {
  type NotificationSettings,
  type NotificationReason,
  type ShownNotification,
  DEFAULT_NOTIFICATION_SETTINGS,
  hasBeenShownRecently,
} from './types';

const META_SETTINGS_KEY = 'notificationSettings';
const META_SHOWN_KEY = 'shownNotifications';

function getNotificationPermission(): NotificationPermission | null {
  if (typeof Notification === 'undefined') return null;
  return Notification.permission;
}

export function useNotifications() {
  const { subscriptions, loaded } = useSubscriptions();
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | null>(getNotificationPermission);
  const shownCacheRef = useRef<ShownNotification[]>([]);

  useEffect(() => {
    getMeta<NotificationSettings>(META_SETTINGS_KEY).then((saved) => {
      if (saved) setSettings(saved);
      setSettingsLoaded(true);
    });
  }, []);

  useEffect(() => {
    getMeta<ShownNotification[]>(META_SHOWN_KEY).then((saved) => {
      shownCacheRef.current = saved ?? [];
    });
  }, []);

  const persistShown = useCallback(async (notifications: ShownNotification[]) => {
    shownCacheRef.current = notifications;
    await setMeta(META_SHOWN_KEY, notifications);
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof Notification === 'undefined') return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  }, []);

  const showOneNotification = useCallback((name: string, reason: NotificationReason) => {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission !== 'granted') return;

    const titles: Record<string, (n: string) => string> = {
      stale: (n) => `Давно не были в "${n}"!`,
      expired: (n) => `Абонемент "${n}" закончен!`,
      'almost-finished': (n) => `"${n}" скоро закончится`,
      milestone: (n) => `"${n}": пройдено ${reason.threshold}%!`,
    };

    const bodies: Record<string, (sub: typeof subscriptions[0]) => string> = {
      stale: (sub) => {
        const days = sub.visits.length > 0
          ? Math.floor((Date.now() - new Date(sub.visits[sub.visits.length - 1].date).getTime()) / (1000 * 60 * 60 * 24))
          : Math.floor((Date.now() - new Date(sub.startDate).getTime()) / (1000 * 60 * 60 * 24));
        return `Прошло ${days} дней с последнего посещения`;
      },
      expired: (sub) => `Все ${sub.totalSessions} занятий использовано`,
      'almost-finished': (sub) => `Осталось ${sub.totalSessions - sub.visits.length} занятий`,
      milestone: () => 'Отличный результат!',
    };

    const sub = subscriptions.find((s) => s.id === reason.subId);
    if (!sub) return;

    new Notification(titles[reason.type]?.(sub.name) ?? 'Gym Tracker', {
      body: bodies[reason.type]?.(sub) ?? '',
      icon: '/icon-192.png',
    });
  }, [subscriptions]);

  const showNotifications = useCallback(async (reasons: NotificationReason[]) => {
    const granted = await requestPermission();
    if (!granted) return;

    const newShown: ShownNotification[] = [];
    for (const reason of reasons) {
      const sub = subscriptions.find((s) => s.id === reason.subId);
      showOneNotification(sub?.name ?? '', reason);
      newShown.push({
        subId: reason.subId,
        type: reason.type,
        threshold: reason.threshold,
        shownAt: new Date().toISOString(),
      });
    }

    await persistShown([...shownCacheRef.current, ...newShown]);
  }, [requestPermission, showOneNotification, persistShown, subscriptions]);

  useEffect(() => {
    if (!settingsLoaded || !loaded || !settings.enabled) return;

    const reasons = checkNotifications(subscriptions, settings);
    if (reasons.length === 0) return;

    const filtered = hasBeenShownRecently(reasons, shownCacheRef.current);
    if (filtered.length === 0) return;

    showNotifications(filtered);
  }, [subscriptions, loaded, settingsLoaded, settings, showNotifications]);

  const updateSettings = useCallback(async (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    await setMeta(META_SETTINGS_KEY, newSettings);
  }, []);

  return {
    settings,
    updateSettings,
    permission,
    requestPermission,
  };
}
