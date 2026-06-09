import { useState, useRef, useCallback, useEffect } from 'react';

export function useInlineEdit(
  originalValue: string,
  onSave: (value: string) => void,
) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(originalValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, []);

  const startEditing = () => {
    setEditValue(originalValue);
    setEditing(true);
  };

  const commitEdit = () => {
    setEditing(false);
    if (editValue !== originalValue) {
      onSave(editValue);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditValue(originalValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      commitEdit();
    }
    if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
      autoResize();
    }
  }, [editing, autoResize]);

  return {
    editing,
    editValue,
    setEditValue,
    textareaRef,
    startEditing,
    commitEdit,
    cancelEdit,
    handleKeyDown,
    autoResize,
  };
}
