export type NotificationType = 'stale' | 'expired' | 'almost-finished' | 'milestone';

export interface NotificationReason {
  subId: string;
  type: NotificationType;
  threshold?: number;
}

export interface NotificationSettings {
  enabled: boolean;
  staleThresholdDays: number;
  types: {
    stale: boolean;
    expired: boolean;
    'almost-finished': boolean;
    milestone: boolean;
  };
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  staleThresholdDays: 7,
  types: {
    stale: true,
    expired: true,
    'almost-finished': true,
    milestone: true,
  },
};

export interface ShownNotification {
  subId: string;
  type: NotificationType;
  threshold?: number;
  shownAt: string;
}

const COOLDOWN_HOURS = 6;

export function isWithinCooldown(
  shownAt: string,
  cooldownHours: number = COOLDOWN_HOURS
): boolean {
  const elapsed = Date.now() - new Date(shownAt).getTime();
  return elapsed < cooldownHours * 60 * 60 * 1000;
}

export function hasBeenShownRecently(
  reasons: NotificationReason[],
  shown: ShownNotification[],
  cooldownHours?: number
): NotificationReason[] {
  return reasons.filter((reason) => {
    const match = shown.find(
      (s) =>
        s.subId === reason.subId &&
        s.type === reason.type &&
        s.threshold === reason.threshold
    );
    return !match || !isWithinCooldown(match.shownAt, cooldownHours);
  });
}
