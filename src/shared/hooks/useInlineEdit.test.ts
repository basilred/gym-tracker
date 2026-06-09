import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useInlineEdit } from './useInlineEdit';

describe('useInlineEdit', () => {
  it('initially not editing with original value', () => {
    const { result } = renderHook(() => useInlineEdit('test', vi.fn()));

    expect(result.current.editing).toBe(false);
    expect(result.current.editValue).toBe('test');
  });

  it('startEditing enables edit mode and resets value', () => {
    const { result } = renderHook(() => useInlineEdit('original', vi.fn()));

    act(() => {
      result.current.setEditValue('changed');
    });
    act(() => {
      result.current.startEditing();
    });

    expect(result.current.editing).toBe(true);
    expect(result.current.editValue).toBe('original');
  });

  it('commitEdit saves if value changed', () => {
    const onSave = vi.fn();
    const { result } = renderHook(() => useInlineEdit('original', onSave));

    act(() => {
      result.current.startEditing();
    });
    act(() => {
      result.current.setEditValue('new value');
    });
    act(() => {
      result.current.commitEdit();
    });

    expect(result.current.editing).toBe(false);
    expect(onSave).toHaveBeenCalledWith('new value');
  });

  it('commitEdit does not call onSave if value unchanged', () => {
    const onSave = vi.fn();
    const { result } = renderHook(() => useInlineEdit('same', onSave));

    act(() => {
      result.current.startEditing();
    });
    act(() => {
      result.current.commitEdit();
    });

    expect(result.current.editing).toBe(false);
    expect(onSave).not.toHaveBeenCalled();
  });

  it('cancelEdit restores original value and exits edit mode', () => {
    const { result } = renderHook(() => useInlineEdit('original', vi.fn()));

    act(() => {
      result.current.startEditing();
    });
    act(() => {
      result.current.setEditValue('unsaved');
    });
    act(() => {
      result.current.cancelEdit();
    });

    expect(result.current.editing).toBe(false);
    expect(result.current.editValue).toBe('original');
  });

  it('handleKeyDown with Enter commits and saves', () => {
    const onSave = vi.fn();
    const { result } = renderHook(() => useInlineEdit('original', onSave));

    act(() => {
      result.current.startEditing();
    });
    act(() => {
      result.current.setEditValue('updated');
    });
    act(() => {
      result.current.handleKeyDown({
        key: 'Enter',
        shiftKey: false,
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent<HTMLTextAreaElement>);
    });

    expect(onSave).toHaveBeenCalledWith('updated');
    expect(result.current.editing).toBe(false);
  });

  it('handleKeyDown with Escape cancels edit', () => {
    const { result } = renderHook(() => useInlineEdit('original', vi.fn()));

    act(() => {
      result.current.startEditing();
    });
    act(() => {
      result.current.setEditValue('discarded');
    });
    act(() => {
      result.current.handleKeyDown({
        key: 'Escape',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent<HTMLTextAreaElement>);
    });

    expect(result.current.editing).toBe(false);
    expect(result.current.editValue).toBe('original');
  });

  it('handleKeyDown with Shift+Enter does not commit', () => {
    const onSave = vi.fn();
    const { result } = renderHook(() => useInlineEdit('original', onSave));

    act(() => {
      result.current.startEditing();
    });
    act(() => {
      result.current.handleKeyDown({
        key: 'Enter',
        shiftKey: true,
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent<HTMLTextAreaElement>);
    });

    expect(onSave).not.toHaveBeenCalled();
    expect(result.current.editing).toBe(true);
  });

  it('textareaRef exists after startEditing', () => {
    const { result } = renderHook(() => useInlineEdit('test', vi.fn()));

    act(() => {
      result.current.startEditing();
    });

    expect(result.current.textareaRef).toBeDefined();
  });
});
