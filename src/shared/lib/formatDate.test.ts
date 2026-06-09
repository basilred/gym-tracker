import { describe, it, expect } from 'vitest';
import { formatDate, formatDateTime } from './formatDate';

describe('formatDate', () => {
  it('formats an ISO date string', () => {
    const result = formatDate('2026-03-15T10:00:00.000Z');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });
});

describe('formatDateTime', () => {
  it('returns date and time parts', () => {
    const result = formatDateTime('2026-03-15T10:30:00.000Z');
    expect(result.date).toBeTruthy();
    expect(result.time).toBeTruthy();
    expect(typeof result.date).toBe('string');
    expect(typeof result.time).toBe('string');
  });
});
