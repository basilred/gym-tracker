import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import InlineEdit from './InlineEdit';

function createMockHook(overrides = {}) {
  return {
    editing: false,
    editValue: 'test value',
    setEditValue: vi.fn(),
    textareaRef: { current: null },
    startEditing: vi.fn(),
    commitEdit: vi.fn(),
    cancelEdit: vi.fn(),
    handleKeyDown: vi.fn(),
    autoResize: vi.fn(),
    ...overrides,
  };
}

describe('InlineEdit', () => {
  it('renders value in view mode', () => {
    const hook = createMockHook();
    render(<InlineEdit hook={hook} value="Gym Name" />);

    expect(screen.getByText('Gym Name')).toBeInTheDocument();
  });

  it('renders as specified heading tag', () => {
    const hook = createMockHook();
    const { container } = render(<InlineEdit hook={hook} value="Name" as="h3" />);

    const heading = container.querySelector('h3');
    expect(heading).toBeInTheDocument();
  });

  it('renders as h2 by default', () => {
    const hook = createMockHook();
    const { container } = render(<InlineEdit hook={hook} value="Name" />);

    const heading = container.querySelector('h2');
    expect(heading).toBeInTheDocument();
  });

  it('shows textarea when editing is true', () => {
    const hook = createMockHook({ editing: true });
    render(<InlineEdit hook={hook} value="Gym Name" />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
  });

  it('calls startEditing on trigger click', async () => {
    const startEditing = vi.fn();
    const hook = createMockHook({ startEditing });
    const user = userEvent.setup();

    render(<InlineEdit hook={hook} value="Gym Name" />);

    await user.click(screen.getByText('Gym Name'));

    expect(startEditing).toHaveBeenCalledTimes(1);
  });

  it('prevents default on trigger click', () => {
    const hook = createMockHook();

    render(<InlineEdit hook={hook} value="Gym Name" />);

    const button = screen.getByRole('button');
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    const preventDefault = vi.spyOn(clickEvent, 'preventDefault');

    button.dispatchEvent(clickEvent);

    expect(preventDefault).toHaveBeenCalled();
  });

  it('calls setEditValue and autoResize on textarea change', async () => {
    const setEditValue = vi.fn();
    const autoResize = vi.fn();
    const hook = createMockHook({ editing: true, setEditValue, autoResize });
    const user = userEvent.setup();

    render(<InlineEdit hook={hook} value="Gym Name" />);

    const textbox = screen.getByRole('textbox');
    await user.type(textbox, 'a');

    expect(setEditValue).toHaveBeenCalled();
    expect(autoResize).toHaveBeenCalled();
  });

  it('passes handleKeyDown to textarea', async () => {
    const handleKeyDown = vi.fn();
    const hook = createMockHook({ editing: true, handleKeyDown });
    const user = userEvent.setup();

    render(<InlineEdit hook={hook} value="Gym Name" />);

    const textbox = screen.getByRole('textbox');
    await user.type(textbox, '{Enter}');

    expect(handleKeyDown).toHaveBeenCalled();
  });

  it('passes commitEdit to textarea onBlur', () => {
    const commitEdit = vi.fn();
    const hook = createMockHook({ editing: true, commitEdit });

    render(<InlineEdit hook={hook} value="Gym Name" />);

    const textbox = screen.getByRole('textbox');
    fireEvent.blur(textbox);

    expect(commitEdit).toHaveBeenCalled();
  });

  it('renders with BEM classes', () => {
    const hook = createMockHook();
    const { container } = render(<InlineEdit hook={hook} value="Gym Name" />);

    const heading = container.querySelector('h2');
    expect(heading?.className).toBe('InlineEdit-Title');

    const button = screen.getByRole('button');
    expect(button.className).toBe('InlineEdit-EditTrigger');
  });

  it('renders textarea with BEM class when editing', () => {
    const hook = createMockHook({ editing: true });
    const { container } = render(<InlineEdit hook={hook} value="Gym Name" />);

    const textarea = container.querySelector('textarea');
    expect(textarea?.className).toBe('InlineEdit-EditInput');
  });
});
