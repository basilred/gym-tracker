export function pluralize(
  count: number,
  singular: string,
  genitiveSingular: string,
  genitivePlural: string
): string {
  const abs = Math.abs(count);
  const lastDigit = abs % 10;
  const lastTwoDigits = abs % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return `${count} ${genitivePlural}`;
  }
  if (lastDigit === 1) {
    return `${count} ${singular}`;
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} ${genitiveSingular}`;
  }
  return `${count} ${genitivePlural}`;
}
