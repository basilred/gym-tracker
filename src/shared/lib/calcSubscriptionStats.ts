import type { Subscription } from '@/entities/subscription';

export interface SubscriptionStats {
  frequency: number;
  daysSinceLastVisit: number | null;
  predictedEndDate: string | null;
  longestGapDays: number | null;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_WEEK = 7 * MS_PER_DAY;

export function calcSubscriptionStats(
  subscription: Subscription,
  now: Date = new Date(),
): SubscriptionStats {
  const nowMs = now.getTime();
  const startMs = new Date(subscription.startDate).getTime();
  const weeksSinceStart = Math.max((nowMs - startMs) / MS_PER_WEEK, 1 / 7);

  const visitCount = subscription.visits.length;
  const frequency = visitCount > 0 ? visitCount / weeksSinceStart : 0;

  const sortedVisits = [...subscription.visits].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  let daysSinceLastVisit: number | null = null;
  if (visitCount > 0) {
    const lastVisitMs = new Date(sortedVisits[sortedVisits.length - 1].date).getTime();
    daysSinceLastVisit = Math.floor((nowMs - lastVisitMs) / MS_PER_DAY);
  }

  let predictedEndDate: string | null = null;
  if (visitCount >= 2 && frequency > 0) {
    const remaining = subscription.totalSessions - visitCount;
    const daysUntilEnd = remaining / frequency * 7;
    const predictedDate = new Date(nowMs + daysUntilEnd * MS_PER_DAY);
    predictedEndDate = predictedDate.toISOString();
  }

  let longestGapDays: number | null = null;
  if (visitCount >= 2) {
    let maxGap = 0;
    for (let i = 1; i < sortedVisits.length; i++) {
      const gap = Math.round(
        (new Date(sortedVisits[i].date).getTime() - new Date(sortedVisits[i - 1].date).getTime()) / MS_PER_DAY,
      );
      if (gap > maxGap) maxGap = gap;
    }
    longestGapDays = maxGap;
  }

  return {
    frequency,
    daysSinceLastVisit,
    predictedEndDate,
    longestGapDays,
  };
}
