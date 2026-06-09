export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString();
}

export function formatDateTime(isoString: string): { date: string; time: string } {
  const d = new Date(isoString);
  return {
    date: d.toLocaleDateString(),
    time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}
