import type { Subscription } from '@/entities/subscription';
import type { NotificationReason, NotificationSettings } from '../model/types';

export function daysSince(date: string): number {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function checkNotifications(
  subscriptions: Subscription[],
  settings: NotificationSettings
): NotificationReason[] {
  if (!settings.enabled) return [];

  const reasons: NotificationReason[] = [];

  for (const sub of subscriptions) {
    const visitsCount = sub.visits.length;

    if (settings.types.stale && visitsCount < sub.totalSessions) {
      const lastDate = visitsCount > 0
        ? sub.visits[sub.visits.length - 1].date
        : sub.startDate;
      if (daysSince(lastDate) > settings.staleThresholdDays) {
        reasons.push({ subId: sub.id, type: 'stale' });
      }
    }

    if (settings.types.expired && visitsCount >= sub.totalSessions) {
      reasons.push({ subId: sub.id, type: 'expired' });
    }

    if (settings.types['almost-finished'] && visitsCount < sub.totalSessions) {
      const remaining = sub.totalSessions - visitsCount;
      if (remaining <= 2) {
        reasons.push({ subId: sub.id, type: 'almost-finished' });
      }
    }

    if (settings.types.milestone && visitsCount > 0) {
      if (visitsCount * 2 === sub.totalSessions) {
        reasons.push({ subId: sub.id, type: 'milestone', threshold: 50 });
      }
      if (visitsCount === sub.totalSessions) {
        reasons.push({ subId: sub.id, type: 'milestone', threshold: 100 });
      }
    }
  }

  return reasons;
}
