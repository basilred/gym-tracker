import { cn } from '@bem-react/classname';
import { SubscriptionStats } from '@/widgets/subscription-stats';
import { VisitTimeline } from '@/widgets/visit-timeline';
import { MarkVisitButton } from '@/features/mark-visit';
import { useSubscriptions } from '@/entities/subscription';
import { calcProgress } from '@/entities/subscription';
import { useInlineEdit } from '@/shared/hooks/useInlineEdit';

const detail = cn('SubscriptionDetail');

interface SubscriptionDetailProps {
  subId: string;
}

export default function SubscriptionDetail({ subId }: SubscriptionDetailProps) {
  const { getSubscription, removeVisit, editVisit, updateSubscription } = useSubscriptions();
  const sub = getSubscription(subId);

  const {
    editing,
    editValue,
    setEditValue,
    textareaRef,
    startEditing,
    commitEdit,
    handleKeyDown,
    autoResize,
  } = useInlineEdit(sub?.name ?? '', (name) => {
    if (sub) {
      updateSubscription(sub.id, { name });
    }
  });

  const remaining = sub ? sub.totalSessions - sub.visits.length : 0;
  const progress = sub ? calcProgress(sub.visits.length, sub.totalSessions) : 0;

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      startEditing();
    }
  };

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

      <SubscriptionStats subscription={sub} />
    </div>
  );
}
