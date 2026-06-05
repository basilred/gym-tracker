import { cn } from '@bem-react/classname';
import { useState, useRef, useEffect, useCallback } from 'react';
import { VisitTimeline } from '../../visit-timeline';
import { MarkVisitButton } from '../../../features/mark-visit';
import type { Subscription } from '../../../entities/subscription/types';
import { calcProgress } from '../../../entities/subscription/lib/calcProgress';

const detail = cn('SubscriptionDetail');

interface SubscriptionDetailProps {
  sub: Subscription;
  onAddVisit: (id: string) => void;
  onDeleteVisit: (subId: string, visitId: string) => void;
  onEditVisit: (subId: string, visitId: string, newDate: string) => void;
  onUpdate: (id: string, updates: Partial<Pick<Subscription, 'name'>>) => void;
}

export default function SubscriptionDetail({ sub, onAddVisit, onDeleteVisit, onEditVisit, onUpdate }: SubscriptionDetailProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(sub.name);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const remaining = sub.totalSessions - sub.visits.length;
  const progress = calcProgress(sub.visits.length, sub.totalSessions);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, []);

  const startEditing = () => {
    setEditValue(sub.name);
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
    if (editValue !== sub.name) {
      onUpdate(sub.id, { name: editValue });
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditValue(sub.name);
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

      <MarkVisitButton subId={sub.id} remaining={remaining} onAddVisit={onAddVisit} />

      <VisitTimeline
        visits={sub.visits}
        onDeleteVisit={(visitId: string) => onDeleteVisit(sub.id, visitId)}
        onEditVisit={(visitId: string, newDate: string) => onEditVisit(sub.id, visitId, newDate)}
        startDate={sub.startDate}
      />
    </div>
  );
}
