import { describe, it, expect } from 'vitest';
import { pluralize } from './pluralize';

describe('pluralize', () => {
  it('returns singular form for 1', () => {
    expect(pluralize(1, 'занятие', 'занятия', 'занятий')).toBe('1 занятие');
  });

  it('returns genitive singular for 2-4', () => {
    expect(pluralize(2, 'занятие', 'занятия', 'занятий')).toBe('2 занятия');
    expect(pluralize(3, 'занятие', 'занятия', 'занятий')).toBe('3 занятия');
    expect(pluralize(4, 'занятие', 'занятия', 'занятий')).toBe('4 занятия');
  });

  it('returns genitive plural for 5-20', () => {
    expect(pluralize(5, 'занятие', 'занятия', 'занятий')).toBe('5 занятий');
    expect(pluralize(8, 'занятие', 'занятия', 'занятий')).toBe('8 занятий');
    expect(pluralize(20, 'занятие', 'занятия', 'занятий')).toBe('20 занятий');
  });

  it('handles special case 11-19', () => {
    expect(pluralize(11, 'занятие', 'занятия', 'занятий')).toBe('11 занятий');
    expect(pluralize(12, 'занятие', 'занятия', 'занятий')).toBe('12 занятий');
    expect(pluralize(13, 'занятие', 'занятия', 'занятий')).toBe('13 занятий');
    expect(pluralize(14, 'занятие', 'занятия', 'занятий')).toBe('14 занятий');
  });

  it('handles zero', () => {
    expect(pluralize(0, 'занятие', 'занятия', 'занятий')).toBe('0 занятий');
  });
});
