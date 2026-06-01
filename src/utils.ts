export function calcProgress(visitsCount: number, totalSessions: number): number {
  const safeTotal = Math.max(totalSessions, 1);
  return (visitsCount / safeTotal) * 100;
}
