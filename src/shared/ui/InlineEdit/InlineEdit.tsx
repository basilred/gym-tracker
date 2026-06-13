import { cn } from '@bem-react/classname';
import type { useInlineEdit } from '@/shared/hooks/useInlineEdit';

const edit = cn('InlineEdit');

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface InlineEditProps {
  hook: ReturnType<typeof useInlineEdit>;
  value: string;
  as?: HeadingTag;
}

export default function InlineEdit({
  hook: {
    editing,
    editValue,
    setEditValue,
    textareaRef,
    startEditing,
    commitEdit,
    handleKeyDown,
    autoResize,
  },
  value,
  as: Heading = 'h2',
}: InlineEditProps) {
  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    startEditing();
  };

  if (editing) {
    return (
      <textarea
        ref={textareaRef}
        className={edit('EditInput')}
        value={editValue}
        onChange={(e) => { setEditValue(e.target.value); autoResize(); }}
        onKeyDown={handleKeyDown}
        onBlur={commitEdit}
        rows={1}
      />
    );
  }

  return (
    <Heading className={edit('Title')}>
      <button
        className={edit('EditTrigger')}
        onClick={handleTriggerClick}
      >
        {value}
      </button>
    </Heading>
  );
}
