import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MarkVisitButton from './MarkVisitButton';

describe('MarkVisitButton', () => {
  it('renders the button and calls onAddVisit on click', () => {
    const onAddVisit = vi.fn();
    render(<MarkVisitButton subId="test-id" remaining={5} onAddVisit={onAddVisit} />);

    const btn = screen.getByText('Отметить занятие');
    expect(btn).not.toBeDisabled();

    btn.click();
    expect(onAddVisit).toHaveBeenCalledWith('test-id');
  });

  it('disables button when remaining is 0', () => {
    render(<MarkVisitButton subId="test-id" remaining={0} onAddVisit={vi.fn()} />);
    expect(screen.getByText('Отметить занятие')).toBeDisabled();
  });
});
