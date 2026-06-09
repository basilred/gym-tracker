import { cn } from '@bem-react/classname';
import { useState, useRef, useEffect, useCallback } from 'react';
import { VisitTimeline } from '@/widgets/visit-timeline';
import { MarkVisitButton } from '@/features/mark-visit';
import { useSubscriptions } from '@/entities/subscription';
import { calcProgress } from '@/entities/subscription';

const detail = cn('SubscriptionDetail');

interface SubscriptionDetailProps {
  subId: string;
}

export default function SubscriptionDetail({ subId }: SubscriptionDetailProps) {
  const { getSubscription, removeVisit, editVisit, updateSubscription } = useSubscriptions();
  const sub = getSubscription(subId);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(sub?.name ?? '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const remaining = sub ? sub.totalSessions - sub.visits.length : 0;
  const progress = sub ? calcProgress(sub.visits.length, sub.totalSessions) : 0;

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, []);

  const startEditing = () => {
    setEditValue(sub?.name ?? '');
    setEditing(true);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      startEditing();
    }
  };

  const commitEdit = () => {
    setEditing(false);
    if (sub && editValue !== sub.name) {
      updateSubscription(sub.id, { name: editValue });
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditValue(sub?.name ?? '');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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

  if (!sub) {
    return null;
  }

  return (
    <div className={detail()}>
      {editing ? (
        <textarea
          ref={textareaRef}
          className={detail('EditInput')}
          value={editValue}
          onChange={(e) => { setEditValue(e.target.value); autoResize(); }}
          onKeyDown={handleKeyDown}
          onBlur={commitEdit}
          rows={1}
        />
      ) : (
        <h2 className={detail('Title')}>
          <span className={detail('TitleEditTrigger')} onClick={startEditing} onKeyDown={handleTitleKeyDown} role="button" tabIndex={0}>
            {sub.name}
          </span>
        </h2>
      )}
      <p className={detail('Date')}>
        Начало: {new Date(sub.startDate).toLocaleDateString()}
      </p>
      <p className={detail('Remaining')}>
        Осталось {remaining} из {sub.totalSessions} занятий
      </p>

      <div className={detail('ProgressBar')}>
        <div
          className={detail('ProgressFill')}
          style={{ '--progress': `${progress}%` } as React.CSSProperties}
        />
      </div>

      <MarkVisitButton subId={sub.id} />

      <VisitTimeline
        visits={sub.visits}
        onDeleteVisit={(visitId: string) => removeVisit(sub.id, visitId)}
        onEditVisit={(visitId: string, newDate: string) => editVisit(sub.id, visitId, newDate)}
        startDate={sub.startDate}
      />
    </div>
  );
}
